"use client";

import { CommunityGroup } from "@/types/community";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, Lock, Activity, Shield } from "lucide-react";

interface GroupsSectionProps {
  groups: CommunityGroup[];
}

export function GroupsSection({ groups }: GroupsSectionProps) {
  return (
    <ScrollArea className="h-[600px]">
      <div className="grid gap-6 p-4">
        {groups.map((group) => (
          <Card key={group.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  {group.avatar ? (
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={group.avatar} alt={group.name} />
                      <AvatarFallback>{group.name[0]}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center space-x-2">
                      <CardTitle>{group.name}</CardTitle>
                      {group.isPrivate && (
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {group.description}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary">{group.category}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {group.members.toLocaleString()} members
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {group.activities.length} activities
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {group.moderators.length} moderators
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Group Rules</h4>
                <ul className="list-disc list-inside space-y-1">
                  {group.rules.map((rule, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-2">
                {group.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2">
                <Button variant="outline">View Details</Button>
                <Button>{group.isPrivate ? "Request to Join" : "Join Group"}</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
