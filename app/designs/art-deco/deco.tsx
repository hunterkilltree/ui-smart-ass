import type { ReactNode } from "react";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/* Local ornament primitives for the Art Deco design proposal.         */
/* Server-safe, no state. Palette per design-prompts/art-deco.md:      */
/*   obsidian #0A0A0A · charcoal #141414 · gold #D4AF37 ·              */
/*   champagne #F2F0E4 · pewter #888888 · midnight #1E3D59             */
/* ------------------------------------------------------------------ */

function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

/** Thin gold rule with a small rotated diamond at its center. Decorative. */
export function GoldRule({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cx("flex items-center justify-center gap-3", className)}
    >
      <span className="h-px w-16 bg-linear-to-r from-transparent to-[#D4AF37]/80 sm:w-24" />
      <span className="h-2 w-2 rotate-45 border border-[#D4AF37]" />
      <span className="h-px w-16 bg-linear-to-l from-transparent to-[#D4AF37]/80 sm:w-24" />
    </div>
  );
}

/** Centered ceremonial section heading: gold eyebrow, rule, big serif title. */
export function SectionHeading({
  eyebrow,
  title,
  className,
}: {
  eyebrow: string;
  title: string;
  className?: string;
}) {
  return (
    <div className={cx("mx-auto max-w-3xl text-center", className)}>
      <p className="deco-body text-base uppercase tracking-[0.35em] text-[#D4AF37]">
        {eyebrow}
      </p>
      <GoldRule className="my-6" />
      <h2 className="deco-display text-3xl leading-snug uppercase tracking-[0.15em] text-[#F2F0E4] sm:text-4xl">
        {title}
      </h2>
    </div>
  );
}

/**
 * Stepped L-brackets on opposite corners (top-left + bottom-right).
 * Parent needs `relative` and, for the hover reveal, the `group` class.
 */
export function CornerBrackets() {
  const common =
    "pointer-events-none absolute h-5 w-5 border-[#D4AF37] opacity-50 transition-opacity duration-500 group-hover:opacity-100";
  return (
    <>
      <span
        aria-hidden="true"
        className={cx(common, "top-2 left-2 border-t-2 border-l-2")}
      />
      <span
        aria-hidden="true"
        className={cx(common, "right-2 bottom-2 border-r-2 border-b-2")}
      />
    </>
  );
}

/** 45°-rotated square frame; content counter-rotates to stay upright. */
export function Diamond({ children }: { children: ReactNode }) {
  return (
    <span
      aria-hidden="true"
      className="inline-flex h-16 w-16 rotate-45 items-center justify-center border border-[#D4AF37] bg-[#0A0A0A] shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-transform duration-500 group-hover:rotate-0"
    >
      <span className="-rotate-45 text-[#D4AF37] transition-transform duration-500 group-hover:rotate-0">
        {children}
      </span>
    </span>
  );
}

/** Double-framed diamond holding a Roman numeral (visual only — pair with sr-only text). */
export function StepDiamond({ numeral }: { numeral: string }) {
  return (
    <span
      aria-hidden="true"
      className="relative inline-flex h-20 w-20 items-center justify-center"
    >
      <span className="absolute inset-0 rotate-45 border-2 border-[#D4AF37] bg-[#0A0A0A] shadow-[0_0_18px_rgba(212,175,55,0.25)]" />
      <span className="absolute inset-2 rotate-45 border border-[#D4AF37]/40" />
      <span className="deco-display relative text-3xl leading-none text-[#D4AF37]">
        {numeral}
      </span>
    </span>
  );
}

/** Architectural CTA link: sharp corners, all-caps, gold glow on hover. */
export function DecoCta({
  href,
  variant = "solid",
  children,
  className,
}: {
  href: string;
  variant?: "solid" | "outline";
  children: ReactNode;
  className?: string;
}) {
  const styles = {
    solid:
      "border-2 border-[#D4AF37] bg-[#D4AF37] text-[#0A0A0A] shadow-[0_0_15px_rgba(212,175,55,0.25)] hover:border-[#F2E8C4] hover:bg-[#F2E8C4] hover:shadow-[0_0_25px_rgba(212,175,55,0.45)]",
    outline:
      "border-2 border-[#D4AF37] bg-transparent text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0A0A0A] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]",
  };
  return (
    <Link
      href={href}
      className={cx(
        "deco-body inline-flex min-h-12 items-center justify-center px-8 py-3 text-center text-base font-semibold uppercase tracking-[0.2em] transition-all duration-300",
        styles[variant],
        className
      )}
    >
      {children}
    </Link>
  );
}
