"use client";

import { useI18n } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { lang, setLang, t } = useI18n();
  return (
    <div
      role="group"
      aria-label={t("language")}
      /* chunky segmented pill: 2px ink border + small hard shadow */
      className="inline-flex overflow-hidden rounded-full border-2 border-ink text-sm font-bold shadow-pop-sm"
    >
      {(["vi", "en"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={
            // min 44px touch targets; inset outline so the pill's
            // overflow-hidden doesn't clip the focus ring
            lang === l
              ? "flex min-h-11 min-w-11 items-center justify-center bg-sen px-3.5 text-white transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white"
              : "flex min-h-11 min-w-11 items-center justify-center bg-white px-3.5 text-slate-600 transition-colors hover:bg-gold-light hover:text-ink focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-sen"
          }
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
