'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { JiraData } from '@/types/jira'

interface KeyMetricsProps {
  data: JiraData;
}

export function KeyMetricsComponent({ data }: KeyMetricsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Total Bugs</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{data.totalBugs}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Active Bugs</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{data.activeBugs}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Critical Bugs</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-red-600">{data.criticalBugs}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Avg. Resolution Time</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{data.avgResolutionTime} days</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default KeyMetricsComponent;