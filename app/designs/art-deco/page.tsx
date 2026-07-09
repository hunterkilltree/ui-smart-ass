import type { Metadata } from "next";
import Link from "next/link";
import { HeartPulse, MessagesSquare, Mic, ShieldCheck } from "lucide-react";
import {
  CornerBrackets,
  DecoCta,
  Diamond,
  GoldRule,
  SectionHeading,
  StepDiamond,
} from "./deco";

/* ------------------------------------------------------------------ */
/* Design proposal: Art Deco ("Gatsby") landing mockup for SEN.        */
/* Standalone visual direction — style spec wins over the app theme,   */
/* so the page paints its own obsidian ground over the cream body.     */
/* Spec: design-prompts/art-deco.md                                    */
/* ------------------------------------------------------------------ */

export const metadata: Metadata = {
  title: "Design proposal: Art Deco — SEN",
  description:
    "Bản dựng thử trang giới thiệu SEN theo phong cách Art Deco (đề xuất thiết kế nội bộ).",
  robots: { index: false, follow: false },
};

/* Scoped styles: local font-stack approximations (no network fonts),
 * crosshatch ground, sunburst rays, focus rings, reduced-motion guard.
 * Everything is prefixed with .deco so nothing leaks to other routes. */
const decoCss = `
.deco {
  --deco-gold: #d4af37;
  /* "Marcellus / Italiana" approximation: local Didone/Roman serifs */
  --deco-display: Didot, "Didot LT STD", "Bodoni 72", "Bodoni MT",
    "Playfair Display", Georgia, "Times New Roman", serif;
  /* "Josefin Sans" approximation: local geometric sans */
  --deco-body: Futura, "Futura PT", "Century Gothic", "Avenir Next", Avenir,
    "Gill Sans", "Trebuchet MS", Verdana, sans-serif;
  font-family: var(--deco-body);
  background-color: #0a0a0a;
  /* Signature: diagonal crosshatch ground at ~4% opacity */
  background-image:
    repeating-linear-gradient(45deg, rgba(212, 175, 55, 0.04) 0 1px, transparent 1px 16px),
    repeating-linear-gradient(-45deg, rgba(212, 175, 55, 0.04) 0 1px, transparent 1px 16px);
}
.deco-display { font-family: var(--deco-display); }
.deco-body { font-family: var(--deco-body); }
.deco ::selection { background: #d4af37; color: #0a0a0a; }
.deco :is(a, button):focus-visible {
  outline: 2px solid var(--deco-gold);
  outline-offset: 3px;
}
/* Sunburst: soft gold halo + fan of rays emanating from above the hero */
.deco-sunburst {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(ellipse 75% 60% at 50% 0%, rgba(212, 175, 55, 0.16), transparent 70%);
}
.deco-rays {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: repeating-conic-gradient(from -90deg at 50% -12%, rgba(212, 175, 55, 0.08) 0deg 1.4deg, transparent 1.4deg 9deg);
  -webkit-mask-image: radial-gradient(ellipse 85% 70% at 50% 0%, black, transparent 78%);
  mask-image: radial-gradient(ellipse 85% 70% at 50% 0%, black, transparent 78%);
}
@media (prefers-reduced-motion: no-preference) {
  .deco-rise { animation: deco-rise 0.9s ease-out both; }
  .deco-rise-2 { animation: deco-rise 0.9s ease-out 0.15s both; }
  .deco-rise-3 { animation: deco-rise 0.9s ease-out 0.3s both; }
  @keyframes deco-rise {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }
}
@media (prefers-reduced-motion: reduce) {
  .deco *, .deco *::before, .deco *::after {
    animation: none !important;
    transition-duration: 0.01ms !important;
  }
}
`;

/* ---------------------------- proposal bar ------------------------- */

const OTHER_PROPOSALS = [
  { href: "/designs/swiss-minimalist", label: "Swiss Minimalist" },
  { href: "/designs/playful-geometric", label: "Playful Geometric" },
  { href: "/designs/web3", label: "Web3" },
] as const;

function ProposalBar() {
  const link =
    "inline-block px-1.5 py-2 underline decoration-zinc-500 underline-offset-4 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-300";
  return (
    <div className="fixed inset-x-0 top-0 z-50 border-b border-zinc-700 bg-zinc-900/95 text-sm text-zinc-300 backdrop-blur">
      <div className="mx-auto flex min-h-11 max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-0 px-4 py-1">
        <p className="font-medium text-zinc-100">
          Design proposal: <span className="font-semibold">Art Deco</span>
        </p>
        <nav aria-label="Design proposals" className="flex flex-wrap items-center gap-x-3">
          <Link href="/designs" className={link}>
            All designs
          </Link>
          {OTHER_PROPOSALS.map((p) => (
            <Link key={p.href} href={p.href} className={link}>
              {p.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

/* ------------------------------ content ---------------------------- */

const STATS = [
  { value: "10.000+", label: "Gia đình đang tin dùng" },
  { value: "3", label: "Kênh nhắn tin kết nối" },
  { value: "99,9%", label: "Thời gian hoạt động ổn định" },
  { value: "5 phút", label: "Cài đặt là dùng ngay" },
] as const;

const FEATURES = [
  {
    icon: MessagesSquare,
    title: "Kết nối gia đình",
    body: "Tin nhắn của con cháu từ Zalo, Messenger, Telegram được đọc thành lời ngay tại phòng khách. Cha mẹ chỉ cần nói — SEN gửi lời hồi âm đến cả nhà.",
    meta: "Zalo · Messenger · Telegram",
  },
  {
    icon: Mic,
    title: "Giọng nói thân quen",
    body: "Vài phút đọc câu mẫu, SEN học cách nghe đúng giọng của cha mẹ — dù là giọng Bắc, Trung hay Nam. Càng trò chuyện, càng hiểu ý.",
    meta: "Luyện giọng cá nhân hóa",
  },
  {
    icon: HeartPulse,
    title: "An tâm từng phút",
    body: "Micro, loa, cảm biến và Wi-Fi được theo dõi liên tục. Con cháu xem tình trạng thiết bị từ xa và biết ngay khi cha mẹ cần hỗ trợ.",
    meta: "Giám sát thiết bị 24/7",
  },
  {
    icon: ShieldCheck,
    title: "Riêng tư tuyệt đối",
    body: "Câu chuyện của gia đình là của riêng gia đình. Dữ liệu được bảo vệ nghiêm ngặt; kết nối hay ngắt từng kênh chỉ trong một chạm.",
    meta: "Gia đình toàn quyền kiểm soát",
  },
] as const;

const STEPS = [
  {
    numeral: "I",
    title: "Kết nối",
    body: "Cắm điện, chọn mạng Wi-Fi của nhà. SEN sẵn sàng phục vụ chỉ sau năm phút.",
  },
  {
    numeral: "II",
    title: "Liên kết",
    body: "Con cháu liên kết Zalo, Messenger hoặc Telegram cho cha mẹ — làm từ xa, không cần về tận nhà.",
  },
  {
    numeral: "III",
    title: "Trò chuyện",
    body: "Cha mẹ chỉ cần cất lời. SEN lắng nghe, đọc tin nhắn và gửi lời hồi âm đến cả gia đình.",
  },
] as const;

export default function ArtDecoProposalPage() {
  return (
    <div className="deco min-h-dvh text-[#F2F0E4]">
      <style>{decoCss}</style>
      <ProposalBar />

      {/* ------------------------- masthead ------------------------- */}
      <header className="px-6 pt-24 sm:pt-28">
        <div className="mx-auto max-w-6xl text-center">
          <div className="flex items-center justify-center gap-4">
            <span
              aria-hidden="true"
              className="hidden h-px max-w-40 flex-1 bg-linear-to-r from-transparent to-[#D4AF37]/70 sm:block"
            />
            <span aria-hidden="true" className="h-2.5 w-2.5 rotate-45 border border-[#D4AF37]" />
            <span className="deco-display ml-[0.35em] text-4xl tracking-[0.35em] text-[#D4AF37]">
              SEN
            </span>
            <span aria-hidden="true" className="h-2.5 w-2.5 rotate-45 border border-[#D4AF37]" />
            <span
              aria-hidden="true"
              className="hidden h-px max-w-40 flex-1 bg-linear-to-l from-transparent to-[#D4AF37]/70 sm:block"
            />
          </div>
          <p className="deco-body mt-3 text-base uppercase tracking-[0.3em] text-[#888888]">
            Người bạn đồng hành AI
          </p>
          <nav
            aria-label="Trong trang"
            className="mt-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-1"
          >
            {[
              { href: "#tinh-nang", label: "Tính năng" },
              { href: "#cach-hoat-dong", label: "Cách hoạt động" },
              { href: "#cam-nhan", label: "Cảm nhận" },
              { href: "/sign-in", label: "Đăng nhập" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="deco-body inline-block px-4 py-2.5 text-base uppercase tracking-[0.18em] text-[#F2F0E4]/80 transition-colors duration-300 hover:text-[#D4AF37]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main>
        {/* -------------------------- hero -------------------------- */}
        <section className="relative overflow-hidden px-6 pt-16 pb-24 text-center sm:pt-20 sm:pb-32">
          <div aria-hidden="true" className="deco-rays" />
          <div aria-hidden="true" className="deco-sunburst" />
          <div className="relative mx-auto max-w-5xl">
            <p className="deco-rise deco-body text-base uppercase tracking-[0.35em] text-[#D4AF37]">
              Món quà tri ân dành cho cha mẹ
            </p>
            <GoldRule className="deco-rise my-8" />
            <h1 className="deco-rise-2 deco-display text-4xl leading-[1.15] uppercase tracking-[0.12em] text-[#F2F0E4] sm:text-6xl lg:text-7xl">
              Người bạn <span className="text-[#D4AF37]">đồng hành</span>
              <br />
              của cha mẹ
            </h1>
            <p className="deco-rise-2 mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-[#F2F0E4]/80">
              SEN đưa tin nhắn của con cháu từ Zalo, Messenger và Telegram đến
              bên cha mẹ — chỉ bằng giọng nói. Không màn hình phức tạp, không
              thao tác rườm rà. Một thiết bị nhỏ gọn, một sự an tâm trọn vẹn.
            </p>
            <div className="deco-rise-3 mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <DecoCta href="/sign-up" variant="solid">
                Đặt mua cho cha mẹ
              </DecoCta>
              <DecoCta href="#tinh-nang" variant="outline">
                Khám phá tính năng
              </DecoCta>
            </div>
          </div>
        </section>

        {/* ----------------------- stats strip ---------------------- */}
        <section
          aria-label="Số liệu nổi bật"
          className="border-y border-[#D4AF37]/30 bg-[#0D0D0D]"
        >
          <dl className="mx-auto grid max-w-6xl grid-cols-2 lg:grid-cols-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col border-[#D4AF37]/15 px-6 py-10 text-center even:border-l max-lg:[&:nth-child(n+3)]:border-t lg:border-l lg:first:border-l-0"
              >
                <dt className="deco-body order-2 mt-3 text-base uppercase tracking-[0.15em] text-[#9C9884]">
                  {stat.label}
                </dt>
                <dd className="deco-display order-1 text-4xl text-[#D4AF37]">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ------------------------ features ------------------------ */}
        <section id="tinh-nang" className="scroll-mt-16 px-6 py-24 sm:py-32">
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              eyebrow="Features"
              title="Tinh hoa trong từng tính năng"
            />
            <div className="mt-16 grid gap-8 md:grid-cols-2">
              {FEATURES.map((feature) => (
                <article
                  key={feature.title}
                  className="group relative border border-[#D4AF37]/30 bg-[#141414] p-8 transition-all duration-500 hover:-translate-y-2 hover:border-[#D4AF37] hover:shadow-[0_0_25px_rgba(212,175,55,0.15)]"
                >
                  <CornerBrackets />
                  <Diamond>
                    <feature.icon className="h-6 w-6" strokeWidth={1.5} />
                  </Diamond>
                  <h3 className="deco-display mt-8 text-2xl uppercase tracking-[0.15em] text-[#D4AF37]">
                    {feature.title}
                  </h3>
                  <div aria-hidden="true" className="mt-4 h-px w-16 bg-[#D4AF37]/40" />
                  <p className="mt-5 text-base leading-relaxed text-[#F2F0E4]/80">
                    {feature.body}
                  </p>
                  <p className="deco-body mt-5 text-sm uppercase tracking-[0.25em] text-[#D4AF37]/90">
                    {feature.meta}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------- how it works ---------------------- */}
        <section
          id="cach-hoat-dong"
          className="scroll-mt-16 border-t border-[#D4AF37]/20 bg-[#0D0D0D] px-6 py-24 sm:py-32"
        >
          <div className="mx-auto max-w-6xl">
            <SectionHeading eyebrow="How it works" title="Ba bước để bắt đầu" />
            <ol className="relative mt-20 grid gap-14 md:grid-cols-3 md:gap-8">
              <span
                aria-hidden="true"
                className="absolute top-10 right-[16.66%] left-[16.66%] hidden h-px bg-[#D4AF37]/25 md:block"
              />
              {STEPS.map((step, i) => (
                <li
                  key={step.numeral}
                  className="relative flex flex-col items-center text-center"
                >
                  <StepDiamond numeral={step.numeral} />
                  <h3 className="deco-display mt-8 text-2xl uppercase tracking-[0.18em] text-[#F2F0E4]">
                    <span className="sr-only">Bước {i + 1} — </span>
                    {step.title}
                  </h3>
                  <p className="mt-4 max-w-xs text-base leading-relaxed text-[#F2F0E4]/75">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ----------------------- testimonial ----------------------- */}
        <section id="cam-nhan" className="scroll-mt-16 px-6 py-24 sm:py-32">
          <div className="mx-auto max-w-4xl">
            <SectionHeading eyebrow="Testimonial" title="Chuyện của một gia đình" />
            <figure className="group relative mx-auto mt-16 max-w-3xl border border-[#D4AF37]/40 p-2">
              <CornerBrackets />
              <div className="border border-[#D4AF37]/20 bg-[#141414] px-8 py-12 text-center sm:px-14">
                <span
                  aria-hidden="true"
                  className="deco-display block text-6xl leading-none text-[#D4AF37]"
                >
                  “
                </span>
                <blockquote className="deco-display mt-4 text-2xl leading-relaxed text-[#F2F0E4] sm:text-3xl">
                  Từ ngày có SEN, mẹ tôi không còn đợi đến cuối tuần để nghe
                  giọng con cháu. Bà chỉ cần nói, cả nhà đều nghe thấy. Đây là
                  món quà quý giá nhất tôi từng tặng mẹ.
                </blockquote>
                <GoldRule className="my-8" />
                <figcaption>
                  <span className="deco-body block text-base uppercase tracking-[0.25em] text-[#D4AF37]">
                    Chị Nguyễn Thu Hà
                  </span>
                  <span className="mt-2 block text-base text-[#9C9884]">
                    Con gái của bác Lan, 73 tuổi · Hà Nội
                  </span>
                </figcaption>
              </div>
            </figure>
          </div>
        </section>

        {/* ------------------------ final CTA ------------------------ */}
        <section className="relative overflow-hidden border-t border-[#D4AF37]/20 px-6 py-24 text-center sm:py-32">
          <div aria-hidden="true" className="deco-sunburst" />
          <div className="relative mx-auto max-w-4xl">
            <span
              aria-hidden="true"
              className="mx-auto block h-16 w-px bg-linear-to-b from-transparent to-[#D4AF37]"
            />
            <h2 className="deco-display mt-8 text-3xl leading-snug uppercase tracking-[0.15em] text-[#F2F0E4] sm:text-5xl">
              Đừng để yêu thương
              <br />
              <span className="text-[#D4AF37]">chờ đợi</span>
            </h2>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-[#F2F0E4]/80">
              Tặng cha mẹ một người bạn luôn lắng nghe — và tặng chính mình sự
              an tâm mỗi ngày. Đội ngũ SEN hỗ trợ cài đặt tận tình, hoàn toàn
              bằng tiếng Việt.
            </p>
            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <DecoCta href="/sign-up" variant="solid">
                Đặt mua ngay hôm nay
              </DecoCta>
              <DecoCta href="/sign-in" variant="outline">
                Đăng nhập bảng điều khiển
              </DecoCta>
            </div>
          </div>
        </section>
      </main>

      {/* -------------------------- footer -------------------------- */}
      <footer className="border-t border-[#D4AF37]/30 bg-[#0D0D0D]">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <p className="deco-display text-3xl tracking-[0.3em] text-[#D4AF37]">
              SEN
            </p>
            <p className="mt-4 max-w-sm text-base leading-relaxed text-[#F2F0E4]/75">
              Người bạn đồng hành AI cho người lớn tuổi Việt Nam. Kết nối yêu
              thương trong từng câu nói.
            </p>
            <p className="deco-body mt-6 text-sm uppercase tracking-[0.3em] text-[#888888]">
              Est. 2026 · Việt Nam
            </p>
          </div>
          {[
            {
              heading: "Sản phẩm",
              links: [
                { href: "#tinh-nang", label: "Tính năng" },
                { href: "#cach-hoat-dong", label: "Cách hoạt động" },
                { href: "#cam-nhan", label: "Cảm nhận" },
              ],
            },
            {
              heading: "Tài khoản",
              links: [
                { href: "/sign-in", label: "Đăng nhập" },
                { href: "/sign-up", label: "Đăng ký" },
                { href: "/forgot-password", label: "Quên mật khẩu" },
              ],
            },
            {
              heading: "Đề xuất thiết kế",
              links: [
                { href: "/designs", label: "Tất cả thiết kế" },
                ...OTHER_PROPOSALS.map((p) => ({ href: p.href, label: p.label })),
              ],
            },
          ].map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <h3 className="deco-body text-base uppercase tracking-[0.25em] text-[#D4AF37]">
                {column.heading}
              </h3>
              <div aria-hidden="true" className="mt-3 h-px w-10 bg-[#D4AF37]/40" />
              <ul className="mt-4 space-y-1">
                {column.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="inline-block py-2 text-base text-[#F2F0E4]/75 transition-colors duration-300 hover:text-[#D4AF37]"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="border-t border-[#D4AF37]/15 px-6 py-6 text-center">
          <p className="text-sm text-[#888888]">
            © 2026 SEN — Trang đề xuất thiết kế theo phong cách Art Deco. Đây là
            bản dựng minh họa, không phải trang chính thức.
          </p>
        </div>
      </footer>
    </div>
  );
}
