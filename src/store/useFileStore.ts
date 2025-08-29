import { create } from 'zustand';
import * as XLSX from 'xlsx';

export type ParsedRow = Record<string, any>;

export interface FileWithData {
  id: string;
  fileName: string;
  data: ParsedRow[];
  companyName: string;
  uploadTime: Date;
  reportType: 'P&L' | 'Balance Sheet';
}

interface FileStore {
  files: FileWithData[];
  addFile: (file: File, companyName: string, reportType: 'P&L' | 'Balance Sheet') => void;
  removeFile: (id: string) => void;
  updateData: (id: string, rowIndex: number, key: string, value: any) => void;
}

const useFileStore = create<FileStore>((set) => ({
  files: [],
  addFile: (file: File, companyName: string, reportType: 'P&L' | 'Balance Sheet') => {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target?.result) {
        let workbook;
        if (file.name.endsWith('.csv')) {
          const stringData = e.target.result as string;
          workbook = XLSX.read(stringData, { type: 'string' });
        } else {
          const arrayBuffer = e.target.result as ArrayBuffer;
          const data = new Uint8Array(arrayBuffer);
          workbook = XLSX.read(data, { type: 'array' });
        }

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json: ParsedRow[] = XLSX.utils.sheet_to_json(worksheet);
        
        const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        set((state) => ({ 
          files: [...state.files, { 
            id: uniqueId,
            fileName: file.name,
            data: json, 
            companyName,
            uploadTime: new Date(),
            reportType,
          }] 
        }));
      }
    };

    if (file.name.endsWith('.csv')) {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  },
  removeFile: (id: string) => {
    set((state) => ({ files: state.files.filter((f) => f.id !== id) }));
  },
  updateData: (id: string, rowIndex: number, key: string, value: any) => {
    console.log('UPDATE CALLED:', { id, rowIndex, key, value });
    set((state) => ({
      files: state.files.map((f) => {
        if (f.id === id) {
          console.log('Found file by ID:', id);
          const newData = [...f.data];
          newData[rowIndex] = { ...newData[rowIndex], [key]: value };
          return { ...f, data: newData };
        }
        return f;
      }),
    }));
  },
}));

export default useFileStore;