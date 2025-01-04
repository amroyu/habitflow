-- Analytics Functions

-- Function to calculate habit correlations
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

-- Function to analyze user engagement
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
            EXTRACT(DOW FROM e.completed_at) as day_of_week,
            EXTRACT(HOUR FROM e.completed_at) as hour_of_day,
            h.streak,
            h.progress
        FROM public.entries e
        LEFT JOIN public.habits h ON e.habit_id = h.id
        WHERE e.user_id = user_id_param
        AND e.completed_at >= CURRENT_DATE - INTERVAL '30 days'
    ),
    daily_stats AS (
        SELECT
            completed_at::DATE,
            COUNT(*) as daily_entries,
            MAX(completed_at) - MIN(completed_at) as session_length
        FROM user_activity
        GROUP BY completed_at::DATE
    ),
    engagement_metrics AS (
        SELECT
            (COUNT(DISTINCT completed_at::DATE)::FLOAT / 30) * 100 as engagement_score,
            AVG(daily_entries) as avg_daily_entries,
            COUNT(*) FILTER (WHERE daily_entries > 0)::FLOAT / COUNT(*) * 100 as completion_rate,
            MAX(session_length) as max_session,
            COUNT(*) FILTER (WHERE daily_entries = 0) as zero_activity_days
        FROM daily_stats
    )
    SELECT
        em.engagement_score,
        (em.avg_daily_entries / 5 * 100) as consistency_score,
        em.completion_rate,
        ARRAY_AGG(DISTINCT TO_CHAR(ua.completed_at, 'Day')) FILTER (WHERE ua.completed_at IS NOT NULL) as active_days,
        ARRAY_AGG(DISTINCT ua.hour_of_day) FILTER (WHERE ua.completed_at IS NOT NULL) as active_hours,
        em.max_session,
        MAX(ua.streak),
        CASE
            WHEN em.zero_activity_days > 15 THEN 0.8
            WHEN em.engagement_score < 30 THEN 0.7
            WHEN em.completion_rate < 40 THEN 0.4
            ELSE 0.1
        END,
        ARRAY_REMOVE(ARRAY[
            CASE WHEN em.engagement_score < 30 
                THEN 'Set smaller, achievable daily goals'
            END,
            CASE WHEN em.completion_rate < 40 
                THEN 'Focus on fewer habits but maintain consistency'
            END,
            CASE WHEN em.zero_activity_days > 7 
                THEN 'Schedule specific times for habits'
            END,
            CASE WHEN em.max_session < INTERVAL '5 minutes'
                THEN 'Increase engagement time gradually'
            END
        ], NULL)
    FROM engagement_metrics em
    CROSS JOIN user_activity ua
    GROUP BY 
        em.engagement_score,
        em.avg_daily_entries,
        em.completion_rate,
        em.max_session,
        em.zero_activity_days;
END;
$$ LANGUAGE plpgsql;
