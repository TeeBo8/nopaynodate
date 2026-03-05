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
  chatUrl: string;
}

export function MatchAccepteHommeEmail({ manName, womanName, chatUrl }: Props) {
  return (
    <Html>
      <Head />
      <Preview>{womanName} a accepté votre demande — le chat est maintenant ouvert !</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>C&apos;est un match !</Heading>
          <Text style={text}>Bonjour {manName},</Text>
          <Text style={text}>
            <strong>{womanName}</strong> a accepté votre demande. Le chat est maintenant
            ouvert — c&apos;est le moment de briser la glace !
          </Text>
          <Text style={text}>
            Rappelez-vous : une fois la date confirmée par les deux parties, les fonds
            lui seront transférés. Soyez respectueux et profitez de l&apos;échange.
          </Text>
          <Section style={btnContainer}>
            <Button style={btn} href={chatUrl}>
              Ouvrir le chat
            </Button>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>
            NoPayNoDate — Des rencontres sérieuses, garanties.
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
