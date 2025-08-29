import { PLData, BalanceSheetData } from './FinancialData';

export interface Company {
  id: string;
  name: string; // User-defined when uploading
  plData?: PLData;
  bsData?: BalanceSheetData;
}
