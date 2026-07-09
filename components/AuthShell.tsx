"use client";

import Link from "next/link";
import { LogoMark } from "./Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useI18n } from "@/lib/i18n";

export function AuthShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const { t } = useI18n();
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-lotus-light via-cream to-sen-light p-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          {/* Logo links back to the landing page so the auth funnel is escapable */}
          <Link
            href="/"
            className="flex flex-col items-center gap-3 rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sen"
          >
            <LogoMark size={84} label={t("logoAlt")} />
            <div>
              <h1 className="text-2xl font-extrabold tracking-wide text-sen">
                SEN
              </h1>
              {/* text-base + darkened lotus-dark token: AA on the gradient */}
              <p className="text-base font-medium text-lotus-dark">
                {t("tagline")}
              </p>
            </div>
          </Link>
        </div>
        <div className="rounded-3xl border border-lotus-light bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">{title}</h2>
            <LanguageSwitcher />
          </div>
          {children}
        </div>
      </div>
    </main>
  );
}
