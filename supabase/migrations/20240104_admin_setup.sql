-- Add is_admin column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public'
        AND table_name = 'profiles' 
        AND column_name = 'is_admin'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN is_admin BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Function to confirm a user
CREATE OR REPLACE FUNCTION confirm_user(user_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE auth.users
    SET email_confirmed_at = NOW(),
        confirmed_at = NOW()
    WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create admin user if it doesn't exist
DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    -- Check if admin user exists
    IF NOT EXISTS (
        SELECT 1 FROM auth.users 
        WHERE email = 'admin@habitflow.app'
    ) THEN
        -- Insert admin user
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            raw_user_meta_data,
            raw_app_meta_data,
            is_super_admin,
            encrypted_password,
            created_at,
            updated_at,
            confirmation_token,
            email_confirmed_at,
            last_sign_in_at,
            raw_confirmation_token_data
        )
        VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'admin@habitflow.app',
            '{"full_name": "Admin User", "is_admin": true}'::jsonb,
            '{"provider": "email", "providers": ["email"]}'::jsonb,
            false,
            crypt('admin123', gen_salt('bf')),
            now(),
            now(),
            encode(gen_random_bytes(32), 'hex'),
            now(),
            now(),
            '{}'::jsonb
        )
        RETURNING id INTO admin_user_id;

        -- Insert admin profile
        INSERT INTO public.profiles (
            id,
            email,
            username,
            full_name,
            is_admin,
            created_at,
            updated_at
        )
        VALUES (
            admin_user_id,
            'admin@habitflow.app',
            'admin',
            'Admin User',
            true,
            now(),
            now()
        );
    END IF;
END $$;

-- Enable storage
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create storage bucket if it doesn't exist
DO $$
BEGIN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('habits', 'habits', true)
    ON CONFLICT (id) DO NOTHING;
END $$;

-- Create storage policy for public access
CREATE POLICY "Public Access" ON storage.objects
    FOR SELECT
    USING (bucket_id = 'habits');

-- Create storage policy for authenticated uploads
CREATE POLICY "Authenticated Users can upload files" ON storage.objects
    FOR INSERT
    WITH CHECK (
        bucket_id = 'habits'
        AND auth.role() = 'authenticated'
    );

-- Create storage policy for owners to update and delete their files
CREATE POLICY "Users can update own files" ON storage.objects
    FOR UPDATE
    USING (
        bucket_id = 'habits'
        AND auth.uid() = owner
    );

CREATE POLICY "Users can delete own files" ON storage.objects
    FOR DELETE
    USING (
        bucket_id = 'habits'
        AND auth.uid() = owner
    );
