'use client';

import { Layers, Target, Flag, Activity, Clock, StickyNote, File, Link, Image, Calendar, Layout } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TypeFilterProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
}

const typeCategories = [
  {
    label: 'All Types',
    icon: <Layers className="h-4 w-4" />,
    type: 'all',
    color: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
  },
  {
    label: 'Progress Tracking',
    items: [
      {
        label: 'Goals',
        icon: <Target className="h-4 w-4" />,
        type: 'goals',
        color: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
      },
      {
        label: 'Milestones',
        icon: <Flag className="h-4 w-4" />,
        type: 'milestones',
        color: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
      },
      {
        label: 'Habits',
        icon: <Activity className="h-4 w-4" />,
        type: 'habits',
        color: 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
      }
    ]
  },
  {
    label: 'Time Management',
    items: [
      {
        label: 'Tasks',
        icon: <Clock className="h-4 w-4" />,
        type: 'tasks',
        color: 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300'
      },
      {
        label: 'Calendar',
        icon: <Calendar className="h-4 w-4" />,
        type: 'calendar',
        color: 'bg-teal-100 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300'
      },
      {
        label: 'Kanban',
        icon: <Layout className="h-4 w-4" />,
        type: 'kanban',
        color: 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
      }
    ]
  },
  {
    label: 'Content',
    items: [
      {
        label: 'Notes',
        icon: <StickyNote className="h-4 w-4" />,
        type: 'notes',
        color: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300'
      },
      {
        label: 'Files',
        icon: <File className="h-4 w-4" />,
        type: 'files',
        color: 'bg-pink-100 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300'
      },
      {
        label: 'Links',
        icon: <Link className="h-4 w-4" />,
        type: 'links',
        color: 'bg-cyan-100 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300'
      },
      {
        label: 'Gallery',
        icon: <Image className="h-4 w-4" />,
        type: 'gallery',
        color: 'bg-rose-100 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300'
      }
    ]
  }
];

export function TypeFilter({ selectedType, onTypeChange }: TypeFilterProps) {
  return (
    <ScrollArea className="h-[400px] w-[300px] rounded-md border p-4">
      {typeCategories.map((category, index) => (
        <div key={index} className="mb-6 last:mb-0">
          {category.label === 'All Types' ? (
            <Button
              variant="ghost"
              className={cn(
                'w-full justify-start gap-2 font-normal',
                selectedType === category.type && category.color
              )}
              onClick={() => onTypeChange(category.type)}
            >
              {category.icon}
              {category.label}
            </Button>
          ) : (
            <>
              <h4 className="mb-2 px-2 text-sm font-medium text-muted-foreground">{category.label}</h4>
              <div className="space-y-1">
                {category.items?.map((item, itemIndex) => (
                  <Button
                    key={itemIndex}
                    variant="ghost"
                    className={cn(
                      'w-full justify-start gap-2 font-normal',
                      selectedType === item.type && item.color
                    )}
                    onClick={() => onTypeChange(item.type)}
                  >
                    {item.icon}
                    {item.label}
                  </Button>
                ))}
              </div>
            </>
          )}
        </div>
      ))}
    </ScrollArea>
  );
}
