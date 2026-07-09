/*
 * Branded 404 page. Server component rendered inside the root layout.
 * Copy is static and bilingual (vi first, then en) so it works even if a
 * future refactor moves providers around.
 */

import Link from "next/link";
import { Home, LayoutDashboard } from "lucide-react";
import { Card } from "@/components/ui";
import { LogoMark } from "@/components/Logo";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-cream p-4">
      <div className="pop-in w-full max-w-md">
        <Card className="relative text-center">
          {/* deterministic geometric confetti (decoration only) */}
          <span
            aria-hidden="true"
            className="absolute -top-3 left-8 hidden h-6 w-6 -rotate-12 rounded-md border-2 border-ink bg-lotus sm:block"
          />
          <svg
            aria-hidden="true"
            focusable="false"
            viewBox="0 0 24 24"
            className="absolute -right-4 top-16 hidden h-8 w-8 rotate-12 text-leaf sm:block"
          >
            <path
              d="M12 3 L21 20 H3 Z"
              fill="currentColor"
              stroke="var(--color-ink)"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
          <span
            aria-hidden="true"
            className="absolute -bottom-2.5 right-10 hidden h-5 w-5 rounded-full border-2 border-ink bg-sen-bright sm:block"
          />
          <div className="flex justify-center" aria-hidden="true">
            <LogoMark size={64} />
          </div>
          <p className="mt-5">
            <span className="inline-block -rotate-2 rounded-2xl border-2 border-ink bg-gold px-5 py-1 font-display text-5xl font-extrabold tracking-tight text-ink shadow-pop-sm">
              404
            </span>
          </p>
          <h1 className="mt-5 font-display text-2xl font-extrabold text-ink">
            Không tìm thấy trang
          </h1>
          <p className="text-base font-semibold text-slate-600">Page not found</p>
          <p className="mt-4 text-base text-slate-700">
            Trang bạn tìm không tồn tại hoặc đã được chuyển đi nơi khác.
          </p>
          <p className="mt-1 text-base text-slate-600">
            The page you are looking for does not exist or has been moved.
          </p>
          <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="pop-press inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-2 border-ink bg-sen px-6 py-2.5 text-base font-bold text-white hover:bg-sen-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sen"
            >
              <Home size={18} strokeWidth={2.5} aria-hidden="true" />
              Về trang chính / Home
            </Link>
            <Link
              href="/dashboard"
              className="pop-press inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-2 border-ink bg-white px-6 py-2.5 text-base font-bold text-ink hover:bg-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sen"
            >
              <LayoutDashboard size={18} strokeWidth={2.5} aria-hidden="true" />
              Bảng điều khiển / Dashboard
            </Link>
          </div>
        </Card>
      </div>
    </main>
  );
}
