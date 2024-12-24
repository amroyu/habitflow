'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { StreakCalendar } from './streak-calendar';
import { ProgressRing } from './progress-ring';
import { GoalInsights } from './goal-insights';

interface WidgetDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'active' | 'streak' | 'milestone' | 'upcoming' | 'progress' | 'categories';
  data: any;
}

export function WidgetDetails({ isOpen, onClose, type, data }: WidgetDetailsProps) {
  const renderContent = () => {
    switch (type) {
      case 'active':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Active Goals Details</h3>
            <div className="grid gap-4">
              {data.goals?.map((goal: any) => (
                <div key={goal.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{goal.title}</h4>
                    <span className="text-sm text-gray-500">{goal.progress}%</span>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'streak':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Streak Details</h3>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold">{data.currentStreak} days</span>
                <span className="text-sm text-gray-500">Current Streak</span>
              </div>
              <StreakCalendar dates={data.streakDates} />
            </div>
          </div>
        );

      case 'milestone':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Milestone Completion Details</h3>
            <div className="grid gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold">{data.rate}%</span>
                  <span className="text-sm text-gray-500">Completion Rate</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Completed</span>
                    <span>{data.completed}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Total</span>
                    <span>{data.total}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'upcoming':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Upcoming Goals</h3>
            <div className="grid gap-4">
              {data.goals?.map((goal: any) => (
                <div key={goal.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{goal.title}</h4>
                    <span className="text-sm text-gray-500">
                      Starts {new Date(goal.startDate).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{goal.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'progress':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Progress Overview</h3>
            <div className="grid gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-center mb-4">
                  <ProgressRing 
                    progress={data.averageProgress} 
                    size={120} 
                    strokeWidth={12}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Average Progress</span>
                    <span>{data.averageProgress}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Trend</span>
                    <span className={data.trend > 0 ? 'text-green-600' : 'text-red-600'}>
                      {data.trend > 0 ? '+' : ''}{data.trend}% from last week
                    </span>
                  </div>
                </div>
              </div>
              <GoalInsights data={data.insights} />
            </div>
          </div>
        );

      case 'categories':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Categories Breakdown</h3>
            <div className="grid gap-4">
              {data.categories?.map((category: any) => (
                <div key={category.name} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{category.name}</h4>
                    <span className="text-sm text-gray-500">{category.count} goals</span>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(category.count / data.totalGoals) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="div"
                  className="flex justify-between items-center mb-4"
                >
                  <div className="text-lg font-medium leading-6 text-gray-900">
                    Widget Details
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </Button>
                </Dialog.Title>

                <div className="mt-2">
                  {renderContent()}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
