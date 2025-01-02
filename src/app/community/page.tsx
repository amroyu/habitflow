'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Users,
  Trophy,
  Target,
  Calendar,
  Users2 as UserGroup,
  TrendingUp,
  Award,
  BookOpen,
  MessageSquare,
  Search,
  Filter
} from "lucide-react"
import { NotificationsPanel } from "@/components/community/notifications-panel"
import { DailyQuests } from "@/components/community/daily-quests"
import { ResourcesSection } from "@/components/community/resources-section"
import { ActivityFeedSection } from "@/components/community/activity-feed-section"
import { SuccessStoriesSection } from "@/components/community/success-stories-section"
import { ChallengesSection } from "@/components/community/challenges-section"
import { EventsSection } from "@/components/community/events-section"
import { GroupsSection } from "@/components/community/groups-section"
import { LeaderboardSection } from "@/components/community/leaderboard-section"
import { AchievementsSection } from "@/components/community/achievements-section"
import { type Notification } from "@/types/community"
import { type ResourceHub } from "@/types/resources"

const mockSuccessStories: any[] = [
  {
    id: '1',
    userId: '1',
    title: 'How I Lost 30 Pounds in 6 Months',
    content: 'My journey started when I decided to take control of my health...',
    likes: 156,
    comments: 23,
    createdAt: '2023-12-20T10:00:00Z',
    tags: ['weight-loss', 'fitness', 'healthy-eating'],
    author: {
      name: 'Sarah Chen',
      avatar: '/avatars/sarah.jpg',
      level: 15,
      achievements: ['Weight Loss Master', 'Consistency King']
    },
    metrics: {
      timeSpent: '6 months',
      progressRate: 85,
      keyMilestones: ['First 5 pounds', '10 pounds milestone', 'Halfway there']
    }
  }
]

const mockEvents: any[] = [
  {
    id: '1',
    title: 'Mindfulness Workshop',
    description: 'Learn meditation techniques from experts',
    startDate: '2024-01-15T14:00:00Z',
    endDate: '2024-01-15T16:00:00Z',
    type: 'workshop',
    host: {
      id: '1',
      name: 'Dr. Sarah Wilson',
      avatar: '/avatars/sarah-wilson.jpg'
    },
    participants: 45,
    maxParticipants: 100,
    isOnline: true,
    tags: ['meditation', 'mindfulness', 'wellness'],
    registrationDeadline: '2024-01-14T23:59:59Z'
  }
]

const mockTrendingTopics: any[] = [
  {
    id: '1',
    name: 'Morning Routine',
    count: 1234,
    category: 'habit',
    description: 'Building effective morning routines',
    relatedTopics: ['productivity', 'meditation', 'exercise']
  }
]

const mockActivityFeed: any[] = [
  {
    id: '1',
    userId: '1',
    username: 'Sarah Chen',
    userAvatar: '/avatars/sarah.jpg',
    type: 'achievement',
    action: 'unlocked',
    target: 'Early Bird Champion',
    timestamp: '2023-12-26T22:00:00Z',
    details: {
      points: 500,
      achievement: 'Wake up at 6 AM for 30 days straight'
    }
  }
]

const mockGroups: any[] = [
  {
    id: '1',
    name: 'Early Birds Club',
    description: 'For people committed to waking up early',
    category: 'lifestyle',
    members: 1234,
    avatar: '/groups/early-birds.jpg',
    isPrivate: false,
    tags: ['morning-routine', 'productivity', 'wellness'],
    activities: [],
    rules: ['Be supportive', 'Share your progress', 'No spam'],
    moderators: ['1'],
    createdAt: '2023-01-01T00:00:00Z'
  }
]

const notifications: Notification[] = [
  {
    userId: "user1",
    type: "achievement" as const,
    title: "New Achievement Unlocked!",
    message: "You've completed your first 7-day streak",
    read: false,
    timestamp: new Date().toISOString(),
    sender: {
      id: "system",
      name: "System",
      avatar: "/system-avatar.png"
    }
  },
  // Add more notifications...
]

const dailyQuests = [
  {
    id: "1",
    title: "Complete 3 Tasks",
    description: "Complete any 3 tasks from your todo list",
    points: 50,
    completed: false,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  },
  // Add more quests...
]

const mockResources: ResourceHub[] = [
  {
    id: "1",
    title: "The Science of Habit Formation",
    description: "Learn the psychological principles behind forming lasting habits and how to apply them in your daily life.",
    type: "article",
    url: "https://example.com/habit-formation",
    author: {
      id: "1",
      name: "Dr. Sarah Chen",
      avatar: "/avatars/sarah.jpg",
      credentials: ["Ph.D. in Psychology", "Habit Formation Expert"]
    },
    thumbnail: "/thumbnails/habit-science.jpg",
    tags: ["psychology", "habit-formation", "science", "behavior-change"],
    likes: 342,
    saves: 156,
    dateAdded: "2024-12-20",
    readTime: "8 min read",
    difficulty: "intermediate",
    isPremium: false
  },
  {
    id: "2",
    title: "Building a Morning Routine That Sticks",
    description: "A comprehensive guide to creating and maintaining a productive morning routine.",
    type: "video",
    url: "https://example.com/morning-routine",
    author: {
      id: "2",
      name: "Alex Thompson",
      avatar: "/avatars/alex.jpg",
      credentials: ["Certified Life Coach", "Productivity Expert"]
    },
    thumbnail: "/thumbnails/morning-routine.jpg",
    tags: ["morning-routine", "productivity", "habits", "lifestyle"],
    likes: 567,
    saves: 289,
    dateAdded: "2024-12-18",
    readTime: "15 min watch",
    difficulty: "beginner",
    isPremium: false
  },
  {
    id: "3",
    title: "Advanced Habit Tracking Techniques",
    description: "Master advanced methods for tracking and optimizing your habits using data and analytics.",
    type: "course",
    url: "https://example.com/habit-tracking",
    author: {
      id: "3",
      name: "Michael Wright",
      avatar: "/avatars/michael.jpg",
      credentials: ["Data Scientist", "Behavioral Analyst"]
    },
    thumbnail: "/thumbnails/habit-tracking.jpg",
    tags: ["habit-tracking", "data-analysis", "optimization", "advanced"],
    likes: 234,
    saves: 178,
    dateAdded: "2024-12-15",
    readTime: "4 hours course",
    difficulty: "advanced",
    isPremium: true
  },
  {
    id: "4",
    title: "Habit Stacking: Ultimate Guide",
    description: "Learn how to combine multiple habits for maximum effectiveness and efficiency.",
    type: "book",
    url: "https://example.com/habit-stacking",
    author: {
      id: "4",
      name: "Emma Davis",
      avatar: "/avatars/emma.jpg",
      credentials: ["Bestselling Author", "Behavioral Coach"]
    },
    thumbnail: "/thumbnails/habit-stacking.jpg",
    tags: ["habit-stacking", "productivity", "efficiency", "lifestyle"],
    likes: 789,
    saves: 432,
    dateAdded: "2024-12-10",
    readTime: "6 hour read",
    difficulty: "intermediate",
    isPremium: false
  },
  {
    id: "5",
    title: "HabitFlow Pro Tools",
    description: "A collection of premium tools and templates for advanced habit tracking and analysis.",
    type: "tool",
    url: "https://example.com/habitflow-pro",
    author: {
      id: "5",
      name: "HabitFlow Team",
      avatar: "/avatars/team.jpg",
      credentials: ["Official Resource"]
    },
    thumbnail: "/thumbnails/habitflow-pro.jpg",
    tags: ["tools", "templates", "tracking", "premium"],
    likes: 456,
    saves: 321,
    dateAdded: "2024-12-05",
    readTime: "Various tools",
    difficulty: "intermediate",
    isPremium: true
  }
];

const resources: ResourceHub[] = [
  {
    id: "1",
    title: "Building Lasting Habits: A Comprehensive Guide",
    type: "article" as const,
    category: "Habit Formation",
    description: "Learn the science behind habit formation and practical strategies to build lasting habits.",
    content: "...",
    author: {
      id: "author1",
      name: "Jane Smith",
      avatar: "/avatars/jane.png",
      credentials: ["Certified Coach", "PhD in Psychology"]
    },
    likes: 245,
    saves: 123,
    views: 1502,
    tags: ["habits", "productivity", "psychology"],
    createdAt: new Date().toISOString(),
    estimatedReadTime: 8,
    difficulty: "beginner" as const
  },
  // Add more resources...
]

export default function CommunityPage() {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("feed")
  const [searchQuery, setSearchQuery] = useState("")

  // Initialize state with empty arrays to prevent hydration mismatch
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [dailyQuests, setDailyQuests] = useState<any[]>([])
  const [resources, setResources] = useState<ResourceHub[]>([])
  const [stats, setStats] = useState({
    activeMembers: '0',
    achievements: '0',
    activeChallenges: '0',
    goalsAchieved: '0'
  })

  // Load data after component mounts on client
  useEffect(() => {
    // Mock data loading
    setNotifications([
      {
        userId: "user1",
        type: "achievement" as const,
        title: "New Achievement Unlocked!",
        message: "You've completed your first 7-day streak",
        read: false,
        timestamp: new Date().toISOString(),
        sender: {
          id: "system",
          name: "System",
          avatar: "/system-avatar.png"
        }
      }
    ])

    setDailyQuests([
      {
        id: "1",
        title: "Complete 3 Tasks",
        description: "Complete any 3 tasks from your todo list",
        points: 50,
        completed: false,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      }
    ])

    setResources(mockResources)

    setStats({
      activeMembers: '2.4k',
      achievements: '856',
      activeChallenges: '12',
      goalsAchieved: '1.2k'
    })

    setMounted(true)
  }, [])

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Community</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-background rounded-lg border p-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search community..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 focus-visible:ring-0"
            />
            <Button variant="ghost" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          <NotificationsPanel
            notifications={notifications}
            onMarkAsRead={(userId) => {
              setNotifications(prev =>
                prev.map(n => n.userId === userId ? { ...n, read: true } : n)
              )
            }}
            onClearAll={() => setNotifications([])}
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-8 w-full">
              <TabsTrigger value="feed" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Feed
              </TabsTrigger>
              <TabsTrigger value="success-stories">
                <Trophy className="h-4 w-4" />
                Success Stories
              </TabsTrigger>
              <TabsTrigger value="challenges">
                <Target className="h-4 w-4" />
                Challenges
              </TabsTrigger>
              <TabsTrigger value="events">
                <Calendar className="h-4 w-4" />
                Events
              </TabsTrigger>
              <TabsTrigger value="groups">
                <UserGroup className="h-4 w-4" />
                Groups
              </TabsTrigger>
              <TabsTrigger value="leaderboard">
                <TrendingUp className="h-4 w-4" />
                Leaderboard
              </TabsTrigger>
              <TabsTrigger value="achievements">
                <Award className="h-4 w-4" />
                Achievements
              </TabsTrigger>
              <TabsTrigger value="resources">
                <BookOpen className="h-4 w-4" />
                Resources
              </TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="feed" className="space-y-6">
                <ActivityFeedSection activities={mockActivityFeed} />
              </TabsContent>

              <TabsContent value="success-stories" className="space-y-6">
                <SuccessStoriesSection stories={mockSuccessStories} />
              </TabsContent>

              <TabsContent value="challenges" className="space-y-6">
                <ChallengesSection challenges={[
                  {
                    id: '1',
                    title: '30 Days of Morning Routine',
                    description: 'Build a consistent morning routine for 30 days',
                    startDate: '2024-01-01T00:00:00Z',
                    endDate: '2024-01-30T23:59:59Z',
                    participants: 245,
                    type: 'individual',
                    category: 'Habits',
                    rewards: {
                      points: 1000,
                      badges: ['Early Bird', 'Consistency Master'],
                      achievements: ['Morning Champion']
                    },
                    rules: [
                      'Wake up before 7 AM',
                      'Complete morning routine checklist',
                      'Log your progress daily'
                    ],
                    leaderboard: [],
                    status: 'active'
                  }
                ]} />
              </TabsContent>

              <TabsContent value="events" className="space-y-6">
                <EventsSection events={mockEvents} />
              </TabsContent>

              <TabsContent value="groups" className="space-y-6">
                <GroupsSection groups={[
                  {
                    id: '1',
                    name: 'Mindfulness Masters',
                    description: 'A group dedicated to mindfulness and meditation practices',
                    category: 'Wellness',
                    members: 1234,
                    isPrivate: false,
                    tags: ['meditation', 'mindfulness', 'wellness'],
                    activities: [],
                    rules: [
                      'Be respectful and supportive',
                      'Share your experiences',
                      'No promotional content'
                    ],
                    moderators: ['mod1', 'mod2'],
                    createdAt: '2023-12-01T00:00:00Z'
                  }
                ]} />
              </TabsContent>

              <TabsContent value="leaderboard" className="space-y-6">
                <LeaderboardSection 
                  entries={[
                    {
                      userId: '1',
                      username: 'Sarah Chen',
                      avatar: '/avatars/sarah.jpg',
                      score: 1500,
                      points: 15000,
                      achievements: ['Early Bird', 'Streak Master', 'Productivity Pro'],
                      level: 15
                    },
                    ...Array.from({ length: 338 }, (_, i) => ({
                      userId: `user-${i + 2}`,
                      username: `User ${i + 2}`,
                      avatar: '/avatars/default.jpg',
                      score: 15000 - (i * 30),
                      points: 150000 - (i * 300),
                      achievements: ['Achievement 1', 'Achievement 2'],
                      level: Math.max(1, Math.floor((150000 - (i * 300)) / 10000))
                    })),
                    {
                      userId: 'current-user',
                      username: 'You',
                      avatar: '/avatars/default.jpg',
                      score: 1000,
                      points: 10000,
                      achievements: ['Getting Started', 'First Week'],
                      level: 10
                    }
                  ]} 
                  currentUserId="current-user"
                />
              </TabsContent>

              <TabsContent value="achievements" className="space-y-6">
                <AchievementsSection categories={[
                  {
                    id: 'habits',
                    name: 'Habit Master',
                    description: 'Achievements related to forming and maintaining habits',
                    achievements: [
                      {
                        id: '1',
                        name: 'Early Bird',
                        description: 'Wake up early for 30 days straight',
                        icon: 'sun',
                        rarity: 'rare',
                        points: 500,
                        criteria: {
                          type: 'streak',
                          target: 30,
                          timeframe: 'monthly'
                        },
                        unlockedBy: 156,
                        progress: 60
                      }
                    ],
                    icon: 'trophy'
                  }
                ]} />
              </TabsContent>

              <TabsContent value="resources" className="space-y-6">
                <ResourcesSection resources={mockResources} />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <div className="col-span-4 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold">Quick Stats</h3>
                <Badge variant="secondary">This Week</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Active Members</p>
                  <p className="text-2xl font-bold">{stats.activeMembers}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Achievements</p>
                  <p className="text-2xl font-bold">{stats.achievements}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Active Challenges</p>
                  <p className="text-2xl font-bold">{stats.activeChallenges}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Goals Achieved</p>
                  <p className="text-2xl font-bold">{stats.goalsAchieved}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <DailyQuests
            quests={dailyQuests}
            onCompleteQuest={(id) => {
              setDailyQuests(prev =>
                prev.map(q => q.id === id ? { ...q, completed: true } : q)
              )
            }}
          />

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Trending Topics</h3>
              <div className="space-y-4">
                {['Meditation', 'Time Management', 'Exercise', 'Reading'].map((topic) => (
                  <div
                    key={topic}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <span className="font-medium">{topic}</span>
                    <Badge variant="secondary">
                      {Math.floor(Math.random() * 100)}+ posts
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Upcoming Events</h3>
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="p-4 rounded-lg border space-y-2 hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      <Badge>Workshop</Badge>
                      <h4 className="font-medium">Building Better Habits</h4>
                      <p className="text-sm text-muted-foreground">
                        Join us for an interactive session on building lasting habits
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Tomorrow at 2:00 PM</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>24 attendees</span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
