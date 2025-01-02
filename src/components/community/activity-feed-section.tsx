"use client";

import { ActivityFeedItem } from "@/types/community";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { Trophy, Target, Award, MessageSquare, Heart } from "lucide-react";

interface ActivityFeedSectionProps {
  activities: ActivityFeedItem[];
}

export function ActivityFeedSection({ activities }: ActivityFeedSectionProps) {
  const getActivityIcon = (type: ActivityFeedItem["type"]) => {
    switch (type) {
      case "milestone":
        return <Trophy className="h-4 w-4" />;
      case "challenge":
        return <Target className="h-4 w-4" />;
      case "achievement":
        return <Award className="h-4 w-4" />;
      case "streak":
        return <Heart className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: ActivityFeedItem["type"]) => {
    switch (type) {
      case "milestone":
        return "bg-yellow-500/10 text-yellow-500";
      case "challenge":
        return "bg-purple-500/10 text-purple-500";
      case "achievement":
        return "bg-blue-500/10 text-blue-500";
      case "streak":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  return (
    <ScrollArea className="h-[600px]">
      <div className="space-y-4 p-4">
        {activities.map((activity) => (
          <Card key={activity.id}>
            <CardContent className="p-4">
              <div className="flex items-start space-x-4">
                <Avatar>
                  <AvatarImage src={activity.userAvatar} alt={activity.username} />
                  <AvatarFallback>{activity.username[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{activity.username}</span>
                      <Badge variant="secondary">{activity.type}</Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {activity.action} {activity.target}
                  </p>
                  {activity.details && (
                    <div className="mt-2 flex items-center space-x-4">
                      {activity.details.points && (
                        <Badge variant="outline">+{activity.details.points} points</Badge>
                      )}
                      {activity.details.streak && (
                        <Badge variant="outline">{activity.details.streak} day streak</Badge>
                      )}
                      {activity.details.progress && (
                        <Badge variant="outline">{activity.details.progress}% complete</Badge>
                      )}
                    </div>
                  )}
                </div>
                <div className={`rounded-full p-2 ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
