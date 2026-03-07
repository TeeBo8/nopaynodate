import { ArrowRight, ArrowDown, Lock, RotateCcw, Banknote } from "lucide-react";

export function LandingEscrowDiagram() {
  return (
    <section className="py-20 px-4">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Comment fonctionne le dépôt ?
          </h2>
          <p className="mt-3 text-muted-foreground">
            L&apos;argent ne transite jamais directement entre les deux personnes.
          </p>
        </div>

        {/* Desktop flow */}
        <div className="hidden sm:flex items-center justify-center gap-3">
          {/* Homme */}
          <div className="flex flex-col items-center gap-2 rounded-xl border border-border/60 bg-background p-5 w-40 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
              <span className="text-lg">👨</span>
            </div>
            <div className="font-semibold text-sm">L&apos;homme</div>
            <div className="text-xs text-muted-foreground">verse le dépôt</div>
            <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">ex. 100$</div>
          </div>

          <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground" />

          {/* Escrow */}
          <div className="flex flex-col items-center gap-2 rounded-xl border-2 border-primary/40 bg-primary/5 p-5 w-44 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15">
              <Lock className="h-5 w-5 text-primary" />
            </div>
            <div className="font-semibold text-sm">Stripe Escrow</div>
            <div className="text-xs text-muted-foreground">fonds bloqués<br />en sécurité</div>
            <div className="text-xs font-semibold text-primary">En attente de décision</div>
          </div>

          <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground" />

          {/* Outcomes */}
          <div className="flex flex-col gap-3">
            {/* Accepté */}
            <div className="flex items-center gap-3 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 p-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/50">
                <Banknote className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Elle accepte</div>
                <div className="text-xs text-muted-foreground">90$ virés à la femme</div>
                <div className="text-xs text-muted-foreground">10$ commission plateforme</div>
              </div>
            </div>
            {/* Refusé */}
            <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/30 p-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                <RotateCcw className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <div className="text-xs font-semibold">Elle refuse</div>
                <div className="text-xs text-muted-foreground">100% remboursé à l&apos;homme</div>
                <div className="text-xs text-muted-foreground">Automatique · Immédiat</div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile flow (vertical) */}
        <div className="flex sm:hidden flex-col items-center gap-3">
          <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-background p-4 w-full">
            <span className="text-2xl">👨</span>
            <div>
              <div className="font-semibold text-sm">L&apos;homme verse 100$</div>
              <div className="text-xs text-muted-foreground">Paiement sécurisé via Stripe</div>
            </div>
          </div>

          <ArrowDown className="h-5 w-5 text-muted-foreground" />

          <div className="flex items-center gap-3 rounded-xl border-2 border-primary/40 bg-primary/5 p-4 w-full">
            <Lock className="h-6 w-6 text-primary" />
            <div>
              <div className="font-semibold text-sm">Escrow Stripe</div>
              <div className="text-xs text-muted-foreground">Fonds bloqués — en attente de décision</div>
            </div>
          </div>

          <ArrowDown className="h-5 w-5 text-muted-foreground" />

          <div className="grid grid-cols-2 gap-3 w-full">
            <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 p-3 text-center">
              <Banknote className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mx-auto mb-1" />
              <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Elle accepte</div>
              <div className="text-xs text-muted-foreground mt-1">90$ virés</div>
            </div>
            <div className="rounded-xl border border-border/60 bg-muted/30 p-3 text-center">
              <RotateCcw className="h-5 w-5 text-muted-foreground mx-auto mb-1" />
              <div className="text-xs font-semibold">Elle refuse</div>
              <div className="text-xs text-muted-foreground mt-1">100% remboursé</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
