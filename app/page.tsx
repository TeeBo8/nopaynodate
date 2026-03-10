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

const softwareAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "NoPayNoDate",
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Web",
  url: "https://nopaynodate.com",
  description:
    "Premium dating app where men pay a secure deposit ($20–$200 set by the woman) to unlock chat. Deposit held in Stripe escrow — 100% refunded if she declines, released after a confirmed date. Platform takes 10% commission only on confirmed dates.",
  offers: [
    {
      "@type": "Offer",
      name: "Date Deposit",
      price: "20",
      priceCurrency: "USD",
      description: "Minimum deposit set by the woman to unlock chat ($20–$200)",
    },
    {
      "@type": "Offer",
      name: "Premium Subscription",
      price: "19.99",
      priceCurrency: "USD",
      description:
        "Monthly subscription: verified badge, increased visibility, advanced filters",
    },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "127",
    bestRating: "5",
    worstRating: "1",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is NoPayNoDate legal? Is it not prostitution?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Completely legal, and absolutely not prostitution. The deposit is not a payment for a sexual encounter — it is a proof of commitment, exactly like a booking deposit. It compensates the real costs women incur for each date (hair, outfit, transport…). No act is purchased, no intimate service is included. The model is similar to a security deposit: if the date happens, the deposit is transferred; if declined, it is refunded. The content of the date remains entirely free.",
      },
    },
    {
      "@type": "Question",
      name: "What is escrow? How does it work in practice?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "When a man pays a deposit, the money does not go immediately to the woman — it is held in escrow by Stripe, our payment partner. It remains locked until the request is resolved: if the woman declines, Stripe automatically refunds the man. If she accepts and the date is confirmed by both parties, Stripe transfers the deposit (minus 10% commission) to the woman's Stripe Express account. The money never passes directly between the two people.",
      },
    },
    {
      "@type": "Question",
      name: "Why do women need to create a Stripe Express account?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "To receive bank transfers, Stripe requires legal identity verification — this is a regulatory requirement (KYC), not our choice. Creating a Stripe Express account is free, takes about 5 minutes, and lets you receive your deposits directly to your bank account. Stripe is the world leader in online payments, used by Amazon, Shopify and millions of businesses.",
      },
    },
    {
      "@type": "Question",
      name: "What happens if the date doesn't go well or is cancelled?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "If the date is cancelled before it happens, the deposit is refunded to the man. If the date took place but one party disputes it, our team reviews the situation. The deposit remains in escrow during this period. We handle each dispute manually to ensure fairness for both sides.",
      },
    },
    {
      "@type": "Question",
      name: "Are deposits really refunded if I say no?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, 100% and automatically. When a woman declines a request, Stripe immediately triggers the refund. The man gets his full deposit back with no action required. This is the core guarantee of the system: women can decline freely, with no financial consequences for the man.",
      },
    },
    {
      "@type": "Question",
      name: "How much is the NoPayNoDate platform commission?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "NoPayNoDate takes 10% of each deposit transferred to the woman, only when the date is confirmed. If the woman declines, no commission is charged. For example: for a $100 deposit, the woman receives $90 and the platform keeps $10. This commission funds maintenance, security, and support.",
      },
    },
    {
      "@type": "Question",
      name: "How do I know profiles on NoPayNoDate are real?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Every profile goes through manual validation before becoming visible. Photo uploads, bio, and profile information are reviewed. Suspicious accounts are removed. Moreover, the deposit mechanism itself naturally filters out unserious profiles: nobody pays $20–200 for a fake profile.",
      },
    },
    {
      "@type": "Question",
      name: "What is the deposit amount on NoPayNoDate?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Women set their own deposit amount, ranging from $20 to $200. This gives women full control over the level of commitment they require before engaging with a man on the platform.",
      },
    },
    {
      "@type": "Question",
      name: "How is NoPayNoDate different from Tinder or Bumble?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Unlike Tinder or Bumble where anyone can message for free (leading to 78% user burnout), NoPayNoDate requires a financial deposit to initiate contact. This filters out unserious users, reduces ghosting, and compensates women for their real preparation costs. The deposit is held in Stripe escrow and fully refunded if she declines — making the risk zero for women.",
      },
    },
  ],
};

export default async function HomePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) {
    redirect("/browse");
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
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
    </>
  );
}
