// src/hooks/useAutoRefresh.ts - VERSION COMPLÈTEMENT CORRIGÉE
import { useCallback, useEffect, useRef } from 'react';

export const useAutoRefresh = (
  refreshFunction: () => Promise<void> | void, 
  interval = 30000,
  dependencies: any[] = []
) => {
  const intervalRef = useRef<number | null>(null);
  const savedRefreshFunction = useRef(refreshFunction);

  // Mettre à jour la référence de la fonction
  useEffect(() => {
    savedRefreshFunction.current = refreshFunction;
  }, [refreshFunction]);

  const refresh = useCallback(async () => {
    try {
      console.log('🔄 Auto-refresh en cours...');
      await savedRefreshFunction.current();
      console.log('✅ Auto-refresh terminé');
    } catch (error) {
      console.error('❌ Erreur auto-refresh:', error);
    }
  }, []);

  useEffect(() => {
    // Rafraîchir immédiatement au montage
    refresh();

    // Configurer le rafraîchissement automatique avec le bon type
    intervalRef.current = setInterval(refresh, interval) as unknown as number;

    // Nettoyer à la désactivation
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [interval, refresh, ...dependencies]);

  // Fonction pour forcer un rafraîchissement manuel
  const forceRefresh = useCallback(() => {
    console.log('🔄 Forcer le rafraîchissement manuel');
    return refresh();
  }, [refresh]);

  return { forceRefresh };
};