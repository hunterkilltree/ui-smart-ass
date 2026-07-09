import type { Metadata } from "next";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  ArrowRight,
  MessageSquareText,
  Mic,
  Plus,
  ShieldCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Design proposal: Swiss Minimalist — SEN",
  description:
    "Bản đề xuất thiết kế trang giới thiệu SEN theo phong cách Swiss International (International Typographic Style).",
  robots: { index: false, follow: false },
};

/* ------------------------------------------------------------------ */
/* Swiss International tokens                                          */
/* ------------------------------------------------------------------ */

// Palette (spec): #FFFFFF bg · #000000 fg/borders · #F2F2F2 muted · #FF3000
// Swiss Red as the only signal color. Hex values are written literally in
// class names because Tailwind's scanner needs literal strings.

// Shared focus treatment — high-contrast 2px red ring, per the style spec.
const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3000] focus-visible:ring-offset-2";

/* CSS-generated textures + local Helvetica stack (no webfont fetch).
 * Patterns per spec: 24px grid, 16px dots, 45° diagonals, fractal noise. */
const swissCss = `
.swiss-page {
  font-family: "Helvetica Neue", "Neue Haas Grotesk Text", Helvetica,
    "Inter", Arial, "Liberation Sans", ui-sans-serif, system-ui, sans-serif;
}
.swiss-grid-pattern {
  background-image:
    linear-gradient(to right, rgba(0, 0, 0, 0.06) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0, 0, 0, 0.06) 1px, transparent 1px);
  background-size: 24px 24px;
}
.swiss-dots {
  background-image: radial-gradient(rgba(0, 0, 0, 0.12) 1px, transparent 1px);
  background-size: 16px 16px;
}
.swiss-diagonal {
  background-image: repeating-linear-gradient(
    45deg,
    rgba(0, 0, 0, 0.05) 0px,
    rgba(0, 0, 0, 0.05) 1px,
    transparent 1px,
    transparent 10px
  );
}
.swiss-noise {
  position: relative;
}
.swiss-noise::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  opacity: 0.03;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2'/></filter><rect width='200' height='200' filter='url(%23n)'/></svg>");
}
@media (prefers-reduced-motion: reduce) {
  .swiss-page *,
  .swiss-page *::before,
  .swiss-page *::after {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
`;

/* ------------------------------------------------------------------ */
/* Content (Vietnamese marketing copy)                                 */
/* ------------------------------------------------------------------ */

type Stat = { value: string; label: string };

const STATS: Stat[] = [
  { value: "03", label: "Kênh nhắn tin: Zalo · Messenger · Telegram" },
  { value: "15′", label: "Phút cắm điện là dùng được ngay" },
  { value: "24/7", label: "Theo dõi sức khoẻ thiết bị từ xa" },
  { value: "02", label: "Ngôn ngữ: Tiếng Việt & English" },
];

type Feature = {
  icon: LucideIcon;
  tag: string;
  title: string;
  body: string;
};

const FEATURES: Feature[] = [
  {
    icon: MessageSquareText,
    tag: "Zalo / Messenger / Telegram",
    title: "Kênh nhắn tin gia đình",
    body: "SEN đọc to tin nhắn của con cháu từ Zalo, Messenger, Telegram — và gửi lời hồi âm bằng chính giọng nói của ông bà. Không cần điện thoại thông minh, không cần bấm nút.",
  },
  {
    icon: Mic,
    tag: "Giọng nói cá nhân",
    title: "Luyện giọng nói riêng",
    body: "Chỉ cần đọc vài câu mẫu, SEN học cách nói của từng người: giọng vùng miền, nói chậm hay nói nhỏ. Càng dùng, SEN càng nghe rõ và hiểu đúng hơn.",
  },
  {
    icon: Activity,
    tag: "Giám sát từ xa",
    title: "Sức khoẻ thiết bị",
    body: "Con cháu xem tình trạng máy mọi lúc: Wi-Fi, micro, loa, cảm biến. Thiết bị gặp sự cố là cả nhà biết ngay — không để ông bà chờ trong im lặng.",
  },
  {
    icon: ShieldCheck,
    tag: "Mã hoá đầu-cuối",
    title: "Riêng tư & an toàn",
    body: "Chuyện của gia đình chỉ thuộc về gia đình. Dữ liệu giọng nói được mã hoá, không bán cho bên thứ ba, không quảng cáo. Con cháu toàn quyền kiểm soát.",
  },
];

type Step = { n: string; title: string; body: string };

const STEPS: Step[] = [
  {
    n: "01",
    title: "Cắm điện, kết nối Wi-Fi",
    body: "Đặt SEN ở phòng khách hay đầu giường. Cắm điện, chọn mạng Wi-Fi trong nhà. Toàn bộ mất khoảng 15 phút — con cháu làm giúp một lần là xong.",
  },
  {
    n: "02",
    title: "Con cháu kết nối kênh",
    body: "Từ trang quản lý, con cháu liên kết Zalo, Messenger hoặc Telegram của gia đình và theo dõi tình trạng thiết bị từ xa — dù ở xa vẫn yên tâm.",
  },
  {
    n: "03",
    title: "Trò chuyện mỗi ngày",
    body: "Ông bà chỉ cần nói. SEN đọc tin nhắn mới, gửi lời hỏi thăm cho con cháu, nhắc giờ uống thuốc — tất cả chỉ bằng giọng nói.",
  },
];

type Faq = { q: string; a: string };

const FAQS: Faq[] = [
  {
    q: "Ông bà không rành công nghệ có dùng được không?",
    a: "Được. SEN điều khiển hoàn toàn bằng giọng nói tiếng Việt — không màn hình cảm ứng, không ứng dụng phải học. Nói chuyện với SEN tự nhiên như nói với người trong nhà.",
  },
  {
    q: "SEN có cần điện thoại thông minh không?",
    a: "Không. Ông bà chỉ cần thiết bị SEN và Wi-Fi trong nhà. Điện thoại chỉ dành cho con cháu — để kết nối kênh nhắn tin và theo dõi thiết bị từ xa.",
  },
  {
    q: "Dữ liệu giọng nói có được bảo mật không?",
    a: "Có. Mọi đoạn ghi âm luyện giọng và tin nhắn đều được mã hoá. Gia đình có thể xoá dữ liệu bất cứ lúc nào từ trang quản lý. SEN không bán dữ liệu và không chạy quảng cáo.",
  },
];

const NAV_LINKS: { href: string; label: string }[] = [
  { href: "#he-thong", label: "Hệ thống" },
  { href: "#cach-hoat-dong", label: "Cách hoạt động" },
  { href: "#gia-dinh", label: "Gia đình" },
  { href: "#cau-hoi", label: "Câu hỏi" },
];

const OTHER_PROPOSALS: { href: string; label: string }[] = [
  { href: "/designs/art-deco", label: "Art Deco" },
  { href: "/designs/playful-geometric", label: "Playful Geometric" },
  { href: "/designs/web3", label: "Web3" },
];

/* ------------------------------------------------------------------ */
/* Local building blocks                                               */
/* ------------------------------------------------------------------ */

function SectionHeading({
  no,
  vi,
  en,
}: {
  no: string;
  vi: string;
  en: string;
}) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
      <span className="text-lg font-black tracking-widest text-[#FF3000]">
        {no}
      </span>
      <h2 className="text-4xl font-black uppercase leading-none tracking-tighter md:text-6xl">
        {vi}
      </h2>
      <span className="text-sm font-bold uppercase tracking-widest text-neutral-600">
        {en}
      </span>
    </div>
  );
}

function CtaLink({
  href,
  children,
  variant,
}: {
  href: string;
  children: React.ReactNode;
  variant: "primary" | "secondary" | "red";
}) {
  const base = `inline-flex h-14 min-w-[44px] items-center justify-center gap-3 rounded-none px-8 text-lg font-bold uppercase tracking-wide transition-colors duration-150 ${focusRing}`;
  const styles =
    variant === "primary"
      ? "bg-black text-white hover:bg-[#FF3000]"
      : variant === "red"
        ? "bg-[#FF3000] text-white hover:bg-white hover:text-black"
        : "border-2 border-black bg-white text-black hover:bg-black hover:text-white";
  return (
    <a href={href} className={`${base} ${styles}`}>
      {children}
    </a>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function SwissMinimalistProposalPage() {
  return (
    <div
      id="top"
      className="swiss-page swiss-noise relative min-h-screen bg-white pt-11 text-black"
    >
      <style>{swissCss}</style>

      {/* Proposal meta bar (neutral, not part of the style mockup) */}
      <div className="fixed inset-x-0 top-0 z-50 flex h-11 items-center justify-between gap-4 bg-neutral-900 px-4 text-sm text-neutral-100">
        <p className="truncate">
          Design proposal:{" "}
          <span className="font-semibold text-white">Swiss Minimalist</span>
        </p>
        <nav aria-label="Design proposals" className="flex items-center">
          <Link
            href="/designs"
            className={`px-2 py-2.5 font-medium underline underline-offset-2 hover:text-white ${focusRing} focus-visible:ring-offset-neutral-900`}
          >
            /designs
          </Link>
          {OTHER_PROPOSALS.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className={`hidden px-2 py-2.5 underline underline-offset-2 hover:text-white sm:inline-block ${focusRing} focus-visible:ring-offset-neutral-900`}
            >
              {p.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mockup header */}
      <header className="sticky top-11 z-40 border-b-4 border-black bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 md:px-8">
          <a
            href="#top"
            className={`px-1 py-2 text-3xl font-black leading-none tracking-tighter ${focusRing}`}
            aria-label="SEN — về đầu trang"
          >
            SEN<span className="text-[#FF3000]">.</span>
          </a>

          <nav
            aria-label="Điều hướng trang"
            className="hidden items-center lg:flex"
          >
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={`group relative px-4 py-3 text-lg font-bold uppercase tracking-tight ${focusRing}`}
              >
                <span className="relative inline-block overflow-hidden align-middle">
                  <span className="block transition-transform duration-200 ease-out group-hover:-translate-y-full">
                    {l.label}
                  </span>
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 block translate-y-full text-[#FF3000] transition-transform duration-200 ease-out group-hover:translate-y-0"
                  >
                    {l.label}
                  </span>
                </span>
              </a>
            ))}
          </nav>

          <a
            href="#dat-mua"
            className={`inline-flex h-12 items-center bg-black px-6 text-base font-bold uppercase tracking-wide text-white transition-colors duration-150 hover:bg-[#FF3000] md:h-14 md:px-8 md:text-lg ${focusRing}`}
          >
            Đặt mua
          </a>
        </div>
      </header>

      <main>
        {/* ---------------------------------------------------------- */}
        {/* Hero — asymmetric 7:5, massive flush-left type              */}
        {/* ---------------------------------------------------------- */}
        <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
          <div className="grid grid-cols-12 gap-8 lg:gap-12">
            <div className="col-span-12 lg:col-span-7">
              <p className="mb-8 inline-block border-2 border-black px-4 py-2 text-sm font-bold uppercase tracking-widest">
                Trợ lý AI cho người lớn tuổi Việt Nam
              </p>
              <h1 className="text-5xl font-black uppercase leading-[1.02] tracking-tighter sm:text-6xl md:text-7xl xl:text-8xl">
                Gần con<span className="text-[#FF3000]">.</span> Gần cháu
                <span className="text-[#FF3000]">.</span> Bằng giọng nói
                <span className="text-[#FF3000]">.</span>
              </h1>
              <p className="mt-10 max-w-2xl text-lg leading-relaxed md:text-xl">
                SEN là thiết bị trợ lý AI đặt trong nhà, giúp ông bà nghe và
                gửi tin nhắn Zalo, Messenger, Telegram cho con cháu — chỉ bằng
                giọng nói, không cần điện thoại thông minh.
              </p>
              <div className="mt-12 flex flex-col gap-4 sm:flex-row">
                <CtaLink href="#dat-mua" variant="primary">
                  Đặt mua SEN
                  <ArrowRight aria-hidden="true" className="h-5 w-5" />
                </CtaLink>
                <CtaLink href="#cach-hoat-dong" variant="secondary">
                  Xem cách hoạt động
                </CtaLink>
              </div>
              <p className="mt-10 text-base font-bold uppercase tracking-widest text-neutral-600">
                Giao hàng tại Hà Nội · Đà Nẵng · TP.HCM
              </p>
            </div>

            {/* Bauhaus-style abstract composition on visible grid */}
            <div className="col-span-12 lg:col-span-5">
              <div
                aria-hidden="true"
                className="swiss-grid-pattern relative aspect-square w-full border-4 border-black"
              >
                <div className="absolute left-[10%] top-[10%] h-[42%] w-[42%] rounded-full bg-[#FF3000] shadow-[0_0_0_8px_rgba(255,48,0,0.1)]" />
                <div className="swiss-diagonal absolute right-[8%] top-[18%] h-[26%] w-[26%] border-2 border-black bg-white" />
                <div className="absolute bottom-[12%] right-[12%] h-[34%] w-[34%] bg-black" />
                <div className="absolute bottom-[18%] left-[10%] flex h-[22%] w-[40%] items-center border-2 border-black bg-white px-[6%]">
                  <span className="text-4xl font-black tracking-tighter md:text-5xl">
                    SEN
                  </span>
                </div>
                <div className="absolute left-[10%] top-[62%] h-1 w-[55%] bg-black" />
                <div className="absolute left-[10%] top-[66%] h-1 w-[40%] bg-black" />
                <div className="absolute left-[10%] top-[70%] h-1 w-[25%] bg-[#FF3000]" />
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/* Stats / trust strip                                         */}
        {/* ---------------------------------------------------------- */}
        <section
          aria-label="Số liệu chính"
          className="border-y-4 border-black"
        >
          <div className="grid grid-cols-2 gap-px bg-white lg:grid-cols-4">
            {STATS.map((s) => (
              <div
                key={s.value}
                className="group bg-black p-8 text-white transition-colors duration-200 hover:bg-[#FF3000] hover:text-black md:p-10"
              >
                <div className="flex items-start justify-between">
                  <span className="origin-left text-5xl font-black tracking-tighter transition-transform duration-200 ease-out group-hover:scale-105 md:text-6xl">
                    {s.value}
                  </span>
                  <Plus
                    aria-hidden="true"
                    className="mt-2 h-6 w-6 transition-transform duration-200 ease-out group-hover:rotate-90"
                  />
                </div>
                <p className="mt-6 text-base font-bold uppercase leading-snug tracking-wide">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/* 01 — Features                                               */}
        {/* ---------------------------------------------------------- */}
        <section
          id="he-thong"
          className="mx-auto max-w-7xl scroll-mt-40 px-4 py-16 md:px-8 md:py-24"
        >
          <SectionHeading no="01" vi="Hệ thống" en="System" />
          <p className="mt-6 max-w-3xl text-lg leading-relaxed md:text-xl">
            Một thiết bị nhỏ trong nhà, một trang quản lý cho con cháu. Bốn
            khối chức năng, không gì thừa.
          </p>

          <div className="mt-12 grid gap-px border-4 border-black bg-black md:grid-cols-2">
            {FEATURES.map((f) => (
              <article
                key={f.title}
                className="group bg-white p-8 transition-colors duration-200 hover:bg-black hover:text-white md:p-12"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center border-2 border-black transition-colors duration-200 group-hover:border-[#FF3000] group-hover:text-[#FF3000]">
                    <f.icon aria-hidden="true" className="h-7 w-7" />
                  </span>
                  <ArrowRight
                    aria-hidden="true"
                    className="h-7 w-7 -rotate-45 text-black transition-all duration-200 ease-out group-hover:rotate-0 group-hover:text-[#FF3000]"
                  />
                </div>
                <p className="mt-8 text-sm font-bold uppercase tracking-widest text-neutral-600 transition-colors duration-200 group-hover:text-neutral-300">
                  {f.tag}
                </p>
                <h3 className="mt-2 text-2xl font-black uppercase leading-tight tracking-tight md:text-3xl">
                  {f.title}
                </h3>
                <p className="mt-4 text-base leading-relaxed md:text-lg">
                  {f.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/* 02 — How it works                                           */}
        {/* ---------------------------------------------------------- */}
        <section
          id="cach-hoat-dong"
          className="swiss-dots scroll-mt-40 border-y-4 border-black bg-[#F2F2F2]"
        >
          <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
            <div className="grid grid-cols-12 gap-8 lg:gap-16">
              <div className="col-span-12 lg:col-span-4">
                <div className="lg:sticky lg:top-44">
                  <SectionHeading no="02" vi="Cách dùng" en="Method" />
                  <p className="mt-6 text-lg leading-relaxed md:text-xl">
                    Ba bước. Một lần cài đặt. Cả nhà dùng được ngay — kể cả
                    người chưa từng dùng điện thoại thông minh.
                  </p>
                </div>
              </div>
              <div className="col-span-12 lg:col-span-8">
                <ol className="border-t-2 border-black">
                  {STEPS.map((step) => (
                    <li
                      key={step.n}
                      className="grid grid-cols-12 gap-4 border-b-2 border-black py-10 md:gap-8"
                    >
                      <span
                        aria-hidden="true"
                        className="col-span-3 text-6xl font-black leading-none tracking-tighter text-[#FF3000] md:col-span-2 md:text-7xl"
                      >
                        {step.n}
                      </span>
                      <div className="col-span-9 md:col-span-10">
                        <h3 className="text-2xl font-black uppercase leading-tight tracking-tight md:text-3xl">
                          {step.title}
                        </h3>
                        <p className="mt-4 max-w-xl text-base leading-relaxed md:text-lg">
                          {step.body}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/* 03 — Testimonial                                            */}
        {/* ---------------------------------------------------------- */}
        <section
          id="gia-dinh"
          className="mx-auto max-w-7xl scroll-mt-40 px-4 py-16 md:px-8 md:py-24"
        >
          <SectionHeading no="03" vi="Gia đình nói gì" en="Voices" />

          <figure className="mt-12 grid grid-cols-12 gap-8">
            <div aria-hidden="true" className="col-span-12 lg:col-span-2">
              <span className="block text-[8rem] font-black leading-[0.6] text-[#FF3000]">
                “
              </span>
            </div>
            <div className="col-span-12 lg:col-span-10">
              <div className="border-2 border-black p-8 transition-all duration-200 ease-out hover:-translate-y-px hover:border-[#FF3000] md:p-12">
                <blockquote className="text-2xl font-bold leading-tight tracking-tight md:text-4xl">
                  Mẹ tôi 76 tuổi, mắt kém, không dùng được điện thoại cảm
                  ứng. Từ ngày có SEN, sáng nào mẹ cũng nghe tin nhắn của con
                  cháu qua Zalo và tự trả lời bằng giọng nói. Cả nhà thấy gần
                  nhau hơn hẳn.
                </blockquote>
                <figcaption className="mt-8 flex flex-wrap items-baseline gap-x-4 gap-y-1 border-t-2 border-black pt-6">
                  <span className="text-lg font-black uppercase tracking-tight">
                    Chị Thu Hà, 42 tuổi
                  </span>
                  <span className="text-base text-neutral-600">
                    Con gái của bác Lan (76 tuổi) — Hà Nội
                  </span>
                </figcaption>
              </div>
            </div>
          </figure>
        </section>

        {/* ---------------------------------------------------------- */}
        {/* 04 — FAQ (native details/summary, no JS)                    */}
        {/* ---------------------------------------------------------- */}
        <section
          id="cau-hoi"
          className="mx-auto max-w-7xl scroll-mt-40 px-4 pb-16 md:px-8 md:pb-24"
        >
          <SectionHeading no="04" vi="Câu hỏi thường gặp" en="FAQ" />

          <div className="mt-12 grid gap-px border-4 border-black bg-black">
            {FAQS.map((f) => (
              <details key={f.q} className="group bg-white">
                <summary
                  className={`flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-6 p-6 transition-colors duration-150 hover:bg-[#FF3000] hover:text-black md:p-8 [&::-webkit-details-marker]:hidden ${focusRing} focus-visible:ring-inset`}
                >
                  <h3 className="text-lg font-black uppercase leading-snug tracking-tight md:text-xl">
                    {f.q}
                  </h3>
                  <Plus
                    aria-hidden="true"
                    className="h-7 w-7 shrink-0 transition-transform duration-200 ease-out group-open:rotate-45"
                  />
                </summary>
                <p className="border-t-2 border-black p-6 text-base leading-relaxed md:p-8 md:text-lg">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/* Final CTA                                                   */}
        {/* ---------------------------------------------------------- */}
        <section id="dat-mua" className="scroll-mt-40 bg-black text-white">
          <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-32">
            <div className="grid grid-cols-12 gap-10">
              <div className="col-span-12 lg:col-span-8">
                <h2 className="text-4xl font-black uppercase leading-[1.05] tracking-tighter sm:text-5xl md:text-7xl">
                  Để tiếng nói gia đình luôn bên cạnh
                  <span className="text-[#FF3000]">.</span>
                </h2>
              </div>
              <div className="col-span-12 flex flex-col justify-end gap-6 lg:col-span-4">
                <CtaLink href="#top" variant="red">
                  Đặt mua SEN ngay
                  <ArrowRight aria-hidden="true" className="h-5 w-5" />
                </CtaLink>
                <p className="text-lg leading-relaxed">
                  Hoặc gọi tư vấn miễn phí:{" "}
                  <a
                    href="tel:18006868"
                    className={`inline-block py-1 font-black underline underline-offset-4 hover:text-[#FF3000] ${focusRing} focus-visible:ring-offset-black`}
                  >
                    1800 6868
                  </a>
                </p>
                <p className="text-base font-bold uppercase tracking-widest text-neutral-300">
                  Đổi trả 30 ngày · Bảo hành 24 tháng
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/* Footer                                                      */}
        {/* ---------------------------------------------------------- */}
        <footer className="border-t-4 border-black bg-white">
          <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
            <div className="grid grid-cols-12 gap-10">
              <div className="col-span-12 md:col-span-5">
                <p className="text-3xl font-black tracking-tighter">
                  SEN<span className="text-[#FF3000]">.</span>
                </p>
                <p className="mt-4 max-w-sm text-base leading-relaxed">
                  Người bạn đồng hành AI cho người lớn tuổi Việt Nam. Thiết bị
                  ESP32 đặt trong nhà, kết nối gia đình bằng giọng nói.
                </p>
              </div>
              {(
                [
                  {
                    heading: "Sản phẩm",
                    links: [
                      { href: "#he-thong", label: "Tính năng" },
                      { href: "#cach-hoat-dong", label: "Cách hoạt động" },
                      { href: "#dat-mua", label: "Đặt mua" },
                    ],
                  },
                  {
                    heading: "Hỗ trợ",
                    links: [
                      { href: "#cau-hoi", label: "Câu hỏi thường gặp" },
                      { href: "#dat-mua", label: "Tư vấn miễn phí" },
                      { href: "#gia-dinh", label: "Câu chuyện gia đình" },
                    ],
                  },
                ] as const
              ).map((col) => (
                <nav
                  key={col.heading}
                  aria-label={col.heading}
                  className="col-span-6 md:col-span-3"
                >
                  <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-600">
                    {col.heading}
                  </h2>
                  <ul className="mt-4 space-y-1">
                    {col.links.map((l) => (
                      <li key={l.label}>
                        <a
                          href={l.href}
                          className={`inline-block py-2 text-base font-bold hover:text-[#FF3000] hover:underline hover:underline-offset-4 md:text-lg ${focusRing}`}
                        >
                          {l.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              ))}
              <div className="col-span-12 md:col-span-1">
                <div
                  aria-hidden="true"
                  className="h-14 w-14 rounded-full bg-[#FF3000] shadow-[0_0_0_8px_rgba(255,48,0,0.1)]"
                />
              </div>
            </div>

            <div className="mt-16 flex flex-col justify-between gap-3 border-t-2 border-black pt-6 md:flex-row">
              <p className="text-base">© 2026 SEN — Hà Nội, Việt Nam.</p>
              <p className="text-sm font-bold uppercase tracking-widest text-neutral-600">
                Design proposal — Swiss International Style
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
