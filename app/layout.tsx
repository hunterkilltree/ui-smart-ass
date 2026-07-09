import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import { Providers } from "./providers";
import type { Lang } from "@/lib/i18n";

export const metadata: Metadata = {
  // Language-neutral: works for both vi (default) and en users.
  title: "SEN — Smart AI Assistant Hub",
  description:
    "SEN — người bạn đồng hành AI cho người lớn tuổi. Control hub for the SEN ESP32 AI companion.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The language preference is persisted in a cookie (set in lib/i18n.tsx
  // alongside localStorage) so the server renders the stored language on
  // first paint — no hydration mismatch and no vi/en flash for EN users.
  const cookieLang = (await cookies()).get("lang")?.value;
  const lang: Lang = cookieLang === "en" ? "en" : "vi";

  return (
    <html lang={lang}>
      <body className="antialiased">
        <Providers initialLang={lang}>{children}</Providers>
      </body>
    </html>
  );
}
