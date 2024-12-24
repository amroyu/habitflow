'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { mockGoals } from '@/lib/mock-data'

export default function GoalPage({ params }: { params: { id: string } }) {
  const goal = mockGoals.find(g => g.id === params.id)

  if (!goal) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Goal not found</h1>
          <p className="text-muted-foreground">The goal you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{goal.title}</h1>
        <p className="text-muted-foreground">{goal.description}</p>
      </div>

      <div className="p-6 max-w-4xl">
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <span className={`text-sm font-medium px-3 py-1 rounded-full ${
              goal.type === 'do'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {goal.type === 'do' ? 'DO' : "DON'T"}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {goal.category}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {goal.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {goal.description}
          </p>
        </header>

        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Progress</h2>
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
              <span>Overall Progress</span>
              <span>{goal.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className="bg-primary-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${goal.progress}%` }}
              />
            </div>
          </div>
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
            <div>
              <p className="font-medium">Start Date</p>
              <p>{new Date(goal.startDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="font-medium">End Date</p>
              <p>{new Date(goal.endDate).toLocaleDateString()}</p>
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Milestones</h2>
          <div className="space-y-4">
            {goal.milestones.map((milestone) => (
              <div
                key={milestone.id}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {milestone.title}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Due: {new Date(milestone.dueDate).toLocaleDateString()}
                  </p>
                </div>
                <div className={`h-5 w-5 rounded-full ${
                  milestone.completed
                    ? 'bg-green-500 dark:bg-green-400'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
