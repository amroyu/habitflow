'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Save, X, Trash2, CheckSquare, Square } from 'lucide-react';
import { cn } from '@/lib/utils';
import { saveTaskToStorage } from '@/lib/task-utils';
import { useToast } from '@/components/ui/use-toast';

interface ChecklistItem {
  id: number;
  text: string;
  checked: boolean;
  saved?: boolean;
}

interface ChecklistProps {
  initialItems?: ChecklistItem[];
  onUpdate?: (items: ChecklistItem[]) => void;
  className?: string;
}

export function Checklist({ 
  initialItems = [], 
  onUpdate,
  className 
}: ChecklistProps) {
  const [items, setItems] = useState<ChecklistItem[]>(initialItems);
  const [newItemText, setNewItemText] = useState('');
  const { toast } = useToast();

  const handleAddItem = () => {
    if (!newItemText.trim()) return;
    const newItem: ChecklistItem = {
      id: Date.now() + Math.floor(Math.random() * 1000000),  
      text: newItemText.trim(),
      checked: false,
      saved: false
    };
    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    setNewItemText('');
    onUpdate?.(updatedItems);
  };

  const handleRemoveItem = (id: number) => {
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);
    onUpdate?.(updatedItems);
  };

  const handleToggleItem = (id: number) => {
    const updatedItems = items.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setItems(updatedItems);
    onUpdate?.(updatedItems);
  };

  const handleUpdateItemText = (id: number, text: string) => {
    const updatedItems = items.map(item =>
      item.id === id ? { ...item, text } : item
    );
    setItems(updatedItems);
    onUpdate?.(updatedItems);
  };

  const saveAsTask = async (item: ChecklistItem) => {
    if (item.saved) {
      toast({
        title: "Already Saved",
        description: "This item has already been saved as a task",
        variant: "default"
      });
      return;
    }

    try {
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 15);
      const uniqueId = `task-${timestamp}-${random}-${item.id}`;
      
      const task = saveTaskToStorage({
        id: uniqueId,
        title: item.text,
        duration: 1800, 
        source: 'checklist',
        completed: item.checked
      });

      const updatedItems = items.map(i => 
        i.id === item.id ? { ...i, saved: true } : i
      );
      setItems(updatedItems);
      onUpdate?.(updatedItems);

      toast({
        title: "Task Created",
        description: `"${item.text}" has been added to your tasks`,
      });

    } catch (error) {
      console.error('Error saving task:', error);
      toast({
        title: "Error",
        description: "Failed to save task. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="space-y-2">
        {items.map((item) => {
          const itemKey = `checklist-item-${item.id}`;
          return (
            <div key={itemKey} className="flex items-center gap-2">
              <Checkbox
                checked={item.checked}
                onCheckedChange={() => handleToggleItem(item.id)}
              />
              <Input
                value={item.text}
                onChange={(e) => handleUpdateItemText(item.id, e.target.value)}
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => saveAsTask(item)}
                disabled={item.saved}
                className={item.saved ? 'text-muted-foreground' : ''}
              >
                <Save className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveItem(item.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        <Input
          placeholder="Add new item"
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && newItemText) {
              handleAddItem();
            }
          }}
        />
        <Button
          variant="outline"
          size="icon"
          onClick={handleAddItem}
          disabled={!newItemText.trim()}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
