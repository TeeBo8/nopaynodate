import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/server/auth";
import { LandingNavbar } from "./_components/landing/navbar";
import { LandingHero } from "./_components/landing/hero";
import { LandingHowItWorks } from "./_components/landing/how-it-works";
import { LandingFeatures } from "./_components/landing/features";
import { LandingStats } from "./_components/landing/stats";
import { LandingPricing } from "./_components/landing/pricing";
import { LandingFaq } from "./_components/landing/faq";
import { LandingReality } from "./_components/landing/reality";
import { LandingEscrowDiagram } from "./_components/landing/escrow-diagram";
import { LandingCta } from "./_components/landing/cta";
import { LandingFooter } from "./_components/landing/footer";
import { LandingStickyCta } from "./_components/landing/sticky-cta";
import { FadeIn } from "@/components/fade-in";

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
        <FadeIn><LandingReality /></FadeIn>
        <FadeIn delay={100}><LandingStats /></FadeIn>
        <FadeIn><LandingEscrowDiagram /></FadeIn>
        <FadeIn><LandingHowItWorks /></FadeIn>
        <FadeIn><LandingFeatures /></FadeIn>
        <FadeIn><LandingPricing /></FadeIn>
        <FadeIn><LandingFaq /></FadeIn>
        <FadeIn><LandingCta /></FadeIn>
      </main>
      <LandingFooter />
      <LandingStickyCta />
    </div>
  );
}
