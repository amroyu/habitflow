export interface SuccessStory {
  id: string
  userId: string
  title: string
  content: string
  goalId?: string
  habitId?: string
  images?: string[]
  likes: number
  comments: number
  createdAt: string
  tags: string[]
  author: {
    name: string
    avatar?: string
    level: number
    achievements: string[]
  }
  metrics?: {
    timeSpent?: string
    progressRate?: number
    keyMilestones?: string[]
  }
  social?: SocialFeatures
  featured?: boolean
  verified?: boolean
  resources?: {
    id: string
    type: string
    title: string
    url: string
  }[]
}

export interface Challenge {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  participants: number
  type: 'individual' | 'team'
  category: string
  rewards: {
    points: number
    badges: string[]
    achievements: string[]
  }
  rules: string[]
  leaderboard: LeaderboardEntry[]
  status: 'upcoming' | 'active' | 'completed'
}

export interface LeaderboardEntry {
  userId: string
  username: string
  avatar?: string
  score: number
  rank: number
  points: number
  achievements: string[]
  level: number
  teamId?: string
}

export interface CommunityProfile {
  userId: string
  username: string
  avatar?: string
  bio: string
  level: number
  points: number
  badges: string[]
  achievements: string[]
  followers: number
  following: number
  sharedGoals: number
  sharedHabits: number
  successStories: number
  challengesWon: number
  joinedDate: string
  location?: string
  interests: string[]
  currentStreak: number
  longestStreak: number
  mentoring?: {
    isMentor: boolean
    mentees: number
    specialties: string[]
    availability: boolean
  }
  stats: {
    totalPoints: number
    challengesCompleted: number
    goalsAchieved: number
    habitsFormed: number
    perfectDays: number
    contributionStreak: number
  }
  preferences: {
    visibility: 'public' | 'private' | 'friends'
    notifications: string[]
    themes: string[]
    language: string
  }
}

export interface Comment {
  id: string
  userId: string
  content: string
  likes: number
  createdAt: string
  replies?: Comment[]
}

export interface TrendingTopic {
  id: string
  name: string
  count: number
  category: 'goal' | 'habit' | 'challenge' | 'general'
  description: string
  relatedTopics: string[]
}

export interface CommunityEvent {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  type: 'workshop' | 'webinar' | 'challenge' | 'meetup'
  host: {
    id: string
    name: string
    avatar?: string
  }
  participants: number
  maxParticipants?: number
  location?: string
  isOnline: boolean
  tags: string[]
  registrationDeadline: string
}

export interface ActivityFeedItem {
  id: string
  userId: string
  username: string
  userAvatar?: string
  type: 'milestone' | 'goal' | 'challenge' | 'achievement' | 'streak' | 'event'
  action: string
  target: string
  timestamp: string
  details?: {
    points?: number
    streak?: number
    progress?: number
    achievement?: string
  }
}

export interface AchievementCategory {
  id: string
  name: string
  description: string
  achievements: Achievement[]
  icon: string
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  points: number
  criteria: {
    type: 'streak' | 'completion' | 'points' | 'participation'
    target: number
    timeframe?: 'daily' | 'weekly' | 'monthly' | 'all-time'
  }
  unlockedBy: number
  progress?: number
}

export interface CommunityGroup {
  id: string
  name: string
  description: string
  category: string
  members: number
  avatar?: string
  isPrivate: boolean
  tags: string[]
  activities: ActivityFeedItem[]
  rules: string[]
  moderators: string[]
  createdAt: string
}

export interface Notification {
  userId: string
  type: 'mention' | 'like' | 'comment' | 'achievement' | 'challenge' | 'milestone' | 'follow'
  title: string
  message: string
  read: boolean
  timestamp: string
  actionUrl?: string
  sender?: {
    id: string
    name: string
    avatar?: string
  }
}

export interface Streak {
  userId: string
  type: 'daily' | 'weekly' | 'monthly'
  count: number
  startDate: string
  lastCheckin: string
  habitId?: string
  goalId?: string
}

export interface Reward {
  id: string
  title: string
  description: string
  type: 'badge' | 'title' | 'theme' | 'feature' | 'points'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  icon: string
  requirements: {
    type: 'streak' | 'points' | 'achievements' | 'challenges' | 'referrals'
    count: number
  }
  unlockedBy: number
  pointValue?: number
}

export interface UserLevel {
  level: number
  currentPoints: number
  pointsToNextLevel: number
  title: string
  perks: string[]
  badge: string
}

export interface CommunityChallenge extends Challenge {
  teams?: {
    id: string
    name: string
    members: string[]
    score: number
    rank: number
  }[]
  milestones: {
    title: string
    description: string
    points: number
    completedBy: number
  }[]
  leaderboard: LeaderboardEntry[]
  discussions: {
    id: string
    userId: string
    message: string
    timestamp: string
    likes: number
    replies: number
  }[]
}

export interface Mentor {
  userId: string
  name: string
  avatar?: string
  specialties: string[]
  experience: number
  rating: number
  reviews: number
  availability: {
    days: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday')[]
    timeSlots: string[]
  }
  achievements: string[]
  mentees: number
  bio: string
}

export interface ResourceHub {
  id: string
  title: string
  type: 'article' | 'video' | 'guide' | 'template' | 'tool'
  category: string
  description: string
  content: string
  author: {
    id: string
    name: string
    avatar?: string
    credentials?: string[]
  }
  likes: number
  saves: number
  views: number
  tags: string[]
  createdAt: string
  estimatedReadTime?: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

export interface SocialFeatures {
  reactions: {
    type: '👍' | '🎉' | '🎯' | '💪' | '🌟' | '🔥'
    count: number
    users: string[]
  }[]
  sharing: {
    platform: 'twitter' | 'facebook' | 'linkedin' | 'whatsapp'
    count: number
  }[]
  bookmarks: number
  reports: number
}

export interface Gamification {
  dailyQuests: {
    id: string
    title: string
    description: string
    points: number
    completed: boolean
    expiresAt: string
  }[]
  achievements: Achievement[]
  streaks: Streak[]
  level: UserLevel
  rewards: Reward[]
  rank: {
    current: number
    total: number
    percentile: number
  }
}
