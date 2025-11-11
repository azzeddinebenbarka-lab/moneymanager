// src/hooks/useAccounts.ts - VERSION COMPLÈTEMENT CORRIGÉE
import { useCallback, useEffect, useState } from 'react';
import { accountService } from '../services/accountService';
import { Account } from '../types';

export interface UseAccountsReturn {
  // État
  accounts: Account[];
  loading: boolean;
  error: string | null;
  totalBalance: number;
  accountsCount: number;

  // Actions
  createAccount: (account: Omit<Account, 'id' | 'createdAt'>) => Promise<string>;
  updateAccount: (id: string, updates: Partial<Omit<Account, 'id' | 'createdAt'>>) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;
  getAccountById: (id: string) => Promise<Account | null>;
  updateAccountBalance: (id: string, newBalance: number) => Promise<void>;
  refreshAccounts: () => Promise<void>;
  clearError: () => void;

  // Utilitaires
  getAccountsByType: (type: Account['type']) => Promise<Account[]>;
  getActiveAccounts: () => Promise<Account[]>;
  searchAccounts: (searchTerm: string) => Promise<Account[]>;
  getAccountStats: () => Promise<{
    totalAccounts: number;
    totalBalance: number;
    accountsByType: Record<string, number>;
    activeAccounts: number;
  }>;
}

export const useAccounts = (userId: string = 'default-user'): UseAccountsReturn => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalBalance, setTotalBalance] = useState(0);
  const [accountsCount, setAccountsCount] = useState(0);

  // ✅ CHARGEMENT DES COMPTES AVEC CRÉATION AUTOMATIQUE SI VIDE
  const loadAccounts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 [useAccounts] Loading accounts...');
      
      // ✅ S'ASSURER QU'IL Y A AU MOINS UN COMPTE
      await accountService.createDefaultAccountIfNoneExists(userId);
      
      const accountsData = await accountService.getAllAccounts(userId);
      
      console.log(`✅ [useAccounts] Successfully loaded:`, {
        count: accountsData.length,
        totalBalance: accountsData.reduce((sum, acc) => sum + acc.balance, 0)
      });
      
      setAccounts(accountsData);
      setTotalBalance(accountsData.reduce((sum, account) => sum + account.balance, 0));
      setAccountsCount(accountsData.length);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      console.error('❌ [useAccounts] Error loading accounts:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // ✅ CRÉATION D'UN COMPTE
  const createAccount = useCallback(async (accountData: Omit<Account, 'id' | 'createdAt'>): Promise<string> => {
    try {
      setError(null);
      console.log('🔄 [useAccounts] Creating account...');

      const accountId = await accountService.createAccount(accountData, userId);
      
      // Recharger la liste des comptes
      await loadAccounts();
      
      console.log('✅ [useAccounts] Account created successfully');
      return accountId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création du compte';
      console.error('❌ [useAccounts] Error creating account:', errorMessage);
      setError(errorMessage);
      throw err;
    }
  }, [userId, loadAccounts]);

  // ✅ MISE À JOUR D'UN COMPTE
  const updateAccount = useCallback(async (id: string, updates: Partial<Omit<Account, 'id' | 'createdAt'>>): Promise<void> => {
    try {
      setError(null);
      console.log('🔄 [useAccounts] Updating account...', { id, updates });

      await accountService.updateAccount(id, updates, userId);
      
      // Recharger la liste des comptes
      await loadAccounts();
      
      console.log('✅ [useAccounts] Account updated successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour du compte';
      console.error('❌ [useAccounts] Error updating account:', errorMessage);
      setError(errorMessage);
      throw err;
    }
  }, [userId, loadAccounts]);

  // ✅ SUPPRESSION D'UN COMPTE
  const deleteAccount = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null);
      console.log('🔄 [useAccounts] Deleting account...', { id });

      await accountService.deleteAccount(id, userId);
      
      // Recharger la liste des comptes
      await loadAccounts();
      
      console.log('✅ [useAccounts] Account deleted successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression du compte';
      console.error('❌ [useAccounts] Error deleting account:', errorMessage);
      setError(errorMessage);
      throw err;
    }
  }, [userId, loadAccounts]);

  // ✅ MISE À JOUR DU SOLDE
  const updateAccountBalance = useCallback(async (id: string, newBalance: number): Promise<void> => {
    try {
      setError(null);
      console.log('🔄 [useAccounts] Updating account balance...', { id, newBalance });

      await accountService.updateAccountBalance(id, newBalance, userId);
      
      // Recharger la liste des comptes
      await loadAccounts();
      
      console.log('✅ [useAccounts] Account balance updated successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour du solde';
      console.error('❌ [useAccounts] Error updating account balance:', errorMessage);
      setError(errorMessage);
      throw err;
    }
  }, [userId, loadAccounts]);

  // ✅ RÉCUPÉRATION D'UN COMPTE PAR ID
  const getAccountById = useCallback(async (id: string): Promise<Account | null> => {
    try {
      return await accountService.getAccountById(id, userId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la récupération du compte';
      console.error('❌ [useAccounts] Error getting account by id:', errorMessage);
      throw err;
    }
  }, [userId]);

  // ✅ RECHARGEMENT DES COMPTES
  const refreshAccounts = useCallback(async (): Promise<void> => {
    await loadAccounts();
  }, [loadAccounts]);

  // ✅ EFFACER LES ERREURS
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ✅ COMPTES PAR TYPE
  const getAccountsByType = useCallback(async (type: Account['type']): Promise<Account[]> => {
    try {
      return await accountService.getAccountsByType(type, userId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du filtrage par type';
      console.error('❌ [useAccounts] Error getting accounts by type:', errorMessage);
      throw err;
    }
  }, [userId]);

  // ✅ COMPTES ACTIFS
  const getActiveAccounts = useCallback(async (): Promise<Account[]> => {
    try {
      return await accountService.getActiveAccounts(userId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la récupération des comptes actifs';
      console.error('❌ [useAccounts] Error getting active accounts:', errorMessage);
      throw err;
    }
  }, [userId]);

  // ✅ RECHERCHE DE COMPTES
  const searchAccounts = useCallback(async (searchTerm: string): Promise<Account[]> => {
    try {
      return await accountService.searchAccounts(searchTerm, userId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la recherche';
      console.error('❌ [useAccounts] Error searching accounts:', errorMessage);
      throw err;
    }
  }, [userId]);

  // ✅ STATISTIQUES DES COMPTES
  const getAccountStats = useCallback(async () => {
    try {
      return await accountService.getAccountStats(userId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du calcul des statistiques';
      console.error('❌ [useAccounts] Error getting account stats:', errorMessage);
      throw err;
    }
  }, [userId]);

  // ✅ CHARGEMENT INITIAL
  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  return {
    // État
    accounts,
    loading,
    error,
    totalBalance,
    accountsCount,

    // Actions
    createAccount,
    updateAccount,
    deleteAccount,
    getAccountById,
    updateAccountBalance,
    refreshAccounts,
    clearError,

    // Utilitaires
    getAccountsByType,
    getActiveAccounts,
    searchAccounts,
    getAccountStats,
  };
};

export default useAccounts;