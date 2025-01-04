'use server';

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const ADMIN_EMAIL = 'admin@habitflow.app';
const ADMIN_PASSWORD = 'admin123';

export async function adminLogin() {
  try {
    const cookieStore = cookies();
    
    // Create admin client with service role key
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Create regular client for session management
    const supabase = createServerComponentClient({ cookies: () => cookieStore });

    // First, try to get the admin user
    const { data: { users }, error: getUserError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (getUserError) {
      console.error('Error getting users:', getUserError);
      return { success: false, error: getUserError.message };
    }

    const adminUser = users?.find(user => user.email === ADMIN_EMAIL);

    // If admin doesn't exist, create them
    if (!adminUser) {
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        email_confirm: true,
        user_metadata: {
          full_name: 'Admin User',
          is_admin: true,
        },
      });

      if (createError) {
        console.error('Error creating admin:', createError);
        return { success: false, error: createError.message };
      }
    }

    // Now try to sign in
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });

    if (signInError) {
      console.error('Sign in error:', signInError);
      return { success: false, error: signInError.message };
    }

    if (!signInData?.user) {
      return { success: false, error: 'No user data received' };
    }

    // Check if profile exists
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', signInData.user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Profile check error:', profileError);
      return { success: false, error: profileError.message };
    }

    // Create profile if it doesn't exist
    if (!profile) {
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: signInData.user.id,
          email: ADMIN_EMAIL,
          username: 'admin',
          full_name: 'Admin User',
          is_admin: true,
        });

      if (insertError) {
        console.error('Profile creation error:', insertError);
        return { success: false, error: insertError.message };
      }
    }

    return {
      success: true,
      message: 'Admin login successful',
      user: signInData.user,
    };
  } catch (error: any) {
    console.error('Admin setup error:', error);
    return {
      success: false,
      error: error?.message || 'Internal server error',
    };
  }
}
