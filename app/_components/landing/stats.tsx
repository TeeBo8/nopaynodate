const stats = [
  { value: "2 400+", label: "Profils vérifiés" },
  { value: "870+", label: "Dates organisées" },
  { value: "98%", label: "Taux de remboursement en cas de refus" },
  { value: "4.9★", label: "Note moyenne utilisateurs" },
];

export function LandingStats() {
  return (
    <section className="py-20 px-4">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl font-bold tracking-tight">{stat.value}</div>
              <div className="mt-2 text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
