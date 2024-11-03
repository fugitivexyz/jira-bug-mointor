'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { LinkedIssue } from '../types/jira'

interface LinkedIssuesTableProps {
  linkedIssues: LinkedIssue[];
}

export function LinkedIssuesTable({ linkedIssues }: LinkedIssuesTableProps) {
  if (!linkedIssues?.length) {
    return (
      <div className="text-sm text-gray-500 py-4">
        No linked issues found
      </div>
    );
  }

  return (
    <div className="rounded-md border mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-24">Relation</TableHead>
            <TableHead>Issue</TableHead>
            <TableHead className="w-32">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {linkedIssues.map((issue) => (
            <TableRow key={issue.key}>
              <TableCell className="text-xs text-gray-500">
                {issue.linkType}
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium text-sm">{issue.summary}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-2">
                    <span>{issue.key}</span>
                    {issue.assignee && (
                      <>
                        <span>•</span>
                        <span>{issue.assignee.name}</span>
                      </>
                    )}
                    {issue.sprintName && (
                      <>
                        <span>•</span>
                        <span>{issue.sprintName}</span>
                      </>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(issue.status)}`}>
                  {issue.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    'Open': 'bg-blue-100 text-blue-800',
    'In Progress': 'bg-yellow-100 text-yellow-800',
    'Done': 'bg-green-100 text-green-800',
    'Resolved': 'bg-green-100 text-green-800',
    'Closed': 'bg-gray-100 text-gray-800',
  };
  return statusColors[status] || 'bg-gray-100 text-gray-800';
}

export default LinkedIssuesTable; 