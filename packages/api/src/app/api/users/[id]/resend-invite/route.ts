import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import configPromise from '@payload-config';
import { getPayloadHMR } from '@payloadcms/next/utilities';
import { supabaseAdmin } from '../../../../../lib/supabase';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    console.log(resolvedParams);
    const payload = await getPayloadHMR({ config: configPromise });

    // Get the user from Payload
    const user = await payload.findByID({
      collection: 'users',
      id: resolvedParams.id,
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check Supabase user metadata first if they have a supabaseId
    let existingSupabaseUser = null;

    if (user.supabaseId) {
      try {
        const { data: supabaseUser, error: getUserError } =
          await supabaseAdmin.auth.admin.getUserById(user.supabaseId);
        console.log('supabaseUser', supabaseUser);
        if (!getUserError && supabaseUser) {
          existingSupabaseUser = supabaseUser;

          // Check if user has completed onboarding through metadata
          const onboardingCompleted = supabaseUser.user?.user_metadata?.has_completed_onboarding;

          if (onboardingCompleted) {
            return NextResponse.json(
              { error: 'User has already completed onboarding' },
              { status: 400 }
            );
          }
        }
      } catch (getUserError) {
        console.log('Error fetching Supabase user, will proceed with invite:', getUserError);
      }
    }

    // Only delete and recreate if user exists but hasn't completed onboarding
    if (user.supabaseId && existingSupabaseUser) {
      try {
        await supabaseAdmin.auth.admin.deleteUser(user.supabaseId);
        console.log('Deleted existing Supabase user to reset invite state');
      } catch (deleteError) {
        console.log('Error deleting Supabase user, continuing with invite:', deleteError);
      }
    }

    // Send new invite
    const { data: supabaseData, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(
      user.email,
      {
        redirectTo: `${process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:8001'}/auth/set-password`,
        data: {
          displayName: user.name || user.email,
        },
      }
    );

    if (error) {
      console.error('Supabase invite error:', error);
      return NextResponse.json(
        { error: `Failed to send invite: ${error.message}` },
        { status: 500 }
      );
    }

    // Update the user with new Supabase ID
    if (supabaseData?.user?.id) {
      await payload.update({
        collection: 'users',
        id: resolvedParams.id,
        data: {
          supabaseId: supabaseData.user.id,
          isConfirmed: false,
        },
      });
    }

    return NextResponse.json({
      message: 'Invite sent successfully',
      email: user.email,
    });
  } catch (error) {
    console.error('Error resending invite:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
