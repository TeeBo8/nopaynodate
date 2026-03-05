"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { api } from "@/lib/trpc-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/requests`,
      },
    });

    if (stripeError) {
      setError(stripeError.message ?? "Erreur de paiement");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={!stripe || loading} className="w-full">
        {loading ? "Traitement..." : "Payer le dépôt"}
      </Button>
    </form>
  );
}

export default function DepositPage() {
  const params = useParams();
  const requestId = params.requestId as string;
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const createPI = api.deposits.createPaymentIntent.useMutation({
    onSuccess: (data) => {
      if (data.clientSecret) setClientSecret(data.clientSecret);
    },
  });

  useEffect(() => {
    createPI.mutate({ dateRequestId: requestId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestId]);

  if (createPI.error) {
    return (
      <div className="max-w-md mx-auto">
        <p className="text-destructive">{createPI.error.message}</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Payer le dépôt</h1>
        <p className="text-muted-foreground mt-1">
          Ce dépôt sera intégralement remboursé si votre demande est rejetée.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Paiement sécurisé</CardTitle>
          <CardDescription>
            Vos données de carte sont protégées par Stripe.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {clientSecret ? (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: { theme: "stripe" },
              }}
            >
              <CheckoutForm />
            </Elements>
          ) : (
            <p className="text-muted-foreground text-sm">Chargement...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
