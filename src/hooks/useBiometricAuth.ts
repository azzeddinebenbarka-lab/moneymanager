// hooks/useBiometricAuth.ts
import * as LocalAuthentication from 'expo-local-authentication';
import { useCallback, useState } from 'react';

export interface BiometricAuthResult {
  success: boolean;
  error?: string;
}

export const useBiometricAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState<LocalAuthentication.AuthenticationType[]>([]);

  // Vérifier la disponibilité de l'authentification biométrique
  const checkBiometricAvailability = useCallback(async (): Promise<boolean> => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();

      setBiometricAvailable(hasHardware && isEnrolled);
      setBiometricType(supportedTypes);

      return hasHardware && isEnrolled;
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      return false;
    }
  }, []);

  // Authentifier avec biométrie
  const authenticate = useCallback(async (): Promise<BiometricAuthResult> => {
    try {
      setIsLoading(true);

      const isAvailable = await checkBiometricAvailability();
      if (!isAvailable) {
        return {
          success: false,
          error: 'Authentification biométrique non disponible'
        };
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authentifiez-vous pour accéder à MoneyManager',
        fallbackLabel: 'Utiliser le code PIN',
        disableDeviceFallback: false,
      });

      return {
        success: result.success,
        error: result.success ? undefined : 'Authentification échouée'
      };
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return {
        success: false,
        error: 'Erreur lors de l\'authentification'
      };
    } finally {
      setIsLoading(false);
    }
  }, [checkBiometricAvailability]);

  // Obtenir le type de biométrie disponible
  const getBiometricTypeName = useCallback((): string => {
    if (biometricType.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      return 'Reconnaissance faciale';
    }
    if (biometricType.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      return 'Empreinte digitale';
    }
    return 'Biométrie';
  }, [biometricType]);

  return {
    isLoading,
    biometricAvailable,
    biometricType: getBiometricTypeName(),
    authenticate,
    checkBiometricAvailability,
  };
};