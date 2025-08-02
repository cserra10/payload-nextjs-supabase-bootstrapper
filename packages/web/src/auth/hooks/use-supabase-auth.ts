'use client';

import type { User, Session } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabase';
import { useState, useEffect, useCallback } from 'react';

// ----------------------------------------------------------------------

export function useSupabaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const checkUserSession = useCallback(async (): Promise<void> => {
    try {
      const {
        data: { session: authSession },
      } = await supabase.auth.getSession();
      setSession(authSession);
      setUser(authSession?.user || null);
    } catch (error) {
      console.error('Session check error:', error);
      setSession(null);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    // Check initial session
    checkUserSession().finally(() => setLoading(false));

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, authSession) => {
      setSession(authSession);
      setUser(authSession?.user || null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [checkUserSession]);

  return {
    user,
    session,
    loading,
    authenticated: !!user,
    unauthenticated: !user && !loading,
    checkUserSession,
  };
}
