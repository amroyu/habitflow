'use client';

import { Fragment, useState } from 'react'
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Habit, HabitType, HabitCategory } from '@/types'
import { Badge } from 'lucide-react'

interface HabitFormProps {
  onClose: () => void
  onSave: (habit: Partial<Habit>) => void
  initialData?: Partial<Habit>
}

const FREQUENCIES = [
  'Daily',
  'Weekly',
  'Monthly',
] as const;

const DEFAULT_CATEGORIES: Record<HabitType, HabitCategory[]> = {
  good: [
    { id: 'health', name: 'Health & Fitness', type: 'good', color: '#22c55e' },
    { id: 'learning', name: 'Learning', type: 'good', color: '#3b82f6' },
    { id: 'productivity', name: 'Productivity', type: 'good', color: '#8b5cf6' },
  ],
  bad: [
    { id: 'procrastination', name: 'Procrastination', type: 'bad', color: '#ef4444' },
    { id: 'unhealthy', name: 'Unhealthy Habits', type: 'bad', color: '#f97316' },
    { id: 'distractions', name: 'Distractions', type: 'bad', color: '#f59e0b' },
  ]
};

export function HabitForm({ onClose, onSave, initialData }: HabitFormProps) {
  const [categories, setCategories] = useState<Record<HabitType, HabitCategory[]>>(
    () => {
      const savedCategories = localStorage.getItem('habitCategories');
      return savedCategories ? JSON.parse(savedCategories) : DEFAULT_CATEGORIES;
    }
  );
  const [selectedType, setSelectedType] = useState<HabitType>(initialData?.type || 'good');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', color: '#000000' });

  const handleAddCategory = () => {
    if (newCategory.name) {
      const newCategoryItem: HabitCategory = {
        id: crypto.randomUUID(),
        name: newCategory.name,
        type: selectedType,
        color: newCategory.color,
      };
      
      const updatedCategories = {
        ...categories,
        [selectedType]: [...categories[selectedType], newCategoryItem],
      };
      
      setCategories(updatedCategories);
      localStorage.setItem('habitCategories', JSON.stringify(updatedCategories));
      setNewCategory({ name: '', color: '#000000' });
      setIsAddingCategory(false);
    }
  };

  const handleRemoveCategory = (categoryId: string) => {
    const updatedCategories = {
      ...categories,
      [selectedType]: categories[selectedType].filter(cat => cat.id !== categoryId),
    };
    setCategories(updatedCategories);
    localStorage.setItem('habitCategories', JSON.stringify(updatedCategories));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const habitData: Partial<Habit> = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      frequency: formData.get('frequency') as string,
      type: formData.get('type') as HabitType,
      category: formData.get('category') as string,
    };
    onSave(habitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label>Habit Type</Label>
        <RadioGroup 
          defaultValue={selectedType} 
          name="type" 
          className="flex gap-4"
          onValueChange={(value: HabitType) => setSelectedType(value)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="good" id="good" />
            <Label htmlFor="good" className="text-green-600 font-medium">Good Habit</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="bad" id="bad" />
            <Label htmlFor="bad" className="text-red-600 font-medium">Bad Habit</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input 
          id="title"
          name="title"
          required
          defaultValue={initialData?.title}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={initialData?.description}
        />
      </div>

      <div className="space-y-2">
        <Label>Frequency</Label>
        <Select name="frequency" defaultValue={initialData?.frequency || 'Daily'}>
          <SelectTrigger>
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            {FREQUENCIES.map((freq) => (
              <SelectItem key={freq} value={freq}>
                {freq}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label>Category</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsAddingCategory(true)}
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Add Category
          </Button>
        </div>
        
        {isAddingCategory ? (
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="Category name"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              />
              <Input
                type="color"
                value={newCategory.color}
                onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                className="w-14 p-1 h-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={handleAddCategory}
                className="flex-1"
              >
                Add
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddingCategory(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Select name="category" defaultValue={initialData?.category}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories[selectedType].map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: cat.color }}
                    />
                    {cat.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="submit" className="flex-1">
          Save Habit
        </Button>
        <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
