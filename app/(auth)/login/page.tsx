"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Minimum 8 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    await signIn.social({ provider: "google", callbackURL: "/browse" });
  };

  const onSubmit = async (values: LoginFormValues) => {
    setError(null);
    const result = await signIn.email({
      email: values.email,
      password: values.password,
    });

    if (result.error) {
      setError("Incorrect email or password.");
      return;
    }

    router.push("/browse");
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "420px",
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "1.25rem",
        padding: "2.5rem 2rem",
        color: "white",
      }}
    >
      {/* Logo + titre */}
      <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
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
          Welcome back!
        </h1>
        <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.5)", marginTop: "0.375rem" }}>
          Sign in to your NoPayNoDate account
        </p>
      </div>

      {/* Bouton Google */}
      <button
        onClick={handleGoogleSignIn}
        disabled={googleLoading}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.625rem",
          background: "white",
          color: "#1a1a2e",
          border: "none",
          borderRadius: "0.625rem",
          padding: "0.75rem 1rem",
          fontSize: "0.9rem",
          fontWeight: 600,
          cursor: googleLoading ? "not-allowed" : "pointer",
          opacity: googleLoading ? 0.7 : 1,
          fontFamily: "inherit",
        }}
      >
        <GoogleIcon />
        {googleLoading ? "Redirecting..." : "Continue with Google"}
      </button>

      {/* Divider */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          margin: "1.25rem 0",
        }}
      >
        <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.12)" }} />
        <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)" }}>or</span>
        <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.12)" }} />
      </div>

      {/* Formulaire email/mdp */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem" }}>
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    className="bg-white/10 border-white/15 text-white placeholder:text-white/30 focus-visible:border-cyan-400 focus-visible:ring-cyan-400/30"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem" }}>
                  Password
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="bg-white/10 border-white/15 text-white placeholder:text-white/30 focus-visible:border-cyan-400 focus-visible:ring-cyan-400/30"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {error && (
            <p style={{ fontSize: "0.85rem", color: "#ff6b9d", margin: 0 }}>{error}</p>
          )}
          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
            style={{
              background: "linear-gradient(135deg, #00c9a0, #009478)",
              border: "none",
              fontWeight: 600,
              color: "#0a1a14",
            }}
          >
            {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </Form>

      {/* Footer */}
      <p
        style={{
          textAlign: "center",
          fontSize: "0.85rem",
          color: "rgba(255,255,255,0.4)",
          marginTop: "1.5rem",
          marginBottom: 0,
        }}
      >
        No account yet?{" "}
        <Link href="/register" style={{ color: "#00c9a0", textDecoration: "underline" }}>
          Create an account
        </Link>
      </p>
    </div>
  );
}
