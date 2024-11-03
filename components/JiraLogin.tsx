'use client'

import { useState, useEffect } from 'react'
import { getCredentials } from '../utils/storage'
import { JiraConfig } from '../types/jira'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

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
    // Check for stored credentials on component mount
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
    <div className="container mx-auto p-4">
      <div className="max-w-md mx-auto mt-20">
        <Card>
          <CardHeader>
            <CardTitle>Connect to Jira</CardTitle>
            <CardDescription>
              Enter your Jira Cloud credentials to access the bug dashboard
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    setFormData({ ...formData, instanceUrl: e.target.value })
                  }
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    setFormData({ ...formData, email: e.target.value })
                  }
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    setFormData({ ...formData, apiToken: e.target.value })
                  }
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
    </div>
  )
}

export default JiraLoginComponent;