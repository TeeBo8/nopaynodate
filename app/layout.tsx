import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nopaynodate.com"),
  title: {
    default: "NoPayNoDate — Serious Dating. Guaranteed.",
    template: "%s | NoPayNoDate",
  },
  description:
    "No more ghosting. Men pay a secure deposit to contact a woman. 100% refunded if she declines. Every interaction is worth something.",
  keywords: ["dating", "serious", "premium", "ghosting", "deposit", "Stripe"],
  authors: [{ name: "NoPayNoDate" }],
  openGraph: {
    type: "website",
    siteName: "NoPayNoDate",
    title: "NoPayNoDate — Serious Dating. Guaranteed.",
    description:
      "No more ghosting. Men pay a secure deposit. 100% refunded if she declines.",
    url: "https://nopaynodate.com",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "NoPayNoDate — Serious Dating. Guaranteed.",
    description:
      "No more ghosting. Men pay a secure deposit. 100% refunded if she declines.",
  },
  icons: {
    icon: [{ url: "/logo.svg", type: "image/svg+xml" }],
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "NoPayNoDate",
  url: "https://nopaynodate.com",
  logo: "https://nopaynodate.com/logo.svg",
  description:
    "Premium dating platform where men pay a secure deposit ($20–$200) to unlock chat. 100% refunded if she declines. 10% commission only on confirmed dates.",
  sameAs: [],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    url: "https://nopaynodate.com",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "NoPayNoDate",
  url: "https://nopaynodate.com",
  description:
    "NoPayNoDate is a premium dating app where financial commitment filters genuine interest. Men pay a deposit set by women — refunded if declined, released after a confirmed date.",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://nopaynodate.com/browse?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className={`${outfit.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
