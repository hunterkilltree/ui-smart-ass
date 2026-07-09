import type { Metadata } from "next";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Check,
  Cpu,
  Flower2,
  HeartPulse,
  Lock,
  MessageSquareText,
  Mic,
  Network,
  PhoneCall,
  ShieldCheck,
  Star,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Design proposal: Web3 / Crypto ("Bitcoin DeFi" aesthetic)           */
/* Standalone landing-page mockup for SEN — dark void, Bitcoin-orange  */
/* energy, gold highlights, glass panels, 1px borders, mono data.      */
/* Self-contained: local font stacks, scoped <style>, no new deps.     */
/* ------------------------------------------------------------------ */

export const metadata: Metadata = {
  title: "Design proposal: Web3 / Crypto — SEN",
  description:
    "Bản đề xuất thiết kế landing page SEN theo phong cách Web3 / Crypto (Bitcoin DeFi).",
  robots: { index: false, follow: false },
};

/* Shared focus ring — visible on the void background. */
const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F7931A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030304]";

/* Scoped styles: font stacks (local approximations of Space Grotesk /
 * Inter / JetBrains Mono — no network font fetches), grid + noise
 * textures, float keyframes, reduced-motion override. All selectors are
 * prefixed `w3-` / scoped to [data-w3-root] so nothing leaks. */
const scopedCss = `
[data-w3-root] { color-scheme: dark; }
.w3-heading {
  font-family: "Space Grotesk", "Avenir Next", Avenir, Futura,
    "Century Gothic", "Trebuchet MS", ui-sans-serif, system-ui, sans-serif;
}
.w3-body {
  font-family: Inter, "SF Pro Text", "Helvetica Neue", "Segoe UI", Roboto,
    Arial, ui-sans-serif, system-ui, sans-serif;
}
.w3-mono {
  font-family: "JetBrains Mono", ui-monospace, "SF Mono", SFMono-Regular,
    Menlo, Consolas, "Liberation Mono", monospace;
}
.w3-grid {
  background-size: 50px 50px;
  background-image:
    linear-gradient(to right, rgba(30, 41, 59, 0.5) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(30, 41, 59, 0.5) 1px, transparent 1px);
  -webkit-mask-image: radial-gradient(circle at center, black 40%, transparent 100%);
  mask-image: radial-gradient(circle at center, black 40%, transparent 100%);
}
.w3-noise {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E");
}
@keyframes w3-float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}
.w3-float { animation: w3-float 8s ease-in-out infinite; }
@keyframes w3-bob {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}
.w3-bob-a { animation: w3-bob 5s ease-in-out infinite; }
.w3-bob-b { animation: w3-bob 6s ease-in-out 1.2s infinite; }
.w3-bob-c { animation: w3-bob 7s ease-in-out 2.4s infinite; }
@media (prefers-reduced-motion: reduce) {
  [data-w3-root] *,
  [data-w3-root] *::before,
  [data-w3-root] *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
`;

/* ------------------------------------------------------------------ */
/* Small local building blocks                                         */
/* ------------------------------------------------------------------ */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="w3-mono mb-4 text-sm uppercase tracking-widest text-[#F7931A]">
      <span aria-hidden="true">{"// "}</span>
      {children}
    </p>
  );
}

function LiveDot() {
  return (
    <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#F7931A] opacity-75" />
      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#F7931A]" />
    </span>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 py-8 text-center">
      <span className="w3-heading bg-gradient-to-r from-[#F7931A] to-[#FFD600] bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
        {value}
      </span>
      <span className="w3-mono text-sm uppercase tracking-wider text-[#94A3B8]">
        {label}
      </span>
    </div>
  );
}

type FeatureCardProps = {
  icon: React.ReactNode;
  watermark: React.ReactNode;
  title: string;
  description: string;
  meta: string;
};

function FeatureCard({
  icon,
  watermark,
  title,
  description,
  meta,
}: FeatureCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0F1115] p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[#F7931A]/50 hover:shadow-[0_0_30px_-10px_rgba(247,147,26,0.2)]">
      {/* Watermark icon revealed on hover */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-6 -right-6 rotate-12 text-[#F7931A] opacity-[0.06] transition-opacity duration-300 group-hover:opacity-20"
      >
        {watermark}
      </div>
      <div
        aria-hidden="true"
        className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl border border-[#EA580C]/50 bg-[#EA580C]/15 text-[#F7931A] transition-shadow duration-300 group-hover:shadow-[0_0_20px_rgba(234,88,12,0.4)]"
      >
        {icon}
      </div>
      <h3 className="w3-heading mb-3 text-xl font-semibold text-white md:text-2xl">
        {title}
      </h3>
      <p className="mb-6 text-base leading-relaxed text-[#94A3B8]">
        {description}
      </p>
      <p className="w3-mono text-xs uppercase tracking-widest text-[#F7931A]/80">
        {meta}
      </p>
    </article>
  );
}

type StepCardProps = {
  index: string;
  title: string;
  description: string;
  meta: string;
};

function StepCard({ index, title, description, meta }: StepCardProps) {
  return (
    <li className="relative flex gap-5 md:gap-8">
      <div
        aria-hidden="true"
        className="w3-mono relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#F7931A]/60 bg-[#0F1115] text-base font-medium text-[#F7931A] shadow-[0_0_20px_-5px_rgba(247,147,26,0.6)]"
      >
        {index}
      </div>
      <div className="relative flex-1 rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-sm md:p-8">
        {/* Corner border accents — "selected node" effect */}
        <span
          aria-hidden="true"
          className="absolute -left-px -top-px h-6 w-6 rounded-tl-2xl border-l border-t border-[#F7931A]"
        />
        <span
          aria-hidden="true"
          className="absolute -bottom-px -right-px h-6 w-6 rounded-br-2xl border-b border-r border-[#F7931A]"
        />
        <h3 className="w3-heading mb-2 text-xl font-semibold text-white md:text-2xl">
          <span className="sr-only">Bước {index}: </span>
          {title}
        </h3>
        <p className="mb-4 text-base leading-relaxed text-[#94A3B8]">
          {description}
        </p>
        <p className="w3-mono text-xs uppercase tracking-widest text-[#FFD600]/80">
          {meta}
        </p>
      </div>
    </li>
  );
}

function CheckPill({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2 text-base text-[#94A3B8]">
      <Check aria-hidden="true" className="h-5 w-5 shrink-0 text-[#FFD600]" />
      {children}
    </li>
  );
}

/* ------------------------------------------------------------------ */
/* Proposal bar (neutral chrome, not part of the style spec)           */
/* ------------------------------------------------------------------ */

function ProposalBar() {
  const link =
    "inline-flex min-h-11 items-center whitespace-nowrap rounded px-2 text-slate-300 underline-offset-4 hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-slate-400";
  return (
    <div className="fixed inset-x-0 top-0 z-50 overflow-x-auto border-b border-slate-700 bg-slate-900/95 backdrop-blur">
      <div className="mx-auto flex min-h-11 min-w-max max-w-7xl items-center justify-between gap-x-6 px-4 text-xs sm:text-sm">
        <p className="whitespace-nowrap font-semibold text-slate-100">
          Design proposal: Web3 / Crypto
        </p>
        <nav aria-label="Design proposals" className="flex items-center gap-x-1">
          <Link href="/designs" className={link}>
            ← All designs
          </Link>
          <span aria-hidden="true" className="text-slate-600">
            |
          </span>
          <Link href="/designs/art-deco" className={link}>
            Art Deco
          </Link>
          <Link href="/designs/playful-geometric" className={link}>
            Playful Geometric
          </Link>
          <Link href="/designs/swiss-minimalist" className={link}>
            Swiss Minimalist
          </Link>
        </nav>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Web3DesignProposalPage() {
  return (
    <>
      <style>{scopedCss}</style>
      <ProposalBar />

      <div
        data-w3-root
        className="w3-body min-h-dvh bg-[#030304] pt-16 text-white"
      >
        {/* ---------------- Page header ---------------- */}
        <header className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
          <Link
            href="#trang-chu"
            className={`flex items-center gap-3 rounded-lg p-1 ${FOCUS}`}
          >
            <span
              aria-hidden="true"
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#EA580C] to-[#FFD600] shadow-[0_0_20px_-5px_rgba(247,147,26,0.6)]"
            >
              <Flower2 className="h-5 w-5 text-black" strokeWidth={2} />
            </span>
            <span className="flex flex-col leading-none">
              <span className="w3-heading text-2xl font-bold tracking-wide">
                SEN
              </span>
              <span className="w3-mono text-[11px] uppercase tracking-widest text-[#94A3B8]">
                family network
              </span>
            </span>
          </Link>

          <nav
            aria-label="Trang"
            className="w3-mono hidden items-center gap-1 text-sm uppercase tracking-wider md:flex"
          >
            <a
              href="#tinh-nang"
              className={`rounded-lg px-3 py-3 text-[#94A3B8] transition-colors hover:text-white ${FOCUS}`}
            >
              Tính năng
            </a>
            <a
              href="#cach-hoat-dong"
              className={`rounded-lg px-3 py-3 text-[#94A3B8] transition-colors hover:text-white ${FOCUS}`}
            >
              Cách hoạt động
            </a>
            <a
              href="#cau-chuyen"
              className={`rounded-lg px-3 py-3 text-[#94A3B8] transition-colors hover:text-white ${FOCUS}`}
            >
              Câu chuyện
            </a>
          </nav>

          <Link
            href="/sign-up"
            className={`w3-mono inline-flex min-h-11 items-center justify-center rounded-full bg-gradient-to-r from-[#EA580C] to-[#F7931A] px-6 text-sm font-bold uppercase tracking-wider text-[#0A0501] shadow-[0_0_20px_-5px_rgba(234,88,12,0.5)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_-5px_rgba(247,147,26,0.6)] ${FOCUS}`}
          >
            Đặt mua
          </Link>
        </header>

        <main id="trang-chu">
          {/* ---------------- Hero ---------------- */}
          <section className="relative overflow-hidden">
            {/* Textured void: grid, noise, ambient energy fields */}
            <div aria-hidden="true" className="w3-grid absolute inset-0" />
            <div
              aria-hidden="true"
              className="w3-noise absolute inset-0 opacity-[0.04]"
            />
            <div
              aria-hidden="true"
              className="absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-[#F7931A] opacity-10 blur-[120px]"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-[#EA580C] opacity-10 blur-[150px]"
            />

            <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2">
              <div>
                <p className="w3-mono mb-6 inline-flex items-center gap-3 rounded-full border border-[#F7931A]/40 bg-[#F7931A]/10 px-4 py-2 text-xs uppercase tracking-widest text-[#F7931A] sm:text-sm">
                  <LiveDot />
                  Mạng gia đình · đang hoạt động
                </p>
                <h1 className="w3-heading mb-6 text-4xl font-bold leading-tight sm:text-5xl md:text-7xl">
                  Kết nối cả gia đình trong một mạng lưới{" "}
                  <span className="bg-gradient-to-r from-[#F7931A] to-[#FFD600] bg-clip-text text-transparent">
                    an toàn tuyệt đối
                  </span>
                </h1>
                <p className="mb-10 max-w-xl text-base leading-relaxed text-[#94A3B8] md:text-lg">
                  SEN là người bạn đồng hành AI đặt trên bàn của ông bà: đọc
                  tin nhắn Zalo, Messenger, Telegram bằng giọng nói thân quen,
                  trò chuyện mỗi ngày và báo tin cho con cháu — mọi dữ liệu
                  được mã hoá đầu-cuối như một chiếc két số của riêng gia đình.
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    href="/sign-up"
                    className={`w3-mono inline-flex min-h-[52px] items-center gap-2 rounded-full bg-gradient-to-r from-[#EA580C] to-[#F7931A] px-8 text-base font-bold uppercase tracking-wider text-[#0A0501] shadow-[0_0_20px_-5px_rgba(234,88,12,0.5)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_-5px_rgba(247,147,26,0.6)] ${FOCUS}`}
                  >
                    Đặt mua SEN
                    <ArrowRight aria-hidden="true" className="h-5 w-5" />
                  </Link>
                  <a
                    href="#cach-hoat-dong"
                    className={`w3-mono inline-flex min-h-[52px] items-center rounded-full border-2 border-white/20 px-8 text-base font-bold uppercase tracking-wider text-white transition-all duration-300 hover:border-white hover:bg-white/10 ${FOCUS}`}
                  >
                    Xem cách hoạt động
                  </a>
                </div>
                <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-2">
                  <CheckPill>Không cần điện thoại thông minh</CheckPill>
                  <CheckPill>Tiếng Việt là mặc định</CheckPill>
                </ul>
              </div>

              {/* Orb: spinning orbital rings + floating stat cards.
                  Purely decorative — the data repeats in the stats strip. */}
              <div
                aria-hidden="true"
                className="relative flex h-[320px] items-center justify-center md:h-[460px]"
              >
                <div className="absolute h-64 w-64 rounded-full bg-[#F7931A] opacity-20 blur-[100px]" />
                <div className="absolute h-[260px] w-[260px] animate-[spin_20s_linear_infinite] rounded-full border border-dashed border-[#F7931A]/30 md:h-[400px] md:w-[400px]">
                  <span className="absolute -top-1 left-1/2 h-2.5 w-2.5 rounded-full bg-[#F7931A] shadow-[0_0_10px_rgba(247,147,26,0.9)]" />
                </div>
                <div className="absolute h-[200px] w-[200px] animate-[spin_14s_linear_infinite_reverse] rounded-full border border-white/10 md:h-[310px] md:w-[310px]">
                  <span className="absolute -bottom-1 left-1/2 h-2 w-2 rounded-full bg-[#FFD600] shadow-[0_0_10px_rgba(255,214,0,0.9)]" />
                </div>
                <div className="w3-float relative flex h-40 w-40 flex-col items-center justify-center gap-1 rounded-full border border-[#F7931A]/40 bg-[#0F1115] shadow-[0_0_60px_-10px_rgba(247,147,26,0.5)] md:h-52 md:w-52">
                  <Cpu className="h-9 w-9 text-[#F7931A] md:h-11 md:w-11" strokeWidth={1.5} />
                  <span className="w3-heading text-xl font-bold md:text-2xl">
                    SEN
                  </span>
                  <span className="w3-mono text-[11px] uppercase tracking-widest text-[#94A3B8]">
                    ESP32 · v1.4.2
                  </span>
                </div>

                {/* Floating glass stat cards */}
                <div className="w3-bob-a absolute left-0 top-6 rounded-xl border border-white/10 bg-black/40 px-4 py-3 backdrop-blur-lg md:left-4 md:top-12">
                  <p className="w3-mono flex items-center gap-2 text-[11px] uppercase tracking-widest text-[#94A3B8]">
                    <Activity className="h-3.5 w-3.5 text-[#F7931A]" /> Uptime
                  </p>
                  <p className="w3-mono text-lg font-medium text-[#FFD600]">
                    99,98%
                  </p>
                </div>
                <div className="w3-bob-b absolute bottom-4 right-0 rounded-xl border border-white/10 bg-black/40 px-4 py-3 backdrop-blur-lg md:bottom-14 md:right-2">
                  <p className="w3-mono flex items-center gap-2 text-[11px] uppercase tracking-widest text-[#94A3B8]">
                    <Lock className="h-3.5 w-3.5 text-[#F7931A]" /> Mã hoá
                  </p>
                  <p className="w3-mono text-lg font-medium text-white">
                    AES-256
                  </p>
                </div>
                <div className="w3-bob-c absolute right-2 top-2 hidden rounded-xl border border-white/10 bg-black/40 px-4 py-3 backdrop-blur-lg md:block">
                  <p className="w3-mono flex items-center gap-2 text-[11px] uppercase tracking-widest text-[#94A3B8]">
                    <Network className="h-3.5 w-3.5 text-[#F7931A]" /> Kênh
                  </p>
                  <p className="w3-mono text-lg font-medium text-white">
                    3 đang nối
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ---------------- Stats / trust strip ---------------- */}
          <section
            aria-label="Chỉ số tin cậy"
            className="border-y border-white/10 bg-[#0F1115]/60"
          >
            <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 px-4 sm:px-6 lg:grid-cols-4">
              <StatItem value="99,9%" label="Thời gian hoạt động" />
              <StatItem value="AES-256" label="Mã hoá đầu-cuối" />
              <StatItem value="3+" label="Kênh nhắn tin" />
              <StatItem value="24/7" label="Theo dõi thiết bị" />
            </div>
          </section>

          {/* ---------------- Features ---------------- */}
          <section
            id="tinh-nang"
            className="relative mx-auto max-w-7xl scroll-mt-24 px-4 py-24 sm:px-6"
          >
            <div
              aria-hidden="true"
              className="absolute right-1/4 top-0 h-72 w-72 rounded-full bg-[#FFD600] opacity-5 blur-[150px]"
            />
            <div className="relative">
              <SectionLabel>Tính năng — Features</SectionLabel>
              <h2 className="w3-heading mb-4 max-w-2xl text-3xl font-bold leading-tight md:text-5xl">
                Công nghệ vững chắc,{" "}
                <span className="bg-gradient-to-r from-[#F7931A] to-[#FFD600] bg-clip-text text-transparent">
                  tình thân ấm áp
                </span>
              </h2>
              <p className="mb-12 max-w-2xl text-base leading-relaxed text-[#94A3B8] md:text-lg">
                Mỗi tính năng là một khối trong chuỗi kết nối gia đình — được
                thiết kế đơn giản cho ông bà, minh bạch cho con cháu.
              </p>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                <FeatureCard
                  icon={<MessageSquareText className="h-7 w-7" strokeWidth={1.5} />}
                  watermark={<MessageSquareText className="h-32 w-32" strokeWidth={1} />}
                  title="Kênh gia đình mã hoá"
                  description="Zalo, Messenger, Telegram hội tụ về một nơi. Tin nhắn của con cháu được đọc to bằng giọng ấm áp; mỗi kênh là một đường truyền riêng đã được mã hoá."
                  meta="Zalo · Messenger · Telegram"
                />
                <FeatureCard
                  icon={<Mic className="h-7 w-7" strokeWidth={1.5} />}
                  watermark={<Mic className="h-32 w-32" strokeWidth={1} />}
                  title="Giọng nói huấn luyện riêng"
                  description="Ông bà đọc vài câu mẫu, SEN học cách nghe đúng giọng vùng miền của mình. Càng trò chuyện, máy càng hiểu ý — như người quen lâu năm."
                  meta="Voice training · 10 phút"
                />
                <FeatureCard
                  icon={<HeartPulse className="h-7 w-7" strokeWidth={1.5} />}
                  watermark={<HeartPulse className="h-32 w-32" strokeWidth={1} />}
                  title="Sức khoẻ thiết bị minh bạch"
                  description="Micro, loa, cảm biến được kiểm tra liên tục. Con cháu ở xa mở điện thoại là thấy máy của cha mẹ đang chạy ổn — từng linh kiện, từng giây."
                  meta="Giám sát 24/7 · Tự báo lỗi"
                />
                <FeatureCard
                  icon={<ShieldCheck className="h-7 w-7" strokeWidth={1.5} />}
                  watermark={<ShieldCheck className="h-32 w-32" strokeWidth={1} />}
                  title="Riêng tư như két sắt số"
                  description="Dữ liệu giọng nói ở lại trong gia đình. Không quảng cáo, không bán thông tin — chìa khoá thuộc về bạn, không thuộc về ai khác."
                  meta="Không quảng cáo · Không theo dõi"
                />
              </div>
            </div>
          </section>

          {/* ---------------- How it works (blockchain timeline) -------- */}
          <section
            id="cach-hoat-dong"
            className="scroll-mt-24 border-y border-white/10 bg-[#0F1115] py-24"
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <SectionLabel>Cách hoạt động — How it works</SectionLabel>
              <h2 className="w3-heading mb-4 max-w-2xl text-3xl font-bold leading-tight md:text-5xl">
                Ba bước để cả nhà{" "}
                <span className="bg-gradient-to-r from-[#F7931A] to-[#FFD600] bg-clip-text text-transparent">
                  gần nhau hơn
                </span>
              </h2>
              <p className="mb-14 max-w-2xl text-base leading-relaxed text-[#94A3B8] md:text-lg">
                Cài đặt một lần, an tâm mỗi ngày. Mỗi bước được xác nhận như
                một khối mới trong chuỗi.
              </p>

              <div className="relative max-w-3xl">
                {/* Blockchain ledger line: orange fading to transparent */}
                <div
                  aria-hidden="true"
                  className="absolute bottom-6 left-6 top-2 w-px bg-gradient-to-b from-[#F7931A] via-[#F7931A]/30 to-transparent"
                />
                <ol className="flex flex-col gap-10">
                  <StepCard
                    index="01"
                    title="Cắm điện, nối Wi-Fi"
                    description="Con cháu cài đặt giúp trong 5 phút: cắm nguồn, chọn mạng Wi-Fi của nhà, đặt máy ở nơi ông bà hay ngồi uống trà."
                    meta="Block 01 · Setup"
                  />
                  <StepCard
                    index="02"
                    title="Liên kết kênh nhắn tin"
                    description="Kết nối Zalo, Messenger, Telegram của gia đình. Mỗi kênh được xác thực và mã hoá ngay khi liên kết — chỉ người nhà mới vào được."
                    meta="Block 02 · Connect"
                  />
                  <StepCard
                    index="03"
                    title="Ông bà chỉ việc trò chuyện"
                    description="SEN đọc tin nhắn mới, trả lời bằng giọng nói và nhắn lại cho con cháu. Không màn hình cảm ứng, không thao tác phức tạp."
                    meta="Block 03 · Live"
                  />
                </ol>
              </div>
            </div>
          </section>

          {/* ---------------- Testimonial ---------------- */}
          <section
            id="cau-chuyen"
            className="relative mx-auto max-w-7xl scroll-mt-24 px-4 py-24 sm:px-6"
          >
            <div
              aria-hidden="true"
              className="absolute left-1/3 top-10 h-72 w-72 rounded-full bg-[#F7931A] opacity-10 blur-[150px]"
            />
            <div className="relative mx-auto max-w-3xl">
              <SectionLabel>Câu chuyện — Family proof</SectionLabel>
              <figure className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-[0_0_50px_-10px_rgba(247,147,26,0.1)] backdrop-blur-lg md:p-12">
                <p
                  aria-hidden="true"
                  className="mb-4 flex gap-1 text-[#FFD600]"
                >
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                </p>
                <p className="sr-only">Đánh giá 5 trên 5 sao</p>
                <blockquote className="w3-heading mb-8 text-xl font-medium leading-relaxed text-white md:text-2xl">
                  “Mẹ tôi không dùng được điện thoại cảm ứng, nhưng tối nào
                  cũng ‘nhắn’ Zalo cho cháu ngoại qua SEN. Tôi ở Sài Gòn, mở
                  ứng dụng lên là thấy máy của mẹ vẫn chạy êm. Cảm giác an tâm
                  ấy, với tôi, quý hơn vàng.”
                </blockquote>
                <figcaption className="flex items-center gap-4">
                  <span
                    aria-hidden="true"
                    className="w3-heading flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#EA580C] to-[#FFD600] text-base font-bold text-[#0A0501]"
                  >
                    MA
                  </span>
                  <span className="flex flex-col">
                    <span className="text-base font-semibold text-white">
                      Chị Mai Anh, 42 tuổi
                    </span>
                    <span className="w3-mono text-xs uppercase tracking-widest text-[#94A3B8]">
                      Con gái bác Hạnh (74 tuổi) · Hà Nội ↔ TP.HCM
                    </span>
                  </span>
                </figcaption>
              </figure>
            </div>
          </section>

          {/* ---------------- Final CTA ---------------- */}
          <section className="relative overflow-hidden py-24">
            <div aria-hidden="true" className="w3-grid absolute inset-0" />
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F7931A] opacity-10 blur-[120px]"
            />
            <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
              <p className="w3-mono mb-6 inline-flex items-center gap-3 rounded-full border border-[#FFD600]/40 bg-[#FFD600]/10 px-4 py-2 text-xs uppercase tracking-widest text-[#FFD600] sm:text-sm">
                <LiveDot />
                Genesis — bắt đầu
              </p>
              <h2 className="w3-heading mb-6 text-3xl font-bold leading-tight md:text-5xl">
                Khởi tạo mạng lưới của{" "}
                <span className="bg-gradient-to-r from-[#F7931A] to-[#FFD600] bg-clip-text text-transparent">
                  gia đình bạn
                </span>
              </h2>
              <p className="mb-10 text-base leading-relaxed text-[#94A3B8] md:text-lg">
                Một thiết bị nhỏ trên bàn — một kết nối bền vững giữa các thế
                hệ. Đặt mua hôm nay, cài đặt trong 5 phút.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/sign-up"
                  className={`w3-mono inline-flex min-h-[52px] items-center gap-2 rounded-full bg-gradient-to-r from-[#EA580C] to-[#F7931A] px-8 text-base font-bold uppercase tracking-wider text-[#0A0501] shadow-[0_0_20px_-5px_rgba(234,88,12,0.5)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_-5px_rgba(247,147,26,0.6)] ${FOCUS}`}
                >
                  Đặt mua SEN — 2.490.000₫
                  <ArrowRight aria-hidden="true" className="h-5 w-5" />
                </Link>
                <a
                  href="tel:18006868"
                  className={`inline-flex min-h-[52px] items-center gap-2 rounded-full px-6 text-base font-semibold text-[#F7931A] transition-colors hover:bg-white/10 hover:underline ${FOCUS}`}
                >
                  <PhoneCall aria-hidden="true" className="h-5 w-5" />
                  Gọi tư vấn miễn phí 1800 6868
                </a>
              </div>
              <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
                <CheckPill>Giao hàng toàn quốc</CheckPill>
                <CheckPill>Bảo hành 24 tháng</CheckPill>
                <CheckPill>Đổi trả trong 30 ngày</CheckPill>
              </ul>
            </div>
          </section>
        </main>

        {/* ---------------- Footer ---------------- */}
        <footer className="border-t border-white/10 bg-[#0F1115]/60">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-4">
            <div>
              <p className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#EA580C] to-[#FFD600]"
                >
                  <Flower2 className="h-5 w-5 text-black" strokeWidth={2} />
                </span>
                <span className="w3-heading text-xl font-bold tracking-wide">
                  SEN
                </span>
              </p>
              <p className="mt-4 max-w-xs text-base leading-relaxed text-[#94A3B8]">
                Người bạn đồng hành AI cho người lớn tuổi — an toàn như vàng
                số, ấm áp như người thân.
              </p>
            </div>

            <nav aria-label="Sản phẩm">
              <h3 className="w3-mono mb-4 text-sm uppercase tracking-widest text-white">
                Sản phẩm
              </h3>
              <ul className="flex flex-col gap-1">
                {[
                  ["Tính năng", "#tinh-nang"],
                  ["Cách hoạt động", "#cach-hoat-dong"],
                  ["Câu chuyện gia đình", "#cau-chuyen"],
                  ["Đặt mua", "/sign-up"],
                ].map(([label, href]) => {
                  const cls = `inline-block rounded py-2 text-base text-[#94A3B8] transition-colors hover:text-[#F7931A] ${FOCUS}`;
                  return (
                    <li key={href}>
                      {href.startsWith("/") ? (
                        <Link href={href} className={cls}>
                          {label}
                        </Link>
                      ) : (
                        <a href={href} className={cls}>
                          {label}
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>

            <nav aria-label="Hỗ trợ">
              <h3 className="w3-mono mb-4 text-sm uppercase tracking-widest text-white">
                Hỗ trợ
              </h3>
              <ul className="flex flex-col gap-1">
                {[
                  ["Hướng dẫn cài đặt", "#cach-hoat-dong"],
                  ["Trung tâm trợ giúp", "#"],
                  ["Liên hệ 1800 6868", "tel:18006868"],
                ].map(([label, href]) => (
                  <li key={label}>
                    <a
                      href={href}
                      className={`inline-block rounded py-2 text-base text-[#94A3B8] transition-colors hover:text-[#F7931A] ${FOCUS}`}
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Pháp lý">
              <h3 className="w3-mono mb-4 text-sm uppercase tracking-widest text-white">
                Pháp lý
              </h3>
              <ul className="flex flex-col gap-1">
                {[
                  ["Quyền riêng tư", "#"],
                  ["Điều khoản sử dụng", "#"],
                  ["Bảo mật dữ liệu", "#"],
                ].map(([label, href]) => (
                  <li key={label}>
                    <a
                      href={href}
                      className={`inline-block rounded py-2 text-base text-[#94A3B8] transition-colors hover:text-[#F7931A] ${FOCUS}`}
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="border-t border-white/10">
            <div className="w3-mono mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-6 text-xs uppercase tracking-widest text-[#94A3B8] sm:px-6">
              <p>© 2026 SEN Labs — Bản đề xuất thiết kế</p>
              <p className="flex items-center gap-3">
                <LiveDot />
                Mainnet: Gia đình · Block #1.024 · Uptime 99,9%
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
