'use client'

import { Bug } from '../types/jira'
import { LinkedIssuesTable } from './LinkedIssuesTable'
import { X } from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from 'next/image'

interface BugDetailsPanelProps {
  bug: Bug;
  onClose: () => void;
}

export function BugDetailsPanelComponent({ bug, onClose }: BugDetailsPanelProps) {
  return (
    <ScrollArea className="h-[calc(100vh-8rem)]">
      <div className="p-6">
        {/* Header with close button */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-semibold">{bug.summary}</h2>
            <p className="text-sm text-gray-500">{bug.key}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Description Section */}
        {bug.description && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
            <div className="text-sm prose max-w-none bg-gray-50 rounded-md p-4">
              {bug.description}
            </div>
          </div>
        )}

        {/* Reporter Section */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Reporter</h3>
          <div className="flex items-center gap-2">
            {bug.reporter.avatarUrl && (
              <Image 
                src={bug.reporter.avatarUrl} 
                alt={bug.reporter.name}
                width={24}
                height={24}
                className="rounded-full"
              />
            )}
            <span className="text-sm">{bug.reporter.name}</span>
          </div>
        </div>

        {/* Linked Issues Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Linked Issues</h3>
          <LinkedIssuesTable linkedIssues={bug.linkedIssues || []} />
        </div>
      </div>
    </ScrollArea>
  );
}

export default BugDetailsPanelComponent;