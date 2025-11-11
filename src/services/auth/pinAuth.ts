// src/services/auth/pinAuth.ts
import { EncryptionService } from '../storage/encryptionService';
import { secureStorage } from '../storage/secureStorage';

export class PinAuth {
  private static readonly PIN_KEY = 'user_pin_encrypted';
  private static readonly PIN_ATTEMPTS_KEY = 'pin_attempts';
  private static readonly PIN_LOCKED_UNTIL_KEY = 'pin_locked_until';
  private static readonly MAX_ATTEMPTS = 5;
  private static readonly LOCK_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * Définit le code PIN de l'utilisateur
   */
  static async setPin(pin: string): Promise<void> {
    try {
      // Vérifier que le PIN a au moins 4 chiffres 
      if (pin.length < 4) {
        throw new Error('Le code PIN doit contenir au moins 4 chiffres');
      }

      // Générer une clé de chiffrement pour le PIN
      const encryptionKey = await EncryptionService.generateKey();
      
      // Chiffrer le PIN
      const encryptedPin = await EncryptionService.encrypt(pin, encryptionKey);
      
      // Stocker le PIN chiffré et la clé séparément
      await secureStorage.setItem(this.PIN_KEY, encryptedPin);
      await secureStorage.setItem('pin_encryption_key', encryptionKey);
      
      // Réinitialiser les tentatives
      await this.resetAttempts();
    } catch (error) {
      console.error('Error setting PIN:', error);
      throw error;
    }
  }

  /**
   * Vérifie le code PIN
   */
  static async verifyPin(pin: string): Promise<{
    success: boolean;
    remainingAttempts?: number;
    lockedUntil?: Date;
  }> {
    try {
      // Vérifier si le PIN est verrouillé
      const lockedUntil = await this.isPinLocked();
      if (lockedUntil) {
        return {
          success: false,
          lockedUntil,
        };
      }

      // Récupérer le PIN chiffré et la clé
      const encryptedPin = await secureStorage.getItem(this.PIN_KEY);
      const encryptionKey = await secureStorage.getItem('pin_encryption_key');

      if (!encryptedPin || !encryptionKey) {
        throw new Error('Aucun code PIN configuré');
      }

      // Déchiffrer et vérifier le PIN
      const storedPin = await EncryptionService.decrypt(encryptedPin, encryptionKey);
      const isValid = pin === storedPin;

      if (isValid) {
        await this.resetAttempts();
        return { success: true };
      } else {
        const remainingAttempts = await this.recordFailedAttempt();
        return {
          success: false,
          remainingAttempts,
        };
      }
    } catch (error) {
      console.error('Error verifying PIN:', error);
      await this.recordFailedAttempt();
      const remainingAttempts = await this.getRemainingAttempts();
      return {
        success: false,
        remainingAttempts,
      };
    }
  }

  /**
   * Vérifie si un PIN est configuré
   */
  static async hasPin(): Promise<boolean> {
    try {
      const encryptedPin = await secureStorage.getItem(this.PIN_KEY);
      const encryptionKey = await secureStorage.getItem('pin_encryption_key');
      return !!(encryptedPin && encryptionKey);
    } catch (error) {
      console.error('Error checking PIN existence:', error);
      return false;
    }
  }

  /**
   * Supprime le code PIN
   */
  static async clearPin(): Promise<void> {
    try {
      await secureStorage.deleteItem(this.PIN_KEY);
      await secureStorage.deleteItem('pin_encryption_key');
      await this.resetAttempts();
    } catch (error) {
      console.error('Error clearing PIN:', error);
      throw error;
    }
  }

  /**
   * Enregistre une tentative échouée
   */
  private static async recordFailedAttempt(): Promise<number> {
    try {
      const attemptsStr = await secureStorage.getItem(this.PIN_ATTEMPTS_KEY);
      let attempts = attemptsStr ? parseInt(attemptsStr, 10) : 0;
      attempts++;

      await secureStorage.setItem(this.PIN_ATTEMPTS_KEY, attempts.toString());

      // Verrouiller si trop de tentatives
      if (attempts >= this.MAX_ATTEMPTS) {
        const lockUntil = new Date(Date.now() + this.LOCK_DURATION);
        await secureStorage.setItem(this.PIN_LOCKED_UNTIL_KEY, lockUntil.toISOString());
      }

      return Math.max(0, this.MAX_ATTEMPTS - attempts);
    } catch (error) {
      console.error('Error recording failed attempt:', error);
      return this.MAX_ATTEMPTS - 1;
    }
  }

  /**
   * Réinitialise les tentatives
   */
  private static async resetAttempts(): Promise<void> {
    try {
      await secureStorage.deleteItem(this.PIN_ATTEMPTS_KEY);
      await secureStorage.deleteItem(this.PIN_LOCKED_UNTIL_KEY);
    } catch (error) {
      console.error('Error resetting attempts:', error);
    }
  }

  /**
   * Vérifie si le PIN est verrouillé
   */
  private static async isPinLocked(): Promise<Date | null> {
    try {
      const lockedUntilStr = await secureStorage.getItem(this.PIN_LOCKED_UNTIL_KEY);
      if (!lockedUntilStr) return null;

      const lockedUntil = new Date(lockedUntilStr);
      if (lockedUntil > new Date()) {
        return lockedUntil;
      }

      // Déverrouiller si la période est écoulée
      await this.resetAttempts();
      return null;
    } catch (error) {
      console.error('Error checking PIN lock:', error);
      return null;
    }
  }

  /**
   * Obtient le nombre de tentatives restantes
   */
  private static async getRemainingAttempts(): Promise<number> {
    try {
      const attemptsStr = await secureStorage.getItem(this.PIN_ATTEMPTS_KEY);
      const attempts = attemptsStr ? parseInt(attemptsStr, 10) : 0;
      return Math.max(0, this.MAX_ATTEMPTS - attempts);
    } catch (error) {
      console.error('Error getting remaining attempts:', error);
      return this.MAX_ATTEMPTS;
    }
  }

  /**
   * Obtient le statut de verrouillage
   */
  static async getLockStatus(): Promise<{
    isLocked: boolean;
    lockedUntil?: Date;
    remainingAttempts: number;
  }> {
    const lockedUntil = await this.isPinLocked();
    const remainingAttempts = await this.getRemainingAttempts();

    return {
      isLocked: !!lockedUntil,
      lockedUntil: lockedUntil || undefined,
      remainingAttempts,
    };
  }
}