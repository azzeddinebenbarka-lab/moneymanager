// src/hooks/useDashboard.ts - VERSION CORRIGÉE
import { useState, useCallback, useEffect } from 'react';
import { useAccounts } from './useAccounts';
import { useTransactions } from './useTransactions';
import { useRecurringTransactions } from './useRecurringTransactions';
import { useBudgets } from './useBudgets';
import { useDebts } from './useDebts';
import { useSavings } from './useSavings';
import { useAnalytics } from './useAnalytics';
import { calculationService } from '../services/calculationService';

export interface DashboardData {
  // Comptes
  totalBalance: number;
  accountsCount: number;
  accountsLoading: boolean;
  
  // Transactions
  recentTransactions: any[];
  transactionsLoading: boolean;
  
  // Transactions récurrentes
  recurringTransactionsCount: number;
  recurringTransactionsLoading: boolean;
  
  // Budgets
  activeBudgets: any[];
  budgetsLoading: boolean;
  
  // Dettes
  activeDebts: any[];
  debtsLoading: boolean;
  
  // Épargnes
  activeSavingsGoals: any[];
  savingsLoading: boolean;
  
  // Analytics
  cashFlow: {
    income: number;
    expenses: number;
    netFlow: number;
  };
  financialHealth: number;
  isLoading: boolean;
  error: string | null;
}

export const useDashboard = (): DashboardData => {
  // Hooks existants
  const { 
    accounts, 
    totalBalance, 
    loading: accountsLoading 
  } = useAccounts();
  
  const { 
    transactions, 
    loading: transactionsLoading 
  } = useTransactions();
  
  const { 
    recurringTransactions, 
    loading: recurringTransactionsLoading 
  } = useRecurringTransactions();
  
  const { 
    budgets, 
    loading: budgetsLoading 
  } = useBudgets();
  
  const { 
    debts, 
    loading: debtsLoading 
  } = useDebts();
  
  const { 
    goals, 
    loading: savingsLoading 
  } = useSavings();
  
  const { 
    analytics, 
    loading: analyticsLoading 
  } = useAnalytics();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkLoading = () => {
      const allLoaded = !accountsLoading && 
                       !transactionsLoading && 
                       !recurringTransactionsLoading && 
                       !budgetsLoading && 
                       !debtsLoading && 
                       !savingsLoading && 
                       !analyticsLoading;
      
      setIsLoading(!allLoaded);
    };

    checkLoading();
  }, [
    accountsLoading, 
    transactionsLoading, 
    recurringTransactionsLoading, 
    budgetsLoading, 
    debtsLoading, 
    savingsLoading, 
    analyticsLoading
  ]);

  // Données calculées
  const recentTransactions = transactions.slice(0, 5);
  const activeBudgets = budgets.filter(budget => budget.isActive);
  const activeDebts = debts.filter(debt => debt.status === 'active' || debt.status === 'overdue');
  const activeSavingsGoals = goals.filter(goal => !goal.isCompleted);

  return {
    // Comptes
    totalBalance,
    accountsCount: accounts.length,
    accountsLoading,
    
    // Transactions
    recentTransactions,
    transactionsLoading,
    
    // Transactions récurrentes
    recurringTransactionsCount: recurringTransactions.length,
    recurringTransactionsLoading,
    
    // Budgets
    activeBudgets,
    budgetsLoading,
    
    // Dettes
    activeDebts,
    debtsLoading,
    
    // Épargnes
    activeSavingsGoals,
    savingsLoading,
    
    // Analytics
    cashFlow: analytics.cashFlow,
    financialHealth: analytics.financialHealth,
    isLoading,
    error
  };
};

export default useDashboard;