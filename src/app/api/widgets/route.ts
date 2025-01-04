import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('widgets')
    .select('*, habits(*), goals(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

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
  const { habit_id, goal_id, type, settings } = json

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

  const { data, error } = await supabase
    .from('widgets')
    .insert({
      user_id: user.id,
      habit_id,
      goal_id,
      type,
      settings
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
