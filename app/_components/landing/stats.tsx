const stats = [
  { value: "20–200$", label: "Dépôt fixé par la femme, avant chaque date" },
  { value: "100%", label: "Remboursé automatiquement si elle dit non" },
  { value: "10%", label: "Commission prélevée par la plateforme sur le dépôt" },
  { value: "0$", label: "Pour s'inscrire et explorer les profils" },
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
