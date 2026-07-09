"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthAPI } from "@/lib/be";
import { useMutation } from "@/lib/useQuery";
import { tApiError, useI18n } from "@/lib/i18n";
import { AuthShell } from "@/components/AuthShell";
import { Button, Input, Alert } from "@/components/ui";

const EMAIL_RE = /^\S+@\S+\.\S+$/;

const FALLBACK_RESET_URL = "/reset-password?token=mock-token";

/** Only trust internal paths coming back from the (mock) API. */
function safeResetUrl(url: string | undefined): string {
  if (url && url.startsWith("/") && !url.startsWith("//")) return url;
  return FALLBACK_RESET_URL;
}

export default function ForgotPasswordPage() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  // Set after a successful request; also serves as the "sent" flag.
  const [resetUrl, setResetUrl] = useState<string | null>(null);

  const validateEmail = (value: string) =>
    EMAIL_RE.test(value.trim()) ? undefined : t("emailInvalid");

  const submit = useMutation(async (value: string) =>
    AuthAPI.forgotPassword(value)
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateEmail(email);
    setEmailError(err);
    if (err) return;
    const res = await submit.mutate(email);
    if (res) setResetUrl(safeResetUrl(res.resetUrl));
  };

  return (
    <AuthShell title={t("resetPassword")}>
      {resetUrl ? (
        <div className="space-y-4">
          <Alert kind="success">{t("resetLinkSent")}</Alert>
          {/* Mock-only dev hint: no real email exists yet, so surface the
              link the email would contain. Remove with the real backend. */}
          <p className="text-center text-sm text-slate-500">
            {t("forgotHintMock")}{" "}
            <Link
              href={resetUrl}
              className="rounded text-sen underline hover:text-sen-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sen"
            >
              {t("openResetLink")}
            </Link>
          </p>
          <Link
            href="/sign-in"
            className="block rounded text-center text-base text-sen hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sen"
          >
            {t("backToSignIn")}
          </Link>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <p className="text-base text-slate-600">{t("forgotPasswordDesc")}</p>
          {submit.error != null && <Alert>{tApiError(submit.error, t)}</Alert>}
          <Input
            label={t("email")}
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError(validateEmail(e.target.value));
            }}
            onBlur={() => setEmailError(validateEmail(email))}
            error={emailError}
            required
            autoComplete="email"
          />
          <Button type="submit" loading={submit.busy} className="w-full">
            {t("sendResetLink")}
          </Button>
          <Link
            href="/sign-in"
            className="block rounded text-center text-base text-sen hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sen"
          >
            {t("backToSignIn")}
          </Link>
        </form>
      )}
    </AuthShell>
  );
}
