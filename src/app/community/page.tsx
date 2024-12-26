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
import { ResourceCard } from "@/components/community/resource-card"
import { type Notification, type ResourceHub } from "@/types/community"

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

    setResources([
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
      }
    ])

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
                {/* Feed content */}
              </TabsContent>

              <TabsContent value="success-stories" className="space-y-6">
                {/* Success stories content */}
              </TabsContent>

              <TabsContent value="challenges" className="space-y-6">
                {/* Challenges content */}
              </TabsContent>

              <TabsContent value="events" className="space-y-6">
                {/* Events content */}
              </TabsContent>

              <TabsContent value="groups" className="space-y-6">
                {/* Groups content */}
              </TabsContent>

              <TabsContent value="leaderboard" className="space-y-6">
                {/* Leaderboard content */}
              </TabsContent>

              <TabsContent value="achievements" className="space-y-6">
                {/* Achievements content */}
              </TabsContent>

              <TabsContent value="resources" className="space-y-6">
                <div className="grid gap-6">
                  {resources.map((resource) => (
                    <ResourceCard
                      key={resource.id}
                      resource={resource}
                      onLike={(id) => console.log('Like resource:', id)}
                      onSave={(id) => console.log('Save resource:', id)}
                      onShare={(id) => console.log('Share resource:', id)}
                    />
                  ))}
                </div>
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
