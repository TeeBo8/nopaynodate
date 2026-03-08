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
  manName: string;
  amount: number; // en cents
  netAmount: number; // en cents (après commission)
  requestsUrl: string;
}

export function DepotRecuFemmeEmail({ womanName, manName, amount, netAmount, requestsUrl }: Props) {
  const dollars = (amount / 100).toFixed(2);
  const net = (netAmount / 100).toFixed(2);

  return (
    <Html>
      <Head />
      <Preview>{manName} sent you a deposit of {dollars}$ — respond now</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>New request received</Heading>
          <Text style={text}>Hi {womanName},</Text>
          <Text style={text}>
            <strong>{manName}</strong> sent you a request with a deposit of{" "}
            <strong>${dollars}</strong>.
          </Text>
          <Text style={text}>
            If you accept, you will receive <strong>${net}</strong> once the date is confirmed
            by both parties. If you decline, the deposit is fully refunded.
          </Text>
          <Section style={btnContainer}>
            <Button style={btn} href={requestsUrl}>
              View request
            </Button>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>
            You can accept or decline from your requests page.
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
