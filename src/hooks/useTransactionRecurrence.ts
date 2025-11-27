// src/hooks/useTransactionRecurrence.ts - Hook pour gérer les transactions récurrentes
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { transactionRecurrenceService } from '../services/transactionRecurrenceService';
import { Transaction } from '../types';

export const useTransactionRecurrence = (userId: string = 'default-user') => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ TRAITER LES TRANSACTIONS RÉCURRENTES
  const processRecurringTransactions = useCallback(async (): Promise<{ processed: number; errors: string[] }> => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔄 Traitement des transactions récurrentes...');
      const result = await transactionRecurrenceService.processRecurringTransactions(userId);

      if (result.processed > 0) {
        console.log(`✅ ${result.processed} transactions créées`);
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur traitement récurrences';
      console.error('❌ Erreur traitement récurrent:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // ✅ GÉNÉRER LA PROCHAINE OCCURRENCE
  const generateNextOccurrence = useCallback(async (transaction: Transaction): Promise<string | null> => {
    try {
      setError(null);

      console.log(`🔄 Génération occurrence pour: ${transaction.description}`);
      const nextOccurrenceId = await transactionRecurrenceService.generateNextOccurrence(transaction, userId);

      if (nextOccurrenceId) {
        Alert.alert(
          '✅ Occurrence Créée',
          `La prochaine occurrence de "${transaction.description}" a été créée`
        );
      } else {
        Alert.alert(
          'ℹ️ Occurrence Existante',
          `L'occurrence de "${transaction.description}" existe déjà`
        );
      }

      return nextOccurrenceId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur génération occurrence';
      console.error('❌ Erreur génération occurrence:', errorMessage);
      setError(errorMessage);
      Alert.alert('❌ Erreur', 'Impossible de générer la prochaine occurrence');
      throw err;
    }
  }, [userId]);

  // ✅ OBTENIR LES STATISTIQUES
  const getStats = useCallback(async () => {
    try {
      setError(null);
      return await transactionRecurrenceService.getRecurrenceStats(userId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur récupération stats';
      console.error('❌ Erreur stats:', errorMessage);
      setError(errorMessage);
      throw err;
    }
  }, [userId]);

  // ✅ DÉSACTIVER UNE RÉCURRENCE
  const disableRecurrence = useCallback(async (transactionId: string): Promise<void> => {
    try {
      setError(null);

      await transactionRecurrenceService.disableRecurrence(transactionId, userId);
      
      Alert.alert(
        '✅ Récurrence Désactivée',
        'La récurrence a été désactivée avec succès'
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur désactivation récurrence';
      console.error('❌ Erreur désactivation:', errorMessage);
      setError(errorMessage);
      Alert.alert('❌ Erreur', 'Impossible de désactiver la récurrence');
      throw err;
    }
  }, [userId]);

  // ✅ OBTENIR LES OCCURRENCES D'UNE TRANSACTION
  const getOccurrences = useCallback(async (parentId: string): Promise<Transaction[]> => {
    try {
      setError(null);
      return await transactionRecurrenceService.getTransactionOccurrences(parentId, userId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur récupération occurrences';
      console.error('❌ Erreur occurrences:', errorMessage);
      setError(errorMessage);
      return [];
    }
  }, [userId]);

  return {
    // État
    loading,
    error,

    // Actions
    processRecurringTransactions,
    generateNextOccurrence,
    disableRecurrence,
    getOccurrences,
    getStats,

    // Utilitaires
    clearError: () => setError(null)
  };
};

export default useTransactionRecurrence;
