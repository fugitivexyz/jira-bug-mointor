'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface BugHeatmapData {
  day: string;
  count: number;
}

interface BugHeatmapProps {
  data: BugHeatmapData[];
}

export function BugHeatmapComponent({ data }: BugHeatmapProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Bug Activity Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-full flex items-center justify-center">
          {/* Implement your heatmap visualization here */}
          <p className="text-gray-500">Heatmap visualization coming soon</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default BugHeatmapComponent;