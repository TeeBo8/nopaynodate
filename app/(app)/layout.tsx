import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@/server/auth";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { BfcacheGuard } from "@/components/bfcache-guard";
import { Heart, Search, User, Settings } from "lucide-react";
import { isDemo } from "@/lib/demo";
import { DemoBanner } from "@/components/demo-banner";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <BfcacheGuard />
      {isDemo && <DemoBanner name={session.user.name} gender={session.user.gender} />}
      {/* Top nav */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/browse" className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <Image src="/logo.svg" alt="NoPayNoDate" width={28} height={28} />
            <span className="hidden sm:inline">NoPayNoDate</span>
          </Link>
          <nav className="flex items-center gap-1">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/browse" className="gap-1.5">
                <Search size={15} />
                <span className="hidden sm:inline">Discover</span>
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/requests" className="gap-1.5">
                <Heart size={15} />
                <span className="hidden sm:inline">Requests</span>
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/profile/${session.user.id}`} className="gap-1.5">
                <User size={15} />
                <span className="hidden sm:inline">Profile</span>
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/settings" className="gap-1.5">
                <Settings size={15} />
              </Link>
            </Button>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
