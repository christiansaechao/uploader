import React from "react";
import { Loader2, CheckCircle } from "lucide-react";
import { StripeProduct } from "@/constants/stripe-config";

interface PricingCardProps {
  stripeProducts: Array<StripeProduct>;
  handleSubscribe: (priceId: string) => void;
  loadingPriceId: string | null;
  currentPlan?: string;
}

export const PricingCards = ({
  stripeProducts,
  handleSubscribe,
  loadingPriceId,
  currentPlan,
}: PricingCardProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {stripeProducts.map((product) => {
        const isCurrentPlan = currentPlan === product.plan.toLowerCase();

        return (
          <div
            key={product.priceId}
            className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-200 hover:shadow-xl ${
              product.plan === "Pro"
                ? "border-blue-500 ring-2 ring-blue-200 bg-[radial-gradient(circle_at_top_right,_rgba(128,128,128,0.9)_0%,_rgba(64,64,64,0.9)_10%,_rgba(0,0,0,1)_40%)]"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            {product.plan === "Pro" && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
            )}

            <div className="h-full p-4">
              <div className="text-center flex flex-col items-center justify-between h-full gap-10">
                <div className="card-header">
                  <div className="flex flex-col space-y-2">
                    <h3
                      className={`text-2xl font-bold ${
                        product.plan === "Pro" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {product.plan}
                    </h3>

                    <h4
                      className={`text-sm ${
                        product.plan === "Pro" ? "text-white" : "text-gray-500"
                      }`}
                    >
                      {product.description}
                    </h4>

                    <div className="space-x-1">
                      <span
                        className={`text-4xl font-bold ${
                          product.plan === "Pro"
                            ? "text-white"
                            : "text-gray-900"
                        }`}
                      >
                        ${product.price}
                      </span>
                      <span
                        className={`text-2xl font-bold ${
                          product.plan === "Pro"
                            ? "text-white"
                            : "text-gray-900"
                        }`}
                      >
                        /month
                      </span>
                    </div>
                  </div>

                  <div className="">
                    <ul className="mt-4 space-y-2 text-left">
                      {product.features.map((feature, index) => (
                        <li
                          key={index}
                          className={`flex items-center text-sm ${
                            product.plan === "Pro"
                              ? "text-white"
                              : "text-gray-700"
                          }`}
                        >
                          <CheckCircle className="w-4 h-4 mr-2 text-blue-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="w-full">
                  {isCurrentPlan ? (
                    <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-medium">
                      Current Plan
                    </div>
                  ) : (
                    <button
                      onClick={() => handleSubscribe(product.priceId)}
                      disabled={loadingPriceId === product.priceId}
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                        product.plan === "Pro"
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-gray-900 text-white hover:bg-gray-800"
                      } disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center`}
                    >
                      {loadingPriceId === product.priceId ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Get Started"
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
