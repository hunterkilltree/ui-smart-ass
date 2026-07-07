"use client";

import { useCallback, useEffect, useState } from "react";
import { Plug, Unplug } from "lucide-react";
import { ContactsAPI } from "@/lib/be";
import { useI18n } from "@/lib/i18n";
import type { Channel } from "@/lib/types";
import { Button, Card, Badge, Modal, Input, Alert, Spinner } from "@/components/ui";

export default function ContactsPage() {
  const { t } = useI18n();
  const [channels, setChannels] = useState<Channel[] | null>(null);
  const [editing, setEditing] = useState<Channel | null>(null);
  const [creds, setCreds] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    ContactsAPI.list().then(setChannels).catch(() => setChannels([]));
  }, []);

  useEffect(load, [load]);

  const openConnect = (ch: Channel) => {
    setCreds({});
    setError("");
    setEditing(ch);
  };

  const connect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setBusy(true);
    setError("");
    try {
      await ContactsAPI.connect(editing.id, creds);
      setEditing(null);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setBusy(false);
    }
  };

  const disconnect = async (ch: Channel) => {
    await ContactsAPI.disconnect(ch.id);
    load();
  };

  if (!channels) return <Spinner />;

  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-900">
        {t("contactsTitle")}
      </h2>
      <p className="mb-5 mt-1 text-sm text-slate-500">{t("contactsDesc")}</p>

      <div className="grid gap-4 sm:grid-cols-2">
        {channels.map((ch) => (
          <Card key={ch.id} className="flex items-center justify-between">
            <div>
              <div className="mb-1 font-medium text-slate-900">{ch.name}</div>
              {ch.error ? (
                <Badge color="red">{t("channelError")}</Badge>
              ) : ch.connected ? (
                <Badge color="green">{t("connected")}</Badge>
              ) : (
                <Badge color="gray">{t("notConnected")}</Badge>
              )}
            </div>
            {ch.connected ? (
              <Button variant="secondary" onClick={() => disconnect(ch)}>
                <Unplug size={16} /> {t("disconnect")}
              </Button>
            ) : (
              <Button onClick={() => openConnect(ch)}>
                <Plug size={16} /> {t("connect")}
              </Button>
            )}
          </Card>
        ))}
      </div>

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={`${t("connect")} ${editing?.name ?? ""}`}
      >
        <form onSubmit={connect} className="space-y-4">
          {error && <Alert>{error}</Alert>}
          <p className="text-sm text-slate-500">{t("credentials")}:</p>
          {editing?.credentialFields.map((f) => (
            <Input
              key={f}
              label={f}
              value={creds[f] ?? ""}
              onChange={(e) => setCreds({ ...creds, [f]: e.target.value })}
              required
            />
          ))}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setEditing(null)}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={busy}>
              {busy ? t("loading") : t("connect")}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
