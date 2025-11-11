// Remplacer le fichier par :
export interface AuthConfig {
  method: 'pin' | 'biometric' | 'both' | 'none';
  autoLock: boolean;
  autoLockTimeout: number;
  maxPinAttempts: number;
}

export interface BiometricConfig {
  promptMessage: string;
  fallbackLabel?: string;
  disableDeviceFallback?: boolean;
}

export interface PinValidationResult {
  success: boolean;
  remainingAttempts?: number;
  lockedUntil?: Date;
}

export interface BiometricAvailability {
  available: boolean;
  types: string[];
  hasHardware: boolean;
  isEnrolled: boolean;
}

export interface SecurityStatus {
  isConfigured: boolean;
  authMethod: 'pin' | 'biometric' | 'both' | 'none';
  biometricAvailable: boolean;
  pinConfigured: boolean;
  sessionActive: boolean;
}

export interface EncryptionResult {
  success: boolean;
  encryptedData?: string;
  key?: string;
  error?: string;
}

export interface SecuritySession {
  startTime: string;
  isActive: boolean;
  lastActivity: string;
}