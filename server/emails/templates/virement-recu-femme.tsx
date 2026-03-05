import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface Props {
  womanName: string;
  netAmount: number; // en cents
  dashboardUrl: string;
}

export function VirementRecuFemmeEmail({ womanName, netAmount, dashboardUrl }: Props) {
  const net = (netAmount / 100).toFixed(2);

  return (
    <Html>
      <Head />
      <Preview>Virement de {net}$ reçu sur votre compte Stripe</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Virement reçu</Heading>
          <Text style={text}>Bonjour {womanName},</Text>
          <Text style={text}>
            La date a été confirmée par les deux parties. Un virement de{" "}
            <strong>${net}</strong> a été initié vers votre compte Stripe.
          </Text>
          <Text style={text}>
            Le délai de versement dépend de Stripe Express (généralement 2 jours ouvrés).
            Vous pouvez suivre le statut directement dans votre dashboard Stripe.
          </Text>
          <Section style={btnContainer}>
            <Button style={btn} href={dashboardUrl}>
              Voir mon tableau de bord
            </Button>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>
            Merci d&apos;utiliser NoPayNoDate — à bientôt pour une prochaine rencontre !
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = { backgroundColor: "#f6f9fc", fontFamily: "Arial, sans-serif" };
const container = {
  backgroundColor: "#ffffff",
  margin: "40px auto",
  padding: "40px",
  borderRadius: "8px",
  maxWidth: "560px",
};
const h1 = { fontSize: "24px", fontWeight: "bold", color: "#1a1a2e", marginBottom: "24px" };
const text = { fontSize: "16px", lineHeight: "24px", color: "#444" };
const btnContainer = { textAlign: "center" as const, margin: "32px 0" };
const btn = {
  backgroundColor: "#e11d48",
  color: "#fff",
  padding: "12px 28px",
  borderRadius: "6px",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
};
const hr = { borderColor: "#e2e8f0", margin: "24px 0" };
const footer = { fontSize: "13px", color: "#94a3b8" };
