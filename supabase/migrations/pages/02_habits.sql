-- Habits Management
CREATE TABLE IF NOT EXISTS public.habits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly')),
    type TEXT CHECK (type IN ('boolean', 'numeric', 'timer', 'checklist')),
    category TEXT,
    streak INTEGER DEFAULT 0,
    progress INTEGER DEFAULT 0,
    last_completed TIMESTAMP WITH TIME ZONE,
    completed_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for habits
CREATE POLICY "Users can view their own habits"
    ON public.habits FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own habits"
    ON public.habits FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own habits"
    ON public.habits FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own habits"
    ON public.habits FOR DELETE
    USING (auth.uid() = user_id);

-- Create trigger for updating updated_at
CREATE TRIGGER update_habits_updated_at
    BEFORE UPDATE ON public.habits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create indices for better performance
CREATE INDEX habits_user_id_idx ON public.habits(user_id);
CREATE INDEX habits_frequency_idx ON public.habits(frequency);
CREATE INDEX habits_last_completed_idx ON public.habits(last_completed);

-- Create function to analyze habit patterns
CREATE OR REPLACE FUNCTION analyze_habit_patterns(user_id_param UUID)
RETURNS TABLE (
    habit_id UUID,
    title TEXT,
    current_frequency TEXT,
    suggested_frequency TEXT,
    best_time_of_day TEXT,
    success_rate FLOAT,
    suggested_changes TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    WITH habit_analysis AS (
        SELECT 
            h.id,
            h.title,
            h.frequency,
            h.last_completed,
            h.streak,
            h.progress,
            COUNT(*) FILTER (WHERE e.completed_at >= CURRENT_DATE - INTERVAL '30 days') as recent_completions,
            COUNT(*) FILTER (WHERE e.completed_at >= CURRENT_DATE - INTERVAL '7 days') as weekly_completions,
            MODE() WITHIN GROUP (ORDER BY EXTRACT(HOUR FROM e.completed_at)) as median_hour
        FROM public.habits h
        LEFT JOIN public.entries e ON e.habit_id = h.id
        WHERE h.user_id = user_id_param
        GROUP BY h.id, h.title, h.frequency, h.last_completed, h.streak, h.progress
    )
    SELECT 
        id,
        title,
        frequency as current_frequency,
        CASE 
            WHEN recent_completions < 5 AND frequency = 'daily' THEN 'weekly'
            WHEN recent_completions > 25 AND frequency = 'weekly' THEN 'daily'
            ELSE frequency
        END as suggested_frequency,
        CASE 
            WHEN median_hour BETWEEN 6 AND 10 THEN 'Morning (before 9 AM)'
            WHEN median_hour BETWEEN 15 AND 18 THEN 'Afternoon (9 AM - 5 PM)'
            ELSE 'Evening (after 5 PM)'
        END as best_time_of_day,
        CASE 
            WHEN recent_completions > 0 THEN 
                recent_completions::FLOAT / 
                CASE frequency 
                    WHEN 'daily' THEN 30
                    WHEN 'weekly' THEN 4
                    WHEN 'monthly' THEN 1
                    ELSE 30
                END
            ELSE 0
        END as success_rate,
        ARRAY_REMOVE(ARRAY[
            CASE WHEN recent_completions < 5 
                THEN 'Consider changing to weekly frequency to build consistency'
            END,
            CASE WHEN recent_completions > 25 
                THEN 'You''re consistent enough to increase to daily frequency'
            END,
            CASE WHEN streak < 3 AND progress < 50 
                THEN 'Break down this habit into smaller, more manageable steps'
            END,
            CASE WHEN last_completed < CURRENT_DATE - INTERVAL '7 days' 
                THEN 'Reactivate this habit by starting with a smaller goal'
            END
        ], NULL) as suggested_changes
    FROM habit_analysis;
END;
$$ LANGUAGE plpgsql;
