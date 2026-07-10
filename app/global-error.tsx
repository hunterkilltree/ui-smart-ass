"use client";

/*
 * Global error boundary — replaces the ROOT layout when it crashes, so
 * globals.css (Tailwind) may not be loaded and no provider exists. Everything
 * here is self-contained: inline styles using the SEN "Playful Geometric"
 * palette (see app/globals.css) and static bilingual copy (vi + en).
 */

import { useEffect } from "react";
import { outfit, plusJakarta } from "./fonts";

const brand = {
  sen: "#7c3aed", // violet — AA on white/cream, AA under white text
  senDark: "#6d28d9",
  ink: "#1e293b", // slate-800: text, chunky borders, hard shadows
  cream: "#fffdf5",
  cardShadow: "#e2e8f0", // slate-200 "sticker" offset shadow
  gold: "#fbbf24", // decoration fill only
  leaf: "#34d399", // decoration fill only
};

// The self-hosted spec fonts (app/fonts.ts) with the local approximations
// kept behind them — this screen must still render if font assets fail.
const bodyFont = `${plusJakarta.style.fontFamily}, "Plus Jakarta Sans", "Avenir Next", "Segoe UI", "Helvetica Neue", system-ui, -apple-system, sans-serif`;
const displayFont = `${outfit.style.fontFamily}, ${plusJakarta.style.fontFamily}, "Outfit", "Nunito", "Quicksand", "Avenir Next Rounded", "Avenir Next", "Trebuchet MS", ui-rounded, system-ui, sans-serif`;

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
          color: brand.ink,
          fontFamily: bodyFont,
          fontSize: "17px",
          padding: "16px",
        }}
      >
        <main
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "28rem",
            background: "#ffffff",
            border: `2px solid ${brand.ink}`,
            borderRadius: "16px",
            boxShadow: `8px 8px 0 0 ${brand.cardShadow}`,
            padding: "32px 24px",
            textAlign: "center",
          }}
        >
          {/* geometric confetti pinned to the card edges (decoration only) */}
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "-12px",
              right: "28px",
              display: "block",
              width: "22px",
              height: "22px",
              background: brand.gold,
              border: `2px solid ${brand.ink}`,
              borderRadius: "6px",
              transform: "rotate(12deg)",
            }}
          />
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: "-10px",
              left: "36px",
              display: "block",
              width: "18px",
              height: "18px",
              background: brand.leaf,
              border: `2px solid ${brand.ink}`,
              borderRadius: "50%",
            }}
          />
          <p
            style={{
              margin: 0,
              fontFamily: displayFont,
              fontSize: "1.5rem",
              fontWeight: 800,
              letterSpacing: "0.04em",
              color: brand.sen,
            }}
          >
            SEN
          </p>
          <h1
            style={{
              margin: "16px 0 0",
              fontFamily: displayFont,
              fontSize: "1.5rem",
              fontWeight: 800,
              color: brand.ink,
            }}
          >
            Đã có lỗi xảy ra
          </h1>
          <p style={{ margin: "4px 0 0", fontWeight: 600, color: "#475569" }}>
            Something went wrong
          </p>
          <p style={{ margin: "16px 0 0", color: "#334155" }}>
            Xin lỗi, ứng dụng gặp sự cố. Bạn hãy bấm nút bên dưới để thử lại.
          </p>
          <p style={{ margin: "4px 0 0", color: "#475569" }}>
            Sorry, the app ran into a problem. Please press the button below to
            try again.
          </p>
          <button
            onClick={reset}
            autoFocus
            style={{
              marginTop: "24px",
              minHeight: "48px",
              minWidth: "44px",
              padding: "10px 28px",
              borderRadius: "9999px",
              border: `2px solid ${brand.ink}`,
              boxShadow: `4px 4px 0 0 ${brand.ink}`,
              background: brand.sen,
              color: "#ffffff",
              fontFamily: displayFont,
              fontSize: "1rem",
              fontWeight: 700,
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
            <p style={{ marginTop: "16px", fontSize: "0.875rem", color: "#64748b" }}>
              Mã lỗi / Error code: {error.digest}
            </p>
          )}
        </main>
      </body>
    </html>
  );
}
