export interface Budget {
  id: string;
  name: string;
  category: string; // ← CHANGER categoryId en category
  amount: number;
  spent: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: string;
  endDate?: string;
  isActive: boolean;
  createdAt: string;
}

export interface BudgetStats {
  totalBudgets: number;
  activeBudgets: number;
  totalSpent: number;
  totalBudget: number;
  averageUsage: number;
}

export interface BudgetAlert {
  id: string;
  budgetId: string;
  type: 'threshold' | 'exceeded' | 'warning';
  message: string;
  isRead: boolean;
  createdAt: string;
}

export const BUDGET_PERIODS = [
  { value: 'daily' as const, label: 'Quotidien' },
  { value: 'weekly' as const, label: 'Hebdomadaire' },
  { value: 'monthly' as const, label: 'Mensuel' },
  { value: 'yearly' as const, label: 'Annuel' },
];

export interface BudgetPerformance {
  id: string;
  name: string;
  budget: Budget;
  spent: number;
  remaining: number;
  percentageUsed: number;
  dailyAverage: number;
  projectedEnd: number;
  status: 'under' | 'over' | 'on_track';
  daysRemaining: number;
}