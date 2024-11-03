import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { instanceUrl, email, apiToken } = body;

    // Validate inputs
    if (!instanceUrl || !email || !apiToken) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Test connection to Jira
    const baseUrl = instanceUrl.trim().replace(/\/$/, '');
    const response = await fetch(`${baseUrl}/rest/api/2/myself`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return NextResponse.json(
        { error: errorData?.errorMessages?.[0] || 'Failed to connect to Jira' },
        { status: response.status }
      );
    }

    // Connection successful
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Test connection error:', error);
    return NextResponse.json(
      { error: 'Failed to test Jira connection' },
      { status: 500 }
    );
  }
} 