// src/hooks/useTransfers.ts - NOUVEAU HOOK
import { useCallback, useState } from 'react';
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
      
      console.log('🔄 [useTransfers] Exécution du transfert...');
      
      // Valider d'abord le transfert
      const validation = await transferService.validateTransfer(
        transferData.fromAccountId, 
        transferData.amount
      );

      if (!validation.isValid) {
        throw new Error(validation.message || 'Transfert invalide');
      }

      // Exécuter le transfert
      await transferService.executeTransfer(transferData, userId);
      
      // Rafraîchir les comptes pour voir les nouveaux soldes
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

  return {
    executeTransfer,
    validateTransfer,
    loading,
    error,
  };
};