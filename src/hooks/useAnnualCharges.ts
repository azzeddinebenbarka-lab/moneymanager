// src/hooks/useAnnualCharges.ts - VERSION CORRECTE AVEC PRÉLÈVEMENTS AUTOMATIQUES
import { useCallback, useEffect, useState } from 'react';
import { annualChargeService } from '../services/annualChargeService';
import { AnnualCharge, AnnualChargeStats, CreateAnnualChargeData, UpdateAnnualChargeData } from '../types/AnnualCharge';

export const useAnnualCharges = (userId: string = 'default-user') => {
  const [charges, setCharges] = useState<AnnualCharge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoProcessed, setAutoProcessed] = useState(false); // ✅ Éviter les doubles traitements

  // ✅ OPTIMISATION : Filtrer automatiquement pour l'année courante
  const getCurrentYearCharges = useCallback((): AnnualCharge[] => {
    const currentYear = new Date().getFullYear();
    return charges.filter(charge => {
      const chargeYear = new Date(charge.dueDate).getFullYear();
      return chargeYear === currentYear;
    });
  }, [charges]);

  const loadCharges = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔍 [useAnnualCharges] Loading annual charges...');
      const annualCharges = await annualChargeService.getAllAnnualCharges(userId);
      setCharges(annualCharges);
      console.log('✅ [useAnnualCharges] Loaded', annualCharges.length, 'charges');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des charges';
      console.error('❌ [useAnnualCharges] Error loading charges:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // ✅ TRAITER LES PRÉLÈVEMENTS AUTOMATIQUES (SÉPARÉMENT)
  const processAutoDeductCharges = useCallback(async (): Promise<{ processed: number; errors: string[] }> => {
    try {
      if (autoProcessed) {
        console.log('ℹ️ Prélèvements automatiques déjà traités');
        return { processed: 0, errors: [] };
      }

      setError(null);
      console.log('🔄 [useAnnualCharges] Processing auto-deduct charges...');
      const result = await annualChargeService.processDueCharges(userId);
      
      if (result.processed > 0) {
        console.log(`✅ ${result.processed} charges processed automatically`);
        setAutoProcessed(true);
        // Recharger les charges après traitement
        await loadCharges();
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du traitement automatique';
      console.error('❌ [useAnnualCharges] Error processing auto-deduct charges:', errorMessage);
      setError(errorMessage);
      throw err;
    }
  }, [userId, autoProcessed, loadCharges]);

  // ✅ CRÉER UNE CHARGE
  const createCharge = useCallback(async (chargeData: CreateAnnualChargeData): Promise<string> => {
    try {
      setError(null);
      console.log('🔄 [useAnnualCharges] Creating annual charge...');
      
      const chargeId = await annualChargeService.createAnnualCharge(chargeData, userId);
      await loadCharges();
      
      console.log('✅ [useAnnualCharges] Annual charge created successfully');
      return chargeId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création de la charge';
      console.error('❌ [useAnnualCharges] Error creating charge:', errorMessage);
      setError(errorMessage);
      throw err;
    }
  }, [userId, loadCharges]);

  // ✅ PAYER UNE CHARGE
  const payCharge = useCallback(async (chargeId: string, accountId?: string): Promise<void> => {
    try {
      setError(null);
      console.log('💰 [useAnnualCharges] Paying charge:', chargeId);
      
      await annualChargeService.payCharge(chargeId, accountId, userId);
      await loadCharges();

      console.log('✅ [useAnnualCharges] Charge paid successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du paiement de la charge';
      console.error('❌ [useAnnualCharges] Error paying charge:', errorMessage);
      setError(errorMessage);
      throw err;
    }
  }, [userId, loadCharges]);

  // ✅ BASILER LE STATUT PAYÉ
  const togglePaidStatus = useCallback(async (chargeId: string, isPaid: boolean): Promise<void> => {
    try {
      setError(null);
      
      await annualChargeService.togglePaidStatus(chargeId, isPaid, userId);
      await loadCharges();

      console.log('✅ [useAnnualCharges] Paid status toggled successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du changement de statut';
      console.error('❌ [useAnnualCharges] Error toggling paid status:', errorMessage);
      setError(errorMessage);
      throw err;
    }
  }, [userId, loadCharges]);

  // ✅ MÉTHODES DE FILTRAGE SIMPLIFIÉES
  const getChargesByStatus = useCallback(async (status: 'all' | 'paid' | 'pending'): Promise<AnnualCharge[]> => {
    try {
      const currentYearCharges = getCurrentYearCharges();
      
      switch (status) {
        case 'paid':
          return currentYearCharges.filter(charge => charge.isPaid);
        case 'pending':
          return currentYearCharges.filter(charge => !charge.isPaid);
        default:
          return currentYearCharges;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du filtrage des charges';
      console.error('❌ [useAnnualCharges] Error filtering charges:', errorMessage);
      throw err;
    }
  }, [getCurrentYearCharges]);

  // ✅ STATISTIQUES POUR L'ANNÉE COURANTE
  const getStats = useCallback(async (): Promise<AnnualChargeStats> => {
    try {
      const currentYearCharges = getCurrentYearCharges();
      const today = new Date().toISOString().split('T')[0];

      const totalAmount = currentYearCharges.reduce((sum, charge) => sum + charge.amount, 0);
      const paidAmount = currentYearCharges
        .filter(charge => charge.isPaid)
        .reduce((sum, charge) => sum + charge.amount, 0);
      const pendingAmount = totalAmount - paidAmount;

      const upcomingCharges = currentYearCharges
        .filter(charge => !charge.isPaid && charge.dueDate >= today)
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        .slice(0, 5);

      const overdueCharges = currentYearCharges
        .filter(charge => !charge.isPaid && charge.dueDate < today)
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

      return {
        totalCharges: currentYearCharges.length,
        totalAmount,
        paidAmount,
        pendingAmount,
        upcomingCharges,
        overdueCharges
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la récupération des statistiques';
      console.error('❌ [useAnnualCharges] Error getting stats:', errorMessage);
      setError(errorMessage);
      throw err;
    }
  }, [getCurrentYearCharges]);

  // Reste des méthodes
  const updateAnnualCharge = useCallback(async (chargeId: string, updates: UpdateAnnualChargeData): Promise<void> => {
    try {
      setError(null);
      await annualChargeService.updateAnnualCharge(chargeId, updates, userId);
      await loadCharges();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour de la charge';
      setError(errorMessage);
      throw err;
    }
  }, [userId, loadCharges]);

  const deleteAnnualCharge = useCallback(async (chargeId: string): Promise<void> => {
    try {
      setError(null);
      await annualChargeService.deleteAnnualCharge(chargeId, userId);
      await loadCharges();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression de la charge';
      setError(errorMessage);
      throw err;
    }
  }, [userId, loadCharges]);

  const getChargeById = useCallback(async (chargeId: string): Promise<AnnualCharge | null> => {
    try {
      return await annualChargeService.getAnnualChargeById(chargeId, userId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la récupération de la charge';
      setError(errorMessage);
      throw err;
    }
  }, [userId]);

  const refreshAnnualCharges = useCallback(async (): Promise<void> => {
    await loadCharges();
  }, [loadCharges]);

  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  // ✅ EFFET SIMPLE SANS BOUCLE
  useEffect(() => {
    loadCharges();
  }, [loadCharges]);

  return {
    // État
    charges: getCurrentYearCharges(), // ✅ Retourne uniquement l'année courante
    loading,
    error,

    // Actions principales
    createCharge,
    updateAnnualCharge,
    deleteAnnualCharge,
    togglePaidStatus,
    payCharge,
    refreshAnnualCharges,
    getChargeById,
    getStats,
    getChargesByStatus,
    processAutoDeductCharges, // ✅ SÉPARÉ : à appeler manuellement si besoin

    // Utilitaires
    clearError,
  };
};

export default useAnnualCharges;