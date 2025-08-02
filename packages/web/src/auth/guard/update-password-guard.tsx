'use client';

import { useEffect } from 'react';

import { useRouter, usePathname } from 'src/routes/hooks';

import { SplashScreen } from 'src/components/loading-screen';

import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

type UpdatePasswordGuardProps = {
  children: React.ReactNode;
};

export function UpdatePasswordGuard({ children }: UpdatePasswordGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { authenticated, loading, user } = useAuthContext();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!authenticated) {
      router.replace('/auth/login');
    }
  }, [authenticated, loading, user, pathname, router]);

  if (loading) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}
