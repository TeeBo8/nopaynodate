import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0c0c1a 0%, #1a0826 50%, #0c0c1a 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          padding: "0 100px",
          position: "relative",
        }}
      >
        {/* Glow effect */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            height: 300,
            background: "radial-gradient(ellipse, rgba(232,30,140,0.25) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />

        {/* Logo row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            marginBottom: 28,
          }}
        >
          {/* Icon mark — pink rounded square with heart */}
          <div
            style={{
              width: 88,
              height: 88,
              background: "linear-gradient(135deg, #e81e8c, #c0157a)",
              borderRadius: 22,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 52,
              boxShadow: "0 0 40px rgba(232,30,140,0.5)",
            }}
          >
            ♥
          </div>
          {/* Brand name */}
          <span
            style={{
              fontSize: 68,
              fontWeight: 800,
              color: "white",
              letterSpacing: -2,
            }}
          >
            NoPayNoDate
          </span>
        </div>

        {/* Tagline */}
        <p
          style={{
            fontSize: 34,
            fontWeight: 700,
            color: "#e81e8c",
            margin: "0 0 16px 0",
            textAlign: "center",
          }}
        >
          Des rencontres sérieuses. Garanties.
        </p>

        {/* Description */}
        <p
          style={{
            fontSize: 22,
            color: "rgba(255,255,255,0.55)",
            margin: 0,
            textAlign: "center",
            maxWidth: 780,
            lineHeight: 1.5,
          }}
        >
          Fini le ghosting — les hommes versent un dépôt sécurisé via Stripe.
          Remboursé à 100% si elle refuse.
        </p>

        {/* Bottom badges */}
        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 44,
          }}
        >
          {["🔒 Stripe sécurisé", "✅ Remboursé si refus", "👑 Profils Premium"].map(
            (badge) => (
              <div
                key={badge}
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 100,
                  padding: "10px 22px",
                  fontSize: 18,
                  color: "rgba(255,255,255,0.75)",
                }}
              >
                {badge}
              </div>
            )
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
