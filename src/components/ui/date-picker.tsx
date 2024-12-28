"use client";

import * as React from "react";
import { CalendarIcon } from "@heroicons/react/20/solid";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function DatePicker({ name, value, onChange, className }: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(
    value ? new Date(value) : undefined
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => {
            setDate(newDate);
            if (newDate && onChange) {
              onChange(newDate.toISOString());
            }
          }}
          initialFocus
        />
      </PopoverContent>
      <input
        type="hidden"
        name={name}
        value={date ? date.toISOString() : ""}
      />
    </Popover>
  );
}
