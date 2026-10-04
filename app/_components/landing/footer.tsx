import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { isDemo } from "@/lib/demo";

const NAV = [
  {
    title: "Platform",
    links: [
      { label: "Browse profiles", href: "/browse" },
      ...(isDemo
        ? [{ label: "Enter the demo", href: "/register" }]
        : [
            { label: "Create account", href: "/register" },
            { label: "Sign in", href: "/login" },
          ]),
      { label: "Go Premium", href: "/settings" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Legal Notice", href: "/legal" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "FAQ", href: "/#faq" },
      { label: "Contact us", href: "mailto:contact@teebostudio.fr" },
      { label: "Report abuse", href: "mailto:contact@teebostudio.fr?subject=Report" },
    ],
  },
];

export function LandingFooter() {
  return (
    <footer className="border-t border-border/40 bg-muted/10">
      {/* Main footer */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight">NoPayNoDate</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-[200px]">
              Serious dating with skin in the game. No deposit, no date.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-green-500 shrink-0" />
              Payments secured by Stripe
            </div>
          </div>

          {/* Nav columns */}
          {NAV.map((col) => (
            <div key={col.title} className="space-y-4">
              <p className="text-sm font-semibold">{col.title}</p>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("mailto") ? (
                      <a
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-5 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} NoPayNoDate. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground text-center">
            For adults 18+ only · By using this platform you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-4 hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
