// src/services/alertService.ts - VERSION COMPLÈTEMENT CORRIGÉE
import { Alert } from '../types';
import { getDatabase } from './database/sqlite';

export interface AlertPreferences {
  budgetAlerts: boolean;
  spendingAlerts: boolean;
  weeklyReports: boolean;
  pushNotifications: boolean;
  emailNotifications: boolean;
}

interface Budget {
  id: string;
  name: string;
  amount: number;
  spent: number;
  category: string;
  category_name?: string;
  is_active: number;
  user_id: string;
}

interface Transaction {
  id: string;
  amount: number;
  category: string;
  category_name: string;
  date: string;
  type: string;
  user_id: string;
}

interface UserPreferences {
  budget_alerts: number;
  monthly_reports: number;
  push_notifications: number;
  user_id: string;
}

export const alertService = {
  // ✅ CORRECTION : Méthode getAlertCounts ajoutée
  async getAlertCounts(userId: string): Promise<{
    total: number;
    unread: number;
    critical: number;
  }> {
    try {
      const stats = await this.getAlertStats(userId);
      return {
        total: stats.total,
        unread: stats.unread,
        critical: stats.critical
      };
    } catch (error) {
      console.error('Error in getAlertCounts:', error);
      return { total: 0, unread: 0, critical: 0 };
    }
  },

  async createAlert(userId: string, alertData: Omit<Alert, 'id' | 'createdAt'>): Promise<string> {
    try {
      const db = await getDatabase();
      const alertId = `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await db.runAsync(
        `INSERT INTO alerts (id, user_id, type, title, message, priority, is_read, data, action_url, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
        [
          alertId,
          userId,
          alertData.type,
          alertData.title,
          alertData.message,
          alertData.priority,
          alertData.isRead ? 1 : 0,
          alertData.data ? JSON.stringify(alertData.data) : null,
          alertData.actionUrl || null
        ]
      );
      
      return alertId;
    } catch (error) {
      console.error('Erreur lors de la création de l\'alerte:', error);
      throw error;
    }
  },

  async getAlerts(userId: string, options?: { unreadOnly?: boolean }): Promise<Alert[]> {
    try {
      const db = await getDatabase();
      let query = `SELECT * FROM alerts WHERE user_id = ?`;
      const params: any[] = [userId];
      
      if (options?.unreadOnly) {
        query += ' AND is_read = 0';
      }
      
      query += ' ORDER BY created_at DESC';
      
      const alerts = await db.getAllAsync(query, params);
      
      return alerts.map((item: any) => ({
        id: item.id,
        type: item.type,
        title: item.title,
        message: item.message,
        priority: item.priority as 'critical' | 'high' | 'medium' | 'low',
        isRead: item.is_read === 1,
        data: item.data ? JSON.parse(item.data) : undefined,
        actionUrl: item.action_url || undefined,
        createdAt: item.created_at
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des alertes:', error);
      return [];
    }
  },

  async markAsRead(alertId: string): Promise<void> {
    try {
      const db = await getDatabase();
      await db.runAsync(
        'UPDATE alerts SET is_read = 1 WHERE id = ?',
        [alertId]
      );
    } catch (error) {
      console.error("Erreur lors du marquage de l'alerte comme lue:", error);
      throw error;
    }
  },

  async markAllAsRead(userId: string): Promise<void> {
    try {
      const db = await getDatabase();
      await db.runAsync(
        'UPDATE alerts SET is_read = 1 WHERE user_id = ? AND is_read = 0',
        [userId]
      );
    } catch (error) {
      console.error("Erreur lors du marquage de toutes les alertes comme lues:", error);
      throw error;
    }
  },

  async deleteAlert(alertId: string): Promise<void> {
    try {
      const db = await getDatabase();
      await db.runAsync('DELETE FROM alerts WHERE id = ?', [alertId]);
    } catch (error) {
      console.error("Erreur lors de la suppression de l'alerte:", error);
      throw error;
    }
  },

  async deleteReadAlerts(userId: string): Promise<void> {
    try {
      const db = await getDatabase();
      await db.runAsync(
        'DELETE FROM alerts WHERE user_id = ? AND is_read = 1',
        [userId]
      );
    } catch (error) {
      console.error('Erreur lors de la suppression des alertes lues:', error);
      throw error;
    }
  },

  async getAlertStats(userId: string): Promise<{
    total: number;
    unread: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  }> {
    try {
      const db = await getDatabase();
      
      const totalResult = await db.getFirstAsync<{ count: number }>(
        'SELECT COUNT(*) as count FROM alerts WHERE user_id = ?',
        [userId]
      );
      
      const unreadResult = await db.getFirstAsync<{ count: number }>(
        'SELECT COUNT(*) as count FROM alerts WHERE user_id = ? AND is_read = 0',
        [userId]
      );
      
      const criticalResult = await db.getFirstAsync<{ count: number }>(
        'SELECT COUNT(*) as count FROM alerts WHERE user_id = ? AND priority = ?',
        [userId, 'critical']
      );
      
      const highResult = await db.getFirstAsync<{ count: number }>(
        'SELECT COUNT(*) as count FROM alerts WHERE user_id = ? AND priority = ?',
        [userId, 'high']
      );
      
      const mediumResult = await db.getFirstAsync<{ count: number }>(
        'SELECT COUNT(*) as count FROM alerts WHERE user_id = ? AND priority = ?',
        [userId, 'medium']
      );
      
      const lowResult = await db.getFirstAsync<{ count: number }>(
        'SELECT COUNT(*) as count FROM alerts WHERE user_id = ? AND priority = ?',
        [userId, 'low']
      );
      
      return {
        total: totalResult?.count || 0,
        unread: unreadResult?.count || 0,
        critical: criticalResult?.count || 0,
        high: highResult?.count || 0,
        medium: mediumResult?.count || 0,
        low: lowResult?.count || 0
      };
    } catch (error) {
      console.error('Erreur lors du calcul des statistiques des alertes:', error);
      return {
        total: 0,
        unread: 0,
        critical: 0,
        high: 0,
        medium: 0,
        low: 0
      };
    }
  },

  async checkBudgetAlerts(userId: string): Promise<Alert[]> {
    try {
      const alerts: Alert[] = [];
      const db = await getDatabase();
      
      const exceededBudgets = await db.getAllAsync<Budget & { category_name: string }>(`
        SELECT b.*, c.name as category_name 
        FROM budgets b 
        LEFT JOIN categories c ON b.category = c.id 
        WHERE b.user_id = ? AND b.is_active = 1 AND b.spent > b.amount
      `, [userId]);
      
      for (const budget of exceededBudgets) {
        const exceededAmount = budget.spent - budget.amount;
        const alertId = await this.createAlert(userId, {
          type: 'budget_exceeded',
          title: 'Budget dépassé',
          message: `Le budget "${budget.name}" (${budget.category_name}) a été dépassé de ${exceededAmount.toFixed(2)}€`,
          priority: 'high',
          isRead: false,
          data: { budgetId: budget.id, category: budget.category }
        });
        
        alerts.push({
          id: alertId,
          type: 'budget_exceeded',
          title: 'Budget dépassé',
          message: `Le budget "${budget.name}" (${budget.category_name}) a été dépassé de ${exceededAmount.toFixed(2)}€`,
          priority: 'high',
          isRead: false,
          data: { budgetId: budget.id, category: budget.category },
          createdAt: new Date().toISOString()
        });
      }
      
      const nearLimitBudgets = await db.getAllAsync<Budget & { category_name: string }>(`
        SELECT b.*, c.name as category_name 
        FROM budgets b 
        LEFT JOIN categories c ON b.category = c.id 
        WHERE b.user_id = ? AND b.is_active = 1 AND b.spent >= b.amount * 0.9 AND b.spent < b.amount
      `, [userId]);
      
      for (const budget of nearLimitBudgets) {
        const percentage = (budget.spent / budget.amount) * 100;
        const alertId = await this.createAlert(userId, {
          type: 'budget_warning',
          title: 'Budget presque épuisé',
          message: `Le budget "${budget.name}" (${budget.category_name}) est utilisé à ${percentage.toFixed(1)}%`,
          priority: 'medium',
          isRead: false,
          data: { budgetId: budget.id, category: budget.category, percentage }
        });
        
        alerts.push({
          id: alertId,
          type: 'budget_warning',
          title: 'Budget presque épuisé',
          message: `Le budget "${budget.name}" (${budget.category_name}) est utilisé à ${percentage.toFixed(1)}%`,
          priority: 'medium',
          isRead: false,
          data: { budgetId: budget.id, category: budget.category, percentage },
          createdAt: new Date().toISOString()
        });
      }
      
      return alerts;
    } catch (error) {
      console.error('Erreur lors de la vérification des alertes de budget:', error);
      return [];
    }
  },

  async getAlertPreferences(userId: string): Promise<AlertPreferences> {
    try {
      const db = await getDatabase();
      const prefs = await db.getFirstAsync<UserPreferences>(`
        SELECT * FROM user_preferences WHERE user_id = ?
      `, [userId]);
      
      if (prefs) {
        return {
          budgetAlerts: prefs.budget_alerts === 1,
          spendingAlerts: prefs.budget_alerts === 1,
          weeklyReports: prefs.monthly_reports === 1,
          pushNotifications: prefs.push_notifications === 1,
          emailNotifications: false
        };
      }
      
      return {
        budgetAlerts: true,
        spendingAlerts: true,
        weeklyReports: true,
        pushNotifications: true,
        emailNotifications: false
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des préférences:', error);
      return {
        budgetAlerts: true,
        spendingAlerts: true,
        weeklyReports: true,
        pushNotifications: true,
        emailNotifications: false
      };
    }
  },

  async updateAlertPreferences(userId: string, preferences: Partial<AlertPreferences>): Promise<void> {
    try {
      const db = await getDatabase();
      
      const existing = await db.getFirstAsync(
        'SELECT 1 FROM user_preferences WHERE user_id = ?',
        [userId]
      );
      
      if (existing) {
        await db.runAsync(`
          UPDATE user_preferences SET 
            budget_alerts = ?,
            monthly_reports = ?,
            push_notifications = ?
          WHERE user_id = ?
        `, [
          preferences.budgetAlerts ? 1 : 0,
          preferences.weeklyReports ? 1 : 0,
          preferences.pushNotifications ? 1 : 0,
          userId
        ]);
      } else {
        await db.runAsync(`
          INSERT INTO user_preferences (user_id, budget_alerts, monthly_reports, push_notifications)
          VALUES (?, ?, ?, ?)
        `, [
          userId,
          preferences.budgetAlerts ? 1 : 0,
          preferences.weeklyReports ? 1 : 0,
          preferences.pushNotifications ? 1 : 0
        ]);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des préférences:', error);
      throw error;
    }
  },

  async checkSpendingAlerts(userId: string): Promise<Alert[]> {
    try {
      const alerts: Alert[] = [];
      const db = await getDatabase();
      
      const unusualSpending = await db.getAllAsync<Transaction & { avg_amount: number }>(`
        WITH category_avg AS (
          SELECT 
            category,
            AVG(amount) as avg_amount,
            COUNT(*) as transaction_count
          FROM transactions 
          WHERE user_id = ? AND type = 'expense' AND date >= date('now', '-30 days')
          GROUP BY category
        )
        SELECT t.*, c.name as category_name, ca.avg_amount
        FROM transactions t
        LEFT JOIN categories c ON t.category = c.id
        LEFT JOIN category_avg ca ON t.category = ca.category
        WHERE t.user_id = ? AND t.type = 'expense' AND t.date >= date('now', '-7 days')
        AND t.amount > ca.avg_amount * 1.5 AND ca.transaction_count >= 3
      `, [userId, userId]);
      
      for (const transaction of unusualSpending) {
        const alertId = await this.createAlert(userId, {
          type: 'unusual_spending',
          title: 'Dépense inhabituelle',
          message: `Dépense inhabituelle de ${Math.abs(transaction.amount).toFixed(2)}€ dans ${transaction.category_name}`,
          priority: 'medium',
          isRead: false,
          data: { 
            transactionId: transaction.id, 
            category: transaction.category,
            amount: transaction.amount 
          }
        });
        
        alerts.push({
          id: alertId,
          type: 'unusual_spending',
          title: 'Dépense inhabituelle',
          message: `Dépense inhabituelle de ${Math.abs(transaction.amount).toFixed(2)}€ dans ${transaction.category_name}`,
          priority: 'medium',
          isRead: false,
          data: { 
            transactionId: transaction.id, 
            category: transaction.category,
            amount: transaction.amount 
          },
          createdAt: new Date().toISOString()
        });
      }
      
      return alerts;
    } catch (error) {
      console.error('Erreur lors de la vérification des alertes de dépenses:', error);
      return [];
    }
  },

  async cleanupOldAlerts(userId: string, daysToKeep: number = 30): Promise<void> {
    try {
      const db = await getDatabase();
      await db.runAsync(
        'DELETE FROM alerts WHERE user_id = ? AND created_at < datetime("now", ?)',
        [userId, `-${daysToKeep} days`]
      );
    } catch (error) {
      console.error('Erreur lors du nettoyage des anciennes alertes:', error);
      throw error;
    }
  },

  async checkAllAlerts(userId: string): Promise<Alert[]> {
    try {
      const allAlerts: Alert[] = [];
      
      const budgetAlerts = await this.checkBudgetAlerts(userId);
      allAlerts.push(...budgetAlerts);
      
      const spendingAlerts = await this.checkSpendingAlerts(userId);
      allAlerts.push(...spendingAlerts);
      
      return allAlerts;
    } catch (error) {
      console.error('Erreur lors de la vérification de toutes les alertes:', error);
      return [];
    }
  }
};

export default alertService;