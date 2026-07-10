"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronRight,
  Copy,
  FileSearch,
  RefreshCw,
} from "lucide-react";
import { LogsAPI } from "@/lib/be";
import { useAuth } from "@/lib/auth";
import { formatDateTime, tApiError, useI18n } from "@/lib/i18n";
import { useQuery } from "@/lib/useQuery";
import type { LogEntry } from "@/lib/types";
import {
  Alert,
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorState,
  FullPageSpinner,
  Select,
  Skeleton,
  useToast,
} from "@/components/ui";

/** The BE caps results — used to show the "narrow your filters" hint. */
const LOG_LIMIT = 50;

/** Poll cadence while the newest ("last 15 minutes") window is selected. */
const LIVE_POLL_MS = 15_000;

type TimeRange = "15m" | "1h" | "24h" | "7d" | "all";

const RANGE_MS: Record<Exclude<TimeRange, "all">, number> = {
  "15m": 15 * 60_000,
  "1h": 60 * 60_000,
  "24h": 24 * 60 * 60_000,
  "7d": 7 * 24 * 60 * 60_000,
};

/** Clipboard write with a legacy fallback; resolves to success. */
async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to the legacy path
  }
  try {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  } catch {
    return false;
  }
}

function PayloadPane({ label, value }: { label: string; value: unknown }) {
  const { t } = useI18n();
  const { toast } = useToast();
  const text = JSON.stringify(value, null, 2) ?? String(value);

  const handleCopy = async () => {
    const ok = await copyText(text);
    if (ok) toast(t("copied"), "success");
    else toast(t("logsCopyFailed"), "error");
  };

  return (
    <div className="min-w-0">
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <p className="font-display text-sm font-extrabold uppercase tracking-widest text-slate-600">
          {label}
        </p>
        <button
          type="button"
          onClick={() => void handleCopy()}
          aria-label={`${t("copy")}: ${label}`}
          className="flex h-11 shrink-0 items-center gap-1.5 rounded-full border-2 border-ink bg-white px-4 text-sm font-bold text-ink transition-colors hover:bg-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sen"
        >
          <Copy size={18} aria-hidden="true" />
          {t("copy")}
        </button>
      </div>
      {/* payload viewer: monospace, dark-on-light "paper" panel */}
      <pre className="max-h-64 overflow-auto rounded-xl border-2 border-slate-300 bg-slate-50 p-3 text-sm leading-relaxed text-ink">
        {text}
      </pre>
    </div>
  );
}

export default function LogsPage() {
  const { t, lang } = useI18n();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [direction, setDirection] = useState<"" | "in" | "out">("");
  const [status, setStatus] = useState("");
  const [timeRange, setTimeRange] = useState<TimeRange>("all");
  const [open, setOpen] = useState<string | null>(null);

  const enabled = !!user && user.role === "developer";
  const live = timeRange === "15m";

  useEffect(() => {
    if (!authLoading && user && user.role !== "developer") {
      router.replace("/dashboard/contacts");
    }
  }, [authLoading, user, router]);

  const {
    data: logs,
    error,
    loading,
    refreshing,
    refetch,
  } = useQuery<LogEntry[]>(
    () => {
      // Not authorized (yet): stay pending — the route gate below renders a
      // spinner and the request is superseded once `enabled` flips.
      if (!enabled) return new Promise<LogEntry[]>(() => {});
      const from =
        timeRange === "all"
          ? undefined
          : new Date(Date.now() - RANGE_MS[timeRange]).toISOString();
      return LogsAPI.list({
        direction: direction || undefined,
        status: status || undefined,
        from,
        limit: LOG_LIMIT,
      });
    },
    [enabled, direction, status, timeRange],
    { pollMs: enabled && live ? LIVE_POLL_MS : undefined }
  );

  if (!user || user.role !== "developer") return <FullPageSpinner />;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink">
            {t("logsTitle")}
          </h2>
          {/* squiggle flourish under the page title (decorative) */}
          <svg
            aria-hidden="true"
            focusable="false"
            viewBox="0 0 160 14"
            fill="none"
            className="mt-1.5 w-28 text-lotus"
          >
            <path
              d="M3 10 Q 13 3 23 10 T 43 10 T 63 10 T 83 10 T 103 10 T 123 10 T 143 10 T 157 10"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </svg>
          <p className="mt-2 text-base text-slate-600">{t("logsDesc")}</p>
        </div>
        <Button
          variant="secondary"
          onClick={() => void refetch()}
          loading={refreshing}
        >
          <RefreshCw size={18} aria-hidden="true" /> {t("refresh")}
        </Button>
      </div>

      {/* filter toolbar: sticker card with a rotated confetti chip on top */}
      <div className="relative mb-5 rounded-2xl border-2 border-ink bg-white p-4 shadow-sticker sm:p-5">
        <span
          aria-hidden="true"
          className="absolute -top-3 right-5 hidden h-6 w-6 rotate-12 rounded-md border-2 border-ink bg-gold sm:block"
        />
        <div className="grid gap-3 sm:grid-cols-3">
          <Select
            label={t("direction")}
            value={direction}
            onChange={(e) => setDirection(e.target.value as "" | "in" | "out")}
          >
            <option value="">{t("all")}</option>
            <option value="in">{t("incoming")}</option>
            <option value="out">{t("outgoing")}</option>
          </Select>
          <Select
            label={t("status")}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">{t("all")}</option>
            <option value="200">200</option>
            <option value="400">400</option>
            <option value="401">401</option>
            <option value="500">500</option>
          </Select>
          <Select
            label={t("time")}
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as TimeRange)}
          >
            <option value="all">{t("all")}</option>
            <option value="15m">{t("logsLast15m")}</option>
            <option value="1h">{t("logsLast1h")}</option>
            <option value="24h">{t("logsLast24h")}</option>
            <option value="7d">{t("logsLast7d")}</option>
          </Select>
        </div>
      </div>

      {loading ? (
        <>
          <span className="sr-only" role="status">
            {t("loading")}
          </span>
          <div className="space-y-2" aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <Card key={i} className="p-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-5 w-5 shrink-0" />
                  <Skeleton className="h-5 flex-1" />
                  <Skeleton className="h-5 w-16 shrink-0" />
                </div>
              </Card>
            ))}
          </div>
        </>
      ) : !logs ? (
        <ErrorState
          message={tApiError(error, t)}
          onRetry={() => void refetch()}
        />
      ) : (
        <>
          {error != null && (
            <Alert kind="error" className="mb-3">
              {tApiError(error, t)}
            </Alert>
          )}

          {logs.length === 0 ? (
            <EmptyState
              icon={<FileSearch size={32} />}
              title={t("noLogs")}
            />
          ) : (
            <>
              <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                {/* count coin: chunky pill so the total reads at a glance */}
                <p className="inline-flex items-center rounded-full border-2 border-ink bg-white px-3.5 py-1 text-base font-bold text-ink shadow-pop-sm">
                  {logs.length}{" "}
                  {logs.length === 1
                    ? t("logsEventSingular")
                    : t("logsEventPlural")}
                </p>
                {logs.length >= LOG_LIMIT && (
                  <p className="text-base text-slate-600">
                    {t("logsCapHint")}
                  </p>
                )}
                {live && (
                  <p className="flex items-center gap-2 text-sm text-slate-600">
                    <span
                      aria-hidden="true"
                      className="h-2.5 w-2.5 rounded-full border border-ink bg-leaf motion-safe:animate-pulse"
                    />
                    {t("logsAutoRefreshOn")}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                {logs.map((log) => {
                  const expanded = open === log.id;
                  const detailId = `log-detail-${log.id}`;
                  return (
                    <Card key={log.id} className="p-0">
                      <button
                        type="button"
                        className={
                          "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-gold-light/50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-sen " +
                          (expanded ? "rounded-t-2xl" : "rounded-2xl")
                        }
                        onClick={() => setOpen(expanded ? null : log.id)}
                        aria-expanded={expanded}
                        aria-controls={expanded ? detailId : undefined}
                      >
                        {/* chevron coin: bordered circle, fills gold when open */}
                        <span
                          aria-hidden="true"
                          className={
                            "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-ink transition-colors " +
                            (expanded ? "bg-gold" : "bg-white")
                          }
                        >
                          {expanded ? (
                            <ChevronDown
                              size={18}
                              strokeWidth={2.5}
                              className="text-ink"
                              aria-hidden="true"
                            />
                          ) : (
                            <ChevronRight
                              size={18}
                              strokeWidth={2.5}
                              className="text-ink"
                              aria-hidden="true"
                            />
                          )}
                        </span>
                        <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                          <span className="flex min-w-0 items-center gap-3">
                            <code className="min-w-0 flex-1 truncate text-base font-semibold text-ink">
                              {log.endpoint}
                            </code>
                            <span className="shrink-0">
                              <Badge color={log.status < 400 ? "green" : "red"}>
                                {log.status}
                              </Badge>
                            </span>
                          </span>
                          <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                            <Badge
                              color={log.direction === "in" ? "green" : "gray"}
                            >
                              {log.direction === "in"
                                ? t("incoming")
                                : t("outgoing")}
                            </Badge>
                            <span className="text-sm text-slate-600">
                              {formatDateTime(log.timestamp, lang)}
                            </span>
                          </span>
                        </span>
                      </button>
                      {expanded && (
                        <div
                          id={detailId}
                          className="grid gap-4 border-t-2 border-dashed border-slate-300 px-4 py-4 sm:grid-cols-2"
                        >
                          <PayloadPane
                            label={t("payload")}
                            value={log.payload}
                          />
                          <PayloadPane
                            label={t("response")}
                            value={log.response}
                          />
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
