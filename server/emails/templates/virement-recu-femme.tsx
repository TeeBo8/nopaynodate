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
      <Preview>Transfer of {net}$ received to your Stripe account</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Transfer received</Heading>
          <Text style={text}>Hi {womanName},</Text>
          <Text style={text}>
            The date has been confirmed by both parties. A transfer of{" "}
            <strong>${net}</strong> has been initiated to your Stripe account.
          </Text>
          <Text style={text}>
            The transfer timeline depends on Stripe Express (usually 2 business days).
            You can track the status directly in your Stripe dashboard.
          </Text>
          <Section style={btnContainer}>
            <Button style={btn} href={dashboardUrl}>
              View my dashboard
            </Button>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>
            Thank you for using NoPayNoDate — see you soon for your next date!
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
