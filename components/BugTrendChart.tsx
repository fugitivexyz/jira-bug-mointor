'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface BugTrendChartProps {
  data: Array<{ date: string; count: number }>;
}

export function BugTrendChartComponent({ data }: BugTrendChartProps) {
  return (
    <div className="h-[300px]">
      <h3 className="text-lg font-semibold mb-4">Bug Trend</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}