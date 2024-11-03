import React from 'react';
import { saveAs } from 'file-saver';
import { generateBugReport } from '../utils/bugReportGenerator';
import BugReportIcon from '@mui/icons-material/BugReport';
import { Button } from '@mui/material';

function DependencyTracker() {
  return (
    <div className="dependency-tracker">
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '1rem'
      }}>
        <div className="filter-section" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>Filter by Project:</span>
          {/* Existing filter dropdown */}
          
          <Button 
            onClick={generateAndDownloadReport}
            variant="contained"
            color="primary"
            startIcon={<BugReportIcon />}
            size="small"
            sx={{ 
              marginLeft: '16px',
              height: '32px',
              backgroundColor: '#1976d2',
              '&:hover': {
                backgroundColor: '#1565c0'
              }
            }}
          >
            Export
          </Button>
        </div>

        <div className="issue-type-filter">
          {/* Your existing issue type filter */}
        </div>
      </div>

      {/* Rest of your component content */}
    </div>
  );

  function generateAndDownloadReport() {
    const report = generateBugReport({
      bugs: bugsList,
      sprints: sprintData,
      filters: {
        project: selectedProject,
        issueType: selectedIssueType
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

export default DependencyTracker; 