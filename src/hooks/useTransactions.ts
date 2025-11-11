// src/hooks/useTransactions.ts - VERSION OPTIMISÉE POUR LA NAVIGATION
import { useCallback, useEffect, useState } from 'react';
import { transactionService } from '../services/transactionService';
import { Transaction } from '../types';

export const useTransactions = (userId: string = 'default-user') => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // ✅ CORRECTION : Charger toutes les transactions - OPTIMISÉ
  const loadTransactions = useCallback(async (forceRefresh: boolean = false) => {
    // Éviter les rechargements trop fréquents
    const now = new Date();
    const timeSinceLastRefresh = now.getTime() - lastRefresh.getTime();
    
    if (!forceRefresh && timeSinceLastRefresh < 5000) { // 5 secondes
      console.log('⏱️ [useTransactions] Rechargement trop rapide, ignoré');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('🔍 [useTransactions] Loading transactions...');
      
      const transactionsData = await transactionService.getAllTransactions(userId);
      console.log('✅ [useTransactions] Loaded', transactionsData.length, 'transactions');
      
      setTransactions(transactionsData);
      setLastRefresh(new Date());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des transactions';
      console.error('❌ [useTransactions] Error loading transactions:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [userId, lastRefresh]);

  // ✅ NOUVELLE MÉTHODE : Rechargement forcé
  const forceRefresh = useCallback(async () => {
    console.log('🔄 [useTransactions] Forced refresh requested');
    await loadTransactions(true);
  }, [loadTransactions]);

  // Créer une transaction
  const createTransaction = async (transactionData: Omit<Transaction, 'id' | 'createdAt'>): Promise<string> => {
    try {
      setError(null);
      console.log('🔄 [useTransactions] Creating transaction...');
      
      const transactionId = await transactionService.createTransaction(transactionData, userId);
      
      // Recharger après création
      await forceRefresh();
      
      console.log('✅ [useTransactions] Transaction created successfully');
      return transactionId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création de la transaction';
      console.error('❌ [useTransactions] Error creating transaction:', errorMessage);
      setError(errorMessage);
      throw err;
    }
  };

  // Mettre à jour une transaction
  const updateTransaction = async (id: string, updates: Partial<Transaction>): Promise<void> => {
    try {
      setError(null);
      console.log('🔄 [useTransactions] Updating transaction:', id);
      
      await transactionService.updateTransaction(id, updates, userId);
      await forceRefresh();
      
      console.log('✅ [useTransactions] Transaction updated successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour de la transaction';
      console.error('❌ [useTransactions] Error updating transaction:', errorMessage);
      setError(errorMessage);
      throw err;
    }
  };

  // Supprimer une transaction
  const deleteTransaction = async (id: string): Promise<void> => {
    try {
      setError(null);
      console.log('🗑️ [useTransactions] Deleting transaction:', id);
      
      await transactionService.deleteTransaction(id, userId);
      await forceRefresh();
      
      console.log('✅ [useTransactions] Transaction deleted successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression de la transaction';
      console.error('❌ [useTransactions] Error deleting transaction:', errorMessage);
      setError(errorMessage);
      throw err;
    }
  };

  // Obtenir une transaction par ID
  const getTransactionById = async (id: string): Promise<Transaction | null> => {
    try {
      console.log('🔍 [useTransactions] Getting transaction by ID:', id);
      return await transactionService.getTransactionById(id, userId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la récupération de la transaction';
      console.error('❌ [useTransactions] Error getting transaction by ID:', errorMessage);
      setError(errorMessage);
      throw err;
    }
  };

  // Obtenir les transactions par compte
  const getTransactionsByAccount = async (accountId: string): Promise<Transaction[]> => {
    try {
      console.log('🔍 [useTransactions] Getting transactions by account:', accountId);
      return await transactionService.getTransactionsByAccount(accountId, userId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la récupération des transactions par compte';
      console.error('❌ [useTransactions] Error getting transactions by account:', errorMessage);
      setError(errorMessage);
      throw err;
    }
  };

  // Obtenir les transactions par date (optimisé)
  const getTransactionsByDateRange = useCallback(async (startDate: string, endDate: string): Promise<Transaction[]> => {
    try {
      // Si on a déjà les données, filtrer en mémoire
      if (transactions.length > 0) {
        const filtered = transactions.filter(transaction => 
          transaction.date >= startDate && transaction.date <= endDate
        );
        if (filtered.length > 0) {
          console.log('⚡ [useTransactions] Using cached data for date range');
          return filtered;
        }
      }
      
      console.log('🔍 [useTransactions] Getting transactions by date range from DB');
      return await transactionService.getTransactionsByDateRange(startDate, endDate, userId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la récupération des transactions par date';
      console.error('❌ [useTransactions] Error getting transactions by date range:', errorMessage);
      setError(errorMessage);
      throw err;
    }
  }, [transactions, userId]);

  // Rafraîchir les transactions
  const refreshTransactions = useCallback(async (): Promise<void> => {
    await forceRefresh();
  }, [forceRefresh]);

  // Effet pour charger les transactions au montage
  useEffect(() => {
    let mounted = true;
    
    const initialize = async () => {
      if (mounted) {
        await loadTransactions();
      }
    };

    initialize();

    return () => {
      mounted = false;
    };
  }, [loadTransactions]);

  return {
    // État
    transactions,
    loading,
    error,
    lastRefresh,
    
    // Actions principales
    createTransaction,
    updateTransaction,
    deleteTransaction,
    refreshTransactions,
    forceRefresh,
    
    // Actions de recherche
    getTransactionById,
    getTransactionsByDateRange,
    getTransactionsByAccount,
    
    // Méthodes utilitaires
    getTransactionsByCategory: (categoryId: string) => 
      transactions.filter(t => t.category === categoryId),
    getTransactionsByType: (type: 'income' | 'expense') => 
      transactions.filter(t => t.type === type),
    
    // Statistiques rapides
    getStats: () => ({
      total: transactions.length,
      income: transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
      expenses: transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Math.abs(t.amount), 0),
      balance: transactions.reduce((sum, t) => t.type === 'income' ? sum + t.amount : sum - t.amount, 0)
    })
  };
};

export type UseTransactionsReturn = ReturnType<typeof useTransactions>;