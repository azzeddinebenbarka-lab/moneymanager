// src/services/auth/biometricAuth.ts
import * as LocalAuthentication from 'expo-local-authentication';
import { secureStorage } from '../storage/secureStorage';

export interface BiometricConfig {
  promptMessage: string;
  fallbackLabel?: string;
  disableDeviceFallback?: boolean;
}

export class BiometricAuth {
  private static defaultConfig: BiometricConfig = {
    promptMessage: 'Authentifiez-vous pour accéder à MoneyManager',
    fallbackLabel: 'Utiliser le code PIN',
    disableDeviceFallback: false,
  }; 

  /**
   * Vérifie si l'authentification biométrique est disponible
   */
  static async isAvailable(): Promise<{
    available: boolean;
    types: LocalAuthentication.AuthenticationType[];
    hasHardware: boolean;
    isEnrolled: boolean;
  }> {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();

      return {
        available: hasHardware && isEnrolled,
        types: supportedTypes,
        hasHardware,
        isEnrolled,
      };
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      return {
        available: false,
        types: [],
        hasHardware: false,
        isEnrolled: false,
      };
    }
  }

  /**
   * Authentifie l'utilisateur avec la biométrie
   */
  static async authenticate(config?: Partial<BiometricConfig>): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const authConfig = { ...this.defaultConfig, ...config };
      const { available } = await this.isAvailable();

      if (!available) {
        return {
          success: false,
          error: 'Authentification biométrique non disponible sur cet appareil',
        };
      }

      const result = await LocalAuthentication.authenticateAsync(authConfig);

      return {
        success: result.success,
        error: result.success ? undefined : result.error || 'Authentification échouée',
      };
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return {
        success: false,
        error: 'Erreur lors de l\'authentification biométrique',
      };
    }
  }

  /**
   * Sauvegarde la préférence biométrique de l'utilisateur
   */
  static async saveBiometricPreference(enabled: boolean): Promise<void> {
    try {
      await secureStorage.setItem('biometric_enabled', enabled.toString());
    } catch (error) {
      console.error('Error saving biometric preference:', error);
      throw error;
    }
  }

  /**
   * Récupère la préférence biométrique de l'utilisateur
   */
  static async getBiometricPreference(): Promise<boolean> {
    try {
      const enabled = await secureStorage.getItem('biometric_enabled');
      return enabled === 'true';
    } catch (error) {
      console.error('Error getting biometric preference:', error);
      return false;
    }
  }

  /**
   * Obtient le nom du type de biométrie disponible
   */
  static getBiometricTypeName(types: LocalAuthentication.AuthenticationType[]): string {
    if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      return 'Reconnaissance faciale';
    }
    if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      return 'Empreinte digitale';
    }
    if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
      return 'Reconnaissance de l\'iris';
    }
    return 'Authentification biométrique';
  }
}