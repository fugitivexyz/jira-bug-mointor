import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { projectKey, ...config } = await req.json();
    
    const headers = {
      'Authorization': `Basic ${Buffer.from(`${config.email}:${config.apiToken}`).toString('base64')}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const baseUrl = config.instanceUrl.endsWith('/')
      ? config.instanceUrl.slice(0, -1)
      : config.instanceUrl;

    // First, get the project metadata which includes issue types
    const apiUrl = `${baseUrl}/rest/api/3/project/${projectKey}`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      throw new Error('Failed to fetch project metadata');
    }

    const data = await response.json();
    
    // Extract and transform issue types from the project metadata
    const issueTypes = data.issueTypes?.map((type: any) => ({
      id: type.id,
      name: type.name,
      iconUrl: type.iconUrl,
      description: type.description,
      subtask: type.subtask
    })) || [];

    // Sort issue types (putting standard types before subtasks)
    const sortedIssueTypes = issueTypes.sort((a: any, b: any) => {
      if (a.subtask === b.subtask) {
        return a.name.localeCompare(b.name);
      }
      return a.subtask ? 1 : -1;
    });

    return NextResponse.json(sortedIssueTypes);
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 