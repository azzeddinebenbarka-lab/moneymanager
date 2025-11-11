// src/hooks/useSyncData.ts - VERSION COMPLÈTEMENT CORRIGÉE
import { useCallback, useEffect, useState } from 'react';
import { useBudgets } from './useBudgets';
import { useRecurringTransactions } from './useRecurringTransactions';
import { useTransactions } from './useTransactions';

interface UseSyncDataReturn {
  syncAllData: () => Promise<void>;
  forceSync: () => Promise<void>;
  isSyncing: boolean;
  lastSync: Date | null;
}

export const useSyncData = (userId: string = 'default-user'): UseSyncDataReturn => {
  const { updateBudgetsFromTransactions } = useBudgets(userId);
  const { processRecurringTransactions } = useRecurringTransactions();
  const { refreshTransactions } = useTransactions(userId);
  
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  const syncAllData = useCallback(async () => {
    if (isSyncing) {
      console.log('⏳ [useSyncData] Sync déjà en cours, ignoré...');
      return;
    }

    try {
      setIsSyncing(true);
      console.log('🔄 [useSyncData] Démarrage synchronisation complète...');
      
      // 1. Traiter les transactions récurrentes d'abord
      console.log('📅 [useSyncData] Traitement transactions récurrentes...');
      await processRecurringTransactions();
      console.log('✅ [useSyncData] Transactions récurrentes traitées');
      
      // 2. Actualiser les transactions (inclut maintenant les récurrentes)
      console.log('💳 [useSyncData] Actualisation transactions...');
      await refreshTransactions();
      console.log('✅ [useSyncData] Transactions actualisées');
      
      // 3. Mettre à jour les budgets avec les nouvelles transactions
      console.log('💰 [useSyncData] Mise à jour budgets depuis transactions...');
      await updateBudgetsFromTransactions();
      console.log('✅ [useSyncData] Budgets mis à jour');
      
      setLastSync(new Date());
      console.log('🎉 [useSyncData] Synchronisation complète terminée avec succès');
    } catch (error) {
      console.error('❌ [useSyncData] Erreur pendant synchronisation:', error);
      throw error;
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing, processRecurringTransactions, refreshTransactions, updateBudgetsFromTransactions]);

  // Synchronisation automatique toutes les 30 secondes
  useEffect(() => {
    const interval = setInterval(syncAllData, 30000);
    return () => clearInterval(interval);
  }, [syncAllData]);

  // Synchronisation au montage
  useEffect(() => {
    syncAllData();
  }, [syncAllData]);

  return {
    syncAllData,
    forceSync: syncAllData,
    isSyncing,
    lastSync
  };
};