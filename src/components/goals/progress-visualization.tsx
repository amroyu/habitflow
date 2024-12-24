'use client';

import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Goal, Milestone } from '@/types';
import { Line, Circle } from 'rc-progress';
import { format, subDays, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, differenceInDays, differenceInMonths } from 'date-fns';
import { useState } from 'react';

interface TimeProgress {
  label: string;
  progress: number;
  timeProgress: number;
  entriesCount: number;
  daysRemaining?: number;
}

interface ProgressVisualizationProps {
  goal: Goal;
}

type TimeFrame = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'overall';

const calculateTimeProgress = (goal: Goal, timeFrame: TimeFrame): TimeProgress[] => {
  const now = new Date();
  const startDate = new Date(goal.startDate);
  const endDate = new Date(goal.endDate);
  const totalDuration = differenceInDays(endDate, startDate);
  const elapsed = differenceInDays(now, startDate);
  const timeProgress = Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);
  const daysRemaining = Math.max(differenceInDays(endDate, now), 0);

  let periods: { start: Date; end: Date; label: string }[] = [];

  switch (timeFrame) {
    case 'daily':
      // Days of the week starting from Saturday
      const daysOfWeek = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
      const today = now.getDay();
      const saturday = new Date(now);
      saturday.setDate(now.getDate() - ((today + 1) % 7)); // Get last Saturday

      periods = daysOfWeek.map((day, index) => {
        const date = new Date(saturday);
        date.setDate(saturday.getDate() + index);
        return {
          start: startOfDay(date),
          end: endOfDay(date),
          label: day
        };
      });
      break;

    case 'weekly':
      // Last 4 weeks
      periods = Array.from({ length: 4 }, (_, i) => {
        const date = subDays(now, i * 7);
        return {
          start: startOfWeek(date),
          end: endOfWeek(date),
          label: `Week ${4 - i}`
        };
      }).reverse();
      break;

    case 'monthly':
      // All months of the current year
      const currentYear = now.getFullYear();
      periods = Array.from({ length: 12 }, (_, i) => {
        const date = new Date(currentYear, i, 1);
        return {
          start: startOfMonth(date),
          end: endOfMonth(date),
          label: format(date, 'MMM')
        };
      });
      break;

    case 'yearly':
      // Current year by quarters
      periods = Array.from({ length: 4 }, (_, i) => {
        const date = new Date(now.getFullYear(), i * 3, 1);
        return {
          start: startOfMonth(date),
          end: endOfMonth(new Date(date.getFullYear(), (i + 1) * 3 - 1, 1)),
          label: `Q${i + 1}`
        };
      });
      break;

    default:
      return [{
        label: 'Overall',
        progress: goal.progress,
        timeProgress,
        entriesCount: goal.entries.length,
        daysRemaining
      }];
  }

  return periods.map(period => {
    const entriesInPeriod = goal.entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= period.start && entryDate <= period.end;
    });

    const progress = timeFrame === 'daily'
      ? entriesInPeriod.length > 0 ? 100 : 0
      : (entriesInPeriod.length / (timeFrame === 'weekly' ? 7 : timeFrame === 'monthly' ? getDaysInMonth(period.start) : 90)) * 100;

    return {
      label: period.label,
      progress: Math.min(progress, 100),
      timeProgress,
      entriesCount: entriesInPeriod.length,
      daysRemaining
    };
  });
};

// Helper function to get the number of days in a month
const getDaysInMonth = (date: Date): number => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

const ProgressChart = ({ data }: { data: TimeProgress[] }) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {data.map((period) => (
        <div key={period.label} className="space-y-2">
          <div className="flex items-center space-x-4">
            <div className="w-16 text-sm text-gray-500">{period.label}</div>
            <div className="flex-1 space-y-2">
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Progress</span>
                  <span>{Math.round(period.progress)}%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${period.progress}%` }}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Time Elapsed</span>
                  <span>{Math.round(period.timeProgress)}%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 transition-all duration-300"
                    style={{ width: `${period.timeProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
          {period.daysRemaining !== undefined && (
            <div className="text-xs text-gray-500 pl-20">
              {period.daysRemaining} days remaining
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

interface MilestoneGroup {
  label: string;
  milestones: Milestone[];
  timeProgress: number;
  isCurrentPeriod: boolean;
}

const groupMilestonesByTimeFrame = (
  milestones: Milestone[],
  timeFrame: TimeFrame,
  now: Date = new Date()
): MilestoneGroup[] => {
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const currentDay = now.getDay();

  switch (timeFrame) {
    case 'daily': {
      const daysOfWeek = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
      const today = now.getDay();
      const saturday = new Date(now);
      saturday.setDate(now.getDate() - ((today + 1) % 7));

      return daysOfWeek.map((day, index) => {
        const date = new Date(saturday);
        date.setDate(saturday.getDate() + index);
        const dayMilestones = milestones.filter(m => {
          const milestoneDate = new Date(m.dueDate);
          return format(milestoneDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
        });

        return {
          label: day,
          milestones: dayMilestones,
          timeProgress: 0,
          isCurrentPeriod: format(date, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd')
        };
      });
    }

    case 'weekly': {
      return Array.from({ length: 4 }, (_, i) => {
        const weekStart = subDays(now, (i * 7) + ((currentDay + 1) % 7));
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);

        const weekMilestones = milestones.filter(m => {
          const milestoneDate = new Date(m.dueDate);
          return milestoneDate >= weekStart && milestoneDate <= weekEnd;
        });

        return {
          label: `Week ${4 - i}`,
          milestones: weekMilestones,
          timeProgress: ((7 - i) / 4) * 100,
          isCurrentPeriod: i === 0
        };
      });
    }

    case 'monthly': {
      return Array.from({ length: 12 }, (_, month) => {
        const monthStart = new Date(currentYear, month, 1);
        const monthEnd = endOfMonth(monthStart);
        
        const monthMilestones = milestones.filter(m => {
          const milestoneDate = new Date(m.dueDate);
          return milestoneDate >= monthStart && milestoneDate <= monthEnd;
        });

        return {
          label: format(monthStart, 'MMM'),
          milestones: monthMilestones,
          timeProgress: ((month + 1) / 12) * 100,
          isCurrentPeriod: month === currentMonth
        };
      });
    }

    case 'yearly': {
      return Array.from({ length: 4 }, (_, quarter) => {
        const quarterStart = new Date(currentYear, quarter * 3, 1);
        const quarterEnd = endOfMonth(new Date(currentYear, (quarter + 1) * 3 - 1, 1));

        const quarterMilestones = milestones.filter(m => {
          const milestoneDate = new Date(m.dueDate);
          return milestoneDate >= quarterStart && milestoneDate <= quarterEnd;
        });

        return {
          label: `Q${quarter + 1}`,
          milestones: quarterMilestones,
          timeProgress: ((quarter + 1) / 4) * 100,
          isCurrentPeriod: Math.floor(currentMonth / 3) === quarter
        };
      });
    }

    default:
      return [{
        label: 'All Milestones',
        milestones: milestones.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()),
        timeProgress: 100,
        isCurrentPeriod: true
      }];
  }
};

const MilestoneTimeline = ({ 
  milestoneGroups,
  timeFrame
}: { 
  milestoneGroups: MilestoneGroup[];
  timeFrame: TimeFrame;
}) => {
  return (
    <div className="space-y-6">
      {milestoneGroups.map((group, groupIndex) => (
        <div 
          key={group.label}
          className={`rounded-lg border p-4 ${
            group.isCurrentPeriod ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">{group.label}</h3>
            {group.milestones.length > 0 && (
              <span className="text-sm text-gray-500">
                {group.milestones.filter(m => m.completed).length}/{group.milestones.length} Completed
              </span>
            )}
          </div>
          
          {group.milestones.length > 0 ? (
            <div className="space-y-3">
              {group.milestones.map((milestone) => (
                <div 
                  key={milestone.id}
                  className={`flex items-center space-x-3 p-2 rounded-md ${
                    milestone.completed ? 'bg-green-50' : 'bg-gray-50'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    milestone.completed ? 'bg-green-500' : 'bg-gray-300'
                  }`}>
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{milestone.title}</p>
                    <p className="text-sm text-gray-500">
                      Due: {format(new Date(milestone.dueDate), 'MMM d, yyyy')}
                    </p>
                  </div>
                  {milestone.frequency !== 'one-time' && (
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                      {milestone.frequency}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              No milestones for this {timeFrame === 'overall' ? 'goal' : timeFrame.slice(0, -2)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export function ProgressVisualization({ goal }: ProgressVisualizationProps) {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('overall');
  const progressData = calculateTimeProgress(goal, timeFrame);
  const milestoneGroups = groupMilestonesByTimeFrame(goal.milestones, timeFrame);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Progress Overview</CardTitle>
          <div className="flex space-x-1 rounded-lg bg-gray-100 p-1">
            {(['overall', 'daily', 'weekly', 'monthly', 'yearly'] as TimeFrame[]).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeFrame(tf)}
                className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors
                  ${timeFrame === tf 
                    ? 'bg-white shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'}`
                }
              >
                {tf.charAt(0).toUpperCase() + tf.slice(1)}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative w-48 h-48 mx-auto">
              <div className="absolute inset-0">
                <Circle
                  percent={progressData[0].timeProgress}
                  strokeWidth={8}
                  strokeColor="#F59E0B"
                  trailWidth={8}
                  trailColor="#E5E7EB"
                />
              </div>
              <div className="absolute inset-2">
                <Circle
                  percent={progressData[0].progress}
                  strokeWidth={8}
                  strokeColor="#3B82F6"
                  trailWidth={8}
                  trailColor="#E5E7EB"
                />
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-bold">{Math.round(progressData[0].progress)}%</span>
                <span className="text-sm text-gray-500">Progress</span>
                <span className="text-sm text-amber-500">{Math.round(progressData[0].timeProgress)}% Time</span>
              </div>
            </div>
            <div className="flex-1">
              <ProgressChart data={progressData} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Milestones</CardTitle>
        </CardHeader>
        <CardContent>
          <MilestoneTimeline 
            milestoneGroups={milestoneGroups}
            timeFrame={timeFrame}
          />
        </CardContent>
      </Card>
    </div>
  );
}
