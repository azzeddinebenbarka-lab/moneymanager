// src/hooks/useEncryption.ts - CORRIGÉ
import { useCallback, useState } from 'react';
import { EncryptionService } from '../services/storage/encryptionService';

export const useEncryption = () => {
  const [isLoading, setIsLoading] = useState(false);

  const encryptData = useCallback(async <T>(data: T): Promise<string> => {
    try {
      setIsLoading(true);
      const key = await EncryptionService.generateKey();
      const encrypted = await EncryptionService.encryptObject(data, key);
      return encrypted;
    } catch (error) {
      console.error('Encryption error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const decryptData = useCallback(async <T>(encryptedData: string, key: string): Promise<T> => {
    try {
      setIsLoading(true);
      const decrypted = await EncryptionService.decryptObject<T>(encryptedData, key);
      return decrypted;
    } catch (error) {
      console.error('Decryption error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateKey = useCallback(async (): Promise<string> => {
    try {
      setIsLoading(true);
      return await EncryptionService.generateKey();
    } catch (error) {
      console.error('Key generation error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // SUPPRIMER verifyIntegrity car non implémenté
  // const verifyIntegrity = useCallback(async (encryptedData: string, key: string): Promise<boolean> => {
  //   // Non implémenté pour l'instant
  //   return true;
  // }, []);

  return {
    isLoading,
    encryptData,
    decryptData,
    generateKey,
    // verifyIntegrity, // Supprimé
    clearError: () => {}, // Ajouté pour compatibilité
  };
};