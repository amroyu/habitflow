-- Widgets Management
CREATE TABLE IF NOT EXISTS public.widgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    habit_id UUID REFERENCES public.habits(id) ON DELETE CASCADE,
    goal_id UUID REFERENCES public.goals(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('progress', 'streak', 'timer', 'checklist', 'chart')),
    settings JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    CHECK (habit_id IS NOT NULL OR goal_id IS NOT NULL)
);

-- Enable Row Level Security
ALTER TABLE public.widgets ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for widgets
CREATE POLICY "Users can view their own widgets"
    ON public.widgets FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own widgets"
    ON public.widgets FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own widgets"
    ON public.widgets FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own widgets"
    ON public.widgets FOR DELETE
    USING (auth.uid() = user_id);

-- Create trigger for updating updated_at
CREATE TRIGGER update_widgets_updated_at
    BEFORE UPDATE ON public.widgets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create indices for better performance
CREATE INDEX widgets_user_id_idx ON public.widgets(user_id);
CREATE INDEX widgets_habit_id_idx ON public.widgets(habit_id);
CREATE INDEX widgets_goal_id_idx ON public.widgets(goal_id);
CREATE INDEX widgets_type_idx ON public.widgets(type);
