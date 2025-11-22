// src/hooks/usePushNotifications.ts
import { useEffect, useState } from 'react';
import { pushNotificationService } from '../services/PushNotificationService';

/**
 * Hook pour gérer les notifications push
 */
export const usePushNotifications = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializePushNotifications();

    return () => {
      pushNotificationService.cleanup();
    };
  }, []);

  const initializePushNotifications = async () => {
    try {
      await pushNotificationService.initialize();
      setIsInitialized(true);
      setHasPermission(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur initialisation notifications';
      setError(errorMessage);
      // Erreur silencieuse - les notifications push ne sont pas critiques en dev
    }
  };

  return {
    isInitialized,
    hasPermission,
    error,
    pushService: pushNotificationService,
  };
};

export default usePushNotifications;
