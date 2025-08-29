export interface PLData {
  periods: Date[]; // Extracted from Excel columns
  accounts: {
    [accountCode: string]: {
      description: string;
      values: number[]; // One value per period
    }
  }
}

export interface BalanceSheetData {
  periods: Date[];
  accounts: {
    [accountCode: string]: {
      description: string;
      values: number[];
      category: 'ASSET' | 'LIABILITY' | 'EQUITY';
    }
  }
}
