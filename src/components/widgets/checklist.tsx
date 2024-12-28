'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, CheckSquare, Square } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChecklistItem {
  id: number;
  text: string;
  completed: boolean;
}

interface ChecklistProps {
  className?: string;
  items?: ChecklistItem[];
  onUpdate?: (items: ChecklistItem[]) => void;
}

export function Checklist({
  className,
  items: initialItems = [],
  onUpdate,
}: ChecklistProps) {
  const [items, setItems] = useState<ChecklistItem[]>(initialItems);
  const [newItemText, setNewItemText] = useState('');

  const handleAddItem = () => {
    if (!newItemText.trim()) return;
    
    const newItem: ChecklistItem = {
      id: Date.now(),
      text: newItemText.trim(),
      completed: false,
    };
    
    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    setNewItemText('');
    onUpdate?.(updatedItems);
  };

  const handleToggleItem = (id: number) => {
    const updatedItems = items.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setItems(updatedItems);
    onUpdate?.(updatedItems);
  };

  const handleRemoveItem = (id: number) => {
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);
    onUpdate?.(updatedItems);
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex gap-2">
        <Input
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
          placeholder="Add new item..."
          className="flex-1"
        />
        <Button onClick={handleAddItem} size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-2 rounded-lg border p-2"
          >
            <button
              className="flex items-center gap-2 flex-1"
              onClick={() => handleToggleItem(item.id)}
            >
              {item.completed ? (
                <CheckSquare className="h-4 w-4 text-primary" />
              ) : (
                <Square className="h-4 w-4" />
              )}
              <span className={cn(
                "text-sm",
                item.completed && "line-through text-muted-foreground"
              )}>
                {item.text}
              </span>
            </button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveItem(item.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
