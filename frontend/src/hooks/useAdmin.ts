import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface AdminStatus {
  isAdmin: boolean;
  isSuperAdmin: boolean;
  role: 'user' | 'admin' | 'super_admin';
  adminSince: string | null;
}

export function useAdmin() {
  const [adminStatus, setAdminStatus] = useState<AdminStatus>({
    isAdmin: false,
    isSuperAdmin: false,
    role: 'user',
    adminSince: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStatus();
  }, []);

  const fetchAdminStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setAdminStatus({
          isAdmin: false,
          isSuperAdmin: false,
          role: 'user',
          adminSince: null
        });
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('user_admin_status')
        .select('role, admin_since')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching admin status:', error);
        setAdminStatus({
          isAdmin: false,
          isSuperAdmin: false,
          role: 'user',
          adminSince: null
        });
      } else {
        const role = data?.role || 'user';
        setAdminStatus({
          isAdmin: role === 'admin' || role === 'super_admin',
          isSuperAdmin: role === 'super_admin',
          role: role as 'user' | 'admin' | 'super_admin',
          adminSince: data?.admin_since || null
        });
      }
    } catch (error) {
      console.error('Error fetching admin status:', error);
      setAdminStatus({
        isAdmin: false,
        isSuperAdmin: false,
        role: 'user',
        adminSince: null
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    ...adminStatus,
    loading,
    refetch: fetchAdminStatus
  };
}