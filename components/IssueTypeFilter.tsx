'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { JiraConfig } from '@/types/jira'
import Image from 'next/image'

interface IssueType {
  id: string;
  name: string;
  iconUrl?: string;
  description?: string;
  subtask: boolean;
}

interface IssueTypeFilterProps {
  jiraConfig: JiraConfig;
  selectedProject: string | null;
  selectedIssueType: string | null;
  onSelectIssueType: (issueType: string | null) => void;
}

export function IssueTypeFilter({ 
  jiraConfig, 
  selectedProject,
  selectedIssueType,
  onSelectIssueType 
}: IssueTypeFilterProps) {
  const [issueTypes, setIssueTypes] = useState<IssueType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchingRef = useRef(false);

  const fetchIssueTypes = useCallback(async () => {
    if (!selectedProject || fetchingRef.current) return;
    
    fetchingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/jira/issue-types', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...jiraConfig,
          projectKey: selectedProject
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch issue types');
      }

      const data: IssueType[] = await response.json();
      
      // Filter out subtasks and sort with Bug first
      const filteredTypes = data
        .filter((type: IssueType) => !type.subtask)
        .sort((a: IssueType, b: IssueType) => {
          if (a.name === 'Bug') return -1;
          if (b.name === 'Bug') return 1;
          return a.name.localeCompare(b.name);
        });

      setIssueTypes(filteredTypes);
      
      // Only set default if no issue type is selected
      if (!selectedIssueType && filteredTypes.length > 0) {
        const bugType = filteredTypes.find((type: IssueType) => type.name === 'Bug');
        onSelectIssueType(bugType ? bugType.name : filteredTypes[0].name);
      }
    } catch (error) {
      console.error('Error fetching issue types:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch issue types');
      setIssueTypes([]);
    } finally {
      setIsLoading(false);
      fetchingRef.current = false;
    }
  }, [selectedProject, jiraConfig, onSelectIssueType, selectedIssueType]);

  useEffect(() => {
    if (selectedProject) {
      fetchIssueTypes();
    }
  }, [selectedProject, fetchIssueTypes]);

  if (!selectedProject || isLoading) {
    return null;
  }

  if (error) {
    return (
      <div className="text-sm text-red-600">
        Failed to load issue types
      </div>
    );
  }

  if (issueTypes.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium">Issue Type:</label>
      <Select 
        value={selectedIssueType || undefined}
        onValueChange={onSelectIssueType}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue>
            {selectedIssueType || "Select issue type"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {issueTypes.map((type) => (
            <SelectItem 
              key={type.id} 
              value={type.name}
              className="flex items-center gap-2"
            >
              <div className="flex items-center gap-2">
                {type.iconUrl ? (
                  <Image 
                    src={type.iconUrl} 
                    alt={type.name}
                    width={16}
                    height={16}
                    className="mr-2"
                    unoptimized
                  />
                ) : (
                  <span className="w-4 h-4 flex items-center justify-center text-xs text-muted-foreground mr-2">
                    {type.name[0]}
                  </span>
                )}
                {type.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default IssueTypeFilter;