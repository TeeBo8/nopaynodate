import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/server/auth";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
