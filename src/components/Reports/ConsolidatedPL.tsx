import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Button,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ButtonGroup,
} from '@mui/material';
import { ConsolidatedRow, PeriodData } from '../DataProcessor/ConsolidationEngine';
import { formatNumber } from '../../utils/formatUtils';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

interface ConsolidatedPLProps {
  data: ConsolidatedRow[];
  periodNames: string[];
  companyNames: string[];
}

const ConsolidatedPL: React.FC<ConsolidatedPLProps> = ({ data, periodNames, companyNames }) => {
  const [fontSize, setFontSize] = useState(14);
  const [expandedPeriods, setExpandedPeriods] = useState<Set<string>>(new Set());
  const [startPeriod, setStartPeriod] = useState<string>('');
  const [endPeriod, setEndPeriod] = useState<string>('');

  const togglePeriod = (period: string) => {
    setExpandedPeriods(prev => {
      const newSet = new Set(prev);
      if (newSet.has(period)) {
        newSet.delete(period);
      } else {
        newSet.add(period);
      }
      return newSet;
    });
  };

  const expandAll = () => {
    setExpandedPeriods(new Set(periodNames));
  };

  const collapseAll = () => {
    setExpandedPeriods(new Set());
  };

  const allPeriods = useMemo(() => {
    // Assuming periodNames are already sorted and unique from ConsolidationEngine
    return periodNames;
  }, [periodNames]);

  const getVisiblePeriods = useMemo(() => {
    if (!startPeriod || !endPeriod) return allPeriods;
    
    const startIndex = allPeriods.indexOf(startPeriod);
    const endIndex = allPeriods.indexOf(endPeriod);
    
    if (startIndex === -1 || endIndex === -1 || startIndex > endIndex) return allPeriods; // Fallback
    
    return allPeriods.slice(startIndex, endIndex + 1);
  }, [startPeriod, endPeriod, allPeriods]);

  const applyPreset = (year: string) => {
    const yearPeriods = allPeriods.filter(p => p.startsWith(year));
    if (yearPeriods.length > 0) {
      setStartPeriod(yearPeriods[0]);
      setEndPeriod(yearPeriods[yearPeriods.length - 1]);
    }
  };

  if (!data || data.length === 0) {
    return <Typography>No P&L data to display.</Typography>;
  }

  return (
    <>
      <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
        <Button onClick={() => setFontSize(prev => Math.max(10, prev - 2))}>
          A- (Smaller)
        </Button>
        <Button onClick={() => setFontSize(prev => Math.min(20, prev + 2))}>
          A+ (Larger)
        </Button>
        <Typography>Font Size: {fontSize}px</Typography>
        <Button onClick={expandAll}>Expand All [+]
        </Button>
        <Button onClick={collapseAll}>Collapse All [-]
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
        <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel>From</InputLabel>
          <Select value={startPeriod} label="From" onChange={(e) => setStartPeriod(e.target.value as string)}>
            {allPeriods.map(period => (
              <MenuItem key={period} value={period}>{period}</MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel>To</InputLabel>
          <Select value={endPeriod} label="To" onChange={(e) => setEndPeriod(e.target.value as string)}>
            {allPeriods.map(period => (
              <MenuItem key={period} value={period}>{period}</MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <Button onClick={() => { setStartPeriod(''); setEndPeriod(''); }}>
          Show All
        </Button>

        <ButtonGroup variant="outlined" aria-label="period presets">
          <Button onClick={() => applyPreset('24')}>2024</Button>
          <Button onClick={() => applyPreset('25')}>2025</Button>
          {/* Add more presets as needed */}
        </ButtonGroup>
      </Box>

      <TableContainer component={Paper} sx={{ maxHeight: 'calc(100vh - 200px)', width: '100%', overflowX: 'auto', border: '1px solid #ddd' }}>
        <Typography variant="h5" sx={{ p: 2 }}>Consolidated Profit & Loss Statement</Typography>
        <Table stickyHeader sx={{ width: '100%' }}>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  position: 'sticky',
                  top: 0,
                  left: 0,
                  backgroundColor: 'white',
                  zIndex: 12,
                  borderBottom: '2px solid #ddd',
                  minWidth: '100px',
                  fontSize: `${fontSize}px`,
                }}
              >
                Account Code
              </TableCell>
              <TableCell
                sx={{
                  position: 'sticky',
                  top: 0,
                  left: '100px',
                  backgroundColor: 'white',
                  zIndex: 12,
                  borderBottom: '2px solid #ddd',
                  minWidth: '200px',
                  fontSize: `${fontSize}px`,
                }}
              >
                Account Name
              </TableCell>
              {getVisiblePeriods.map((period) => (
                <TableCell
                  key={period}
                  colSpan={expandedPeriods.has(period) ? companyNames.length + 1 : 1} // +1 for Total
                  sx={{
                    position: 'sticky',
                    top: 0,
                    backgroundColor: 'white',
                    zIndex: 10,
                    borderBottom: '2px solid #ddd',
                    textAlign: 'center',
                    fontSize: `${fontSize}px`,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconButton size="small" onClick={() => togglePeriod(period)}>
                      {expandedPeriods.has(period) ? <RemoveIcon /> : <AddIcon />}
                    </IconButton>
                    {period}
                  </Box>
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontSize: `${fontSize}px`, borderBottom: '2px solid #ddd' }} /> {/* Spacer for Account Code */}
              <TableCell sx={{ fontSize: `${fontSize}px`, borderBottom: '2px solid #ddd' }} /> {/* Spacer for Account Name */}
              {getVisiblePeriods.map((period) => (
                expandedPeriods.has(period) ? (
                  <React.Fragment key={period}>
                    {companyNames.map(company => (
                      <TableCell key={company} sx={{ fontSize: `${fontSize}px`, borderBottom: '2px solid #ddd' }}>
                        {company}
                      </TableCell>
                    ))}
                    <TableCell sx={{ fontSize: `${fontSize}px`, borderBottom: '2px solid #ddd' }}>
                      TOTAL
                    </TableCell>
                  </React.Fragment>
                ) : (
                  <TableCell key={period} sx={{ fontSize: `${fontSize}px`, borderBottom: '2px solid #ddd' }}>
                    TOTAL
                  </TableCell>
                )
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                <TableCell sx={{ fontSize: `${fontSize}px` }}>{row.accountCode}</TableCell>
                <TableCell sx={{ fontSize: `${fontSize}px` }}>{row.accountName}</TableCell>
                {getVisiblePeriods.map((period) => {
                  const periodData = row[period] as PeriodData;
                  return (
                    expandedPeriods.has(period) ? (
                      <React.Fragment key={period}>
                        {companyNames.map(company => (
                          <TableCell key={company} sx={{ fontSize: `${fontSize}px` }}>
                            {formatNumber(periodData.companies[company] || 0)}
                          </TableCell>
                        ))}
                        <TableCell sx={{ fontSize: `${fontSize}px` }}>
                          {formatNumber(periodData.total)}
                        </TableCell>
                      </React.Fragment>
                    ) : (
                      <TableCell key={period} sx={{ fontSize: `${fontSize}px` }}>
                        {formatNumber(periodData.total)}
                      </TableCell>
                    )
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ConsolidatedPL;
