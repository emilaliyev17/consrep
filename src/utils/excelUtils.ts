import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const downloadTemplate = (type: 'P&L' | 'Balance Sheet') => {
  let data: any[] = [];
  let fileName = '';

  if (type === 'P&L') {
    fileName = 'P_L_Template.csv';
    data = [
      ['GL Account Code', 'Raw Name', '24-Jan', '24-Feb', '24-Mar', '24-Apr', '24-May', '24-Jun'],
      ['4113000', '4113000InterestIncome', 26660.86, 28046.34, 29226.6, 25004.2, 24669.74, 25682.91],
      ['5216100', '5216100Interestcharge-OPEX', 8475.98, 8026.43, 6712.51, 10811.29, 11029.22, 9347.15],
      ['6011100', '6011100Socialmedia', 2046.86, 1768.1, 1800.00, 1900.00, 2000.00, 2100.00],
      // Add more example P&L data as needed
    ];
  } else if (type === 'Balance Sheet') {
    fileName = 'Balance_Sheet_Template.csv';
    data = [
      ['GL Account Code', 'Raw Name', '24-Jan', '24-Feb', '24-Mar', '24-Apr', '24-May', '24-Jun'],
      ['1000000', 'Cash', 100000, 105000, 110000, 115000, 120000, 125000],
      ['1200000', 'Accounts Receivable', 50000, 52000, 54000, 56000, 58000, 60000],
      ['2000000', 'Accounts Payable', 20000, 21000, 22000, 23000, 24000, 25000],
      ['3000000', 'Retained Earnings', 80000, 84000, 88000, 92000, 96000, 100000],
      // Add more example Balance Sheet data as needed
    ];
  }

  const ws = XLSX.utils.aoa_to_sheet(data);
  const csv = XLSX.utils.sheet_to_csv(ws);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, fileName);
};