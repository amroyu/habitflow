'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";
import { WidgetBase } from "./widget-base";

interface CounterProps {
  className?: string;
  initialValue?: number;
  increment?: number;
  target?: number;
  onRemove?: () => void;
  onEdit?: () => void;
}

export function Counter({
  className,
  initialValue = 0,
  increment = 1,
  target,
  onRemove,
  onEdit,
}: CounterProps) {
  const [value, setValue] = useState(initialValue);

  const progress = target ? (value / target) * 100 : undefined;

  const handleIncrement = () => {
    setValue((prev) => Math.min(prev + increment, target || Infinity));
  };

  const handleDecrement = () => {
    setValue((prev) => Math.max(prev - increment, 0));
  };

  const handleReset = () => {
    setValue(initialValue);
  };

  return (
    <WidgetBase
      title="Counter"
      subtitle={target ? `Target: ${target}` : undefined}
      onRemove={onRemove}
      onReset={handleReset}
      onEdit={onEdit}
      className={className}
    >
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full border-2 hover:bg-primary/5"
          onClick={handleDecrement}
        >
          <Minus className="h-4 w-4" />
        </Button>

        <div className="flex-1 text-center">
          <span className="text-4xl font-semibold tabular-nums">
            {value}
          </span>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full border-2 hover:bg-primary/5"
          onClick={handleIncrement}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {progress !== undefined && (
        <div className="space-y-1.5">
          <Progress
            value={progress}
            className="h-2"
          />
          <div className="flex justify-end">
            <p className="text-xs text-muted-foreground">
              {Math.round(progress)}% complete
            </p>
          </div>
        </div>
      )}
    </WidgetBase>
  );
}
