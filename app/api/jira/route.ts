import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { issueKey, ...config } = await req.json();
    
    const headers = {
      'Authorization': `Basic ${Buffer.from(`${config.email}:${config.apiToken}`).toString('base64')}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const baseUrl = config.instanceUrl.endsWith('/')
      ? config.instanceUrl.slice(0, -1)
      : config.instanceUrl;

    // If issueKey is provided, fetch single issue details
    if (issueKey) {
      const issueUrl = `${baseUrl}/rest/api/3/issue/${issueKey}`;
      const response = await fetch(issueUrl, {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch issue ${issueKey}`);
      }

      const data = await response.json();
      return NextResponse.json(data);
    }

    // Otherwise fetch all bugs
    const jqlQuery = config.jqlQuery || 'type = Bug ORDER BY created DESC';
    const apiUrl = `${baseUrl}/rest/api/3/search`;

    const params = new URLSearchParams({
      jql: jqlQuery,
      expand: 'names,sprint,issuelinks',
      fields: [
        'summary',
        'description',
        'status',
        'priority',
        'created',
        'updated',
        'project',
        'customfield_10020',
        'customfield_10014',
        'assignee',
        'reporter',
        'issuelinks',
        'issuetype'
      ].join(',')
    });

    const response = await fetch(`${apiUrl}?${params}`, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.errorMessages?.[0] || 
        `Jira API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 