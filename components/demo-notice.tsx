import { isDemo } from "@/lib/demo";

// Encadré affiché en mode démo en tête des pages légales
export function DemoNotice() {
  if (!isDemo) return null;

  return (
    <div className="mb-10 rounded-xl border border-amber-400/40 bg-amber-400/10 px-5 py-4 text-sm text-foreground/80">
      <p className="font-semibold text-foreground">This site is a technical demo</p>
      <p className="mt-1">
        NoPayNoDate is a portfolio project built by{" "}
        <a href="https://teebostudio.fr" className="underline underline-offset-4">
          TeeBo Studio
        </a>
        . It is not a real dating service: the profiles are fictional, payments run in Stripe test
        mode and no real money moves. Nobody can sign up; each visitor gets two throwaway accounts
        that are deleted after 24 hours. The text below describes how the product would work.
      </p>
    </div>
  );
}
