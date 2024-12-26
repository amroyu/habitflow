'use client'

import { useState } from 'react'
import { Bell, Check, X } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Notification } from '@/types/community'
import { formatDistanceToNow } from 'date-fns'

interface NotificationsPanelProps {
  notifications: Notification[]
  onMarkAsRead: (userId: string) => void
  onClearAll: () => void
}

export function NotificationsPanel({
  notifications,
  onMarkAsRead,
  onClearAll
}: NotificationsPanelProps) {
  const [open, setOpen] = useState(false)
  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader className="flex flex-row items-center justify-between">
          <SheetTitle>Notifications</SheetTitle>
          <Button variant="ghost" size="sm" onClick={onClearAll}>
            Clear All
          </Button>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-100px)] mt-4">
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={`${notification.userId}-${notification.timestamp}`}
                className={`flex items-start gap-4 p-4 rounded-lg ${
                  notification.read ? 'bg-background' : 'bg-muted'
                }`}
              >
                {notification.sender && (
                  <Avatar>
                    <AvatarImage src={notification.sender.avatar} />
                    <AvatarFallback>{notification.sender.name[0]}</AvatarFallback>
                  </Avatar>
                )}
                <div className="flex-1">
                  <h4 className="text-sm font-semibold">{notification.title}</h4>
                  <p className="text-sm text-muted-foreground">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                  </p>
                </div>
                {!notification.read && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onMarkAsRead(notification.userId)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
