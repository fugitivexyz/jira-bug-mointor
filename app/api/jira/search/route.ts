import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const jql = searchParams.get('jql');
    const maxResults = searchParams.get('maxResults');
    
    // Get Jira credentials from headers
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header missing' },
        { status: 401 }
      );
    }

    // Get Jira instance URL from environment variable or query param
    const jiraUrl = process.env.JIRA_BASE_URL || request.headers.get('x-jira-instance');
    if (!jiraUrl) {
      return NextResponse.json(
        { error: 'Jira instance URL not configured' },
        { status: 400 }
      );
    }

    // Forward the request to Jira
    const response = await fetch(
      `${jiraUrl}/rest/api/2/search?jql=${jql}&maxResults=${maxResults}`,
      {
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.errorMessages || 'Failed to fetch from Jira' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Proxy Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 