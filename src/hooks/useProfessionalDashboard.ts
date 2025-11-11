import { useCallback, useEffect, useState } from 'react';
import { ProfessionalDashboardData, ProfessionalFilters } from '../types/ProfessionalDashboard';
import { professionalDashboardService } from '../services/analytics/ProfessionalDashboardService';

export const useProfessionalDashboard = (userId: string = 'default-user') => {
  const [data, setData] = useState<ProfessionalDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Filtres par défaut (mois courant)
  const [filters, setFilters] = useState<ProfessionalFilters>({
    annee: new Date().getFullYear(),
    mois: new Date().getMonth() + 1,
    inclurePrevisions: true,
    modeCalcul: 'realiste'
  });

  // ✅ CHARGEMENT DES DONNÉES
  const chargerDonnees = useCallback(async (): Promise<void> => {
    if (refreshing) return;
    
    setLoading(true);
    setError(null);

    try {
      console.log('🔄 [useProfessionalDashboard] Chargement données professionnelles...');
      
      const resultat = await professionalDashboardService.calculerDashboardProfessionnel(filters);
      setData(resultat);
      
      console.log('✅ [useProfessionalDashboard] Données professionnelles chargées');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(message);
      console.error('❌ [useProfessionalDashboard] Erreur chargement:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filters, refreshing]);

  // ✅ RECHARGEMENT MANUEL
  const recharger = useCallback(async (): Promise<void> => {
    setRefreshing(true);
    await chargerDonnees();
  }, [chargerDonnees]);

  // ✅ MISE À JOUR DES FILTRES
  const mettreAJourFiltres = useCallback((nouveauxFiltres: Partial<ProfessionalFilters>): void => {
    setFilters(prev => ({ ...prev, ...nouveauxFiltres }));
  }, []);

  // ✅ RÉINITIALISATION DES FILTRES
  const reinitialiserFiltres = useCallback((): void => {
    setFilters({
      annee: new Date().getFullYear(),
      mois: new Date().getMonth() + 1,
      inclurePrevisions: true,
      modeCalcul: 'realiste'
    });
  }, []);

  // ✅ CHARGEMENT AUTOMATIQUE AU MONTAGE ET QUAND LES FILTRES CHANGENT
  useEffect(() => {
    chargerDonnees();
  }, [chargerDonnees]);

  // ✅ CALCULS DÉRIVÉS POUR FACILITER L'UTILISATION
  const indicateursUrgence = data?.indicateurs.santeFinanciere === 'CRITIQUE' || 
                            data?.indicateurs.santeFinanciere === 'ATTENTION';

  const tendancePositive = data?.cashFlow.cashFlowNet && data.cashFlow.cashFlowNet > 0;

  // ✅ RETURN DU HOOK
  return {
    // Données principales
    data,
    
    // État
    loading,
    error,
    refreshing,
    
    // Filtres
    filters,
    mettreAJourFiltres,
    reinitialiserFiltres,
    
    // Actions
    recharger,
    
    // Calculs dérivés
    indicateursUrgence,
    tendancePositive,
    
    // Utilitaires
    hasData: data !== null,
    isEmpty: data === null,
    
    // Accès direct aux sous-sections (pour faciliter l'utilisation)
    cashFlow: data?.cashFlow,
    patrimoine: data?.patrimoine,
    budgetCharges: data?.budgetCharges,
    indicateurs: data?.indicateurs,
    periode: data?.periode
  };
};

export type UseProfessionalDashboardReturn = ReturnType<typeof useProfessionalDashboard>;