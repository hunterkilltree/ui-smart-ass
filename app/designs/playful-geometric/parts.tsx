import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Flower2 } from "lucide-react";

/* ------------------------------------------------------------------ *
 * Local building blocks for the Playful Geometric proposal page.
 * Everything here is scoped to app/designs/playful-geometric and uses
 * the style-spec palette (not the app brand tokens on purpose — the
 * spec wins inside this mockup):
 *   bg #FFFDF5 · ink #1E293B · violet #8B5CF6/#7C3AED · pink #F472B6
 *   amber #FBBF24 · mint #34D399 · border #E2E8F0 · muted #F1F5F9
 * ------------------------------------------------------------------ */

type CandyTone = "violet" | "yellow" | "white";

const candyToneClasses: Record<CandyTone, string> = {
  // #7C3AED (not #8B5CF6) behind white text keeps AA contrast at any size.
  violet: "bg-[#7C3AED] text-white",
  yellow: "bg-[#FBBF24] text-[#1E293B]",
  white: "bg-white text-[#1E293B]",
};

const candyArrowClasses: Record<CandyTone, string> = {
  violet: "bg-white text-[#7C3AED]",
  yellow: "bg-[#1E293B] text-[#FBBF24]",
  white: "bg-[#8B5CF6] text-white",
};

const candySizeClasses = {
  md: "min-h-12 px-7 py-3 text-lg",
  sm: "min-h-11 px-5 py-2 text-base",
} as const;

/** The spec's "Candy Button", rendered as a link (this page is a mockup). */
export function CandyLink({
  href,
  tone = "violet",
  size = "md",
  withArrow = false,
  className = "",
  children,
}: {
  href: string;
  tone?: CandyTone;
  size?: keyof typeof candySizeClasses;
  withArrow?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`pg-display inline-flex items-center justify-center gap-3 rounded-full border-2 border-[#1E293B] font-bold shadow-[4px_4px_0_0_#1E293B] transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#1E293B] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_0_#1E293B] ${candySizeClasses[size]} ${candyToneClasses[tone]} ${className}`}
    >
      {children}
      {withArrow && (
        <span
          aria-hidden="true"
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${candyArrowClasses[tone]}`}
        >
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </span>
      )}
    </Link>
  );
}

/** Secondary button: outlined pill that fills with amber on hover. */
export function OutlineLink({
  href,
  className = "",
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`pg-display inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-2 border-[#1E293B] bg-transparent px-7 py-3 text-lg font-bold text-[#1E293B] transition-colors duration-300 hover:bg-[#FBBF24] ${className}`}
    >
      {children}
    </Link>
  );
}

/** Hand-drawn squiggle flourish (decorative). Colored via currentColor. */
export function Squiggle({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 14"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path
        d="M3 10 Q 13 3 23 10 T 43 10 T 63 10 T 83 10 T 103 10 T 123 10 T 143 10 T 157 10"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Confetti triangle (decorative). Colored via currentColor. */
export function TriangleShape({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path
        d="M12 3 L21 20 H3 Z"
        fill="currentColor"
        stroke="#1E293B"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** SEN wordmark in the playful-geometric visual language. */
export function SenMark({
  dark = false,
  className = "",
}: {
  dark?: boolean;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span
        aria-hidden="true"
        className="flex h-10 w-10 items-center justify-center rounded-2xl border-2 border-[#1E293B] bg-[#8B5CF6] shadow-[3px_3px_0_0_#1E293B]"
      >
        <Flower2 className="h-5 w-5 text-white" strokeWidth={2.5} />
      </span>
      <span
        className={`pg-display text-2xl font-extrabold tracking-tight ${dark ? "text-white" : "text-[#1E293B]"}`}
      >
        SEN
      </span>
    </span>
  );
}

/**
 * Hero illustration: the SEN device as a friendly sticker-style character,
 * flanked by two floating chat bubbles. Pure decoration for screen readers —
 * the surrounding copy carries the meaning.
 */
export function DeviceScene() {
  return (
    <div aria-hidden="true" className="relative mx-auto h-[460px] w-full max-w-md select-none">
      {/* Big amber circle + dot-grid tile behind everything */}
      <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#1E293B] bg-[#FBBF24]" />
      <div className="pg-dots absolute -right-2 top-6 h-36 w-36 rounded-3xl border-2 border-[#E2E8F0] bg-white" />

      {/* Confetti */}
      <TriangleShape className="pg-float absolute left-2 top-10 h-8 w-8 text-[#F472B6]" />
      <div className="pg-float absolute right-8 bottom-24 h-6 w-6 rounded-full border-2 border-[#1E293B] bg-[#34D399] [animation-delay:1.2s]" />
      <div className="pg-float absolute left-6 bottom-10 h-6 w-6 rotate-12 rounded-md border-2 border-[#1E293B] bg-[#8B5CF6] [animation-delay:0.6s]" />
      <Squiggle className="absolute -left-2 top-1/2 w-20 text-[#8B5CF6]" />

      {/* The device: rounded body, face, speaker grill, status light */}
      <div className="absolute left-1/2 top-1/2 flex h-64 w-52 -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-[2.5rem] border-2 border-[#1E293B] bg-white pt-10 shadow-[8px_8px_0_0_#1E293B]">
        {/* status LED */}
        <div className="absolute right-5 top-5 h-3.5 w-3.5 rounded-full border-2 border-[#1E293B] bg-[#34D399]" />
        {/* eyes */}
        <div className="flex items-center gap-8">
          <div className="h-7 w-4 rounded-full bg-[#1E293B]" />
          <div className="h-7 w-4 rounded-full bg-[#1E293B]" />
        </div>
        {/* cheeks */}
        <div className="mt-1 flex items-center gap-24">
          <div className="h-3 w-5 rounded-full bg-[#F472B6] opacity-70" />
          <div className="h-3 w-5 rounded-full bg-[#F472B6] opacity-70" />
        </div>
        {/* smile */}
        <svg viewBox="0 0 48 20" className="mt-1 h-5 w-12" focusable="false">
          <path
            d="M4 4 Q 24 22 44 4"
            fill="none"
            stroke="#1E293B"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
        {/* speaker grill */}
        <div className="mt-6 grid grid-cols-6 gap-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-2 w-2 rounded-full bg-[#CBD5E1]" />
          ))}
        </div>
        {/* base */}
        <div className="absolute -bottom-5 left-1/2 h-6 w-36 -translate-x-1/2 rounded-full border-2 border-[#1E293B] bg-[#F1F5F9]" />
      </div>

      {/* Chat bubble: message from a grandchild */}
      <div className="pg-float absolute -top-1 left-0 w-60 rounded-2xl rounded-bl-none border-2 border-[#1E293B] bg-white p-4 shadow-[4px_4px_0_0_#F472B6]">
        <div className="flex items-center gap-2">
          <span className="pg-display flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#1E293B] bg-[#8B5CF6] text-sm font-extrabold text-white">
            M
          </span>
          <span className="text-xs font-bold uppercase tracking-wide text-[#64748B]">
            Cháu Minh · Zalo
          </span>
        </div>
        <p className="mt-2 text-base font-semibold leading-snug text-[#1E293B]">
          Bà ơi, cuối tuần cháu về ăn cơm nhé!
        </p>
      </div>

      {/* Chat bubble: SEN reading aloud */}
      <div className="pg-float absolute -bottom-2 right-0 w-56 rounded-2xl rounded-br-none border-2 border-[#1E293B] bg-white p-4 shadow-[4px_4px_0_0_#34D399] [animation-delay:0.8s]">
        <div className="flex items-end gap-1.5" role="presentation">
          <div className="h-3 w-2 rounded-full bg-[#8B5CF6]" />
          <div className="h-6 w-2 rounded-full bg-[#F472B6]" />
          <div className="h-4 w-2 rounded-full bg-[#FBBF24]" />
          <div className="h-7 w-2 rounded-full bg-[#34D399]" />
          <div className="h-3 w-2 rounded-full bg-[#8B5CF6]" />
        </div>
        <p className="mt-2 text-base font-semibold leading-snug text-[#1E293B]">
          SEN đang đọc to cho bà nghe…
        </p>
      </div>
    </div>
  );
}
