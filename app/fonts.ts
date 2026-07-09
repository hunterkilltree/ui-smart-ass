import { Outfit, Plus_Jakarta_Sans } from "next/font/google";

/*
 * Spec fonts (design-prompts/playful-geometric.md): Outfit for display /
 * headings, Plus Jakarta Sans for body. Self-hosted via next/font — the
 * files are downloaded once at build time and served from /_next/static,
 * so there are no runtime requests to Google and no new npm dependencies.
 *
 * Outfit ships no Vietnamese subset (latin + latin-ext only), so the
 * display stack falls back per-glyph to Plus Jakarta Sans, which does
 * cover Vietnamese — see --font-display in app/globals.css.
 *
 * Both families are variable fonts, so no `weight` list is needed.
 */
export const outfit = Outfit({
  subsets: ["latin", "latin-ext"],
  variable: "--font-outfit",
  display: "swap",
});

export const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext", "vietnamese"],
  variable: "--font-plus-jakarta",
  display: "swap",
});
