'use client'

import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface BugStatusData {
  name: string;
  value: number;
}

interface BugStatusChartProps {
  data: BugStatusData[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export function BugStatusChartComponent({ data }: BugStatusChartProps) {
  // Set explicit dimensions instead of using ResponsiveContainer
  const width = 400;
  const height = 300;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Bug Status Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-full flex items-center justify-center">
          <PieChart width={width} height={height}>
            <Pie
              data={data}
              cx={width / 2}
              cy={height / 2}
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </CardContent>
    </Card>
  )
}

export default BugStatusChartComponent;