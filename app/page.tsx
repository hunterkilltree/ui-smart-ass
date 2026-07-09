"use client";

import Link from "next/link";
import {
  Cpu,
  MessageSquare,
  MessagesSquare,
  Mic,
  Plug,
  ShieldCheck,
} from "lucide-react";
import { LogoMark } from "@/components/Logo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useAuth } from "@/lib/auth";
import { useI18n, type TKey } from "@/lib/i18n";

/*
 * SEN landing page — the public front door for families of elderly users.
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
 * (middle-click, focus semantics, prefetch).
 */
function LinkButton({
  href,
  variant = "primary",
  className,
  children,
}: {
  href: string;
  variant?: "primary" | "secondary";
  className?: string;
  children: React.ReactNode;
}) {
  const styles = {
    primary: "bg-sen text-white hover:bg-sen-dark focus-visible:outline-sen",
    secondary:
      "border border-sen/30 bg-white text-sen hover:bg-sen-light focus-visible:outline-sen",
  };
  return (
    <Link
      href={href}
      className={cx(
        // min-h-11 (44px) touch target for elderly users
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-6 py-2.5 text-base font-semibold transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2",
        styles[variant],
        className
      )}
    >
      {children}
    </Link>
  );
}

const FEATURES: {
  icon: React.ElementType;
  titleKey: TKey;
  descKey: TKey;
  iconClasses: string;
}[] = [
  {
    icon: MessagesSquare,
    titleKey: "landingFeatureChannelsTitle",
    descKey: "landingFeatureChannelsDesc",
    iconClasses: "bg-sen-light text-sen-dark",
  },
  {
    icon: Mic,
    titleKey: "landingFeatureVoiceTitle",
    descKey: "landingFeatureVoiceDesc",
    iconClasses: "bg-lotus-light text-lotus-dark",
  },
  {
    icon: Cpu,
    titleKey: "landingFeatureDeviceTitle",
    descKey: "landingFeatureDeviceDesc",
    iconClasses: "bg-leaf-light text-leaf-dark",
  },
  {
    icon: ShieldCheck,
    titleKey: "landingFeatureSafetyTitle",
    descKey: "landingFeatureSafetyDesc",
    iconClasses: "bg-amber-100 text-amber-700",
  },
];

const STEPS: { titleKey: TKey; descKey: TKey }[] = [
  { titleKey: "landingStep1Title", descKey: "landingStep1Desc" },
  { titleKey: "landingStep2Title", descKey: "landingStep2Desc" },
  { titleKey: "landingStep3Title", descKey: "landingStep3Desc" },
];

export default function Home() {
  const { user, loading } = useAuth();
  const { t } = useI18n();
  // Until the session check resolves, show the default (unauthenticated)
  // CTAs — most landing visitors are new, and the swap is non-destructive.
  const authed = !loading && !!user;

  return (
    <div className="min-h-screen">
      {/* ---------------------------------------------------------------- */}
      {/* Header                                                            */}
      {/* ---------------------------------------------------------------- */}
      <header className="border-b border-lotus-light bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <LogoMark size={40} label={t("logoAlt")} />
            <span className="text-lg font-extrabold tracking-wide text-sen">
              {t("appName")}
            </span>
          </div>
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
          className="relative overflow-hidden bg-gradient-to-br from-lotus-light via-cream to-sen-light"
        >
          {/* decorative background shapes */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-lotus/10" />
            <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-sen/10" />
            <div className="absolute right-1/4 top-8 h-6 w-6 rounded-full bg-gold/40" />
          </div>

          <div className="relative mx-auto grid max-w-5xl items-center gap-10 px-4 py-14 sm:py-20 lg:grid-cols-[3fr_2fr]">
            <div className="text-center lg:text-left">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-lotus/30 bg-white/80 px-4 py-1.5 text-base font-semibold text-lotus-dark">
                {t("tagline")}
              </p>
              <h1
                id="hero-title"
                className="text-4xl font-extrabold leading-tight tracking-tight text-ink sm:text-5xl"
              >
                {t("landingHeroTitle")}
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-slate-600 lg:mx-0">
                {t("landingHeroSubtitle")}
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
                {authed ? (
                  <LinkButton
                    href="/dashboard"
                    className="w-full px-8 py-3 text-lg sm:w-auto"
                  >
                    {t("landingOpenDashboard")}
                  </LinkButton>
                ) : (
                  <>
                    <LinkButton
                      href="/sign-up"
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
            </div>

            {/* decorative device illustration */}
            <div aria-hidden="true" className="hidden justify-center lg:flex">
              <div className="relative">
                <div className="flex h-64 w-64 items-center justify-center rounded-full bg-white/80 shadow-lg ring-1 ring-lotus-light">
                  <LogoMark size={190} label="" />
                </div>
                <span className="absolute -left-8 top-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-sen-light text-sen-dark shadow-md">
                  <MessageSquare size={26} />
                </span>
                <span className="absolute -right-6 top-1/3 flex h-14 w-14 items-center justify-center rounded-2xl bg-lotus-light text-lotus-dark shadow-md">
                  <Mic size={26} />
                </span>
                <span className="absolute -bottom-3 left-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-leaf-light text-leaf-dark shadow-md">
                  <Cpu size={26} />
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* Features — the 4 product pillars                                */}
        {/* -------------------------------------------------------------- */}
        <section aria-labelledby="features-title" className="mx-auto max-w-5xl px-4 py-14 sm:py-16">
          <div className="mb-10 text-center">
            <h2
              id="features-title"
              className="text-3xl font-extrabold tracking-tight text-ink"
            >
              {t("landingFeaturesTitle")}
            </h2>
            <p className="mt-3 text-lg text-slate-600">
              {t("landingFeaturesSubtitle")}
            </p>
          </div>
          <ul className="grid gap-5 sm:grid-cols-2">
            {FEATURES.map(({ icon: Icon, titleKey, descKey, iconClasses }) => (
              <li
                key={titleKey}
                className="rounded-2xl border border-lotus-light bg-white p-6 shadow-sm"
              >
                <span
                  aria-hidden="true"
                  className={cx(
                    "mb-4 flex h-14 w-14 items-center justify-center rounded-2xl",
                    iconClasses
                  )}
                >
                  <Icon size={28} />
                </span>
                <h3 className="text-xl font-bold text-ink">{t(titleKey)}</h3>
                <p className="mt-2 text-base leading-relaxed text-slate-600">
                  {t(descKey)}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* How it works — 3 steps                                          */}
        {/* -------------------------------------------------------------- */}
        <section aria-labelledby="how-title" className="border-y border-lotus-light bg-white">
          <div className="mx-auto max-w-5xl px-4 py-14 sm:py-16">
            <h2
              id="how-title"
              className="mb-10 text-center text-3xl font-extrabold tracking-tight text-ink"
            >
              {t("landingHowTitle")}
            </h2>
            <ol className="grid gap-8 sm:grid-cols-3">
              {STEPS.map(({ titleKey, descKey }, i) => (
                <li key={titleKey} className="text-center sm:text-left">
                  <span
                    aria-hidden="true"
                    className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sen text-xl font-extrabold text-white sm:mx-0"
                  >
                    {i + 1}
                  </span>
                  <h3 className="text-xl font-bold text-ink">{t(titleKey)}</h3>
                  <p className="mt-2 text-base leading-relaxed text-slate-600">
                    {t(descKey)}
                  </p>
                </li>
              ))}
            </ol>
            <div className="mt-12 text-center">
              {authed ? (
                <LinkButton href="/dashboard" className="px-8 py-3 text-lg">
                  {t("landingOpenDashboard")}
                </LinkButton>
              ) : (
                <LinkButton href="/sign-up" className="px-8 py-3 text-lg">
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
      <footer className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-4 py-10 text-center">
        <LogoMark size={48} label={t("logoAlt")} />
        <p className="text-base font-medium text-lotus-dark">{t("tagline")}</p>
        <p className="text-sm text-slate-500">
          © {new Date().getFullYear()} {t("appName")}
        </p>
      </footer>
    </div>
  );
}
