import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

/*
 * Internal design-proposal gallery — team-facing (English-only, noindex).
 * Each linked page is a standalone visual-direction proposal for the SEN
 * landing page, specced from design-prompts/<slug>.md. The proposal routes
 * themselves are owned by other workstreams; this page only links to them.
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
  /** True for the shipping brand entry (rendered with a highlight ring). */
  production?: boolean;
}

const PROPOSALS: Proposal[] = [
  {
    href: "/designs/playful-geometric",
    name: "Playful Geometric",
    character:
      "Memphis-inspired optimism on a stable grid: primitive shapes, hard offset “sticker” shadows and confetti color pops. Friendly, tactile and energetic — it invites clicking and smiles at you.",
    palette: ["#8B5CF6", "#F472B6", "#FBBF24", "#34D399", "#FFFDF5"],
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
      "The shipping SEN experience: lotus warmth on a cream canvas, senior-first type scale and AA-checked brand tokens. The baseline the four proposals are measured against.",
    palette: ["#2f6bb3", "#f27da5", "#5ea53c", "#c9a24b", "#faf3ec"],
    production: true,
  },
];

export default function DesignsPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <Link
        href="/"
        className="inline-flex min-h-11 items-center gap-2 rounded-xl px-2 py-2 text-base font-medium text-sen hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sen"
      >
        <ArrowLeft size={18} aria-hidden="true" />
        Back to landing page
      </Link>

      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        Landing page design proposals
      </h1>
      <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600">
        Internal gallery — four visual-direction proposals for the SEN landing
        page, each built as a standalone page from the style spec in{" "}
        <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm">
          design-prompts/
        </code>
        . They explore look and feel only; copy and structure mirror the
        production landing. This page is not linked from the product and is
        excluded from search indexing.
      </p>

      <ul className="mt-10 grid gap-5 sm:grid-cols-2">
        {PROPOSALS.map((p) => (
          <li key={p.href}>
            <Link
              href={p.href}
              className={
                "group flex h-full flex-col rounded-2xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sen " +
                (p.production
                  ? "border-sen/40 ring-1 ring-sen/20"
                  : "border-lotus-light")
              }
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-xl font-bold text-ink group-hover:text-sen">
                  {p.name}
                </h2>
                <ArrowUpRight
                  size={22}
                  aria-hidden="true"
                  className="shrink-0 text-slate-400 transition-colors group-hover:text-sen"
                />
              </div>
              <p className="mt-2 flex-1 text-base leading-relaxed text-slate-600">
                {p.character}
              </p>
              <div className="mt-5 flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5" aria-hidden="true">
                  {p.palette.map((hex) => (
                    <span
                      key={hex}
                      title={hex}
                      className="h-5 w-5 rounded-full border border-slate-200"
                      style={{ backgroundColor: hex }}
                    />
                  ))}
                </span>
                <span className="text-base font-semibold text-sen">
                  {p.production ? "View production" : "View proposal"}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
