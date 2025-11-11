// src/services/auth/userService.ts - VERSION CORRIGÉE
import { getDatabase } from '../database/sqlite'; // ✅ IMPORT CORRIGÉ
import { User } from '../../types/User';

export const userService = {
  async getUserById(userId: string): Promise<User | null> {
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
      console.error('❌ [userService] Error in getUserById:', error);
      throw error;
    }
  },

  async updateUserPreferences(userId: string, preferences: any): Promise<void> {
    try {
      const db = await getDatabase();
      
      const fields = Object.keys(preferences);
      if (fields.length === 0) return;

      const setClause = fields.map(field => `${field} = ?`).join(', ');
      const values = fields.map(field => preferences[field]);
      values.push(userId);

      await db.runAsync(
        `UPDATE user_preferences SET ${setClause} WHERE user_id = ?`,
        values
      );
    } catch (error) {
      console.error('❌ [userService] Error in updateUserPreferences:', error);
      throw error;
    }
  },

  async getUserPreferences(userId: string): Promise<any> {
    try {
      const db = await getDatabase();
      const result = await db.getFirstAsync(
        `SELECT * FROM user_preferences WHERE user_id = ?`,
        [userId]
      ) as any;

      if (result) {
        return {
          theme: result.theme,
          biometricAuth: result.biometric_auth === 1,
          monthlyReports: result.monthly_reports === 1,
          budgetAlerts: result.budget_alerts === 1,
          pushNotifications: result.push_notifications === 1
        };
      }

      return {
        theme: 'light',
        biometricAuth: false,
        monthlyReports: true,
        budgetAlerts: true,
        pushNotifications: true
      };
    } catch (error) {
      console.error('❌ [userService] Error in getUserPreferences:', error);
      throw error;
    }
  }
};