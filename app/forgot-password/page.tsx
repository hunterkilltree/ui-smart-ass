"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthAPI } from "@/lib/be";
import { useI18n } from "@/lib/i18n";
import { AuthShell } from "@/components/AuthShell";
import { Button, Input, Alert } from "@/components/ui";

export default function ForgotPasswordPage() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await AuthAPI.forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell title={t("resetPassword")}>
      {sent ? (
        <div className="space-y-4">
          <Alert kind="success">{t("resetLinkSent")}</Alert>
          <Link
            href="/sign-in"
            className="block text-center text-sm text-sen hover:underline"
          >
            {t("backToSignIn")}
          </Link>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          {error && <Alert>{error}</Alert>}
          <Input
            label={t("email")}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <Button type="submit" disabled={busy} className="w-full">
            {busy ? t("loading") : t("sendResetLink")}
          </Button>
          <Link
            href="/sign-in"
            className="block text-center text-sm text-sen hover:underline"
          >
            {t("backToSignIn")}
          </Link>
        </form>
      )}
    </AuthShell>
  );
}
