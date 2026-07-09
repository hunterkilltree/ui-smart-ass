"use client";

import { useState } from "react";
import { Eye, EyeOff, MessageCircle, Plug, Unplug } from "lucide-react";
import { ContactsAPI } from "@/lib/be";
import { ApiError } from "@/lib/api";
import { tApiError, useI18n, type TKey } from "@/lib/i18n";
import type { Channel } from "@/lib/types";
import { useMutation, useQuery } from "@/lib/useQuery";
import {
  Alert,
  Badge,
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  ErrorState,
  Input,
  Modal,
  Skeleton,
  useToast,
} from "@/components/ui";

type Translate = (key: TKey) => string;

/** Human-readable, localized labels for the known credential field keys. */
const CRED_LABEL_KEYS: Record<string, TKey> = {
  oaId: "credOaId",
  accessToken: "credAccessToken",
  pageId: "credPageId",
  pageAccessToken: "credPageAccessToken",
  botToken: "credBotToken",
};

/** Anything token/key/secret/password-like is masked by default. */
const SECRET_FIELD_RE = /token|secret|key|password/i;

/** Machine-readable API error codes (requirements.md §5) → localized copy. */
const API_ERROR_KEYS: Record<string, TKey> = {
  missing_credentials: "errMissingCredentials",
  invalid_credentials: "errInvalidCredentials",
  channel_not_found: "errChannelNotFound",
};

/** Channel-level error codes persisted by the BE → localized copy. */
const CHANNEL_ERROR_KEYS: Record<string, TKey> = {
  invalid_credentials: "channelErrInvalidCredentials",
};

function humanizeFieldKey(field: string): string {
  const words = field
    .replace(/[_-]+/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

function credFieldLabel(field: string, t: Translate): string {
  const key = CRED_LABEL_KEYS[field];
  // Unknown field from the BE: humanize it, keep the raw key as a dev hint.
  return key ? t(key) : `${humanizeFieldKey(field)} (${field})`;
}

/** Localized message for contacts mutations — never raw err.message. */
function contactsErrorMessage(err: unknown, t: Translate): string {
  if (err instanceof ApiError) {
    const key = API_ERROR_KEYS[err.message];
    if (key) return t(key);
  }
  return tApiError(err, t);
}

function channelErrorMessage(code: string, t: Translate): string {
  return t(CHANNEL_ERROR_KEYS[code] ?? "channelErrGeneric");
}

/**
 * Playful Geometric accents for the channel cards, rotated deterministically
 * by list index (no randomness — SSR/client markup stays identical).
 * Full class literals so Tailwind's scanner picks them up.
 * Bright fills are decoration-only: ink icon on gold/lotus/leaf, white only
 * on the AA-safe violet `bg-sen`.
 */
const CHANNEL_ACCENTS = [
  { coin: "bg-sen text-white", chip: "bg-gold" },
  { coin: "bg-lotus text-ink", chip: "bg-leaf" },
  { coin: "bg-gold text-ink", chip: "bg-sen-bright" },
  { coin: "bg-leaf text-ink", chip: "bg-lotus" },
] as const;

/**
 * One credential input. Secret-ish fields render as password inputs with a
 * show/hide toggle. Module-scope component so inputs keep focus across
 * page re-renders.
 */
function CredentialField({
  field,
  value,
  error,
  visible,
  onChange,
  onToggleVisible,
}: {
  field: string;
  value: string;
  error?: string;
  visible: boolean;
  onChange: (value: string) => void;
  onToggleVisible: () => void;
}) {
  const { t } = useI18n();
  const secret = SECRET_FIELD_RE.test(field);
  const inputId = `cred-${field}`;

  return (
    <div>
      <label
        htmlFor={inputId}
        className="mb-1.5 block text-base font-bold text-ink"
      >
        {credFieldLabel(field, t)}
      </label>
      <div className="relative">
        <Input
          id={inputId}
          type={secret && !visible ? "password" : "text"}
          autoComplete="off"
          className={secret ? "pr-14" : undefined}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          error={error}
          required
        />
        {secret && (
          <button
            type="button"
            onClick={onToggleVisible}
            aria-label={visible ? t("hideSecret") : t("showSecret")}
            aria-pressed={visible}
            className="absolute right-0.5 top-[1px] flex h-11 w-11 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-gold-light hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sen"
          >
            {visible ? (
              <EyeOff size={20} aria-hidden="true" />
            ) : (
              <Eye size={20} aria-hidden="true" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default function ContactsPage() {
  const { t } = useI18n();
  const { toast } = useToast();

  const {
    data: channels,
    error,
    loading,
    refreshing,
    refetch,
    setData,
  } = useQuery(() => ContactsAPI.list(), []);

  // Connect modal state.
  const [editing, setEditing] = useState<Channel | null>(null);
  const [creds, setCreds] = useState<Record<string, string>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});
  const [visibleSecrets, setVisibleSecrets] = useState<Record<string, boolean>>(
    {}
  );

  // Disconnect confirmation state.
  const [confirming, setConfirming] = useState<Channel | null>(null);

  const connectM = useMutation(
    async (args: { id: string; credentials: Record<string, string> }) => {
      try {
        return await ContactsAPI.connect(args.id, args.credentials);
      } catch (err) {
        // A rejected connect persists an error status on the channel — sync
        // the list so the red badge shows behind the modal.
        if (err instanceof ApiError && err.message === "invalid_credentials") {
          void refetch();
        }
        throw err;
      }
    }
  );

  const disconnectM = useMutation(async (ch: Channel) => {
    try {
      return await ContactsAPI.disconnect(ch.id);
    } catch (err) {
      toast(contactsErrorMessage(err, t), "error");
      throw err;
    }
  });

  const openConnect = (ch: Channel) => {
    setCreds({});
    setFieldErrors({});
    setVisibleSecrets({});
    connectM.reset();
    setEditing(ch);
  };

  const closeConnect = () => {
    setEditing(null);
    connectM.reset();
  };

  const hasTypedCreds = Object.values(creds).some((v) => v.trim() !== "");

  const submitConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing || connectM.busy) return;
    // Per-field required validation with localized messages (noValidate).
    const trimmed: Record<string, string> = {};
    const missing: Record<string, boolean> = {};
    for (const f of editing.credentialFields) {
      trimmed[f] = (creds[f] ?? "").trim();
      if (!trimmed[f]) missing[f] = true;
    }
    setFieldErrors(missing);
    if (Object.keys(missing).length > 0) return;

    const res = await connectM.mutate({
      id: editing.id,
      credentials: trimmed,
    });
    if (!res) return; // failure — localized alert renders in the modal

    const name = editing.name;
    setEditing(null);
    // Patch locally so the list is correct even if the refetch fails.
    setData((prev) =>
      prev?.map((c) =>
        c.id === res.id ? { ...c, connected: true, error: null } : c
      )
    );
    toast(t("connectedToast").replace("{channel}", name), "success");
    void refetch();
  };

  const confirmDisconnect = async () => {
    if (!confirming) return;
    const ch = confirming;
    const res = await disconnectM.mutate(ch);
    if (!res) return; // failure — error toast already shown, keep dialog open
    setConfirming(null);
    setData((prev) =>
      prev?.map((c) =>
        c.id === ch.id ? { ...c, connected: false, error: null } : c
      )
    );
    toast(t("disconnectedToast").replace("{channel}", ch.name), "success");
    void refetch();
  };

  return (
    <div>
      <div>
        <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink">
          {t("contactsTitle")}
        </h2>
        {/* squiggle underline flourish */}
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
        <p className="mb-6 mt-2 text-base text-slate-600">{t("contactsDesc")}</p>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {[0, 1, 2].map((i) => (
            <Card key={i} className="flex items-center justify-between gap-3">
              <div className="flex flex-1 items-center gap-3">
                <Skeleton className="h-12 w-12 shrink-0 rounded-full" />
                <div className="flex-1 space-y-2.5">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-7 w-28" />
                </div>
              </div>
              <Skeleton className="h-11 w-36 shrink-0 rounded-full" />
            </Card>
          ))}
        </div>
      ) : channels === undefined ? (
        <ErrorState
          message={tApiError(error, t)}
          onRetry={() => void refetch()}
        />
      ) : channels.length === 0 ? (
        <EmptyState
          icon={<MessageCircle size={32} />}
          title={t("noChannels")}
          description={t("noChannelsDesc")}
        />
      ) : (
        <>
          {error != null && (
            <Alert className="mb-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span>{tApiError(error, t)}</span>
                <Button
                  variant="secondary"
                  onClick={() => void refetch()}
                  loading={refreshing}
                >
                  {t("retry")}
                </Button>
              </div>
            </Alert>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            {channels.map((ch, i) => {
              const accent = CHANNEL_ACCENTS[i % CHANNEL_ACCENTS.length];
              return (
                <Card
                  key={ch.id}
                  className="pop-in relative flex items-center justify-between gap-3"
                >
                  {/* confetti chip perched on the sticker's top edge */}
                  <span
                    aria-hidden="true"
                    className={`absolute -top-3 right-5 hidden h-6 w-6 rotate-12 rounded-md border-2 border-ink lg:block ${accent.chip}`}
                  />
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    {/* channel icon coin (decorative — the name carries meaning) */}
                    <span
                      aria-hidden="true"
                      className={`wiggle-on-hover flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-ink shadow-pop-sm ${accent.coin}`}
                    >
                      <MessageCircle size={22} strokeWidth={2.5} />
                    </span>
                    <div className="min-w-0">
                      <h3 className="mb-1.5 font-display text-lg font-bold text-ink">
                        {ch.name}
                      </h3>
                      {ch.connected ? (
                        <Badge color="green">{t("connected")}</Badge>
                      ) : ch.error ? (
                        <Badge color="red">{t("channelError")}</Badge>
                      ) : (
                        <Badge color="gray">{t("notConnected")}</Badge>
                      )}
                      {ch.error && (
                        <p className="mt-2 text-base text-red-700">
                          {channelErrorMessage(ch.error, t)}
                        </p>
                      )}
                    </div>
                  </div>
                  {ch.connected ? (
                    <Button
                      variant="secondary"
                      className="shrink-0"
                      onClick={() => setConfirming(ch)}
                      loading={disconnectM.busy && confirming?.id === ch.id}
                    >
                      <Unplug size={18} aria-hidden="true" /> {t("disconnect")}
                    </Button>
                  ) : (
                    <Button className="shrink-0" onClick={() => openConnect(ch)}>
                      <Plug size={18} aria-hidden="true" /> {t("connect")}
                    </Button>
                  )}
                </Card>
              );
            })}
          </div>
        </>
      )}

      <Modal
        open={!!editing}
        onClose={() => {
          if (!connectM.busy) closeConnect();
        }}
        title={`${t("connect")} ${editing?.name ?? ""}`}
        dismissible={!connectM.busy && !hasTypedCreds}
      >
        <form onSubmit={submitConnect} noValidate className="space-y-5">
          {connectM.error != null && (
            <Alert>{contactsErrorMessage(connectM.error, t)}</Alert>
          )}
          <p className="text-base text-slate-600">{t("credentials")}:</p>
          {editing?.credentialFields.map((f) => (
            <CredentialField
              key={f}
              field={f}
              value={creds[f] ?? ""}
              error={fieldErrors[f] ? t("credRequired") : undefined}
              visible={!!visibleSecrets[f]}
              onChange={(v) => {
                setCreds((prev) => ({ ...prev, [f]: v }));
                if (fieldErrors[f]) {
                  setFieldErrors((prev) => ({ ...prev, [f]: false }));
                }
              }}
              onToggleVisible={() =>
                setVisibleSecrets((prev) => ({ ...prev, [f]: !prev[f] }))
              }
            />
          ))}
          <div className="flex justify-end gap-3 pt-1">
            <Button
              type="button"
              variant="secondary"
              onClick={closeConnect}
              disabled={connectM.busy}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" loading={connectM.busy}>
              <Plug size={18} aria-hidden="true" /> {t("connect")}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!confirming}
        title={t("disconnectConfirmTitle").replace(
          "{channel}",
          confirming?.name ?? ""
        )}
        message={t("disconnectConfirmBody")}
        confirmLabel={t("disconnect")}
        cancelLabel={t("cancel")}
        danger
        busy={disconnectM.busy}
        onConfirm={() => void confirmDisconnect()}
        onCancel={() => setConfirming(null)}
      />
    </div>
  );
}
