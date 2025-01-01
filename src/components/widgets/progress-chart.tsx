'use client';

import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { WidgetBase } from "./widget-base";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface DataPoint {
  date: string;
  value: number;
}

interface ProgressChartProps {
  className?: string;
  data?: DataPoint[];
  onRemove?: () => void;
  onEdit?: () => void;
}

export function ProgressChart({
  className,
  data = [],
  onRemove,
  onEdit,
}: ProgressChartProps) {
  return (
    <WidgetBase
      title="Progress"
      onRemove={onRemove}
      onEdit={onEdit}
      className={cn(
        "p-4 bg-card rounded-lg border shadow-sm space-y-4",
        className
      )}
    >
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <XAxis 
              dataKey="date" 
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Value
                          </span>
                          <span className="font-bold text-sm">
                            {payload[0].value}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Date
                          </span>
                          <span className="font-bold text-sm">
                            {payload[0].payload.date}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              strokeWidth={2}
              activeDot={{
                r: 6,
                style: { fill: "hsl(var(--primary))", opacity: 0.8 }
              }}
              style={{
                stroke: "hsl(var(--primary))",
                opacity: 0.8,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </WidgetBase>
  );
}
