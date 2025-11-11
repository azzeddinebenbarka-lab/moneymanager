// src/hooks/useBudgets.ts - VERSION COMPLÈTEMENT CORRIGÉE
import { useCallback, useEffect, useState } from 'react';
import { budgetService } from '../services/budgetService';
import { Budget, BudgetStats } from '../types';

export const useBudgets = (userId: string = 'default-user') => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<BudgetStats>({
    totalBudgets: 0,
    activeBudgets: 0,
    totalSpent: 0,
    totalBudget: 0,
    averageUsage: 0,
  });

  // ✅ CHARGEMENT AVEC SYNCHRONISATION AUTOMATIQUE
  const loadBudgets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 [useBudgets] Chargement budgets avec synchronisation...');
      
      // ✅ SYNCHRO OBLIGATOIRE AVANT CHARGEMENT
      await budgetService.updateBudgetSpentFromTransactions(userId);
      
      const budgetsData = await budgetService.getAllBudgets(userId);
      console.log('✅ [useBudgets] Budgets chargés:', budgetsData.length);
      
      setBudgets(budgetsData);
      
      // CALCUL STATISTIQUES
      const totalBudgets = budgetsData.length;
      const activeBudgets = budgetsData.filter(budget => budget.isActive).length;
      const totalSpent = budgetsData.reduce((sum, budget) => sum + budget.spent, 0);
      const totalBudget = budgetsData.reduce((sum, budget) => sum + budget.amount, 0);
      const averageUsage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

      setStats({
        totalBudgets,
        activeBudgets,
        totalSpent,
        totalBudget,
        averageUsage,
      });

      console.log('📊 [useBudgets] Statistiques mises à jour:', {
        totalBudgets,
        activeBudgets,
        totalSpent,
        totalBudget,
        averageUsage: averageUsage.toFixed(1) + '%'
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur chargement budgets';
      console.error('❌ [useBudgets] Erreur:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // ✅ CRÉATION AVEC RECALCUL AUTOMATIQUE
  const createBudget = async (budgetData: Omit<Budget, 'id' | 'createdAt' | 'spent'>): Promise<string> => {
    try {
      setError(null);
      console.log('🔄 [useBudgets] Création budget...', budgetData);
      
      const budgetId = await budgetService.createBudget(budgetData, userId);
      await loadBudgets();
      
      console.log('✅ [useBudgets] Budget créé avec succès:', budgetId);
      return budgetId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur création budget';
      console.error('❌ [useBudgets] Erreur création:', errorMessage);
      setError(errorMessage);
      throw err;
    }
  };

  // ✅ MISE À JOUR AVEC RECALCUL SI NÉCESSAIRE
  const updateBudget = async (id: string, updates: Partial<Budget>): Promise<void> => {
    try {
      setError(null);
      console.log('🔄 [useBudgets] Mise à jour budget:', id, updates);
      
      await budgetService.updateBudget(id, updates, userId);
      await loadBudgets();
      
      console.log('✅ [useBudgets] Budget mis à jour avec succès');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur mise à jour budget';
      console.error('❌ [useBudgets] Erreur mise à jour:', errorMessage);
      setError(errorMessage);
      throw err;
    }
  };

  // ✅ SUPPRESSION
  const deleteBudget = async (id: string): Promise<void> => {
    try {
      setError(null);
      console.log('🗑️ [useBudgets] Suppression budget:', id);
      
      await budgetService.deleteBudget(id, userId);
      await loadBudgets();
      
      console.log('✅ [useBudgets] Budget supprimé avec succès');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur suppression budget';
      console.error('❌ [useBudgets] Erreur suppression:', errorMessage);
      setError(errorMessage);
      throw err;
    }
  };

  // ✅ FORCER LE RECALCUL MANUEL
  const forceRecalculateBudgets = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      console.log('🔄 [useBudgets] Recalcul forcé de tous les budgets...');
      
      await budgetService.updateBudgetSpentFromTransactions(userId);
      await loadBudgets();
      
      console.log('✅ [useBudgets] Recalcul terminé avec succès');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur recalcul budgets';
      console.error('❌ [useBudgets] Erreur recalcul:', errorMessage);
      setError(errorMessage);
      throw err;
    }
  }, [userId, loadBudgets]);

  // ✅ RECALCUL D'UN BUDGET SPÉCIFIQUE
  const recalculateBudget = async (budgetId: string): Promise<void> => {
    try {
      setError(null);
      console.log('🔄 [useBudgets] Recalcul budget spécifique:', budgetId);
      
      await budgetService.recalculateBudget(budgetId, userId);
      await loadBudgets();
      
      console.log('✅ [useBudgets] Budget recalculé avec succès');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur recalcul budget';
      console.error('❌ [useBudgets] Erreur recalcul budget:', errorMessage);
      setError(errorMessage);
      throw err;
    }
  };

  // ✅ MÉTHODE POUR SYNCHRONISER AVEC LES TRANSACTIONS
  const updateBudgetsFromTransactions = useCallback(async (): Promise<void> => {
    try {
      console.log('🔄 [useBudgets] Mise à jour budgets depuis transactions...');
      await budgetService.updateBudgetSpentFromTransactions(userId);
      await loadBudgets();
      console.log('✅ [useBudgets] Budgets mis à jour depuis transactions');
    } catch (error) {
      console.error('❌ [useBudgets] Erreur mise à jour budgets depuis transactions:', error);
      throw error;
    }
  }, [userId, loadBudgets]);

  // ✅ OBTENIR LES CATÉGORIES DISPONIBLES POUR BUDGETS
  const getAvailableCategories = useCallback(async (): Promise<{id: string, name: string}[]> => {
    try {
      return await budgetService.getAvailableCategoriesForBudgets(userId);
    } catch (error) {
      console.error('❌ [useBudgets] Erreur récupération catégories:', error);
      return [];
    }
  }, [userId]);

  // ✅ VÉRIFIER SI UN BUDGET EXISTE POUR UNE CATÉGORIE
  const hasBudgetForCategory = useCallback(async (categoryNameOrId: string): Promise<boolean> => {
    try {
      return await budgetService.hasBudgetForCategory(categoryNameOrId, userId);
    } catch (error) {
      console.error('❌ [useBudgets] Erreur vérification budget catégorie:', error);
      return false;
    }
  }, [userId]);

  // ✅ MÉTHODES MANQUANTES AJOUTÉES
  const getBudgetsByCategory = useCallback(async (category: string): Promise<Budget[]> => {
    try {
      const allBudgets = await budgetService.getAllBudgets(userId);
      return allBudgets.filter(budget => budget.category === category);
    } catch (error) {
      console.error('❌ [useBudgets] Erreur budgets par catégorie:', error);
      return [];
    }
  }, [userId]);

  const getActiveBudgets = useCallback((): Budget[] => {
    return budgets.filter(budget => budget.isActive);
  }, [budgets]);

  const searchBudgets = useCallback(async (searchTerm: string): Promise<Budget[]> => {
    try {
      const allBudgets = await budgetService.getAllBudgets(userId);
      return allBudgets.filter(budget => 
        budget.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        budget.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (error) {
      console.error('❌ [useBudgets] Erreur recherche budgets:', error);
      return [];
    }
  }, [userId]);

  const getExpiringBudgets = useCallback(async (daysThreshold: number = 7): Promise<Budget[]> => {
    try {
      const allBudgets = await budgetService.getAllBudgets(userId);
      const now = new Date();
      const thresholdDate = new Date();
      thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);
      
      return allBudgets.filter(budget => {
        if (!budget.endDate || !budget.isActive) return false;
        const endDate = new Date(budget.endDate);
        return endDate <= thresholdDate && endDate >= now;
      });
    } catch (error) {
      console.error('❌ [useBudgets] Erreur budgets expirants:', error);
      return [];
    }
  }, [userId]);

  const toggleBudget = async (id: string, isActive: boolean): Promise<void> => {
    try {
      setError(null);
      console.log('🔄 [useBudgets] Activation/désactivation budget:', id, isActive);
      
      await budgetService.updateBudget(id, { isActive }, userId);
      await loadBudgets();
      
      console.log('✅ [useBudgets] Budget activé/désactivé avec succès');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur activation budget';
      console.error('❌ [useBudgets] Erreur activation:', errorMessage);
      setError(errorMessage);
      throw err;
    }
  };

  const updateSpentAmount = async (id: string, spent: number): Promise<void> => {
    try {
      setError(null);
      console.log('💰 [useBudgets] Mise à jour montant dépensé:', id, spent);
      
      await budgetService.updateBudget(id, { spent }, userId);
      await loadBudgets();
      
      console.log('✅ [useBudgets] Montant dépensé mis à jour avec succès');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur mise à jour dépenses';
      console.error('❌ [useBudgets] Erreur mise à jour dépenses:', errorMessage);
      setError(errorMessage);
      throw err;
    }
  };

  // ✅ ALERTES BUDGETS
  const checkBudgetAlerts = useCallback(async () => {
    const alerts = [];
    const now = new Date();
    
    for (const budget of budgets) {
      const usagePercentage = (budget.spent / budget.amount) * 100;
      
      // Alerte si budget dépassé à 90%
      if (usagePercentage >= 90 && budget.isActive) {
        alerts.push({
          type: 'budget_warning',
          budgetId: budget.id,
          budgetName: budget.name,
          message: `Budget "${budget.name}" utilisé à ${usagePercentage.toFixed(1)}%`,
          priority: usagePercentage >= 100 ? 'high' : 'medium'
        });
      }
      
      // Alerte si budget expire bientôt
      if (budget.endDate) {
        const endDate = new Date(budget.endDate);
        const daysUntilEnd = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysUntilEnd <= 7 && budget.isActive) {
          alerts.push({
            type: 'budget_expiring',
            budgetId: budget.id,
            budgetName: budget.name,
            message: `Budget "${budget.name}" expire dans ${daysUntilEnd} jour(s)`,
            priority: 'medium'
          });
        }
      }
    }
    
    return alerts;
  }, [budgets]);

  // EFFET : CHARGEMENT AUTOMATIQUE AU MONTAGE
  useEffect(() => {
    loadBudgets();
  }, [loadBudgets]);

  return {
    // État
    budgets,
    loading,
    error,
    stats,
    
    // Actions principales
    createBudget,
    updateBudget,
    deleteBudget,
    getBudgetById: (id: string) => budgetService.getBudgetById(id, userId),
    refreshBudgets: loadBudgets,
    
    // ✅ MÉTHODES CRITIQUES
    forceRecalculateBudgets,
    recalculateBudget,
    updateBudgetsFromTransactions,
    
    // ✅ MÉTHODES POUR CATÉGORIES
    getAvailableCategories,
    hasBudgetForCategory,
    
    // ✅ MÉTHODES AJOUTÉES (correction des erreurs TypeScript)
    getBudgetsByCategory,
    getActiveBudgets,
    searchBudgets,
    getExpiringBudgets,
    toggleBudget,
    updateSpentAmount,
    getBudgetStats: () => budgetService.getBudgetStats(userId),
    
    // ✅ ALERTES BUDGETS
    checkBudgetAlerts,
  };
};

export type UseBudgetsReturn = ReturnType<typeof useBudgets>;