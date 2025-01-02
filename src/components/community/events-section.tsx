"use client";

import { CommunityEvent } from "@/types/community";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Clock, MapPin, Users, Video } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

interface EventsSectionProps {
  events: CommunityEvent[];
}

export function EventsSection({ events }: EventsSectionProps) {
  const getEventTypeIcon = (type: CommunityEvent["type"]) => {
    switch (type) {
      case "workshop":
        return <Video className="h-4 w-4" />;
      case "webinar":
        return <Video className="h-4 w-4" />;
      case "challenge":
        return <Users className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getEventTypeColor = (type: CommunityEvent["type"]) => {
    switch (type) {
      case "workshop":
        return "bg-purple-500/10 text-purple-500";
      case "webinar":
        return "bg-blue-500/10 text-blue-500";
      case "challenge":
        return "bg-green-500/10 text-green-500";
      default:
        return "bg-orange-500/10 text-orange-500";
    }
  };

  return (
    <ScrollArea className="h-[600px]">
      <div className="space-y-6 p-4">
        {events.map((event) => (
          <Card key={event.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Badge className={getEventTypeColor(event.type)}>
                      <span className="flex items-center space-x-1">
                        {getEventTypeIcon(event.type)}
                        <span>{event.type}</span>
                      </span>
                    </Badge>
                    {event.isOnline && <Badge variant="outline">Online</Badge>}
                  </div>
                  <CardTitle className="text-xl">{event.title}</CardTitle>
                </div>
                <div className="flex items-center space-x-2">
                  <Avatar>
                    <AvatarImage src={event.host.avatar} alt={event.host.name} />
                    <AvatarFallback>{event.host.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    <p className="font-medium">{event.host.name}</p>
                    <p className="text-muted-foreground">Host</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{event.description}</p>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {format(new Date(event.startDate), "MMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Clock className="h-4 w-4" />
                    <span>
                      {format(new Date(event.startDate), "h:mm a")} -{" "}
                      {format(new Date(event.endDate), "h:mm a")}
                    </span>
                  </div>
                  {event.location && (
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <Users className="h-4 w-4" />
                    <span>
                      {event.participants}{" "}
                      {event.maxParticipants
                        ? `/ ${event.maxParticipants}`
                        : ""} participants
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Registration closes{" "}
                    {formatDistanceToNow(new Date(event.registrationDeadline), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2">
                <Button variant="outline">Add to Calendar</Button>
                <Button>Register Now</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
