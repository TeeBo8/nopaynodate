import { DEMO_TEST_CARD } from "@/lib/demo";

// Bandeau affiché sur toutes les pages de l'appli en mode démo
export function DemoBanner({ name, gender }: { name: string; gender?: string | null }) {
  const isWoman = gender === "woman";

  return (
    <div className="border-b border-amber-400/30 bg-amber-400/10 text-sm">
      <div className="container mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <p className="text-foreground/80">
          <span className="font-semibold text-foreground">Demo</span> · You are {name},{" "}
          {isWoman ? "who receives date requests" : "who pays the deposit"}
          <span className="hidden md:inline text-muted-foreground">
            {" "}
            · Test card {DEMO_TEST_CARD}, any future date, any CVC
          </span>
        </p>
        <form action="/api/demo/switch" method="post">
          <button
            type="submit"
            className="rounded-full border border-amber-400/50 bg-background px-3 py-1 text-xs font-semibold hover:bg-amber-400/20 transition-colors cursor-pointer"
          >
            Switch to {isWoman ? "Marc" : "Léa"}
          </button>
        </form>
      </div>
    </div>
  );
}
