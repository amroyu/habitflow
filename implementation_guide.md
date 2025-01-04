# HabitFlow Implementation Guide

## Overview
This guide outlines the steps to implement the HabitFlow application from start to finish, covering database setup, backend API development, frontend implementation, component development, data management, testing, and deployment.

## Phase 1: Database Setup
1. **Initialize Authentication**
   ```bash
   psql -f /supabase/migrations/pages/01_auth.sql
   ```
   - Sets up user profiles
   - Establishes basic security

2. **Core Features Setup**
   ```bash
   psql -f /supabase/migrations/pages/02_habits.sql
   psql -f /supabase/migrations/pages/03_goals.sql
   ```
   - Creates habits and goals tables
   - Implements basic tracking functionality

3. **Supporting Features**
   ```bash
   psql -f /supabase/migrations/pages/04_entries.sql
   psql -f /supabase/migrations/pages/05_milestones.sql
   ```
   - Adds entry tracking
   - Implements milestone system

4. **UI Components**
   ```bash
   psql -f /supabase/migrations/pages/06_widgets.sql
   ```
   - Sets up widget system for dashboard

5. **Analytics Layer**
   ```bash
   psql -f /supabase/migrations/pages/07_analytics.sql
   ```
   - Implements analytics functions
   - Enables insights generation

## Phase 2: Backend API Development
1. **Authentication API**
   ```typescript
   // /src/app/api/auth/[...nextauth]/route.ts
   import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
   import { cookies } from 'next/headers'

   export async function GET(request: Request) {
     const supabase = createRouteHandlerClient({ cookies })
     const { data: { session }, error } = await supabase.auth.getSession()
     
     if (error) {
       return new Response(JSON.stringify({ error: error.message }), {
         status: 401,
       })
     }
     
     return new Response(JSON.stringify({ session }), {
       status: 200,
     })
   }
   ```

2. **Habits API**
   ```typescript
   // /src/app/api/habits/route.ts
   import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
   import { cookies } from 'next/headers'

   export async function GET(request: Request) {
     const supabase = createRouteHandlerClient({ cookies })
     
     const { data, error } = await supabase
       .from('habits')
       .select('*')
       .order('created_at', { ascending: false })
       
     if (error) {
       return new Response(JSON.stringify({ error: error.message }), {
         status: 500,
       })
     }
     
     return new Response(JSON.stringify(data), {
       status: 200,
     })
   }
   ```

## Phase 3: Frontend Implementation
1. **Layout Setup**
   ```typescript
   // /src/app/layout.tsx
   import { Providers } from './providers'

   export default function RootLayout({
     children,
   }: {
     children: React.ReactNode
   }) {
     return (
       <html lang="en">
         <body>
           <Providers>{children}</Providers>
         </body>
       </html>
     )
   }
   ```

2. **Dashboard Page**
   ```typescript
   // /src/app/dashboard/page.tsx
   import { HabitList } from '@/components/HabitList'
   import { GoalTracker } from '@/components/GoalTracker'
   import { Analytics } from '@/components/Analytics'

   export default function Dashboard() {
     return (
       <div className="container mx-auto p-4">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <HabitList />
           <GoalTracker />
         </div>
         <Analytics />
       </div>
     )
   }
   ```

## Phase 4: Component Development
1. **Create Components**
   ```typescript
   // /src/components/HabitList.tsx
   'use client'

   import { useHabits } from '@/hooks/useHabits'

   export function HabitList() {
     const { habits, isLoading } = useHabits()
     
     if (isLoading) return <div>Loading...</div>
     
     return (
       <div className="rounded-lg shadow-lg p-4">
         <h2 className="text-2xl font-bold mb-4">My Habits</h2>
         <ul>
           {habits.map((habit) => (
             <li key={habit.id} className="mb-2">
               {habit.title}
             </li>
           ))}
         </ul>
       </div>
     )
   }
   ```

## Phase 5: Data Management
1. **Custom Hooks**
   ```typescript
   // /src/hooks/useHabits.ts
   import { useQuery, useMutation } from '@tanstack/react-query'
   import { supabase } from '@/lib/supabase'

   export function useHabits() {
     const { data: habits, isLoading } = useQuery({
       queryKey: ['habits'],
       queryFn: async () => {
         const { data, error } = await supabase
           .from('habits')
           .select('*')
         if (error) throw error
         return data
       },
     })

     const createHabit = useMutation({
       mutationFn: async (newHabit) => {
         const { data, error } = await supabase
           .from('habits')
           .insert([newHabit])
           .select()
         if (error) throw error
         return data[0]
       },
     })

     return { habits, isLoading, createHabit }
   }
   ```

## Phase 6: Testing and Deployment
1. **Unit Tests**
   ```typescript
   // /src/components/__tests__/HabitList.test.tsx
   import { render, screen } from '@testing-library/react'
   import { HabitList } from '../HabitList'

   describe('HabitList', () => {
     it('renders loading state', () => {
       render(<HabitList />)
       expect(screen.getByText('Loading...')).toBeInTheDocument()
     })
   })
   ```

2. **E2E Tests**
   ```typescript
   // /cypress/e2e/habits.cy.ts
   describe('Habits', () => {
     it('creates a new habit', () => {
       cy.visit('/dashboard')
       cy.get('[data-testid="new-habit-button"]').click()
       cy.get('[data-testid="habit-title"]').type('Exercise')
       cy.get('[data-testid="save-habit"]').click()
       cy.contains('Exercise').should('be.visible')
     })
   })
   ```

## Implementation Order:
1. **Week 1: Foundation**
   - Set up database schema (Phase 1)
   - Implement authentication
   - Create basic API endpoints

2. **Week 2: Core Features**
   - Implement habits CRUD
   - Set up goals system
   - Create entries tracking

3. **Week 3: Frontend Base**
   - Set up Next.js structure
   - Implement basic layouts
   - Create core components

4. **Week 4: Advanced Features**
   - Implement analytics
   - Add widgets system
   - Create visualization components

5. **Week 5: Polish**
   - Add animations
   - Implement real-time updates
   - Add progressive web app features

6. **Week 6: Testing & Launch**
   - Write unit tests
   - Perform E2E testing
   - Deploy to production

---

## Current Context
- **Active Document**: /supabase/migrations/pages/01_auth.sql
- **Cursor Position**: Line 42
- **Other Open Documents**:
  - /supabase/migrations/pages/04_entries.sql
  - /supabase/migrations/20240103_setup.sql
  - /src/app/api/admin/setup/route.ts
  - /src/app/login/layout.tsx
  - /src/hooks/useRealtimeData.ts
