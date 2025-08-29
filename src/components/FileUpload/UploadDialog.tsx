import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';

interface UploadDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (companyName: string, reportType: 'P&L' | 'Balance Sheet') => void;
}

const UploadDialog: React.FC<UploadDialogProps> = ({ open, onClose, onConfirm }) => {
  const [companyName, setCompanyName] = useState('');
  const [reportType, setReportType] = useState<'P&L' | 'Balance Sheet'>('P&L');

  const handleConfirm = () => {
    if (companyName.trim()) {
      onConfirm(companyName, reportType);
      setCompanyName('');
      setReportType('P&L');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Upload File Details</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Company Name"
          type="text"
          fullWidth
          variant="standard"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel id="report-type-label">Report Type</InputLabel>
          <Select
            labelId="report-type-label"
            value={reportType}
            label="Report Type"
            onChange={(e) => setReportType(e.target.value as 'P&L' | 'Balance Sheet')}
          >
            <MenuItem value="P&L">P&L</MenuItem>
            <MenuItem value="Balance Sheet">Balance Sheet</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleConfirm}>Upload</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadDialog;
