import axios from 'axios'

export async function fetchJiraData(jiraConfig) {
  const { instanceUrl, email, apiToken } = jiraConfig
  const auth = Buffer.from(`${email}:${apiToken}`).toString('base64')

  const api = axios.create({
    baseURL: instanceUrl,
    headers: {
      'Authorization': `Basic ${auth}`,
      'Accept': 'application/json'
    }
  })

  // Fetch projects
  const projectsResponse = await api.get('/rest/api/3/project')
  const projects = projectsResponse.data

  // Fetch bugs
  const bugsResponse = await api.get('/rest/api/3/search', {
    params: {
      jql: 'type = Bug',
      fields: 'summary,status,priority,assignee,project'
    }
  })
  const bugs = bugsResponse.data.issues

  // Process data for charts and metrics
  const bugStatusDistribution = processBugStatusDistribution(bugs)
  const bugsByProject = processBugsByProject(bugs)
  const bugTrend = await fetchBugTrend(api)
  const bugHeatmap = processBugHeatmap(bugs)

  return {
    projects,
    bugs,
    totalBugs: bugs.length,
    activeBugs: bugs.filter(bug => bug.fields.status.name !== 'Done').length,
    criticalBugs: bugs.filter(bug => bug.fields.priority.name === 'Highest').length,
    avgResolutionTime: calculateAvgResolutionTime(bugs),
    bugStatusDistribution,
    bugsByProject,
    bugTrend,
    bugHeatmap
  }
}

function processBugStatusDistribution(bugs) {
  const statusCounts = {}
  bugs.forEach(bug => {
    const status = bug.fields.status.name
    statusCounts[status] = (statusCounts[status] || 0) + 1
  })
  return Object.entries(statusCounts).map(([name, value]) => ({ name, value }))
}

function processBugsByProject(bugs) {
  const projectCounts = {}
  bugs.forEach(bug => {
    const project = bug.fields.project.name
    projectCounts[project] = (projectCounts[project] || 0) + 1
  })
  return Object.entries(projectCounts).map(([name, bugs]) => ({ name, bugs }))
}

async function fetchBugTrend(api) {
  const twoWeeksAgo = new Date()
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)

  const response = await api.get('/rest/api/3/search', {
    params: {
      jql: `type = Bug AND created >= "${twoWeeksAgo.toISOString().split('T')[0]}"`,
      fields: 'created'
    }
  })

  const bugsByDate = {}
  response.data.issues.forEach(bug => {
    const date = bug.fields.created.split('T')[0]
    bugsByDate[date] = (bugsByDate[date] || 0) + 1
  })

  return Object.entries(bugsByDate).map(([date, newBugs]) => ({ date, newBugs }))
}

function processBugHeatmap(bugs) {
  // Implement heatmap data processing logic here
  return []
}

function calculateAvgResolutionTime(bugs) {
  // Implement average resolution time calculation logic here
  return 0
}