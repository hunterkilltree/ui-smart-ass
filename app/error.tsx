"use client";

/*
 * Route-level error boundary. Renders inside the root layout but must not
 * depend on any provider (the crash may have originated inside one), so all
 * copy is static and bilingual: Vietnamese first (default audience), then
 * English.
 */

import { useEffect } from "react";
import { RefreshCw, Home } from "lucide-react";
import { Button, Card } from "@/components/ui";
import { LogoMark } from "@/components/Logo";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the error for debugging/monitoring.
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream p-4">
      <div className="pop-in w-full max-w-md">
        <Card className="relative text-center">
          {/* deterministic geometric confetti (decoration only) */}
          <span
            aria-hidden="true"
            className="absolute -top-3 right-8 hidden h-6 w-6 rotate-12 rounded-md border-2 border-ink bg-gold sm:block"
          />
          <svg
            aria-hidden="true"
            focusable="false"
            viewBox="0 0 24 24"
            className="absolute -left-4 top-16 hidden h-8 w-8 -rotate-12 text-lotus sm:block"
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
            className="absolute -bottom-2.5 left-10 hidden h-5 w-5 rounded-full border-2 border-ink bg-leaf sm:block"
          />
          <div className="flex justify-center" aria-hidden="true">
            <LogoMark size={64} />
          </div>
          <h1 className="mt-4 font-display text-2xl font-extrabold text-ink">
            Đã có lỗi xảy ra
          </h1>
          <p className="text-base font-semibold text-slate-600">
            Something went wrong
          </p>
          {/* squiggle divider (decorative) */}
          <svg
            aria-hidden="true"
            focusable="false"
            viewBox="0 0 160 14"
            fill="none"
            className="mx-auto mt-3 w-28 text-lotus"
          >
            <path
              d="M3 10 Q 13 3 23 10 T 43 10 T 63 10 T 83 10 T 103 10 T 123 10 T 143 10 T 157 10"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </svg>
          <p className="mt-4 text-base text-slate-700">
            Xin lỗi, ứng dụng gặp sự cố. Bạn hãy bấm nút bên dưới để thử lại.
          </p>
          <p className="mt-1 text-base text-slate-600">
            Sorry, the app ran into a problem. Please press the button below to
            try again.
          </p>
          <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
            <Button
              onClick={reset}
              className="min-h-[44px] px-6 text-base"
              autoFocus
            >
              <RefreshCw size={18} strokeWidth={2.5} aria-hidden="true" />
              Thử lại / Try again
            </Button>
            <Button
              variant="secondary"
              className="min-h-[44px] px-6 text-base"
              onClick={() => {
                window.location.href = "/";
              }}
            >
              <Home size={18} strokeWidth={2.5} aria-hidden="true" />
              Về trang chính / Go home
            </Button>
          </div>
          {error.digest && (
            <p className="mt-4 text-sm text-slate-500">
              Mã lỗi / Error code: {error.digest}
            </p>
          )}
        </Card>
      </div>
    </main>
  );
}
