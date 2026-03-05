import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function LandingCta() {
  return (
    <section className="py-24 px-4">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          Prêt à rencontrer quelqu&apos;un qui vaut vraiment votre temps ?
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
          Rejoignez des milliers de personnes qui ont choisi des rencontres authentiques,
          basées sur l&apos;engagement réel plutôt que sur le swipe.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button size="lg" className="h-12 gap-2 px-10 text-base" asChild>
            <Link href="/register">
              Créer mon profil gratuitement
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          Sans engagement · Annulez à tout moment
        </p>
      </div>
    </section>
  );
}
