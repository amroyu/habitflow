import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database.types'

type Goal = Database['public']['Tables']['goals']['Row']
type Habit = Database['public']['Tables']['habits']['Row']
type Entry = Database['public']['Tables']['entries']['Row']
type Widget = Database['public']['Tables']['widgets']['Row']

export function useRealtimeGoals() {
  const [goals, setGoals] = useState<Goal[]>([])

  useEffect(() => {
    // Initial fetch
    const fetchGoals = async () => {
      const { data } = await supabase
        .from('goals')
        .select('*, entries(*)')
        .order('created_at', { ascending: false })
      
      if (data) setGoals(data)
    }

    fetchGoals()

    // Set up real-time subscription
    const subscription = supabase
      .channel('goals_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'goals'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setGoals(prev => [payload.new as Goal, ...prev])
          } else if (payload.eventType === 'DELETE') {
            setGoals(prev => prev.filter(goal => goal.id !== payload.old.id))
          } else if (payload.eventType === 'UPDATE') {
            setGoals(prev => prev.map(goal => 
              goal.id === payload.new.id ? payload.new as Goal : goal
            ))
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return goals
}

export function useRealtimeHabits() {
  const [habits, setHabits] = useState<Habit[]>([])

  useEffect(() => {
    // Initial fetch
    const fetchHabits = async () => {
      const { data } = await supabase
        .from('habits')
        .select('*, entries(*)')
        .order('created_at', { ascending: false })
      
      if (data) setHabits(data)
    }

    fetchHabits()

    // Set up real-time subscription
    const subscription = supabase
      .channel('habits_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'habits'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setHabits(prev => [payload.new as Habit, ...prev])
          } else if (payload.eventType === 'DELETE') {
            setHabits(prev => prev.filter(habit => habit.id !== payload.old.id))
          } else if (payload.eventType === 'UPDATE') {
            setHabits(prev => prev.map(habit => 
              habit.id === payload.new.id ? payload.new as Habit : habit
            ))
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return habits
}

export function useRealtimeEntries(habitId?: string, goalId?: string) {
  const [entries, setEntries] = useState<Entry[]>([])

  useEffect(() => {
    // Initial fetch
    const fetchEntries = async () => {
      let query = supabase
        .from('entries')
        .select('*')
        .order('completed_at', { ascending: false })

      if (habitId) {
        query = query.eq('habit_id', habitId)
      }
      if (goalId) {
        query = query.eq('goal_id', goalId)
      }

      const { data } = await query
      if (data) setEntries(data)
    }

    fetchEntries()

    // Set up real-time subscription
    const subscription = supabase
      .channel('entries_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'entries',
          filter: habitId 
            ? `habit_id=eq.${habitId}`
            : goalId
            ? `goal_id=eq.${goalId}`
            : undefined
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setEntries(prev => [payload.new as Entry, ...prev])
          } else if (payload.eventType === 'DELETE') {
            setEntries(prev => prev.filter(entry => entry.id !== payload.old.id))
          } else if (payload.eventType === 'UPDATE') {
            setEntries(prev => prev.map(entry => 
              entry.id === payload.new.id ? payload.new as Entry : entry
            ))
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [habitId, goalId])

  return entries
}

export function useRealtimeWidgets() {
  const [widgets, setWidgets] = useState<Widget[]>([])

  useEffect(() => {
    // Initial fetch
    const fetchWidgets = async () => {
      const { data } = await supabase
        .from('widgets')
        .select('*, habits(*), goals(*)')
        .order('created_at', { ascending: false })
      
      if (data) setWidgets(data)
    }

    fetchWidgets()

    // Set up real-time subscription
    const subscription = supabase
      .channel('widgets_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'widgets'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setWidgets(prev => [payload.new as Widget, ...prev])
          } else if (payload.eventType === 'DELETE') {
            setWidgets(prev => prev.filter(widget => widget.id !== payload.old.id))
          } else if (payload.eventType === 'UPDATE') {
            setWidgets(prev => prev.map(widget => 
              widget.id === payload.new.id ? payload.new as Widget : widget
            ))
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return widgets
}
