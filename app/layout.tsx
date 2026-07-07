import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "SEN — Người bạn đồng hành AI",
  description:
    "SEN: người bạn đồng hành AI cho người lớn tuổi — quản lý thiết bị trợ lý thông minh ESP32",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
