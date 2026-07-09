import type { NextConfig } from "next";

const securityHeaders = [
  // Prevent MIME-type sniffing of responses.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // The hub has no legitimate embedding use case — block clickjacking.
  { key: "X-Frame-Options", value: "DENY" },
  // Don't leak full URLs (which may include routes/params) cross-origin.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Conservative feature allowlist. NOTE: microphone must stay enabled for
  // self — voice training records audio via getUserMedia/MediaRecorder.
  {
    key: "Permissions-Policy",
    value: [
      "microphone=(self)",
      "camera=()",
      "geolocation=()",
      "payment=()",
      "usb=()",
      "magnetometer=()",
      "gyroscope=()",
      "accelerometer=()",
    ].join(", "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
