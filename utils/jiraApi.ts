import { JiraConfig, JiraData, Bug, LinkedIssue } from '../types/jira'

export async function fetchJiraData(config: JiraConfig, issueType: string | null = 'Bug'): Promise<JiraData> {
  try {
    const response = await fetch('/api/jira', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...config,
        jqlQuery: issueType
          ? `type = "${issueType}" ORDER BY created DESC`
          : 'type = Bug ORDER BY created DESC'
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch Jira data');
    }

    const data = await response.json();
    console.log('Jira API Response:', data);

    // Transform the response into our Bug type
    const bugs: Bug[] = await Promise.all(data.issues.map(async (issue: any) => {
      // Process linked issues
      const linkedIssues: LinkedIssue[] = await Promise.all(
        (issue.fields.issuelinks || []).map(async (link: any) => {
          const linkedIssue = link.inwardIssue || link.outwardIssue;
          if (!linkedIssue) return null;

          // Determine the link type
          let linkType = link.type.outward;
          if (link.inwardIssue) {
            linkType = link.type.inward;
          }

          // Get detailed information about the linked issue
          const linkedIssueResponse = await fetch('/api/jira', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...config,
              issueKey: linkedIssue.key
            })
          });

          if (!linkedIssueResponse.ok) return null;

          const linkedIssueData = await linkedIssueResponse.json();
          const linkedIssueFields = linkedIssueData.fields;

          return {
            key: linkedIssue.key,
            summary: linkedIssueFields.summary,
            status: linkedIssueFields.status.name,
            priority: linkedIssueFields.priority.name,
            teamName: getTeamName(linkedIssueFields.customfield_10014),
            sprintName: getSprintName(linkedIssueFields.customfield_10020),
            updated: linkedIssueFields.updated,
            issueType: {
              name: linkedIssueFields.issuetype.name,
              iconUrl: linkedIssueFields.issuetype.iconUrl
            },
            assignee: formatUser(linkedIssueFields.assignee),
            linkType
          };
        })
      );

      // Filter out null values and return the bug object
      return {
        key: issue.key,
        summary: issue.fields.summary,
        description: issue.fields.description,
        status: issue.fields.status.name,
        priority: issue.fields.priority.name,
        created: issue.fields.created,
        updated: issue.fields.updated,
        projectKey: issue.fields.project.key,
        projectName: issue.fields.project.name,
        sprintName: getSprintName(issue.fields.customfield_10020),
        teamName: getTeamName(issue.fields.customfield_10014),
        issueType: issue.fields.issuetype ? {
          name: issue.fields.issuetype.name,
          iconUrl: issue.fields.issuetype.iconUrl || ''
        } : {
          name: 'Unknown',
          iconUrl: ''
        },
        assignee: formatUser(issue.fields.assignee),
        reporter: formatUser(issue.fields.reporter),
        linkedIssues: linkedIssues.filter(Boolean)
      };
    }));

    const projects = [...new Set(bugs.map(bug => bug.projectKey))];

    // Get current user information
    const userResponse = await fetch('/api/jira/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config)
    });

    const userData = await userResponse.json();
    const currentUser = userData.success ? {
      displayName: userData.displayName,
      email: userData.emailAddress,
      avatarUrl: userData.avatarUrls?.['48x48']
    } : undefined;

    return {
      projects,
      bugs,
      currentUser,
      totalBugs: bugs.length,
      activeBugs: bugs.filter(bug => bug.status !== 'Done' && bug.status !== 'Closed').length,
      criticalBugs: bugs.filter(bug => bug.priority === 'Highest' || bug.priority === 'High').length,
      avgResolutionTime: calculateAvgResolutionTime(bugs),
      bugStatusDistribution: calculateStatusDistribution(bugs),
      bugsByProject: calculateBugsByProject(bugs),
      bugTrend: calculateBugTrend(bugs),
      bugHeatmap: calculateBugHeatmap(bugs)
    };
  } catch (error) {
    console.error('Error fetching Jira data:', error);
    throw new Error(
      error instanceof Error 
        ? `Failed to fetch Jira data: ${error.message}`
        : 'Failed to fetch Jira data: Unknown error'
    );
  }
}

// Helper function to get sprint name
function getSprintName(sprintField: any): string {
  if (!sprintField || !Array.isArray(sprintField) || sprintField.length === 0) {
    return 'Backlog';
  }
  
  // Find the active sprint or get the last sprint
  const activeSprint = sprintField.find(sprint => sprint.state === 'active') || sprintField[0];
  return activeSprint.name;
}

// Helper function to get team name
function getTeamName(teamField: any): string {
  if (!teamField || !teamField.value) {
    return 'Unassigned';
  }
  return teamField.value;
}

// Helper function to format user data
function formatUser(user: any) {
  if (!user) return undefined;
  return {
    name: user.displayName,
    email: user.emailAddress,
    avatarUrl: user.avatarUrls?.['48x48']
  };
}

// Helper function to calculate average resolution time
function calculateAvgResolutionTime(bugs: Bug[]): number {
  const resolvedBugs = bugs.filter(bug => 
    bug.status === 'Done' || bug.status === 'Resolved' || bug.status === 'Closed'
  );

  if (resolvedBugs.length === 0) return 0;

  const totalTime = resolvedBugs.reduce((sum, bug) => {
    const created = new Date(bug.created).getTime();
    const updated = new Date(bug.updated).getTime();
    return sum + (updated - created);
  }, 0);

  return Math.round(totalTime / resolvedBugs.length / (1000 * 60 * 60 * 24)); // Convert to days
}

// Helper functions for calculating statistics
function calculateStatusDistribution(bugs: Bug[]) {
  const distribution = bugs.reduce((acc, bug) => {
    acc[bug.status] = (acc[bug.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(distribution).map(([name, value]) => ({ name, value }));
}

function calculateBugsByProject(bugs: Bug[]) {
  const byProject = bugs.reduce((acc, bug) => {
    acc[bug.projectName] = (acc[bug.projectName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(byProject).map(([name, bugs]) => ({ name, bugs }));
}

function calculateBugTrend(bugs: Bug[]) {
  // Implementation for bug trend calculation
  return [];
}

function calculateBugHeatmap(bugs: Bug[]) {
  // Implementation for bug heatmap calculation
  return [];
} 