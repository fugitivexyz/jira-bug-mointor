'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface BugTrendData {
  date: string;
  count: number;
}

interface BugTrendChartProps {
  data: BugTrendData[];
}

export function BugTrendChartComponent({ data }: BugTrendChartProps) {
  // Set explicit dimensions
  const width = 400;
  const height = 300;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Bug Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-full flex items-center justify-center">
          <LineChart width={width} height={height} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#8884d8" />
          </LineChart>
        </div>
      </CardContent>
    </Card>
  )
}

export default BugTrendChartComponent;