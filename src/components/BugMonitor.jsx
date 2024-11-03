import { saveAs } from 'file-saver';
import { generateBugReport } from '../utils/bugReportGenerator';
import BugReportIcon from '@mui/icons-material/BugReport';

function BugMonitor() {
  // existing code...
  
  return (
    <div className="bug-monitor">
      <div className="header-actions">
        <div className="filter-section">
          {/* existing filter controls */}
        </div>
        <Button 
          onClick={generateAndDownloadReport}
          variant="contained"
          color="primary"
          startIcon={<BugReportIcon />}
          size="small"
        >
          Export Bug Report
        </Button>
      </div>
      {/* rest of the component... */}
    </div>
  );

  function generateAndDownloadReport() {
    const report = generateBugReport({
      bugs: bugsList,
      sprints: sprintData,
      filters: {
        project: selectedProject,
        sprint: selectedSprint
      },
      systemInfo: {
        browserInfo: navigator.userAgent,
        timestamp: new Date().toISOString(),
        appVersion: process.env.REACT_APP_VERSION
      }
    });
    
    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: 'application/json'
    });
    saveAs(blob, `jira-bug-report-${new Date().toISOString()}.json`);
  }
} 