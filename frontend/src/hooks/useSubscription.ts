import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { getProductByPriceId } from '../stripe-config';
import { useAdmin } from './useAdmin';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface SubscriptionData {
  subscription_status: string;
  price_id: string | null;
  current_period_end: number | null;
  cancel_at_period_end: boolean;
}

export function useSubscription() {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAdmin();

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setSubscription(null);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('stripe_user_subscriptions')
        .select('subscription_status, price_id, current_period_end, cancel_at_period_end')
        .maybeSingle();

      if (error) {
        console.error('Error fetching subscription:', error);
        setSubscription(null);
      } else {
        setSubscription(data);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentPlan = () => {
    if (!subscription?.price_id) return null;
    
    const product = getProductByPriceId(subscription.price_id);
    return product?.name || null;
  };

  const isActive = () => {
    return isAdmin || subscription?.subscription_status === 'active';
  };

  return {
    subscription,
    loading,
    getCurrentPlan,
    isActive,
    refetch: fetchSubscription
  };
}