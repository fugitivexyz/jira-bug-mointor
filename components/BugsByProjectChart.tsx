'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface BugsByProjectChartProps {
  data: Array<{ name: string; bugs: number }>;
}

export function BugsByProjectChartComponent({ data }: BugsByProjectChartProps) {
  return (
    <div className="h-[300px]">
      <h3 className="text-lg font-semibold mb-4">Bugs by Project</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="bugs" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}