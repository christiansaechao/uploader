import React, { useState } from "react";
import { stripeProducts } from "@/constants/stripe-config";
import { createClient } from "@supabase/supabase-js";
import { PricingFooter } from "./pricing-footer";
import { PricingHeader } from "./pricing-header";
import { PricingCards } from "./pricing-cards";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface PricingPageProps {
  currentPlan?: string;
}

export default function PricingPage({ currentPlan }: PricingPageProps) {
  const [loadingPriceId, setLoadingPriceId] = useState<string | null>(null);

  const handleSubscribe = async (priceId: string) => {
    setLoadingPriceId(priceId);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error("Please log in to subscribe");
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            price_id: priceId,
            mode: "subscription",
            success_url: `${window.location.origin}/success`,
            cancel_url: `${window.location.origin}/pricing`,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Subscription error:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to start subscription process"
      );
    } finally {
      setLoadingPriceId(null);
    }
  };

  return (
    <div className="space-y-8">
      <PricingHeader />
      <PricingCards
        stripeProducts={stripeProducts}
        handleSubscribe={handleSubscribe}
        loadingPriceId={loadingPriceId}
        currentPlan={currentPlan}
      />
      <PricingFooter />
    </div>
  );
}
