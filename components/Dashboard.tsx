'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchJiraData } from '../utils/jiraApi'
import { KeyMetricsComponent as KeyMetrics } from './KeyMetrics'
import { BugStatusChartComponent } from './BugStatusChart'
import { BugsByProjectChartComponent } from './BugsByProjectChart'
import { BugTrendChartComponent } from './BugTrendChart'
import { BugHeatmapComponent } from './BugHeatmap'
import { BugListComponent as BugList } from './BugList'
import { ProjectFilterComponent as ProjectFilter } from './ProjectFilter'
import { BugDetailsPanelComponent as BugDetailsPanel } from './BugDetailsPanel'
import { JiraConfig, JiraData, Bug } from '../types/jira'
import { LinkedIssuesSummary } from './LinkedIssuesSummary'
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { saveCredentials, getCredentials } from '../utils/storage'
import { UserNav } from "./UserNav"
import { IssueTypeFilter } from './IssueTypeFilter'

interface DashboardProps {
  jiraConfig: JiraConfig;
}

interface QueryError {
  message: string;
}

export function DashboardComponent({ jiraConfig }: DashboardProps) {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedBug, setSelectedBug] = useState<Bug | null>(null);
  const [dashboardProject, setDashboardProject] = useState<string | null>(null);
  const [selectedIssueType, setSelectedIssueType] = useState<string | null>('Bug');

  // Memoize the project selection handler
  const handleProjectSelect = useCallback((project: string | null) => {
    setSelectedProject(project);
    setSelectedBug(null);
  }, []);

  // Memoize the issue type selection handler
  const handleIssueTypeSelect = useCallback((issueType: string | null) => {
    setSelectedIssueType(issueType);
  }, []);

  // Update the useQuery hook to use the correct syntax
  const { data: jiraData, isLoading, error } = useQuery({
    queryKey: ['jiraData', jiraConfig.instanceUrl, selectedIssueType],
    queryFn: () => fetchJiraData(jiraConfig, selectedIssueType),
    staleTime: 30000,
    refetchOnWindowFocus: false,
    refetchInterval: 5 * 60 * 1000,
    retry: 1
  });

  // Save credentials when they're provided
  useEffect(() => {
    if (jiraConfig) {
      saveCredentials(jiraConfig);
    }
  }, [jiraConfig]);

  // Filter bugs based on selected project
  const filteredBugs = useMemo(() => 
    jiraData?.bugs.filter(bug => 
      !selectedProject || bug.projectKey === selectedProject
    ) || [],
    [jiraData?.bugs, selectedProject]
  );

  // Filter bugs for dashboard
  const dashboardBugs = useMemo(() => 
    dashboardProject
      ? jiraData?.bugs.filter(bug => bug.projectKey === dashboardProject)
      : jiraData?.bugs,
    [jiraData?.bugs, dashboardProject]
  );

  // Helper functions for calculations
  const calculateAvgResolutionTime = (bugs: Bug[]): number => {
    const resolvedBugs = bugs.filter(bug => 
      bug.status === 'Done' || bug.status === 'Resolved' || bug.status === 'Closed'
    );

    if (resolvedBugs.length === 0) return 0;

    const totalTime = resolvedBugs.reduce((sum, bug) => {
      const created = new Date(bug.created).getTime();
      const updated = new Date(bug.updated).getTime();
      return sum + (updated - created);
    }, 0);

    return Math.round(totalTime / resolvedBugs.length / (1000 * 60 * 60 * 24));
  };

  const calculateStatusDistribution = (bugs: Bug[]) => {
    const distribution = bugs.reduce((acc, bug) => {
      acc[bug.status] = (acc[bug.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(distribution).map(([name, value]) => ({ name, value }));
  };

  const calculateBugsByProject = (bugs: Bug[]) => {
    const byProject = bugs.reduce((acc, bug) => {
      acc[bug.projectName] = (acc[bug.projectName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(byProject).map(([name, bugs]) => ({ name, bugs }));
  };

  const calculateBugTrend = (bugs: Bug[]) => {
    // Implementation for bug trend calculation
    return [];
  };

  const calculateBugHeatmap = (bugs: Bug[]) => {
    // Implementation for bug heatmap calculation
    return [];
  };

  // Calculate dashboard metrics based on filtered bugs
  const dashboardMetrics = {
    totalBugs: dashboardBugs?.length || 0,
    activeBugs: dashboardBugs?.filter(bug => bug.status !== 'Done' && bug.status !== 'Closed').length || 0,
    criticalBugs: dashboardBugs?.filter(bug => bug.priority === 'Highest' || bug.priority === 'High').length || 0,
    avgResolutionTime: calculateAvgResolutionTime(dashboardBugs || []),
    bugStatusDistribution: calculateStatusDistribution(dashboardBugs || []),
    bugsByProject: calculateBugsByProject(dashboardBugs || []),
    bugTrend: calculateBugTrend(dashboardBugs || []),
    bugHeatmap: calculateBugHeatmap(dashboardBugs || [])
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded p-4 max-w-lg">
          <h3 className="text-red-800 font-semibold mb-2">Error Loading Dashboard</h3>
          <p className="text-red-600">{error.message}</p>
          <p className="text-sm text-red-500 mt-2">Please check your Jira configuration and try again.</p>
        </div>
      </div>
    );
  }

  if (!jiraData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>No data available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="flex h-16 items-center px-4 container mx-auto">
          <h1 className="text-xl font-bold">Jira Bug Monitor</h1>
          <div className="ml-auto flex items-center space-x-4">
            <ThemeToggle />
            <UserNav user={jiraData?.currentUser} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-4 space-y-6">
        <Card>
          <Tabs defaultValue="dependencies" className="w-full">
            <div className="border-b px-4 py-2">
              <TabsList className="w-full justify-start gap-6">
                <TabsTrigger value="dependencies" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-primary data-[state=active]:border-b-2">
                  Dependency Tracker
                </TabsTrigger>
                <TabsTrigger value="dashboard" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-primary data-[state=active]:border-b-2">
                  Dashboard
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Dependency Tracker Panel */}
            <TabsContent value="dependencies" className="p-4 space-y-4">
              <div className="flex justify-between items-center gap-4">
                <ProjectFilter 
                  projects={jiraData?.projects || []}
                  selectedProject={selectedProject}
                  onSelectProject={handleProjectSelect}
                />
                {selectedProject && (
                  <IssueTypeFilter
                    jiraConfig={jiraConfig}
                    selectedProject={selectedProject}
                    selectedIssueType={selectedIssueType}
                    onSelectIssueType={handleIssueTypeSelect}
                  />
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3">
                  <BugList
                    bugs={filteredBugs}
                    onSelectBug={setSelectedBug}
                    selectedProject={selectedProject}
                    selectedBug={selectedBug}
                    instanceUrl={jiraConfig.instanceUrl}
                  />
                </div>

                <div className="lg:col-span-2">
                  <LinkedIssuesSummary 
                    bugs={filteredBugs}
                    selectedBug={selectedBug}
                    instanceUrl={jiraConfig.instanceUrl}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Dashboard Panel */}
            <TabsContent value="dashboard" className="p-4 space-y-6">
              <div className="flex justify-between items-center">
                <ProjectFilter 
                  projects={jiraData?.projects || []}
                  selectedProject={dashboardProject}
                  onSelectProject={setDashboardProject}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Total Bugs</p>
                      <h2 className="text-3xl font-bold">{dashboardMetrics.totalBugs}</h2>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Active Bugs</p>
                      <h2 className="text-3xl font-bold">{dashboardMetrics.activeBugs}</h2>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Critical Bugs</p>
                      <h2 className="text-3xl font-bold text-red-600">{dashboardMetrics.criticalBugs}</h2>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Avg. Resolution Time</p>
                      <h2 className="text-3xl font-bold">{dashboardMetrics.avgResolutionTime} days</h2>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <BugStatusChartComponent data={dashboardMetrics.bugStatusDistribution} />
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <BugsByProjectChartComponent data={dashboardMetrics.bugsByProject} />
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardContent className="p-6">
                  <BugTrendChartComponent data={dashboardMetrics.bugTrend} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}

export default DashboardComponent;