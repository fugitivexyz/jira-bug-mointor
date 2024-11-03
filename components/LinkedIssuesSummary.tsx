'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bug, LinkedIssue } from '../types/jira'
import { useEffect, useState, useCallback } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import Image from 'next/image'

interface LinkedIssuesSummaryProps {
  bugs: Bug[];
  selectedBug: Bug | null;
  instanceUrl: string;
}

interface GroupedIssues {
  [sprintName: string]: {
    linkedIssue: LinkedIssue;
    fromBug: Bug;
  }[];
}

export function LinkedIssuesSummary({ bugs, selectedBug, instanceUrl }: LinkedIssuesSummaryProps) {
  const [openSprints, setOpenSprints] = useState<string[]>([]);
  const [visibleIssues, setVisibleIssues] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  // Get all linked issues, sort them by updated date, and then group them by sprint
  const groupedLinkedIssues = bugs.reduce((acc: GroupedIssues, bug) => {
    if (!bug.linkedIssues?.length) return acc;

    // Sort linked issues by updated date (most recent first)
    const sortedLinkedIssues = [...bug.linkedIssues].sort((a, b) => {
      // If we have updated dates in the LinkedIssue type, use those
      // Otherwise, we'll need to add them to the type and fetch them
      return new Date(b.updated || '').getTime() - new Date(a.updated || '').getTime();
    });

    sortedLinkedIssues.forEach(linkedIssue => {
      const sprintName = linkedIssue.sprintName || 'Backlog';
      if (!acc[sprintName]) {
        acc[sprintName] = [];
      }
      acc[sprintName].push({ linkedIssue, fromBug: bug });
    });

    // Sort the issues within each sprint by updated date
    Object.keys(acc).forEach(sprintName => {
      acc[sprintName].sort((a, b) => {
        return new Date(b.linkedIssue.updated || '').getTime() - 
               new Date(a.linkedIssue.updated || '').getTime();
      });
    });

    return acc;
  }, {});

  // Update open sprints when selected bug changes
  useEffect(() => {
    if (selectedBug?.linkedIssues?.length) {
      // Get all unique sprints for the selected bug's linked issues
      const sprintsToOpen = selectedBug.linkedIssues.map(issue => 
        issue.sprintName || 'Backlog'
      );
      setOpenSprints([...new Set(sprintsToOpen)]);
    } else {
      setOpenSprints([]);
    }
  }, [selectedBug]);

  const loadMoreIssues = useCallback(() => {
    setVisibleIssues(prev => prev + 10);
  }, []);

  if (bugs.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        No bugs found for the current selection
      </div>
    );
  }

  if (Object.keys(groupedLinkedIssues).length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        No linked issues found for the current selection
      </div>
    );
  }

  // Sort sprints - put Backlog at the end
  const sortedSprints = Object.keys(groupedLinkedIssues).sort((a, b) => {
    if (a === 'Backlog') return 1;
    if (b === 'Backlog') return -1;
    return a.localeCompare(b);
  });

  const getIssueUrl = (key: string) => {
    const baseUrl = instanceUrl.endsWith('/') ? instanceUrl.slice(0, -1) : instanceUrl;
    return `${baseUrl}/browse/${key}`;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Linked Issues by Sprint</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-16rem)]">
          <Accordion 
            type="multiple" 
            value={openSprints}
            onValueChange={setOpenSprints}
            className="space-y-2"
          >
            {sortedSprints.map((sprintName) => (
              <AccordionItem
                key={sprintName}
                value={sprintName}
                className="border rounded-lg"
              >
                <AccordionTrigger className="px-4 hover:no-underline">
                  <div className="flex items-center gap-4 text-left w-full">
                    <div>
                      <div className="font-medium">{sprintName}</div>
                      <div className="text-sm text-muted-foreground">
                        {groupedLinkedIssues[sprintName].length} linked {groupedLinkedIssues[sprintName].length === 1 ? 'issue' : 'issues'}
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="px-4 pb-4 space-y-3">
                    {groupedLinkedIssues[sprintName].slice(0, visibleIssues).map(({ linkedIssue, fromBug }) => (
                      <div
                        key={`${linkedIssue.key}-${fromBug.key}`}
                        className={`relative border rounded-md p-3 ${
                          selectedBug?.key === fromBug.key 
                            ? 'bg-primary/10 border-primary/20' 
                            : 'hover:bg-muted'
                        }`}
                      >
                        {/* Link Type and Status Header */}
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">
                            {linkedIssue.linkType}{' '}
                            <a 
                              href={getIssueUrl(fromBug.key)} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              {fromBug.key}
                            </a>
                          </span>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(linkedIssue.priority)}`}>
                              {linkedIssue.priority}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(linkedIssue.status)}`}>
                              {linkedIssue.status}
                            </span>
                          </div>
                        </div>

                        {/* Issue Summary */}
                        <div className="mb-2">
                          <div className="flex items-center gap-2">
                            {linkedIssue.issueType.iconUrl && (
                              <Image 
                                src={linkedIssue.issueType.iconUrl} 
                                alt={linkedIssue.issueType.name}
                                width={16}
                                height={16}
                                title={linkedIssue.issueType.name}
                              />
                            )}
                            <a 
                              href={getIssueUrl(linkedIssue.key)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline font-medium"
                            >
                              {linkedIssue.key}
                            </a>
                            <span className="text-muted-foreground">-</span>
                            <span className="text-foreground truncate">{linkedIssue.summary}</span>
                          </div>
                        </div>

                        {/* Issue Details */}
                        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <span className="font-medium">Team:</span>
                            <span>{linkedIssue.teamName || 'Unassigned'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">Sprint:</span>
                            <span>{linkedIssue.sprintName || 'Backlog'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">Assignee:</span>
                            <span>{linkedIssue.assignee?.name || 'Unassigned'}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {visibleIssues < groupedLinkedIssues[sprintName].length && (
                      <button onClick={loadMoreIssues}>Load More</button>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollArea>
      </CardContent>
    </Card>
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

export default LinkedIssuesSummary;