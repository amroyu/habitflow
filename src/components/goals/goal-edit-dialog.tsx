'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { Goal } from "@/types";

interface GoalEditDialogProps {
  goal: Goal;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedGoal: Goal) => void;
}

export function GoalEditDialog({ goal, open, onOpenChange, onSave }: GoalEditDialogProps) {
  const [formData, setFormData] = useState({
    title: goal.title,
    description: goal.description,
    category: goal.category,
    type: goal.type,
    endDate: new Date(goal.endDate)
  });

  const handleSave = () => {
    onSave({
      ...goal,
      ...formData
    });
    onOpenChange(false);
  };

  const isValid = (date: Date) => !isNaN(date.getTime());

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Goal</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label>Type</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={formData.type === 'do' ? 'default' : 'outline'}
                onClick={() => setFormData({ ...formData, type: 'do' })}
              >
                Do
              </Button>
              <Button
                type="button"
                variant={formData.type === 'dont' ? 'default' : 'outline'}
                onClick={() => setFormData({ ...formData, type: 'dont' })}
              >
                Don't
              </Button>
            </div>
          </div>
          <div className="grid gap-2">
            <Label>End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.endDate && isValid(new Date(formData.endDate)) 
                    ? format(new Date(formData.endDate), "PPP") 
                    : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.endDate}
                  onSelect={(date) => date && setFormData({ ...formData, endDate: date })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
