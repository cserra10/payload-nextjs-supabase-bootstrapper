'use client';

import { Form, Field } from 'src/components/hook-form';
import { useMemo, useState } from 'react';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { CONFIG } from 'src/global-config';
import Card from '@mui/material/Card';
import { FormHead } from 'src/auth/components/form-head';
import { Logo } from 'src/components/logo';
import Typography from '@mui/material/Typography';
import { paths } from 'src/routes/paths';
import { supabase } from '@/lib/supabase';
import { useForm } from 'react-hook-form';
import { useRouter } from 'src/routes/hooks';
import { useTranslation } from 'src/locales';
import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// ----------------------------------------------------------------------

const createForgotPasswordSchema = (t: any) =>
  zod.object({
    email: zod
      .string()
      .min(1, { message: t('validation.email.required') })
      .email({ message: t('validation.email.invalid') }),
  });

type ForgotPasswordSchemaType = zod.infer<ReturnType<typeof createForgotPasswordSchema>>;

// ----------------------------------------------------------------------

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { t } = useTranslation('auth');

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const defaultValues: ForgotPasswordSchemaType = {
    email: '',
  };

  // Memoize schema creation to prevent recreation on every render
  const ForgotPasswordSchema = useMemo(() => createForgotPasswordSchema(t), [t]);

  const methods = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async data => {
    try {
      setErrorMessage(null);
      setSuccessMessage(null);

      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      setSuccessMessage(t('resetPassword.success', { email: data.email }));
    } catch (error) {
      console.error('Reset password error:', error);
      setErrorMessage(t('resetPassword.errors.unexpected'));
    }
  });

  const renderForm = () => (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      <Field.Text
        autoFocus
        name='email'
        label={t('resetPassword.email')}
        placeholder='example@gmail.com'
        slotProps={{ inputLabel: { shrink: true } }}
      />

      <Button
        fullWidth
        type='submit'
        variant='contained'
        loading={isSubmitting}
        loadingIndicator={t('resetPassword.button')}
      >
        {t('resetPassword.button')}
      </Button>

      <Button
        fullWidth
        variant='outlined'
        onClick={() => router.push(paths.auth.supabase.signIn)}
        disabled={isSubmitting}
      >
        {t('resetPassword.backToLogin')}
      </Button>
    </Box>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        p: 3,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 420 }}>
        {/* App Title with Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <Logo isSingle disabled sx={{ width: 42, height: 42 }} />
          <Typography
            variant='h4'
            component='h1'
            sx={{
              fontWeight: 600,
              color: 'text.primary',
            }}
          >
            {CONFIG.appName}
          </Typography>
        </Box>

        <Card sx={{ width: '100%', p: 4, boxShadow: 3 }}>
          <FormHead
            title={t('resetPassword.title')}
            description={t('resetPassword.description')}
            sx={{ textAlign: 'left', mb: 4 }}
          />

          {!!successMessage && (
            <Alert severity='success' sx={{ mb: 3 }}>
              {successMessage}
            </Alert>
          )}

          {!!errorMessage && (
            <Alert severity='error' sx={{ mb: 3 }}>
              {errorMessage}
            </Alert>
          )}

          <Form methods={methods} onSubmit={onSubmit}>
            {renderForm()}
          </Form>
        </Card>
      </Box>
    </Box>
  );
}
