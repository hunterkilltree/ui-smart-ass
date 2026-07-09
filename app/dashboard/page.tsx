"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { FullPageSpinner } from "@/components/ui";

// Mirrors the tab order in app/dashboard/layout.tsx (Logs is developer-only).
const TAB_ORDER: { href: string; devOnly?: boolean }[] = [
  { href: "/dashboard/contacts" },
  { href: "/dashboard/voice-training" },
  { href: "/dashboard/logs", devOnly: true },
  { href: "/dashboard/device" },
];

export default function DashboardIndex() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Unauthenticated visitors are handled by the dashboard layout guard.
    if (loading || !user) return;
    const first =
      TAB_ORDER.find((tab) => !tab.devOnly || user.role === "developer") ??
      TAB_ORDER[0];
    // replace (not push) so Back skips this transient index route.
    router.replace(first.href);
  }, [loading, user, router]);

  return <FullPageSpinner />;
}
