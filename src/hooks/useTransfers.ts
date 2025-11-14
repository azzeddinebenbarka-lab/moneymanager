// src/hooks/useTransfers.ts - VERSION COMPLÈTEMENT CORRIGÉE
import { useCallback, useState } from 'react';
import { accountService } from '../services/accountService';
import { TransferData, transferService } from '../services/transferService';
import { useAccounts } from './useAccounts';

export const useTransfers = (userId: string = 'default-user') => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { refreshAccounts } = useAccounts();

  const executeTransfer = useCallback(async (transferData: TransferData): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 [useTransfers] Exécution du transfert avec validation...');
      
      // ✅ VALIDATION AVANCÉE DES COMPTES
      const fromAccount = await accountService.getAccountById(transferData.fromAccountId);
      const toAccount = await accountService.getAccountById(transferData.toAccountId);

      if (!fromAccount) {
        throw new Error(`Compte source introuvable: ${transferData.fromAccountId}`);
      }

      if (!toAccount) {
        throw new Error(`Compte destination introuvable: ${transferData.toAccountId}`);
      }

      if (!fromAccount.isActive) {
        throw new Error('Le compte source est désactivé');
      }

      if (!toAccount.isActive) {
        throw new Error('Le compte destination est désactivé');
      }

      if (fromAccount.balance < transferData.amount) {
        throw new Error(`Solde insuffisant sur ${fromAccount.name}. Disponible: ${fromAccount.balance} MAD`);
      }

      if (transferData.amount <= 0) {
        throw new Error('Le montant du transfert doit être positif');
      }

      // Exécuter le transfert
      await transferService.executeTransfer(transferData, userId);
      
      // Rafraîchir les comptes
      await refreshAccounts();
      
      console.log('✅ [useTransfers] Transfert exécuté avec succès');
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du transfert';
      console.error('❌ [useTransfers] Erreur:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId, refreshAccounts]);

  const validateTransfer = useCallback(async (fromAccountId: string, amount: number) => {
    return await transferService.validateTransfer(fromAccountId, amount);
  }, []);

  const executeSavingsTransfer = useCallback(async (
    transferData: TransferData, 
    goalName: string
  ): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('💰 [useTransfers] Transfert épargne:', { ...transferData, goalName });

      // Validation des comptes
      const fromAccount = await accountService.getAccountById(transferData.fromAccountId);
      const toAccount = await accountService.getAccountById(transferData.toAccountId);

      if (!fromAccount) {
        throw new Error('Compte source introuvable');
      }

      if (!toAccount) {
        throw new Error('Compte épargne introuvable');
      }

      if (!fromAccount.isActive) {
        throw new Error('Le compte source est désactivé');
      }

      if (!toAccount.isActive) {
        throw new Error('Le compte épargne est désactivé');
      }

      if (fromAccount.balance < transferData.amount) {
        throw new Error(`Solde insuffisant sur ${fromAccount.name}. Disponible: ${fromAccount.balance} MAD`);
      }

      await transferService.executeSavingsTransfer(transferData, goalName, userId);
      
      await refreshAccounts();
      
      console.log('✅ [useTransfers] Transfert épargne réussi');
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du transfert épargne';
      console.error('❌ [useTransfers] Erreur transfert épargne:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId, refreshAccounts]);

  const executeSavingsRefund = useCallback(async (
    transferData: TransferData, 
    goalName: string
  ): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('💸 [useTransfers] Remboursement épargne:', { ...transferData, goalName });

      // Validation des comptes
      const fromAccount = await accountService.getAccountById(transferData.fromAccountId);
      const toAccount = await accountService.getAccountById(transferData.toAccountId);

      if (!fromAccount) {
        throw new Error('Compte épargne introuvable');
      }

      if (!toAccount) {
        throw new Error('Compte destination introuvable');
      }

      if (!fromAccount.isActive) {
        throw new Error('Le compte épargne est désactivé');
      }

      if (!toAccount.isActive) {
        throw new Error('Le compte destination est désactivé');
      }

      if (fromAccount.balance < transferData.amount) {
        throw new Error(`Solde insuffisant sur le compte épargne. Disponible: ${fromAccount.balance} MAD`);
      }

      await transferService.executeSavingsRefund(transferData, goalName, userId);
      
      await refreshAccounts();
      
      console.log('✅ [useTransfers] Remboursement épargne réussi');
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du remboursement';
      console.error('❌ [useTransfers] Erreur remboursement:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId, refreshAccounts]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Actions principales
    executeTransfer,
    executeSavingsTransfer,
    executeSavingsRefund,
    validateTransfer,
    
    // État
    loading,
    error,
    
    // Utilitaires
    clearError
  };
};