const stats = [
  { value: "20–200$", label: "Deposit set by the woman, before each date" },
  { value: "100%", label: "Automatically refunded if she says no" },
  { value: "10%", label: "Platform commission on the deposit" },
  { value: "0$", label: "To sign up and browse profiles" },
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
