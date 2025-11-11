export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  icon: string;
  color: string;
  createdAt: string;
}

export interface CategoryStats {
  totalSpent: number;
  totalBudget: number;
  transactionCount: number;
  averageAmount: number;
}