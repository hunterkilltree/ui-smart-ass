"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useMutation } from "@/lib/useQuery";
import { tApiError, useI18n } from "@/lib/i18n";
import { AuthShell } from "@/components/AuthShell";
import { Button, Input, Alert, FullPageSpinner } from "@/components/ui";

const EMAIL_RE = /^\S+@\S+\.\S+$/;

/** Only allow internal paths as post-auth destinations. */
function safeNext(next: string | null): string {
  if (next && next.startsWith("/") && !next.startsWith("//")) return next;
  return "/dashboard";
}

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
        className="absolute right-0.5 top-[31px] flex h-12 w-12 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-gold-light hover:text-ink focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-sen"
      >
        {show ? (
          <EyeOff size={22} strokeWidth={2.5} aria-hidden="true" />
        ) : (
          <Eye size={22} strokeWidth={2.5} aria-hidden="true" />
        )}
      </button>
    </div>
  );
}

function SignInForm() {
  const { user, loading, signIn } = useAuth();
  const { t } = useI18n();
  const router = useRouter();
  // Deep link preserved by the dashboard guard (?next=/dashboard/...).
  const next = useSearchParams().get("next");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const validateEmail = (value: string) =>
    EMAIL_RE.test(value.trim()) ? undefined : t("emailInvalid");
  const validatePassword = (value: string) =>
    value.length >= 6 ? undefined : t("passwordTooShort");

  const submit = useMutation(
    async (args: { email: string; password: string }) => {
      // signIn stores the session and router.replace()s to the destination.
      await signIn(args.email, args.password, safeNext(next));
    }
  );

  // Already signed in (bookmark, Back button): skip the form entirely.
  useEffect(() => {
    if (!loading && user) router.replace(safeNext(next));
  }, [loading, user, next, router]);

  if (loading || user) return <FullPageSpinner />;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = {
      email: validateEmail(email),
      password: validatePassword(password),
    };
    setFieldErrors(errs);
    if (errs.email || errs.password) return;
    await submit.mutate({ email, password });
  };

  return (
    <AuthShell title={t("signIn")}>
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        {submit.error != null && (
          <Alert>
            {submit.error instanceof ApiError && submit.error.status === 401
              ? t("errSignInInvalid")
              : tApiError(submit.error, t)}
          </Alert>
        )}
        <Input
          label={t("email")}
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (fieldErrors.email) {
              setFieldErrors((prev) => ({
                ...prev,
                email: validateEmail(e.target.value),
              }));
            }
          }}
          onBlur={() =>
            setFieldErrors((prev) => ({ ...prev, email: validateEmail(email) }))
          }
          error={fieldErrors.email}
          required
          autoComplete="email"
        />
        <PasswordField
          label={t("password")}
          value={password}
          onChange={(value) => {
            setPassword(value);
            if (fieldErrors.password) {
              setFieldErrors((prev) => ({
                ...prev,
                password: validatePassword(value),
              }));
            }
          }}
          onBlur={() =>
            setFieldErrors((prev) => ({
              ...prev,
              password: validatePassword(password),
            }))
          }
          error={fieldErrors.password}
          autoComplete="current-password"
        />
        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="inline-block rounded-md py-1 text-base font-bold text-sen underline decoration-2 underline-offset-4 transition-colors hover:text-sen-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sen"
          >
            {t("forgotPassword")}
          </Link>
        </div>
        <Button type="submit" loading={submit.busy} className="w-full">
          {t("signIn")}
        </Button>
        {/* playful squiggle divider between action and footer links */}
        <svg
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 160 14"
          fill="none"
          className="mx-auto w-24 text-gold"
        >
          <path
            d="M3 10 Q 13 3 23 10 T 43 10 T 63 10 T 83 10 T 103 10 T 123 10 T 143 10 T 157 10"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </svg>
        <p className="text-center text-base text-slate-600">
          {t("noAccount")}{" "}
          <Link
            href="/sign-up"
            className="rounded-md font-bold text-sen underline decoration-2 underline-offset-4 transition-colors hover:text-sen-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sen"
          >
            {t("signUp")}
          </Link>
        </p>
        {/* mock-only dev hint, styled as a dashed "sticky note" chip */}
        <p className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-2.5 text-center text-sm text-slate-600">
          {t("signInHint")}
        </p>
      </form>
    </AuthShell>
  );
}

export default function SignInPage() {
  // useSearchParams requires a Suspense boundary during static prerender.
  return (
    <Suspense fallback={null}>
      <SignInForm />
    </Suspense>
  );
}
