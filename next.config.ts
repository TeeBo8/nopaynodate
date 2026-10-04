import type { NextConfig } from "next";

// Politique de sécurité du contenu : d'où la page a le droit de charger scripts, images, cadres…
// Les scripts et styles en ligne restent autorisés (Next et les composants en génèrent) ; la politique
// limite donc surtout les domaines tiers, l'intégration dans un cadre et la cible des formulaires.
const isDev = process.env.NODE_ENV !== "production";
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://js.stripe.com https://vercel.live`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://utfs.io https://*.ufs.sh https://*.stripe.com",
  "font-src 'self' data:",
  // Stripe (paiement), Pusher (chat temps réel), Uploadthing (photos), Vercel (barre d'outils des previews)
  `connect-src 'self' https://*.stripe.com wss://*.pusher.com https://*.pusher.com https://*.uploadthing.com https://vercel.live${isDev ? " ws://localhost:*" : ""}`,
  "frame-src https://*.stripe.com https://vercel.live",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "*.ufs.sh",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
