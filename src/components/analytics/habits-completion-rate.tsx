'use client';

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { format, parseISO } from "date-fns";

interface HabitsCompletionRateProps {
  data: Array<{
    date: string;
    completed: number;
    total: number;
  }>;
}

const HabitsCompletionRate = ({ data }: HabitsCompletionRateProps) => {
  const chartData = data.map(item => ({
    ...item,
    rate: (item.completed / item.total) * 100,
    formattedDate: format(parseISO(item.date), 'MMM dd')
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData}>
        <XAxis
          dataKey="formattedDate"
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
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            padding: '8px'
          }}
          formatter={(value: number) => [`${value.toFixed(1)}%`, 'Completion Rate']}
        />
        <Line
          type="monotone"
          dataKey="rate"
          stroke="currentColor"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export { HabitsCompletionRate };
