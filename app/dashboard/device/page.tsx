"use client";

import { useEffect, useId, useState } from "react";
import { Wifi, RefreshCw, Cpu, Eye, EyeOff } from "lucide-react";
import { DeviceAPI } from "@/lib/be";
import { ApiError } from "@/lib/api";
import { useQuery, useMutation } from "@/lib/useQuery";
import { formatDateTime, tApiError, useI18n, type TKey } from "@/lib/i18n";
import {
  Button,
  Card,
  Badge,
  Modal,
  Input,
  Alert,
  ErrorState,
  Skeleton,
  useToast,
} from "@/components/ui";

const POLL_MS = 15_000;
/** How often the "updated Xs ago" caption re-renders. */
const FRESHNESS_TICK_MS = 5_000;

function signalBars(dbm: number) {
  if (dbm >= -50) return 4;
  if (dbm >= -60) return 3;
  if (dbm >= -70) return 2;
  return 1;
}

/** Plain-language quality word so dBm is never the only signal cue. */
function signalQualityKey(dbm: number): TKey {
  if (dbm >= -60) return "signalStrong";
  if (dbm >= -70) return "signalFair";
  return "signalWeak";
}

/** Known component names from the BE, mapped to translated labels. */
const COMPONENT_KEYS: Record<string, TKey> = {
  microphone: "microphone",
  speaker: "speaker",
  temp_sensor: "temp_sensor",
  camera: "camera",
  led: "led",
};

/**
 * Map Wi-Fi change failures to localized messages, including the two
 * validation codes the BE can return. Never renders raw err.message.
 */
function wifiErrorMessage(err: unknown, t: (key: TKey) => string): string {
  if (err instanceof ApiError) {
    if (err.message === "weak_wifi_password") return t("wifiPasswordTooShort");
    if (err.message === "ssid_required") return t("wifiSsidRequired");
  }
  return tApiError(err, t);
}

function DeviceSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="grid gap-5 sm:grid-cols-2">
        {[0, 1].map((i) => (
          <Card key={i}>
            <Skeleton className="mb-4 h-6 w-40" />
            <Skeleton className="mb-3 h-5 w-full" />
            <Skeleton className="h-5 w-full" />
          </Card>
        ))}
      </div>
      <Skeleton className="mb-4 mt-8 h-6 w-48" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4].map((i) => (
          <Card key={i} className="py-3">
            <Skeleton className="h-7 w-full" />
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function DevicePage() {
  const { t, lang } = useI18n();
  const { toast } = useToast();

  const {
    data: device,
    error,
    loading,
    refreshing,
    refetch,
  } = useQuery(() => DeviceAPI.info(), [], { pollMs: POLL_MS });

  // Freshness caption: remember when data last arrived and tick a clock so
  // "updated Xs ago" stays honest even when polls fail or the tab was hidden.
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (device !== undefined) {
      const ts = Date.now();
      setLastUpdatedAt(ts);
      setNow(ts);
    }
  }, [device]);
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), FRESHNESS_TICK_MS);
    return () => clearInterval(timer);
  }, []);

  let freshness: string | null = null;
  if (lastUpdatedAt !== null) {
    const seconds = Math.max(0, Math.round((now - lastUpdatedAt) / 1000));
    if (seconds < 15) {
      freshness = t("updatedJustNow");
    } else if (seconds < 60) {
      freshness = t("updatedSecondsAgo").replace("{seconds}", String(seconds));
    } else {
      freshness = t("updatedAtTime").replace(
        "{time}",
        formatDateTime(new Date(lastUpdatedAt).toISOString(), lang)
      );
    }
  }

  // Wi-Fi modal state — reset on every open, never carried across sessions.
  const [wifiOpen, setWifiOpen] = useState(false);
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [ssidError, setSsidError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const passwordId = useId();
  const passwordErrorId = `${passwordId}-error`;
  const passwordHintId = `${passwordId}-hint`;

  const wifiMutation = useMutation(
    (args: { ssid: string; password: string }) =>
      DeviceAPI.setWifi(args.ssid, args.password)
  );

  const openWifi = () => {
    setSsid("");
    setPassword("");
    setShowPassword(false);
    setSsidError("");
    setPasswordError("");
    wifiMutation.reset();
    setWifiOpen(true);
  };

  const closeWifi = () => {
    if (!wifiMutation.busy) setWifiOpen(false);
  };

  const submitWifi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (wifiMutation.busy) return;
    // Inline, localized validation. Password is optional (open networks);
    // when set it must satisfy the WPA2 minimum of 8 characters.
    const trimmedSsid = ssid.trim();
    const ssidInvalid = !trimmedSsid;
    const passwordInvalid = password.length > 0 && password.length < 8;
    setSsidError(ssidInvalid ? t("wifiSsidRequired") : "");
    setPasswordError(passwordInvalid ? t("wifiPasswordTooShort") : "");
    if (ssidInvalid || passwordInvalid) return;

    const res = await wifiMutation.mutate({ ssid: trimmedSsid, password });
    if (res) {
      setWifiOpen(false);
      toast(t("wifiUpdated"), "success");
      void refetch();
    }
  };

  const bars = device ? signalBars(device.wifi.signalStrength) : 0;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink">
            {t("deviceTitle")}
          </h2>
          {/* squiggle flourish under the page title (decorative) */}
          <svg
            aria-hidden="true"
            focusable="false"
            viewBox="0 0 160 14"
            fill="none"
            className="mt-1.5 w-28 text-leaf"
          >
            <path
              d="M3 10 Q 13 3 23 10 T 43 10 T 63 10 T 83 10 T 103 10 T 123 10 T 143 10 T 157 10"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </svg>
          <p className="mt-2 text-base text-slate-600">{t("deviceDesc")}</p>
          {freshness && (
            <p className="mt-2 inline-flex items-center gap-2 rounded-full border-2 border-slate-300 bg-white px-3.5 py-1 text-base text-slate-600">
              <span
                aria-hidden="true"
                className="h-2.5 w-2.5 shrink-0 rounded-full border border-ink bg-leaf"
              />
              {freshness}
            </p>
          )}
        </div>
        <Button
          variant="secondary"
          onClick={() => void refetch()}
          loading={loading || refreshing}
        >
          <RefreshCw size={18} aria-hidden="true" /> {t("refresh")}
        </Button>
      </div>

      {error != null && device !== undefined && (
        <div className="mb-4">
          <Alert kind="error">{t("refreshFailed")}</Alert>
        </div>
      )}

      {loading ? (
        <DeviceSkeleton />
      ) : device === undefined ? (
        <ErrorState
          message={tApiError(error, t)}
          onRetry={() => void refetch()}
        />
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <Card className="relative">
              {/* rotated confetti chip on the card edge (decorative) */}
              <span
                aria-hidden="true"
                className="absolute -top-3 right-5 hidden h-6 w-6 rotate-12 rounded-md border-2 border-ink bg-gold sm:block"
              />
              <div className="mb-4 flex items-center gap-2.5 font-display text-lg font-extrabold text-ink">
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-ink bg-sen shadow-pop-sm"
                >
                  <Cpu
                    size={20}
                    strokeWidth={2.5}
                    className="text-white"
                    aria-hidden="true"
                  />
                </span>{" "}
                {t("model")}
              </div>
              <dl className="space-y-2 text-base">
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-600">{t("model")}</dt>
                  <dd className="font-semibold text-ink">{device.model}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-600">{t("firmware")}</dt>
                  <dd className="font-semibold text-ink">
                    v{device.firmwareVersion}
                  </dd>
                </div>
              </dl>
            </Card>

            <Card>
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 font-display text-lg font-extrabold text-ink">
                  <span
                    aria-hidden="true"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-leaf shadow-pop-sm"
                  >
                    <Wifi
                      size={20}
                      strokeWidth={2.5}
                      className="text-ink"
                      aria-hidden="true"
                    />
                  </span>{" "}
                  {t("wifiNetwork")}
                </div>
                <Button variant="secondary" onClick={openWifi}>
                  {t("changeWifi")}
                </Button>
              </div>
              <dl className="space-y-2 text-base">
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-600">{t("wifiName")}</dt>
                  <dd className="font-semibold text-ink">
                    {device.wifi.ssid}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-600">{t("signal")}</dt>
                  <dd className="flex items-center gap-2 font-semibold text-ink">
                    <span
                      className="flex items-end gap-0.5"
                      aria-hidden="true"
                    >
                      {[1, 2, 3, 4].map((b) => (
                        <span
                          key={b}
                          className={
                            "w-1.5 rounded-sm border " +
                            (b <= bars
                              ? "border-ink bg-leaf"
                              : "border-slate-300 bg-slate-100")
                          }
                          style={{ height: 5 + b * 3 }}
                        />
                      ))}
                    </span>
                    {t(signalQualityKey(device.wifi.signalStrength))}
                    <span className="font-normal text-slate-600">
                      ({device.wifi.signalStrength} dBm)
                    </span>
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-600">{t("ipAddress")}</dt>
                  <dd className="font-semibold text-ink">
                    {device.wifi.ip}
                  </dd>
                </div>
              </dl>
            </Card>
          </div>

          <h3 className="mb-4 mt-8 flex items-center gap-2.5 font-display text-xl font-extrabold text-ink">
            <span
              aria-hidden="true"
              className="inline-block h-4 w-4 shrink-0 rotate-12 rounded-[4px] border-2 border-ink bg-gold"
            />
            {t("componentHealth")}
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {device.components.map((c) => (
              <div
                key={c.name}
                className={
                  "flex items-center justify-between gap-3 rounded-2xl border-2 border-ink px-5 py-3.5 shadow-sticker " +
                  (c.status === "online"
                    ? "bg-leaf-light"
                    : c.status === "offline"
                      ? "bg-slate-100"
                      : "bg-red-50")
                }
              >
                <span className="text-base font-bold text-ink">
                  {COMPONENT_KEYS[c.name] ? t(COMPONENT_KEYS[c.name]) : c.name}
                </span>
                {c.status === "online" ? (
                  <Badge color="green">{t("online")}</Badge>
                ) : c.status === "offline" ? (
                  <Badge color="gray">{t("offline")}</Badge>
                ) : (
                  <Badge color="red">{t("compError")}</Badge>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      <Modal
        open={wifiOpen}
        onClose={closeWifi}
        title={t("changeWifi")}
        dismissible={!wifiMutation.busy && !ssid && !password}
      >
        <form onSubmit={submitWifi} noValidate className="space-y-5">
          {wifiMutation.error != null && (
            <Alert>{wifiErrorMessage(wifiMutation.error, t)}</Alert>
          )}
          <Input
            label={t("wifiName")}
            value={ssid}
            onChange={(e) => {
              setSsid(e.target.value);
              if (ssidError) setSsidError("");
            }}
            error={ssidError || undefined}
            aria-required="true"
            autoComplete="off"
          />
          <div>
            <label
              htmlFor={passwordId}
              className="mb-1.5 block text-base font-bold text-ink"
            >
              {t("wifiPassword")}
            </label>
            <div className="relative">
              <input
                id={passwordId}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError("");
                }}
                aria-invalid={passwordError ? true : undefined}
                aria-describedby={
                  passwordError ? passwordErrorId : passwordHintId
                }
                autoComplete="off"
                className={
                  "w-full rounded-xl border-2 bg-white py-2.5 pl-3.5 pr-14 text-base outline-none transition-[border-color,box-shadow] focus:border-sen focus:shadow-pop-focus " +
                  (passwordError ? "border-red-500" : "border-slate-300")
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={
                  showPassword ? t("hidePassword") : t("showPassword")
                }
                aria-pressed={showPassword}
                className="absolute right-1.5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-gold-light hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sen"
              >
                {showPassword ? (
                  <EyeOff size={22} aria-hidden="true" />
                ) : (
                  <Eye size={22} aria-hidden="true" />
                )}
              </button>
            </div>
            {passwordError ? (
              <p id={passwordErrorId} className="mt-1.5 text-sm text-red-600">
                {passwordError}
              </p>
            ) : (
              <p id={passwordHintId} className="mt-1.5 text-sm text-slate-600">
                {t("wifiPasswordHint")}
              </p>
            )}
          </div>
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={closeWifi}
              disabled={wifiMutation.busy}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" loading={wifiMutation.busy}>
              {t("save")}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
