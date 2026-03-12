const marketStats = [
  {
    value: "$2,381",
    label: "spent per year by women preparing for dates",
    source: "BMO Real Financial Progress Index, 2026",
  },
  {
    value: "78%",
    label: "of dating app users report burnout from meaningless interactions",
    source: "Business of Apps",
  },
  {
    value: "40%",
    label: "of Americans believe men should pay — yet rarely do",
    source: "NY Post / Gen Z & Millennial Survey",
  },
];

export function LandingReality() {
  return (
    <section className="py-28 px-4">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-20 max-w-xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">The problem</p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Modern dating is broken.<br />The data confirms it.
          </h2>
        </div>

        {/* Editorial stats — each full-width row */}
        <div className="divide-y divide-border/40">
          {marketStats.map((stat, i) => (
            <div
              key={i}
              className="group flex flex-col gap-2 py-10 sm:flex-row sm:items-center sm:gap-12"
            >
              <div className="shrink-0 text-6xl font-bold tracking-tight text-primary sm:text-7xl lg:text-8xl">
                {stat.value}
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-lg font-medium sm:text-xl">{stat.label}</p>
                <p className="text-sm text-muted-foreground">{stat.source}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quote */}
        <div className="mt-16 rounded-2xl border border-primary/20 bg-primary/5 px-8 py-10">
          <div className="mb-4 inline-block rounded-full bg-primary/15 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
            The shift
          </div>
          <blockquote className="text-xl font-semibold leading-relaxed sm:text-2xl lg:text-3xl">
            &ldquo;What a man is willing to pay to meet you says everything
            about what he&apos;s truly looking for.&rdquo;
          </blockquote>
          <p className="mt-5 text-muted-foreground">
            NoPayNoDate turns this question into a concrete mechanism — before the first message.
          </p>
        </div>

      </div>
    </section>
  );
}
