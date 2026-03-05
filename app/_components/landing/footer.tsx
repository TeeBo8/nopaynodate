export function LandingFooter() {
  return (
    <footer className="border-t border-border/40 py-10 px-4">
      <div className="mx-auto max-w-6xl flex flex-col items-center justify-between gap-4 sm:flex-row">
        <span className="font-semibold">NoPayNoDate</span>
        <p className="text-sm text-muted-foreground text-center">
          © {new Date().getFullYear()} NoPayNoDate. Tous droits réservés.
        </p>
        <div className="flex gap-6 text-sm text-muted-foreground">
          <span className="cursor-pointer hover:text-foreground transition-colors">Confidentialité</span>
          <span className="cursor-pointer hover:text-foreground transition-colors">CGU</span>
          <span className="cursor-pointer hover:text-foreground transition-colors">Contact</span>
        </div>
      </div>
    </footer>
  );
}
