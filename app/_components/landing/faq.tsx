import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Est-ce légal ? Ce n'est pas de la prostitution ?",
    a: "Absolument légal, et absolument pas de la prostitution. Le dépôt n'est pas un paiement pour un rendez-vous sexuel — c'est une preuve d'engagement, exactement comme un acompte pour une réservation. Il compense les frais réels que les femmes engagent pour chaque date (coiffeur, tenue, transport…). Aucun acte n'est acheté, aucun service intime n'est inclus. Le modèle est similaire à une caution : si la date a lieu, le dépôt est transféré ; si elle est refusée, il est remboursé. Le contenu de la rencontre reste entièrement libre.",
  },
  {
    q: "Qu'est-ce que l'escrow ? Comment ça fonctionne concrètement ?",
    a: "Quand un homme verse un dépôt, l'argent ne va pas immédiatement à la femme — il est conservé en séquestre (escrow) par Stripe, notre partenaire de paiement. Il reste bloqué jusqu'à l'issue de la demande : si la femme refuse, Stripe rembourse automatiquement l'homme. Si elle accepte et que la date est confirmée par les deux parties, Stripe transfère le dépôt (moins 10% de commission) sur le compte Stripe Express de la femme. L'argent ne transite jamais directement entre les deux personnes.",
  },
  {
    q: "Pourquoi les femmes doivent-elles créer un compte Stripe Express ?",
    a: "Pour recevoir des virements bancaires, Stripe impose une vérification d'identité légale — c'est une exigence réglementaire (KYC), pas un choix de notre part. La création d'un compte Stripe Express est gratuite, prend environ 5 minutes, et vous permet de recevoir vos dépôts directement sur votre compte bancaire. Stripe est le leader mondial des paiements en ligne, utilisé par Amazon, Shopify et des millions d'entreprises.",
  },
  {
    q: "Que se passe-t-il si la date ne se passe pas bien ou est annulée ?",
    a: "Si la date est annulée avant d'avoir lieu, le dépôt est remboursé à l'homme. Si la date a eu lieu mais que l'une des parties conteste, notre équipe examine la situation. Le dépôt reste en escrow pendant cette période. Nous traitons chaque litige manuellement pour garantir l'équité des deux côtés.",
  },
  {
    q: "Les dépôts sont-ils vraiment remboursés si je dis non ?",
    a: "Oui, à 100% et automatiquement. Quand une femme refuse une demande, Stripe déclenche immédiatement le remboursement. L'homme récupère l'intégralité de son dépôt sans démarche de sa part. C'est la garantie fondamentale du système : les femmes peuvent refuser librement, sans aucune conséquence financière pour l'homme.",
  },
  {
    q: "Combien coûte la commission plateforme ?",
    a: "NoPayNoDate prélève 10% sur chaque dépôt transféré à la femme, uniquement lorsque la date est confirmée. Si la femme refuse, aucune commission n'est prélevée. Par exemple : pour un dépôt de 100$, la femme reçoit 90$ et la plateforme conserve 10$. Cette commission finance la maintenance, la sécurité et le support.",
  },
  {
    q: "Comment savoir que les profils sont réels ?",
    a: "Chaque profil passe par une validation manuelle avant d'être visible. L'upload de photos, la bio, et les informations de profil sont vérifiés. Les comptes suspects sont supprimés. De plus, le mécanisme de dépôt lui-même filtre naturellement les profils non sérieux : personne ne verse 20–200$ pour un faux profil.",
  },
];

export function LandingFaq() {
  return (
    <section className="py-24 px-4">
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Questions fréquentes
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Tout ce que vous voulez savoir avant de vous lancer.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="rounded-xl border border-border/60 px-6 data-[state=open]:border-primary/30"
            >
              <AccordionTrigger className="text-left font-semibold hover:no-underline py-5">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
