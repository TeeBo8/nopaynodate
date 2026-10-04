import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { siteUrl } from "@/lib/site";
import { isDemo } from "@/lib/demo";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const title = isDemo ? "NoPayNoDate — Technical demo" : "NoPayNoDate — Serious Dating. Guaranteed.";
const shareDescription = isDemo
  ? "Technical demo of a deposit-backed dating flow. Stripe test mode, fictional profiles, no real money."
  : "No more ghosting. Men pay a secure deposit. 100% refunded if she declines.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  // La démo ne doit pas être référencée : c'est l'étude de cas qui doit être trouvée
  robots: isDemo ? { index: false, follow: false } : undefined,
  title: {
    default: title,
    template: "%s | NoPayNoDate",
  },
  description: isDemo
    ? "Technical demo of a deposit-backed dating app: Stripe escrow in test mode, real-time chat, fictional profiles. Not a real service."
    : "No more ghosting. Men pay a secure deposit to contact a woman. 100% refunded if she declines. Every interaction is worth something.",
  keywords: ["dating", "serious", "premium", "ghosting", "deposit", "Stripe"],
  authors: [{ name: "NoPayNoDate" }],
  openGraph: {
    type: "website",
    siteName: "NoPayNoDate",
    title,
    description: shareDescription,
    url: siteUrl,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: shareDescription,
  },
  icons: {
    icon: [{ url: "/logo.svg", type: "image/svg+xml" }],
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
