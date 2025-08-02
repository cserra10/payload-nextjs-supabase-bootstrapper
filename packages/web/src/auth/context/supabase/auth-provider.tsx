'use client';

import type { AuthContextValue } from '../../types';

import { useMemo } from 'react';

import { AuthContext } from '../auth-context';
import { useSupabaseAuth } from '../../hooks/use-supabase-auth';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const { user, loading, authenticated, unauthenticated, checkUserSession } = useSupabaseAuth();

  const memoizedValue: AuthContextValue = useMemo(
    () => ({
      user,
      loading,
      authenticated,
      unauthenticated,
      checkUserSession,
    }),
    [user, loading, authenticated, unauthenticated, checkUserSession]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
