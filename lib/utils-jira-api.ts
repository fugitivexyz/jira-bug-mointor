import { JiraConfig } from '@/types/jira'

export async function fetchJiraData(jiraConfig: JiraConfig) {
  const { instanceUrl, email, apiToken } = jiraConfig

  const headers = {
    'Authorization': `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }

  const baseUrl = instanceUrl.endsWith('/')
    ? instanceUrl.slice(0, -1)
    : instanceUrl

  try {
    const response = await fetch(`${baseUrl}/rest/api/3/search`, {
      method: 'GET',
      headers,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching Jira data:', error)
    throw error
  }
}