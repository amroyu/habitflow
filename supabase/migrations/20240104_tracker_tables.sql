-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable RLS
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';
ALTER DATABASE postgres SET "app.jwt_exp" TO 3600;

-- Create habit_categories table
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

-- Create habits table
CREATE TABLE IF NOT EXISTS public.habits (
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

-- Add indexes for better performance
DROP INDEX IF EXISTS habits_user_id_idx;
DROP INDEX IF EXISTS habits_category_id_idx;
CREATE INDEX habits_user_id_idx ON public.habits(user_id);
CREATE INDEX habits_category_id_idx ON public.habits(category_id);

-- Enable RLS
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;

-- Create policies for habits
DROP POLICY IF EXISTS "Users can view their own habits" ON public.habits;
CREATE POLICY "Users can view their own habits"
    ON public.habits FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own habits" ON public.habits;
CREATE POLICY "Users can insert their own habits"
    ON public.habits FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own habits" ON public.habits;
CREATE POLICY "Users can update their own habits"
    ON public.habits FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own habits" ON public.habits;
CREATE POLICY "Users can delete their own habits"
    ON public.habits FOR DELETE
    USING (auth.uid() = user_id);

-- Create trigger for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_habits_updated_at ON public.habits;
CREATE TRIGGER update_habits_updated_at
    BEFORE UPDATE ON public.habits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create goals table
CREATE TABLE IF NOT EXISTS public.goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('do', 'dont')),
    category TEXT,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    progress FLOAT DEFAULT 0,
    streak_current INTEGER DEFAULT 0,
    streak_longest INTEGER DEFAULT 0,
    streak_last_updated TIMESTAMP WITH TIME ZONE,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create milestones table
CREATE TABLE IF NOT EXISTS public.milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    goal_id UUID REFERENCES public.goals(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    frequency TEXT CHECK (frequency IN ('one-time', 'daily', 'weekly', 'monthly', 'yearly')),
    last_completed TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create entries table
CREATE TABLE IF NOT EXISTS public.entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    goal_id UUID REFERENCES public.goals(id) ON DELETE CASCADE,
    milestone_id UUID REFERENCES public.milestones(id) ON DELETE SET NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    content_type TEXT NOT NULL CHECK (content_type IN ('text', 'checklist', 'link', 'file', 'spreadsheet', 'note')),
    content JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create timer_tasks table
CREATE TABLE IF NOT EXISTS public.timer_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    duration INTEGER NOT NULL, -- Duration in seconds
    completed BOOLEAN DEFAULT FALSE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.habit_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timer_tasks ENABLE ROW LEVEL SECURITY;

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

-- Create policies for goals
CREATE POLICY "Users can view their own goals"
    ON public.goals FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own goals"
    ON public.goals FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals"
    ON public.goals FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goals"
    ON public.goals FOR DELETE
    USING (auth.uid() = user_id);

-- Create policies for milestones
CREATE POLICY "Users can view milestones for their goals"
    ON public.milestones FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.goals
        WHERE goals.id = milestones.goal_id
        AND goals.user_id = auth.uid()
    ));

CREATE POLICY "Users can insert milestones for their goals"
    ON public.milestones FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.goals
        WHERE goals.id = goal_id
        AND goals.user_id = auth.uid()
    ));

CREATE POLICY "Users can update milestones for their goals"
    ON public.milestones FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.goals
        WHERE goals.id = milestones.goal_id
        AND goals.user_id = auth.uid()
    ))
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.goals
        WHERE goals.id = goal_id
        AND goals.user_id = auth.uid()
    ));

CREATE POLICY "Users can delete milestones for their goals"
    ON public.milestones FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM public.goals
        WHERE goals.id = milestones.goal_id
        AND goals.user_id = auth.uid()
    ));

-- Create policies for entries
CREATE POLICY "Users can view entries for their goals"
    ON public.entries FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.goals
        WHERE goals.id = entries.goal_id
        AND goals.user_id = auth.uid()
    ));

CREATE POLICY "Users can insert entries for their goals"
    ON public.entries FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.goals
        WHERE goals.id = goal_id
        AND goals.user_id = auth.uid()
    ));

CREATE POLICY "Users can update entries for their goals"
    ON public.entries FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.goals
        WHERE goals.id = entries.goal_id
        AND goals.user_id = auth.uid()
    ))
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.goals
        WHERE goals.id = goal_id
        AND goals.user_id = auth.uid()
    ));

CREATE POLICY "Users can delete entries for their goals"
    ON public.entries FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM public.goals
        WHERE goals.id = entries.goal_id
        AND goals.user_id = auth.uid()
    ));

-- Create policies for timer_tasks
CREATE POLICY "Users can view their own timer tasks"
    ON public.timer_tasks FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own timer tasks"
    ON public.timer_tasks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own timer tasks"
    ON public.timer_tasks FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own timer tasks"
    ON public.timer_tasks FOR DELETE
    USING (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create updated_at triggers
CREATE TRIGGER handle_updated_at_habit_categories
    BEFORE UPDATE ON public.habit_categories
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at_habits
    BEFORE UPDATE ON public.habits
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at_goals
    BEFORE UPDATE ON public.goals
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at_milestones
    BEFORE UPDATE ON public.milestones
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at_entries
    BEFORE UPDATE ON public.entries
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at_timer_tasks
    BEFORE UPDATE ON public.timer_tasks
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();
