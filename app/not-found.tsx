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
      <Card className="w-full max-w-md text-center">
        <div className="flex justify-center" aria-hidden="true">
          <LogoMark size={64} />
        </div>
        <p className="mt-4 text-5xl font-extrabold tracking-wide text-sen">
          404
        </p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">
          Không tìm thấy trang
        </h1>
        <p className="text-base font-medium text-slate-500">Page not found</p>
        <p className="mt-4 text-base text-slate-700">
          Trang bạn tìm không tồn tại hoặc đã được chuyển đi nơi khác.
        </p>
        <p className="mt-1 text-base text-slate-500">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-sen px-6 py-2 text-base font-semibold text-white transition-colors hover:bg-sen-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sen"
          >
            <Home size={18} aria-hidden="true" />
            Về trang chính / Home
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-sen/30 bg-white px-6 py-2 text-base font-semibold text-sen transition-colors hover:bg-sen-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sen"
          >
            <LayoutDashboard size={18} aria-hidden="true" />
            Bảng điều khiển / Dashboard
          </Link>
        </div>
      </Card>
    </main>
  );
}
