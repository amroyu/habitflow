"use client";

import { Achievement, AchievementCategory } from "@/types/community";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Star, Clock, Users } from "lucide-react";

interface AchievementsSectionProps {
  categories: AchievementCategory[];
}

export function AchievementsSection({ categories }: AchievementsSectionProps) {
  const getRarityColor = (rarity: Achievement["rarity"]) => {
    switch (rarity) {
      case "common":
        return "bg-gray-500/10 text-gray-500";
      case "rare":
        return "bg-blue-500/10 text-blue-500";
      case "epic":
        return "bg-purple-500/10 text-purple-500";
      case "legendary":
        return "bg-yellow-500/10 text-yellow-500";
    }
  };

  const getCriteriaIcon = (type: Achievement["criteria"]["type"]) => {
    switch (type) {
      case "streak":
        return <Clock className="h-4 w-4" />;
      case "completion":
        return <Trophy className="h-4 w-4" />;
      case "points":
        return <Star className="h-4 w-4" />;
      case "participation":
        return <Users className="h-4 w-4" />;
    }
  };

  return (
    <Tabs defaultValue={categories[0]?.id} className="space-y-6">
      <TabsList className="w-full justify-start">
        {categories.map((category) => (
          <TabsTrigger key={category.id} value={category.id}>
            {category.name}
          </TabsTrigger>
        ))}
      </TabsList>

      {categories.map((category) => (
        <TabsContent key={category.id} value={category.id}>
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Trophy className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>{category.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <ScrollArea className="h-[500px]">
              <div className="grid gap-4">
                {category.achievements.map((achievement) => (
                  <Card key={achievement.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{achievement.name}</h3>
                            <Badge className={getRarityColor(achievement.rarity)}>
                              {achievement.rarity}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {achievement.description}
                          </p>
                        </div>
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Trophy className="h-6 w-6 text-primary" />
                        </div>
                      </div>

                      <div className="mt-4 space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-2">
                            {getCriteriaIcon(achievement.criteria.type)}
                            <span>
                              {achievement.criteria.type === "streak" && "Maintain streak for"}
                              {achievement.criteria.type === "completion" && "Complete"}
                              {achievement.criteria.type === "points" && "Earn"}
                              {achievement.criteria.type === "participation" && "Participate in"}
                              {" "}
                              {achievement.criteria.target}
                              {achievement.criteria.type === "streak" && " days"}
                              {achievement.criteria.type === "points" && " points"}
                              {achievement.criteria.type === "participation" && " events"}
                            </span>
                          </div>
                          <Badge variant="outline">+{achievement.points} points</Badge>
                        </div>

                        {achievement.progress !== undefined && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>{achievement.progress}%</span>
                            </div>
                            <Progress value={achievement.progress} />
                          </div>
                        )}

                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>Unlocked by {achievement.unlockedBy} users</span>
                          {achievement.criteria.timeframe && (
                            <Badge variant="secondary">
                              {achievement.criteria.timeframe}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
