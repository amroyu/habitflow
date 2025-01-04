-- Entries Management
CREATE TABLE IF NOT EXISTS public.entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    habit_id UUID REFERENCES public.habits(id) ON DELETE CASCADE,
    goal_id UUID REFERENCES public.goals(id) ON DELETE CASCADE,
    note TEXT,
    value NUMERIC,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    CHECK (habit_id IS NOT NULL OR goal_id IS NOT NULL)
);

-- Enable Row Level Security
ALTER TABLE public.entries ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for entries
CREATE POLICY "Users can view their own entries"
    ON public.entries FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own entries"
    ON public.entries FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own entries"
    ON public.entries FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own entries"
    ON public.entries FOR DELETE
    USING (auth.uid() = user_id);

-- Create trigger for updating updated_at
CREATE TRIGGER update_entries_updated_at
    BEFORE UPDATE ON public.entries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create indices for better performance
CREATE INDEX entries_user_id_idx ON public.entries(user_id);
CREATE INDEX entries_habit_id_idx ON public.entries(habit_id);
CREATE INDEX entries_goal_id_idx ON public.entries(goal_id);
CREATE INDEX entries_completed_at_idx ON public.entries(completed_at);

-- Function to update habit streak on entry
CREATE OR REPLACE FUNCTION update_habit_streak()
RETURNS TRIGGER AS $$
DECLARE
    current_streak INTEGER;
    last_entry_date DATE;
BEGIN
    -- Get the last entry date before this one
    SELECT completed_at::DATE
    INTO last_entry_date
    FROM public.entries
    WHERE habit_id = NEW.habit_id
    AND completed_at < NEW.completed_at
    ORDER BY completed_at DESC
    LIMIT 1;

    -- If this is the first entry or there was a gap, start new streak
    IF last_entry_date IS NULL OR last_entry_date < CURRENT_DATE - INTERVAL '1 day' THEN
        current_streak := 1;
    ELSE
        -- Continue the streak
        SELECT streak + 1
        INTO current_streak
        FROM public.habits
        WHERE id = NEW.habit_id;
    END IF;

    -- Update the habit's streak
    UPDATE public.habits
    SET 
        streak = current_streak,
        last_completed = NEW.completed_at,
        completed_count = completed_count + 1
    WHERE id = NEW.habit_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating habit streak
CREATE TRIGGER update_habit_streak_trigger
    AFTER INSERT ON public.entries
    FOR EACH ROW
    WHEN (NEW.habit_id IS NOT NULL)
    EXECUTE FUNCTION update_habit_streak();
