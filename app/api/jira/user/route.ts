import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const config = await req.json();
    
    const headers = {
      'Authorization': `Basic ${Buffer.from(`${config.email}:${config.apiToken}`).toString('base64')}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const baseUrl = config.instanceUrl.endsWith('/')
      ? config.instanceUrl.slice(0, -1)
      : config.instanceUrl;

    const response = await fetch(`${baseUrl}/rest/api/3/myself`, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }

    const data = await response.json();
    return NextResponse.json({ ...data, success: true });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error', success: false },
      { status: 500 }
    );
  }
} 