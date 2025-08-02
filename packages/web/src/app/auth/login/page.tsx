'use client';

import { Form, Field } from 'src/components/hook-form';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { CONFIG } from 'src/global-config';
import Card from '@mui/material/Card';
import { FormHead } from 'src/auth/components/form-head';
import IconButton from '@mui/material/IconButton';
import { Iconify } from 'src/components/iconify';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import { Logo } from 'src/components/logo';
import Typography from '@mui/material/Typography';
import { paths } from 'src/routes/paths';
import { supabase } from '@/lib/supabase';
import { useBoolean } from 'minimal-shared/hooks';
import { useForm } from 'react-hook-form';
import { useRouter } from 'src/routes/hooks';
import { useState } from 'react';
import { useTranslation } from 'src/locales';
import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// ----------------------------------------------------------------------

const createSignInSchema = (t: any) =>
  zod.object({
    email: zod
      .string()
      .min(1, { message: t('validation.email.required') })
      .email({ message: t('validation.email.invalid') }),
    password: zod
      .string()
      .min(1, { message: t('validation.password.required') })
      .min(6, { message: t('validation.password.minLength') }),
  });

type SignInSchemaType = zod.infer<ReturnType<typeof createSignInSchema>>;

// ----------------------------------------------------------------------

export default function LoginPage() {
  const router = useRouter();
  const { t } = useTranslation('auth');

  const showPassword = useBoolean();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const defaultValues: SignInSchemaType = {
    email: '',
    password: '',
  };

  const SignInSchema = createSignInSchema(t);

  const methods = useForm<SignInSchemaType>({
    resolver: zodResolver(SignInSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async data => {
    try {
      setErrorMessage(null);

      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        setErrorMessage(t('login.errors.invalid'));
        return;
      }

      if (authData?.user) {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage(t('login.errors.unexpected'));
    }
  });

  const renderForm = () => (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      <Field.Text
        name='email'
        label={t('login.email')}
        slotProps={{ inputLabel: { shrink: true } }}
      />

      <Field.Text
        name='password'
        label={t('login.password')}
        type={showPassword.value ? 'text' : 'password'}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton onClick={showPassword.onToggle} edge='end'>
                  <Iconify icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      <Button
        fullWidth
        color='inherit'
        type='submit'
        variant='contained'
        loading={isSubmitting}
        loadingIndicator={t('login.button')}
      >
        {t('login.button')}
      </Button>

      <Box sx={{ textAlign: 'right' }}>
        <Link
          href={paths.auth.supabase.resetPassword}
          variant='body2'
          color='inherit'
          underline='always'
          sx={{ cursor: 'pointer' }}
        >
          {t('login.forgotPassword')}
        </Link>
      </Box>
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
            title={t('login.title')}
            description={t('login.description')}
            sx={{ textAlign: 'left', mb: 4 }}
          />

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
