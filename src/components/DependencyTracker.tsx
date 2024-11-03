import { Button } from "@/components/ui/button"
import { DownloadIcon } from "lucide-react"
import { saveAs } from 'file-saver'
import { generateBugReport } from '../utils/bugReportGenerator'

interface DependencyTrackerProps {
  bugs: any[];
  selectedProject: string | null;
  selectedIssueType: string | null;
  sprintData: any;
}

export function DependencyTracker({ bugs, selectedProject, selectedIssueType, sprintData }: DependencyTrackerProps) {
  const generateAndDownloadReport = () => {
    const report = generateBugReport({
      bugs,
      sprints: sprintData,
      filters: {
        project: selectedProject,
        issueType: selectedIssueType
      },
      systemInfo: {
        browserInfo: navigator.userAgent,
        timestamp: new Date().toISOString(),
        appVersion: process.env.NEXT_PUBLIC_APP_VERSION
      }
    });
    
    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: 'application/json'
    });
    saveAs(blob, `jira-bug-report-${new Date().toISOString()}.json`);
  }

  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-4">
        {/* Your existing filter controls remain here */}
        
        <Button
          onClick={generateAndDownloadReport}
          variant="outline"
          size="sm"
          className="ml-4"
        >
          <DownloadIcon className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>
    </div>
  )
} 