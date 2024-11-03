'use client'

import { useCallback } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ProjectFilterProps {
  projects: string[];
  selectedProject: string | null;
  onSelectProject: (projectKey: string | null) => void;
}

export function ProjectFilterComponent({ 
  projects, 
  selectedProject,
  onSelectProject 
}: ProjectFilterProps) {
  const handleProjectChange = useCallback((value: string) => {
    onSelectProject(value === 'all' ? null : value);
  }, [onSelectProject]);

  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium">Filter by Project:</label>
      <Select 
        value={selectedProject || 'all'}
        onValueChange={handleProjectChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a project" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Projects</SelectItem>
          {projects.map((projectKey) => (
            <SelectItem key={projectKey} value={projectKey}>
              {projectKey}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}