'use client'

import { useState, useMemo } from 'react'
import { Bug } from '../types/jira'
import { Link } from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from 'next/image'

interface BugListProps {
  bugs: Bug[];
  selectedProject: string | null;
  selectedBug: Bug | null;
  onSelectBug: (bug: Bug) => void;
  instanceUrl: string;
}

export function BugListComponent({ 
  bugs, 
  selectedProject, 
  selectedBug, 
  onSelectBug, 
  instanceUrl 
}: BugListProps) {
  // Sort bugs by updated date (most recent first)
  const sortedBugs = useMemo(() => 
    [...bugs].sort((a, b) => 
      new Date(b.updated).getTime() - new Date(a.updated).getTime()
    ),
    [bugs]
  );

  const filteredBugs = useMemo(() => {
    if (!selectedProject) return sortedBugs;
    return sortedBugs.filter(bug => bug.projectKey === selectedProject);
  }, [sortedBugs, selectedProject]);

  const getIssueUrl = (key: string) => {
    const baseUrl = instanceUrl.endsWith('/') ? instanceUrl.slice(0, -1) : instanceUrl;
    return `${baseUrl}/browse/${key}`;
  };

  return (
    <ScrollArea className="h-[calc(100vh-16rem)]">
      <div className="space-y-2 p-1">
        {filteredBugs.map((bug) => (
          <div
            key={bug.key}
            onClick={() => onSelectBug(bug)}
            className={`
              cursor-pointer rounded-md border p-3 
              hover:border-primary/50 hover:bg-accent
              ${selectedBug?.key === bug.key ? 'border-primary/50 bg-accent' : ''}
            `}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  {bug.issueType && (
                    <div className="w-4 h-4 flex items-center justify-center">
                      {bug.issueType.iconUrl ? (
                        <Image 
                          src={bug.issueType.iconUrl} 
                          alt={bug.issueType.name || 'Issue type'}
                          width={16}
                          height={16}
                          title={bug.issueType.name || 'Issue type'}
                          unoptimized
                        />
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          {bug.issueType.name?.[0] || '?'}
                        </span>
                      )}
                    </div>
                  )}
                  <a 
                    href={getIssueUrl(bug.key)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-primary hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {bug.key}
                  </a>
                  {bug.linkedIssues && bug.linkedIssues.length > 0 && (
                    <div title={`${bug.linkedIssues.length} linked issues`}>
                      <Link className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <h3 className="text-sm font-medium leading-tight mb-2">
                  {bug.summary}
                </h3>
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  {bug.teamName && (
                    <span>{bug.teamName}</span>
                  )}
                  {bug.sprintName && (
                    <>
                      <span>•</span>
                      <span>{bug.sprintName}</span>
                    </>
                  )}
                  <span>•</span>
                  <span>{new Date(bug.created).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(bug.status)}`}>
                  {bug.status}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${getPriorityColor(bug.priority)}`}>
                  {bug.priority}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    'Open': 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100',
    'In Progress': 'bg-yellow-100 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100',
    'Done': 'bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100',
    'Resolved': 'bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100',
    'Closed': 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100',
    'To Do': 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100',
  };
  return statusColors[status] || 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100';
}

function getPriorityColor(priority: string): string {
  const priorityColors: Record<string, string> = {
    'Highest': 'bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100',
    'High': 'bg-orange-100 text-orange-900 dark:bg-orange-900 dark:text-orange-100',
    'Medium': 'bg-yellow-100 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100',
    'Low': 'bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100',
    'Lowest': 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100',
  };
  return priorityColors[priority] || 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100';
}

export default BugListComponent;