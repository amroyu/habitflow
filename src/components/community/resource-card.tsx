'use client'

import { BookMarked, Clock, Heart, Share2, Eye } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ResourceHub } from '@/types/community'
import { formatDistanceToNow } from 'date-fns'

interface ResourceCardProps {
  resource: ResourceHub
  onLike: (id: string) => void
  onSave: (id: string) => void
  onShare: (id: string) => void
}

export function ResourceCard({
  resource,
  onLike,
  onSave,
  onShare
}: ResourceCardProps) {
  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800'
  }

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={resource.author.avatar} />
              <AvatarFallback>{resource.author.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-medium">{resource.author.name}</h4>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(resource.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
          <Badge
            variant="secondary"
            className={difficultyColors[resource.difficulty]}
          >
            {resource.difficulty}
          </Badge>
        </div>
        <div>
          <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
            {resource.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {resource.description}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {resource.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{resource.views}</span>
            </div>
            {resource.estimatedReadTime && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{resource.estimatedReadTime} min read</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onLike(resource.id)}
              className="group/button"
            >
              <Heart className="h-4 w-4 group-hover/button:text-red-500 transition-colors" />
              <span className="sr-only">Like</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onSave(resource.id)}
            >
              <BookMarked className="h-4 w-4" />
              <span className="sr-only">Save</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onShare(resource.id)}
            >
              <Share2 className="h-4 w-4" />
              <span className="sr-only">Share</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
