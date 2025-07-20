import React, { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { stripeProducts } from '../../stripe-config';
import { createClient } from '@supabase/supabase-js';
import { useAdmin } from '../../hooks/useAdmin';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface PricingPageProps {
  currentPlan?: string;
}

export default function PricingPage({ currentPlan }: PricingPageProps) {
  const [loadingPriceId, setLoadingPriceId] = useState<string | null>(null);
  const { isAdmin } = useAdmin();

  // If user is admin, show a different message
  if (isAdmin) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Admin Access</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            You have administrative access to all features. No subscription required.
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-green-900 mb-2">Full Access Granted</h3>
          <p className="text-green-700 mb-4">
            As an administrator, you have unlimited access to all platform features including:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-green-800">Unlimited stores and listings</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-green-800">All marketplace integrations</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-green-800">Advanced analytics</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-green-800">AI-powered tools</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-green-800">Priority support</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-green-800">Admin panel access</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSubscribe = async (priceId: string) => {
    setLoadingPriceId(priceId);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Please log in to subscribe');
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          price_id: priceId,
          mode: 'subscription',
          success_url: `${window.location.origin}/success`,
          cancel_url: `${window.location.origin}/pricing`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert(error instanceof Error ? error.message : 'Failed to start subscription process');
    } finally {
      setLoadingPriceId(null);
    }
  };

  const formatFeatures = (description: string) => {
    // Split by ✅ and 🚫 to separate features
    const parts = description.split(/(?=✅|🚫|💡|📞)/);
    return parts.filter(part => part.trim().length > 0);
  };

  const getFeatureIcon = (feature: string) => {
    if (feature.startsWith('✅')) return '✅';
    if (feature.startsWith('🚫')) return '🚫';
    if (feature.startsWith('💡')) return '💡';
    if (feature.startsWith('📞')) return '📞';
    return '•';
  };

  const getFeatureColor = (feature: string) => {
    if (feature.startsWith('🚫')) return 'text-gray-500';
    return 'text-gray-700';
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Scale your marketplace business with the right tools for your needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stripeProducts.map((product) => {
          const isCurrentPlan = currentPlan === product.name.toLowerCase();
          const features = formatFeatures(product.description);
          
          return (
            <div
              key={product.priceId}
              className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-200 hover:shadow-xl ${
                product.name === 'Pro' 
                  ? 'border-blue-500 ring-2 ring-blue-200' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {product.name === 'Pro' && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">${product.price}</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                  
                  {isCurrentPlan ? (
                    <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-medium">
                      Current Plan
                    </div>
                  ) : (
                    <button
                      onClick={() => handleSubscribe(product.priceId)}
                      disabled={loadingPriceId === product.priceId}
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                        product.name === 'Pro'
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-900 text-white hover:bg-gray-800'
                      } disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center`}
                    >
                      {loadingPriceId === product.priceId ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Get Started'
                      )}
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {features.map((feature, index) => {
                    const icon = getFeatureIcon(feature);
                    const color = getFeatureColor(feature);
                    const text = feature.replace(/^(✅|🚫|💡|📞)\s*/, '');
                    
                    return (
                      <div key={index} className={`flex items-start space-x-3 ${color}`}>
                        <span className="flex-shrink-0 text-lg">{icon}</span>
                        <span className="text-sm leading-relaxed">{text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-gray-50 rounded-2xl p-8 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Need a Custom Solution?</h3>
        <p className="text-gray-600 mb-6">
          Contact us for enterprise pricing and custom integrations tailored to your business needs.
        </p>
        <button className="bg-gray-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
          Contact Sales
        </button>
      </div>
    </div>
  );
}