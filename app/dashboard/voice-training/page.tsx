"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Mic, RotateCcw, Send, Square } from "lucide-react";
import { VoiceAPI } from "@/lib/be";
import { formatDateTime, tApiError, useI18n, type Lang } from "@/lib/i18n";
import { useMutation, useQuery } from "@/lib/useQuery";
import type { VoiceSample } from "@/lib/types";
import {
  Alert,
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorState,
  Skeleton,
  useToast,
} from "@/components/ui";

/** Recorder lifecycle. "requesting" = getUserMedia permission pending. */
type RecStatus = "idle" | "requesting" | "recording" | "recorded";
type MicError = "denied" | "notFound" | "generic";
type Notice = "tooShort" | "maxReached";
type MicSupport = { ok: true } | { ok: false; reason: "insecure" | "unsupported" };

const MIN_DURATION_MS = 1000;
const MAX_DURATION_S = 60;
const SAMPLES_POLL_MS = 5000;

/** Stable ids so focus can follow the active control when buttons swap. */
const RECORD_BTN_ID = "voice-record-button";
const STOP_BTN_ID = "voice-stop-button";
const RERECORD_BTN_ID = "voice-rerecord-button";

function formatSeconds(total: number): string {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/** Upload filename extension derived from the recorder's actual mime type. */
function extFromMime(mime: string): string {
  const subtype = (mime.split("/")[1] ?? "").split(";")[0].toLowerCase();
  if (subtype.includes("mp4")) return "m4a";
  if (subtype.includes("mpeg") || subtype.includes("mp3")) return "mp3";
  if (subtype.includes("ogg")) return "ogg";
  if (subtype.includes("wav")) return "wav";
  return "webm";
}

export default function VoiceTrainingPage() {
  const { t, lang } = useI18n();
  const { toast } = useToast();

  /* ---------------------------------------------------------------- */
  /* Data                                                              */
  /* ---------------------------------------------------------------- */

  const promptsQ = useQuery(() => VoiceAPI.prompts(), []);
  const prompts = promptsQ.data;

  // Poll while any sample is pending; useQuery keeps the last good history
  // and keeps polling across failed polls, and pauses while the tab is hidden.
  const [samplesPollMs, setSamplesPollMs] = useState<number | undefined>(undefined);
  const samplesQ = useQuery(() => VoiceAPI.samples(), [], { pollMs: samplesPollMs });
  const samples = samplesQ.data;
  const hasPending = !!samples?.some((s) => s.status === "pending");
  useEffect(() => {
    setSamplesPollMs(hasPending ? SAMPLES_POLL_MS : undefined);
  }, [hasPending]);

  const [promptIdx, setPromptIdx] = useState(0);
  const promptCount = prompts?.length ?? 0;
  const idx = promptCount > 0 ? promptIdx % promptCount : 0;
  const prompt = promptCount > 0 ? prompts?.[idx] : undefined;

  /* ---------------------------------------------------------------- */
  /* Recorder state machine                                            */
  /* ---------------------------------------------------------------- */

  const [support, setSupport] = useState<MicSupport | null>(null);
  const [recStatus, setRecStatus] = useState<RecStatus>("idle");
  const [micError, setMicError] = useState<MicError | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  /** Screen-reader announcements for recording lifecycle changes. */
  const [liveMsg, setLiveMsg] = useState("");

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const blobRef = useRef<Blob | null>(null);
  /** Which language variant of the prompt was on screen when recording began. */
  const recordedLangRef = useRef<Lang>(lang);
  /** Mirrors audioUrl so the unmount cleanup never sees a stale closure. */
  const audioUrlRef = useRef<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAtRef = useRef(0);
  const stopReasonRef = useRef<"user" | "max">("user");
  /** Set when a recording in progress should be thrown away on stop. */
  const discardNextRef = useRef(false);
  /**
   * Bumped whenever the active recording changes identity (committed or
   * cleared). Async work (submit, pending getUserMedia) captures the value
   * and bails if it changed — so it never clobbers a newer recording.
   */
  const recGenRef = useRef(0);
  const disposedRef = useRef(false);
  const prevStatusRef = useRef<RecStatus | null>(null);
  const recorderCardRef = useRef<HTMLDivElement | null>(null);

  // Feature detection runs client-side only (avoids hydration mismatch).
  useEffect(() => {
    const hasApi =
      typeof navigator !== "undefined" &&
      !!navigator.mediaDevices?.getUserMedia &&
      typeof window.MediaRecorder !== "undefined";
    if (hasApi) setSupport({ ok: true });
    else setSupport({ ok: false, reason: window.isSecureContext ? "unsupported" : "insecure" });
  }, []);

  // Release everything on unmount: object URL (via ref, not a stale closure),
  // the recorder and any still-live microphone stream, and the tick timer.
  useEffect(() => {
    disposedRef.current = false;
    return () => {
      disposedRef.current = true;
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      const rec = recorderRef.current;
      if (rec && rec.state !== "inactive") {
        try {
          rec.stop();
        } catch {
          // already stopped
        }
      }
      streamRef.current?.getTracks().forEach((tr) => tr.stop());
      streamRef.current = null;
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
        audioUrlRef.current = null;
      }
    };
  }, []);

  // Keep keyboard focus on the successor control when buttons swap.
  useEffect(() => {
    const prev = prevStatusRef.current;
    prevStatusRef.current = recStatus;
    if (prev === null || prev === recStatus) return;
    const focusId =
      recStatus === "recording"
        ? STOP_BTN_ID
        : recStatus === "recorded"
          ? RERECORD_BTN_ID
          : recStatus === "idle" && (prev === "recording" || prev === "recorded")
            ? RECORD_BTN_ID
            : null;
    if (focusId) document.getElementById(focusId)?.focus();
  }, [recStatus]);

  const replaceAudioUrl = (url: string | null) => {
    if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
    audioUrlRef.current = url;
    setAudioUrl(url);
  };

  const clearTick = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  /** Discard any recording (live or finished) and return to idle. */
  const clearRecording = () => {
    const rec = recorderRef.current;
    if (rec && rec.state !== "inactive") {
      discardNextRef.current = true;
      try {
        rec.stop();
      } catch {
        // already stopped
      }
    }
    clearTick();
    blobRef.current = null;
    recGenRef.current++;
    replaceAudioUrl(null);
    setElapsed(0);
    setRecStatus("idle");
  };

  const stopRecording = (reason: "user" | "max") => {
    const rec = recorderRef.current;
    if (!rec || rec.state === "inactive") return;
    stopReasonRef.current = reason;
    clearTick();
    try {
      rec.stop();
    } catch {
      // already stopped
    }
  };

  const startRecording = async () => {
    if (!prompt || support?.ok !== true) return;
    if (recStatus === "requesting" || recStatus === "recording") return;
    setMicError(null);
    setNotice(null);
    submitMutation.reset();
    const gen = recGenRef.current;
    setRecStatus("requesting");
    setLiveMsg(t("micRequesting"));

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
      if (disposedRef.current) return;
      setRecStatus("idle");
      const name = err instanceof DOMException ? err.name : "";
      setMicError(
        name === "NotAllowedError" || name === "SecurityError"
          ? "denied"
          : name === "NotFoundError" || name === "OverconstrainedError"
            ? "notFound"
            : "generic"
      );
      return;
    }
    // Unmounted or superseded (e.g. a history retry) while permission was
    // pending — release the microphone immediately.
    if (disposedRef.current || gen !== recGenRef.current) {
      stream.getTracks().forEach((tr) => tr.stop());
      return;
    }

    let recorder: MediaRecorder;
    try {
      recorder = new MediaRecorder(stream);
    } catch {
      // Stream was granted but the recorder could not be created — never
      // leave the microphone live behind an idle UI.
      stream.getTracks().forEach((tr) => tr.stop());
      setRecStatus("idle");
      setMicError("generic");
      return;
    }

    chunksRef.current = [];
    startedAtRef.current = Date.now();
    stopReasonRef.current = "user";
    discardNextRef.current = false;
    recordedLangRef.current = lang;
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    recorder.onstop = () => {
      stream.getTracks().forEach((tr) => tr.stop());
      streamRef.current = null;
      clearTick();
      if (disposedRef.current) return;
      if (discardNextRef.current) {
        discardNextRef.current = false;
        chunksRef.current = [];
        return;
      }
      const durationMs = Date.now() - startedAtRef.current;
      if (durationMs < MIN_DURATION_MS) {
        // Too short to be a usable sample — gently ask for another take.
        chunksRef.current = [];
        blobRef.current = null;
        setElapsed(0);
        setRecStatus("idle");
        setNotice("tooShort");
        setLiveMsg(t("recordingStopped"));
        return;
      }
      const blob = new Blob(chunksRef.current, {
        type: recorder.mimeType || "audio/webm",
      });
      chunksRef.current = [];
      blobRef.current = blob;
      recGenRef.current++;
      replaceAudioUrl(URL.createObjectURL(blob));
      setRecStatus("recorded");
      setNotice(stopReasonRef.current === "max" ? "maxReached" : null);
      setLiveMsg(t("recordingStopped"));
    };

    recorderRef.current = recorder;
    streamRef.current = stream;
    try {
      recorder.start();
    } catch {
      stream.getTracks().forEach((tr) => tr.stop());
      streamRef.current = null;
      setRecStatus("idle");
      setMicError("generic");
      return;
    }
    setElapsed(0);
    setRecStatus("recording");
    setLiveMsg(t("recording"));
    timerRef.current = setInterval(() => {
      const secs = Math.floor((Date.now() - startedAtRef.current) / 1000);
      setElapsed(Math.min(secs, MAX_DURATION_S));
      if (secs >= MAX_DURATION_S) stopRecording("max");
    }, 250);
  };

  /* ---------------------------------------------------------------- */
  /* Submit                                                            */
  /* ---------------------------------------------------------------- */

  const submitMutation = useMutation(
    async (args: { promptId: string; blob: Blob; lang: Lang; filename: string }) => {
      try {
        return await VoiceAPI.submitSample(args.promptId, args.blob, args.lang, args.filename);
      } catch (err) {
        toast(tApiError(err, t), "error");
        throw err; // let useMutation capture it for the inline alert
      }
    }
  );

  const handleSubmit = async () => {
    const blob = blobRef.current;
    if (!prompt || !blob || recStatus !== "recorded") return;
    // Capture everything up front: if the user re-records while the upload
    // is in flight, we must not clear their newer take afterwards.
    const gen = recGenRef.current;
    const res = await submitMutation.mutate({
      promptId: prompt.id,
      blob,
      lang: recordedLangRef.current,
      filename: `sample.${extFromMime(blob.type)}`,
    });
    if (!res) return; // failed — recording preserved so the user can retry
    toast(t("submitted"), "success");
    void samplesQ.refetch();
    if (!disposedRef.current && gen === recGenRef.current) {
      clearRecording();
      goToNextPrompt();
    }
  };

  /* ---------------------------------------------------------------- */
  /* Prompt navigation & retry                                         */
  /* ---------------------------------------------------------------- */

  // Sequential rotation through the prompt bank (icon is now ArrowRight to
  // match — the previous Shuffle icon promised randomness it didn't deliver).
  const goToNextPrompt = () => {
    if (promptCount === 0) return;
    setPromptIdx((i) => (i + 1) % promptCount);
    setNotice(null);
    setMicError(null);
    submitMutation.reset();
  };

  const handleReRecord = () => {
    clearRecording();
    setNotice(null);
    setMicError(null);
    submitMutation.reset();
  };

  /** From a failed sample: re-activate its prompt and focus the recorder. */
  const retryFromSample = (s: VoiceSample) => {
    if (!prompts || promptCount === 0) return;
    const i = prompts.findIndex((p) => p.id === s.promptId);
    if (i >= 0) setPromptIdx(i);
    clearRecording();
    setNotice(null);
    setMicError(null);
    submitMutation.reset();
    recorderCardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    // If the Record button is already mounted focus it now; otherwise the
    // recStatus effect focuses it right after the state transition renders.
    document.getElementById(RECORD_BTN_ID)?.focus({ preventScroll: true });
  };

  /* ---------------------------------------------------------------- */
  /* Render helpers                                                    */
  /* ---------------------------------------------------------------- */

  const statusBadge = (s: VoiceSample["status"]) =>
    s === "processed" ? (
      <Badge color="green">{t("statusProcessed")}</Badge>
    ) : s === "pending" ? (
      <Badge color="yellow">{t("statusPending")}</Badge>
    ) : (
      <Badge color="red">{t("statusFailed")}</Badge>
    );

  const failureText = (reason?: string | null) =>
    reason === "audio_unclear" ? t("reasonAudioUnclear") : t("reasonUnknown");

  const micErrorText =
    micError === "denied"
      ? `${t("micDenied")} ${t("micDeniedHelp")}`
      : micError === "notFound"
        ? t("micNotFound")
        : t("micStartError");

  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-900">{t("voiceTitle")}</h2>
      <p className="mb-5 mt-1 text-base text-slate-600">{t("voiceDesc")}</p>

      {/* Recording lifecycle announcements for screen readers */}
      <div aria-live="assertive" aria-atomic="true" className="sr-only">
        {liveMsg}
      </div>

      {support && !support.ok ? (
        <Card className="mb-6">
          <Alert kind="info">
            {support.reason === "insecure" ? t("micInsecure") : t("micUnsupported")}
          </Alert>
        </Card>
      ) : promptsQ.loading ? (
        <Card className="mb-6">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="my-3 h-14 w-full rounded-2xl" />
          <Skeleton className="h-11 w-40 rounded-xl" />
        </Card>
      ) : promptsQ.error && !prompts ? (
        <ErrorState
          className="mb-6"
          message={tApiError(promptsQ.error, t)}
          onRetry={() => void promptsQ.refetch()}
        />
      ) : !prompt ? (
        <EmptyState
          className="mb-6"
          icon={<Mic size={32} />}
          title={t("noPrompts")}
        />
      ) : (
        <div ref={recorderCardRef} className="scroll-mt-6">
          <Card className="mb-6">
            {micError && (
              <div className="mb-4">
                <Alert>{micErrorText}</Alert>
              </div>
            )}
            {notice && (
              <div className="mb-4">
                <Alert kind="info">
                  {notice === "tooShort" ? t("recordingTooShort") : t("recordingMaxReached")}
                </Alert>
              </div>
            )}
            {recStatus === "recorded" && submitMutation.error != null && (
              <div className="mb-4">
                <Alert>
                  {tApiError(submitMutation.error, t)} {t("submitRetryHint")}
                </Alert>
              </div>
            )}

            <div className="flex items-baseline justify-between gap-3">
              <p className="text-base text-slate-600">{t("readAloud")}</p>
              <p className="text-base tabular-nums text-slate-600">
                {idx + 1}/{promptCount}
              </p>
            </div>
            <p className="my-3 rounded-2xl bg-lotus-light px-4 py-3 text-xl font-semibold text-sen-dark">
              “{lang === "vi" ? prompt.text_vi : prompt.text_en}”
            </p>

            <div className="flex flex-wrap items-center gap-3">
              {(recStatus === "idle" || recStatus === "requesting") && (
                <>
                  <Button
                    id={RECORD_BTN_ID}
                    onClick={() => void startRecording()}
                    loading={recStatus === "requesting"}
                    disabled={support?.ok !== true}
                  >
                    <Mic size={18} aria-hidden="true" /> {t("record")}
                  </Button>
                  {recStatus === "requesting" ? (
                    <span className="text-base text-slate-600">{t("micRequesting")}</span>
                  ) : (
                    <Button variant="ghost" onClick={goToNextPrompt}>
                      <ArrowRight size={18} aria-hidden="true" /> {t("nextPrompt")}
                    </Button>
                  )}
                </>
              )}
              {recStatus === "recording" && (
                <>
                  <Button
                    id={STOP_BTN_ID}
                    variant="danger"
                    onClick={() => stopRecording("user")}
                  >
                    <Square size={18} aria-hidden="true" /> {t("stop")}
                  </Button>
                  <span className="flex items-center gap-2 text-base font-medium text-red-600">
                    <span
                      className="h-3 w-3 animate-pulse rounded-full bg-red-600"
                      aria-hidden="true"
                    />
                    {t("recording")}{" "}
                    <span className="tabular-nums">
                      {formatSeconds(elapsed)} / {formatSeconds(MAX_DURATION_S)}
                    </span>
                  </span>
                </>
              )}
              {recStatus === "recorded" && (
                <>
                  {audioUrl && (
                    <audio
                      controls
                      src={audioUrl}
                      aria-label={t("playback")}
                      className="h-11 max-w-full"
                    />
                  )}
                  <Button
                    id={RERECORD_BTN_ID}
                    variant="secondary"
                    onClick={handleReRecord}
                    disabled={submitMutation.busy}
                  >
                    <RotateCcw size={18} aria-hidden="true" /> {t("reRecord")}
                  </Button>
                  <Button
                    onClick={() => void handleSubmit()}
                    loading={submitMutation.busy}
                    disabled={!prompt || !audioUrl}
                  >
                    <Send size={18} aria-hidden="true" /> {t("submit")}
                  </Button>
                </>
              )}
            </div>
          </Card>
        </div>
      )}

      <h3 className="mb-3 text-lg font-semibold text-slate-900">{t("sampleHistory")}</h3>
      {samplesQ.loading ? (
        <div className="space-y-2" aria-hidden="true">
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-20 w-full rounded-2xl" />
        </div>
      ) : samplesQ.error && !samples ? (
        <ErrorState
          message={tApiError(samplesQ.error, t)}
          onRetry={() => void samplesQ.refetch()}
        />
      ) : !samples || samples.length === 0 ? (
        <EmptyState title={t("noSamples")} />
      ) : (
        <>
          {samplesQ.error != null && (
            <div className="mb-3">
              <Alert kind="info">{t("historyRefreshFailed")}</Alert>
            </div>
          )}
          <div className="space-y-2">
            {samples.map((s) => {
              const p = prompts?.find((pp) => pp.id === s.promptId);
              const variant = s.lang ?? lang;
              return (
                <Card key={s.id} className="py-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base font-medium text-slate-800">
                        {p ? (variant === "vi" ? p.text_vi : p.text_en) : s.promptId}
                      </p>
                      <p className="text-base text-slate-600">
                        {formatDateTime(s.createdAt, lang)}
                      </p>
                    </div>
                    {statusBadge(s.status)}
                  </div>
                  {s.status === "failed" && (
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-lotus-light pt-3">
                      <p className="text-base text-red-700">{failureText(s.failureReason)}</p>
                      {support?.ok === true && prompts?.some((pp) => pp.id === s.promptId) && (
                        <Button variant="secondary" onClick={() => retryFromSample(s)}>
                          <Mic size={18} aria-hidden="true" /> {t("reRecordPrompt")}
                        </Button>
                      )}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
