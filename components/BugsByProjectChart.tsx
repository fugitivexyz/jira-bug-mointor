'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface BugsByProjectData {
  name: string;
  bugs: number;
}

interface BugsByProjectChartProps {
  data: BugsByProjectData[];
}

export function BugsByProjectChartComponent({ data }: BugsByProjectChartProps) {
  // Set explicit dimensions
  const width = 400;
  const height = 300;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Bugs by Project</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-full flex items-center justify-center">
          <BarChart width={width} height={height} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="bugs" fill="#8884d8" />
          </BarChart>
        </div>
      </CardContent>
    </Card>
  )
}

export default BugsByProjectChartComponent;