"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Mic, Square, RotateCcw, Send, Shuffle } from "lucide-react";
import { VoiceAPI } from "@/lib/be";
import { useI18n } from "@/lib/i18n";
import type { VoicePrompt, VoiceSample } from "@/lib/types";
import { Button, Card, Badge, Alert, Spinner } from "@/components/ui";

type RecState = "idle" | "recording" | "recorded";

export default function VoiceTrainingPage() {
  const { t, lang } = useI18n();
  const [prompts, setPrompts] = useState<VoicePrompt[] | null>(null);
  const [promptIdx, setPromptIdx] = useState(0);
  const [recState, setRecState] = useState<RecState>("idle");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [micError, setMicError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);
  const [samples, setSamples] = useState<VoiceSample[] | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const blobRef = useRef<Blob | null>(null);

  const loadSamples = useCallback(() => {
    VoiceAPI.samples()
      .then(setSamples)
      .catch(() => setSamples([]));
  }, []);

  useEffect(() => {
    VoiceAPI.prompts()
      .then(setPrompts)
      .catch(() => setPrompts([]));
    loadSamples();
  }, [loadSamples]);

  // Poll sample statuses while any is pending
  useEffect(() => {
    if (!samples?.some((s) => s.status === "pending")) return;
    const id = setInterval(loadSamples, 5000);
    return () => clearInterval(id);
  }, [samples, loadSamples]);

  useEffect(() => {
    return () => {
      recorderRef.current?.stream.getTracks().forEach((tr) => tr.stop());
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const prompt = prompts?.[promptIdx];

  const startRecording = async () => {
    setMicError(false);
    setSuccess(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        blobRef.current = blob;
        setAudioUrl((old) => {
          if (old) URL.revokeObjectURL(old);
          return URL.createObjectURL(blob);
        });
        stream.getTracks().forEach((tr) => tr.stop());
        setRecState("recorded");
      };
      recorderRef.current = recorder;
      recorder.start();
      setRecState("recording");
    } catch {
      setMicError(true);
    }
  };

  const stopRecording = () => recorderRef.current?.stop();

  const reset = () => {
    setRecState("idle");
    blobRef.current = null;
    setAudioUrl((old) => {
      if (old) URL.revokeObjectURL(old);
      return null;
    });
  };

  const nextPrompt = () => {
    if (!prompts?.length) return;
    setPromptIdx((i) => (i + 1) % prompts.length);
    reset();
    setSuccess(false);
  };

  const submit = async () => {
    if (!prompt || !blobRef.current) return;
    setBusy(true);
    try {
      await VoiceAPI.submitSample(prompt.id, blobRef.current);
      setSuccess(true);
      reset();
      loadSamples();
    } finally {
      setBusy(false);
    }
  };

  if (!prompts) return <Spinner />;

  const statusBadge = (s: VoiceSample["status"]) =>
    s === "processed" ? (
      <Badge color="green">{t("statusProcessed")}</Badge>
    ) : s === "pending" ? (
      <Badge color="yellow">{t("statusPending")}</Badge>
    ) : (
      <Badge color="red">{t("statusFailed")}</Badge>
    );

  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-900">{t("voiceTitle")}</h2>
      <p className="mb-5 mt-1 text-sm text-slate-500">{t("voiceDesc")}</p>

      <Card className="mb-6">
        {micError && (
          <div className="mb-4">
            <Alert>{t("micDenied")}</Alert>
          </div>
        )}
        {success && (
          <div className="mb-4">
            <Alert kind="success">{t("submitted")}</Alert>
          </div>
        )}

        <p className="text-sm text-slate-500">{t("readAloud")}</p>
        <p className="my-3 rounded-2xl bg-lotus-light px-4 py-3 text-lg font-semibold text-sen-dark">
          “{prompt ? (lang === "vi" ? prompt.text_vi : prompt.text_en) : ""}”
        </p>

        <div className="flex flex-wrap items-center gap-3">
          {recState === "idle" && (
            <>
              <Button onClick={startRecording}>
                <Mic size={16} /> {t("record")}
              </Button>
              <Button variant="ghost" onClick={nextPrompt}>
                <Shuffle size={16} /> {t("nextPrompt")}
              </Button>
            </>
          )}
          {recState === "recording" && (
            <>
              <Button variant="danger" onClick={stopRecording}>
                <Square size={16} /> {t("stop")}
              </Button>
              <span className="flex items-center gap-2 text-sm text-red-600">
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-600" />
                {t("recording")}
              </span>
            </>
          )}
          {recState === "recorded" && (
            <>
              {audioUrl && <audio controls src={audioUrl} className="h-10" />}
              <Button variant="secondary" onClick={reset}>
                <RotateCcw size={16} /> {t("reRecord")}
              </Button>
              <Button onClick={submit} disabled={busy}>
                <Send size={16} /> {busy ? t("submitting") : t("submit")}
              </Button>
            </>
          )}
        </div>
      </Card>

      <h3 className="mb-3 font-medium text-slate-900">{t("sampleHistory")}</h3>
      {!samples ? (
        <Spinner />
      ) : samples.length === 0 ? (
        <p className="text-sm text-slate-500">{t("noSamples")}</p>
      ) : (
        <div className="space-y-2">
          {samples.map((s) => {
            const p = prompts.find((pp) => pp.id === s.promptId);
            return (
              <Card key={s.id} className="flex items-center justify-between py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-800">
                    {p ? (lang === "vi" ? p.text_vi : p.text_en) : s.promptId}
                  </p>
                  <p className="text-xs text-slate-400">
                    {new Date(s.createdAt).toLocaleString()}
                  </p>
                </div>
                {statusBadge(s.status)}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
