/*
 * SEN logo mark (SVG approximation of the lotus mascot).
 * Drop the real logo at /public/logo.png and swap this for
 * <Image src="/logo.png" ... /> if you prefer the original artwork.
 *
 * Brand colors reference the CSS variables from app/globals.css so a palette
 * change never desyncs the logo. Shades without tokens (petal highlight,
 * face, blush) are artwork-specific and stay literal.
 */
export function LogoMark({
  size = 40,
  label = "SEN logo",
}: {
  size?: number;
  /** Accessible name — pass a translated string, e.g. "Logo SEN" for vi. */
  label?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label={label}
    >
      {/* ring — white disc so the mark pops as a sticker on the cream bg */}
      <circle cx="32" cy="32" r="30" fill="#ffffff" stroke="var(--color-sen)" strokeWidth="3" />
      {/* leaves */}
      <ellipse cx="20" cy="44" rx="11" ry="5.5" fill="var(--color-leaf)" transform="rotate(-14 20 44)" />
      <ellipse cx="44" cy="44" rx="11" ry="5.5" fill="var(--color-leaf)" transform="rotate(14 44 44)" />
      {/* center-leaf highlight: lighter shade of the mint leaf token */}
      <ellipse cx="32" cy="46" rx="12" ry="5.5" fill="#6ee7b7" />
      {/* side petals */}
      <path d="M18 38c-5-7-4-15 1-19 3 5 5 12 4 19z" fill="#f8a8c0" />
      <path d="M46 38c5-7 4-15-1-19-3 5-5 12-4 19z" fill="#f8a8c0" />
      {/* main petal */}
      <path
        d="M32 10c7 7 11 14 11 21 0 8-5 13-11 13s-11-5-11-13c0-7 4-14 11-21z"
        fill="var(--color-lotus)"
      />
      <path
        d="M32 14c5.5 6 8.5 12 8.5 17.5 0 6.5-4 10.5-8.5 10.5s-8.5-4-8.5-10.5C23.5 26 26.5 20 32 14z"
        fill="#f8a8c0"
      />
      {/* face */}
      <circle cx="27.5" cy="32" r="2.2" fill="#3b2f3a" />
      <circle cx="36.5" cy="32" r="2.2" fill="#3b2f3a" />
      <circle cx="28.2" cy="31.3" r="0.7" fill="#fff" />
      <circle cx="37.2" cy="31.3" r="0.7" fill="#fff" />
      <path
        d="M28.5 37c2 2 5 2 7 0"
        stroke="#3b2f3a"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="24" cy="36" r="1.8" fill="#f4737f" opacity="0.7" />
      <circle cx="40" cy="36" r="1.8" fill="#f4737f" opacity="0.7" />
      {/* gold circuit accents */}
      <circle cx="14" cy="20" r="1.4" fill="var(--color-gold)" />
      <path d="M14 20l5 3" stroke="var(--color-gold)" strokeWidth="1.2" />
      <circle cx="50" cy="18" r="1.4" fill="var(--color-gold)" />
      <path d="M50 18l-5 4" stroke="var(--color-gold)" strokeWidth="1.2" />
    </svg>
  );
}

export function LogoWordmark() {
  return (
    <span className="text-xl font-extrabold tracking-wide text-sen">SEN</span>
  );
}
