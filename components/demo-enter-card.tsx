"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { DEMO_TEST_CARD } from "@/lib/demo";

const STEPS = [
  "You get two throwaway accounts: Marc and Léa.",
  "As Marc, send a date request and pay the deposit with the test card.",
  "Switch to Léa to accept, chat and confirm the date.",
];

// Remplace les pages de connexion et d'inscription en mode démo
export function DemoEnterCard() {
  const isFull = useSearchParams().get("full") === "1";
  const [loading, setLoading] = useState(false);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "440px",
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "1.25rem",
        padding: "2.5rem 2rem",
        color: "white",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div
          style={{
            width: "56px",
            height: "56px",
            background: "linear-gradient(135deg, #00c9a0, #009478)",
            borderRadius: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "28px",
            margin: "0 auto 1rem",
            boxShadow: "0 0 24px rgba(0,201,160,0.4)",
          }}
        >
          ♥
        </div>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0, color: "white" }}>
          Try the demo
        </h1>
        <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.5)", marginTop: "0.375rem" }}>
          No sign-up, no real money. One click and you are in.
        </p>
      </div>

      <ol style={{ listStyle: "none", padding: 0, margin: "0 0 1.5rem", display: "grid", gap: "0.75rem" }}>
        {STEPS.map((step, i) => (
          <li key={step} style={{ display: "flex", gap: "0.75rem", fontSize: "0.875rem", color: "rgba(255,255,255,0.75)" }}>
            <span
              style={{
                flexShrink: 0,
                width: "1.5rem",
                height: "1.5rem",
                borderRadius: "999px",
                background: "rgba(0,201,160,0.15)",
                color: "#00c9a0",
                fontSize: "0.75rem",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {i + 1}
            </span>
            {step}
          </li>
        ))}
      </ol>

      {isFull && (
        <p style={{ fontSize: "0.85rem", color: "#ff6b9d", margin: "0 0 1rem" }}>
          The demo is full right now. Please try again in a few minutes.
        </p>
      )}

      <form action="/api/demo/enter" method="post" onSubmit={() => setLoading(true)}>
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            background: "linear-gradient(135deg, #00c9a0, #009478)",
            color: "#0a1a14",
            border: "none",
            borderRadius: "0.625rem",
            padding: "0.75rem 1rem",
            fontSize: "0.95rem",
            fontWeight: 600,
            cursor: loading ? "wait" : "pointer",
            opacity: loading ? 0.7 : 1,
            fontFamily: "inherit",
          }}
        >
          {loading ? "Setting up your accounts…" : "Enter the demo"}
        </button>
      </form>

      <p style={{ textAlign: "center", fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", margin: "1.25rem 0 0" }}>
        Stripe test mode · card {DEMO_TEST_CARD} · your accounts are deleted after 24 hours
      </p>
    </div>
  );
}
