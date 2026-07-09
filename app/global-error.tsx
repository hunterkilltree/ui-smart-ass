"use client";

/*
 * Global error boundary — replaces the ROOT layout when it crashes, so
 * globals.css (Tailwind) may not be loaded and no provider exists. Everything
 * here is self-contained: inline styles using the SEN brand palette
 * (see app/globals.css) and static bilingual copy (vi + en).
 */

import { useEffect } from "react";

const brand = {
  sen: "#2f6bb3",
  senDark: "#24568f",
  lotusLight: "#fdeaf1",
  cream: "#faf3ec",
};

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="vi">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: brand.cream,
          color: "#1e293b",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
          fontSize: "17px",
          padding: "16px",
        }}
      >
        <main
          style={{
            width: "100%",
            maxWidth: "28rem",
            background: "#ffffff",
            border: `1px solid ${brand.lotusLight}`,
            borderRadius: "16px",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            padding: "32px 24px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "1.25rem",
              fontWeight: 800,
              letterSpacing: "0.05em",
              color: brand.sen,
            }}
          >
            SEN
          </p>
          <h1
            style={{
              margin: "16px 0 0",
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "#0f172a",
            }}
          >
            Đã có lỗi xảy ra
          </h1>
          <p style={{ margin: "4px 0 0", fontWeight: 500, color: "#64748b" }}>
            Something went wrong
          </p>
          <p style={{ margin: "16px 0 0", color: "#334155" }}>
            Xin lỗi, ứng dụng gặp sự cố. Bạn hãy bấm nút bên dưới để thử lại.
          </p>
          <p style={{ margin: "4px 0 0", color: "#64748b" }}>
            Sorry, the app ran into a problem. Please press the button below to
            try again.
          </p>
          <button
            onClick={reset}
            autoFocus
            style={{
              marginTop: "24px",
              minHeight: "44px",
              minWidth: "44px",
              padding: "10px 24px",
              borderRadius: "12px",
              border: "none",
              background: brand.sen,
              color: "#ffffff",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = brand.senDark;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = brand.sen;
            }}
          >
            Thử lại / Try again
          </button>
          {error.digest && (
            <p style={{ marginTop: "16px", fontSize: "0.875rem", color: "#94a3b8" }}>
              Mã lỗi / Error code: {error.digest}
            </p>
          )}
        </main>
      </body>
    </html>
  );
}
