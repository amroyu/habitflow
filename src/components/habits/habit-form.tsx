"use client";

import { Fragment, useState, useEffect } from "react";
import { XMarkIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Habit, HabitType, HabitCategory } from "@/types";
import { Badge } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useToast } from "@/components/ui/use-toast";

interface HabitFormProps {
  onClose: () => void;
  onSave: (habit: Partial<Habit>) => Promise<void>;
  initialData?: Partial<Habit>;
  categories: HabitCategory[];
}

export function HabitForm({
  onClose,
  onSave,
  initialData,
  categories,
}: HabitFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    type: initialData?.type || "good",
    category_id: initialData?.category_id || "",
    frequency: initialData?.frequency || "daily",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.type) {
      newErrors.type = "Type is required";
    }
    if (!formData.category_id) {
      newErrors.category_id = "Category is required";
    }
    if (!formData.frequency) {
      newErrors.frequency = "Frequency is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("Form data before submission:", formData);
      const habitData = {
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        type: formData.type as "good" | "bad",
        frequency: formData.frequency as "daily" | "weekly" | "monthly",
      };
      console.log("Submitting habit data:", habitData);
      await onSave(habitData);
      toast({
        title: "Success",
        description: "Habit saved successfully",
      });
      onClose();
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to save habit. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title" className="flex items-center gap-1">
          Title <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => {
            setFormData({ ...formData, title: e.target.value });
            if (errors.title) {
              setErrors({ ...errors, title: "" });
            }
          }}
          className={errors.title ? "border-red-500" : ""}
        />
        {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type" className="flex items-center gap-1">
          Type <span className="text-red-500">*</span>
        </Label>
        <Select
          value={formData.type}
          onValueChange={(value) => {
            setFormData({ ...formData, type: value as "good" | "bad" });
            if (errors.type) {
              setErrors({ ...errors, type: "" });
            }
          }}
        >
          <SelectTrigger className={errors.type ? "border-red-500" : ""}>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="good">Good Habit</SelectItem>
            <SelectItem value="bad">Bad Habit</SelectItem>
          </SelectContent>
        </Select>
        {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category" className="flex items-center gap-1">
          Category <span className="text-red-500">*</span>
        </Label>
        <Select
          value={formData.category_id}
          onValueChange={(value) => {
            console.log("Selected category:", value);
            setFormData({ ...formData, category_id: value });
            if (errors.category_id) {
              setErrors({ ...errors, category_id: "" });
            }
          }}
        >
          <SelectTrigger
            id="category"
            className={errors.category_id ? "border-red-500" : ""}
          >
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.length === 0 ? (
              <SelectItem value="" disabled>
                No categories available
              </SelectItem>
            ) : (
              categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    {category.name}
                  </div>
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        {errors.category_id && (
          <p className="text-sm text-red-500">{errors.category_id}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="frequency" className="flex items-center gap-1">
          Frequency <span className="text-red-500">*</span>
        </Label>
        <Select
          value={formData.frequency}
          onValueChange={(value) => {
            setFormData({ ...formData, frequency: value });
            if (errors.frequency) {
              setErrors({ ...errors, frequency: "" });
            }
          }}
        >
          <SelectTrigger className={errors.frequency ? "border-red-500" : ""}>
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
        {errors.frequency && (
          <p className="text-sm text-red-500">{errors.frequency}</p>
        )}
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}
