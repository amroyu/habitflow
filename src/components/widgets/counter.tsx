'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Plus, Minus, RotateCcw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface CounterProps {
  className?: string;
  initialValue?: number;
  increment?: number;
  target?: number;
}

export function Counter({
  className,
  initialValue = 0,
  increment = 1,
  target,
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
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Counter</h3>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleReset}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={handleDecrement}
        >
          <Minus className="h-4 w-4" />
        </Button>
        
        <div className="text-center">
          <span className="text-2xl font-bold">{value}</span>
          {target && (
            <p className="text-xs text-muted-foreground">
              Target: {target}
            </p>
          )}
        </div>

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={handleIncrement}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {target && (
        <Progress 
          value={progress} 
          className="h-2"
        />
      )}
    </div>
  );
}
