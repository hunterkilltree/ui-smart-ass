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
      <Card className="w-full max-w-md text-center">
        <div className="flex justify-center" aria-hidden="true">
          <LogoMark size={64} />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">
          Đã có lỗi xảy ra
        </h1>
        <p className="text-base font-medium text-slate-500">
          Something went wrong
        </p>
        <p className="mt-4 text-base text-slate-700">
          Xin lỗi, ứng dụng gặp sự cố. Bạn hãy bấm nút bên dưới để thử lại.
        </p>
        <p className="mt-1 text-base text-slate-500">
          Sorry, the app ran into a problem. Please press the button below to
          try again.
        </p>
        <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
          <Button
            onClick={reset}
            className="min-h-[44px] px-6 text-base"
            autoFocus
          >
            <RefreshCw size={18} aria-hidden="true" />
            Thử lại / Try again
          </Button>
          <Button
            variant="secondary"
            className="min-h-[44px] px-6 text-base"
            onClick={() => {
              window.location.href = "/";
            }}
          >
            <Home size={18} aria-hidden="true" />
            Về trang chính / Go home
          </Button>
        </div>
        {error.digest && (
          <p className="mt-4 text-sm text-slate-400">
            Mã lỗi / Error code: {error.digest}
          </p>
        )}
      </Card>
    </main>
  );
}
