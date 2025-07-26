export interface StripeProduct {
  plan: string;
  priceId: string;
  mode: "subscription" | "payment";
  price: number;
  description: string;
  features: string[];
}

export const stripeProducts: StripeProduct[] = [
  {
    plan: "Starter",
    priceId: "price_1RmmSuDcAqgPtug4HFLk1AC1",
    mode: "subscription",
    price: 9.99,
    description:
      "Ideal for individuals or small teams starting out with basic needs.",
    features: [
      "Upload and manage inventory",
      "Create and manage orders",
      "Connect one store (ebay or shopify)",
      "Maximum of 100 active listings/month",
      "Image storage up to 1GB",
      "Basic analytics and reporting",
    ],
  },
  {
    plan: "Pro",
    priceId: "price_1RmmUgDcAqgPtug4dYQx3Jd3",
    mode: "subscription",
    price: 79.99,
    description:
      "For established businesses that require advanced features and support.",
    features: [
      "Everything in Growth",
      "Connect up to 5 stores (ebay, shopify, etsy, etc.)",
      "Unlimited active listings",
      "Image storage up to 20GB",
      "Ai title & description generation",
      "Ai auto-messaging for customer inquiries",
      "Ai product recommendations and product generation",
    ],
  },
  {
    plan: "Growth",
    priceId: "price_1RmmUADcAqgPtug4dRspLHGA",
    mode: "subscription",
    price: 24.99,
    description:
      "Designed for growing businesses that need more features and flexibility.",
    features: [
      "Everything in Starter",
      "Connect up to 2 stores (ebay & shopify)",
      "Maximum of 1000 active listings/month",
      "Image storage up to 5GB",
      "Advanced analytics and reporting",
      "CSV import/export for inventory",
      "Inventory auto-sync with connected stores",
    ],
  },
];

export function getProductByPriceId(
  priceId: string
): StripeProduct | undefined {
  return stripeProducts.find((product) => product.priceId === priceId);
}
