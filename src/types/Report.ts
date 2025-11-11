// types/Report.ts - TYPES POUR LE SYSTÈME DE RAPPORTS ET STATISTIQUES
import { Account, Budget, Category, Transaction } from './index';

// ===== TYPES POUR LES PÉRIODES ET FILTRES =====

export interface ReportPeriod {
  startDate: string;
  endDate: string;
  label: string;
}

export interface ReportFilters {
  dateRange: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
  startDate?: string;
  endDate?: string;
  categories?: string[];
  accounts?: string[];
  transactionTypes?: ('income' | 'expense')[];
  minAmount?: number;
  maxAmount?: number;
}

// ===== TYPES POUR LES RAPPORTS FINANCIERS =====

export interface CashFlowReport {
  period: ReportPeriod;
  openingBalance: number;
  closingBalance: number;
  totalIncome: number;
  totalExpenses: number;
  netCashFlow: number;
  savingsRate: number;
  categories: CategoryReport[];
  topExpenses: Transaction[];
  topIncomes: Transaction[];
  transactionsCount: number;
  averageTransaction: number;
}

export interface CategoryReport {
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  categoryIcon: string;
  totalAmount: number;
  percentage: number;
  transactionCount: number;
  averageAmount: number;
  trend?: 'up' | 'down' | 'stable';
  budget?: {
    allocated: number;
    spent: number;
    remaining: number;
    status: 'under' | 'over' | 'on_track';
  };
}

export interface MonthlySummary {
  month: string;
  label: string;
  income: number;
  expenses: number;
  savings: number;
  savingsRate: number;
  transactionsCount: number;
  averageIncome: number;
  averageExpense: number;
}

export interface AccountSummary {
  account: Account;
  startingBalance: number;
  endingBalance: number;
  totalInflows: number;
  totalOutflows: number;
  netChange: number;
  transactionCount: number;
}

// ===== TYPES POUR L'ANALYSE AVANCÉE =====

export interface SpendingAnalysis {
  categoryId: string;
  categoryName: string;
  currentAmount: number;
  previousAmount: number;
  percentageChange: number;
  trend: 'up' | 'down' | 'stable';
  comparison: number;
  budgetStatus?: 'under' | 'over' | 'on_track';
  alertLevel?: 'normal' | 'warning' | 'critical';
}

export interface IncomeAnalysis {
  source: string;
  amount: number;
  percentage: number;
  consistency: 'regular' | 'irregular' | 'one-time';
  growth: number;
}

export interface FinancialHealth {
  score: number;
  status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  indicators: {
    savingsRate: { value: number; status: string };
    expenseRatio: { value: number; status: string };
    debtRatio: { value: number; status: string };
    emergencyFund: { value: number; status: string };
  };
  recommendations: string[];
}

// ===== TYPES POUR LES GRAPHIQUES =====

export interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
    colors?: string[];
    legend?: string[];
  }[];
}

export interface PieChartData {
  name: string;
  amount: number;
  percentage: number; // ✅ OBLIGATOIRE
  color: string;
}

export interface TimeSeriesData {
  dates: string[];
  income: number[];
  expenses: number[];
  savings: number[];
}

// ===== TYPES POUR LES BUDGETS ET ALERTES =====

export interface BudgetPerformance {
  id: string; // ✅ AJOUTÉ
  name: string; // ✅ AJOUTÉ
  budget: Budget;
  spent: number;
  remaining: number;
  percentageUsed: number;
  dailyAverage: number;
  projectedEnd: number;
  status: 'under' | 'over' | 'on_track';
  daysRemaining: number;
}

export interface BudgetAlert {
  budgetId: string;
  budgetName: string;
  type: 'threshold_reached' | 'exceeded' | 'almost_exceeded';
  currentSpent: number;
  budgetAmount: number;
  percentage: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

// ===== TYPES POUR L'EXPORT =====

export interface ExportOptions {
  includeTransactions: boolean;
  includeAccounts: boolean;
  includeCategories: boolean;
  includeBudgets: boolean;
  includeReports: boolean;
  dateRange?: ReportPeriod;
  format: 'json' | 'csv' | 'pdf' | 'excel';
  compression?: boolean;
  passwordProtect?: boolean;
}

export interface ExportResult {
  success: boolean;
  filePath?: string;
  fileSize?: number;
  data?: {
    transactions?: Transaction[];
    accounts?: Account[];
    categories?: Category[];
    budgets?: Budget[];
    reports?: any[];
  };
  error?: string;
}

// ===== TYPES POUR LES COMPOSANTS =====

export interface ChartFilterProps {
  filters: ReportFilters;
  onFiltersChange: (filters: ReportFilters) => void;
  availableCategories: Category[];
  availableAccounts: Account[];
}

export interface ReportCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: string;
  color?: string;
  onPress?: () => void;
}

export interface CategoryProgressProps {
  category: CategoryReport;
  showAmount?: boolean;
  showPercentage?: boolean;
  height?: number;
}

// ===== TYPES POUR LES COMPARAISONS =====

export interface PeriodComparison {
  currentPeriod: ReportPeriod;
  previousPeriod: ReportPeriod;
  income: {
    current: number;
    previous: number;
    change: number;
    percentage: number;
  };
  expenses: {
    current: number;
    previous: number;
    change: number;
    percentage: number;
  };
  savings: {
    current: number;
    previous: number;
    change: number;
    percentage: number;
  };
  topCategories: {
    category: string;
    current: number;
    previous: number;
    change: number;
  }[];
}

// ===== TYPES POUR LES PRÉFÉRENCES DE RAPPORTS =====

export interface ReportPreferences {
  defaultPeriod: 'month' | 'quarter' | 'year';
  currency: string;
  language: string;
  charts: {
    showAnimations: boolean;
    defaultChartType: 'bar' | 'line' | 'pie';
    colorScheme: 'default' | 'pastel' | 'vibrant';
  };
  notifications: {
    weeklyReport: boolean;
    monthlyReport: boolean;
    budgetAlerts: boolean;
  };
}

// ===== TYPES POUR LES DONNÉES SYNTHÈSE =====

export interface FinancialSnapshot {
  timestamp: string;
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsRate: number;
  debtToIncome: number;
  emergencyFundMonths: number;
}

// ===== CONSTANTES =====

export const REPORT_PERIODS = [
  { value: 'today' as const, label: "Aujourd'hui" },
  { value: 'week' as const, label: '7 derniers jours' },
  { value: 'month' as const, label: 'Mois en cours' },
  { value: 'quarter' as const, label: 'Trimestre' },
  { value: 'year' as const, label: 'Année en cours' },
  { value: 'custom' as const, label: 'Période personnalisée' },
];

export const CHART_TYPES = [
  { value: 'bar' as const, label: 'Barres', icon: 'bar-chart' },
  { value: 'line' as const, label: 'Lignes', icon: 'trending-up' },
  { value: 'pie' as const, label: 'Camembert', icon: 'pie-chart' },
  { value: 'area' as const, label: 'Aire', icon: 'area-chart' },
];

export const EXPORT_FORMATS = [
  { value: 'csv' as const, label: 'CSV', icon: 'document-text' },
  { value: 'pdf' as const, label: 'PDF', icon: 'document' },
  { value: 'json' as const, label: 'JSON', icon: 'code' },
  { value: 'excel' as const, label: 'Excel', icon: 'table' },
];

// ===== TYPES UTILITAIRES =====

export type TrendDirection = 'up' | 'down' | 'stable';
export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';
export type BudgetStatus = 'under' | 'over' | 'on_track';
export type ChartType = 'bar' | 'line' | 'pie' | 'area';

export interface DateRangePreset {
  label: string;
  getRange: () => { startDate: string; endDate: string };
}

// ===== TYPES POUR LES RAPPORTS DÉTAILLÉS =====

export interface TransactionAnalysis {
  period: ReportPeriod;
  totalTransactions: number;
  incomeTransactions: number;
  expenseTransactions: number;
  averageTransactionSize: number;
  largestTransaction: Transaction | null;
  mostFrequentCategory: string | null;
  transactionFrequency: {
    daily: number;
    weekly: number;
    monthly: number;
  };
}

export interface CashFlowForecast {
  period: ReportPeriod;
  projectedIncome: number;
  projectedExpenses: number;
  projectedSavings: number;
  confidence: 'high' | 'medium' | 'low';
  assumptions: string[];
  risks: string[];
}

// ===== TYPES POUR LES RAPPORTS DE PERFORMANCE =====

export interface InvestmentPerformance {
  period: ReportPeriod;
  initialValue: number;
  finalValue: number;
  netGain: number;
  returnRate: number;
  comparisonToBenchmark: number;
  bestPerforming: string;
  worstPerforming: string;
}

export interface DebtRepaymentPlan {
  totalDebt: number;
  monthlyPayment: number;
  interestRate: number;
  repaymentPeriod: number;
  totalInterest: number;
  completionDate: string;
  milestones: {
    date: string;
    amountPaid: number;
    remaining: number;
  }[];
}