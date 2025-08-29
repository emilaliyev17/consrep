import React, { useState } from 'react';
import { Container, Typography, Paper, Box, Tabs, Tab, Button } from '@mui/material';
import FileUploadZone from './components/FileUpload/FileUploadZone';
import FileList from './components/FileUpload/FileList';
import ConsolidatedPL from './components/Reports/ConsolidatedPL';
import ConsolidatedBS from './components/Reports/ConsolidatedBS';
import { consolidateData, ConsolidatedReport } from './components/DataProcessor/ConsolidationEngine';
import useFileStore from './store/useFileStore';
import { downloadTemplate } from './utils/excelUtils';
import './App.css';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function App() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [consolidatedReport, setConsolidatedReport] = useState<ConsolidatedReport | null>(null);
  const { files } = useFileStore();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleConsolidate = () => {
    const report = consolidateData(files);
    console.log('Consolidated Report:', report); // Debugging line
    setConsolidatedReport(report);
    setSelectedTab(1); // Switch to P&L tab after consolidation
  };

  return (
    <Container maxWidth={false} sx={{ py: 4, px: 1 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Financial Consolidator
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
        <Tabs value={selectedTab} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Upload Files" {...a11yProps(0)} />
          <Tab label="P&L Statement" {...a11yProps(1)} /> {/* Removed disabled={!consolidatedReport} */}
          <Tab label="Balance Sheet" {...a11yProps(2)} /> {/* Removed disabled={!consolidatedReport} */}
        </Tabs>
      </Box>

      <TabPanel value={selectedTab} index={0}>
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" gutterBottom>Upload Excel/CSV Files</Typography>
          <FileUploadZone />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button variant="outlined" onClick={() => downloadTemplate('P&L')}>Download P&L Template</Button>
            <Button variant="outlined" onClick={() => downloadTemplate('Balance Sheet')}>Download Balance Sheet Template</Button>
          </Box>
        </Paper>
        
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>Uploaded Files</Typography>
          <FileList />
          {files.length > 0 && (
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button variant="contained" color="primary" size="large" onClick={handleConsolidate}>
                CONSOLIDATE
              </Button>
            </Box>
          )}
        </Paper>
      </TabPanel>

      <TabPanel value={selectedTab} index={1}>
        {consolidatedReport && <ConsolidatedPL data={consolidatedReport.pl} periodNames={consolidatedReport.periodNames} companyNames={consolidatedReport.companyNames} />}
      </TabPanel>

      <TabPanel value={selectedTab} index={2}>
        {consolidatedReport && <ConsolidatedBS data={consolidatedReport.bs} periodNames={consolidatedReport.periodNames} companyNames={consolidatedReport.companyNames} />}
      </TabPanel>
    </Container>
  );
}

export default App;
