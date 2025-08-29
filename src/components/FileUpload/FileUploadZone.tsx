import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography } from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import useFileStore from '../../store/useFileStore';
import UploadDialog from './UploadDialog';

const FileUploadZone = () => {
  const addFile = useFileStore((state) => state.addFile);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        setFileToUpload(acceptedFiles[0]);
        setDialogOpen(true);
      }
    },
    []
  );

  const handleDialogConfirm = (companyName: string, reportType: 'P&L' | 'Balance Sheet') => {
    if (fileToUpload) {
      addFile(fileToUpload, companyName, reportType);
      setFileToUpload(null);
    }
    setDialogOpen(false);
  };

  const handleDialogClose = () => {
    setFileToUpload(null);
    setDialogOpen(false);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/csv': ['.csv'],
    },
  });

  return (
    <>
      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed #ccc',
          padding: '20px',
          textAlign: 'center',
          cursor: 'pointer',
        }}
      >
        <input {...getInputProps()} />
        <CloudUpload sx={{ fontSize: 48, color: '#ccc' }} />
        <Typography>Drag 'n' drop some .xlsx, .xls or .csv files here, or click to select files</Typography>
      </Box>
      <UploadDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onConfirm={handleDialogConfirm}
      />
    </>
  );
};

export default FileUploadZone;
