import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ShieldCheck } from "lucide-react";

export function LandingHero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-4 pt-16 text-center">
      {/* Gradient de fond */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <Badge variant="secondary" className="mb-6 gap-1.5 px-4 py-1.5 text-sm">
        <ShieldCheck className="h-3.5 w-3.5" />
        Dépôts sécurisés via Stripe — remboursés si refus
      </Badge>

      <h1 className="mx-auto max-w-4xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
        Des rencontres sérieuses.{" "}
        <span className="text-primary">Garanties.</span>
      </h1>

      <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
        Les femmes dépensent en moyenne{" "}
        <strong className="text-foreground">2 381$/an</strong> pour se préparer
        à des dates avec des inconnus non investis. Sur NoPayNoDate, chaque
        homme verse un dépôt avant de vous contacter. Vous acceptez ou refusez
        — libre à vous.
      </p>

      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <Button size="lg" className="h-12 gap-2 px-8 text-base" asChild>
          <Link href="/register">
            Trouver une vraie connexion
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button size="lg" variant="outline" className="h-12 px-8 text-base" asChild>
          <Link href="/login">J&apos;ai déjà un compte</Link>
        </Button>
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        Inscription gratuite · Aucune carte bancaire requise
      </p>
    </section>
  );
}
