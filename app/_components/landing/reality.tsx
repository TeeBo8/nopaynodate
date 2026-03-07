const marketStats = [
  {
    value: "2 381$",
    label: "dépensés par an par les femmes pour se préparer à des dates",
    source: "BMO Real Financial Progress Index, 2026",
  },
  {
    value: "78%",
    label: "des utilisateurs d'apps de rencontres rapportent un burnout",
    source: "Business of Apps",
  },
  {
    value: "40%",
    label: "des Américains estiment que les hommes devraient payer lors des dates",
    source: "NY Post / Gen Z & Millennial Survey",
  },
];

export function LandingReality() {
  return (
    <section className="py-24 px-4 bg-muted/20">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            La réalité des rencontres en 2026
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Les apps traditionnelles ont un problème structurel. Les données le confirment.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-16">
          {marketStats.map((stat) => (
            <div
              key={stat.value}
              className="rounded-xl border border-border/60 bg-background/60 p-6 text-center"
            >
              <div className="text-4xl font-bold tracking-tight text-primary">
                {stat.value}
              </div>
              <p className="mt-3 text-sm text-foreground leading-snug">{stat.label}</p>
              <p className="mt-2 text-xs text-muted-foreground">{stat.source}</p>
            </div>
          ))}
        </div>

        {/* Big Idea quote */}
        <div className="relative rounded-2xl border border-primary/30 bg-primary/5 px-8 py-10 text-center">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
            <span className="rounded-full bg-primary/15 px-4 py-1.5 text-xs font-semibold text-primary uppercase tracking-wide">
              La vraie question
            </span>
          </div>
          <blockquote className="text-xl font-semibold leading-relaxed sm:text-2xl">
            &ldquo;Ce qu&apos;un homme est prêt à payer pour te voir dit tout sur ce qu&apos;il recherche vraiment.&rdquo;
          </blockquote>
          <p className="mt-4 text-sm text-muted-foreground">
            NoPayNoDate transforme cette question en mécanisme concret — avant même le premier message.
          </p>
        </div>
      </div>
    </section>
  );
}
