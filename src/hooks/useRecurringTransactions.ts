// src/hooks/useRecurringTransactions.ts - VERSION COMPLÈTEMENT CORRIGÉE
import { useCallback, useEffect, useState } from 'react';
import { recurringTransactionService } from '../services/recurringTransactionService';
import { RecurringTransaction } from '../types';

export const useRecurringTransactions = (userId: string = 'default-user') => {
  const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    byFrequency: {} as Record<string, number>,
    totalAmount: 0,
  });

  // ✅ CHARGEMENT AVEC GESTION D'ERREUR
  const loadRecurringTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 [useRecurringTransactions] Loading recurring transactions...');
      
      const transactionsData = await recurringTransactionService.getAllRecurringTransactions(userId);
      console.log('✅ [useRecurringTransactions] Loaded', transactionsData.length, 'recurring transactions');
      
      setRecurringTransactions(transactionsData);
      
      // Charger les statistiques
      const statsData = await recurringTransactionService.getRecurringTransactionStats(userId);
      setStats(statsData);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des transactions récurrentes';
      console.error('❌ [useRecurringTransactions] Error loading recurring transactions:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // ✅ CRÉATION AVEC VALIDATION
  const createRecurringTransaction = useCallback(async (
    transactionData: Omit<RecurringTransaction, 'id' | 'createdAt'>
  ): Promise<string> => {
    try {
      setError(null);
      console.log('🔄 [useRecurringTransactions] Creating recurring transaction...');
      
      // Validation des données
      const validationErrors = validateRecurringTransactionData(transactionData);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      const transactionId = await recurringTransactionService.createRecurringTransaction(transactionData);
      await loadRecurringTransactions();
      
      console.log('✅ [useRecurringTransactions] Recurring transaction created successfully');
      return transactionId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création de la transaction récurrente';
      console.error('❌ [useRecurringTransactions] Error creating recurring transaction:', errorMessage);
      setError(errorMessage);
      throw err;
    }
  }, [userId, loadRecurringTransactions]);

  // ✅ MISE À JOUR
  const updateRecurringTransaction = useCallback(async (
    id: string, 
    updates: Partial<Omit<RecurringTransaction, 'id' | 'createdAt'>>
  ): Promise<void> => {
    try {
      setError(null);
      console.log('🔄 [useRecurringTransactions] Updating recurring transaction:', id);
      
      await recurringTransactionService.updateRecurringTransaction(id, updates, userId);
      await loadRecurringTransactions();
      
      console.log('✅ [useRecurringTransactions] Recurring transaction updated successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour de la transaction récurrente';
      console.error('❌ [useRecurringTransactions] Error updating recurring transaction:', errorMessage);
      setError(errorMessage);
      throw err;
    }
  }, [userId, loadRecurringTransactions]);

  // ✅ SUPPRESSION
  const deleteRecurringTransaction = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null);
      console.log('🗑️ [useRecurringTransactions] Deleting recurring transaction:', id);
      
      await recurringTransactionService.deleteRecurringTransaction(id, userId);
      await loadRecurringTransactions();
      
      console.log('✅ [useRecurringTransactions] Recurring transaction deleted successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression de la transaction récurrente';
      console.error('❌ [useRecurringTransactions] Error deleting recurring transaction:', errorMessage);
      setError(errorMessage);
      throw err;
    }
  }, [userId, loadRecurringTransactions]);

  // ✅ ACTIVATION/DÉSACTIVATION
  const toggleRecurringTransaction = useCallback(async (id: string, isActive: boolean): Promise<void> => {
    try {
      setError(null);
      console.log('🔄 [useRecurringTransactions] Toggling recurring transaction:', { id, isActive });
      
      await recurringTransactionService.toggleRecurringTransaction(id, isActive, userId);
      await loadRecurringTransactions();
      
      console.log('✅ [useRecurringTransactions] Recurring transaction toggled successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la modification de la transaction récurrente';
      console.error('❌ [useRecurringTransactions] Error toggling recurring transaction:', errorMessage);
      setError(errorMessage);
      throw err;
    }
  }, [userId, loadRecurringTransactions]);

  // ✅ TRAITEMENT DES TRANSACTIONS RÉCURRENTES
  const processRecurringTransactions = useCallback(async (): Promise<{ processed: number; errors: string[] }> => {
    try {
      setError(null);
      console.log('🔄 [useRecurringTransactions] Processing recurring transactions...');
      
      const result = await recurringTransactionService.processRecurringTransactions(userId);
      await loadRecurringTransactions();
      
      console.log('✅ [useRecurringTransactions] Recurring transactions processed successfully');
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du traitement des transactions récurrentes';
      console.error('❌ [useRecurringTransactions] Error processing recurring transactions:', errorMessage);
      setError(errorMessage);
      throw err;
    }
  }, [userId, loadRecurringTransactions]);

  // ✅ VÉRIFICATION INTÉGRITÉ DONNÉES
  const checkDataIntegrity = useCallback(async (): Promise<{
    valid: number;
    invalid: number;
    missingAccounts: string[];
  }> => {
    try {
      setError(null);
      console.log('🔍 [useRecurringTransactions] Checking data integrity...');
      
      const integrity = await recurringTransactionService.checkDataIntegrity(userId);
      return integrity;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la vérification de l\'intégrité des données';
      console.error('❌ [useRecurringTransactions] Error checking data integrity:', errorMessage);
      setError(errorMessage);
      throw err;
    }
  }, [userId]);

  // ✅ RÉPARATION DONNÉES
  const repairDataIntegrity = useCallback(async (): Promise<{ repaired: number; errors: string[] }> => {
    try {
      setError(null);
      console.log('🛠️ [useRecurringTransactions] Repairing data integrity...');
      
      const result = await recurringTransactionService.repairDataIntegrity(userId);
      await loadRecurringTransactions();
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la réparation des données';
      console.error('❌ [useRecurringTransactions] Error repairing data integrity:', errorMessage);
      setError(errorMessage);
      throw err;
    }
  }, [userId, loadRecurringTransactions]);

  // ✅ RECHARGEMENT MANUEL
  const refreshRecurringTransactions = useCallback(async (): Promise<void> => {
    console.log('🔄 [useRecurringTransactions] Manual refresh requested');
    await loadRecurringTransactions();
  }, [loadRecurringTransactions]);

  // ✅ EFFACER LES ERREURS
  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  // EFFET : CHARGEMENT AUTOMATIQUE
  useEffect(() => {
    loadRecurringTransactions();
  }, [loadRecurringTransactions]);

  // EFFET : TRAITEMENT AUTOMATIQUE AU DÉMARRAGE
  useEffect(() => {
    const processOnStartup = async () => {
      try {
        await processRecurringTransactions();
      } catch (error) {
        console.error('❌ [useRecurringTransactions] Error processing recurring transactions on startup:', error);
      }
    };

    processOnStartup();
  }, []);

  return {
    // État
    recurringTransactions,
    loading,
    error,
    stats,
    
    // Actions principales
    createRecurringTransaction,
    updateRecurringTransaction,
    deleteRecurringTransaction,
    toggleRecurringTransaction,
    processRecurringTransactions,
    refreshRecurringTransactions,
    clearError,
    
    // Actions avancées
    checkDataIntegrity,
    repairDataIntegrity,
    
    // Méthodes utilitaires
    getRecurringTransactionById: (id: string) => 
      recurringTransactions.find(transaction => transaction.id === id),
    
    getActiveRecurringTransactions: () => 
      recurringTransactions.filter(transaction => transaction.isActive),
    
    getInactiveRecurringTransactions: () => 
      recurringTransactions.filter(transaction => !transaction.isActive),
    
    getRecurringTransactionsByFrequency: (frequency: string) => 
      recurringTransactions.filter(transaction => transaction.frequency === frequency),
    
    getRecurringTransactionsByAccount: (accountId: string) => 
      recurringTransactions.filter(transaction => transaction.accountId === accountId),
    
    getRecurringTransactionsByType: (type: 'income' | 'expense') => 
      recurringTransactions.filter(transaction => transaction.type === type),
  };
};

// ✅ VALIDATION DES DONNÉES
const validateRecurringTransactionData = (data: Omit<RecurringTransaction, 'id' | 'createdAt'>): string[] => {
  const errors: string[] = [];

  if (!data.description || data.description.trim().length === 0) {
    errors.push('La description est requise');
  }

  if (typeof data.amount !== 'number' || isNaN(data.amount)) {
    errors.push('Le montant doit être un nombre valide');
  }

  if (!['income', 'expense'].includes(data.type)) {
    errors.push('Le type doit être "income" ou "expense"');
  }

  if (!data.category || data.category.trim().length === 0) {
    errors.push('La catégorie est requise');
  }

  if (!data.accountId || data.accountId.trim().length === 0) {
    errors.push('Le compte est requis');
  }

  if (!['daily', 'weekly', 'monthly', 'yearly'].includes(data.frequency)) {
    errors.push('La fréquence doit être daily, weekly, monthly ou yearly');
  }

  if (!data.startDate || isNaN(new Date(data.startDate).getTime())) {
    errors.push('La date de début est invalide');
  }

  if (data.endDate && isNaN(new Date(data.endDate).getTime())) {
    errors.push('La date de fin est invalide');
  }

  if (data.endDate && new Date(data.endDate) < new Date(data.startDate)) {
    errors.push('La date de fin ne peut pas être avant la date de début');
  }

  return errors;
};

export type UseRecurringTransactionsReturn = ReturnType<typeof useRecurringTransactions>;