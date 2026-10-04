import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Suspense } from "react";
import { auth } from "@/server/auth";
import { isDemo } from "@/lib/demo";
import { DemoEnterCard } from "@/components/demo-enter-card";

const HEARTS = [
  { left: "4%",  delay: "0s",    duration: "9s"   },
  { left: "12%", delay: "2.5s",  duration: "11s"  },
  { left: "22%", delay: "5s",    duration: "8s"   },
  { left: "32%", delay: "1.2s",  duration: "13s"  },
  { left: "42%", delay: "3.8s",  duration: "10s"  },
  { left: "53%", delay: "0.7s",  duration: "7.5s" },
  { left: "63%", delay: "6s",    duration: "12s"  },
  { left: "73%", delay: "2s",    duration: "9.5s" },
  { left: "83%", delay: "4.5s",  duration: "8.5s" },
  { left: "92%", delay: "1.8s",  duration: "11.5s"},
];

const HEART_SIZES = ["1.4rem","0.9rem","2rem","1.1rem","1.7rem","0.8rem","2.2rem","1.3rem","1.6rem","1rem"];

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) redirect("/browse");

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #080c14 0%, #081820 50%, #080c14 100%)",
        position: "relative",
        overflow: "hidden",
        padding: "1rem",
        paddingTop: "5rem",
      }}
    >
      {/* Logo — back to home */}
      <Link
        href="/"
        style={{
          position: "absolute",
          top: "1.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          color: "white",
          textDecoration: "none",
          fontWeight: 700,
          fontSize: "1.1rem",
          zIndex: 20,
          opacity: 0.9,
          whiteSpace: "nowrap",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="" width={28} height={28} />
        NoPayNoDate
      </Link>

      {/* Floating hearts */}
      {HEARTS.map((h, i) => (
        <div
          key={i}
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: "-60px",
            left: h.left,
            fontSize: HEART_SIZES[i],
            color: "oklch(0.8903 0.1739 171.2690)",
            animation: `float-up ${h.duration} ${h.delay} linear infinite`,
            pointerEvents: "none",
            userSelect: "none",
            lineHeight: 1,
          }}
        >
          ♥
        </div>
      ))}

      {/* Ambient glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "65%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "500px",
          height: "280px",
          background: "radial-gradient(ellipse, rgba(125,240,204,0.12) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 10, width: "100%", display: "flex", justifyContent: "center" }}>
        {isDemo ? (
          <Suspense>
            <DemoEnterCard />
          </Suspense>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
