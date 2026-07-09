"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MessageSquare, Mic, ScrollText, Cpu, LogOut } from "lucide-react";
import { LogoMark } from "@/components/Logo";
import { useAuth } from "@/lib/auth";
import { tApiError, useI18n, type TKey } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { FullPageSpinner, ErrorState, Badge } from "@/components/ui";

const TABS: { href: string; key: TKey; icon: React.ElementType; devOnly?: boolean }[] = [
  { href: "/dashboard/contacts", key: "contacts", icon: MessageSquare },
  { href: "/dashboard/voice-training", key: "voiceTraining", icon: Mic },
  { href: "/dashboard/logs", key: "logs", icon: ScrollText, devOnly: true },
  { href: "/dashboard/device", key: "deviceConfig", icon: Cpu },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, bootError, retry, signOut } = useAuth();
  const { t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();

  const navRef = useRef<HTMLElement | null>(null);
  const activeTabRef = useRef<HTMLAnchorElement | null>(null);
  // Edge-fade hints: which sides of the tab bar have off-screen content.
  const [fade, setFade] = useState({ left: false, right: false });

  const updateFade = useCallback(() => {
    const el = navRef.current;
    if (!el) return;
    const left = el.scrollLeft > 4;
    const right = el.scrollLeft + el.clientWidth < el.scrollWidth - 4;
    setFade((prev) =>
      prev.left === left && prev.right === right ? prev : { left, right }
    );
  }, []);

  useEffect(() => {
    // Preserve the deep link so sign-in can return the user here.
    if (!loading && !user && !bootError) {
      router.replace(`/sign-in?next=${encodeURIComponent(pathname)}`);
    }
  }, [loading, user, bootError, pathname, router]);

  // Keep the active tab visible (the bar scrolls on narrow screens) and the
  // overflow fade hints in sync — on route change and once the nav mounts.
  useEffect(() => {
    activeTabRef.current?.scrollIntoView({ block: "nearest", inline: "nearest" });
    updateFade();
  }, [pathname, user, updateFade]);

  useEffect(() => {
    window.addEventListener("resize", updateFade);
    return () => window.removeEventListener("resize", updateFade);
  }, [updateFade]);

  if (!loading && !user && bootError) {
    // The boot session check failed transiently (network/server) — offer a
    // branded retry instead of silently dropping the user at sign-in.
    return (
      <div className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-6 px-4 py-16">
        <div className="flex flex-col items-center gap-2 text-center">
          <LogoMark size={64} label={t("logoAlt")} />
          <span className="text-xl font-extrabold tracking-wide text-sen">
            {t("appName")}
          </span>
        </div>
        <ErrorState
          className="w-full"
          message={tApiError(bootError, t)}
          onRetry={retry}
        />
      </div>
    );
  }

  if (loading || !user) return <FullPageSpinner />;

  const tabs = TABS.filter((tab) => !tab.devOnly || user.role === "developer");
  const roleLabel = t(user.role === "developer" ? "roleDeveloper" : "roleUser");
  const roleColor = user.role === "developer" ? ("yellow" as const) : ("gray" as const);

  const maskImage =
    fade.left && fade.right
      ? "linear-gradient(to right, transparent, black 32px, black calc(100% - 32px), transparent)"
      : fade.left
        ? "linear-gradient(to right, transparent, black 32px, black)"
        : fade.right
          ? "linear-gradient(to right, black, black calc(100% - 32px), transparent)"
          : undefined;

  return (
    <div className="min-h-screen">
      <header className="border-b border-lotus-light bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-2 gap-y-2 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <LogoMark size={40} label={t("logoAlt")} />
            <div className="hidden sm:block">
              <span className="block text-lg font-extrabold leading-tight tracking-wide text-sen">
                {t("appName")}
              </span>
              <span className="block text-xs font-medium text-lotus-dark">
                {t("tagline")}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher />
            {/* Mobile: compact identity — avatar initial + role badge */}
            <div className="flex items-center gap-1.5 sm:hidden">
              <span
                aria-hidden="true"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sen-light text-base font-bold text-sen-dark"
              >
                {user.email.charAt(0).toUpperCase()}
              </span>
              <span className="sr-only">{user.email}</span>
              <Badge color={roleColor}>{roleLabel}</Badge>
            </div>
            {/* Desktop: full identity */}
            <div className="hidden items-center gap-2 sm:flex">
              <span className="text-base text-slate-600">{user.email}</span>
              <Badge color={roleColor}>{roleLabel}</Badge>
            </div>
            <button
              onClick={signOut}
              aria-label={t("signOut")}
              title={t("signOut")}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-500 hover:bg-lotus-light hover:text-lotus-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sen"
            >
              <LogOut size={20} aria-hidden="true" />
            </button>
          </div>
        </div>
        <nav
          ref={navRef}
          aria-label={t("navSections")}
          onScroll={updateFade}
          style={maskImage ? { maskImage, WebkitMaskImage: maskImage } : undefined}
          className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4"
        >
          {tabs.map(({ href, key, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                ref={active ? activeTabRef : null}
                href={href}
                aria-current={active ? "page" : undefined}
                className={
                  "flex min-h-12 items-center gap-2 whitespace-nowrap rounded-t-lg border-b-2 px-3.5 py-3 text-base transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-sen " +
                  (active
                    ? "border-sen bg-sen-light/60 font-semibold text-sen-dark"
                    : "border-transparent font-medium text-slate-600 hover:border-lotus-light hover:text-sen-dark")
                }
              >
                <Icon size={18} aria-hidden="true" />
                {t(key)}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </div>
  );
}
