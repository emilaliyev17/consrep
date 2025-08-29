import React, { useState } from 'react';
import useFileStore from '../../store/useFileStore';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Input,
  Box,
} from '@mui/material';

const FileList = () => {
  const { files, removeFile, updateData } = useFileStore();
  const [editingCells, setEditingCells] = useState<Record<string, boolean>>({});
  const [modifiedCells, setModifiedCells] = useState<Record<string, boolean>>({});

  const handleCellClick = (fileId: string, rowIndex: number, key: string) => {
    const cellKey = `${fileId}-${rowIndex}-${key}`;
    setEditingCells(prev => ({ ...prev, [cellKey]: true }));
  };

  const handleValueChange = (fileId: string, rowIndex: number, key: string, value: any) => {
    updateData(fileId, rowIndex, key, value);
    const cellKey = `${fileId}-${rowIndex}-${key}`;
    setModifiedCells(prev => ({ ...prev, [cellKey]: true }));
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
    fileId: string,
    rowIndex: number,
    key: string
  ) => {
    if (e.key === 'Enter') {
      const newValue = parseFloat((e.currentTarget as HTMLInputElement).value) || 0;
      handleValueChange(fileId, rowIndex, key, newValue);
      const cellKey = `${fileId}-${rowIndex}-${key}`;
      setEditingCells(prev => ({ ...prev, [cellKey]: false }));
    }
    if (e.key === 'Escape') {
      const cellKey = `${fileId}-${rowIndex}-${key}`;
      setEditingCells(prev => ({ ...prev, [cellKey]: false }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
    fileId: string,
    rowIndex: number,
    key: string
  ) => {
    const newValue = parseFloat(e.currentTarget.value) || 0;
    handleValueChange(fileId, rowIndex, key, newValue);
    const cellKey = `${fileId}-${rowIndex}-${key}`;
    setEditingCells(prev => ({ ...prev, [cellKey]: false }));
  };

  return (
    <div>
      {files.map((fileData) => (
        <div key={fileData.id} style={{ marginBottom: '20px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              {fileData.companyName} - {fileData.reportType}
              <Typography variant="caption" sx={{ ml: 2, color: 'gray' }}>
                (from {fileData.fileName} - {fileData.uploadTime.toLocaleTimeString()})
              </Typography>
            </Typography>
            <Button variant="outlined" color="error" onClick={() => removeFile(fileData.id)}>
              Remove
            </Button>
          </Box>
          <TableContainer component={Paper} sx={{ maxHeight: 600, overflow: 'auto', border: '1px solid #ddd' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {fileData.data.length > 0 &&
                    Object.keys(fileData.data[0]).map((key, index) => (
                      <TableCell
                        key={key}
                        sx={{
                          position: 'sticky',
                          top: 0,
                          backgroundColor: 'white',
                          zIndex: index < 2 ? 11 : 10,
                          borderBottom: '2px solid #ddd',
                          left: index === 0 ? 0 : index === 1 ? '100px' : 'auto',
                          minWidth: index === 0 ? '100px' : index === 1 ? '200px' : 'auto',
                        }}
                      >
                        {key}
                      </TableCell>
                    ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {fileData.data.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {Object.keys(row).map((key, cellIndex) => {
                      const cellKey = `${fileData.id}-${rowIndex}-${key}`;
                      const isEditing = editingCells[cellKey];
                      const isModified = modifiedCells[cellKey];
                      const isNumeric = cellIndex >= 2 && typeof row[key] === 'number';
                      
                      return (
                        <TableCell
                          key={key}
                          onClick={() => {
                            if (isNumeric) {
                              handleCellClick(fileData.id, rowIndex, key);
                            }
                          }}
                          sx={{
                            cursor: isNumeric ? 'pointer' : 'default',
                            '&:hover': isNumeric ? { backgroundColor: '#f5f5f5' } : {},
                            ...(isEditing && { 
                              border: '2px solid #2196f3',
                              backgroundColor: '#e3f2fd'
                            }),
                            ...(isModified && { 
                              color: 'blue',
                              fontWeight: 'bold'
                            }),
                            position: cellIndex < 2 ? 'sticky' : 'relative',
                            left: cellIndex === 0 ? 0 : cellIndex === 1 ? '100px' : 'auto',
                            backgroundColor: isEditing ? '#e3f2fd' : (cellIndex < 2 ? 'white' : 'inherit'),
                            zIndex: cellIndex < 2 ? 5 : 0,
                            minWidth: cellIndex === 0 ? '100px' : cellIndex === 1 ? '200px' : 'auto',
                          }}
                        >
                          {isEditing && isNumeric ? (
                            <Input
                              defaultValue={row[key]}
                              onKeyDown={(e) => handleKeyDown(e, fileData.id, rowIndex, key)}
                              onBlur={(e) => handleBlur(e, fileData.id, rowIndex, key)}
                              autoFocus
                              sx={{ width: '100%' }}
                            />
                          ) : (
                            <span>{row[key]}</span>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      ))}
    </div>
  );
};

export default FileList;