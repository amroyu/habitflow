"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, MoreVertical, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface HabitCardProps {
  title: string;
  description: string;
  frequency: string;
  type: 'good' | 'bad';
  streak: number;
  progress: number;
  lastCompleted?: Date;
  onComplete?: () => void;
}

export function HabitCard({
  title,
  description,
  frequency,
  type,
  streak,
  progress,
  lastCompleted,
  onComplete,
}: HabitCardProps) {
  const isGoodHabit = type === 'good';
  
  return (
    <Card className={cn(
      "w-full transition-colors",
      isGoodHabit 
        ? "hover:border-green-500/50 hover:bg-green-50/50" 
        : "hover:border-red-500/50 hover:bg-red-50/50"
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <h3 className={cn(
            "font-semibold text-lg",
            isGoodHabit ? "text-green-700" : "text-red-700"
          )}>{title}</h3>
          <p className="text-sm text-muted-foreground">{frequency}</p>
        </div>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress 
            value={progress} 
            className={cn(
              "h-2",
              isGoodHabit 
                ? "bg-green-100 [&>div]:bg-green-500" 
                : "bg-red-100 [&>div]:bg-red-500"
            )} 
          />
        </div>
        <div className="mt-4 flex items-center text-sm text-muted-foreground">
          <span className="flex items-center">
            {isGoodHabit ? '🎯' : '⚠️'} {streak} day streak
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={onComplete}
          variant={isGoodHabit ? "default" : "destructive"}
        >
          {isGoodHabit ? (
            <CheckCircle2 className="mr-2 h-4 w-4" />
          ) : (
            <XCircle className="mr-2 h-4 w-4" />
          )}
          {isGoodHabit ? 'Complete' : 'Avoid'}
        </Button>
      </CardFooter>
    </Card>
  );
}
