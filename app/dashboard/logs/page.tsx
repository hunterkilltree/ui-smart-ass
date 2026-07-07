"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import type { LogEntry } from "@/lib/types";
import { Badge, Card, Spinner } from "@/components/ui";

export default function LogsPage() {
  const { t } = useI18n();
  const { user, loading } = useAuth();
  const router = useRouter();
  const [logs, setLogs] = useState<LogEntry[] | null>(null);
  const [direction, setDirection] = useState<"" | "in" | "out">("");
  const [status, setStatus] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user && user.role !== "developer") {
      router.replace("/dashboard/contacts");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!user || user.role !== "developer") return;
    const params = new URLSearchParams({ limit: "50" });
    if (direction) params.set("direction", direction);
    if (status) params.set("status", status);
    setLogs(null);
    api<LogEntry[]>(`/logs?${params}`).then(setLogs).catch(() => setLogs([]));
  }, [user, direction, status]);

  if (!user || user.role !== "developer") return <Spinner />;

  const selectCls =
    "rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-sen";

  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-900">{t("logsTitle")}</h2>
      <p className="mb-5 mt-1 text-sm text-slate-500">{t("logsDesc")}</p>

      <div className="mb-4 flex flex-wrap gap-3">
        <label className="flex items-center gap-2 text-sm text-slate-600">
          {t("direction")}
          <select
            className={selectCls}
            value={direction}
            onChange={(e) => setDirection(e.target.value as "" | "in" | "out")}
          >
            <option value="">{t("all")}</option>
            <option value="in">{t("incoming")}</option>
            <option value="out">{t("outgoing")}</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          {t("status")}
          <select
            className={selectCls}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">{t("all")}</option>
            <option value="200">200</option>
            <option value="400">400</option>
            <option value="401">401</option>
            <option value="500">500</option>
          </select>
        </label>
      </div>

      {!logs ? (
        <Spinner />
      ) : logs.length === 0 ? (
        <p className="text-sm text-slate-500">{t("noLogs")}</p>
      ) : (
        <div className="space-y-2">
          {logs.map((log) => {
            const expanded = open === log.id;
            return (
              <Card key={log.id} className="p-0">
                <button
                  className="flex w-full items-center gap-3 px-4 py-3 text-left"
                  onClick={() => setOpen(expanded ? null : log.id)}
                >
                  {expanded ? (
                    <ChevronDown size={16} className="shrink-0 text-slate-400" />
                  ) : (
                    <ChevronRight size={16} className="shrink-0 text-slate-400" />
                  )}
                  <Badge color={log.direction === "in" ? "green" : "gray"}>
                    {log.direction === "in" ? t("incoming") : t("outgoing")}
                  </Badge>
                  <code className="flex-1 truncate text-sm text-slate-700">
                    {log.endpoint}
                  </code>
                  <Badge color={log.status < 400 ? "green" : "red"}>
                    {log.status}
                  </Badge>
                  <span className="hidden text-xs text-slate-400 sm:block">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </button>
                {expanded && (
                  <div className="grid gap-3 border-t border-slate-100 px-4 py-3 sm:grid-cols-2">
                    <div>
                      <p className="mb-1 text-xs font-medium uppercase text-slate-400">
                        {t("payload")}
                      </p>
                      <pre className="overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs text-slate-100">
                        {JSON.stringify(log.payload, null, 2)}
                      </pre>
                    </div>
                    <div>
                      <p className="mb-1 text-xs font-medium uppercase text-slate-400">
                        {t("response")}
                      </p>
                      <pre className="overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs text-slate-100">
                        {JSON.stringify(log.response, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
