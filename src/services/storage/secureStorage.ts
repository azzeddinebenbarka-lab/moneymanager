// src/services/storage/secureStorage.ts - VERSION CORRIGÉE
import * as SecureStore from 'expo-secure-store';

export const secureStorage = {
  async setItem(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error('Error storing secure data:', error);
      throw error;
    }
  }, 

  async getItem(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error('Error retrieving secure data:', error);
      return null;
    }
  },

  async deleteItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('Error deleting secure data:', error);
      throw error;
    }
  },

  // ✅ AJOUTÉ : Méthode removeItem pour compatibilité
  async removeItem(key: string): Promise<void> {
    await this.deleteItem(key);
  }
};