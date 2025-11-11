// src/types/Export.ts
export interface TransferData {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  description?: string;
  date: string;
}

export interface ExportConfig {
  format: 'csv' | 'excel' | 'pdf';
  dateRange: {
    start: string;
    end: string;
  };
  include: {
    transactions: boolean;
    accounts: boolean;
    budgets: boolean;
    debts: boolean;
    savings: boolean;
  };
}