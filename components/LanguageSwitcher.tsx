"use client";

import { useI18n } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { lang, setLang } = useI18n();
  return (
    <div className="inline-flex overflow-hidden rounded-full border border-sen/30 text-xs font-semibold">
      {(["vi", "en"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={
            lang === l
              ? "bg-sen px-2.5 py-1 text-white"
              : "bg-white px-2.5 py-1 text-slate-600 hover:bg-sen-light"
          }
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
