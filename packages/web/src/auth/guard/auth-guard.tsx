'use client';

import { useEffect } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter, usePathname } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';

import { SplashScreen } from 'src/components/loading-screen';

import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

type AuthGuardProps = {
  children: React.ReactNode;
};

const signInPaths = {
  jwt: paths.auth.jwt.signIn,
  auth0: paths.auth.auth0.signIn,
  amplify: paths.auth.amplify.signIn,
  firebase: paths.auth.firebase.signIn,
  supabase: paths.auth.supabase.signIn,
};

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { authenticated, loading, user } = useAuthContext();

  useEffect(() => {
    console.log('🔄 AuthGuard:', { loading, authenticated, pathname, user: !!user });

    // Still loading auth state
    if (loading) {
      return;
    }

    // Not authenticated - redirect to login
    if (!authenticated) {
      console.log('🚫 Not authenticated → login');
      const { method } = CONFIG.auth;
      const signInPath = signInPaths[method];
      router.replace(signInPath);
      return;
    }

    // Authenticated - check if user has completed onboarding
    if (authenticated && user) {
      // Check if this is a password reset flow (tokens in URL hash)
      const isPasswordResetFlow = () => {
        if (typeof window === 'undefined') return false;
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const type = hashParams.get('type');
        return accessToken && type === 'recovery';
      };

      // User is logged in but has NOT set password
      if (!user.user_metadata?.has_completed_onboarding) {
        // If this is a password reset flow, redirect to update-password
        if (isPasswordResetFlow()) {
          console.log('🔄 Password reset flow detected → redirecting to update-password');
          router.replace('/auth/update-password');
          return;
        }

        // Otherwise, it's a first-time user → redirect to set-password
        console.log('🔄 User needs to set password → redirecting to set-password');
        router.replace('/auth/set-password');
        return;
      }
    }
  }, [authenticated, loading, pathname, user, router]);

  // Check if this is a password reset flow (tokens in URL hash)
  const isPasswordResetFlow = () => {
    if (typeof window === 'undefined') return false;
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const type = hashParams.get('type');
    return accessToken && type === 'recovery';
  };

  // Show loading screen during auth checks OR if user needs onboarding (but not for password reset flow)
  if (
    loading ||
    !authenticated ||
    (authenticated &&
      user &&
      !user.user_metadata?.has_completed_onboarding &&
      !isPasswordResetFlow())
  ) {
    return <SplashScreen />;
  }

  // Only render children when user is fully authenticated and onboarded
  return <>{children}</>;
}
