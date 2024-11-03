'use client'

import { useState } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import JiraLogin from '../components/JiraLogin'
import Dashboard from '../components/Dashboard'

const queryClient = new QueryClient()

export function Page() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [jiraConfig, setJiraConfig] = useState({
    instanceUrl: '',
    email: '',
    apiToken: ''
  })

  const handleAuthentication = (config) => {
    setJiraConfig(config)
    setIsAuthenticated(true)
  }

  return (
    <QueryClientProvider client={queryClient}>
      <main className="min-h-screen bg-gray-100">
        {!isAuthenticated ? (
          <JiraLogin onAuthenticate={handleAuthentication} />
        ) : (
          <Dashboard jiraConfig={jiraConfig} />
        )}
      </main>
    </QueryClientProvider>
  )
}