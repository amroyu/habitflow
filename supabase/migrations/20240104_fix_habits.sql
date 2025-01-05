-- Add new widgets column to habits table
ALTER TABLE public.habits ADD COLUMN IF NOT EXISTS widgets JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.habits ADD CONSTRAINT valid_widgets CHECK (jsonb_typeof(widgets) = 'array');

-- Add category support
CREATE TABLE IF NOT EXISTS public.habit_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('good', 'bad')),
    color TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(name, user_id)
);

-- Add category_id to habits
ALTER TABLE public.habits ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.habit_categories(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS habits_category_id_idx ON public.habits(category_id);

-- Enable RLS for habit_categories
ALTER TABLE public.habit_categories ENABLE ROW LEVEL SECURITY;

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

-- Insert default categories if they don't exist
INSERT INTO public.habit_categories (name, type, color, user_id)
VALUES
    ('Health & Fitness', 'good', '#4CAF50', NULL),
    ('Productivity', 'good', '#2196F3', NULL),
    ('Personal Growth', 'good', '#9C27B0', NULL),
    ('Relationships', 'good', '#E91E63', NULL),
    ('Bad Habits', 'bad', '#F44336', NULL)
-- Drop and recreate habits table
DROP TABLE IF EXISTS public.habits CASCADE;

CREATE TABLE public.habits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('good', 'bad')),
    category_id UUID REFERENCES public.habit_categories(id) ON DELETE SET NULL,
    frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly')),
    streak INTEGER NOT NULL DEFAULT 0,
    progress FLOAT NOT NULL DEFAULT 0,
    last_completed TIMESTAMP WITH TIME ZONE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add indexes
CREATE INDEX habits_user_id_idx ON public.habits(user_id);
CREATE INDEX habits_category_id_idx ON public.habits(category_id);

-- Enable RLS
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;

-- Create policies
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

-- Create trigger for updating timestamps
CREATE OR REPLACE FUNCTION update_habits_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_habits_updated_at
    BEFORE UPDATE ON public.habits
    FOR EACH ROW
    EXECUTE FUNCTION update_habits_updated_at();
