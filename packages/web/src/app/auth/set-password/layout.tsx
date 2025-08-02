import { SetPasswordGuard } from 'src/auth/guard';
import { AuthProvider } from 'src/auth/context/supabase';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <AuthProvider>
      <SetPasswordGuard>{children}</SetPasswordGuard>
    </AuthProvider>
  );
}
