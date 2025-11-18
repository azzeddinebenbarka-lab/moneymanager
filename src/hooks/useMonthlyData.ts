// src/hooks/useMonthlyData.ts - VERSION COMPLÈTEMENT CORRIGÉE
import { useCallback, useEffect, useState } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { monthlyService, YearlySummary } from '../services/monthlyService';
import { useTransactions } from './useTransactions';

export interface MonthlyData {
  year: number;
  month: number;
  income: number;
  expenses: number;
  netFlow: number;
  savingsRate: number;
  transactions: any[];
  transactionCount: number;
  categoryBreakdown: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
}

export interface UseMonthlyDataReturn {
  // Données
  monthlyData: MonthlyData[];
  yearlySummary: YearlySummary | null;
  availableYears: number[];
  
  // États
  loading: boolean;
  error: string | null;
  
  // Actions
  loadMonthlyData: (year: number) => Promise<void>;
  loadYearlySummary: (year: number) => Promise<void>;
  refreshData: () => Promise<void>;
  
  // Utilitaires
  getMonthlyData: (year: number, month: number) => MonthlyData;
  getMonthlyOverview: (year: number) => MonthlyData[];
  getAvailableYears: () => number[];
  getCurrentMonthData: () => MonthlyData;
  getYearlySummary: (year: number) => Promise<YearlySummary>;
}

export const useMonthlyData = (): UseMonthlyDataReturn => {
  const { transactions, refreshTransactions } = useTransactions();
  const { formatAmount } = useCurrency();
  
  // ✅ CORRECTION : États améliorés
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [yearlySummary, setYearlySummary] = useState<YearlySummary | null>(null);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());

  // ✅ CORRECTION : Chargement initial
  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 [useMonthlyData] Initialisation des données...');
      
      // Charger les années disponibles
      const years = await monthlyService.getAvailableYearsWithData();
      setAvailableYears(years);
      
      // Charger les données de l'année courante
      const currentYear = new Date().getFullYear();
      await loadMonthlyData(currentYear);
      await loadYearlySummary(currentYear);
      
      console.log('✅ [useMonthlyData] Données initialisées avec succès');
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur initialisation données';
      console.error('❌ [useMonthlyData] Erreur initialisation:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ✅ CORRECTION : Chargement des données mensuelles
  const loadMonthlyData = useCallback(async (year: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      setCurrentYear(year);
      
      console.log(`📊 [useMonthlyData] Chargement données ${year}...`);
      
      const monthlyStats: MonthlyData[] = [];
      
      // ✅ CORRECTION : Chargement parallèle des 12 mois
      const monthPromises = Array.from({ length: 12 }, (_, month) => 
        monthlyService.getMonthlyStats(year, month)
      );

      const results = await Promise.allSettled(monthPromises);
      
      results.forEach((result, month) => {
        if (result.status === 'fulfilled') {
          const stats = result.value;
          if (stats.transactionCount > 0) {
            monthlyStats.push({
              ...stats,
              transactions: [], // Rempli plus tard si nécessaire
              categoryBreakdown: stats.topCategories
            });
          }
        } else {
          console.warn(`⚠️ [useMonthlyData] Erreur mois ${month}:`, result.reason);
        }
      });

      // ✅ CORRECTION : Tri par mois (plus récent en premier)
      const sortedData = monthlyStats.sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year;
        return b.month - a.month;
      });

      setMonthlyData(sortedData);
      console.log(`✅ [useMonthlyData] ${sortedData.length} mois chargés pour ${year}`);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Erreur chargement données ${year}`;
      console.error('❌ [useMonthlyData] Erreur:', errorMessage);
      setError(errorMessage);
      setMonthlyData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ CORRECTION : Chargement du résumé annuel
  const loadYearlySummary = useCallback(async (year: number): Promise<void> => {
    try {
      console.log(`📅 [useMonthlyData] Chargement résumé ${year}...`);
      
      const summary = await monthlyService.getYearlySummary(year);
      setYearlySummary(summary);
      
      console.log(`✅ [useMonthlyData] Résumé ${year} chargé`);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Erreur résumé ${year}`;
      console.error('❌ [useMonthlyData] Erreur résumé:', errorMessage);
      setYearlySummary(null);
    }
  }, []);

  // ✅ CORRECTION : Rafraîchissement complet
  const refreshData = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 [useMonthlyData] Rafraîchissement données...');
      
      // Rafraîchir les transactions d'abord
      await refreshTransactions();
      
      // Recharger les données
      await initializeData();
      
      console.log('✅ [useMonthlyData] Données rafraîchies');
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur rafraîchissement';
      console.error('❌ [useMonthlyData] Erreur rafraîchissement:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [refreshTransactions]);

  // ✅ CORRECTION : Fonction utilitaire pour données mensuelles
  const getMonthlyData = useCallback((year: number, month: number): MonthlyData => {
    // Chercher dans les données déjà chargées
    const existingData = monthlyData.find(
      data => data.year === year && data.month === month
    );

    if (existingData) {
      return existingData;
    }

    // ✅ CORRECTION : Calcul en temps réel si pas trouvé
    const monthTransactions = transactions.filter(transaction => {
      try {
        const date = new Date(transaction.date);
        return date.getFullYear() === year && date.getMonth() === month;
      } catch (error) {
        return false;
      }
    });

    const income = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const expenses = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const netFlow = income - expenses;
    const savingsRate = income > 0 ? (netFlow / income) * 100 : 0;

    // Analyse par catégorie
    const categoryMap = new Map();
    monthTransactions
      .filter(t => t.type === 'expense')
      .forEach(transaction => {
        const category = transaction.category || 'Non catégorisé';
        const current = categoryMap.get(category) || 0;
        categoryMap.set(category, current + Math.abs(transaction.amount));
      });

    const categoryBreakdown = Array.from(categoryMap.entries())
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: expenses > 0 ? (amount / expenses) * 100 : 0
      }))
      .sort((a, b) => b.amount - a.amount);

    return {
      year,
      month,
      income,
      expenses,
      netFlow,
      savingsRate,
      transactions: monthTransactions,
      transactionCount: monthTransactions.length,
      categoryBreakdown
    };
  }, [monthlyData, transactions]);

  // ✅ CORRECTION : Overview mensuel
  const getMonthlyOverview = useCallback((year: number): MonthlyData[] => {
    // Si c'est l'année courante, utiliser les données chargées
    if (year === currentYear && monthlyData.length > 0) {
      return monthlyData;
    }

    // ✅ CORRECTION : Calcul en temps réel pour les autres années
    const months = Array.from({ length: 12 }, (_, i) => i);
    const monthlyOverview = months
      .map(month => getMonthlyData(year, month))
      .filter(data => data.transactionCount > 0)
      .sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year;
        return b.month - a.month;
      });

    return monthlyOverview;
  }, [currentYear, monthlyData, getMonthlyData]);

  // ✅ CORRECTION : Années disponibles
  const getAvailableYears = useCallback((): number[] => {
    if (availableYears.length > 0) {
      return availableYears;
    }

    // ✅ CORRECTION : Calcul en temps réel depuis les transactions
    const years = new Set<number>();
    
    transactions.forEach(transaction => {
      try {
        const year = new Date(transaction.date).getFullYear();
        years.add(year);
      } catch (error) {
        console.warn('❌ [useMonthlyData] Date invalide pour année:', transaction.date);
      }
    });
    
    const currentYear = new Date().getFullYear();
    years.add(currentYear);
    years.add(currentYear + 1);
    
    return Array.from(years).sort((a, b) => b - a);
  }, [availableYears, transactions]);

  // ✅ CORRECTION : Données du mois courant
  const getCurrentMonthData = useCallback((): MonthlyData => {
    const now = new Date();
    return getMonthlyData(now.getFullYear(), now.getMonth());
  }, [getMonthlyData]);

  // ✅ CORRECTION : Résumé annuel
  const getYearlySummary = useCallback(async (year: number): Promise<YearlySummary> => {
    // Si déjà chargé, retourner directement
    if (yearlySummary && yearlySummary.year === year) {
      return yearlySummary;
    }

    // Sinon charger depuis le service
    return await monthlyService.getYearlySummary(year);
  }, [yearlySummary]);

  // ✅ CORRECTION : Effet pour recharger quand les transactions changent
  useEffect(() => {
    if (transactions.length > 0 && currentYear) {
      console.log('🔄 [useMonthlyData] Transactions mises à jour, rechargement...');
      loadMonthlyData(currentYear);
      loadYearlySummary(currentYear);
    }
  }, [transactions.length, currentYear, loadMonthlyData, loadYearlySummary]);

  // ✅ CORRECTION : Valeur de retour complète
  return {
    // Données
    monthlyData,
    yearlySummary,
    availableYears,
    
    // États
    loading,
    error,
    
    // Actions
    loadMonthlyData,
    loadYearlySummary,
    refreshData,
    
    // Utilitaires
    getMonthlyData,
    getMonthlyOverview,
    getAvailableYears,
    getCurrentMonthData,
    getYearlySummary
  };
};

export default useMonthlyData;