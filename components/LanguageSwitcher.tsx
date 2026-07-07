"use client";

import { useI18n } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { lang, setLang } = useI18n();
  return (
    <div className="inline-flex overflow-hidden rounded-lg border border-slate-300 text-xs font-medium">
      {(["vi", "en"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={
            lang === l
              ? "bg-indigo-600 px-2.5 py-1 text-white"
              : "bg-white px-2.5 py-1 text-slate-600 hover:bg-slate-50"
          }
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
