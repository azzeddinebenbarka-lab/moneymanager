// src/hooks/useTransactions.ts - VERSION UNIFIÉE COMPLÈTE
import { useCallback, useEffect, useState } from 'react';
import { transactionService } from '../services/transactionService';
import { CreateTransactionData, Transaction } from '../types';

export const useTransactions = (userId: string = 'default-user') => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // ✅ CHARGEMENT UNIFIÉ
  const loadTransactions = useCallback(async (filters: any = {}, forceRefresh: boolean = false) => {
    // Éviter les rechargements trop fréquents
    const now = new Date();
    const timeSinceLastRefresh = now.getTime() - lastRefresh.getTime();
    
    if (!forceRefresh && timeSinceLastRefresh < 5000) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const transactionsData = await transactionService.getAllTransactions(userId, filters);
      setTransactions(transactionsData);
      setLastRefresh(new Date());
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des transactions';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [userId, lastRefresh]);

  // ✅ CRÉATION UNIFIÉE
  const createTransaction = async (transactionData: CreateTransactionData): Promise<string> => {
    try {
      setError(null);
      
      const transactionId = await transactionService.createTransaction(transactionData, userId);
      await loadTransactions({}, true); // Recharger après création
      
      return transactionId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création de la transaction';
      setError(errorMessage);
      throw err;
    }
  };

  // ✅ MISE À JOUR UNIFIÉE
  const updateTransaction = async (id: string, updates: Partial<Transaction>): Promise<void> => {
    try {
      setError(null);
      
      await transactionService.updateTransaction(id, updates, userId);
      await loadTransactions({}, true);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour de la transaction';
      setError(errorMessage);
      throw err;
    }
  };

  // ✅ SUPPRESSION UNIFIÉE
  const deleteTransaction = async (id: string): Promise<void> => {
    try {
      setError(null);
      
      await transactionService.deleteTransaction(id, userId);
      await loadTransactions({}, true);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression de la transaction';
      setError(errorMessage);
      throw err;
    }
  };

  // ✅ TRAITEMENT DES RÉCURRENTES
  const processRecurringTransactions = async (): Promise<{ processed: number; errors: string[] }> => {
    try {
      setError(null);
      
      const result = await transactionService.processRecurringTransactions(userId);
      await loadTransactions({}, true); // Recharger après traitement
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du traitement des transactions récurrentes';
      setError(errorMessage);
      throw err;
    }
  };

  // ✅ MÉTHODES UTILITAIRES
  const getTransactionById = (id: string): Transaction | undefined => {
    return transactions.find(transaction => transaction.id === id);
  };

  const getRecurringTransactions = (): Transaction[] => {
    return transactions.filter(transaction => transaction.isRecurring);
  };

  const getNormalTransactions = (): Transaction[] => {
    return transactions.filter(transaction => !transaction.isRecurring);
  };

  const getTransactionsByAccount = (accountId: string): Transaction[] => {
    return transactions.filter(transaction => transaction.accountId === accountId);
  };

  const getTransactionsByType = (type: 'income' | 'expense'): Transaction[] => {
    return transactions.filter(transaction => transaction.type === type);
  };

  const refreshTransactions = useCallback(async (filters: any = {}): Promise<void> => {
    await loadTransactions(filters, true);
  }, [loadTransactions]);

  // EFFET : CHARGEMENT INITIAL ET TRAITEMENT AUTO
  useEffect(() => {
    loadTransactions();
    
    // Traitement automatique au démarrage
    const processOnStartup = async () => {
      try {
        await processRecurringTransactions();
      } catch (error) {
        console.error('Erreur traitement automatique:', error);
      }
    };
    
    processOnStartup();
  }, []);

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
    processRecurringTransactions,
    refreshTransactions,
    
    // Méthodes de filtrage
    getTransactionById,
    getRecurringTransactions,
    getNormalTransactions,
    getTransactionsByAccount,
    getTransactionsByType,
    
    // Statistiques
    getStats: () => ({
      total: transactions.length,
      recurring: transactions.filter(t => t.isRecurring).length,
      normal: transactions.filter(t => !t.isRecurring).length,
      income: transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
      expenses: transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Math.abs(t.amount), 0),
      balance: transactions.reduce((sum, t) => t.type === 'income' ? sum + t.amount : sum - t.amount, 0)
    })
  };
};