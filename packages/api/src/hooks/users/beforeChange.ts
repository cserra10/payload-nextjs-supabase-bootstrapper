import { APIError } from 'payload';
import type { CollectionBeforeChangeHook } from 'payload';
import { supabaseAdmin } from '../../lib/supabase';

export const beforeChangeHook: CollectionBeforeChangeHook = async ({ data, operation, req }) => {
  // Validate required fields for create operations
  if (operation === 'create') {
    if (!data.tenant) {
      throw new APIError('Tenant is required', 400);
    }

    if (!data.email) {
      throw new APIError('Email is required', 400);
    }
  }

  // Only process for create operations and when user doesn't have supabaseId yet
  // All users in this collection get Supabase invites (no super users here)
  if (operation === 'create' && !data.supabaseId && data.email) {
    try {
      console.log(`Creating Supabase invite for user: ${data.email}`);

      // Send invite through Supabase - user will need to set password
      const { data: supabaseData, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(
        data.email,
        {
          redirectTo: `${process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:8001'}/auth/set-password`,
          data: {
            displayName: data.name || data.email,
          },
        }
      );

      if (error) {
        console.error('Supabase invite error:', error);

        // Throw APIError with the original Supabase error message
        throw new APIError(error.message, 400);
      }

      if (supabaseData?.user?.id) {
        // Set the Supabase ID in the data that will be persisted
        data.supabaseId = supabaseData.user.id;
        console.log(
          `User ${data.email} invited successfully. Supabase ID: ${supabaseData.user.id}`
        );
      }
    } catch (error) {
      console.error('Error in user beforeChange hook:', error);

      // Re-throw the error as-is to surface it to the admin UI
      throw error;
    }
  }

  return data;
};
