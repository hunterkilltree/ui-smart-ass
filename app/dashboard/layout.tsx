"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bot,
  MessageSquare,
  Mic,
  ScrollText,
  Cpu,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useI18n, type TKey } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Spinner, Badge } from "@/components/ui";

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
  const { user, loading, signOut } = useAuth();
  const { t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/sign-in");
  }, [loading, user, router]);

  if (loading || !user) return <Spinner />;

  const tabs = TABS.filter((tab) => !tab.devOnly || user.role === "developer");

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <Bot size={20} />
            </div>
            <span className="hidden font-semibold text-slate-900 sm:block">
              {t("appName")}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <div className="hidden items-center gap-2 sm:flex">
              <span className="text-sm text-slate-600">{user.email}</span>
              <Badge color={user.role === "developer" ? "yellow" : "gray"}>
                {user.role}
              </Badge>
            </div>
            <button
              onClick={signOut}
              title={t("signOut")}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4">
          {tabs.map(({ href, key, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={
                  "flex items-center gap-2 whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-medium transition-colors " +
                  (active
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-slate-500 hover:text-slate-800")
                }
              >
                <Icon size={16} />
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
