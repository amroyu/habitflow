-- Create the uuid-ossp extension if it doesn't exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create habit_categories table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.habit_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('good', 'bad')),
    color TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Drop the unique constraint if it exists
DO $$ BEGIN
    ALTER TABLE public.habit_categories DROP CONSTRAINT IF EXISTS habit_categories_name_user_id_key;
EXCEPTION
    WHEN undefined_object THEN NULL;
END $$;

-- Add unique constraint for name and user_id, allowing nulls in user_id
ALTER TABLE public.habit_categories
ADD CONSTRAINT habit_categories_name_user_id_key 
UNIQUE (name, COALESCE(user_id, '00000000-0000-0000-0000-000000000000'));

-- Insert default habit categories (with null user_id to make them global)
INSERT INTO public.habit_categories (name, type, color, user_id)
VALUES
    ('Health & Fitness', 'good', '#22c55e', NULL),
    ('Productivity', 'good', '#3b82f6', NULL),
    ('Learning', 'good', '#8b5cf6', NULL),
    ('Mindfulness', 'good', '#06b6d4', NULL),
    ('Social', 'good', '#f97316', NULL),
    ('Finance', 'good', '#eab308', NULL),
    ('Bad Habits', 'bad', '#ef4444', NULL),
    ('Other', 'good', '#6b7280', NULL)
ON CONFLICT (name, COALESCE(user_id, '00000000-0000-0000-0000-000000000000')) 
DO UPDATE SET 
    type = EXCLUDED.type,
    color = EXCLUDED.color;

-- Enable RLS
ALTER TABLE public.habit_categories ENABLE ROW LEVEL SECURITY;

-- Create policies for habit_categories
DROP POLICY IF EXISTS "Users can view default categories or their own categories" ON public.habit_categories;
CREATE POLICY "Users can view default categories or their own categories"
    ON public.habit_categories FOR SELECT
    USING (user_id IS NULL OR auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own categories" ON public.habit_categories;
CREATE POLICY "Users can insert their own categories"
    ON public.habit_categories FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own categories" ON public.habit_categories;
CREATE POLICY "Users can update their own categories"
    ON public.habit_categories FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own categories" ON public.habit_categories;
CREATE POLICY "Users can delete their own categories"
    ON public.habit_categories FOR DELETE
    USING (auth.uid() = user_id);
