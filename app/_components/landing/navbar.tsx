"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export function LandingNavbar() {
  return (
    <header className="fixed left-0 right-0 top-4 z-50 flex justify-center px-4">
      <div className="flex w-full max-w-2xl items-center justify-between gap-4 rounded-full border border-border/50 bg-background/80 px-5 py-3 shadow-lg backdrop-blur-md">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <Image src="/logo.svg" alt="NoPayNoDate" width={26} height={26} />
          <span className="text-base font-bold tracking-tight">NoPayNoDate</span>
        </Link>

        {/* Nav links — hidden on small screens */}
        <nav className="hidden items-center gap-5 text-sm text-muted-foreground sm:flex">
          <Link href="#how-it-works" className="transition-colors hover:text-foreground">How it works</Link>
          <Link href="#pricing" className="transition-colors hover:text-foreground">Pricing</Link>
          <Link href="#faq" className="transition-colors hover:text-foreground">FAQ</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
          <Button size="sm" className="rounded-full px-5" asChild>
            <Link href="/register">Get started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
