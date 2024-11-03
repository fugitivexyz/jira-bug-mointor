'use client'

import { useState } from 'react'
import { JiraLoginComponent } from '@/components/JiraLogin'
import { DashboardComponent } from '@/components/Dashboard'
import { JiraConfig } from '@/types/jira'

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [jiraConfig, setJiraConfig] = useState<JiraConfig>({
    instanceUrl: '',
    email: '',
    apiToken: ''
  })

  const handleAuthentication = (config: JiraConfig) => {
    setJiraConfig(config)
    setIsAuthenticated(true)
  }

  return (
    <div className="min-h-screen bg-background">
      {!isAuthenticated ? (
        <JiraLoginComponent onAuthenticate={handleAuthentication} />
      ) : (
        <DashboardComponent jiraConfig={jiraConfig} />
      )}
    </div>
  )
}