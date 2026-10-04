import Link from "next/link";
import { DemoNotice } from "@/components/demo-notice";

export const metadata = {
  title: "Legal Notice — NoPayNoDate",
};

export default function LegalPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-20">
      <h1 className="text-3xl font-bold mb-2">Legal Notice</h1>
      <p className="text-sm text-muted-foreground mb-10">Last updated: March 2026</p>
      <DemoNotice />

      <div className="space-y-8 text-sm text-muted-foreground">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Publisher</h2>
          <p>NoPayNoDate is operated by TeeboStudio.</p>
          <p className="mt-1">Contact: <a href="mailto:contact@teebostudio.fr" className="underline">contact@teebostudio.fr</a></p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Hosting</h2>
          <p>This website is hosted by Vercel Inc., 340 Pine Street, Suite 700, San Francisco, CA 94104, USA.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Payments</h2>
          <p>All payments are processed by Stripe, Inc. NoPayNoDate does not store any banking or card information.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Age Restriction</h2>
          <p>This platform is strictly reserved for adults aged 18 and over. Registration requires providing a valid date of birth. Any false declaration may result in immediate account termination.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Intellectual Property</h2>
          <p>All content on this platform (design, code, texts, logos) is the exclusive property of NoPayNoDate / TeeboStudio. Any reproduction without prior written consent is prohibited.</p>
        </section>
      </div>

      <div className="mt-12 text-sm text-muted-foreground">
        <Link href="/" className="underline underline-offset-4 hover:text-foreground">← Back to home</Link>
      </div>
    </main>
  );
}
