import { Goal, RoadMapTemplate, Milestone } from '@/types'

const today = new Date().toISOString().split('T')[0]

export interface MockHabit {
  id: string;
  title: string;
  description?: string;
  frequency: string;
  type: 'good' | 'bad';
  streak: number;
  progress: number;
  lastCompleted?: string;
}

export const mockHabits: MockHabit[] = [
  {
    id: '1',
    title: 'Morning Meditation',
    description: 'Start each day with 10 minutes of meditation',
    frequency: 'daily',
    type: 'good',
    streak: 5,
    progress: 80,
    lastCompleted: today
  },
  {
    id: '2',
    title: 'Read Books',
    description: 'Read for at least 30 minutes',
    frequency: 'daily',
    type: 'good',
    streak: 3,
    progress: 60,
    lastCompleted: today
  },
  {
    id: '3',
    title: 'Late Night Snacking',
    description: 'Avoid eating after 8 PM',
    frequency: 'daily',
    type: 'bad',
    streak: 2,
    progress: 40,
    lastCompleted: today
  }
];

export const mockGoals: Goal[] = [
  {
    id: '1',
    title: 'Learn TypeScript',
    description: 'Master TypeScript fundamentals and advanced concepts',
    type: 'do',
    category: 'Learning',
    startDate: '2024-01-01',
    endDate: '2024-03-31',
    progress: 75,
    lastUpdated: today,
    completed: false,
    streak: {
      currentStreak: 5,
      longestStreak: 7,
      lastUpdated: today
    },
    entries: [],
    milestones: [
      {
        id: '1-1',
        title: 'Complete TypeScript Basics',
        description: 'Learn basic TypeScript concepts',
        dueDate: '2024-01-15',
        completed: true,
        frequency: 'daily'
      },
      {
        id: '1-2',
        title: 'Build a TypeScript Project',
        description: 'Create a project using TypeScript',
        dueDate: '2024-02-15',
        completed: true,
        frequency: 'daily'
      }
    ]
  },
  {
    id: '2',
    title: 'Stop Procrastinating',
    description: 'Break the habit of procrastination',
    type: 'dont',
    category: 'Productivity',
    startDate: '2024-01-01',
    endDate: '2024-06-30',
    progress: 60,
    lastUpdated: today,
    completed: false,
    streak: {
      currentStreak: 3,
      longestStreak: 5,
      lastUpdated: today
    },
    entries: [],
    milestones: [
      {
        id: '2-1',
        title: 'Complete Daily Tasks on Time',
        description: 'Finish tasks before deadlines',
        dueDate: '2024-01-31',
        completed: false,
        frequency: 'daily'
      }
    ]
  }
];

export const mockRoadMapTemplates: RoadMapTemplate[] = [];
