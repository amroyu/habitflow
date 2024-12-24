'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HabitsOverviewChart } from '@/components/analytics/habits-overview-chart';
import { HabitsStreakChart } from '@/components/analytics/habits-streak-chart';
import { HabitsCompletionRate } from '@/components/analytics/habits-completion-rate';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const mockHabitsData = {
  goodHabits: 5,
  badHabits: 3,
  totalHabits: 8,
  averageStreak: 4.2,
  completionRate: 75,
  streakData: [
    { name: 'Morning Exercise', streak: 5 },
    { name: 'Reading', streak: 3 },
    { name: 'Meditation', streak: 7 },
    { name: 'No Late Snacks', streak: 2 },
  ],
  completionHistory: [
    { date: '2023-12-17', completed: 6, total: 8 },
    { date: '2023-12-18', completed: 7, total: 8 },
    { date: '2023-12-19', completed: 5, total: 8 },
    { date: '2023-12-20', completed: 8, total: 8 },
    { date: '2023-12-21', completed: 6, total: 8 },
    { date: '2023-12-22', completed: 7, total: 8 },
    { date: '2023-12-23', completed: 6, total: 8 },
  ],
};

const HabitsAnalyticsPage = () => {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-8">
        <PageHeader
          heading="Habits Analytics"
          subheading="Track your habits progress and performance"
        />
        <Link href="/habits">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Habits
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Habits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{mockHabitsData.totalHabits}</div>
            <p className="text-muted-foreground">
              {mockHabitsData.goodHabits} good, {mockHabitsData.badHabits} bad
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{mockHabitsData.averageStreak}</div>
            <p className="text-muted-foreground">days per habit</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{mockHabitsData.completionRate}%</div>
            <p className="text-muted-foreground">last 7 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Habits Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <HabitsOverviewChart data={mockHabitsData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Completion History</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <HabitsCompletionRate data={mockHabitsData.completionHistory} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Streaks</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <HabitsStreakChart data={mockHabitsData.streakData} />
        </CardContent>
      </Card>
    </div>
  );
};

export default HabitsAnalyticsPage;
