"use client";

import Link from "next/link";
import {
  ArrowRight,
  Check,
  Cpu,
  MessagesSquare,
  Mic,
  Plug,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { LogoMark } from "@/components/Logo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useAuth } from "@/lib/auth";
import { useI18n, type TKey } from "@/lib/i18n";

/*
 * SEN landing page — the public front door for families of elderly users,
 * restyled in the approved Playful Geometric language (see
 * design-prompts/playful-geometric.md and app/designs/playful-geometric/).
 * Speaks to both audiences: the elderly person who lives with the device and
 * the adult children who buy and manage it. Authenticated visitors get a
 * direct path to the dashboard instead of the sign-up funnel.
 */

function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Link styled to match the Button primitive in components/ui.tsx (which only
 * renders <button>). These CTAs are navigations, so they must be real links
 * (middle-click, focus semantics, prefetch). Candy pill: 2px ink border +
 * hard pop shadow via the reduced-motion-safe `pop-press` utility.
 */
function LinkButton({
  href,
  variant = "primary",
  withArrow = false,
  className,
  children,
}: {
  href: string;
  variant?: "primary" | "secondary" | "gold";
  /** Adds the decorative arrow coin from the proposal's Candy Button. */
  withArrow?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const styles = {
    primary:
      "border-ink bg-sen text-white pop-press hover:bg-sen-dark focus-visible:outline-sen",
    secondary:
      "border-ink bg-white text-ink pop-press hover:bg-gold focus-visible:outline-sen",
    // For placement on the violet CTA block — white focus ring for contrast.
    gold: "border-ink bg-gold text-ink pop-press hover:bg-amber-300 focus-visible:outline-white",
  };
  const arrows = {
    primary: "bg-white text-sen",
    secondary: "bg-sen text-white",
    gold: "bg-ink text-gold",
  };
  return (
    <Link
      href={href}
      className={cx(
        // min-h-11 (44px) touch target for elderly users
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border-2 px-6 py-2.5 text-base font-bold",
        "focus-visible:outline-2 focus-visible:outline-offset-2",
        styles[variant],
        className
      )}
    >
      {children}
      {withArrow && (
        <span
          aria-hidden="true"
          className={cx(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
            arrows[variant]
          )}
        >
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </span>
      )}
    </Link>
  );
}

/** Hand-drawn squiggle flourish (decorative). Colored via currentColor. */
function Squiggle({ className = "" }: { className?: string }) {
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
function TriangleShape({ className = "" }: { className?: string }) {
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
        stroke="var(--color-ink)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Hero illustration ported from the approved proposal: the SEN device as a
 * friendly sticker-style character flanked by two chat bubbles. Pure
 * decoration (aria-hidden) — the surrounding copy carries the meaning.
 * All positions are static literals (deterministic SSR).
 */
function HeroVignette({
  sender,
  message,
  reading,
}: {
  sender: string;
  message: string;
  reading: string;
}) {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto h-[460px] w-full max-w-md select-none"
    >
      {/* backdrop: big gold circle + dot-grid tile (no text on the dots) */}
      <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink bg-gold" />
      <div className="pattern-dots absolute -right-2 top-6 h-36 w-36 rounded-3xl border-2 border-slate-200 bg-white" />

      {/* confetti */}
      <TriangleShape className="absolute left-2 top-10 h-8 w-8 text-lotus" />
      <div className="absolute bottom-24 right-8 h-6 w-6 rounded-full border-2 border-ink bg-leaf" />
      <div className="absolute bottom-10 left-6 h-6 w-6 rotate-12 rounded-md border-2 border-ink bg-sen-bright" />

      {/* the device: rounded body, face, speaker grill, status light */}
      <div className="absolute left-1/2 top-1/2 flex h-64 w-52 -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-[2.5rem] border-2 border-ink bg-white pt-10 shadow-pop-lg">
        <div className="absolute right-5 top-5 h-3.5 w-3.5 rounded-full border-2 border-ink bg-leaf" />
        {/* eyes */}
        <div className="flex items-center gap-8">
          <div className="h-7 w-4 rounded-full bg-ink" />
          <div className="h-7 w-4 rounded-full bg-ink" />
        </div>
        {/* cheeks */}
        <div className="mt-1 flex items-center gap-24">
          <div className="h-3 w-5 rounded-full bg-lotus opacity-70" />
          <div className="h-3 w-5 rounded-full bg-lotus opacity-70" />
        </div>
        {/* smile */}
        <svg viewBox="0 0 48 20" className="mt-1 h-5 w-12" focusable="false">
          <path
            d="M4 4 Q 24 22 44 4"
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
        {/* speaker grill */}
        <div className="mt-6 grid grid-cols-6 gap-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-2 w-2 rounded-full bg-slate-300" />
          ))}
        </div>
        {/* base */}
        <div className="absolute -bottom-5 left-1/2 h-6 w-36 -translate-x-1/2 rounded-full border-2 border-ink bg-slate-100" />
      </div>

      {/* chat bubble: message from a grandchild */}
      <div className="absolute -top-1 left-0 w-60 rounded-2xl rounded-bl-none border-2 border-ink bg-white p-4 shadow-[4px_4px_0_0_var(--color-lotus)]">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-ink bg-sen font-display text-sm font-extrabold text-white">
            M
          </span>
          <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
            {sender}
          </span>
        </div>
        <p className="mt-2 text-base font-semibold leading-snug text-ink">
          {message}
        </p>
      </div>

      {/* chat bubble: SEN reading aloud (voice bars) */}
      <div className="absolute -bottom-2 right-0 w-56 rounded-2xl rounded-br-none border-2 border-ink bg-white p-4 shadow-[4px_4px_0_0_var(--color-leaf)]">
        <div className="flex items-end gap-1.5">
          <div className="h-3 w-2 rounded-full bg-sen-bright" />
          <div className="h-6 w-2 rounded-full bg-lotus" />
          <div className="h-4 w-2 rounded-full bg-gold" />
          <div className="h-7 w-2 rounded-full bg-leaf" />
          <div className="h-3 w-2 rounded-full bg-sen-bright" />
        </div>
        <p className="mt-2 text-base font-semibold leading-snug text-ink">
          {reading}
        </p>
      </div>
    </div>
  );
}

/** One run of the marquee keywords; the strip renders two copies. */
function MarqueeRow({ words }: { words: string[] }) {
  return (
    <div className="flex w-max shrink-0 items-center">
      {words.map((word) => (
        <span key={word} className="flex items-center">
          <span className="px-6 font-display text-lg font-extrabold uppercase tracking-wide text-ink">
            {word}
          </span>
          <Star
            className="h-5 w-5 shrink-0 fill-gold text-ink"
            strokeWidth={2.5}
            aria-hidden="true"
          />
        </span>
      ))}
    </div>
  );
}

/** Dashed connector line drawn behind card/step rows (decorative). */
function DashedConnector({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={className}
      viewBox="0 0 1000 8"
      preserveAspectRatio="none"
    >
      <path
        d="M0 4 H1000"
        stroke="#94A3B8"
        strokeWidth="3"
        strokeDasharray="10 12"
        strokeLinecap="round"
      />
    </svg>
  );
}

const TRUST_POINTS: TKey[] = [
  "landingTrustSetup",
  "landingTrustVietnamese",
  "landingTrustRemote",
];

const STATS: { valueKey: TKey; labelKey: TKey; chip: string }[] = [
  {
    valueKey: "landingStat1Value",
    labelKey: "landingStat1Label",
    chip: "bg-sen-bright",
  },
  {
    valueKey: "landingStat2Value",
    labelKey: "landingStat2Label",
    chip: "bg-lotus",
  },
  {
    valueKey: "landingStat3Value",
    labelKey: "landingStat3Label",
    chip: "bg-gold",
  },
  {
    valueKey: "landingStat4Value",
    labelKey: "landingStat4Label",
    chip: "bg-leaf",
  },
];

const NAV_LINKS: { href: string; labelKey: TKey }[] = [
  { href: "#features", labelKey: "landingNavFeatures" },
  { href: "#how-it-works", labelKey: "landingNavHow" },
  { href: "#story", labelKey: "landingNavStory" },
];

const FOOTER_COLUMNS: {
  headingKey: TKey;
  links: { href: string; labelKey?: TKey; label?: string }[];
}[] = [
  {
    headingKey: "landingFooterProduct",
    links: [
      { href: "#features", labelKey: "landingNavFeatures" },
      { href: "#how-it-works", labelKey: "landingNavHow" },
      { href: "#story", labelKey: "landingNavStory" },
    ],
  },
  {
    headingKey: "landingFooterSupport",
    links: [
      { href: "#how-it-works", labelKey: "landingFooterGuide" },
      { href: "mailto:giadinh@sen.vn", label: "giadinh@sen.vn" },
    ],
  },
  {
    headingKey: "landingFooterAccount",
    links: [
      { href: "/sign-in", labelKey: "signIn" },
      { href: "/sign-up", labelKey: "signUp" },
      { href: "/dashboard", labelKey: "landingOpenDashboard" },
    ],
  },
];

const FEATURES: {
  icon: React.ElementType;
  titleKey: TKey;
  descKey: TKey;
  /** Icon coin fill (decoration; ink text on bright fills, white on sen). */
  coin: string;
  /** Colored hard shadow revealed on hover (sticker-card signature). */
  hoverShadow: string;
}[] = [
  {
    icon: MessagesSquare,
    titleKey: "landingFeatureChannelsTitle",
    descKey: "landingFeatureChannelsDesc",
    coin: "bg-sen text-white",
    hoverShadow: "hover:shadow-[8px_8px_0_0_var(--color-sen-bright)]",
  },
  {
    icon: Mic,
    titleKey: "landingFeatureVoiceTitle",
    descKey: "landingFeatureVoiceDesc",
    coin: "bg-lotus text-ink",
    hoverShadow: "hover:shadow-[8px_8px_0_0_var(--color-lotus)]",
  },
  {
    icon: Cpu,
    titleKey: "landingFeatureDeviceTitle",
    descKey: "landingFeatureDeviceDesc",
    coin: "bg-leaf text-ink",
    hoverShadow: "hover:shadow-[8px_8px_0_0_var(--color-leaf)]",
  },
  {
    icon: ShieldCheck,
    titleKey: "landingFeatureSafetyTitle",
    descKey: "landingFeatureSafetyDesc",
    coin: "bg-gold text-ink",
    hoverShadow: "hover:shadow-[8px_8px_0_0_var(--color-gold)]",
  },
];

const STEPS: { titleKey: TKey; descKey: TKey; circle: string }[] = [
  {
    titleKey: "landingStep1Title",
    descKey: "landingStep1Desc",
    circle: "bg-sen text-white",
  },
  {
    titleKey: "landingStep2Title",
    descKey: "landingStep2Desc",
    circle: "bg-lotus text-ink",
  },
  {
    titleKey: "landingStep3Title",
    descKey: "landingStep3Desc",
    circle: "bg-gold text-ink",
  },
];

export default function Home() {
  const { user, loading } = useAuth();
  const { t } = useI18n();
  // Until the session check resolves, show the default (unauthenticated)
  // CTAs — most landing visitors are new, and the swap is non-destructive.
  const authed = !loading && !!user;

  // Channel names are brand names (identical in vi/en); the rest localizes.
  const marqueeWords = [
    "Zalo",
    "Messenger",
    "Telegram",
    t("landingTrustVietnamese"),
    t("landingMarqueeVoice"),
    t("landingMarqueeSafety"),
    t("landingMarqueeNoPhone"),
  ];

  return (
    <div className="min-h-screen">
      {/* ---------------------------------------------------------------- */}
      {/* Header                                                            */}
      {/* ---------------------------------------------------------------- */}
      <header>
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4">
          <div className="flex items-center gap-2.5">
            <LogoMark size={40} label={t("logoAlt")} />
            <span className="font-display text-2xl font-extrabold tracking-tight text-ink">
              {t("appName")}
            </span>
          </div>
          {/* anchor nav to the page sections (proposal composition) */}
          <nav
            aria-label={t("landingNavLabel")}
            className="hidden items-center gap-6 text-base font-bold text-ink md:flex"
          >
            {NAV_LINKS.map(({ href, labelKey }) => (
              <a
                key={href}
                href={href}
                className="rounded-md px-1 py-2 hover:text-sen focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sen"
              >
                {t(labelKey)}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            {authed ? (
              <LinkButton href="/dashboard" className="hidden sm:inline-flex">
                {t("landingOpenDashboard")}
              </LinkButton>
            ) : (
              <LinkButton
                href="/sign-in"
                variant="secondary"
                className="hidden sm:inline-flex"
              >
                {t("signIn")}
              </LinkButton>
            )}
          </div>
        </div>
      </header>

      <main>
        {/* -------------------------------------------------------------- */}
        {/* Hero                                                            */}
        {/* -------------------------------------------------------------- */}
        <section
          aria-labelledby="hero-title"
          className="relative overflow-hidden"
        >
          {/* decorative background confetti (hidden on small screens so it
              never collides with text) */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <TriangleShape className="absolute right-10 top-6 hidden h-10 w-10 text-gold lg:block" />
            <div className="absolute -left-24 top-40 hidden h-56 w-56 rounded-full border-2 border-ink bg-slate-100 lg:block" />
          </div>

          <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:py-20 lg:grid-cols-[3fr_2fr]">
            <div className="pop-in text-center lg:text-left">
              <p className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-white px-4 py-2 text-base font-bold text-ink shadow-pop-sm">
                <Sparkles
                  className="h-5 w-5 shrink-0 text-sen"
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
                {t("tagline")}
              </p>
              <h1
                id="hero-title"
                className="mt-6 font-display text-4xl font-extrabold leading-[1.15] tracking-tight text-ink sm:text-5xl"
              >
                {t("landingHeroTitleLead")}{" "}
                <span className="inline-block -rotate-1 rounded-xl border-2 border-ink bg-gold px-3 py-0.5">
                  {t("landingHeroTitleHighlight")}
                </span>
                {t("landingHeroTitleTail")}
              </h1>
              <Squiggle className="mx-auto mt-4 w-36 text-lotus lg:mx-0" />
              <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-600 lg:mx-0">
                {t("landingHeroSubtitle")}
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
                {authed ? (
                  <LinkButton
                    href="/dashboard"
                    withArrow
                    className="w-full px-8 py-3 text-lg sm:w-auto"
                  >
                    {t("landingOpenDashboard")}
                  </LinkButton>
                ) : (
                  <>
                    <LinkButton
                      href="/sign-up"
                      withArrow
                      className="w-full px-8 py-3 text-lg sm:w-auto"
                    >
                      {t("signUp")}
                    </LinkButton>
                    <LinkButton
                      href="/sign-in"
                      variant="secondary"
                      className="w-full px-8 py-3 text-lg sm:w-auto"
                    >
                      {t("signIn")}
                    </LinkButton>
                  </>
                )}
              </div>
              {/* trust-point checklist (proposal hero) */}
              <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3 lg:justify-start">
                {TRUST_POINTS.map((key) => (
                  <li
                    key={key}
                    className="flex items-center gap-2 text-base font-semibold text-ink"
                  >
                    <span
                      aria-hidden="true"
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-leaf"
                    >
                      <Check className="h-3.5 w-3.5 text-ink" strokeWidth={3} />
                    </span>
                    {t(key)}
                  </li>
                ))}
              </ul>
            </div>

            {/* decorative device + message-bubble vignette */}
            <div
              aria-hidden="true"
              className="pop-in hidden lg:block [animation-delay:0.15s]"
            >
              <HeroVignette
                sender={t("landingBubbleSender")}
                message={t("landingBubbleMessage")}
                reading={t("landingBubbleReading")}
              />
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* Marquee keyword strip (decorative)                              */}
        {/* -------------------------------------------------------------- */}
        <div
          aria-hidden="true"
          className="overflow-hidden border-y-2 border-ink bg-white py-4"
        >
          <div className="marquee-track flex w-max">
            <MarqueeRow words={marqueeWords} />
            <MarqueeRow words={marqueeWords} />
          </div>
        </div>

        {/* -------------------------------------------------------------- */}
        {/* Stats / trust strip                                             */}
        {/* -------------------------------------------------------------- */}
        <section
          aria-label={t("landingStatsTitle")}
          className="mx-auto max-w-6xl px-4 py-16 sm:py-20"
        >
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map(({ valueKey, labelKey, chip }) => (
              <li
                key={valueKey}
                className="relative rounded-2xl border-2 border-ink bg-white p-6 shadow-sticker"
              >
                <span
                  aria-hidden="true"
                  className={cx(
                    "absolute -top-3 right-5 h-6 w-6 rotate-12 rounded-md border-2 border-ink",
                    chip
                  )}
                />
                <p className="font-display text-4xl font-extrabold tracking-tight text-ink">
                  {t(valueKey)}
                </p>
                <p className="mt-2 text-base leading-snug text-slate-600">
                  {t(labelKey)}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* Features — the 4 product pillars                                */}
        {/* -------------------------------------------------------------- */}
        <section
          id="features"
          aria-labelledby="features-title"
          className="relative border-y-2 border-ink bg-slate-100"
        >
          {/* decorative dot tile, kept clear of all text */}
          <div
            aria-hidden="true"
            className="pattern-dots absolute right-8 top-8 hidden h-28 w-28 rounded-3xl border-2 border-slate-300 bg-white lg:block"
          />
          <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-20">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <h2
                id="features-title"
                className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl"
              >
                {t("landingFeaturesTitle")}
              </h2>
              <p className="mt-3 text-lg text-slate-600">
                {t("landingFeaturesSubtitle")}
              </p>
              <Squiggle className="mx-auto mt-4 w-32 text-gold" />
            </div>
            {/* extra y-gap leaves room for the overhanging icon coins */}
            <div className="relative">
              {/* dashed connector behind the sticker cards (proposal) */}
              <DashedConnector className="absolute inset-x-8 top-0 hidden h-2 lg:block" />
              <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map(({ icon: Icon, titleKey, descKey, coin, hoverShadow }) => (
                <li
                  key={titleKey}
                  className={cx(
                    "relative rounded-2xl border-2 border-ink bg-white px-6 pb-7 pt-12 shadow-sticker-lg transition-shadow duration-300",
                    hoverShadow
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cx(
                      "wiggle-on-hover absolute -top-7 left-6 flex h-14 w-14 items-center justify-center rounded-full border-2 border-ink shadow-pop-sm",
                      coin
                    )}
                  >
                    <Icon size={28} strokeWidth={2.5} />
                  </span>
                  <h3 className="font-display text-xl font-bold text-ink">
                    {t(titleKey)}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-slate-600">
                    {t(descKey)}
                  </p>
                </li>
              ))}
              </ul>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* How it works — 3 steps                                          */}
        {/* -------------------------------------------------------------- */}
        <section
          id="how-it-works"
          aria-labelledby="how-title"
          className="mx-auto max-w-6xl px-4 py-16 sm:py-20"
        >
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2
              id="how-title"
              className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl"
            >
              {t("landingHowTitle")}
            </h2>
            <Squiggle className="mx-auto mt-4 w-32 text-leaf" />
          </div>
          <ol className="relative grid gap-10 sm:grid-cols-3 sm:gap-8">
            {/* dashed line linking the step circles */}
            <DashedConnector className="absolute inset-x-[16%] top-7 hidden h-2 sm:block" />
            {STEPS.map(({ titleKey, descKey, circle }, i) => (
              <li
                key={titleKey}
                className="relative flex flex-col items-center text-center"
              >
                <span
                  aria-hidden="true"
                  className={cx(
                    "mb-5 flex h-14 w-14 items-center justify-center rounded-full border-2 border-ink font-display text-2xl font-extrabold shadow-pop",
                    circle
                  )}
                >
                  {i + 1}
                </span>
                <h3 className="font-display text-xl font-bold text-ink">
                  {t(titleKey)}
                </h3>
                <p className="mt-2 max-w-xs text-base leading-relaxed text-slate-600">
                  {t(descKey)}
                </p>
              </li>
            ))}
          </ol>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* Testimonial — the family-story speech bubble                    */}
        {/* -------------------------------------------------------------- */}
        <section
          id="story"
          aria-labelledby="story-title"
          className="mx-auto max-w-6xl px-4 pb-16 sm:pb-20"
        >
          <h2 id="story-title" className="sr-only">
            {t("landingNavStory")}
          </h2>
          <div className="relative mx-auto max-w-3xl">
            <div
              aria-hidden="true"
              className="pattern-dots absolute -left-10 -top-8 hidden h-32 w-32 rounded-3xl md:block"
            />
            {/* speech bubble: rounded except the bottom-left "tail" corner */}
            <figure className="relative rounded-3xl rounded-bl-none border-2 border-ink bg-white p-8 shadow-[8px_8px_0_0_var(--color-lotus)] sm:p-12">
              <span
                aria-hidden="true"
                className="absolute -top-9 right-6 flex h-24 w-24 rotate-12 flex-col items-center justify-center rounded-full border-2 border-ink bg-gold text-center font-display text-[11px] font-extrabold uppercase leading-tight text-ink shadow-pop"
              >
                <Star className="mb-1 h-5 w-5 fill-ink text-ink" />
                {t("landingStoryBadge")}
              </span>
              <blockquote className="font-display text-xl font-bold leading-relaxed text-ink sm:text-2xl">
                &ldquo;{t("landingStoryQuote")}&rdquo;
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-4">
                <span
                  aria-hidden="true"
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-leaf font-display text-lg font-extrabold text-ink"
                >
                  {t("landingStoryInitials")}
                </span>
                <span>
                  <span className="block text-lg font-bold text-ink">
                    {t("landingStoryName")}
                  </span>
                  <span className="block text-base text-slate-600">
                    {t("landingStoryRole")}
                  </span>
                </span>
              </figcaption>
            </figure>
          </div>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* Final CTA                                                       */}
        {/* -------------------------------------------------------------- */}
        <section
          aria-labelledby="cta-title"
          className="mx-auto max-w-6xl px-4 pb-16 sm:pb-20"
        >
          <div className="relative overflow-hidden rounded-[2.5rem] border-2 border-ink bg-sen px-6 py-14 text-center shadow-pop-lg sm:px-12">
            {/* confetti inside the CTA block (static, decorative) */}
            <div
              aria-hidden="true"
              className="absolute left-8 top-8 hidden h-6 w-6 rounded-full border-2 border-ink bg-gold sm:block"
            />
            <TriangleShape className="absolute right-10 top-10 hidden h-8 w-8 text-lotus sm:block" />
            <div
              aria-hidden="true"
              className="absolute -bottom-6 left-10 hidden h-16 w-16 rotate-12 rounded-2xl border-2 border-ink bg-leaf sm:block"
            />
            <h2
              id="cta-title"
              className="mx-auto max-w-2xl font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
            >
              {t("landingCtaTitle")}
            </h2>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              {authed ? (
                <LinkButton
                  href="/dashboard"
                  variant="gold"
                  withArrow
                  className="px-8 py-3 text-lg"
                >
                  {t("landingOpenDashboard")}
                </LinkButton>
              ) : (
                <LinkButton
                  href="/sign-up"
                  variant="gold"
                  className="px-8 py-3 text-lg"
                >
                  <Plug size={22} aria-hidden="true" />
                  {t("signUp")}
                </LinkButton>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* ---------------------------------------------------------------- */}
      {/* Footer                                                            */}
      {/* ---------------------------------------------------------------- */}
      <footer className="border-t-2 border-ink bg-ink text-slate-300">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <LogoMark size={40} label={t("logoAlt")} />
              <span className="font-display text-2xl font-extrabold tracking-tight text-white">
                {t("appName")}
              </span>
            </div>
            <p className="mt-4 max-w-xs text-base leading-relaxed">
              {t("landingFooterTagline")}
            </p>
          </div>
          {FOOTER_COLUMNS.map(({ headingKey, links }) => (
            <nav key={headingKey} aria-label={t(headingKey)}>
              <h2 className="font-display text-base font-extrabold uppercase tracking-widest text-white">
                {t(headingKey)}
              </h2>
              <ul className="mt-4 space-y-3">
                {links.map(({ href, labelKey, label }) => {
                  const linkClasses =
                    "inline-block rounded-sm py-1 text-base underline-offset-4 hover:text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";
                  const text = labelKey ? t(labelKey) : label;
                  return (
                    <li key={href}>
                      {href.startsWith("/") ? (
                        <Link href={href} className={linkClasses}>
                          {text}
                        </Link>
                      ) : (
                        <a href={href} className={linkClasses}>
                          {text}
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>
          ))}
        </div>
        <div className="border-t border-slate-600">
          <p className="mx-auto max-w-6xl px-4 py-6 text-sm">
            © {new Date().getFullYear()} {t("appName")} — {t("tagline")}
          </p>
        </div>
      </footer>
    </div>
  );
}
