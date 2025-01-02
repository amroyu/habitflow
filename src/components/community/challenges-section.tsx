"use client";

import { Challenge } from "@/types/community";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Users, Trophy, Award, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ChallengesSectionProps {
  challenges: Challenge[];
}

export function ChallengesSection({ challenges }: ChallengesSectionProps) {
  const getChallengeProgress = (challenge: Challenge) => {
    const now = new Date();
    const start = new Date(challenge.startDate);
    const end = new Date(challenge.endDate);
    const total = end.getTime() - start.getTime();
    const current = now.getTime() - start.getTime();
    return Math.min(100, Math.max(0, (current / total) * 100));
  };

  const getChallengeStatus = (challenge: Challenge) => {
    switch (challenge.status) {
      case "upcoming":
        return <Badge variant="secondary">Upcoming</Badge>;
      case "active":
        return <Badge variant="success">Active</Badge>;
      case "completed":
        return <Badge variant="default">Completed</Badge>;
    }
  };

  return (
    <ScrollArea className="h-[600px]">
      <div className="space-y-6 p-4">
        {challenges.map((challenge) => (
          <Card key={challenge.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{challenge.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {challenge.description}
                  </p>
                </div>
                {getChallengeStatus(challenge)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {formatDistanceToNow(new Date(challenge.startDate), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>{challenge.participants} participants</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{Math.round(getChallengeProgress(challenge))}%</span>
                </div>
                <Progress value={getChallengeProgress(challenge)} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-4 w-4" />
                    <span className="text-sm font-medium">Rewards</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm">+{challenge.rewards.points} points</p>
                    <div className="flex flex-wrap gap-1">
                      {challenge.rewards.badges.map((badge) => (
                        <Badge key={badge} variant="outline">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4" />
                    <span className="text-sm font-medium">Achievements</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {challenge.rewards.achievements.map((achievement) => (
                      <Badge key={achievement} variant="outline">
                        {achievement}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-sm font-medium">Rules</span>
                <ul className="list-disc list-inside space-y-1">
                  {challenge.rules.map((rule, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between">
                <Badge variant="secondary">{challenge.category}</Badge>
                <Button>Join Challenge</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
