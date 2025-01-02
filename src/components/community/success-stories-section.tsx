"use client";

import { SuccessStory } from "@/types/community";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageSquare, Share2, Trophy } from "lucide-react";

interface SuccessStoriesSectionProps {
  stories: SuccessStory[];
}

export function SuccessStoriesSection({ stories }: SuccessStoriesSectionProps) {
  return (
    <ScrollArea className="h-[600px]">
      <div className="space-y-6 p-4">
        {stories.map((story) => (
          <Card key={story.id} className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={story.author.avatar} alt={story.author.name} />
                    <AvatarFallback>{story.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">{story.author.name}</span>
                      <Badge variant="secondary">Level {story.author.level}</Badge>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Trophy className="h-4 w-4" />
                      <span>{story.author.achievements.join(", ")}</span>
                    </div>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(story.createdAt), { addSuffix: true })}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardTitle className="text-xl">{story.title}</CardTitle>
              <p className="text-muted-foreground">{story.content}</p>
              {story.images && story.images.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {story.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Progress ${index + 1}`}
                      className="rounded-lg object-cover aspect-video w-full"
                    />
                  ))}
                </div>
              )}
              {story.metrics && (
                <div className="grid grid-cols-3 gap-4">
                  {story.metrics.timeSpent && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Time Spent</p>
                      <p className="text-2xl font-bold">{story.metrics.timeSpent}</p>
                    </div>
                  )}
                  {story.metrics.progressRate && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Progress Rate</p>
                      <p className="text-2xl font-bold">{story.metrics.progressRate}%</p>
                    </div>
                  )}
                  {story.metrics.keyMilestones && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Key Milestones</p>
                      <p className="text-sm text-muted-foreground">
                        {story.metrics.keyMilestones.length} achieved
                      </p>
                    </div>
                  )}
                </div>
              )}
              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" size="sm" className="space-x-2">
                    <Heart className="h-4 w-4" />
                    <span>{story.likes}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="space-x-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>{story.comments}</span>
                  </Button>
                </div>
                <Button variant="ghost" size="sm">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {story.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
