-- Milestones Management
CREATE TABLE IF NOT EXISTS public.milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    goal_id UUID REFERENCES public.goals(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    completed_at TIMESTAMP WITH TIME ZONE,
    due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for milestones
CREATE POLICY "Users can view their own milestones"
    ON public.milestones FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own milestones"
    ON public.milestones FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own milestones"
    ON public.milestones FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own milestones"
    ON public.milestones FOR DELETE
    USING (auth.uid() = user_id);

-- Create trigger for updating updated_at
CREATE TRIGGER update_milestones_updated_at
    BEFORE UPDATE ON public.milestones
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create indices for better performance
CREATE INDEX milestones_user_id_idx ON public.milestones(user_id);
CREATE INDEX milestones_goal_id_idx ON public.milestones(goal_id);
CREATE INDEX milestones_due_date_idx ON public.milestones(due_date);

-- Create trigger for updating goal progress when milestone is completed
CREATE TRIGGER update_goal_progress_trigger
    AFTER INSERT OR UPDATE OF completed_at ON public.milestones
    FOR EACH ROW
    EXECUTE FUNCTION update_goal_progress();
