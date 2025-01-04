'use server';

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';
const ADMIN_EMAIL = 'admin@habitflow.app';

export async function adminLogin(username: string, password: string) {
  // First check if the credentials match our admin constants
  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return { success: false, error: 'Invalid admin credentials' };
  }

  try {
    const cookieStore = cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore });
    
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

    // First try to get the admin user
    const { data: { users }, error: getUserError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (getUserError) {
      console.error('Error checking admin user:', getUserError);
      return { success: false, error: 'Failed to check admin user' };
    }

    let adminUser = users.find(u => u.email === ADMIN_EMAIL);

    // If admin doesn't exist, create them
    if (!adminUser) {
      const { data: { user }, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        email_confirm: true,
        user_metadata: { role: 'admin' },
      });

      if (createError) {
        console.error('Error creating admin user:', createError);
        return { success: false, error: 'Failed to create admin user' };
      }

      adminUser = user;
    }

    // Sign in with Supabase client to set the session cookie
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });

    if (signInError) {
      console.error('Error signing in admin:', signInError);
      return { success: false, error: 'Failed to sign in admin' };
    }

    // Wait for session to be set
    await new Promise(resolve => setTimeout(resolve, 1000));

    return { success: true };
  } catch (error) {
    console.error('Error in admin login:', error);
    return { success: false, error: 'Internal server error' };
  }
}
