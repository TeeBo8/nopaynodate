"use client";

import { useEffect } from "react";

export function BfcacheGuard() {
  useEffect(() => {
    const handler = (e: PageTransitionEvent) => {
      if (e.persisted) {
        window.location.reload();
      }
    };
    window.addEventListener("pageshow", handler);
    return () => window.removeEventListener("pageshow", handler);
  }, []);

  return null;
}
