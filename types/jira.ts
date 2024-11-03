export interface JiraConfig {
  instanceUrl: string;
  email: string;
  apiToken: string;
}

export interface LinkedIssue {
  key: string;
  summary: string;
  status: string;
  priority: string;
  teamName?: string;
  sprintName?: string;
  updated?: string;
  issueType: {
    name: string;
    iconUrl: string;
  };
  assignee?: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
  linkType: string;
}

export interface Bug {
  key: string;
  summary: string;
  description: string;
  status: string;
  priority: string;
  created: string;
  updated: string;
  projectKey: string;
  projectName: string;
  teamName?: string;
  sprintName?: string;
  issueType: {
    name: string;
    iconUrl: string;
  };
  assignee?: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
  reporter: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
  comments?: {
    id: string;
    body: string;
    author: {
      name: string;
      email: string;
      avatarUrl?: string;
    };
    created: string;
  }[];
  linkedIssues?: LinkedIssue[];
  sprint?: string;
}

export interface JiraData {
  projects: string[];
  bugs: Bug[];
  totalBugs: number;
  activeBugs: number;
  criticalBugs: number;
  avgResolutionTime: number;
  bugStatusDistribution: Array<{ name: string; value: number }>;
  bugsByProject: Array<{ name: string; bugs: number }>;
  bugTrend: Array<{ date: string; count: number }>;
  bugHeatmap: Array<{ day: string; count: number }>;
  currentUser?: {
    displayName: string;
    email: string;
    avatarUrl?: string;
  };
}

export interface QueryError {
  message: string;
} 