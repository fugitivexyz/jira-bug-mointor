'use client'

import { useState, useEffect } from 'react'
import { getCredentials } from '../utils/storage'
import { JiraConfig } from '../types/jira'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, BarChart2, Link, GitBranch, RefreshCcw, Github } from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"

interface JiraLoginProps {
  onAuthenticate: (config: JiraConfig) => void;
}

export function JiraLoginComponent({ onAuthenticate }: JiraLoginProps) {
  const [formData, setFormData] = useState<JiraConfig>({
    instanceUrl: '',
    email: '',
    apiToken: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedCredentials = getCredentials();
    if (storedCredentials) {
      setFormData(storedCredentials);
      onAuthenticate(storedCredentials);
    }
  }, [onAuthenticate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await onAuthenticate(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to authenticate');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-16 text-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
            Jira Bug Monitor
          </span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-16">
          A modern dashboard for tracking, analyzing, and managing Jira issues with powerful dependency visualization.
        </p>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4">
        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Features */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Key Features</h2>
            <div className="grid gap-6">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <BarChart2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Real-time Analytics</h3>
                  <p className="text-muted-foreground">
                    Comprehensive dashboards with bug trends, status distribution, and project metrics.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Link className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Dependency Tracking</h3>
                  <p className="text-muted-foreground">
                    Visualize and manage issue dependencies across projects and sprints.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <GitBranch className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Project Organization</h3>
                  <p className="text-muted-foreground">
                    Filter and organize issues by project, sprint, and status.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <RefreshCcw className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Real-time Updates</h3>
                  <p className="text-muted-foreground">
                    Stay synchronized with your Jira instance with automatic data refresh.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Login Form */}
          <Card>
            <CardHeader>
              <CardTitle>Connect to Jira</CardTitle>
              <CardDescription>
                Enter your Jira Cloud credentials to access the dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded">
                    {error}
                  </div>
                )}
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Instance URL</label>
                  <Input
                    type="url"
                    placeholder="https://your-domain.atlassian.net"
                    value={formData.instanceUrl}
                    onChange={(e) => setFormData({ ...formData, instanceUrl: e.target.value })}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">API Token</label>
                  <Input
                    type="password"
                    placeholder="Your Jira API token"
                    value={formData.apiToken}
                    onChange={(e) => setFormData({ ...formData, apiToken: e.target.value })}
                    required
                    disabled={isLoading}
                  />
                  <p className="text-xs text-muted-foreground">
                    Get your API token from{' '}
                    <a 
                      href="https://id.atlassian.com/manage-profile/security/api-tokens"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Atlassian Account Settings
                    </a>
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    'Connect'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Security Features - Horizontal Layout */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-8 text-center">Security First</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900 mb-4">
                <svg
                  className="h-6 w-6 text-green-600 dark:text-green-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Client-Side Encryption</h3>
              <p className="text-sm text-muted-foreground">
                Your Jira credentials are encrypted and stored locally in your browser.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900 mb-4">
                <svg
                  className="h-6 w-6 text-green-600 dark:text-green-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Secure Communication</h3>
              <p className="text-sm text-muted-foreground">
                All communication with Jira is done through secure HTTPS connections.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900 mb-4">
                <svg
                  className="h-6 w-6 text-green-600 dark:text-green-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                  />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">No Server Storage</h3>
              <p className="text-sm text-muted-foreground">
                Everything is processed client-side for maximum privacy.
              </p>
            </div>
          </div>
        </div>

        {/* Footer with GitHub Link */}
        <div className="text-center pb-8">
          <div className="flex flex-col items-center gap-4">
            <a
              href="https://github.com/fugitivexyz/jira-bug-monitor"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Github className="h-5 w-5" />
              <span>View on GitHub</span>
            </a>
            <p className="text-sm text-muted-foreground">
              Built with Next.js 14, React, and Tailwind CSS
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JiraLoginComponent;