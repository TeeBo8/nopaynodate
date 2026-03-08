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
      <Preview>Your deposit of {dollars}$ has been confirmed — {womanName} received your request</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Deposit confirmed ✓</Heading>
          <Text style={text}>Hi {manName},</Text>
          <Text style={text}>
            Your deposit of <strong>${dollars}</strong> to contact{" "}
            <strong>{womanName}</strong> has been received.
          </Text>
          <Text style={text}>
            She has been notified and can now accept or decline your request.
            You will be notified by email as soon as she responds.
          </Text>
          <Section style={btnContainer}>
            <Button style={btn} href={chatUrl}>
              View my request
            </Button>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>
            If your request is declined, your deposit is fully refunded.
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
