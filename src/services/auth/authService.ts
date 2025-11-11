// src/services/auth/authService.ts - VERSION CORRIGÉE
import * as Crypto from 'expo-crypto';
import { getDatabase } from '../database/sqlite'; // ✅ IMPORT CORRIGÉ
import { LoginCredentials, RegisterData, User } from '../../types/User';

export const authService = {
  register: async (userData: RegisterData): Promise<string> => {
    try {
      const db = await getDatabase();
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const createdAt = new Date().toISOString();
      
      const passwordHash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        userData.password
      ); 

      await db.runAsync(
        `INSERT INTO users (id, email, password_hash, first_name, last_name, currency, language, created_at, last_login, is_active) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          userData.email.toLowerCase(),
          passwordHash,
          userData.firstName,
          userData.lastName,
          userData.currency || 'EUR',
          'fr',
          createdAt,
          createdAt,
          1
        ]
      );

      await db.runAsync(
        `INSERT INTO user_preferences (user_id, theme, biometric_auth, monthly_reports, budget_alerts, push_notifications) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, 'light', 0, 1, 1, 1]
      );

      return userId;
    } catch (error) {
      console.error('❌ [authService] Error in register:', error);
      throw error;
    }
  },

  login: async (credentials: LoginCredentials): Promise<User | null> => {
    try {
      const db = await getDatabase();
      const passwordHash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        credentials.password
      );

      const result = await db.getFirstAsync(
        `SELECT * FROM users WHERE email = ? AND password_hash = ? AND is_active = 1`,
        [credentials.email.toLowerCase(), passwordHash]
      ) as any;

      if (result) {
        const lastLogin = new Date().toISOString();
        await db.runAsync(
          `UPDATE users SET last_login = ? WHERE id = ?`,
          [lastLogin, result.id]
        );

        const user: User = {
          id: result.id,
          email: result.email,
          firstName: result.first_name,
          lastName: result.last_name,
          currency: result.currency,
          language: result.language,
          createdAt: result.created_at,
          lastLogin: lastLogin,
          isActive: result.is_active === 1
        };

        return user;
      }

      return null;
    } catch (error) {
      console.error('❌ [authService] Error in login:', error);
      throw error;
    }
  },

  getUserById: async (userId: string): Promise<User | null> => {
    try {
      const db = await getDatabase();
      const result = await db.getFirstAsync(
        `SELECT * FROM users WHERE id = ? AND is_active = 1`,
        [userId]
      ) as any;

      if (result) {
        const user: User = {
          id: result.id,
          email: result.email,
          firstName: result.first_name,
          lastName: result.last_name,
          currency: result.currency,
          language: result.language,
          createdAt: result.created_at,
          lastLogin: result.last_login,
          isActive: result.is_active === 1
        };
        return user;
      }

      return null;
    } catch (error) {
      console.error('❌ [authService] Error in getUserById:', error);
      throw error;
    }
  },

  updateProfile: async (userId: string, updates: Partial<User>): Promise<void> => {
    try {
      const db = await getDatabase();
      const fields = Object.keys(updates);
      
      if (fields.length === 0) return;

      const setClause = fields.map(field => {
        const dbField = field === 'firstName' ? 'first_name' :
                       field === 'lastName' ? 'last_name' :
                       field === 'lastLogin' ? 'last_login' : field;
        return `${dbField} = ?`;
      }).join(', ');

      const values = fields.map(field => (updates as any)[field]);
      values.push(userId);

      await db.runAsync(
        `UPDATE users SET ${setClause} WHERE id = ?`,
        values
      );
    } catch (error) {
      console.error('❌ [authService] Error in updateProfile:', error);
      throw error;
    }
  },

  deactivateAccount: async (userId: string): Promise<void> => {
    try {
      const db = await getDatabase();
      await db.runAsync(
        `UPDATE users SET is_active = 0 WHERE id = ?`,
        [userId]
      );
    } catch (error) {
      console.error('❌ [authService] Error in deactivateAccount:', error);
      throw error;
    }
  },

  checkEmailExists: async (email: string): Promise<boolean> => {
    try {
      const db = await getDatabase();
      const result = await db.getFirstAsync(
        `SELECT 1 FROM users WHERE email = ?`,
        [email.toLowerCase()]
      );
      return !!result;
    } catch (error) {
      console.error('❌ [authService] Error in checkEmailExists:', error);
      throw error;
    }
  }
};