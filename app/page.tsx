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
        <div className="min-h-screen">
          {/* Header */}
          <div className="border-b">
            <div className="flex h-16 items-center px-4 container mx-auto">
              <h1 className="text-xl font-bold">Jira Bug Monitor</h1>
            </div>
          </div>
          
          {/* Login Form */}
          <JiraLoginComponent onAuthenticate={handleAuthentication} />
        </div>
      ) : (
        <DashboardComponent jiraConfig={jiraConfig} />
      )}
    </div>
  )
}