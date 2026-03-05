import { redirect } from "next/navigation";

// Le dashboard redirige directement vers browse
export default function DashboardPage() {
  redirect("/browse");
}
