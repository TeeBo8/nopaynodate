"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signUp } from "@/lib/auth-client";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const step1Schema = z.object({
  name: z.string().min(2, "Minimum 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Minimum 8 characters"),
  birthdate: z.string().refine((val) => {
    if (!val) return false;
    const birth = new Date(val);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear() -
      (today < new Date(today.getFullYear(), birth.getMonth(), birth.getDate()) ? 1 : 0);
    return age >= 18;
  }, "You must be 18 or older to register"),
});

type Step1Values = z.infer<typeof step1Schema>;

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [step1Data, setStep1Data] = useState<Step1Values | null>(null);
  const [selectedGender, setSelectedGender] = useState<"man" | "woman" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<Step1Values>({
    resolver: zodResolver(step1Schema),
    defaultValues: { name: "", email: "", password: "", birthdate: "" },
  });

  const handleStep1 = (values: Step1Values) => {
    setStep1Data(values);
    setStep(2);
  };

  const handleStep2 = async () => {
    if (!selectedGender || !step1Data) return;
    setLoading(true);
    setError(null);

    const result = await signUp.email({
      name: step1Data.name,
      email: step1Data.email,
      password: step1Data.password,
      gender: selectedGender,
      birthdate: step1Data.birthdate,
    });

    setLoading(false);

    if (result.error) {
      setError(result.error.message ?? "Error creating account.");
      setStep(1);
      return;
    }

    router.push("/profile/edit");
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>
          {step === 1 ? "Step 1 of 2 — Your information" : "Step 2 of 2 — Who are you?"}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {step === 1 ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleStep1)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Minimum 8 characters" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="birthdate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of birth</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split("T")[0]}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <p className="text-xs text-muted-foreground">
                By creating an account, you confirm you are 18 or older and agree to our{" "}
                <span className="underline cursor-pointer">Terms of Service</span>.
              </p>
              <Button type="submit" className="w-full">
                Continue
              </Button>
            </form>
          </Form>
        ) : (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground text-center">
              This determines your role on the platform.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setSelectedGender("woman")}
                className={cn(
                  "flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all hover:border-foreground",
                  selectedGender === "woman"
                    ? "border-foreground bg-foreground/5"
                    : "border-border"
                )}
              >
                <span className="text-4xl">👩</span>
                <div className="text-center">
                  <p className="font-semibold">Woman</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    You set the deposit amount
                  </p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setSelectedGender("man")}
                className={cn(
                  "flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all hover:border-foreground",
                  selectedGender === "man"
                    ? "border-foreground bg-foreground/5"
                    : "border-border"
                )}
              >
                <span className="text-4xl">👨</span>
                <div className="text-center">
                  <p className="font-semibold">Man</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    You pay a deposit to get a date
                  </p>
                </div>
              </button>
            </div>
            {error && <p className="text-sm text-destructive text-center">{error}</p>}
            <Button
              onClick={handleStep2}
              className="w-full"
              disabled={!selectedGender || loading}
            >
              {loading ? "Creating account..." : "Create my account"}
            </Button>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setStep(1)}
              disabled={loading}
            >
              Back
            </Button>
          </div>
        )}
      </CardContent>

      {step === 1 && (
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-foreground underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </CardFooter>
      )}
    </Card>
  );
}
