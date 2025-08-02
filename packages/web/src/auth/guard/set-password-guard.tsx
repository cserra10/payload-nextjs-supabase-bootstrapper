'use client';

import { useEffect } from 'react';

import { useRouter, usePathname } from 'src/routes/hooks';

import { SplashScreen } from 'src/components/loading-screen';

import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

type SetPasswordGuardProps = {
  children: React.ReactNode;
};

export function SetPasswordGuard({ children }: SetPasswordGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { authenticated, loading, user } = useAuthContext();

  useEffect(() => {
    console.log('🔐 SetPasswordGuard:', { loading, authenticated, pathname, user: !!user });

    // Still loading auth state
    if (loading) {
      console.log('⏳ Auth loading...');
      return;
    }

    // Not authenticated - redirect to login
    if (!authenticated) {
      console.log('🚫 Not authenticated → login');
      router.replace('/auth/login');
      return;
    }

    // Authenticated - check onboarding status
    if (authenticated && user) {
      const hasCompletedOnboarding = user.user_metadata?.has_completed_onboarding;
      console.log('👤 Set-password guard check:', { hasCompletedOnboarding, pathname });

      // User already completed onboarding - redirect to dashboard
      if (hasCompletedOnboarding) {
        console.log('✅ Password already set → dashboard');
        router.replace('/dashboard');
        return;
      }
    }
  }, [authenticated, loading, user, pathname, router]);

  // Prevent navigation away from set-password until password is set
  useEffect(() => {
    if (!loading && authenticated && user && !user.user_metadata?.has_completed_onboarding) {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        // Set confirmation message
        const message = 'You must set your password before leaving this page.';
        e.returnValue = message;
        return message;
      };

      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
    return undefined;
  }, [loading, authenticated, user]);

  if (loading) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}
