-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
    email text,
    name text,
    avatar_url text,
    is_admin boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT profiles_pkey PRIMARY KEY (id)
);

-- Create base tables
CREATE TABLE IF NOT EXISTS public.habits (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    type text NOT NULL CHECK (type IN ('good', 'bad')),
    frequency text NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly')),
    streak JSONB NOT NULL DEFAULT '{"currentStreak": 0, "longestStreak": 0, "lastUpdated": null}'::jsonb,
    progress FLOAT NOT NULL DEFAULT 0,
    last_completed TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    completed_count INTEGER DEFAULT 0,
    target INTEGER DEFAULT 1,
    widgets JSONB DEFAULT '[]'::jsonb,
    CONSTRAINT habits_pkey PRIMARY KEY (id),
    CONSTRAINT valid_streak CHECK (jsonb_typeof(streak) = 'object'),
    CONSTRAINT valid_widgets CHECK (jsonb_typeof(widgets) = 'array')
);

-- Create entries table
CREATE TABLE IF NOT EXISTS public.entries (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    habit_id uuid NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
    user_id uuid NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT entries_pkey PRIMARY KEY (id)
);

-- Create habit categories
CREATE TABLE IF NOT EXISTS public.habit_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('good', 'bad')),
    color TEXT,
    user_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(name, user_id)
);

-- Add category_id to habits
ALTER TABLE public.habits ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.habit_categories(id) ON DELETE SET NULL;

-- Create indexes
CREATE INDEX IF NOT EXISTS habits_user_id_idx ON public.habits(user_id);
CREATE INDEX IF NOT EXISTS habits_category_id_idx ON public.habits(category_id);
CREATE INDEX IF NOT EXISTS habit_categories_user_id_idx ON public.habit_categories(user_id);
CREATE INDEX IF NOT EXISTS entries_habit_id_idx ON public.entries(habit_id);
CREATE INDEX IF NOT EXISTS entries_user_id_idx ON public.entries(user_id);

-- Enable RLS
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Create policies for habits
CREATE POLICY "Users can view their own habits"
    ON public.habits FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own habits"
    ON public.habits FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own habits"
    ON public.habits FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own habits"
    ON public.habits FOR DELETE
    USING (auth.uid() = user_id);

-- Create policies for habit_categories
CREATE POLICY "Users can view their own categories or public categories"
    ON public.habit_categories FOR SELECT
    USING (user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "Users can insert their own categories"
    ON public.habit_categories FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories"
    ON public.habit_categories FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories"
    ON public.habit_categories FOR DELETE
    USING (auth.uid() = user_id);

-- Create policies for entries
CREATE POLICY "Users can view their own entries"
    ON public.entries FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own entries"
    ON public.entries FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own entries"
    ON public.entries FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own entries"
    ON public.entries FOR DELETE
    USING (auth.uid() = user_id);

-- Insert default categories
INSERT INTO public.habit_categories (name, type, color, user_id)
VALUES
    ('Health & Fitness', 'good', '#4CAF50', NULL),
    ('Productivity', 'good', '#2196F3', NULL),
    ('Personal Growth', 'good', '#9C27B0', NULL),
    ('Relationships', 'good', '#E91E63', NULL),
    ('Bad Habits', 'bad', '#F44336', NULL)
ON CONFLICT (name, user_id) DO NOTHING;
