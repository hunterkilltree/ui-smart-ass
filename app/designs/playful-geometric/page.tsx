import type { Metadata } from "next";
import Link from "next/link";
import {
  Check,
  HeartPulse,
  MessageCircle,
  Mic,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import {
  CandyLink,
  DeviceScene,
  OutlineLink,
  SenMark,
  Squiggle,
  TriangleShape,
} from "./parts";

export const metadata: Metadata = {
  title: "Design proposal — Playful Geometric | SEN",
  description:
    "Phương án thiết kế Playful Geometric cho trang giới thiệu SEN — bản mô phỏng để so sánh hướng thiết kế.",
  robots: { index: false, follow: false },
};

/* ------------------------------------------------------------------ *
 * Content data. Class strings stay as literals so Tailwind can see them.
 * ------------------------------------------------------------------ */

const stats = [
  {
    value: "3",
    label: "kênh nhắn tin quen thuộc — Zalo, Messenger, Telegram",
    chip: "bg-[#8B5CF6]",
  },
  {
    value: "15 phút",
    label: "từ lúc mở hộp đến câu chào đầu tiên",
    chip: "bg-[#F472B6]",
  },
  {
    value: "100%",
    label: "giao diện và giọng đọc tiếng Việt",
    chip: "bg-[#FBBF24]",
  },
  {
    value: "24/7",
    label: "theo dõi Wi-Fi, micro, loa của thiết bị",
    chip: "bg-[#34D399]",
  },
];

const features = [
  {
    icon: MessageCircle,
    iconWrap: "bg-[#8B5CF6] text-white",
    shadow: "shadow-[8px_8px_0_0_#E2E8F0] hover:shadow-[8px_8px_0_0_#8B5CF6]",
    title: "Tin nhắn cả nhà, đọc to rõ ràng",
    body: "Kết nối Zalo, Messenger, Telegram một lần. Mỗi lời hỏi thăm của con cháu được SEN đọc to, chậm rãi — ông bà nói lời đáp, SEN gửi giúp ngay.",
  },
  {
    icon: Mic,
    iconWrap: "bg-[#F472B6] text-[#1E293B]",
    shadow: "shadow-[8px_8px_0_0_#E2E8F0] hover:shadow-[8px_8px_0_0_#F472B6]",
    title: "Hiểu đúng giọng của ông bà",
    body: "Chỉ cần đọc theo vài câu mẫu, SEN học giọng riêng của từng người — nghe rõ giọng Bắc, Trung, Nam, không bắt ông bà phải đổi cách nói.",
  },
  {
    icon: HeartPulse,
    iconWrap: "bg-[#FBBF24] text-[#1E293B]",
    shadow: "shadow-[8px_8px_0_0_#E2E8F0] hover:shadow-[8px_8px_0_0_#FBBF24]",
    title: "Thiết bị khỏe, cả nhà yên tâm",
    body: "Wi-Fi yếu, micro trục trặc hay loa im lặng — ứng dụng báo cho con cháu ngay lập tức, kèm hướng dẫn khắc phục từng bước một.",
  },
  {
    icon: ShieldCheck,
    iconWrap: "bg-[#34D399] text-[#1E293B]",
    shadow: "shadow-[8px_8px_0_0_#E2E8F0] hover:shadow-[8px_8px_0_0_#34D399]",
    title: "Riêng tư như chuyện trong nhà",
    body: "Giọng nói và tin nhắn chỉ dành cho gia đình. Không quảng cáo, không bán dữ liệu — con cháu xem và gỡ mọi kết nối bất cứ lúc nào.",
  },
];

const steps = [
  {
    circle: "bg-[#8B5CF6] text-white",
    title: "Cắm điện, nối Wi-Fi",
    body: "Con cháu cài đặt giúp qua ứng dụng SEN — khoảng 15 phút, làm một lần duy nhất.",
  },
  {
    circle: "bg-[#F472B6] text-[#1E293B]",
    title: "Ông bà đọc vài câu mẫu",
    body: "SEN lắng nghe và học giọng nói thân quen để nghe đúng từng lời, không nhầm lẫn.",
  },
  {
    circle: "bg-[#FBBF24] text-[#1E293B]",
    title: "Cả nhà nhắn, SEN nói",
    body: "Tin nhắn từ Zalo, Messenger, Telegram vang lên ấm áp ngay trong phòng khách.",
  },
];

const marqueeWords = [
  "Zalo",
  "Messenger",
  "Telegram",
  "Tiếng Việt là mặc định",
  "Giọng nói thân quen",
  "An toàn cho gia đình",
  "Không cần điện thoại",
];

const trustPoints = [
  "Thiết lập trong 15 phút",
  "Tiếng Việt là mặc định",
  "Con cháu quản lý từ xa",
];

const proposalLinks = [
  { href: "/designs/art-deco", label: "Art Deco" },
  { href: "/designs/swiss-minimalist", label: "Swiss Minimalist" },
  { href: "/designs/web3", label: "Web3" },
];

const footerColumns: { heading: string; links: { href: string; label: string }[] }[] = [
  {
    heading: "Sản phẩm",
    links: [
      { href: "#tinh-nang", label: "Tính năng" },
      { href: "#cach-hoat-dong", label: "Cách hoạt động" },
      { href: "#cau-chuyen", label: "Câu chuyện gia đình" },
      { href: "/dashboard", label: "Bảng điều khiển" },
    ],
  },
  {
    heading: "Hỗ trợ",
    links: [
      { href: "#cach-hoat-dong", label: "Hướng dẫn cài đặt" },
      { href: "#tinh-nang", label: "Câu hỏi thường gặp" },
      { href: "#dat-mua", label: "Bảo hành & đổi trả" },
      { href: "mailto:giadinh@sen.vn", label: "giadinh@sen.vn" },
    ],
  },
  {
    heading: "Phương án thiết kế",
    links: [{ href: "/designs", label: "Tất cả phương án" }, ...proposalLinks],
  },
];

function MarqueeRow() {
  return (
    <div className="flex w-max shrink-0 items-center">
      {marqueeWords.map((word) => (
        <span key={word} className="flex items-center">
          <span className="pg-display px-6 text-lg font-extrabold uppercase tracking-wide text-[#1E293B]">
            {word}
          </span>
          <Star className="h-5 w-5 fill-[#FBBF24] text-[#1E293B]" strokeWidth={2.5} />
        </span>
      ))}
    </div>
  );
}

export default function PlayfulGeometricProposalPage() {
  return (
    <div className="pg-root min-h-screen bg-[#FFFDF5] pt-11 text-[#1E293B]">
      {/* Scoped styles: font stacks (local approximations — no network
          fonts), dot pattern, keyframes, focus + reduced-motion rules. */}
      <style>{`
        .pg-root {
          font-family: "Plus Jakarta Sans", "Avenir Next", "Segoe UI",
            "Helvetica Neue", system-ui, -apple-system, sans-serif;
        }
        .pg-display {
          font-family: "Outfit", "Nunito", "Quicksand", "Avenir Next Rounded",
            "Avenir Next", "Trebuchet MS", ui-rounded, system-ui, sans-serif;
        }
        .pg-dots {
          background-image: radial-gradient(#cbd5e1 1.5px, transparent 1.5px);
          background-size: 18px 18px;
        }
        .pg-root [id] {
          scroll-margin-top: 5rem;
        }
        .pg-root a:focus-visible,
        .pg-root button:focus-visible {
          outline: 3px solid #7c3aed;
          outline-offset: 3px;
        }
        .pg-root .pg-focus-light:focus-visible {
          outline-color: #fffdf5;
        }
        @keyframes pg-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes pg-wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(3deg); }
          75% { transform: rotate(-3deg); }
        }
        @keyframes pg-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes pg-pop {
          from { opacity: 0; transform: scale(0.85); }
          to { opacity: 1; transform: scale(1); }
        }
        .pg-marquee-track { animation: pg-marquee 28s linear infinite; }
        .pg-float { animation: pg-float 5s ease-in-out infinite; }
        .pg-pop { animation: pg-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
        .pg-sticker:hover .pg-wiggle-icon { animation: pg-wiggle 0.5s ease-in-out; }
        @media (prefers-reduced-motion: reduce) {
          .pg-root *,
          .pg-root *::before,
          .pg-root *::after {
            animation-duration: 0.01ms !important;
            animation-delay: 0s !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
          .pg-marquee-track { animation: none !important; }
        }
      `}</style>

      {/* ------------------------------------------------------------ */}
      {/* Proposal bar (meta UI — intentionally neutral, not in-style)  */}
      {/* ------------------------------------------------------------ */}
      <div className="fixed inset-x-0 top-0 z-50 flex h-11 items-center justify-between gap-4 bg-[#0f172a] px-4 text-sm text-slate-200">
        <p className="truncate font-semibold">
          Design proposal: <span className="text-white">Playful Geometric</span>
        </p>
        <nav aria-label="Design proposals" className="flex items-center gap-4">
          <Link
            href="/designs"
            className="pg-focus-light rounded-sm font-semibold underline underline-offset-4 hover:text-white"
          >
            All proposals
          </Link>
          {proposalLinks.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="pg-focus-light hidden rounded-sm text-slate-300 underline-offset-4 hover:text-white hover:underline sm:inline"
            >
              {p.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* ------------------------------------------------------------ */}
      {/* Landing header                                                */}
      {/* ------------------------------------------------------------ */}
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
        <SenMark />
        <nav
          aria-label="Trang giới thiệu"
          className="hidden items-center gap-7 text-base font-bold md:flex"
        >
          <a href="#tinh-nang" className="rounded-sm py-2 hover:text-[#7C3AED]">
            Tính năng
          </a>
          <a href="#cach-hoat-dong" className="rounded-sm py-2 hover:text-[#7C3AED]">
            Cách hoạt động
          </a>
          <a href="#cau-chuyen" className="rounded-sm py-2 hover:text-[#7C3AED]">
            Câu chuyện
          </a>
        </nav>
        <CandyLink href="#dat-mua" tone="yellow" size="sm">
          Dùng thử SEN
        </CandyLink>
      </header>

      <main>
        {/* ---------------------------------------------------------- */}
        {/* Hero                                                        */}
        {/* ---------------------------------------------------------- */}
        <section className="relative mx-auto max-w-6xl overflow-hidden px-4 pb-20 pt-10 sm:px-6 lg:pb-24">
          {/* background confetti (hidden on small screens so it never
              collides with text) */}
          <TriangleShape className="absolute right-10 top-6 hidden h-10 w-10 text-[#FBBF24] lg:block" />
          <div
            aria-hidden="true"
            className="absolute -left-24 top-40 hidden h-56 w-56 rounded-full border-2 border-[#1E293B] bg-[#F1F5F9] lg:block"
          />
          <div className="relative grid items-center gap-14 lg:grid-cols-2">
            <div className="pg-pop">
              <p className="inline-flex items-center gap-2 rounded-full border-2 border-[#1E293B] bg-white px-4 py-2 text-base font-bold shadow-[3px_3px_0_0_#1E293B]">
                <Sparkles className="h-5 w-5 text-[#7C3AED]" strokeWidth={2.5} aria-hidden="true" />
                Người bạn đồng hành AI cho ông bà
              </p>
              <h1 className="pg-display mt-6 text-4xl font-extrabold leading-[1.15] tracking-tight sm:text-5xl lg:text-6xl">
                Cả nhà luôn{" "}
                <span className="inline-block -rotate-1 rounded-xl border-2 border-[#1E293B] bg-[#FBBF24] px-3 py-0.5">
                  ở bên
                </span>
                , dù xa ngàn cây số.
              </h1>
              <Squiggle className="mt-4 w-40 text-[#F472B6]" />
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#475569]">
                SEN là chiếc loa AI nhỏ xinh đặt trong phòng khách. Ông bà chỉ
                cần nói — SEN đọc to tin nhắn của con cháu từ Zalo, Messenger,
                Telegram và gửi lời hồi âm giúp. Không màn hình rối mắt, không
                cần điện thoại.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <CandyLink href="#dat-mua" withArrow>
                  Đặt mua SEN
                </CandyLink>
                <OutlineLink href="#cach-hoat-dong">Xem cách hoạt động</OutlineLink>
              </div>
              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
                {trustPoints.map((point) => (
                  <li key={point} className="flex items-center gap-2 text-base font-semibold">
                    <span
                      aria-hidden="true"
                      className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#1E293B] bg-[#34D399]"
                    >
                      <Check className="h-3.5 w-3.5 text-[#1E293B]" strokeWidth={3} />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <div className="pg-pop [animation-delay:0.15s]">
              <DeviceScene />
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/* Marquee strip (decorative)                                  */}
        {/* ---------------------------------------------------------- */}
        <div
          aria-hidden="true"
          className="overflow-hidden border-y-2 border-[#1E293B] bg-white py-4"
        >
          <div className="pg-marquee-track flex w-max">
            <MarqueeRow />
            <MarqueeRow />
          </div>
        </div>

        {/* ---------------------------------------------------------- */}
        {/* Stats / trust strip                                         */}
        {/* ---------------------------------------------------------- */}
        <section aria-label="Con số nổi bật" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.value}
                className="relative rounded-2xl border-2 border-[#1E293B] bg-white p-6 shadow-[6px_6px_0_0_#E2E8F0]"
              >
                <span
                  aria-hidden="true"
                  className={`absolute -top-3 right-5 h-6 w-6 rotate-12 rounded-md border-2 border-[#1E293B] ${stat.chip}`}
                />
                <p className="pg-display text-4xl font-extrabold tracking-tight">{stat.value}</p>
                <p className="mt-2 text-base leading-snug text-[#475569]">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/* Features                                                    */}
        {/* ---------------------------------------------------------- */}
        <section id="tinh-nang" className="pg-dots border-y-2 border-[#1E293B] bg-[#F1F5F9]">
          <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="pg-display text-base font-extrabold uppercase tracking-widest text-[#7C3AED]">
                Tính năng
              </p>
              <h2 className="pg-display mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                SEN làm được gì cho gia đình mình?
              </h2>
              <Squiggle className="mx-auto mt-4 w-32 text-[#FBBF24]" />
            </div>
            <div className="relative mt-16">
              {/* dashed connector behind the cards */}
              <svg
                aria-hidden="true"
                focusable="false"
                className="absolute inset-x-8 top-0 hidden h-2 lg:block"
                viewBox="0 0 1000 8"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 4 H1000"
                  stroke="#94A3B8"
                  strokeWidth="3"
                  strokeDasharray="10 12"
                  strokeLinecap="round"
                />
              </svg>
              <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
                {features.map((feature) => (
                  <article
                    key={feature.title}
                    className={`pg-sticker relative rounded-xl border-2 border-[#1E293B] bg-white px-6 pb-7 pt-12 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-rotate-1 hover:scale-[1.02] ${feature.shadow}`}
                  >
                    <span
                      aria-hidden="true"
                      className={`pg-wiggle-icon absolute -top-7 left-6 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#1E293B] shadow-[3px_3px_0_0_#1E293B] ${feature.iconWrap}`}
                    >
                      <feature.icon className="h-7 w-7" strokeWidth={2.5} />
                    </span>
                    <h3 className="pg-display text-xl font-bold leading-snug">{feature.title}</h3>
                    <p className="mt-3 text-base leading-relaxed text-[#475569]">{feature.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/* How it works                                                */}
        {/* ---------------------------------------------------------- */}
        <section id="cach-hoat-dong" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="pg-display text-base font-extrabold uppercase tracking-widest text-[#DB2777]">
              3 bước là xong
            </p>
            <h2 className="pg-display mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Cách SEN về với gia đình
            </h2>
            <Squiggle className="mx-auto mt-4 w-32 text-[#34D399]" />
          </div>
          <ol className="relative mt-16 grid gap-12 md:grid-cols-3 md:gap-8">
            {/* dashed line linking the step circles */}
            <svg
              aria-hidden="true"
              focusable="false"
              className="absolute inset-x-[16%] top-9 hidden h-2 md:block"
              viewBox="0 0 1000 8"
              preserveAspectRatio="none"
            >
              <path
                d="M0 4 H1000"
                stroke="#94A3B8"
                strokeWidth="3"
                strokeDasharray="10 12"
                strokeLinecap="round"
              />
            </svg>
            {steps.map((step, index) => (
              <li key={step.title} className="relative flex flex-col items-center text-center">
                <span
                  aria-hidden="true"
                  className={`pg-display relative flex h-[72px] w-[72px] items-center justify-center rounded-full border-2 border-[#1E293B] text-3xl font-extrabold shadow-[4px_4px_0_0_#1E293B] ${step.circle}`}
                >
                  {index + 1}
                </span>
                <h3 className="pg-display mt-6 text-xl font-bold">
                  <span className="sr-only">Bước {index + 1}: </span>
                  {step.title}
                </h3>
                <p className="mt-3 max-w-xs text-base leading-relaxed text-[#475569]">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </section>

        {/* ---------------------------------------------------------- */}
        {/* Testimonial                                                 */}
        {/* ---------------------------------------------------------- */}
        <section id="cau-chuyen" className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
          <div className="relative mx-auto max-w-3xl">
            <div
              aria-hidden="true"
              className="pg-dots absolute -left-10 -top-8 hidden h-32 w-32 rounded-3xl md:block"
            />
            <figure className="relative rounded-tl-3xl rounded-tr-3xl rounded-br-3xl rounded-bl-none border-2 border-[#1E293B] bg-white p-8 shadow-[8px_8px_0_0_#F472B6] sm:p-12">
              <span
                aria-hidden="true"
                className="pg-display absolute -top-9 right-6 flex h-24 w-24 rotate-12 flex-col items-center justify-center rounded-full border-2 border-[#1E293B] bg-[#FBBF24] text-center text-[11px] font-extrabold uppercase leading-tight shadow-[4px_4px_0_0_#1E293B]"
              >
                <Star className="mb-1 h-5 w-5 fill-[#1E293B] text-[#1E293B]" />
                Gia đình
                <br />
                tin dùng
              </span>
              <blockquote className="pg-display text-xl font-bold leading-relaxed sm:text-2xl">
                &ldquo;Mẹ tôi 74 tuổi, cầm điện thoại cảm ứng là hoa mắt. Từ
                ngày có SEN, sáng nào bà cũng chờ &lsquo;nghe tin&rsquo; các
                cháu. Bà bảo: nhà mình như đông đủ cả, chỉ thiếu mâm cơm.&rdquo;
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-4">
                <span
                  aria-hidden="true"
                  className="pg-display flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#1E293B] bg-[#34D399] text-lg font-extrabold text-[#1E293B]"
                >
                  TH
                </span>
                <span>
                  <span className="block text-lg font-bold">Chị Thu Hà, 41 tuổi</span>
                  <span className="block text-base text-[#475569]">
                    Con gái bác Lan (Hà Nội) — gia đình dùng SEN từ 2025
                  </span>
                </span>
              </figcaption>
            </figure>
          </div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/* Final CTA                                                   */}
        {/* ---------------------------------------------------------- */}
        <section id="dat-mua" className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
          <div className="relative overflow-hidden rounded-[2.5rem] border-2 border-[#1E293B] bg-[#7C3AED] px-6 py-16 text-center shadow-[10px_10px_0_0_#1E293B] sm:px-12">
            {/* confetti inside the CTA block */}
            <div
              aria-hidden="true"
              className="pg-float absolute left-8 top-8 h-6 w-6 rounded-full border-2 border-[#1E293B] bg-[#FBBF24]"
            />
            <TriangleShape className="pg-float absolute right-10 top-10 h-8 w-8 text-[#F472B6] [animation-delay:0.7s]" />
            <div
              aria-hidden="true"
              className="absolute -bottom-6 left-10 h-16 w-16 rotate-12 rounded-2xl border-2 border-[#1E293B] bg-[#34D399]"
            />
            <Squiggle className="absolute bottom-8 right-8 hidden w-24 text-[#FBBF24] sm:block" />
            <h2 className="pg-display mx-auto max-w-2xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Đừng để ông bà lỡ một lời hỏi thăm nào.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white">
              Đặt SEN cho gia đình ngay hôm nay — đổi trả trong 30 ngày, đội ngũ
              hỗ trợ nói tiếng Việt, cài đặt tận nhà tại Hà Nội và TP.HCM.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <CandyLink href="/sign-up" tone="yellow" withArrow className="pg-focus-light">
                Bắt đầu cùng SEN
              </CandyLink>
              <a
                href="mailto:giadinh@sen.vn"
                className="pg-display pg-focus-light inline-flex min-h-12 items-center justify-center rounded-full border-2 border-white px-7 py-3 text-lg font-bold text-white transition-colors duration-300 hover:bg-white hover:text-[#7C3AED]"
              >
                Nhận tư vấn cho gia đình
              </a>
            </div>
            <p className="mt-7 text-base font-semibold text-white">
              Đổi trả 30 ngày · Bảo hành 24 tháng · Hỗ trợ 1900 6868
            </p>
          </div>
        </section>
      </main>

      {/* ------------------------------------------------------------ */}
      {/* Footer                                                        */}
      {/* ------------------------------------------------------------ */}
      <footer className="border-t-2 border-[#1E293B] bg-[#1E293B] text-[#CBD5E1]">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <SenMark dark />
            <p className="mt-4 max-w-xs text-base leading-relaxed">
              Người bạn đồng hành AI cho ông bà — để mỗi lời hỏi thăm của con
              cháu luôn được nghe thấy.
            </p>
          </div>
          {footerColumns.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <h2 className="pg-display text-base font-extrabold uppercase tracking-widest text-white">
                {column.heading}
              </h2>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => {
                  const linkClasses =
                    "pg-focus-light inline-block rounded-sm py-1 text-base underline-offset-4 hover:text-white hover:underline";
                  return (
                    <li key={`${column.heading}-${link.label}`}>
                      {link.href.startsWith("mailto:") ? (
                        <a href={link.href} className={linkClasses}>
                          {link.label}
                        </a>
                      ) : (
                        <Link href={link.href} className={linkClasses}>
                          {link.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>
          ))}
        </div>
        <div className="border-t border-[#475569]">
          <p className="mx-auto max-w-6xl px-4 py-6 text-base sm:px-6">
            © 2026 SEN. Trang mô phỏng cho phương án thiết kế{" "}
            <span className="font-bold text-white">Playful Geometric</span> —
            nội dung chỉ mang tính minh hoạ, không phải trang bán hàng thật.
          </p>
        </div>
      </footer>
    </div>
  );
}
