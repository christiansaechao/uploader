export interface StripeProduct {
  priceId: string;
  name: string;
  description: string;
  mode: 'subscription' | 'payment';
  price: number;
}

export const stripeProducts: StripeProduct[] = [
  {
    priceId: 'price_1RmmSuDcAqgPtug4HFLk1AC1',
    name: 'Starter',
    description: 'Perfect for new sellers testing the waters.✅ Includes:Upload and manage inventoryCreate listings manuallyConnect 1 store (eBay or Shopify)Max 100 active listings/monthImage hosting (1GB)Basic inventory dashboard🚫 No auto-sync, AI, or platform automation💡 Ideal for casual or first-time sellers',
    mode: 'subscription',
    price: 9.99
  },
  {
    priceId: 'price_1RmmUADcAqgPtug4dRspLHGA',
    name: 'Growth',
    description: 'Built for growing sellers who want to automate more.✅ Everything in Starter, plus:Connect up to 2 stores (eBay + Shopify)Max 1,000 active listings/monthCSV uploads and bulk import toolsInventory auto-sync (hourly)Scheduled price & quantity updatesUp to 5GB image storageEarly access to Amazon support (beta)🚫 No advanced AI tools or webhook/API access💡 Great for side hustlers or small shops',
    mode: 'subscription',
    price: 24.99
  },
  {
    priceId: 'price_1RmmUgDcAqgPtug4dYQx3Jd3',
    name: 'Pro',
    description: 'Power tools for serious sellers.✅ Everything in Growth, plus:Connect up to 5 stores (eBay, Shopify, Amazon, Walmart)Unlimited listingsAI title & description generatorAdvanced bulk editor (rules-based)Webhook support (for Stripe, marketplace syncs)20GB image hosting + CDN optimizationFaster sync intervals (every 15 min)Usage analytics dashboard💡 Ideal for full-time sellers and power users💬 Priority email support',
    mode: 'subscription',
    price: 79.99
  },
  {
    priceId: 'price_1RmmVBDcAqgPtug4NxpIxR3q',
    name: 'Team',
    description: 'Enterprise-grade features for agencies and brands.✅ Everything in Pro, plus:Unlimited storesTeam accounts (invite up to 5 users)Role-based permissionsScheduled automation (e.g. relist, delist, auto-price)Custom branding (logo + domain support)API key access for developersWebhook orchestration (with retry support)100GB image storagePriority sync queue💡 Tailored for agencies, enterprise clients, and brands managing multiple storefronts📞 Dedicated account manager on request',
    mode: 'subscription',
    price: 149.99
  }
];

export function getProductByPriceId(priceId: string): StripeProduct | undefined {
  return stripeProducts.find(product => product.priceId === priceId);
}