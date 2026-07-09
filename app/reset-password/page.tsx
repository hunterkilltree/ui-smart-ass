"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { ApiError } from "@/lib/api";
import { AuthAPI } from "@/lib/be";
import { useMutation } from "@/lib/useQuery";
import { tApiError, useI18n } from "@/lib/i18n";
import { AuthShell } from "@/components/AuthShell";
import { Button, Input, Alert } from "@/components/ui";

/** Password input with a show/hide toggle (Eye/EyeOff), built on Input. */
function PasswordField({
  label,
  value,
  onChange,
  onBlur,
  error,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  autoComplete?: string;
}) {
  const { t } = useI18n();
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input
        label={label}
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        error={error}
        autoComplete={autoComplete}
        required
        className="pr-14"
      />
      {/* 48px toggle target, aligned over the input row (below the label) */}
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? t("hidePassword") : t("showPassword")}
        aria-pressed={show}
        className="absolute right-0 top-[31px] flex h-12 w-12 items-center justify-center rounded-xl text-slate-500 hover:text-slate-700 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-sen"
      >
        {show ? (
          <EyeOff size={22} aria-hidden="true" />
        ) : (
          <Eye size={22} aria-hidden="true" />
        )}
      </button>
    </div>
  );
}

function ResetPasswordForm() {
  const { t } = useI18n();
  // The reset link lands here as /reset-password?token=...
  const token = useSearchParams().get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    password?: string;
    confirm?: string;
  }>({});
  const [done, setDone] = useState(false);

  const validatePassword = (value: string) =>
    value.length >= 6 ? undefined : t("passwordTooShort");
  const validateConfirm = (confirmValue: string, passwordValue: string) =>
    confirmValue === passwordValue ? undefined : t("passwordMismatch");

  const submit = useMutation(
    async (args: { token: string; password: string }) =>
      AuthAPI.resetPassword(args.token, args.password)
  );

  // The mock BE rejects bad/expired links with these machine codes.
  const linkInvalid =
    submit.error instanceof ApiError &&
    (submit.error.message === "expired_token" ||
      submit.error.message === "invalid_token");

  if (!token) {
    // Landed here without a token (typed URL, truncated link).
    return (
      <AuthShell title={t("resetPassword")}>
        <div className="space-y-4">
          <Alert>{t("resetLinkInvalid")}</Alert>
          <Link
            href="/forgot-password"
            className="block rounded text-center text-base text-sen hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sen"
          >
            {t("requestNewLink")}
          </Link>
          <Link
            href="/sign-in"
            className="block rounded text-center text-base text-sen hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sen"
          >
            {t("backToSignIn")}
          </Link>
        </div>
      </AuthShell>
    );
  }

  if (done) {
    return (
      <AuthShell title={t("resetPassword")}>
        <div className="space-y-4">
          <Alert kind="success">{t("resetSuccess")}</Alert>
          <Link
            href="/sign-in"
            className="flex w-full items-center justify-center rounded-xl bg-sen px-5 py-2.5 text-base font-semibold text-white transition-colors hover:bg-sen-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sen"
          >
            {t("signIn")}
          </Link>
        </div>
      </AuthShell>
    );
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = {
      password: validatePassword(password),
      confirm: validateConfirm(confirm, password),
    };
    setFieldErrors(errs);
    if (errs.password || errs.confirm) return;
    const res = await submit.mutate({ token, password });
    if (res?.ok) setDone(true);
  };

  return (
    <AuthShell title={t("resetPassword")}>
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <p className="text-base text-slate-600">{t("resetPasswordDesc")}</p>
        {submit.error != null && (
          <div className="space-y-2">
            <Alert>
              {linkInvalid ? t("resetLinkInvalid") : tApiError(submit.error, t)}
            </Alert>
            {linkInvalid && (
              <Link
                href="/forgot-password"
                className="block rounded text-center text-base text-sen hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sen"
              >
                {t("requestNewLink")}
              </Link>
            )}
          </div>
        )}
        <PasswordField
          label={t("newPassword")}
          value={password}
          onChange={(value) => {
            setPassword(value);
            setFieldErrors((prev) => ({
              ...prev,
              password: prev.password ? validatePassword(value) : prev.password,
              // A password edit can fix (or break) the confirmation match.
              confirm: prev.confirm
                ? validateConfirm(confirm, value)
                : prev.confirm,
            }));
          }}
          onBlur={() =>
            setFieldErrors((prev) => ({
              ...prev,
              password: validatePassword(password),
            }))
          }
          error={fieldErrors.password}
          autoComplete="new-password"
        />
        <PasswordField
          label={t("confirmPassword")}
          value={confirm}
          onChange={(value) => {
            setConfirm(value);
            if (fieldErrors.confirm) {
              setFieldErrors((prev) => ({
                ...prev,
                confirm: validateConfirm(value, password),
              }));
            }
          }}
          onBlur={() =>
            setFieldErrors((prev) => ({
              ...prev,
              confirm: validateConfirm(confirm, password),
            }))
          }
          error={fieldErrors.confirm}
          autoComplete="new-password"
        />
        <Button type="submit" loading={submit.busy} className="w-full">
          {t("resetPassword")}
        </Button>
        <Link
          href="/sign-in"
          className="block rounded text-center text-base text-sen hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sen"
        >
          {t("backToSignIn")}
        </Link>
      </form>
    </AuthShell>
  );
}

export default function ResetPasswordPage() {
  // useSearchParams requires a Suspense boundary during static prerender.
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
