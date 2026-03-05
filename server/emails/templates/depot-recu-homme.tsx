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
  manName: string;
  womanName: string;
  amount: number; // en cents
  chatUrl: string;
}

export function DepotRecuHommeEmail({ manName, womanName, amount, chatUrl }: Props) {
  const dollars = (amount / 100).toFixed(2);

  return (
    <Html>
      <Head />
      <Preview>Votre dépôt de {dollars}$ a été confirmé — {womanName} a reçu votre demande</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Dépôt confirmé ✓</Heading>
          <Text style={text}>Bonjour {manName},</Text>
          <Text style={text}>
            Votre dépôt de <strong>${dollars}</strong> pour contacter{" "}
            <strong>{womanName}</strong> a bien été reçu.
          </Text>
          <Text style={text}>
            Elle a été notifiée et peut maintenant accepter ou refuser votre demande.
            Vous serez informé par email dès qu&apos;elle répond.
          </Text>
          <Section style={btnContainer}>
            <Button style={btn} href={chatUrl}>
              Voir ma demande
            </Button>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>
            Si votre demande est refusée, votre dépôt est intégralement remboursé.
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
