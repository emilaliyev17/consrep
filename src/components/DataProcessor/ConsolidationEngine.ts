import { FileWithData, ParsedRow } from '../../store/useFileStore';

export interface PeriodData {
  total: number;
  companies: { [companyName: string]: number };
}

export interface ConsolidatedRow {
  accountCode: string;
  accountName: string;
  [period: string]: PeriodData | string; // Period keys will map to PeriodData
}

export interface ConsolidatedReport {
  pl: ConsolidatedRow[];
  bs: ConsolidatedRow[];
  allAccounts: ConsolidatedRow[];
  periodNames: string[];
  companyNames: string[];
}

export const consolidateData = (files: FileWithData[]): ConsolidatedReport => {
  const plAccountsMap = new Map<string, ConsolidatedRow>();
  const bsAccountsMap = new Map<string, ConsolidatedRow>();
  const periodColumns = new Set<string>();
  const companyNames = new Set<string>();

  files.forEach(fileData => {
    companyNames.add(fileData.companyName);
    fileData.data.forEach((row: ParsedRow) => {
      const accountCode = String(row[Object.keys(row)[0]]); // Assuming first column is account code
      const accountName = String(row[Object.keys(row)[1]]); // Assuming second column is account name

      const targetMap = fileData.reportType === 'P&L' ? plAccountsMap : bsAccountsMap;

      if (!targetMap.has(accountCode)) {
        targetMap.set(accountCode, { accountCode, accountName });
      }

      const existingRow = targetMap.get(accountCode)!;

      Object.keys(row).forEach((key, index) => {
        if (index >= 2) { // Assuming periods start from the third column
          periodColumns.add(key);
          const value = parseFloat(row[key]) || 0;

          if (!existingRow[key]) {
            existingRow[key] = { total: 0, companies: {} };
          }
          const periodData = existingRow[key] as PeriodData;
          periodData.total += value;
          periodData.companies[fileData.companyName] = (periodData.companies[fileData.companyName] || 0) + value;
        }
      });
    });
  });

  const sortedPeriodColumns = Array.from(periodColumns).sort();
  const sortedCompanyNames = Array.from(companyNames).sort();

  const processMap = (map: Map<string, ConsolidatedRow>): ConsolidatedRow[] => {
    return Array.from(map.values()).map(row => {
      const newRow: ConsolidatedRow = { accountCode: row.accountCode, accountName: row.accountName };
      sortedPeriodColumns.forEach(period => {
        newRow[period] = (row[period] || { total: 0, companies: {} }) as PeriodData;
      });
      return newRow;
    });
  };

  const pl = processMap(plAccountsMap);
  const bs = processMap(bsAccountsMap);
  const allAccounts = [...pl, ...bs];

  return { pl, bs, allAccounts, periodNames: sortedPeriodColumns, companyNames: sortedCompanyNames };
};