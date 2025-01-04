import { Goal, RoadMapTemplate, Milestone, Resource } from "@/types";

const today = new Date().toISOString().split("T")[0];

export interface MockHabit {
  id: string;
  title: string;
  description?: string;
  frequency: string;
  type: "good" | "bad";
  streak: number;
  progress: number;
  lastCompleted?: string;
}

export const mockHabits: MockHabit[] = [
  {
    id: "1",
    title: "Morning Meditation",
    description: "Start each day with 10 minutes of meditation",
    frequency: "daily",
    type: "good",
    streak: 5,
    progress: 80,
    lastCompleted: today,
  },
  {
    id: "2",
    title: "Read Books",
    description: "Read for at least 30 minutes",
    frequency: "daily",
    type: "good",
    streak: 3,
    progress: 60,
    lastCompleted: today,
  },
  {
    id: "3",
    title: "Late Night Snacking",
    description: "Avoid eating after 8 PM",
    frequency: "daily",
    type: "bad",
    streak: 2,
    progress: 40,
    lastCompleted: today,
  },
];

export interface TimerTask {
  id: string;
  title: string;
  duration: number;
  createdAt: string;
  completed: boolean;
  archived: boolean;
  category: string;
  notes?: string;
}

export const mockTimerTasks: TimerTask[] = [
  {
    id: '1',
    title: 'fdsfsd',
    duration: 1800,
    createdAt: '2025-01-03T14:02:00+03:00',
    completed: true,
    archived: false,
    category: 'focus',
    notes: 'Focus session completed'
  },
  {
    id: '2',
    title: 'lklknl',
    duration: 18000,
    createdAt: '2025-01-03T11:08:00+03:00',
    completed: true,
    archived: false,
    category: 'focus',
    notes: 'Extended focus session'
  },
  {
    id: '3',
    title: 'fsdf',
    duration: 1800,
    createdAt: '2025-01-03T10:56:00+03:00',
    completed: true,
    archived: false,
    category: 'focus',
    notes: 'Morning focus session'
  },
  {
    id: '4',
    title: 'fsadsdf',
    duration: 1800,
    createdAt: '2025-01-03T02:40:00+03:00',
    completed: true,
    archived: false,
    category: 'focus',
    notes: 'Early morning focus'
  },
  {
    id: '5',
    title: 'aa',
    duration: 1800,
    createdAt: '2025-01-02T21:49:00+03:00',
    completed: true,
    archived: false,
    category: 'focus',
    notes: 'Evening focus session'
  },
  {
    id: '6',
    title: 'aa',
    duration: 1800,
    createdAt: '2025-01-02T21:48:00+03:00',
    completed: true,
    archived: false,
    category: 'focus',
    notes: 'Late evening focus'
  }
];

export interface TimelineActivity {
  type: string;
  title: string;
  content?: string;
  category?: string;
  time: Date;
  duration?: number;
  completed?: boolean;
  value?: number;
  notes?: string;
  url?: string;
  filePath?: string;
  fileType?: string;
  thumbnailUrl?: string;
  tags?: string[];
}

export const initializeMockData = () => {
  const baseDate = new Date("2025-01-03T14:34:07+03:00");
  
  const createActivityDate = (hours: number, minutes: number) => {
    return new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), hours, minutes);
  };
  
  const mockData: TimelineActivity[] = [
    // Morning activities
    {
      type: "habit",
      title: "Morning Meditation",
      content: "15 minutes mindfulness practice",
      category: "wellness",
      time: createActivityDate(7, 0),
      completed: true,
      notes: "Felt very peaceful and centered"
    },
    {
      type: "task",
      title: "Deep Work Session",
      content: "Focus on completing the project presentation",
      category: "focus",
      time: createActivityDate(9, 0),
      duration: 90,
      completed: true,
      notes: "Made significant progress on the key slides"
    },
    {
      type: "goal",
      title: "Launch MVP",
      content: "Complete core features and prepare for beta testing",
      category: "work",
      time: createActivityDate(10, 0),
      value: 75,
      notes: "Backend API is complete, frontend needs polish"
    },
    {
      type: "task",
      title: "Team Sync Meeting",
      category: "work",
      time: createActivityDate(11, 0),
      duration: 30,
      completed: true
    },
    {
      type: "files",
      title: "Q4 Performance Report.pdf",
      content: "Quarterly performance analysis and metrics",
      category: "work",
      time: createActivityDate(11, 30),
      filePath: "/documents/reports/Q4_Performance.pdf",
      fileType: "pdf"
    },
    {
      type: "files",
      title: "Project Mockups",
      content: "UI/UX design mockups for the new dashboard",
      category: "work",
      time: createActivityDate(12, 15),
      filePath: "/documents/design/mockups.fig",
      fileType: "figma"
    },
    {
      type: "goal",
      title: "Learn TypeScript",
      content: "Complete Advanced TypeScript Course",
      category: "learning",
      time: createActivityDate(13, 0),
      value: 60,
      notes: "Finished Generics module"
    },
    {
      type: "links",
      title: "Interesting Article on Productivity",
      content: "How to structure your day for maximum productivity",
      category: "learning",
      time: createActivityDate(13, 45),
      url: "https://example.com/productivity-tips",
      tags: ["productivity", "learning"]
    },
    {
      type: "kanban",
      title: "Backend API Tasks",
      content: "Moved 3 tasks to Done, 2 new tasks added to In Progress",
      category: "work",
      time: createActivityDate(14, 0),
      notes: "Sprint progress is on track"
    },
    {
      type: "note",
      title: "Project Ideas",
      content: "1. AI-powered task prioritization\n2. Integration with calendar\n3. Mobile app with offline support",
      category: "work",
      time: createActivityDate(14, 30),
      tags: ["ideas", "features", "planning"]
    },
    {
      type: "gallery",
      title: "Whiteboard Session",
      content: "Team brainstorming for new features",
      category: "work",
      time: createActivityDate(15, 0),
      thumbnailUrl: "/images/whiteboard-session.jpg",
      filePath: "/images/whiteboard-session.jpg",
      fileType: "image"
    },
    {
      type: "habit",
      title: "Daily Exercise",
      content: "30 minutes cardio workout",
      category: "wellness",
      time: createActivityDate(16, 0),
      completed: false
    },
    {
      type: "calendar",
      title: "Client Meeting",
      content: "Review project milestones with the client",
      category: "work",
      time: createActivityDate(16, 30),
      duration: 60,
      notes: "Prepare demo of new features"
    }
  ];

  localStorage.setItem('timelineActivities', JSON.stringify(mockData));
  return mockData;
};

export const mockGoals: Goal[] = [
  {
    id: "1",
    title: "Learn TypeScript",
    description: "Master TypeScript fundamentals and advanced concepts",
    type: "do",
    category: "Learning",
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    progress: 75,
    lastUpdated: today,
    completed: false,
    streak: {
      currentStreak: 5,
      longestStreak: 7,
      lastUpdated: today,
    },
    entries: [],
    milestones: [
      {
        id: "1-1",
        title: "Complete TypeScript Basics",
        description: "Learn basic TypeScript concepts",
        dueDate: "2024-01-15",
        status: "completed",
        completed: true,
        frequency: "daily",
      } as Milestone,
      {
        id: "1-2",
        title: "Build a TypeScript Project",
        description: "Create a project using TypeScript",
        dueDate: "2024-02-15",
        status: "completed",
        completed: true,
        frequency: "daily",
      } as Milestone,
    ],
  },
  {
    id: "2",
    title: "Stop Procrastinating",
    description: "Break the habit of procrastination",
    type: "dont",
    category: "Productivity",
    startDate: "2024-01-01",
    endDate: "2024-06-30",
    progress: 60,
    lastUpdated: today,
    completed: false,
    streak: {
      currentStreak: 3,
      longestStreak: 5,
      lastUpdated: today,
    },
    entries: [],
    milestones: [
      {
        id: "2-1",
        title: "Track Daily Productivity",
        description: "Log productive hours each day",
        dueDate: "2024-01-31",
        status: "in-progress",
        completed: false,
        frequency: "daily",
      } as Milestone,
    ],
  },
  {
    id: "3",
    title: "Write a Research Paper",
    description: "Write a research paper on a chosen topic",
    type: "do",
    category: "Learning",
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    progress: 50,
    lastUpdated: today,
    completed: false,
    streak: {
      currentStreak: 3,
      longestStreak: 5,
      lastUpdated: today,
    },
    entries: [],
    milestones: [
      {
        id: "3-1",
        title: "Complete Basic Research",
        description: "Research and gather information about the topic",
        dueDate: "2024-01-15",
        status: "pending",
        completed: false,
        frequency: "daily",
      },
      {
        id: "3-2",
        title: "Write First Draft",
        description: "Complete the first draft of the paper",
        dueDate: "2024-01-30",
        status: "pending",
        completed: false,
        frequency: "daily",
      },
      {
        id: "3-3",
        title: "Review and Edit",
        description: "Review and edit the first draft",
        dueDate: "2024-02-15",
        status: "pending",
        completed: false,
        frequency: "daily",
      },
    ],
  },
];

export const mockRoadmapTemplates: RoadMapTemplate[] = [
  {
    id: "1",
    title: "Learn a New Programming Language",
    description: "Step-by-step guide to master a programming language",
    finalTarget: "Build a full-stack application",
    category: "Programming",
    milestones: [
      {
        id: "1",
        title: "Learn the Basics",
        description: "Master the fundamental concepts",
        status: "pending",
        completed: false,
        frequency: "daily",
      } as Milestone,
      {
        id: "2",
        title: "Build Small Projects",
        description: "Create simple applications",
        status: "pending",
        completed: false,
        frequency: "weekly",
      } as Milestone,
    ],
  },
  {
    id: "2",
    title: "Get Fit",
    description: "Achieve your fitness goals",
    finalTarget: "Run a marathon",
    category: "Fitness",
    milestones: [
      {
        id: "1",
        title: "Start Running",
        description: "Begin with short distances",
        status: "pending",
        completed: false,
        frequency: "daily",
      } as Milestone,
      {
        id: "2",
        title: "Increase Distance",
        description: "Gradually increase running distance",
        status: "pending",
        completed: false,
        frequency: "weekly",
      } as Milestone,
    ],
  },
];

export const mockResources: Resource[] = [
  {
    id: "1",
    title: "The Science of Habit Formation",
    description:
      "A comprehensive guide to understanding how habits are formed and how to build lasting positive habits.",
    type: "article",
    url: "/resources/science-of-habits",
    author: "Dr. Sarah Johnson",
    thumbnail: "/images/resources/habit-science.jpg",
    tags: ["habit-formation", "psychology", "science"],
    likes: 1243,
    saves: 892,
    dateAdded: "2024-12-28",
    readTime: "12 min",
    difficulty: "beginner",
    isPremium: false,
  },
  {
    id: "2",
    title: "Mastering Morning Routines",
    description:
      "Learn how to create and stick to a productive morning routine that sets you up for daily success.",
    type: "video",
    url: "/resources/morning-routines",
    author: "Mark Williams",
    thumbnail: "/images/resources/morning-routine.jpg",
    tags: ["productivity", "morning-routine", "habits"],
    likes: 2891,
    saves: 1567,
    dateAdded: "2024-12-30",
    readTime: "15 min",
    difficulty: "intermediate",
    isPremium: false,
  },
  {
    id: "3",
    title: "Advanced Habit Tracking Techniques",
    description:
      "Professional strategies for tracking and optimizing your habits using data-driven approaches.",
    type: "course",
    url: "/resources/habit-tracking-pro",
    author: "Emily Chen",
    thumbnail: "/images/resources/tracking.jpg",
    tags: ["habit-tracking", "data", "productivity"],
    likes: 756,
    saves: 432,
    dateAdded: "2025-01-01",
    readTime: "2 hours",
    difficulty: "advanced",
    isPremium: true,
  },
  {
    id: "4",
    title: "Recommended Tools for Habit Building",
    description:
      "A curated list of the best apps and tools to support your habit-building journey.",
    type: "tool",
    url: "/resources/habit-tools",
    author: "Tech Review Team",
    thumbnail: "/images/resources/tools.jpg",
    tags: ["tools", "apps", "technology"],
    likes: 934,
    saves: 677,
    dateAdded: "2024-12-29",
    readTime: "8 min",
    difficulty: "beginner",
    isPremium: false,
  },
  {
    id: "5",
    title: "The Habit Loop: Breaking Bad Habits",
    description:
      "Understanding and breaking the cycle of bad habits through behavioral psychology.",
    type: "book",
    url: "/resources/habit-loop",
    author: "Dr. Michael Brown",
    thumbnail: "/images/resources/habit-loop.jpg",
    tags: ["psychology", "bad-habits", "behavior-change"],
    likes: 1567,
    saves: 1023,
    dateAdded: "2024-12-25",
    readTime: "4 hours",
    difficulty: "intermediate",
    isPremium: true,
  },
];
