import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { users, deposits, reports, dateRequests } from "@/server/db/schema";
import { count, sum, eq, gt } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Flag, Users, DollarSign, TrendingUp, Clock, Shield } from "lucide-react";

const REASON_LABELS: Record<string, string> = {
  spam: "Spam ou arnaque",
  fake_profile: "Faux profil",
  inappropriate: "Contenu inapproprié",
  other: "Autre",
};

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
}) {
  return (
    <div className="border border-border rounded-lg p-4 space-y-2">
      <div className="flex items-center gap-2 text-muted-foreground text-sm">
        <Icon size={14} />
        {label}
      </div>
      <p className="text-2xl font-bold">{value}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail || session.user.email !== adminEmail) {
    redirect("/browse");
  }

  const reporter = alias(users, "reporter");
  const reported = alias(users, "reported");

  const [
    [{ totalUsers }],
    [{ totalMen }],
    [{ totalWomen }],
    [{ activePremium }],
    [{ totalReports }],
    [releasedStats],
    [heldStats],
    [refundedStats],
    recentReports,
    recentRequests,
  ] = await Promise.all([
    db.select({ totalUsers: count() }).from(users),
    db.select({ totalMen: count() }).from(users).where(eq(users.gender, "man")),
    db.select({ totalWomen: count() }).from(users).where(eq(users.gender, "woman")),
    db
      .select({ activePremium: count() })
      .from(users)
      .where(gt(users.premiumUntil, new Date())),
    db.select({ totalReports: count() }).from(reports),
    db
      .select({ cnt: count(), commission: sum(deposits.commission) })
      .from(deposits)
      .where(eq(deposits.status, "released")),
    db
      .select({ cnt: count(), amount: sum(deposits.amount) })
      .from(deposits)
      .where(eq(deposits.status, "held")),
    db.select({ cnt: count() }).from(deposits).where(eq(deposits.status, "refunded")),
    db
      .select({
        id: reports.id,
        reason: reports.reason,
        createdAt: reports.createdAt,
        reporterName: reporter.name,
        reporterId: reports.reporterId,
        reportedName: reported.name,
        reportedId: reports.reportedUserId,
      })
      .from(reports)
      .leftJoin(reporter, eq(reports.reporterId, reporter.id))
      .leftJoin(reported, eq(reports.reportedUserId, reported.id))
      .orderBy(sql`${reports.createdAt} DESC`)
      .limit(50),
    db
      .select({
        id: dateRequests.id,
        status: dateRequests.status,
        createdAt: dateRequests.createdAt,
        requesterName: reporter.name,
        targetName: reported.name,
      })
      .from(dateRequests)
      .leftJoin(reporter, eq(dateRequests.requesterId, reporter.id))
      .leftJoin(reported, eq(dateRequests.targetId, reported.id))
      .orderBy(sql`${dateRequests.createdAt} DESC`)
      .limit(20),
  ]);

  const revenue = Number(releasedStats?.commission ?? 0) / 100;
  const heldAmount = Number(heldStats?.amount ?? 0) / 100;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-2">
        <Shield size={20} className="text-primary" />
        <h1 className="text-2xl font-bold">Panel Admin</h1>
      </div>

      {/* Stats utilisateurs */}
      <section className="space-y-3">
        <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
          Utilisateurs
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard icon={Users} label="Total" value={totalUsers} />
          <StatCard icon={Users} label="Hommes" value={totalMen} />
          <StatCard icon={Users} label="Femmes" value={totalWomen} />
          <StatCard
            icon={Shield}
            label="Premium actif"
            value={activePremium}
            sub="abonnements en cours"
          />
        </div>
      </section>

      {/* Stats financières */}
      <section className="space-y-3">
        <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
          Finances
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard
            icon={TrendingUp}
            label="Revenue commissions"
            value={`$${revenue.toFixed(2)}`}
            sub={`${releasedStats?.cnt ?? 0} virements effectués`}
          />
          <StatCard
            icon={Clock}
            label="En escrow"
            value={`$${heldAmount.toFixed(2)}`}
            sub={`${heldStats?.cnt ?? 0} dépôts bloqués`}
          />
          <StatCard
            icon={DollarSign}
            label="Remboursés"
            value={refundedStats?.cnt ?? 0}
            sub="dépôts refunded"
          />
          <StatCard icon={Flag} label="Signalements" value={totalReports} />
        </div>
      </section>

      <Separator />

      {/* Signalements récents */}
      <section className="space-y-3">
        <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
          Signalements récents ({totalReports})
        </h2>
        {recentReports.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun signalement.</p>
        ) : (
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-2 font-medium">Signaleur</th>
                  <th className="text-left px-4 py-2 font-medium">Signalé</th>
                  <th className="text-left px-4 py-2 font-medium">Raison</th>
                  <th className="text-left px-4 py-2 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentReports.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/20">
                    <td className="px-4 py-2 text-muted-foreground">
                      {r.reporterName ?? r.reporterId}
                    </td>
                    <td className="px-4 py-2 font-medium">
                      <a
                        href={`/profile/${r.reportedId}`}
                        className="hover:underline text-primary"
                      >
                        {r.reportedName ?? r.reportedId}
                      </a>
                    </td>
                    <td className="px-4 py-2">
                      <Badge variant="outline" className="text-xs">
                        {REASON_LABELS[r.reason] ?? r.reason}
                      </Badge>
                    </td>
                    <td className="px-4 py-2 text-muted-foreground text-xs">
                      {new Date(r.createdAt).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <Separator />

      {/* Demandes récentes */}
      <section className="space-y-3">
        <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
          Demandes récentes
        </h2>
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-2 font-medium">Homme</th>
                <th className="text-left px-4 py-2 font-medium">Femme</th>
                <th className="text-left px-4 py-2 font-medium">Statut</th>
                <th className="text-left px-4 py-2 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentRequests.map((r) => (
                <tr key={r.id} className="hover:bg-muted/20">
                  <td className="px-4 py-2 text-muted-foreground">{r.requesterName}</td>
                  <td className="px-4 py-2 font-medium">{r.targetName}</td>
                  <td className="px-4 py-2">
                    <Badge
                      variant={
                        r.status === "completed"
                          ? "default"
                          : r.status === "rejected" || r.status === "refunded"
                          ? "destructive"
                          : "secondary"
                      }
                      className="text-xs"
                    >
                      {r.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-2 text-muted-foreground text-xs">
                    {new Date(r.createdAt).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
