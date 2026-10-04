import { Resend } from "resend";
import type { ReactElement } from "react";
import { isDemo } from "@/lib/demo";

let _resend: Resend | null = null;
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

const FROM = "NoPayNoDate <onboarding@resend.dev>";

export async function sendEmail({
  to,
  subject,
  react,
}: {
  to: string;
  subject: string;
  react: ReactElement;
}) {
  // Les comptes de démo ont des adresses fictives : aucun envoi
  if (isDemo) return;
  try {
    await getResend().emails.send({ from: FROM, to, subject, react });
  } catch (err) {
    // Ne jamais bloquer le flux métier pour un email raté
    console.error("[Resend] Erreur envoi email:", err);
  }
}
