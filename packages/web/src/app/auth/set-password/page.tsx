'use client';

import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/lib/supabase';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { useTranslation } from 'src/locales';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { FormHead } from 'src/auth/components/form-head';

// ----------------------------------------------------------------------

const createSetPasswordSchema = (t: any) =>
  zod
    .object({
      password: zod
        .string()
        .min(1, { message: t('validation.password.required') })
        .min(6, { message: t('validation.password.minLength') }),
      confirmPassword: zod.string().min(1, { message: t('validation.confirmPassword.required') }),
    })
    .refine(data => data.password === data.confirmPassword, {
      message: t('validation.confirmPassword.noMatch'),
      path: ['confirmPassword'],
    });

type SetPasswordSchemaType = zod.infer<ReturnType<typeof createSetPasswordSchema>>;

// ----------------------------------------------------------------------

export default function SetPasswordPage() {
  const router = useRouter();
  const { t } = useTranslation('auth');

  const showPassword = useBoolean();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const defaultValues: SetPasswordSchemaType = {
    password: '',
    confirmPassword: '',
  };

  const SetPasswordSchema = createSetPasswordSchema(t);

  const methods = useForm<SetPasswordSchemaType>({
    resolver: zodResolver(SetPasswordSchema),
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

      // Update the password for the authenticated user
      const { data: updateData, error: updateError } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (updateError) {
        setErrorMessage(updateError.message);
        return;
      }

      if (updateData?.user) {
        // Mark onboarding as complete in user metadata
        await supabase.auth.updateUser({
          data: {
            has_completed_onboarding: true,
          },
        });

        setSuccessMessage(t('setPassword.success'));

        // Redirect to dashboard after successful password setup
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      }
    } catch (error) {
      console.error('Set password error:', error);
      setErrorMessage(t('setPassword.errors.unexpected'));
    }
  });

  const renderForm = () => (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      <Field.Text
        name='password'
        label={t('setPassword.newPassword')}
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

      <Field.Text
        name='confirmPassword'
        label={t('setPassword.confirmPassword')}
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
        type='submit'
        size='large'
        variant='contained'
        loading={isSubmitting}
        loadingIndicator={t('setPassword.loading.setting')}
      >
        {t('setPassword.button')}
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
      <Card sx={{ maxWidth: 420, width: '100%', p: 4, boxShadow: 3 }}>
        <FormHead
          title={t('setPassword.title')}
          description={t('setPassword.description')}
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
  );
}
