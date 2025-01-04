-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types first
DO $$ BEGIN
    CREATE TYPE habit_type AS ENUM ('daily', 'weekly', 'monthly', 'yearly');
    CREATE TYPE goal_type AS ENUM ('short_term', 'medium_term', 'long_term');
    CREATE TYPE entry_content_type AS ENUM ('text', 'number', 'boolean', 'checklist');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create base tables first
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
    username text NULL,
    full_name text NULL,
    avatar_url text NULL,
    total_goals_completed INTEGER DEFAULT 0,
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT profiles_pkey PRIMARY KEY (id),
    CONSTRAINT profiles_username_key UNIQUE (username),
    CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.habits (
    id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
    user_id uuid NOT NULL,
    title text NOT NULL,
    description text NULL,
    type habit_type NOT NULL DEFAULT 'daily',
    frequency INTEGER DEFAULT 1,
    progress FLOAT DEFAULT 0,
    streak INTEGER DEFAULT 0,
    last_completed timestamp with time zone NULL,
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT habits_pkey PRIMARY KEY (id),
    CONSTRAINT habits_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.goals (
    id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
    user_id uuid NOT NULL,
    title text NOT NULL,
    description text NULL,
    type goal_type NOT NULL DEFAULT 'short_term',
    progress FLOAT DEFAULT 0,
    completed_at timestamp with time zone NULL,
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT goals_pkey PRIMARY KEY (id),
    CONSTRAINT goals_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.entries (
    id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
    user_id uuid NOT NULL,
    habit_id uuid NULL,
    goal_id uuid NULL,
    content_type entry_content_type NOT NULL,
    content jsonb NOT NULL,
    completed_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT entries_pkey PRIMARY KEY (id),
    CONSTRAINT entries_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
    CONSTRAINT entries_habit_id_fkey FOREIGN KEY (habit_id) REFERENCES public.habits(id) ON DELETE CASCADE,
    CONSTRAINT entries_goal_id_fkey FOREIGN KEY (goal_id) REFERENCES public.goals(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.milestones (
    id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
    goal_id uuid NOT NULL,
    user_id uuid NOT NULL,
    title text NOT NULL,
    description text NULL,
    completed_at timestamp with time zone NULL,
    due_date timestamp with time zone NULL,
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT milestones_pkey PRIMARY KEY (id),
    CONSTRAINT milestones_goal_id_fkey FOREIGN KEY (goal_id) REFERENCES public.goals(id) ON DELETE CASCADE,
    CONSTRAINT milestones_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.roadmap_milestones (
    id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
    goal_id uuid NOT NULL,
    user_id uuid NOT NULL,
    title text NOT NULL,
    description text NULL,
    completed_at timestamp with time zone NULL,
    due_date timestamp with time zone NULL,
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT roadmap_milestones_pkey PRIMARY KEY (id),
    CONSTRAINT roadmap_milestones_goal_id_fkey FOREIGN KEY (goal_id) REFERENCES public.goals(id) ON DELETE CASCADE,
    CONSTRAINT roadmap_milestones_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create indexes on base tables
CREATE INDEX IF NOT EXISTS idx_habits_user_id ON public.habits(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON public.goals(user_id);
CREATE INDEX IF NOT EXISTS idx_entries_user_id ON public.entries(user_id);
CREATE INDEX IF NOT EXISTS idx_entries_habit_id ON public.entries(habit_id);
CREATE INDEX IF NOT EXISTS idx_entries_goal_id ON public.entries(goal_id);
CREATE INDEX IF NOT EXISTS idx_entries_completed_at ON public.entries(completed_at);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_milestones ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own habits" ON public.habits;
DROP POLICY IF EXISTS "Users can insert own habits" ON public.habits;
DROP POLICY IF EXISTS "Users can update own habits" ON public.habits;
DROP POLICY IF EXISTS "Users can delete own habits" ON public.habits;
DROP POLICY IF EXISTS "Users can view own goals" ON public.goals;
DROP POLICY IF EXISTS "Users can insert own goals" ON public.goals;
DROP POLICY IF EXISTS "Users can update own goals" ON public.goals;
DROP POLICY IF EXISTS "Users can delete own goals" ON public.goals;
DROP POLICY IF EXISTS "Users can view own entries" ON public.entries;
DROP POLICY IF EXISTS "Users can insert own entries" ON public.entries;
DROP POLICY IF EXISTS "Users can update own entries" ON public.entries;
DROP POLICY IF EXISTS "Users can delete own entries" ON public.entries;
DROP POLICY IF EXISTS "Users can view own milestones" ON public.milestones;
DROP POLICY IF EXISTS "Users can insert own milestones" ON public.milestones;
DROP POLICY IF EXISTS "Users can update own milestones" ON public.milestones;
DROP POLICY IF EXISTS "Users can delete own milestones" ON public.milestones;
DROP POLICY IF EXISTS "Users can view own roadmap milestones" ON public.roadmap_milestones;
DROP POLICY IF EXISTS "Users can insert own roadmap milestones" ON public.roadmap_milestones;
DROP POLICY IF EXISTS "Users can update own roadmap milestones" ON public.roadmap_milestones;
DROP POLICY IF EXISTS "Users can delete own roadmap milestones" ON public.roadmap_milestones;

-- Create RLS policies
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (id = auth.uid());

CREATE POLICY "Users can view own habits"
    ON public.habits FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can insert own habits"
    ON public.habits FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own habits"
    ON public.habits FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can delete own habits"
    ON public.habits FOR DELETE
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can view own goals"
    ON public.goals FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can insert own goals"
    ON public.goals FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own goals"
    ON public.goals FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can delete own goals"
    ON public.goals FOR DELETE
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can view own entries"
    ON public.entries FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can insert own entries"
    ON public.entries FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own entries"
    ON public.entries FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can delete own entries"
    ON public.entries FOR DELETE
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can view own milestones"
    ON public.milestones FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can insert own milestones"
    ON public.milestones FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own milestones"
    ON public.milestones FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can delete own milestones"
    ON public.milestones FOR DELETE
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can view own roadmap milestones"
    ON public.roadmap_milestones FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can insert own roadmap milestones"
    ON public.roadmap_milestones FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own roadmap milestones"
    ON public.roadmap_milestones FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can delete own roadmap milestones"
    ON public.roadmap_milestones FOR DELETE
    TO authenticated
    USING (user_id = auth.uid());

-- Create triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_updated_at_trigger_habits
    BEFORE UPDATE ON public.habits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_updated_at_trigger_goals
    BEFORE UPDATE ON public.goals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_updated_at_trigger_entries
    BEFORE UPDATE ON public.entries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_updated_at_trigger_milestones
    BEFORE UPDATE ON public.milestones
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_updated_at_trigger_roadmap_milestones
    BEFORE UPDATE ON public.roadmap_milestones
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_updated_at_trigger_profiles
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to refresh user insights
CREATE OR REPLACE FUNCTION refresh_user_insights()
RETURNS TRIGGER AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY user_insights;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to refresh insights
CREATE TRIGGER refresh_insights_on_habit_change
    AFTER INSERT OR UPDATE OR DELETE ON public.habits
    FOR EACH STATEMENT
    EXECUTE FUNCTION refresh_user_insights();

CREATE TRIGGER refresh_insights_on_goal_change
    AFTER INSERT OR UPDATE OR DELETE ON public.goals
    FOR EACH STATEMENT
    EXECUTE FUNCTION refresh_user_insights();

CREATE TRIGGER refresh_insights_on_entry_change
    AFTER INSERT OR UPDATE OR DELETE ON public.entries
    FOR EACH STATEMENT
    EXECUTE FUNCTION refresh_user_insights();

-- Function to calculate streak
CREATE OR REPLACE FUNCTION calculate_streak(last_completed TIMESTAMPTZ, current_streak INTEGER)
RETURNS INTEGER AS $$
BEGIN
    IF last_completed IS NULL THEN
        RETURN 0;
    ELSIF last_completed >= CURRENT_DATE - INTERVAL '1 day' THEN
        RETURN current_streak + 1;
    ELSE
        RETURN 0;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to update goal progress based on milestones
CREATE OR REPLACE FUNCTION update_goal_progress()
RETURNS TRIGGER AS $$
BEGIN
    WITH milestone_stats AS (
        SELECT 
            goal_id,
            COUNT(*) AS total_milestones,
            COUNT(*) FILTER (WHERE completed_at IS NOT NULL) AS completed_milestones
        FROM public.milestones
        WHERE goal_id = NEW.goal_id
        GROUP BY goal_id
    )
    UPDATE public.goals
    SET 
        progress = CASE 
            WHEN ms.total_milestones > 0 
            THEN (ms.completed_milestones::float / ms.total_milestones::float) * 100
            ELSE progress
        END,
        completed_at = CASE 
            WHEN ms.total_milestones > 0 AND ms.completed_milestones = ms.total_milestones 
            THEN CURRENT_TIMESTAMP
            ELSE completed_at
        END
    FROM milestone_stats ms
    WHERE id = NEW.goal_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update roadmap progress based on milestones
CREATE OR REPLACE FUNCTION update_roadmap_progress()
RETURNS TRIGGER AS $$
BEGIN
    WITH milestone_stats AS (
        SELECT 
            roadmap_id,
            COUNT(*) AS total_milestones,
            COUNT(*) FILTER (WHERE completed_at IS NOT NULL) AS completed_milestones
        FROM public.roadmap_milestones
        WHERE roadmap_id = NEW.roadmap_id
        GROUP BY roadmap_id
    )
    UPDATE public.roadmaps
    SET 
        progress = CASE 
            WHEN ms.total_milestones > 0 
            THEN (ms.completed_milestones::float / ms.total_milestones::float) * 100
            ELSE progress
        END,
        status = CASE 
            WHEN ms.completed_milestones = 0 THEN 'not_started'
            WHEN ms.completed_milestones = ms.total_milestones THEN 'completed'
            ELSE 'in_progress'
        END
    FROM milestone_stats ms
    WHERE id = NEW.roadmap_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to increment total_goals_completed for user
CREATE OR REPLACE FUNCTION increment_user_goals_completed()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.completed_at IS NOT NULL AND (OLD IS NULL OR OLD.completed_at IS NULL) THEN
        UPDATE public.profiles
        SET total_goals_completed = total_goals_completed + 1
        WHERE id = NEW.user_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to get user's current streak for a habit
CREATE OR REPLACE FUNCTION get_habit_streak(habit_id UUID)
RETURNS INTEGER AS $$
DECLARE
    last_entry TIMESTAMPTZ;
    streak INTEGER;
BEGIN
    SELECT last_completed, streak 
    INTO last_entry, streak
    FROM public.habits 
    WHERE id = habit_id;
    
    RETURN calculate_streak(last_entry, streak);
END;
$$ LANGUAGE plpgsql;

-- Function to get user's stats
CREATE OR REPLACE FUNCTION get_user_stats(user_id_param UUID)
RETURNS TABLE (
    total_habits INTEGER,
    active_habits INTEGER,
    total_goals INTEGER,
    completed_goals INTEGER,
    total_entries INTEGER,
    streak_habits INTEGER,
    total_roadmaps INTEGER,
    completed_roadmaps INTEGER
) AS $$
BEGIN
    RETURN QUERY
    WITH stats AS (
        SELECT 
            (SELECT COUNT(*) FROM public.habits WHERE user_id = user_id_param) as total_habits,
            (SELECT COUNT(*) FROM public.habits WHERE user_id = user_id_param AND last_completed >= CURRENT_DATE - INTERVAL '1 day') as active_habits,
            (SELECT COUNT(*) FROM public.goals WHERE user_id = user_id_param) as total_goals,
            (SELECT COUNT(*) FROM public.goals WHERE user_id = user_id_param AND completed_at IS NOT NULL) as completed_goals,
            (SELECT COUNT(*) FROM public.entries WHERE user_id = user_id_param) as total_entries,
            (SELECT COUNT(*) FROM public.habits WHERE user_id = user_id_param AND streak > 0) as streak_habits,
            (SELECT COUNT(*) FROM public.roadmaps WHERE user_id = user_id_param) as total_roadmaps,
            (SELECT COUNT(*) FROM public.roadmaps WHERE user_id = user_id_param AND status = 'completed') as completed_roadmaps
    )
    SELECT * FROM stats;
END;
$$ LANGUAGE plpgsql;

-- Function to get recommended habits based on user's activity
CREATE OR REPLACE FUNCTION get_recommended_habits(user_id_param UUID)
RETURNS TABLE (
    habit_id UUID,
    title TEXT,
    popularity INTEGER
) AS $$
BEGIN
    RETURN QUERY
    WITH user_habits AS (
        SELECT title 
        FROM public.habits 
        WHERE user_id = user_id_param
    ),
    habit_stats AS (
        SELECT 
            h.id,
            h.title,
            COUNT(DISTINCT h.user_id) as popularity
        FROM public.habits h
        WHERE h.user_id != user_id_param
        AND NOT EXISTS (
            SELECT 1 FROM user_habits uh 
            WHERE uh.title ILIKE h.title
        )
        GROUP BY h.id, h.title
        ORDER BY popularity DESC
        LIMIT 10
    )
    SELECT * FROM habit_stats;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate milestone completion percentage
CREATE OR REPLACE FUNCTION calculate_milestone_completion(goal_id_param UUID)
RETURNS FLOAT AS $$
DECLARE
    total INTEGER;
    completed INTEGER;
BEGIN
    SELECT 
        COUNT(*),
        COUNT(*) FILTER (WHERE completed_at IS NOT NULL)
    INTO total, completed
    FROM public.milestones
    WHERE goal_id = goal_id_param;
    
    IF total = 0 THEN
        RETURN 0;
    END IF;
    
    RETURN (completed::FLOAT / total::FLOAT) * 100;
END;
$$ LANGUAGE plpgsql;

-- Statistical functions

-- Function to calculate user's success rate
CREATE OR REPLACE FUNCTION calculate_user_success_rate(user_id_param UUID)
RETURNS TABLE (
    habit_completion_rate FLOAT,
    goal_completion_rate FLOAT,
    milestone_completion_rate FLOAT,
    average_streak FLOAT,
    consistency_score FLOAT
) AS $$
BEGIN
    RETURN QUERY
    WITH stats AS (
        SELECT
            (SELECT COUNT(*) FROM public.habits WHERE user_id = user_id_param) as total_habits,
            (SELECT COUNT(*) FROM public.habits WHERE user_id = user_id_param AND last_completed >= CURRENT_DATE - INTERVAL '7 days') as active_habits,
            (SELECT COUNT(*) FROM public.goals WHERE user_id = user_id_param) as total_goals,
            (SELECT COUNT(*) FROM public.goals WHERE user_id = user_id_param AND completed_at IS NOT NULL) as completed_goals,
            (SELECT COUNT(*) FROM public.entries WHERE user_id = user_id_param) as total_entries,
            (SELECT COUNT(DISTINCT e.completed_at::DATE) FROM public.entries e WHERE e.user_id = user_id_param) as active_days,
            (SELECT COUNT(*) FROM public.habits WHERE user_id = user_id_param AND streak > 0) as streak_habits,
            (SELECT COUNT(*) FROM public.roadmaps WHERE user_id = user_id_param) as total_roadmaps,
            (SELECT COUNT(*) FROM public.roadmaps WHERE user_id = user_id_param AND status = 'completed') as completed_roadmaps
    )
    SELECT 
        (active_habits::FLOAT / total_habits::FLOAT) * 100 as habit_rate,
        (completed_goals::FLOAT / total_goals::FLOAT) * 100 as goal_rate,
        (completed_roadmaps::FLOAT / total_roadmaps::FLOAT) * 100 as milestone_rate,
        (SELECT AVG(streak) FROM public.habits WHERE user_id = user_id_param AND streak > 0) as avg_streak,
        (active_days::FLOAT / 30) * 100 as consistency
    FROM stats;
END;
$$ LANGUAGE plpgsql;

-- Function to get user's progress trends
CREATE OR REPLACE FUNCTION get_user_progress_trends(user_id_param UUID, days INTEGER DEFAULT 30)
RETURNS TABLE (
    date DATE,
    habits_completed INTEGER,
    goals_completed INTEGER,
    entries_made INTEGER,
    average_progress FLOAT
) AS $$
BEGIN
    RETURN QUERY
    WITH RECURSIVE dates AS (
        SELECT CURRENT_DATE - (days - 1) * INTERVAL '1 day' as date
        UNION ALL
        SELECT date + INTERVAL '1 day'
        FROM dates
        WHERE date < CURRENT_DATE
    )
    SELECT 
        d.date::DATE,
        COUNT(DISTINCT h.id) FILTER (WHERE h.last_completed::DATE = d.date::DATE) as habits_completed,
        COUNT(DISTINCT g.id) FILTER (WHERE g.completed_at::DATE = d.date::DATE) as goals_completed,
        COUNT(DISTINCT e.id) FILTER (WHERE e.completed_at::DATE = d.date::DATE) as entries_made,
        COALESCE(
            (
                AVG(h.progress) FILTER (WHERE h.last_completed::DATE = d.date::DATE) +
                AVG(g.progress) FILTER (WHERE g.completed_at::DATE = d.date::DATE)
            ) / 2,
            0
        ) as average_progress
    FROM dates d
    LEFT JOIN public.habits h ON h.user_id = user_id_param
    LEFT JOIN public.goals g ON g.user_id = user_id_param
    LEFT JOIN public.entries e ON e.user_id = user_id_param
    GROUP BY d.date
    ORDER BY d.date;
END;
$$ LANGUAGE plpgsql;

-- Advanced recommendation algorithms

-- Function to get personalized habit recommendations
CREATE OR REPLACE FUNCTION get_personalized_recommendations(user_id_param UUID)
RETURNS TABLE (
    habit_id UUID,
    title TEXT,
    category_name TEXT,
    similarity_score FLOAT,
    success_rate FLOAT,
    recommended_frequency TEXT
) AS $$
BEGIN
    RETURN QUERY
    WITH user_habits AS (
        SELECT 
            h.id,
            h.title,
            h.type,
            h.frequency,
            CASE 
                WHEN h.last_completed >= CURRENT_DATE - INTERVAL '7 days' THEN true 
                ELSE false 
            END as is_active
        FROM public.habits h
        WHERE h.user_id = user_id_param
    ),
    user_preferences AS (
        SELECT 
            COUNT(*) as total_habits,
            COUNT(*) FILTER (WHERE is_active) as active_habits,
            MODE() WITHIN GROUP (ORDER BY frequency) as preferred_frequency
        FROM user_habits
    ),
    similar_users AS (
        SELECT 
            h.user_id,
            COUNT(*)::FLOAT / GREATEST(COUNT(DISTINCT h.id), 1)::FLOAT as similarity_score
        FROM public.habits h
        WHERE h.user_id != user_id_param
        GROUP BY h.user_id
        HAVING COUNT(*) > 0
    ),
    recommended_habits AS (
        SELECT 
            h.id,
            h.title,
            COUNT(DISTINCT h.user_id) as popularity,
            su.similarity_score,
            COUNT(*) FILTER (WHERE h2.last_completed >= CURRENT_DATE - INTERVAL '7 days')::FLOAT / 
            GREATEST(COUNT(*), 1)::FLOAT as success_rate,
            MODE() WITHIN GROUP (ORDER BY h2.frequency) as recommended_frequency
        FROM public.habits h
        JOIN similar_users su ON h.user_id = su.user_id
        LEFT JOIN public.habits h2 ON h.id = h2.id
        WHERE NOT EXISTS (
            SELECT 1 FROM public.habits uh 
            WHERE uh.user_id = user_id_param AND uh.title ILIKE h.title
        )
        GROUP BY h.id, h.title, su.similarity_score
        HAVING COUNT(*) >= 3
    )
    SELECT *
    FROM recommended_habits
    ORDER BY 
        similarity_score * 0.4 +
        success_rate * 0.6 DESC
    LIMIT 10;
END;
$$ LANGUAGE plpgsql;

-- Function to analyze habit patterns and suggest improvements
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
            hp.preferred_hour,
            hp.median_hour,
            e.completed_at,
            COUNT(*) FILTER (WHERE e.completed_at >= CURRENT_DATE - INTERVAL '30 days') as recent_completions,
            COUNT(*) FILTER (WHERE e.completed_at >= CURRENT_DATE - INTERVAL '7 days') as weekly_completions
        FROM public.habits h
        JOIN habit_patterns hp ON h.id = hp.habit_id
        LEFT JOIN public.entries e ON e.habit_id = h.id
        WHERE h.user_id = user_id_param
        GROUP BY h.id, h.title, hp.preferred_hour, hp.median_hour, e.completed_at
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

-- Function to analyze user engagement patterns
CREATE OR REPLACE FUNCTION analyze_user_engagement(user_id_param UUID)
RETURNS TABLE (
    engagement_score FLOAT,
    consistency_score FLOAT,
    completion_rate FLOAT,
    peak_activity_days TEXT[],
    peak_activity_hours INTEGER[],
    average_session_length INTERVAL,
    completion_streak INTEGER,
    abandonment_risk FLOAT,
    suggested_interventions TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    WITH user_activity AS (
        SELECT
            e.completed_at,
            e.content,
            EXTRACT(DOW FROM e.completed_at) as day_of_week,
            EXTRACT(HOUR FROM e.completed_at) as hour_of_day,
            h.id as habit_id,
            h.title as habit_title,
            h.frequency,
            h.last_completed,
            h.streak,
            g.id as goal_id,
            g.progress as goal_progress
        FROM public.entries e
        LEFT JOIN public.habits h ON e.habit_id = h.id
        LEFT JOIN public.goals g ON e.goal_id = g.id
        WHERE e.user_id = user_id_param
        AND e.completed_at >= CURRENT_DATE - INTERVAL '30 days'
    ),
    daily_stats AS (
        SELECT
            completed_at::DATE,
            COUNT(*) as daily_entries,
            COUNT(DISTINCT habit_id) as habits_completed,
            COUNT(DISTINCT goal_id) as goals_worked_on,
            MAX(completed_at) - MIN(completed_at) as session_length
        FROM user_activity
        GROUP BY completed_at::DATE
    ),
    peak_times AS (
        SELECT 
            ARRAY_AGG(DISTINCT day_of_week::TEXT ORDER BY COUNT(*) DESC) FILTER (WHERE COUNT(*) > 5) as active_days,
            ARRAY_AGG(DISTINCT hour_of_day ORDER BY COUNT(*) DESC) FILTER (WHERE COUNT(*) > 3) as active_hours
        FROM user_activity
    ),
    engagement_metrics AS (
        SELECT
            (COUNT(DISTINCT completed_at::DATE)::FLOAT / 30) * 100 as engagement_score,
            (AVG(daily_entries)::FLOAT / GREATEST(COUNT(DISTINCT habit_id), 1)) * 100 as consistency_score,
            (COUNT(*) FILTER (WHERE habits_completed > 0)::FLOAT / GREATEST(COUNT(*), 1)) * 100 as completion_rate,
            MAX(session_length) as max_session,
            COUNT(DISTINCT completed_at::DATE) FILTER (WHERE daily_entries = 0) as zero_activity_days
        FROM daily_stats
    )
    SELECT
        em.engagement_score,
        em.consistency_score,
        em.completion_rate,
        pt.active_days,
        pt.active_hours,
        em.max_session,
        MAX(ua.streak),
        CASE 
            WHEN em.zero_activity_days > 15 THEN 0.8
            WHEN em.engagement_score < 30 THEN 0.7
            WHEN em.consistency_score < 40 THEN 0.4
            ELSE 0.1
        END as abandonment_risk,
        ARRAY_REMOVE(ARRAY[
            CASE WHEN em.engagement_score < 30 
                THEN 'Set smaller, achievable daily goals to build momentum'
            END,
            CASE WHEN em.consistency_score < 40 
                THEN 'Try focusing on fewer habits but maintain higher consistency'
            END,
            CASE WHEN em.zero_activity_days > 7 
                THEN 'Schedule specific times for habit completion'
            END,
            CASE WHEN em.max_session < INTERVAL '5 minutes'
                THEN 'Increase engagement time gradually'
            END
        ], NULL) as interventions
    FROM engagement_metrics em
    CROSS JOIN peak_times pt
    LEFT JOIN user_activity ua ON true
    GROUP BY 
        em.engagement_score, 
        em.consistency_score, 
        em.completion_rate,
        pt.active_days,
        pt.active_hours,
        em.max_session,
        em.zero_activity_days;
END;
$$ LANGUAGE plpgsql;

-- Function to analyze habit correlations and dependencies
CREATE OR REPLACE FUNCTION analyze_habit_correlations(user_id_param UUID)
RETURNS TABLE (
    primary_habit_id UUID,
    primary_habit_title TEXT,
    correlated_habit_id UUID,
    correlated_habit_title TEXT,
    correlation_strength FLOAT,
    success_impact FLOAT,
    suggested_sequence TEXT
) AS $$
BEGIN
    RETURN QUERY
    WITH habit_pairs AS (
        SELECT
            e1.habit_id as first_habit,
            e2.habit_id as second_habit,
            e1.completed_at as first_time,
            e2.completed_at as second_time,
            h1.title as first_title,
            h2.title as second_title
        FROM public.entries e1
        JOIN public.entries e2 ON e1.user_id = e2.user_id
            AND e1.completed_at < e2.completed_at
            AND e2.completed_at - e1.completed_at < INTERVAL '2 hours'
        JOIN public.habits h1 ON e1.habit_id = h1.id
        JOIN public.habits h2 ON e2.habit_id = h2.id
        WHERE e1.user_id = user_id_param
        AND e1.completed_at >= CURRENT_DATE - INTERVAL '30 days'
    ),
    habit_correlations AS (
        SELECT
            first_habit,
            first_title,
            second_habit,
            second_title,
            COUNT(*) as joint_completions,
            AVG(EXTRACT(EPOCH FROM (second_time - first_time))) as avg_time_between,
            CORR(
                EXTRACT(EPOCH FROM first_time),
                EXTRACT(EPOCH FROM second_time)
            ) as time_correlation
        FROM habit_pairs
        GROUP BY first_habit, second_habit, first_title, second_title
        HAVING COUNT(*) >= 5
    )
    SELECT
        first_habit,
        first_title,
        second_habit,
        second_title,
        (joint_completions * time_correlation)::FLOAT as correlation_strength,
        (joint_completions * time_correlation * 0.5)::FLOAT as success_impact,
        CASE
            WHEN avg_time_between < 900 THEN first_title || ' → ' || second_title
            ELSE second_title || ' → ' || first_title
        END as sequence
    FROM habit_correlations
    WHERE (joint_completions * time_correlation)::FLOAT >= 0.3
    ORDER BY correlation_strength DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to generate personalized daily schedule
CREATE OR REPLACE FUNCTION generate_optimal_schedule(user_id_param UUID)
RETURNS TABLE (
    time_slot TIME,
    habit_id UUID,
    habit_title TEXT,
    estimated_duration INTERVAL,
    success_probability FLOAT,
    energy_level TEXT,
    previous_success_rate FLOAT
) AS $$
BEGIN
    RETURN QUERY
    WITH user_patterns AS (
        SELECT
            h.id,
            h.title,
            hp.preferred_hour,
            hp.median_hour,
            e.completed_at,
            COUNT(*) FILTER (WHERE e.completed_at >= CURRENT_DATE - INTERVAL '30 days') as recent_completions,
            COUNT(*) FILTER (WHERE e.completed_at >= CURRENT_DATE - INTERVAL '7 days') as weekly_completions
        FROM public.habits h
        JOIN habit_patterns hp ON h.id = hp.habit_id
        LEFT JOIN public.entries e ON e.habit_id = h.id
        WHERE h.user_id = user_id_param
        GROUP BY h.id, h.title, hp.preferred_hour, hp.median_hour, e.completed_at
    ),
    time_slots AS (
        SELECT generate_series(
            '06:00:00'::TIME,
            '22:00:00'::TIME,
            '30 minutes'::INTERVAL
        ) as slot
    )
    SELECT
        t.slot,
        up.id,
        up.title,
        INTERVAL '30 minutes',
        CASE
            WHEN EXTRACT(HOUR FROM t.slot) = up.preferred_hour THEN 0.9
            WHEN ABS(EXTRACT(HOUR FROM t.slot) - up.preferred_hour) <= 1 THEN 0.7
            ELSE 0.5
        END as success_prob,
        CASE
            WHEN EXTRACT(HOUR FROM t.slot) BETWEEN 6 AND 10 THEN 'High'
            WHEN EXTRACT(HOUR FROM t.slot) BETWEEN 15 AND 18 THEN 'Medium'
            ELSE 'Low'
        END as energy,
        COALESCE(up.weekly_completions::FLOAT / 7, 0) as prev_success
    FROM time_slots t
    CROSS JOIN user_patterns up
    WHERE NOT EXISTS (
        SELECT 1
        FROM public.entries e
        WHERE e.habit_id = up.id
        AND e.completed_at::DATE = CURRENT_DATE
    )
    ORDER BY success_prob DESC, prev_success DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to suggest habit combinations
CREATE OR REPLACE FUNCTION suggest_habit_stacks(user_id_param UUID)
RETURNS TABLE (
    habit_ids UUID[],
    habit_titles TEXT[],
    synergy_score FLOAT,
    optimal_sequence TEXT,
    estimated_duration INTERVAL,
    best_time_window TSRANGE,
    success_probability FLOAT
) AS $$
BEGIN
    RETURN QUERY
    WITH habit_pairs AS (
        SELECT 
            h1.id as habit1_id,
            h2.id as habit2_id,
            h1.title as habit1_title,
            h2.title as habit2_title,
            COUNT(*) as joint_completions,
            AVG(EXTRACT(EPOCH FROM (e2.completed_at - e1.completed_at))) as avg_time_between,
            CASE 
                WHEN ABS(EXTRACT(EPOCH FROM (e2.completed_at - e1.completed_at))) <= 3600 THEN 1.0
                WHEN ABS(EXTRACT(EPOCH FROM (e2.completed_at - e1.completed_at))) <= 7200 THEN 0.8
                WHEN ABS(EXTRACT(EPOCH FROM (e2.completed_at - e1.completed_at))) <= 14400 THEN 0.6
                WHEN ABS(EXTRACT(EPOCH FROM (e2.completed_at - e1.completed_at))) <= 28800 THEN 0.4
                ELSE 0.2
            END as time_correlation
        FROM public.habits h1
        JOIN public.entries e1 ON e1.habit_id = h1.id
        JOIN public.entries e2 ON e2.user_id = e1.user_id 
            AND e2.completed_at > e1.completed_at 
            AND e2.completed_at <= e1.completed_at + INTERVAL '24 hours'
        JOIN public.habits h2 ON h2.id = e2.habit_id AND h2.id != h1.id
        WHERE h1.user_id = user_id_param
        GROUP BY h1.id, h2.id, h1.title, h2.title
        HAVING COUNT(*) >= 3
    )
    SELECT
        ARRAY[habit1_id, habit2_id],
        ARRAY[habit1_title, habit2_title],
        (joint_completions * time_correlation)::FLOAT as synergy,
        CASE 
            WHEN avg_time_between < 900 THEN habit1_title || ' → ' || habit2_title
            ELSE habit2_title || ' → ' || habit1_title
        END,
        (avg_time_between || ' seconds')::INTERVAL,
        tsrange(
            CURRENT_DATE + INTERVAL '6 hours',
            CURRENT_DATE + INTERVAL '22 hours'
        ),
        GREATEST(0.3, LEAST(0.9, (joint_completions / 30.0)))
    FROM habit_pairs
    ORDER BY synergy DESC;
END;
$$ LANGUAGE plpgsql;

-- Additional Validation Rules

-- Remove problematic CHECK constraints
ALTER TABLE public.habits
    DROP CONSTRAINT IF EXISTS valid_completion_window;

ALTER TABLE public.goals
    DROP CONSTRAINT IF EXISTS valid_milestone_distribution;

-- Create trigger function for validating streak calculation
CREATE OR REPLACE FUNCTION validate_streak_calculation()
RETURNS TRIGGER AS $$
DECLARE
    actual_streak INTEGER;
BEGIN
    -- Calculate the actual streak
    SELECT COUNT(DISTINCT date_trunc('day', completed_at))
    INTO actual_streak
    FROM public.entries
    WHERE habit_id = NEW.id
    AND completed_at >= CURRENT_DATE - (NEW.streak || ' days')::INTERVAL;

    -- Validate the streak calculation
    IF NEW.streak != actual_streak THEN
        -- Instead of raising an exception, update the streak to the correct value
        NEW.streak := actual_streak;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for habits table
DROP TRIGGER IF EXISTS validate_streak_trigger ON public.habits;
CREATE TRIGGER validate_streak_trigger
    BEFORE INSERT OR UPDATE ON public.habits
    FOR EACH ROW
    EXECUTE FUNCTION validate_streak_calculation();

-- Create trigger function for validating progress calculation
CREATE OR REPLACE FUNCTION validate_progress_calculation()
RETURNS TRIGGER AS $$
DECLARE
    total_milestones INTEGER;
    completed_milestones INTEGER;
    calculated_progress INTEGER;
BEGIN
    -- Get milestone counts
    SELECT 
        COUNT(*),
        COUNT(*) FILTER (WHERE completed_at IS NOT NULL)
    INTO total_milestones, completed_milestones
    FROM public.milestones
    WHERE goal_id = NEW.id;

    -- Calculate the actual progress
    IF total_milestones = 0 THEN
        calculated_progress := 0;
    ELSE
        calculated_progress := (completed_milestones * 100 / total_milestones);
    END IF;

    -- Update progress if it doesn't match
    IF NEW.progress != calculated_progress THEN
        NEW.progress := calculated_progress;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for goals table
DROP TRIGGER IF EXISTS validate_progress_trigger ON public.goals;
CREATE TRIGGER validate_progress_trigger
    BEFORE INSERT OR UPDATE ON public.goals
    FOR EACH ROW
    EXECUTE FUNCTION validate_progress_calculation();

-- Create trigger function for updating habit streak on entry
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
    SET streak = current_streak,
        last_completed = NEW.completed_at
    WHERE id = NEW.habit_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for entries table
DROP TRIGGER IF EXISTS update_habit_streak_trigger ON public.entries;
CREATE TRIGGER update_habit_streak_trigger
    AFTER INSERT ON public.entries
    FOR EACH ROW
    WHEN (NEW.habit_id IS NOT NULL)
    EXECUTE FUNCTION update_habit_streak();

-- Function to validate milestone dependencies
CREATE OR REPLACE FUNCTION validate_milestone_dependencies()
RETURNS TRIGGER AS $$
BEGIN
    -- Check for circular dependencies
    IF EXISTS (
        WITH RECURSIVE dependency_chain AS (
            -- Base case: direct dependencies
            SELECT m.id, m.depends_on, 1 as depth
            FROM public.milestones m
            WHERE m.id = NEW.id
            
            UNION ALL
            
            -- Recursive case: dependencies of dependencies
            SELECT m.id, m.depends_on, dc.depth + 1
            FROM public.milestones m
            JOIN dependency_chain dc ON m.id = ANY(dc.depends_on)
            WHERE dc.depth < 100  -- Prevent infinite recursion
        )
        SELECT 1 FROM dependency_chain
        WHERE NEW.id = ANY(depends_on)
    ) THEN
        RAISE EXCEPTION 'Circular dependency detected in milestone dependencies';
    END IF;

    -- Check that all dependencies belong to the same goal
    IF NEW.depends_on IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.milestones m
        WHERE m.id = ANY(NEW.depends_on)
        AND m.goal_id != NEW.goal_id
    ) THEN
        RAISE EXCEPTION 'All milestone dependencies must belong to the same goal';
    END IF;

    -- Check that dependent milestones have earlier or equal due dates
    IF NEW.depends_on IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.milestones m
        WHERE m.id = ANY(NEW.depends_on)
        AND m.due_date > NEW.due_date
    ) THEN
        RAISE EXCEPTION 'Dependent milestones must be scheduled before or on the same day as their dependencies';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for milestone dependency validation
DROP TRIGGER IF EXISTS validate_milestone_dependencies_trigger ON public.milestones;
CREATE TRIGGER validate_milestone_dependencies_trigger
    BEFORE INSERT OR UPDATE ON public.milestones
    FOR EACH ROW
    EXECUTE FUNCTION validate_milestone_dependencies();

-- Function to update goal progress when milestones change
CREATE OR REPLACE FUNCTION update_goal_progress()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.goals g
    SET progress = (
        SELECT 
            COALESCE(
                ROUND(
                    COUNT(*) FILTER (WHERE completed_at IS NOT NULL)::FLOAT / 
                    NULLIF(COUNT(*), 0) * 100
                ),
                0
            )::INTEGER
        FROM public.milestones m
        WHERE m.goal_id = g.id
    )
    WHERE g.id = CASE
        WHEN TG_OP = 'DELETE' THEN OLD.goal_id
        ELSE NEW.goal_id
    END;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for goal progress updates
DROP TRIGGER IF EXISTS update_goal_progress_trigger ON public.milestones;
CREATE TRIGGER update_goal_progress_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.milestones
    FOR EACH ROW
    EXECUTE FUNCTION update_goal_progress();

-- Advanced Analytics Functions

-- Function to analyze habit patterns and provide insights
CREATE OR REPLACE FUNCTION analyze_habit_patterns(user_id_param UUID)
RETURNS TABLE (
    habit_id UUID,
    title TEXT,
    completion_rate FLOAT,
    optimal_time_window TSRANGE,
    weekday_preference INTEGER[],
    consistency_score INTEGER,
    suggested_improvements TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    WITH habit_stats AS (
        SELECT
            h.id,
            h.title,
            COUNT(*) FILTER (WHERE e.completed_at >= CURRENT_DATE - INTERVAL '30 days') as monthly_entries,
            COUNT(DISTINCT e.completed_at::DATE) FILTER (WHERE e.completed_at >= CURRENT_DATE - INTERVAL '30 days') as active_days,
            MODE() WITHIN GROUP (ORDER BY EXTRACT(HOUR FROM e.completed_at)) as preferred_hour,
            ARRAY_AGG(DISTINCT EXTRACT(DOW FROM e.completed_at)::INTEGER) as active_weekdays,
            VARIANCE(EXTRACT(EPOCH FROM e.completed_at)) as timing_variance
        FROM public.habits h
        LEFT JOIN public.entries e ON e.habit_id = h.id
        WHERE h.user_id = user_id_param
        GROUP BY h.id, h.title
    )
    SELECT
        id,
        title,
        ROUND((active_days::FLOAT / 30) * 100, 2) as completion_rate,
        tsrange(
            CURRENT_DATE + (preferred_hour || ' hours')::INTERVAL - INTERVAL '1 hour',
            CURRENT_DATE + (preferred_hour || ' hours')::INTERVAL + INTERVAL '1 hour'
        ) as optimal_window,
        active_weekdays,
        CASE
            WHEN timing_variance < 3600 THEN 100
            WHEN timing_variance < 7200 THEN 80
            WHEN timing_variance < 14400 THEN 60
            WHEN timing_variance < 28800 THEN 40
            ELSE 20
        END as consistency_score,
        ARRAY[
            CASE 
                WHEN active_days < 15 THEN 'Increase completion frequency'
                WHEN timing_variance > 14400 THEN 'Try to maintain consistent timing'
                WHEN array_length(active_weekdays, 1) < 5 THEN 'Add more active days'
                ELSE 'Maintain current routine'
            END,
            CASE
                WHEN preferred_hour BETWEEN 5 AND 9 THEN 'Good morning routine'
                WHEN preferred_hour BETWEEN 17 AND 21 THEN 'Good evening routine'
                ELSE 'Consider optimal time of day'
            END
        ]
    FROM habit_stats;
END;
$$ LANGUAGE plpgsql;

-- Function to analyze habit chains and suggest optimal combinations
CREATE OR REPLACE FUNCTION analyze_habit_chains(user_id_param UUID)
RETURNS TABLE (
    chain_id INTEGER,
    habits TEXT[],
    success_rate FLOAT,
    average_completion_time INTERVAL,
    optimal_start_time TIME,
    chain_strength FLOAT,
    break_risk FLOAT,
    suggested_improvements TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    WITH habit_sequences AS (
        SELECT
            e1.habit_id as first_habit,
            e2.habit_id as second_habit,
            e1.completed_at as first_time,
            e2.completed_at as second_time,
            h1.title as first_title,
            h2.title as second_title
        FROM public.entries e1
        JOIN public.entries e2 ON e1.user_id = e2.user_id
            AND e1.completed_at < e2.completed_at
            AND e2.completed_at - e1.completed_at < INTERVAL '2 hours'
        JOIN public.habits h1 ON e1.habit_id = h1.id
        JOIN public.habits h2 ON e2.habit_id = h2.id
        WHERE e1.user_id = user_id_param
        AND e1.completed_at >= CURRENT_DATE - INTERVAL '30 days'
    ),
    habit_chains AS (
        SELECT
            DENSE_RANK() OVER (ORDER BY first_habit) as chain_id,
            ARRAY_AGG(DISTINCT first_title || ' → ' || second_title) as habit_sequence,
            COUNT(*) as occurrence_count,
            AVG(EXTRACT(EPOCH FROM (second_time - first_time))) as avg_completion_seconds,
            MODE() WITHIN GROUP (ORDER BY EXTRACT(HOUR FROM first_time)) as typical_start_hour,
            COUNT(*) FILTER (WHERE first_time::DATE = second_time::DATE)::FLOAT / COUNT(*) as same_day_ratio
        FROM habit_sequences
        GROUP BY first_habit
        HAVING COUNT(*) >= 5
    )
    SELECT
        chain_id,
        habit_sequence,
        occurrence_count::FLOAT / 30 as success_rate,
        (avg_completion_seconds || ' seconds')::INTERVAL as completion_time,
        (typical_start_hour || ':00:00')::TIME as start_time,
        same_day_ratio as chain_strength,
        CASE
            WHEN same_day_ratio < 0.5 THEN 0.8
            WHEN occurrence_count < 10 THEN 0.6
            ELSE 0.3
        END as break_risk,
        ARRAY[
            CASE 
                WHEN same_day_ratio < 0.5 THEN 'Try to complete these habits on the same day'
                ELSE 'Current chain is working well'
            END,
            CASE 
                WHEN occurrence_count < 10 THEN 'Increase chain consistency'
                ELSE 'Maintain current frequency'
            END
        ] as improvements
    FROM habit_chains;
END;
$$ LANGUAGE plpgsql;

-- Function to predict habit completion likelihood
CREATE OR REPLACE FUNCTION predict_habit_completion(user_id_param UUID)
RETURNS TABLE (
    habit_id UUID,
    habit_title TEXT,
    completion_probability FLOAT,
    best_time_window TSRANGE,
    success_factors TEXT[],
    risk_factors TEXT[],
    recommended_actions TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    WITH habit_metrics AS (
        SELECT
            h.id,
            h.title,
            h.frequency,
            COUNT(*) FILTER (WHERE e.completed_at >= CURRENT_DATE - INTERVAL '7 days') as recent_completions,
            COUNT(*) FILTER (WHERE e.completed_at >= CURRENT_DATE - INTERVAL '30 days') as monthly_completions,
            MODE() WITHIN GROUP (ORDER BY EXTRACT(HOUR FROM e.completed_at)) as preferred_hour,
            percentile_cont(0.5) WITHIN GROUP (ORDER BY EXTRACT(HOUR FROM e.completed_at)) as median_hour,
            VARIANCE(EXTRACT(HOUR FROM e.completed_at)) as time_variance,
            COUNT(DISTINCT e.completed_at::DATE) FILTER (WHERE e.completed_at >= CURRENT_DATE - INTERVAL '30 days') as active_days,
            MAX(e.completed_at) as last_completion
        FROM public.habits h
        LEFT JOIN public.entries e ON e.habit_id = h.id
        WHERE h.user_id = user_id_param
        GROUP BY h.id, h.title, h.frequency
    )
    SELECT
        id,
        title,
        CASE
            WHEN recent_completions >= 5 THEN 0.9
            WHEN monthly_completions >= 15 THEN 0.7
            WHEN active_days >= 10 THEN 0.5
            ELSE 0.3
        END as probability,
        tsrange(
            (CURRENT_DATE + (preferred_hour || ' hours')::INTERVAL - INTERVAL '1 hour'),
            (CURRENT_DATE + (preferred_hour || ' hours')::INTERVAL + INTERVAL '1 hour')
        ) as time_window,
        ARRAY[
            CASE WHEN recent_completions >= 5 THEN 'Strong recent performance' END,
            CASE WHEN time_variance < 4 THEN 'Consistent timing' END,
            CASE WHEN active_days >= 15 THEN 'Good monthly activity' END
        ] as success_factors,
        ARRAY[
            CASE WHEN recent_completions < 3 THEN 'Low recent activity' END,
            CASE WHEN time_variance > 8 THEN 'Inconsistent timing' END,
            CASE WHEN CURRENT_DATE - last_completion::DATE > 7 THEN 'Recent inactivity' END
        ] as risks,
        ARRAY[
            CASE 
                WHEN recent_completions < 3 THEN 'Focus on rebuilding the streak'
                WHEN time_variance > 8 THEN 'Try to maintain consistent timing'
                ELSE 'Maintain current routine'
            END
        ] as actions
    FROM habit_metrics;
END;
$$ LANGUAGE plpgsql;

-- Add RLS policies for all tables
ALTER TABLE public.entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.widgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own habits" ON public.habits;
DROP POLICY IF EXISTS "Users can create own habits" ON public.habits;
DROP POLICY IF EXISTS "Users can update own habits" ON public.habits;
DROP POLICY IF EXISTS "Users can delete own habits" ON public.habits;
DROP POLICY IF EXISTS "Users can view own goals" ON public.goals;
DROP POLICY IF EXISTS "Users can create own goals" ON public.goals;
DROP POLICY IF EXISTS "Users can update own goals" ON public.goals;
DROP POLICY IF EXISTS "Users can delete own goals" ON public.goals;
DROP POLICY IF EXISTS "Users can view own entries" ON public.entries;
DROP POLICY IF EXISTS "Users can create own entries" ON public.entries;
DROP POLICY IF EXISTS "Users can update own entries" ON public.entries;
DROP POLICY IF EXISTS "Users can delete own entries" ON public.entries;
DROP POLICY IF EXISTS "Users can view own widgets" ON public.widgets;
DROP POLICY IF EXISTS "Users can create own widgets" ON public.widgets;
DROP POLICY IF EXISTS "Users can update own widgets" ON public.widgets;
DROP POLICY IF EXISTS "Users can delete own widgets" ON public.widgets;
DROP POLICY IF EXISTS "Users can view own milestones" ON public.milestones;
DROP POLICY IF EXISTS "Users can create own milestones" ON public.milestones;
DROP POLICY IF EXISTS "Users can update own milestones" ON public.milestones;
DROP POLICY IF EXISTS "Users can delete own milestones" ON public.milestones;

-- Profiles policies
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (id = auth.uid());

CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (id = auth.uid());

-- Habits policies
CREATE POLICY "Users can view own habits"
    ON public.habits FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can create own habits"
    ON public.habits FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own habits"
    ON public.habits FOR UPDATE
    USING (user_id = auth.uid());

CREATE POLICY "Users can delete own habits"
    ON public.habits FOR DELETE
    USING (user_id = auth.uid());

-- Goals policies
CREATE POLICY "Users can view own goals"
    ON public.goals FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can create own goals"
    ON public.goals FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own goals"
    ON public.goals FOR UPDATE
    USING (user_id = auth.uid());

CREATE POLICY "Users can delete own goals"
    ON public.goals FOR DELETE
    USING (user_id = auth.uid());

-- Entries policies
CREATE POLICY "Users can view own entries"
    ON public.entries FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can create own entries"
    ON public.entries FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own entries"
    ON public.entries FOR UPDATE
    USING (user_id = auth.uid());

CREATE POLICY "Users can delete own entries"
    ON public.entries FOR DELETE
    USING (user_id = auth.uid());

-- Widgets policies
CREATE POLICY "Users can view own widgets"
    ON public.widgets FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can create own widgets"
    ON public.widgets FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own widgets"
    ON public.widgets FOR UPDATE
    USING (user_id = auth.uid());

CREATE POLICY "Users can delete own widgets"
    ON public.widgets FOR DELETE
    USING (user_id = auth.uid());

-- Milestones policies
CREATE POLICY "Users can view own milestones"
    ON public.milestones FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can create own milestones"
    ON public.milestones FOR INSERT
    WITH CHECK (user_id = auth.uid() AND 
               EXISTS (SELECT 1 FROM public.goals WHERE id = goal_id AND user_id = auth.uid()));

CREATE POLICY "Users can update own milestones"
    ON public.milestones FOR UPDATE
    USING (user_id = auth.uid() AND 
           EXISTS (SELECT 1 FROM public.goals WHERE id = goal_id AND user_id = auth.uid()));

CREATE POLICY "Users can delete own milestones"
    ON public.milestones FOR DELETE
    USING (user_id = auth.uid() AND 
           EXISTS (SELECT 1 FROM public.goals WHERE id = goal_id AND user_id = auth.uid()));

-- Additional security: Ensure authenticated access only
ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;
ALTER TABLE public.habits FORCE ROW LEVEL SECURITY;
ALTER TABLE public.goals FORCE ROW LEVEL SECURITY;
ALTER TABLE public.entries FORCE ROW LEVEL SECURITY;
ALTER TABLE public.widgets FORCE ROW LEVEL SECURITY;
ALTER TABLE public.milestones FORCE ROW LEVEL SECURITY;

-- Admin user creation function
CREATE OR REPLACE FUNCTION create_admin_user()
RETURNS void AS $$
DECLARE
    admin_id uuid;
BEGIN
    -- Check if admin already exists
    IF NOT EXISTS (
        SELECT 1 FROM auth.users 
        WHERE email = 'admin@habitflow.app'
    ) THEN
        -- Insert admin user into auth.users
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            recovery_sent_at,
            last_sign_in_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            confirmation_token,
            email_change,
            email_change_token_new,
            recovery_token
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'admin@habitflow.app',
            crypt('admin123', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW(),
            '{"provider": "email", "providers": ["email"]}',
            '{"full_name": "Admin User", "avatar_url": null}',
            NOW(),
            NOW(),
            '',
            '',
            '',
            ''
        )
        RETURNING id INTO admin_id;

        -- Insert into auth.identities
        INSERT INTO auth.identities (
            id,
            user_id,
            identity_data,
            provider,
            last_sign_in_at,
            created_at,
            updated_at
        ) VALUES (
            admin_id,
            admin_id,
            format('{"sub": "%s", "email": "admin@habitflow.app"}', admin_id)::jsonb,
            'email',
            NOW(),
            NOW(),
            NOW()
        );

        -- Create admin profile
        INSERT INTO public.profiles (
            id,
            username,
            full_name,
            email,
            avatar_url,
            is_admin,
            created_at,
            updated_at
        ) VALUES (
            admin_id,
            'admin',
            'Admin User',
            'admin@habitflow.app',
            null,
            true,
            NOW(),
            NOW()
        );
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Execute the function to create the admin user
SELECT create_admin_user();

-- Trigger to update habit streak
CREATE OR REPLACE FUNCTION update_habit_streak()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.last_completed IS NOT NULL AND 
       (OLD IS NULL OR NEW.last_completed > OLD.last_completed) THEN
        NEW.streak = calculate_streak(NEW.last_completed, NEW.streak);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_habit_streak_trigger
    BEFORE UPDATE ON public.habits
    FOR EACH ROW
    EXECUTE FUNCTION update_habit_streak();

-- Trigger to update goal streak
CREATE OR REPLACE FUNCTION update_goal_streak()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.completed_at IS NOT NULL AND (OLD IS NULL OR OLD.completed_at IS NULL) THEN
        NEW.current_streak = NEW.current_streak + 1;
        IF NEW.current_streak > NEW.longest_streak THEN
            NEW.longest_streak = NEW.current_streak;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_goal_streak_trigger
    BEFORE UPDATE ON public.goals
    FOR EACH ROW
    EXECUTE FUNCTION update_goal_streak();

-- Trigger to validate roadmap milestone dependencies
CREATE OR REPLACE FUNCTION validate_milestone_dependencies()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.depends_on IS NOT NULL THEN
        IF NOT EXISTS (
            SELECT 1 FROM public.roadmap_milestones 
            WHERE id = ANY(NEW.depends_on) 
            AND roadmap_id = NEW.roadmap_id
        ) THEN
            RAISE EXCEPTION 'Invalid milestone dependencies';
        END IF;
        
        IF EXISTS (
            SELECT 1 
            FROM public.roadmap_milestones 
            WHERE id = ANY(NEW.depends_on) 
            AND "order" >= NEW.order
        ) THEN
            RAISE EXCEPTION 'Dependency milestone must come before the current milestone';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_milestone_dependencies_trigger
    BEFORE INSERT OR UPDATE ON public.roadmap_milestones
    FOR EACH ROW
    EXECUTE FUNCTION validate_milestone_dependencies();

-- Trigger to prevent circular dependencies in roadmap milestones
CREATE OR REPLACE FUNCTION prevent_circular_dependencies()
RETURNS TRIGGER AS $$
BEGIN
    WITH RECURSIVE dependency_chain AS (
        SELECT id, depends_on, 1 as depth
        FROM public.roadmap_milestones
        WHERE id = NEW.id
        UNION ALL
        SELECT rm.id, rm.depends_on, dc.depth + 1
        FROM public.roadmap_milestones rm
        JOIN dependency_chain dc ON rm.id = ANY(dc.depends_on)
        WHERE dc.depth < 100
    )
    SELECT COUNT(*) INTO STRICT count
    FROM dependency_chain;
    
    IF count >= 100 THEN
        RAISE EXCEPTION 'Circular dependency detected in roadmap milestones';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_circular_dependencies_trigger
    BEFORE INSERT OR UPDATE ON public.roadmap_milestones
    FOR EACH ROW
    EXECUTE FUNCTION prevent_circular_dependencies();

-- Function to validate milestone dependencies
CREATE OR REPLACE FUNCTION validate_milestone_dependencies()
RETURNS TRIGGER AS $$
BEGIN
    -- Check for circular dependencies
    IF EXISTS (
        WITH RECURSIVE dependency_chain AS (
            -- Base case: direct dependencies
            SELECT m.id, m.depends_on, 1 as depth
            FROM public.milestones m
            WHERE m.id = NEW.id
            
            UNION ALL
            
            -- Recursive case: dependencies of dependencies
            SELECT m.id, m.depends_on, dc.depth + 1
            FROM public.milestones m
            JOIN dependency_chain dc ON m.id = ANY(dc.depends_on)
            WHERE dc.depth < 100  -- Prevent infinite recursion
        )
        SELECT 1 FROM dependency_chain
        WHERE NEW.id = ANY(depends_on)
    ) THEN
        RAISE EXCEPTION 'Circular dependency detected in milestone dependencies';
    END IF;

    -- Check that all dependencies belong to the same goal
    IF NEW.depends_on IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.milestones m
        WHERE m.id = ANY(NEW.depends_on)
        AND m.goal_id != NEW.goal_id
    ) THEN
        RAISE EXCEPTION 'All milestone dependencies must belong to the same goal';
    END IF;

    -- Check that dependent milestones have earlier or equal due dates
    IF NEW.depends_on IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.milestones m
        WHERE m.id = ANY(NEW.depends_on)
        AND m.due_date > NEW.due_date
    ) THEN
        RAISE EXCEPTION 'Dependent milestones must be scheduled before or on the same day as their dependencies';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for milestone dependency validation
CREATE TRIGGER validate_milestone_dependencies_trigger
    BEFORE INSERT OR UPDATE ON public.milestones
    FOR EACH ROW
    EXECUTE FUNCTION validate_milestone_dependencies();

-- Function to update goal progress when milestones change
CREATE OR REPLACE FUNCTION update_goal_progress()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.goals g
    SET progress = (
        SELECT 
            COALESCE(
                ROUND(
                    COUNT(*) FILTER (WHERE completed_at IS NOT NULL)::FLOAT / 
                    NULLIF(COUNT(*), 0) * 100
                ),
                0
            )::INTEGER
        FROM public.milestones m
        WHERE m.goal_id = g.id
    )
    WHERE g.id = CASE
        WHEN TG_OP = 'DELETE' THEN OLD.goal_id
        ELSE NEW.goal_id
    END;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for goal progress updates
CREATE TRIGGER update_goal_progress_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.milestones
    FOR EACH ROW
    EXECUTE FUNCTION update_goal_progress();

-- Advanced Analytics Functions

-- Function to analyze habit patterns and provide insights
CREATE OR REPLACE FUNCTION analyze_habit_patterns(user_id_param UUID)
RETURNS TABLE (
    habit_id UUID,
    title TEXT,
    completion_rate FLOAT,
    optimal_time_window TSRANGE,
    weekday_preference INTEGER[],
    consistency_score INTEGER,
    suggested_improvements TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    WITH habit_stats AS (
        SELECT
            h.id,
            h.title,
            COUNT(*) FILTER (WHERE e.completed_at >= CURRENT_DATE - INTERVAL '30 days') as monthly_entries,
            COUNT(DISTINCT e.completed_at::DATE) FILTER (WHERE e.completed_at >= CURRENT_DATE - INTERVAL '30 days') as active_days,
            MODE() WITHIN GROUP (ORDER BY EXTRACT(HOUR FROM e.completed_at)) as preferred_hour,
            ARRAY_AGG(DISTINCT EXTRACT(DOW FROM e.completed_at)::INTEGER) as active_weekdays,
            VARIANCE(EXTRACT(EPOCH FROM e.completed_at)) as timing_variance
        FROM public.habits h
        LEFT JOIN public.entries e ON e.habit_id = h.id
        WHERE h.user_id = user_id_param
        GROUP BY h.id, h.title
    )
    SELECT
        id,
        title,
        ROUND((active_days::FLOAT / 30) * 100, 2) as completion_rate,
        tsrange(
            CURRENT_DATE + (preferred_hour || ' hours')::INTERVAL - INTERVAL '1 hour',
            CURRENT_DATE + (preferred_hour || ' hours')::INTERVAL + INTERVAL '1 hour'
        ) as optimal_window,
        active_weekdays,
        CASE
            WHEN timing_variance < 3600 THEN 100
            WHEN timing_variance < 7200 THEN 80
            WHEN timing_variance < 14400 THEN 60
            WHEN timing_variance < 28800 THEN 40
            ELSE 20
        END as consistency_score,
        ARRAY[
            CASE 
                WHEN active_days < 15 THEN 'Increase completion frequency'
                WHEN timing_variance > 14400 THEN 'Try to maintain consistent timing'
                WHEN array_length(active_weekdays, 1) < 5 THEN 'Add more active days'
                ELSE 'Maintain current routine'
            END,
            CASE
                WHEN preferred_hour BETWEEN 5 AND 9 THEN 'Good morning routine'
                WHEN preferred_hour BETWEEN 17 AND 21 THEN 'Good evening routine'
                ELSE 'Consider optimal time of day'
            END
        ]
    FROM habit_stats;
END;
$$ LANGUAGE plpgsql;

-- Function to analyze habit chains and suggest optimal combinations
CREATE OR REPLACE FUNCTION analyze_habit_chains(user_id_param UUID)
RETURNS TABLE (
    chain_id INTEGER,
    habits TEXT[],
    success_rate FLOAT,
    average_completion_time INTERVAL,
    optimal_start_time TIME,
    chain_strength FLOAT,
    break_risk FLOAT,
    suggested_improvements TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    WITH habit_sequences AS (
        SELECT
            e1.habit_id as first_habit,
            e2.habit_id as second_habit,
            e1.completed_at as first_time,
            e2.completed_at as second_time,
            h1.title as first_title,
            h2.title as second_title
        FROM public.entries e1
        JOIN public.entries e2 ON e1.user_id = e2.user_id
            AND e1.completed_at < e2.completed_at
            AND e2.completed_at - e1.completed_at < INTERVAL '2 hours'
        JOIN public.habits h1 ON e1.habit_id = h1.id
        JOIN public.habits h2 ON e2.habit_id = h2.id
        WHERE e1.user_id = user_id_param
        AND e1.completed_at >= CURRENT_DATE - INTERVAL '30 days'
    ),
    habit_chains AS (
        SELECT
            DENSE_RANK() OVER (ORDER BY first_habit) as chain_id,
            ARRAY_AGG(DISTINCT first_title || ' → ' || second_title) as habit_sequence,
            COUNT(*) as occurrence_count,
            AVG(EXTRACT(EPOCH FROM (second_time - first_time))) as avg_completion_seconds,
            MODE() WITHIN GROUP (ORDER BY EXTRACT(HOUR FROM first_time)) as typical_start_hour,
            COUNT(*) FILTER (WHERE first_time::DATE = second_time::DATE)::FLOAT / COUNT(*) as same_day_ratio
        FROM habit_sequences
        GROUP BY first_habit
        HAVING COUNT(*) >= 5
    )
    SELECT
        chain_id,
        habit_sequence,
        occurrence_count::FLOAT / 30 as success_rate,
        (avg_completion_seconds || ' seconds')::INTERVAL as completion_time,
        (typical_start_hour || ':00:00')::TIME as start_time,
        same_day_ratio as chain_strength,
        CASE
            WHEN same_day_ratio < 0.5 THEN 0.8
            WHEN occurrence_count < 10 THEN 0.6
            ELSE 0.3
        END as break_risk,
        ARRAY[
            CASE 
                WHEN same_day_ratio < 0.5 THEN 'Try to complete these habits on the same day'
                ELSE 'Current chain is working well'
            END,
            CASE 
                WHEN occurrence_count < 10 THEN 'Increase chain consistency'
                ELSE 'Maintain current frequency'
            END
        ] as improvements
    FROM habit_chains;
END;
$$ LANGUAGE plpgsql;

-- Function to predict habit completion likelihood
CREATE OR REPLACE FUNCTION predict_habit_completion(user_id_param UUID)
RETURNS TABLE (
    habit_id UUID,
    habit_title TEXT,
    completion_probability FLOAT,
    best_time_window TSRANGE,
    success_factors TEXT[],
    risk_factors TEXT[],
    recommended_actions TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    WITH habit_metrics AS (
        SELECT
            h.id,
            h.title,
            h.frequency,
            COUNT(*) FILTER (WHERE e.completed_at >= CURRENT_DATE - INTERVAL '7 days') as recent_completions,
            COUNT(*) FILTER (WHERE e.completed_at >= CURRENT_DATE - INTERVAL '30 days') as monthly_completions,
            MODE() WITHIN GROUP (ORDER BY EXTRACT(HOUR FROM e.completed_at)) as preferred_hour,
            percentile_cont(0.5) WITHIN GROUP (ORDER BY EXTRACT(HOUR FROM e.completed_at)) as median_hour,
            VARIANCE(EXTRACT(HOUR FROM e.completed_at)) as time_variance,
            COUNT(DISTINCT e.completed_at::DATE) FILTER (WHERE e.completed_at >= CURRENT_DATE - INTERVAL '30 days') as active_days,
            MAX(e.completed_at) as last_completion
        FROM public.habits h
        LEFT JOIN public.entries e ON e.habit_id = h.id
        WHERE h.user_id = user_id_param
        GROUP BY h.id, h.title, h.frequency
    )
    SELECT
        id,
        title,
        CASE
            WHEN recent_completions >= 5 THEN 0.9
            WHEN monthly_completions >= 15 THEN 0.7
            WHEN active_days >= 10 THEN 0.5
            ELSE 0.3
        END as probability,
        tsrange(
            (CURRENT_DATE + (preferred_hour || ' hours')::INTERVAL - INTERVAL '1 hour'),
            (CURRENT_DATE + (preferred_hour || ' hours')::INTERVAL + INTERVAL '1 hour')
        ) as time_window,
        ARRAY[
            CASE WHEN recent_completions >= 5 THEN 'Strong recent performance' END,
            CASE WHEN time_variance < 4 THEN 'Consistent timing' END,
            CASE WHEN active_days >= 15 THEN 'Good monthly activity' END
        ] as success_factors,
        ARRAY[
            CASE WHEN recent_completions < 3 THEN 'Low recent activity' END,
            CASE WHEN time_variance > 8 THEN 'Inconsistent timing' END,
            CASE WHEN CURRENT_DATE - last_completion::DATE > 7 THEN 'Recent inactivity' END
        ] as risks,
        ARRAY[
            CASE 
                WHEN recent_completions < 3 THEN 'Focus on rebuilding the streak'
                WHEN time_variance > 8 THEN 'Try to maintain consistent timing'
                ELSE 'Maintain current routine'
            END
        ] as actions
    FROM habit_metrics;
END;
$$ LANGUAGE plpgsql;

-- Drop all existing variations of analyze_habit_patterns
DROP FUNCTION IF EXISTS analyze_habit_patterns(uuid) CASCADE;
DROP FUNCTION IF EXISTS analyze_habit_patterns(user_id uuid) CASCADE;
DROP FUNCTION IF EXISTS analyze_habit_patterns(user_id_param uuid) CASCADE;

-- Create single version of analyze_habit_patterns
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

-- Function to calculate habit correlations without subquery
CREATE OR REPLACE FUNCTION calculate_habit_correlations(user_id_param UUID)
RETURNS TABLE (
    habit1_id UUID,
    habit1_title TEXT,
    habit2_id UUID,
    habit2_title TEXT,
    correlation_strength FLOAT,
    success_impact FLOAT,
    suggested_sequence TEXT
) AS $$
BEGIN
    RETURN QUERY
    WITH habit_pairs AS (
        SELECT 
            h1.id as habit1_id,
            h1.title as habit1_title,
            h2.id as habit2_id,
            h2.title as habit2_title,
            COUNT(*) as joint_completions,
            AVG(EXTRACT(EPOCH FROM (e2.completed_at - e1.completed_at))) as avg_time_between,
            CASE 
                WHEN ABS(EXTRACT(EPOCH FROM (e2.completed_at - e1.completed_at))) <= 3600 THEN 1.0
                WHEN ABS(EXTRACT(EPOCH FROM (e2.completed_at - e1.completed_at))) <= 7200 THEN 0.8
                WHEN ABS(EXTRACT(EPOCH FROM (e2.completed_at - e1.completed_at))) <= 14400 THEN 0.6
                WHEN ABS(EXTRACT(EPOCH FROM (e2.completed_at - e1.completed_at))) <= 28800 THEN 0.4
                ELSE 0.2
            END as time_correlation
        FROM public.habits h1
        JOIN public.entries e1 ON e1.habit_id = h1.id
        JOIN public.entries e2 ON e2.user_id = e1.user_id 
            AND e2.completed_at > e1.completed_at 
            AND e2.completed_at <= e1.completed_at + INTERVAL '24 hours'
        JOIN public.habits h2 ON h2.id = e2.habit_id AND h2.id != h1.id
        WHERE h1.user_id = user_id_param
        GROUP BY h1.id, h2.id, h1.title, h2.title
        HAVING COUNT(*) >= 3
    )
    SELECT 
        habit1_id,
        habit1_title,
        habit2_id,
        habit2_title,
        (joint_completions * time_correlation)::FLOAT as correlation_strength,
        (joint_completions * time_correlation * 0.5)::FLOAT as success_impact,
        CASE
            WHEN avg_time_between < 900 THEN habit1_title || ' → ' || habit2_title
            ELSE habit2_title || ' → ' || habit1_title
        END as suggested_sequence
    FROM habit_pairs
    ORDER BY correlation_strength DESC
    LIMIT 10;
END;
$$ LANGUAGE plpgsql;

-- Function to update goal progress
CREATE OR REPLACE FUNCTION update_goal_progress() 
RETURNS TRIGGER AS $$
DECLARE
    total_milestones INTEGER;
    completed_milestones INTEGER;
BEGIN
    SELECT 
        COUNT(*),
        COUNT(*) FILTER (WHERE completed_at IS NOT NULL)
    INTO total_milestones, completed_milestones
    FROM public.milestones
    WHERE goal_id = NEW.goal_id;

    IF total_milestones > 0 THEN
        UPDATE public.goals
        SET progress = (completed_milestones * 100 / total_milestones)
        WHERE id = NEW.goal_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS analyze_habit_patterns(uuid);
DROP FUNCTION IF EXISTS calculate_habit_correlations(uuid);
DROP FUNCTION IF EXISTS calculate_user_completion_rate(uuid);
DROP FUNCTION IF EXISTS calculate_milestone_completion(uuid);
DROP FUNCTION IF EXISTS update_goal_progress();
DROP FUNCTION IF EXISTS update_goal_streak();
DROP FUNCTION IF EXISTS refresh_user_insights();
DROP FUNCTION IF EXISTS validate_milestone_dependencies();
DROP FUNCTION IF EXISTS validate_streak_calculation();
DROP FUNCTION IF EXISTS validate_progress_calculation();
DROP FUNCTION IF EXISTS update_habit_streak();
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Create utility functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to analyze habit patterns
CREATE OR REPLACE FUNCTION analyze_habit_patterns(
    user_id_param UUID,
    OUT habit_id UUID,
    OUT habit_title TEXT,
    OUT completion_rate FLOAT,
    OUT avg_completion_time TIME,
    OUT most_productive_hour INTEGER,
    OUT streak_length INTEGER,
    OUT suggested_time TIME
)
RETURNS SETOF record AS $$
BEGIN
    RETURN QUERY
    WITH habit_stats AS (
        SELECT 
            h.id,
            h.title,
            COUNT(e.id) FILTER (WHERE e.completed_at IS NOT NULL)::FLOAT / 
                NULLIF(COUNT(e.id), 0) * 100 as completion_rate,
            AVG(e.completed_at::TIME) as avg_completion_time,
            MODE() WITHIN GROUP (ORDER BY EXTRACT(HOUR FROM e.completed_at)) as peak_hour,
            h.streak as current_streak,
            percentile_cont(0.5) WITHIN GROUP (ORDER BY e.completed_at::TIME) as median_time
        FROM public.habits h
        LEFT JOIN public.entries e ON e.habit_id = h.id
        WHERE h.user_id = user_id_param
        GROUP BY h.id, h.title
    )
    SELECT 
        id,
        title,
        completion_rate,
        avg_completion_time,
        peak_hour,
        current_streak,
        median_time
    FROM habit_stats
    WHERE completion_rate > 0;
END;
$$ LANGUAGE plpgsql;

-- Create function to calculate habit correlations
CREATE OR REPLACE FUNCTION calculate_habit_correlations(
    user_id_param UUID,
    OUT habit1_id UUID,
    OUT habit1_title TEXT,
    OUT habit2_id UUID,
    OUT habit2_title TEXT,
    OUT correlation_strength FLOAT,
    OUT success_impact FLOAT,
    OUT suggested_sequence TEXT
)
RETURNS SETOF record AS $$
BEGIN
    RETURN QUERY
    WITH habit_pairs AS (
        SELECT 
            h1.id as habit1_id,
            h1.title as habit1_title,
            h2.id as habit2_id,
            h2.title as habit2_title,
            COUNT(*) as joint_completions,
            AVG(EXTRACT(EPOCH FROM (e2.completed_at - e1.completed_at))) as avg_time_between,
            CASE 
                WHEN ABS(EXTRACT(EPOCH FROM (e2.completed_at - e1.completed_at))) <= 3600 THEN 1.0
                WHEN ABS(EXTRACT(EPOCH FROM (e2.completed_at - e1.completed_at))) <= 7200 THEN 0.8
                WHEN ABS(EXTRACT(EPOCH FROM (e2.completed_at - e1.completed_at))) <= 14400 THEN 0.6
                WHEN ABS(EXTRACT(EPOCH FROM (e2.completed_at - e1.completed_at))) <= 28800 THEN 0.4
                ELSE 0.2
            END as time_correlation
        FROM public.habits h1
        JOIN public.entries e1 ON e1.habit_id = h1.id
        JOIN public.entries e2 ON e2.user_id = e1.user_id 
            AND e2.completed_at > e1.completed_at 
            AND e2.completed_at <= e1.completed_at + INTERVAL '24 hours'
        JOIN public.habits h2 ON h2.id = e2.habit_id AND h2.id != h1.id
        WHERE h1.user_id = user_id_param
        GROUP BY h1.id, h1.title, h2.id, h2.title
        HAVING COUNT(*) >= 3
    )
    SELECT 
        habit1_id,
        habit1_title,
        habit2_id,
        habit2_title,
        (joint_completions * time_correlation)::FLOAT as correlation_strength,
        (joint_completions * time_correlation * 0.5)::FLOAT as success_impact,
        CASE
            WHEN avg_time_between < 900 THEN habit1_title || ' → ' || habit2_title
            ELSE habit2_title || ' → ' || habit1_title
        END
    FROM habit_pairs;
END;
$$ LANGUAGE plpgsql;

-- Other functions remain the same...

DROP FUNCTION IF EXISTS analyze_habit_patterns(uuid);

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
