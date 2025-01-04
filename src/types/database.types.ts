export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]
export type HabitType = 'good' | 'bad'
export type GoalStatus = 'in_progress' | 'completed' | 'failed'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      habits: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          frequency: string
          type: HabitType
          category: string
          streak: number
          progress: number
          last_completed: string | null
          completed_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          frequency: string
          type: HabitType
          category: string
          streak?: number
          progress?: number
          last_completed?: string | null
          completed_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          frequency?: string
          type?: HabitType
          category?: string
          streak?: number
          progress?: number
          last_completed?: string | null
          completed_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      goals: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          target: number
          start_date: string
          end_date: string
          status: GoalStatus
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          target: number
          start_date: string
          end_date: string
          status?: GoalStatus
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          target?: number
          start_date?: string
          end_date?: string
          status?: GoalStatus
          created_at?: string
          updated_at?: string
        }
      }
      entries: {
        Row: {
          id: string
          user_id: string
          habit_id: string | null
          goal_id: string | null
          note: string | null
          value: number | null
          completed_at: string
        }
        Insert: {
          id?: string
          user_id: string
          habit_id?: string | null
          goal_id?: string | null
          note?: string | null
          value?: number | null
          completed_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          habit_id?: string | null
          goal_id?: string | null
          note?: string | null
          value?: number | null
          completed_at?: string
        }
      }
      widgets: {
        Row: {
          id: string
          user_id: string
          habit_id: string | null
          goal_id: string | null
          type: string
          settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          habit_id?: string | null
          goal_id?: string | null
          type: string
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          habit_id?: string | null
          goal_id?: string | null
          type?: string
          settings?: Json
          created_at?: string
          updated_at?: string
        }
      }
    }
    Enums: {
      habit_type: HabitType
      goal_status: GoalStatus
    }
  }
}
