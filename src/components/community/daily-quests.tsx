'use client'

import { Clock, Trophy, XCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Gamification } from '@/types/community'
import { formatDistanceToNow } from 'date-fns'

interface DailyQuestsProps {
  quests: Gamification['dailyQuests']
  onCompleteQuest: (id: string) => void
}

export function DailyQuests({ quests, onCompleteQuest }: DailyQuestsProps) {
  const activeQuests = quests.filter(q => !q.completed && new Date(q.expiresAt) > new Date())
  const completedQuests = quests.filter(q => q.completed)
  const expiredQuests = quests.filter(q => new Date(q.expiresAt) <= new Date() && !q.completed)

  const totalPoints = activeQuests.reduce((acc, quest) => acc + quest.points, 0)
  const progress = (completedQuests.length / quests.length) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Daily Quests
          </span>
          <span className="text-sm font-normal text-muted-foreground">
            {totalPoints} points available
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{completedQuests.length}/{quests.length} completed</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} />
          </div>

          <div className="space-y-4">
            {activeQuests.map((quest) => (
              <div
                key={quest.id}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div className="space-y-1">
                  <h4 className="font-medium">{quest.title}</h4>
                  <p className="text-sm text-muted-foreground">{quest.description}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>
                      Expires {formatDistanceToNow(new Date(quest.expiresAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-sm font-medium">+{quest.points} pts</span>
                  <Button
                    size="sm"
                    onClick={() => onCompleteQuest(quest.id)}
                  >
                    Complete
                  </Button>
                </div>
              </div>
            ))}

            {completedQuests.map((quest) => (
              <div
                key={quest.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-muted/50"
              >
                <div className="space-y-1">
                  <h4 className="font-medium line-through">{quest.title}</h4>
                  <p className="text-sm text-muted-foreground line-through">
                    {quest.description}
                  </p>
                </div>
                <span className="text-sm font-medium text-green-600">Completed</span>
              </div>
            ))}

            {expiredQuests.map((quest) => (
              <div
                key={quest.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-destructive/10"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-muted-foreground">{quest.title}</h4>
                    <XCircle className="h-4 w-4 text-destructive" />
                  </div>
                  <p className="text-sm text-muted-foreground">{quest.description}</p>
                </div>
                <span className="text-sm font-medium text-destructive">Expired</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
