# HabitFlow Backend Implementation Guide

## Database Setup with Supabase

### 1. Database Schema

```sql
-- Users table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users primary key,
  username text unique,
  full_name text,
  avatar_url text,
  timezone text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Goals table
create table public.goals (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  category text not null,
  target_date timestamp with time zone,
  progress integer default 0,
  status text default 'active',
  is_public boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Habits table
create table public.habits (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  frequency jsonb not null, -- {days: [], times: []}
  streak_count integer default 0,
  total_completions integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Habit Logs table
create table public.habit_logs (
  id uuid default uuid_generate_v4() primary key,
  habit_id uuid references public.habits(id) on delete cascade,
  completed_at timestamp with time zone default timezone('utc'::text, now()),
  notes text
);

-- Timer Sessions table
create table public.timer_sessions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  duration integer not null, -- in minutes
  type text not null, -- 'focus' or 'break'
  started_at timestamp with time zone not null,
  ended_at timestamp with time zone,
  status text default 'active' -- 'active', 'completed', 'interrupted'
);

-- Activities table (unified timeline)
create table public.activities (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  type text not null, -- 'goal', 'habit', 'timer', etc.
  reference_id uuid not null, -- ID of the related record
  action text not null, -- 'created', 'completed', 'updated', etc.
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Social Features
create table public.reactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  activity_id uuid references public.activities(id) on delete cascade,
  type text not null, -- '👍', '🎉', '🎯', etc.
  created_at timestamp with time zone default timezone('utc'::text, now())
);

create table public.bookmarks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  activity_id uuid references public.activities(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
```

### 2. Row Level Security Policies

```sql
-- Profiles RLS
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using ( true );

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile"
  on public.profiles for update
  using ( auth.uid() = id );

-- Goals RLS
alter table public.goals enable row level security;

create policy "Users can view own goals and public goals"
  on public.goals for select
  using ( auth.uid() = user_id or is_public = true );

create policy "Users can insert own goals"
  on public.goals for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own goals"
  on public.goals for update
  using ( auth.uid() = user_id );

-- Similar policies for other tables...
```

## Backend Implementation Steps

### 1. Authentication Setup

1. Configure Supabase Auth:
   ```typescript
   // lib/supabase.ts
   import { createClient } from '@supabase/supabase-js'

   export const supabase = createClient(
     process.env.NEXT_PUBLIC_SUPABASE_URL!,
     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
   )
   ```

2. Create auth middleware:
   ```typescript
   // middleware.ts
   import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
   import { NextResponse } from 'next/server'

   export async function middleware(req) {
     const res = NextResponse.next()
     const supabase = createMiddlewareClient({ req, res })
     await supabase.auth.getSession()
     return res
   }
   ```

### 2. API Routes Implementation

1. Create route handlers for each feature:
   ```typescript
   // app/api/goals/route.ts
   import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
   import { NextResponse } from 'next/server'

   export async function POST(request) {
     const supabase = createRouteHandlerClient({ cookies })
     const { data: { user } } = await supabase.auth.getUser()
     
     const { title, description, category, targetDate } = await request.json()
     
     const { data, error } = await supabase
       .from('goals')
       .insert({
         user_id: user.id,
         title,
         description,
         category,
         target_date: targetDate
       })
       .select()
       .single()

     if (error) return NextResponse.json({ error }, { status: 500 })
     return NextResponse.json(data)
   }
   ```

### 3. Real-time Subscriptions

1. Set up real-time listeners:
   ```typescript
   // hooks/useRealtimeData.ts
   export function useRealtimeHabits() {
     const [habits, setHabits] = useState([])

     useEffect(() => {
       const subscription = supabase
         .from('habits')
         .on('*', payload => {
           // Update habits based on real-time changes
         })
         .subscribe()

       return () => {
         subscription.unsubscribe()
       }
     }, [])

     return habits
   }
   ```

### 4. Background Jobs

1. Create Edge Functions for periodic tasks:
   ```typescript
   // supabase/functions/reset-streaks/index.ts
   export async function resetStreaks() {
     const { data: habits } = await supabase
       .from('habits')
       .select('id, frequency, last_completion')
     
     // Reset streaks for habits that missed their schedule
     for (const habit of habits) {
       if (shouldResetStreak(habit)) {
         await supabase
           .from('habits')
           .update({ streak_count: 0 })
           .eq('id', habit.id)
       }
     }
   }
   ```

### 5. Storage Setup

1. Configure storage buckets:
   ```sql
   insert into storage.buckets (id, name)
   values ('avatars', 'avatars');

   insert into storage.buckets (id, name)
   values ('goal-attachments', 'goal-attachments');
   ```

2. Set up storage policies:
   ```sql
   create policy "Avatar images are publicly accessible"
     on storage.objects for select
     using ( bucket_id = 'avatars' );

   create policy "Users can upload their own avatar"
     on storage.objects for insert
     with check ( bucket_id = 'avatars' AND auth.uid() = owner );
   ```

## Integration Steps

1. Install required dependencies:
   ```bash
   npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
   ```

2. Set up environment variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

3. Initialize Supabase client in your app:
   ```typescript
   // app/providers.tsx
   export function Providers({ children }) {
     return (
       <SessionContextProvider supabaseClient={supabase}>
         {children}
       </SessionContextProvider>
     )
   }
   ```

## Testing

1. Set up test environment:
   ```typescript
   // Create test database
   // Set up test data
   // Configure test clients
   ```

2. Write integration tests:
   ```typescript
   // tests/integration/goals.test.ts
   describe('Goals API', () => {
     it('should create a new goal', async () => {
       // Test goal creation
     })
     
     it('should update goal progress', async () => {
       // Test progress updates
     })
   })
   ```

## Deployment

1. Deploy to Vercel:
   ```bash
   vercel deploy
   ```

2. Configure Supabase production environment:
   - Set up production database
   - Configure auth settings
   - Set up storage buckets
   - Deploy edge functions

## Monitoring

1. Set up logging:
   ```typescript
   // lib/logger.ts
   export const logger = {
     error: (err: Error, context?: any) => {
       // Log to your preferred service
     }
   }
   ```

2. Configure monitoring tools:
   - Set up Supabase monitoring
   - Configure error tracking
   - Set up performance monitoring

Remember to implement proper error handling, input validation, and security measures throughout the implementation.
