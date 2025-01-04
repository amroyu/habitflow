-- Add is_admin column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'is_admin'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN is_admin BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Function to confirm a user
CREATE OR REPLACE FUNCTION confirm_user(user_id UUID)
RETURNS void AS $$
BEGIN
    -- Update auth.users to confirm the user
    UPDATE auth.users
    SET email_confirmed_at = NOW(),
        confirmed_at = NOW()
    WHERE id = user_id;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER;
