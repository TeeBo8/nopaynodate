import { db } from "@/server/db";
import { users, profiles } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { generateId } from "@/lib/utils";
import { DEMO_EMAIL_DOMAIN } from "@/lib/demo";

// Profils de décor de la démo : fictifs, en lecture seule, personne ne peut s'y connecter
// (aucune ligne dans `accounts`, donc aucun mot de passe).
type SeedProfile = {
  slug: string;
  name: string;
  gender: "man" | "woman";
  birthdate: string;
  city: string;
  bio: string;
  depositAmount?: number; // centimes, femmes uniquement
  isVerified?: boolean;
  isPremium?: boolean;
};

const SEED_PROFILES: SeedProfile[] = [
  { slug: "chloe", name: "Chloe", gender: "woman", birthdate: "1996-04-12", city: "New York", bio: "Architect. Sunday mornings are for flea markets and strong coffee.", depositAmount: 8000, isVerified: true, isPremium: true },
  { slug: "emma", name: "Emma", gender: "woman", birthdate: "1994-09-03", city: "Austin", bio: "Vet nurse, trail runner, terrible at karaoke but I do it anyway.", depositAmount: 5000, isVerified: true },
  { slug: "sofia", name: "Sofia", gender: "woman", birthdate: "1998-01-22", city: "Miami", bio: "Pastry chef. I will judge your dessert order, kindly.", depositAmount: 12000, isPremium: true },
  { slug: "maya", name: "Maya", gender: "woman", birthdate: "1993-06-30", city: "Seattle", bio: "Product designer who reads too many sci-fi novels.", depositAmount: 6000, isVerified: true },
  { slug: "olivia", name: "Olivia", gender: "woman", birthdate: "1997-11-15", city: "Chicago", bio: "Jazz pianist by night, music teacher by day.", depositAmount: 10000 },
  { slug: "zoe", name: "Zoe", gender: "woman", birthdate: "1995-02-08", city: "Denver", bio: "Climbing gym regular. Looking for someone who can keep up on a hike.", depositAmount: 4000, isVerified: true },
  { slug: "lena", name: "Lena", gender: "woman", birthdate: "1992-08-19", city: "Boston", bio: "Research scientist. Ask me about octopuses.", depositAmount: 15000, isVerified: true, isPremium: true },
  { slug: "nora", name: "Nora", gender: "woman", birthdate: "1999-05-27", city: "Portland", bio: "Ceramics, vinyl records and a very spoiled cat.", depositAmount: 3000 },
  { slug: "iris", name: "Iris", gender: "woman", birthdate: "1991-12-04", city: "San Diego", bio: "Lawyer who surfs before work. Dinner should be tacos.", depositAmount: 20000, isVerified: true },
  { slug: "alice", name: "Alice", gender: "woman", birthdate: "1996-10-10", city: "Nashville", bio: "Bookshop owner. First date idea: you pick a book for me, I pick one for you.", depositAmount: 7000 },
  { slug: "ethan", name: "Ethan", gender: "man", birthdate: "1992-03-14", city: "New York", bio: "Software engineer, amateur baker. My sourdough has a name.", isVerified: true, isPremium: true },
  { slug: "lucas", name: "Lucas", gender: "man", birthdate: "1990-07-21", city: "Austin", bio: "Guitar teacher. I know every taco truck in town.", isVerified: true },
  { slug: "noah", name: "Noah", gender: "man", birthdate: "1995-11-02", city: "Miami", bio: "Marine biologist. Weekends are for diving.", isPremium: true },
  { slug: "liam", name: "Liam", gender: "man", birthdate: "1993-01-28", city: "Seattle", bio: "Carpenter who builds furniture and reads poetry." },
  { slug: "hugo", name: "Hugo", gender: "man", birthdate: "1989-09-09", city: "Chicago", bio: "ER doctor. I value people who show up on time.", isVerified: true },
  { slug: "adam", name: "Adam", gender: "man", birthdate: "1994-05-17", city: "Denver", bio: "Ski instructor in winter, bike mechanic in summer." },
  { slug: "leo", name: "Leo", gender: "man", birthdate: "1996-12-23", city: "Boston", bio: "History PhD student. I cook a serious risotto.", isVerified: true },
  { slug: "owen", name: "Owen", gender: "man", birthdate: "1991-04-05", city: "Portland", bio: "Coffee roaster. Yes, I have opinions about your espresso." },
  { slug: "felix", name: "Felix", gender: "man", birthdate: "1997-08-11", city: "San Diego", bio: "Photographer. I'd rather show you the city than describe it.", isPremium: true },
  { slug: "jules", name: "Jules", gender: "man", birthdate: "1993-10-30", city: "Nashville", bio: "Sound engineer, vinyl collector, decent dancer.", isVerified: true },
];

const HOUR = 60 * 60 * 1000;

async function main() {
  // Relançable : on repart d'un décor propre (les profils sont supprimés en cascade)
  await db.delete(users).where(eq(users.isSeed, true));

  const premiumUntil = new Date("2099-01-01");
  const now = Date.now();

  for (const [index, p] of SEED_PROFILES.entries()) {
    const userId = generateId();
    await db.insert(users).values({
      id: userId,
      email: `seed-${p.slug}@${DEMO_EMAIL_DOMAIN}`,
      name: p.name,
      emailVerified: true,
      gender: p.gender,
      birthdate: p.birthdate,
      city: p.city,
      bio: p.bio,
      isVerified: p.isVerified ?? false,
      premiumUntil: p.isPremium ? premiumUntil : null,
      isSeed: true,
    });
    await db.insert(profiles).values({
      id: generateId(),
      userId,
      photos: [`/demo/avatars/${p.slug}.svg`],
      depositAmount: p.depositAmount ?? 5000,
      // Dates échelonnées pour un ordre d'affichage stable dans /browse
      lastActive: new Date(now - index * HOUR),
    });
  }

  console.log(`${SEED_PROFILES.length} profils de décor créés.`);
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => process.exit());
