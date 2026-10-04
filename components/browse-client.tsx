"use client";

import { useState, useMemo } from "react";
import { ProfileCard } from "@/components/profile-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, X } from "lucide-react";

type Profile = {
  profile: {
    id: string;
    photos: string[] | null;
    depositAmount: number;
    isActive: boolean;
    lastActive: Date | null;
  };
  user: {
    id: string;
    name: string;
    city: string | null;
    bio: string | null;
    birthdate: string | null;
    isVerified: boolean;
    premiumUntil: Date | null;
  };
};

const DEPOSIT_FILTERS = [
  { label: "All", min: 0, max: Infinity },
  { label: "≤ $50", min: 0, max: 5000 },
  { label: "$51–100", min: 5001, max: 10000 },
  { label: "$101–200", min: 10001, max: 20000 },
] as const;

const SORT_OPTIONS = [
  { label: "Premium first", value: "premium" },
  { label: "Most recent", value: "recent" },
  { label: "Deposit ↑", value: "deposit_asc" },
  { label: "Deposit ↓", value: "deposit_desc" },
] as const;

type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export function BrowseClient({
  results,
  gender,
  pinnedUserId = null,
}: {
  results: Profile[];
  gender: "man" | "woman" | null;
  pinnedUserId?: string | null; // démo : l'autre compte du visiteur, toujours en tête
}) {
  const [search, setSearch] = useState("");
  const [depositFilter, setDepositFilter] = useState(0);
  const [sort, setSort] = useState<SortValue>("premium");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    const { min, max } = DEPOSIT_FILTERS[depositFilter];
    let list = results.filter((r) => {
      const matchDeposit = r.profile.depositAmount >= min && r.profile.depositAmount <= max;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        r.user.name.toLowerCase().includes(q) ||
        (r.user.city?.toLowerCase().includes(q) ?? false);
      return matchDeposit && matchSearch;
    });

    list = [...list].sort((a, b) => {
      if (pinnedUserId && (a.user.id === pinnedUserId) !== (b.user.id === pinnedUserId)) {
        return a.user.id === pinnedUserId ? -1 : 1;
      }
      if (sort === "premium") {
        const aPrem = a.user.premiumUntil ? new Date(a.user.premiumUntil) > new Date() : false;
        const bPrem = b.user.premiumUntil ? new Date(b.user.premiumUntil) > new Date() : false;
        if (aPrem !== bPrem) return bPrem ? 1 : -1;
        return (b.profile.lastActive?.getTime() ?? 0) - (a.profile.lastActive?.getTime() ?? 0);
      }
      if (sort === "recent") {
        return (b.profile.lastActive?.getTime() ?? 0) - (a.profile.lastActive?.getTime() ?? 0);
      }
      if (sort === "deposit_asc") return a.profile.depositAmount - b.profile.depositAmount;
      if (sort === "deposit_desc") return b.profile.depositAmount - a.profile.depositAmount;
      return 0;
    });

    return list;
  }, [results, search, depositFilter, sort, pinnedUserId]);

  const hasActiveFilters = search !== "" || depositFilter !== 0 || sort !== "premium";

  const plural = filtered.length > 1;
  const label = gender === "man" ? (plural ? "women" : "woman") : plural ? "profiles" : "profile";

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Discover</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {filtered.length > 0
              ? `${filtered.length} ${label} available`
              : "No results"}
          </p>
        </div>
        <Button
          variant={showFilters ? "default" : "outline"}
          size="sm"
          className="shrink-0 gap-2"
          onClick={() => setShowFilters((v) => !v)}
        >
          <SlidersHorizontal size={15} />
          Filters
          {hasActiveFilters && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
              !
            </span>
          )}
        </Button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="rounded-xl border border-border bg-card p-4 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-9"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Deposit filter */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Deposit amount</p>
            <div className="flex flex-wrap gap-2">
              {DEPOSIT_FILTERS.map((f, i) => (
                <button
                  key={f.label}
                  onClick={() => setDepositFilter(i)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    depositFilter === i
                      ? "bg-foreground text-background border-foreground"
                      : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Sort by</p>
            <div className="flex flex-wrap gap-2">
              {SORT_OPTIONS.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setSort(s.value)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    sort === s.value
                      ? "bg-foreground text-background border-foreground"
                      : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reset */}
          {hasActiveFilters && (
            <button
              onClick={() => { setSearch(""); setDepositFilter(0); setSort("premium"); }}
              className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
            >
              Reset filters
            </button>
          )}
        </div>
      )}

      {/* Grid or empty state */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
          <div className="text-5xl">🔍</div>
          <div>
            <p className="font-medium">No profiles found</p>
            <p className="text-sm text-muted-foreground mt-1">
              {hasActiveFilters
                ? "Try broadening your filters."
                : "There is nobody to show right now."}
            </p>
          </div>
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={() => { setSearch(""); setDepositFilter(0); setSort("premium"); }}>
              Clear filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map(({ profile, user }) => (
            <ProfileCard
              key={user.id}
              userId={user.id}
              name={user.name}
              city={user.city}
              birthdate={user.birthdate}
              photos={profile.photos ?? []}
              depositAmount={gender === "man" ? profile.depositAmount : undefined}
              isVerified={user.isVerified}
              isPremium={user.premiumUntil ? new Date(user.premiumUntil) > new Date() : false}
              isDemoPartner={user.id === pinnedUserId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
