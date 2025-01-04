-- Goals Management
CREATE TABLE IF NOT EXISTS public.goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    target INTEGER,
    start_date DATE,
    end_date DATE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned')),
    progress INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for goals
CREATE POLICY "Users can view their own goals"
    ON public.goals FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own goals"
    ON public.goals FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals"
    ON public.goals FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goals"
    ON public.goals FOR DELETE
    USING (auth.uid() = user_id);

-- Create trigger for updating updated_at
CREATE TRIGGER update_goals_updated_at
    BEFORE UPDATE ON public.goals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create indices for better performance
CREATE INDEX goals_user_id_idx ON public.goals(user_id);
CREATE INDEX goals_status_idx ON public.goals(status);
CREATE INDEX goals_end_date_idx ON public.goals(end_date);

-- Function to update goal progress
CREATE OR REPLACE FUNCTION update_goal_progress()
RETURNS TRIGGER AS $$
BEGIN
    WITH milestone_stats AS (
        SELECT 
            COUNT(*) as total_milestones,
            COUNT(*) FILTER (WHERE completed_at IS NOT NULL) as completed_milestones
        FROM public.milestones
        WHERE goal_id = NEW.goal_id
    )
    UPDATE public.goals
    SET 
        progress = CASE 
            WHEN ms.total_milestones > 0 
            THEN (ms.completed_milestones::FLOAT / ms.total_milestones::FLOAT * 100)::INTEGER
            ELSE 0
        END,
        completed_at = CASE 
            WHEN ms.total_milestones > 0 AND ms.completed_milestones = ms.total_milestones 
            THEN NOW()
            ELSE NULL
        END,
        status = CASE 
            WHEN ms.total_milestones > 0 AND ms.completed_milestones = ms.total_milestones 
            THEN 'completed'
            ELSE status
        END
    FROM milestone_stats ms
    WHERE id = NEW.goal_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
