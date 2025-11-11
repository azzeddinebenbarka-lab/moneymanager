// src/hooks/useAnalytics.ts - VERSION COMPLÈTEMENT CORRIGÉE
import { useCallback, useEffect, useRef, useState } from 'react';
import { calculationService } from '../services/calculationService';

export interface NetWorthData {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  history: { date: string; netWorth: number }[];
}

export interface CashFlowData {
  income: number;
  expenses: number;
  netFlow: number;
  savingsRate: number;
}

export interface AssetAllocation {
  cash: number;
  savings: number;
  investments: number;
  other: number;
}

export interface AnalyticsData {
  netWorth: NetWorthData;
  cashFlow: CashFlowData;
  financialHealth: number;
  assetAllocation: AssetAllocation;
}

// ✅ CORRECTION : Fonctions utilitaires définies hors du hook
const calculateFinancialHealth = (
  netWorth: NetWorthData,
  cashFlow: CashFlowData,
  realBalance: { availableBalance: number; monthlyCharges: number }
): number => {
  let score = 100;

  if (netWorth.netWorth < 0) score -= 30;
  if (cashFlow.savingsRate < 10) score -= 15;
  if (cashFlow.savingsRate < 5) score -= 10;
  if (cashFlow.savingsRate >= 20) score += 10;

  const monthsOfExpenses = cashFlow.expenses > 0 ? realBalance.availableBalance / cashFlow.expenses : 0;
  if (monthsOfExpenses < 1) score -= 20;
  if (monthsOfExpenses >= 3) score += 10;
  if (monthsOfExpenses >= 6) score += 10;

  const debtRatio = netWorth.totalAssets > 0 ? netWorth.totalLiabilities / netWorth.totalAssets : 0;
  if (debtRatio > 0.5) score -= 20;
  if (debtRatio > 0.8) score -= 15;

  return Math.max(0, Math.min(100, Math.round(score)));
};

const calculateAssetAllocation = (
  netWorth: NetWorthData,
  realBalance: { accountsBalance: number; totalSavings: number }
): AssetAllocation => {
  const cash = realBalance.accountsBalance;
  const savings = realBalance.totalSavings;
  const investments = 0;
  const other = Math.max(0, netWorth.totalAssets - cash - savings - investments);

  return { cash, savings, investments, other };
};

// ✅ CORRECTION : Hook principal avec export par défaut
export const useAnalytics = (userId: string = 'default-user') => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    netWorth: {
      totalAssets: 0,
      totalLiabilities: 0,
      netWorth: 0,
      history: []
    },
    cashFlow: {
      income: 0,
      expenses: 0,
      netFlow: 0,
      savingsRate: 0
    },
    financialHealth: 0,
    assetAllocation: {
      cash: 0,
      savings: 0,
      investments: 0,
      other: 0
    }
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  const loadAnalytics = useCallback(async () => {
    if (!isMounted.current) return;
    
    try {
      setLoading(true);
      setError(null);
      console.log('📊 [useAnalytics] Chargement analyses...');

      const [
        netWorthData,
        cashFlowData,
        realBalanceData
      ] = await Promise.all([
        calculationService.calculateNetWorth(userId),
        calculationService.calculateCashFlow(userId),
        calculationService.calculateRealBalance(userId)
      ]);

      const safeNetWorthData: NetWorthData = {
        ...netWorthData,
        history: netWorthData.history || []
      };

      const financialHealth = calculateFinancialHealth(safeNetWorthData, cashFlowData, realBalanceData);
      const assetAllocation = calculateAssetAllocation(safeNetWorthData, realBalanceData);

      const analyticsData: AnalyticsData = {
        netWorth: safeNetWorthData,
        cashFlow: cashFlowData,
        financialHealth,
        assetAllocation
      };

      if (isMounted.current) {
        setAnalytics(analyticsData);
      }

      console.log('✅ [useAnalytics] Analyses chargées:', {
        patrimoine: safeNetWorthData.netWorth,
        cashFlow: cashFlowData.netFlow,
        sante: financialHealth
      });

    } catch (err) {
      if (isMounted.current) {
        const errorMessage = err instanceof Error ? err.message : 'Erreur chargement analyses';
        console.error('❌ [useAnalytics] Erreur:', errorMessage);
        setError(errorMessage);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [userId]);

  const refreshAnalytics = useCallback(async () => {
    await loadAnalytics();
  }, [loadAnalytics]);

  useEffect(() => {
    isMounted.current = true;
    loadAnalytics();

    return () => {
      isMounted.current = false;
    };
  }, [loadAnalytics]);

  return {
    analytics,
    loading,
    error,
    refreshAnalytics,
    netWorth: analytics.netWorth,
    cashFlow: analytics.cashFlow,
    financialHealth: analytics.financialHealth,
    assetAllocation: analytics.assetAllocation
  };
};

// ✅ CORRECTION : Export par défaut pour compatibilité
export default useAnalytics;