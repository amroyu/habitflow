import { Goal, RoadMapTemplate } from '@/types'

const today = new Date().toISOString().split('T')[0]

export const mockGoals: Goal[] = [
  {
    id: '1',
    title: 'Learn TypeScript',
    type: 'do',
    category: 'education',
    description: 'Master TypeScript fundamentals and advanced concepts',
    startDate: '2024-01-01',
    endDate: '2024-03-31',
    progress: 75,
    streak: {
      currentStreak: 5,
      longestStreak: 7,
      lastUpdated: today
    },
    lastUpdated: today,
    milestones: [
      {
        id: '1-1',
        title: 'Complete TypeScript Basics',
        dueDate: '2024-01-15',
        completed: true
      },
      {
        id: '1-2',
        title: 'Build a TypeScript Project',
        dueDate: '2024-02-15',
        completed: true
      }
    ]
  },
  {
    id: '2',
    title: 'Stop Procrastinating',
    type: 'dont',
    category: 'personal',
    description: 'Break the habit of procrastination',
    startDate: '2024-01-01',
    endDate: '2024-06-30',
    progress: 60,
    streak: {
      currentStreak: 3,
      longestStreak: 5,
      lastUpdated: today
    },
    lastUpdated: today,
    milestones: [
      {
        id: '2-1',
        title: 'Complete Daily Tasks on Time',
        dueDate: '2024-01-31',
        completed: true
      },
      {
        id: '2-2',
        title: 'Implement Time Management System',
        dueDate: '2024-02-28',
        completed: true
      }
    ]
  },
  {
    id: '3',
    title: 'Exercise Regularly',
    type: 'do',
    category: 'health',
    description: 'Develop a consistent exercise routine',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    progress: 30,
    streak: {
      currentStreak: 2,
      longestStreak: 10,
      lastUpdated: today
    },
    lastUpdated: today,
    milestones: [
      {
        id: '3-1',
        title: 'Join a Gym',
        dueDate: '2024-01-15',
        completed: false
      },
      {
        id: '3-2',
        title: 'Work Out 3 Times a Week',
        dueDate: '2024-02-15',
        completed: false
      }
    ]
  }
]

export const mockRoadMapTemplates: RoadMapTemplate[] = [
  {
    id: '1',
    name: 'Fitness Journey',
    description: 'A comprehensive roadmap for improving physical fitness',
    category: 'Health',
    title: 'Get Fit in 90 Days',
    finalTarget: 'Achieve optimal fitness level',
    status: 'not_started',
    progress: 0,
    milestones: [
      {
        id: '1',
        title: 'Establish Workout Routine',
        description: 'Create and stick to a basic workout schedule',
        type: 'habit',
        referenceId: '1',
        order: 0,
        status: 'not_started',
        progress: 0,
        dependsOn: []
      },
      {
        id: '2',
        title: 'Nutrition Plan',
        description: 'Develop and follow a balanced nutrition plan',
        type: 'habit',
        referenceId: '2',
        order: 1,
        status: 'not_started',
        progress: 0,
        dependsOn: ['1']
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Learning Programming',
    description: 'Step-by-step guide to becoming a proficient programmer',
    category: 'Education',
    title: 'Master Programming in 6 Months',
    finalTarget: 'Build a full-stack application',
    status: 'not_started',
    progress: 0,
    milestones: [
      {
        id: '1',
        title: 'Learn Basic Syntax',
        description: 'Master fundamental programming concepts',
        type: 'goal',
        referenceId: '1',
        order: 0,
        status: 'not_started',
        progress: 0,
        dependsOn: []
      },
      {
        id: '2',
        title: 'Daily Coding Practice',
        description: 'Code for at least 1 hour every day',
        type: 'habit',
        referenceId: '3',
        order: 1,
        status: 'not_started',
        progress: 0,
        dependsOn: ['1']
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]
