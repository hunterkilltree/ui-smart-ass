"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { AuthShell } from "@/components/AuthShell";
import { Button, Input, Alert } from "@/components/ui";

export default function SignInPage() {
  const { signIn } = useAuth();
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await signIn(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
      setBusy(false);
    }
  };

  return (
    <AuthShell title={t("signIn")}>
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
        <Input
          label={t("password")}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-sm text-indigo-600 hover:underline"
          >
            {t("forgotPassword")}
          </Link>
        </div>
        <Button type="submit" disabled={busy} className="w-full">
          {busy ? t("loading") : t("signIn")}
        </Button>
        <p className="text-center text-sm text-slate-500">
          {t("noAccount")}{" "}
          <Link href="/sign-up" className="text-indigo-600 hover:underline">
            {t("signUp")}
          </Link>
        </p>
        <p className="text-center text-xs text-slate-400">{t("signInHint")}</p>
      </form>
    </AuthShell>
  );
}
