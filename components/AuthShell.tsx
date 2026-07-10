"use client";

import Link from "next/link";
import { LogoMark } from "./Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useI18n } from "@/lib/i18n";

/*
 * Playful Geometric backdrop: a fixed set of hand-placed shapes (no
 * randomness — SSR and client always render the same markup). Hidden on
 * small screens so nothing ever collides with the form, and aria-hidden
 * because it is pure decoration.
 */
function BackdropShapes() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 hidden overflow-hidden sm:block"
    >
      {/* big amber circle, half off-canvas (spec: massive shape behind content) */}
      <span className="absolute -left-20 top-16 h-52 w-52 rounded-full border-2 border-ink bg-gold" />
      {/* dot-grid tile */}
      <span className="pattern-dots absolute -right-10 top-24 h-36 w-36 rounded-3xl border-2 border-slate-200 bg-white" />
      {/* confetti: mint square, pink circle, violet triangle */}
      <span className="absolute bottom-32 left-14 h-9 w-9 rotate-12 rounded-lg border-2 border-ink bg-leaf" />
      <span className="absolute bottom-16 right-24 h-7 w-7 rounded-full border-2 border-ink bg-lotus" />
      <svg
        viewBox="0 0 24 24"
        className="absolute right-16 top-10 h-8 w-8 text-sen-bright"
        focusable="false"
      >
        <path
          d="M12 3 L21 20 H3 Z"
          fill="currentColor"
          stroke="var(--color-ink)"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
      {/* squiggle flourish */}
      <svg
        viewBox="0 0 160 14"
        fill="none"
        className="absolute bottom-20 left-1/2 w-32 -translate-x-1/2 text-lotus"
        focusable="false"
      >
        <path
          d="M3 10 Q 13 3 23 10 T 43 10 T 63 10 T 83 10 T 103 10 T 123 10 T 143 10 T 157 10"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export function AuthShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const { t } = useI18n();
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-cream p-4">
      <BackdropShapes />
      <div className="relative w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          {/* Logo links back to the landing page so the auth funnel is escapable */}
          <Link
            href="/"
            className="flex flex-col items-center gap-3 rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sen"
          >
            <LogoMark size={84} label={t("logoAlt")} />
            <div>
              <h1 className="font-display text-2xl font-extrabold tracking-wide text-sen">
                SEN
              </h1>
              {/* text-base + darkened lotus-dark token: AA on cream */}
              <p className="text-base font-semibold text-lotus-dark">
                {t("tagline")}
              </p>
            </div>
          </Link>
        </div>
        {/* sticker panel: thick ink border + hard offset shadow */}
        <div className="rounded-3xl border-2 border-ink bg-white p-6 shadow-pop-lg">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-xl font-extrabold text-ink">
              {title}
            </h2>
            <LanguageSwitcher />
          </div>
          {children}
        </div>
      </div>
    </main>
  );
}
