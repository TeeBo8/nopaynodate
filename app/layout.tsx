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
    default: "NoPayNoDate — Des rencontres sérieuses. Garanties.",
    template: "%s | NoPayNoDate",
  },
  description:
    "Fini le ghosting. Les hommes versent un dépôt sécurisé pour contacter une femme. Remboursé à 100% si elle refuse. Chaque échange vaut quelque chose.",
  keywords: ["rencontres", "dating", "sérieux", "premium", "ghosting", "dépôt", "Stripe"],
  authors: [{ name: "NoPayNoDate" }],
  openGraph: {
    type: "website",
    siteName: "NoPayNoDate",
    title: "NoPayNoDate — Des rencontres sérieuses. Garanties.",
    description:
      "Fini le ghosting. Les hommes versent un dépôt sécurisé. Remboursé à 100% si elle refuse.",
    url: "https://nopaynodate.com",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "NoPayNoDate — Des rencontres sérieuses. Garanties.",
    description:
      "Fini le ghosting. Les hommes versent un dépôt sécurisé. Remboursé à 100% si elle refuse.",
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
