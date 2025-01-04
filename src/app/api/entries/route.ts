import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const habitId = searchParams.get('habitId')
  const goalId = searchParams.get('goalId')

  const query = supabase
    .from('entries')
    .select('*')
    .eq('user_id', user.id)
    .order('completed_at', { ascending: false })

  if (habitId) {
    query.eq('habit_id', habitId)
  }
  if (goalId) {
    query.eq('goal_id', goalId)
  }

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const json = await request.json()
  const { habit_id, goal_id, note, value } = json

  if (!habit_id && !goal_id) {
    return NextResponse.json(
      { error: 'Either habit_id or goal_id must be provided' },
      { status: 400 }
    )
  }

  if (habit_id && goal_id) {
    return NextResponse.json(
      { error: 'Cannot provide both habit_id and goal_id' },
      { status: 400 }
    )
  }

  // Start a transaction
  const { data: entry, error: entryError } = await supabase
    .from('entries')
    .insert({
      user_id: user.id,
      habit_id,
      goal_id,
      note,
      value
    })
    .select()
    .single()

  if (entryError) return NextResponse.json({ error: entryError.message }, { status: 500 })

  // Update progress and get additional info
  if (habit_id) {
    const [{ data: progress }, { data: streak }] = await Promise.all([
      supabase.rpc('update_habit_progress', { p_habit_id: habit_id }),
      supabase.rpc('calculate_streak_info', { p_habit_id: habit_id })
    ])

    return NextResponse.json({ entry, streak })
  }

  if (goal_id) {
    const [{ data: progress }, { data: goalProgress }] = await Promise.all([
      supabase.rpc('update_goal_progress', { p_goal_id: goal_id }),
      supabase.rpc('get_goal_progress', { p_goal_id: goal_id })
    ])

    return NextResponse.json({ entry, goalProgress })
  }

  return NextResponse.json(entry)
}
