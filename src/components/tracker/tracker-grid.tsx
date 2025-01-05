"use client";

import { useState, useEffect } from 'react';
import { HabitCard } from "@/components/habits/habit-card";
import { GoalCard } from "@/components/goals/goal-card";
import { Goal } from '@/types';
import type { Habit } from '@/types';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TrackerGridProps {
  view?: "grid" | "list";
  sortBy?: "recent" | "progress" | "streak";
  searchQuery?: string;
  items: (Habit | Goal)[];
  onDelete?: (id: string) => void;
  onEdit?: (item: Habit | Goal) => void;
}

export function TrackerGrid({ 
  view = "grid",
  sortBy = "recent",
  searchQuery = "",
  items,
  onDelete,
  onEdit
}: TrackerGridProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Filter items based on search query
  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.description?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  // Sort items based on sortBy
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case "progress":
        return (b.progress || 0) - (a.progress || 0);
      case "streak":
        return (b.streak || 0) - (a.streak || 0);
      case "recent":
      default:
        return new Date(b.updated_at || b.created_at).getTime() - 
               new Date(a.updated_at || a.created_at).getTime();
    }
  });

  return (
    <div className={cn(
      "grid gap-4",
      view === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
    )}>
      {sortedItems.map((item) => (
        'type' in item ? (
          <HabitCard
            key={item.id}
            habit={item}
            onDelete={() => onDelete?.(item.id)}
            onEdit={() => onEdit?.(item)}
          />
        ) : (
          <GoalCard
            key={item.id}
            goal={item}
            onDelete={() => onDelete?.(item.id)}
            onEdit={() => onEdit?.(item)}
          />
        )
      ))}
      {sortedItems.length === 0 && (
        <div className="col-span-full text-center py-8 text-muted-foreground">
          No items found
        </div>
      )}
    </div>
  );
}
