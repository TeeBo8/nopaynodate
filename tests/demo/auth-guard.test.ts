import { describe, it, expect } from "vitest";
import { isDemoAuthRouteAllowed } from "@/lib/demo";

describe("isDemoAuthRouteAllowed", () => {
  it("laisse passer la lecture de session et la déconnexion", () => {
    expect(isDemoAuthRouteAllowed("GET", "/api/auth/get-session")).toBe(true);
    expect(isDemoAuthRouteAllowed("POST", "/api/auth/sign-out")).toBe(true);
    expect(isDemoAuthRouteAllowed("post", "/api/auth/sign-out/")).toBe(true);
  });

  it("refuse l'inscription et la connexion par mot de passe", () => {
    expect(isDemoAuthRouteAllowed("POST", "/api/auth/sign-up/email")).toBe(false);
    expect(isDemoAuthRouteAllowed("POST", "/api/auth/sign-in/email")).toBe(false);
    expect(isDemoAuthRouteAllowed("POST", "/api/auth/sign-in/social")).toBe(false);
  });

  it("refuse la modification du compte", () => {
    expect(isDemoAuthRouteAllowed("POST", "/api/auth/update-user")).toBe(false);
    expect(isDemoAuthRouteAllowed("POST", "/api/auth/change-password")).toBe(false);
    expect(isDemoAuthRouteAllowed("POST", "/api/auth/change-email")).toBe(false);
    expect(isDemoAuthRouteAllowed("POST", "/api/auth/delete-user")).toBe(false);
  });

  it("refuse une route autorisée appelée avec une autre méthode", () => {
    expect(isDemoAuthRouteAllowed("POST", "/api/auth/get-session")).toBe(false);
    expect(isDemoAuthRouteAllowed("GET", "/api/auth/sign-out")).toBe(false);
  });
});
