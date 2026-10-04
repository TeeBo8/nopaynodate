import Link from "next/link";
import { DemoNotice } from "@/components/demo-notice";

export const metadata = {
  title: "Cookie Policy — NoPayNoDate",
};

export default function CookiesPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-20">
      <h1 className="text-3xl font-bold mb-2">Cookie Policy</h1>
      <p className="text-sm text-muted-foreground mb-10">Last updated: March 2026</p>
      <DemoNotice />

      <div className="space-y-8 text-sm text-muted-foreground">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">What are cookies?</h2>
          <p>Cookies are small text files stored on your device when you visit a website. They allow us to maintain your session and remember your preferences.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Cookies we use</h2>
          <div className="mt-3 rounded-lg border border-border overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-2.5 font-medium text-foreground">Cookie</th>
                  <th className="text-left px-4 py-2.5 font-medium text-foreground">Purpose</th>
                  <th className="text-left px-4 py-2.5 font-medium text-foreground">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="px-4 py-3 font-mono">better-auth.session_token</td>
                  <td className="px-4 py-3">Authentication session — keeps you logged in</td>
                  <td className="px-4 py-3">7 days</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono">better-auth.session_data</td>
                  <td className="px-4 py-3">Short-lived copy of the session, to avoid a database lookup on every page</td>
                  <td className="px-4 py-3">5 minutes</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Local storage</h2>
          <p>Your light or dark mode preference is kept in your browser&apos;s local storage, not in a cookie. It never leaves your device.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">No tracking or advertising cookies</h2>
          <p>We do not use Google Analytics, Facebook Pixel, or any third-party advertising cookies. Your browsing on NoPayNoDate is not tracked for advertising purposes.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Managing cookies</h2>
          <p>You can disable cookies in your browser settings at any time. Note that disabling session cookies will prevent you from staying logged in.</p>
        </section>
      </div>

      <div className="mt-12 text-sm text-muted-foreground">
        <Link href="/" className="underline underline-offset-4 hover:text-foreground">← Back to home</Link>
      </div>
    </main>
  );
}
