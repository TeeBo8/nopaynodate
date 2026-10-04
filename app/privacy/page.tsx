import Link from "next/link";
import { DemoNotice } from "@/components/demo-notice";

export const metadata = {
  title: "Privacy Policy — NoPayNoDate",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-20">
      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-10">Last updated: March 2026</p>
      <DemoNotice />

      <div className="prose prose-sm dark:prose-invert max-w-none space-y-8 text-muted-foreground">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">1. Data We Collect</h2>
          <p>We collect the information you provide when creating an account (name, email, date of birth, gender, city, bio, photos) as well as transaction data related to deposits and subscriptions processed via Stripe.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">2. How We Use Your Data</h2>
          <p>Your data is used solely to operate the platform: displaying your profile, processing payments, sending transactional emails, and ensuring platform security. We do not sell your data to third parties.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">3. Third-Party Services</h2>
          <p>We use Stripe for payment processing, Resend for transactional emails, and Uploadthing for photo storage. Each of these services has its own privacy policy and processes your data under their respective terms.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">4. Data Retention</h2>
          <p>Your data is retained for as long as your account is active. Upon account deletion, your profile and conversation data are deleted from our database. Photos already uploaded to our storage provider may remain until they are purged. Payment records may be retained longer for legal compliance.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">5. Your Rights</h2>
          <p>You have the right to access, correct, or delete your personal data at any time. You can delete your account directly from the settings page or by contacting us at <a href="mailto:contact@teebostudio.fr" className="underline">contact@teebostudio.fr</a>.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">6. Cookies</h2>
          <p>We use strictly necessary session cookies for authentication. We do not use tracking or advertising cookies. See our <Link href="/cookies" className="underline">Cookie Policy</Link> for details.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">7. Contact</h2>
          <p>For any privacy-related requests, contact us at <a href="mailto:contact@teebostudio.fr" className="underline">contact@teebostudio.fr</a>.</p>
        </section>
      </div>

      <div className="mt-12 text-sm text-muted-foreground">
        <Link href="/" className="underline underline-offset-4 hover:text-foreground">← Back to home</Link>
      </div>
    </main>
  );
}
