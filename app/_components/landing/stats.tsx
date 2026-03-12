const stats = [
  { value: "$20–200", label: "Deposit set by the woman" },
  { value: "100%", label: "Refunded if she declines" },
  { value: "10%", label: "Platform commission only on confirmed dates" },
  { value: "$0", label: "To sign up and browse" },
];

export function LandingStats() {
  return (
    <section className="border-y border-border/40 bg-muted/20 py-14 px-4">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-2 gap-px lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-2 px-6 py-6 text-center"
            >
              <div className="text-3xl font-bold tracking-tight sm:text-4xl">{stat.value}</div>
              <div className="text-xs text-muted-foreground sm:text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
