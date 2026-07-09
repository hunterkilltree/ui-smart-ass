import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

/*
 * Internal design-proposal gallery — team-facing (English-only, noindex).
 * Each linked page is a standalone visual-direction proposal for the SEN
 * landing page, specced from design-prompts/<slug>.md. Playful Geometric won
 * the review and now ships in production; the other three proposals are kept
 * as archived references. The proposal routes themselves are owned by other
 * workstreams; this page only links to them.
 */

export const metadata: Metadata = {
  title: "Landing Design Proposals — SEN (internal)",
  description:
    "Internal gallery of visual-direction proposals for the SEN landing page.",
  robots: { index: false, follow: false },
};

interface Proposal {
  href: string;
  name: string;
  /** 1–2 sentence character summary, sourced from design-prompts/<slug>.md. */
  character: string;
  /** Small palette preview, most representative colors first. */
  palette: string[];
  /** True for the winning proposal that now ships in production. */
  approved?: boolean;
  /** True for the shipping brand entry (links to the live landing page). */
  production?: boolean;
}

const PROPOSALS: Proposal[] = [
  {
    href: "/designs/playful-geometric",
    name: "Playful Geometric",
    character:
      "Memphis-inspired optimism on a stable grid: primitive shapes, hard offset “sticker” shadows and confetti color pops. Friendly, tactile and energetic — it invites clicking and smiles at you.",
    palette: ["#8B5CF6", "#F472B6", "#FBBF24", "#34D399", "#FFFDF5"],
    approved: true,
  },
  {
    href: "/designs/web3",
    name: "Web3 / Bitcoin DeFi",
    character:
      "A true-void dark aesthetic where Bitcoin orange and digital gold glow against the darkness. Mathematical precision, glass-morphism layers and monospace data — secure, technical, valuable.",
    palette: ["#F7931A", "#EA580C", "#FFD600", "#0F1115", "#030304"],
  },
  {
    href: "/designs/art-deco",
    name: "Art Deco",
    character:
      "The “Gatsby” aesthetic: metallic gold on obsidian black with sunbursts, chevrons and stepped ziggurat geometry. Maximalist restraint and ceremonial symmetry — expensive, confident, timeless.",
    palette: ["#D4AF37", "#F2E8C4", "#1E3D59", "#141414", "#0A0A0A"],
  },
  {
    href: "/designs/swiss-minimalist",
    name: "Swiss Minimalist",
    character:
      "The International Typographic Style: the grid as law, massive grotesque type as the interface, and objective flush-left layouts. Monochrome calm pierced only by Swiss Red as a functional signal.",
    palette: ["#FF3000", "#000000", "#F2F2F2", "#FFFFFF"],
  },
  {
    href: "/",
    name: "Current brand (production)",
    character:
      "The shipping SEN experience — now wearing the approved Playful Geometric language: violet candy buttons, sticker cards with hard pop shadows and senior-first, AA-checked type on warm cream.",
    palette: ["#7C3AED", "#F472B6", "#FBBF24", "#34D399", "#FFFDF5"],
    production: true,
  },
];

export default function DesignsPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <Link
        href="/"
        className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-ink bg-white px-4 py-2 text-base font-bold text-ink pop-press hover:bg-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sen"
      >
        <ArrowLeft size={18} strokeWidth={2.5} aria-hidden="true" />
        Back to landing page
      </Link>

      <h1 className="mt-6 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        Landing page design proposals
      </h1>
      <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600">
        Internal gallery — four visual-direction proposals for the SEN landing
        page, each built as a standalone page from the style spec in{" "}
        <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm">
          design-prompts/
        </code>
        . <strong className="text-ink">Playful Geometric was approved</strong>{" "}
        and now ships as the production look; the other three remain here as
        archived references. This page is not linked from the product and is
        excluded from search indexing.
      </p>

      <ul className="mt-10 grid gap-6 sm:grid-cols-2">
        {PROPOSALS.map((p) => (
          <li key={p.href}>
            <Link
              href={p.href}
              className={
                "group flex h-full flex-col rounded-2xl border-2 border-ink p-6 pop-press focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sen " +
                (p.approved ? "bg-sen-light" : "bg-white")
              }
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-display text-xl font-bold text-ink group-hover:text-sen">
                  {p.name}
                </h2>
                <ArrowUpRight
                  size={22}
                  strokeWidth={2.5}
                  aria-hidden="true"
                  className="shrink-0 text-slate-500 transition-colors group-hover:text-sen"
                />
              </div>
              {p.approved && (
                <p className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full border-2 border-leaf-dark bg-leaf-light px-3 py-1 text-sm font-bold text-leaf-dark">
                  ✅ Approved — now in production
                </p>
              )}
              {!p.approved && !p.production && (
                <p className="mt-3 inline-flex w-fit items-center rounded-full border-2 border-slate-500 bg-slate-100 px-3 py-1 text-sm font-bold text-slate-600">
                  Archived proposal
                </p>
              )}
              <p className="mt-3 flex-1 text-base leading-relaxed text-slate-600">
                {p.character}
              </p>
              <div className="mt-5 flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5" aria-hidden="true">
                  {p.palette.map((hex) => (
                    <span
                      key={hex}
                      title={hex}
                      className="h-5 w-5 rounded-full border-2 border-ink"
                      style={{ backgroundColor: hex }}
                    />
                  ))}
                </span>
                <span className="text-base font-bold text-sen">
                  {p.production
                    ? "View production"
                    : p.approved
                      ? "View proposal"
                      : "View archived proposal"}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
