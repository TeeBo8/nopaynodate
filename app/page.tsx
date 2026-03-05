import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/server/auth";
import { LandingNavbar } from "./_components/landing/navbar";
import { LandingHero } from "./_components/landing/hero";
import { LandingHowItWorks } from "./_components/landing/how-it-works";
import { LandingFeatures } from "./_components/landing/features";
import { LandingStats } from "./_components/landing/stats";
import { LandingPricing } from "./_components/landing/pricing";
import { LandingCta } from "./_components/landing/cta";
import { LandingFooter } from "./_components/landing/footer";

export default async function HomePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) {
    redirect("/browse");
  }

  return (
    <div className="min-h-screen">
      <LandingNavbar />
      <main>
        <LandingHero />
        <LandingStats />
        <LandingHowItWorks />
        <LandingFeatures />
        <LandingPricing />
        <LandingCta />
      </main>
      <LandingFooter />
    </div>
  );
}
