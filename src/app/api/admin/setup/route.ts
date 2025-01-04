import { createRouteHandlerClient, createClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const ADMIN_EMAIL = 'admin@habitflow.app';
const ADMIN_PASSWORD = 'admin123';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function POST() {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

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

    // Try to get the admin user
    const { data: { users }, error: getUserError } = await supabaseAdmin.auth.admin.listUsers();
    const adminUser = users?.find(user => user.email === ADMIN_EMAIL);

    if (getUserError) {
      return new Response(
        JSON.stringify({ success: false, error: getUserError.message }),
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    let userId: string;

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
        return new Response(
          JSON.stringify({ success: false, error: createError.message }),
          { 
            status: 500,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      }

      userId = newUser.user.id;
    } else {
      userId = adminUser.id;
    }

    // Now try to sign in
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });

    if (signInError) {
      return new Response(
        JSON.stringify({ success: false, error: signInError.message }),
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Check if profile exists
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', signInData.user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') { // Ignore "not found" error
      return new Response(
        JSON.stringify({ success: false, error: profileError.message }),
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
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
        return new Response(
          JSON.stringify({ success: false, error: insertError.message }),
          { 
            status: 500,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Admin setup complete',
        user: signInData.user
      }),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error: any) {
    console.error('Admin setup error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error?.message || 'Internal server error'
      }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
