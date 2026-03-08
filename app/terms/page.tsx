import Link from "next/link";

export const metadata = {
  title: "Terms of Service — NoPayNoDate",
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-20">
      <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
      <p className="text-sm text-muted-foreground mb-10">Last updated: March 2026</p>

      <div className="prose prose-sm dark:prose-invert max-w-none space-y-8 text-muted-foreground">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">1. Acceptance of Terms</h2>
          <p>By creating an account on NoPayNoDate, you confirm that you are at least 18 years old and agree to be bound by these Terms of Service. If you do not agree, do not use this platform.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">2. Platform Description</h2>
          <p>NoPayNoDate is a premium dating platform where men pay a deposit set by women to initiate contact. The platform acts as an escrow intermediary and takes a 10% commission on each deposit. All payments are processed securely via Stripe.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">3. Deposits & Refunds</h2>
          <p>Deposits are held in escrow and fully refunded if a request is declined. If a date is confirmed by both parties, the deposit (minus the platform commission) is transferred to the woman&apos;s Stripe Express account within 2 business days.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">4. User Conduct</h2>
          <p>Users agree not to harass, threaten, or abuse other users. Fake profiles, spam, or fraudulent activity will result in immediate account termination and potential legal action. All profile information must be truthful.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">5. Premium Subscription</h2>
          <p>Premium subscriptions are billed monthly at $19.99/month via Stripe. You may cancel at any time via your account settings. No refunds are issued for partial billing periods.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">6. Account Termination</h2>
          <p>We reserve the right to suspend or terminate accounts that violate these terms. Users may delete their own account at any time from the settings page.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">7. Limitation of Liability</h2>
          <p>NoPayNoDate is not responsible for the behavior of its users outside the platform. We provide a secure payment infrastructure but do not guarantee the outcome of any date or interaction.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">8. Contact</h2>
          <p>For any questions regarding these terms, contact us at <a href="mailto:contact@teebostudio.fr" className="underline">contact@teebostudio.fr</a>.</p>
        </section>
      </div>

      <div className="mt-12 text-sm text-muted-foreground">
        <Link href="/" className="underline underline-offset-4 hover:text-foreground">← Back to home</Link>
      </div>
    </main>
  );
}
