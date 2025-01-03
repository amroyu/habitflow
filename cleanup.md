# HabitFlow Cleanup Plan

## Files to Remove
1. `/src/components/widgets/stopwatch.tsx`
2. `/src/components/widgets/countdown.tsx`
3. `/src/components/widgets/counter.tsx`

## Code to Consolidate

### Timer Components
Consolidate all timer functionality into:
- `/src/components/widgets/pomodoro-timer.tsx`
- `/src/components/quick-timer.tsx`

### Type Definitions
Move all shared types to `/src/types/index.ts`:
- Timer types
- Widget types
- Activity types

## Import Cleanup

### UI Components
Remove unused imports from:
1. `/src/components/layout/navbar.tsx`:
```typescript
// Remove unused imports
import { Moon, HelpCircle, Bell } from 'lucide-react'
```

2. `/src/components/timeline/timeline.tsx`:
```typescript
// Remove unused imports
import { Group, GitBranch } from 'lucide-react'
```

3. `/src/components/dashboard/dashboard-header.tsx`:
```typescript
// Remove unused imports
import { Badge } from '@/components/ui/badge'
```

## Component Optimization

### Widget Picker
Optimize `/src/components/widgets/widget-picker.tsx`:
- Remove unused widget types
- Consolidate widget categories
- Clean up unused icon imports

### Timeline Component
Optimize `/src/components/timeline/timeline.tsx`:
- Remove duplicate filter logic
- Consolidate type filtering functions

## Type Definition Cleanup

1. Remove duplicate interfaces:
```typescript
// Remove from individual files and keep only in /src/types/index.ts
interface TimerConfig
interface WidgetProps
interface ActivityLog
```

2. Consolidate shared types:
```typescript
// Keep in /src/types/index.ts
export type WidgetType = 'timer' | 'habit' | 'goal' | 'note'
export type ActivityType = 'created' | 'completed' | 'updated'
```

## Steps to Execute Cleanup

1. **Backup**
   - Create a backup branch before making changes
   - Test each component after removal

2. **Remove Unused Files**
   - Delete identified unused component files
   - Update any import references

3. **Consolidate Types**
   - Move all types to central location
   - Update import paths

4. **Clean Imports**
   - Remove unused imports
   - Sort and organize remaining imports

5. **Test**
   - Verify all features still work
   - Check for any runtime errors
   - Validate UI consistency

## Note
These changes have been carefully selected to not affect the current UI or functionality. All removals are for unused or duplicate code only.
