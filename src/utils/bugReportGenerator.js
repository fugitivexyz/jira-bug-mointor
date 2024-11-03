/**
 * Generates a detailed bug report for Jira bugs
 * @param {Object} params
 * @param {Array} params.bugs - List of Jira bugs
 * @param {Object} params.sprints - Sprint data
 * @param {Object} params.filters - Applied filters
 * @param {Object} params.systemInfo - System information
 * @returns {Object} Formatted bug report
 */
export function generateBugReport({ bugs, sprints, filters, systemInfo }) {
  return {
    version: '1.0',
    generatedAt: new Date().toISOString(),
    systemInfo,
    filters,
    bugs: bugs.map(bug => ({
      id: bug.id,
      key: bug.key,
      summary: bug.summary,
      status: bug.status,
      priority: bug.priority,
      assignee: bug.assignee,
      sprint: bug.sprint,
      created: bug.created,
      updated: bug.updated,
      linkedIssues: bug.linkedIssues || []
    })),
    sprints: Object.entries(sprints).map(([sprintName, issues]) => ({
      name: sprintName,
      issueCount: issues.length,
      issues: issues.map(issue => ({
        key: issue.key,
        summary: issue.summary,
        status: issue.status
      }))
    })),
    metrics: {
      totalBugs: bugs.length,
      byPriority: bugs.reduce((acc, bug) => {
        acc[bug.priority] = (acc[bug.priority] || 0) + 1;
        return acc;
      }, {}),
      byStatus: bugs.reduce((acc, bug) => {
        acc[bug.status] = (acc[bug.status] || 0) + 1;
        return acc;
      }, {}),
      bySprint: bugs.reduce((acc, bug) => {
        acc[bug.sprint] = (acc[bug.sprint] || 0) + 1;
        return acc;
      }, {})
    }
  };
} 