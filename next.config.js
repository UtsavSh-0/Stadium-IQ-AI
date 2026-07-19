/** @type {import('next').NextConfig} */

// Security headers applied to every response. CSP is intentionally omitted
// for now: Next.js inline runtime scripts + Recharts/Framer Motion inline
// styles require nonce plumbing to do CSP properly — add it via middleware
// with a per-request nonce before public launch.
const securityHeaders = [
  // Disallow embedding in iframes (clickjacking).
  { key: "X-Frame-Options", value: "DENY" },
  // Don't MIME-sniff responses away from the declared content type.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Only send the origin as referrer to other sites.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Opt out of browser features the app doesn't use. Microphone stays
  // enabled for the assistant's voice input.
  {
    key: "Permissions-Policy",
    value: "camera=(), geolocation=(self), microphone=(self)",
  },
  // Force HTTPS for two years once seen over HTTPS (no-op on localhost).
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
];

const nextConfig = {
  reactStrictMode: true,
  // Don't leak the framework via the X-Powered-By header.
  poweredByHeader: false,
  turbopack: {
    root: __dirname,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;
