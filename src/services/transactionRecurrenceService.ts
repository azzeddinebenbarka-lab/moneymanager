// src/services/transactionRecurrenceService.ts - Service de gestion des transactions récurrentes
import { Transaction } from '../types';
import { generateId } from '../utils/numberUtils';
import { getDatabase } from './database/sqlite';
import { transactionService } from './transactionService';

export const transactionRecurrenceService = {
  // ✅ CALCULER LA PROCHAINE DATE SELON LA FRÉQUENCE
  calculateNextDate(currentDate: string, frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'): string {
    const date = new Date(currentDate);
    
    switch (frequency) {
      case 'daily':
        date.setDate(date.getDate() + 1);
        break;
      case 'weekly':
        date.setDate(date.getDate() + 7);
        break;
      case 'monthly':
        date.setMonth(date.getMonth() + 1);
        break;
      case 'yearly':
        date.setFullYear(date.getFullYear() + 1);
        break;
    }
    
    return date.toISOString().split('T')[0];
  },

  // ✅ GÉNÉRER LA PROCHAINE OCCURRENCE D'UNE TRANSACTION RÉCURRENTE
  async generateNextOccurrence(
    parentTransaction: Transaction,
    userId: string = 'default-user'
  ): Promise<string | null> {
    try {
      if (!parentTransaction.isRecurring || !parentTransaction.recurrenceType) {
        console.log('ℹ️ Transaction non récurrente');
        return null;
      }

      const db = await getDatabase();
      const nextDate = this.calculateNextDate(
        parentTransaction.date,
        parentTransaction.recurrenceType as 'daily' | 'weekly' | 'monthly' | 'yearly'
      );

      // Vérifier si une date de fin est définie et dépassée
      if (parentTransaction.recurrenceEndDate) {
        const endDate = new Date(parentTransaction.recurrenceEndDate);
        const nextDateObj = new Date(nextDate);
        
        if (nextDateObj > endDate) {
          console.log('ℹ️ Date de fin de récurrence atteinte');
          return null;
        }
      }

      // Vérifier si l'occurrence existe déjà (vérification très stricte)
      const existingTransaction = await db.getFirstAsync(
        `SELECT id FROM transactions 
         WHERE user_id = ? 
         AND description = ? 
         AND date = ? 
         AND amount = ?
         AND category = ?
         AND account_id = ?
         AND type = ?
         AND parent_transaction_id = ?`,
        [
          userId,
          parentTransaction.description,
          nextDate,
          parentTransaction.amount,
          parentTransaction.category,
          parentTransaction.accountId,
          parentTransaction.type,
          parentTransaction.id
        ]
      );

      if (existingTransaction) {
        console.log(`ℹ️ Occurrence déjà existante pour le ${nextDate}`);
        return null;
      }

      // Créer la nouvelle occurrence
      const newTransactionId = generateId();
      const createdAt = new Date().toISOString();

      await db.runAsync(
        `INSERT INTO transactions (
          id, user_id, amount, type, category, sub_category, account_id, description,
          date, created_at, is_recurring, recurrence_type, recurrence_end_date,
          parent_transaction_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          newTransactionId,
          userId,
          parentTransaction.amount,
          parentTransaction.type,
          parentTransaction.category,
          (parentTransaction as any).subCategory || null,
          parentTransaction.accountId,
          parentTransaction.description,
          nextDate,
          createdAt,
          0, // is_recurring = 0 pour les occurrences
          null, // recurrence_type null pour les occurrences
          null, // recurrence_end_date null pour les occurrences
          parentTransaction.id // parent_transaction_id
        ]
      );

      // Mettre à jour le solde du compte
      const accountUpdateAmount = parentTransaction.amount;
      await db.runAsync(
        `UPDATE accounts SET balance = balance + ? WHERE id = ?`,
        [accountUpdateAmount, parentTransaction.accountId]
      );

      console.log(`✅ Occurrence créée: ${parentTransaction.description} pour ${nextDate}`);
      return newTransactionId;
    } catch (error) {
      console.error('❌ Erreur génération occurrence transaction:', error);
      throw error;
    }
  },

  // ✅ TRAITER TOUTES LES TRANSACTIONS RÉCURRENTES
  async processRecurringTransactions(userId: string = 'default-user'): Promise<{ processed: number; errors: string[] }> {
    try {
      const db = await getDatabase();
      const today = new Date().toISOString().split('T')[0];
      
      // Récupérer toutes les transactions récurrentes actives
      const recurringTransactions = await db.getAllAsync(
        `SELECT * FROM transactions 
         WHERE user_id = ? 
         AND is_recurring = 1 
         AND recurrence_type IS NOT NULL
         AND (recurrence_end_date IS NULL OR recurrence_end_date >= ?)`,
        [userId, today]
      ) as any[];

      console.log(`🔄 Traitement de ${recurringTransactions.length} transactions récurrentes`);

      const results = {
        processed: 0,
        errors: [] as string[]
      };

      for (const dbTransaction of recurringTransactions) {
        try {
          const transaction: Transaction = {
            id: dbTransaction.id,
            userId: dbTransaction.user_id,
            amount: dbTransaction.amount,
            type: dbTransaction.type,
            category: dbTransaction.category,
            accountId: dbTransaction.account_id,
            description: dbTransaction.description,
            date: dbTransaction.date,
            createdAt: dbTransaction.created_at,
            isRecurring: Boolean(dbTransaction.is_recurring),
            recurrenceType: dbTransaction.recurrence_type,
            recurrenceEndDate: dbTransaction.recurrence_end_date
          };

          // ✅ Trouver la dernière occurrence créée pour cette transaction parent
          const lastOccurrence = await db.getFirstAsync<any>(
            `SELECT date FROM transactions 
             WHERE parent_transaction_id = ? 
             ORDER BY date DESC LIMIT 1`,
            [transaction.id]
          );

          // Calculer la prochaine date attendue à partir de la dernière occurrence ou de la date parent
          const baseDate = lastOccurrence ? lastOccurrence.date : transaction.date;
          const nextExpectedDate = this.calculateNextDate(
            baseDate,
            transaction.recurrenceType as 'daily' | 'weekly' | 'monthly' | 'yearly'
          );

          // Si la prochaine date est aujourd'hui ou dans le passé, générer l'occurrence
          if (nextExpectedDate <= today) {
            const newId = await this.generateNextOccurrence(transaction, userId);
            if (newId) {
              results.processed++;
            }
          }
        } catch (error) {
          const errorMessage = `Erreur avec ${dbTransaction.description}: ${error}`;
          console.error('❌', errorMessage);
          results.errors.push(errorMessage);
        }
      }

      console.log(`✅ Traitement terminé: ${results.processed} occurrences créées`);
      return results;
    } catch (error) {
      console.error('❌ Erreur traitement transactions récurrentes:', error);
      throw error;
    }
  },

  // ✅ OBTENIR LES STATISTIQUES DES RÉCURRENCES
  async getRecurrenceStats(userId: string = 'default-user'): Promise<{
    total: number;
    daily: number;
    weekly: number;
    monthly: number;
    yearly: number;
  }> {
    try {
      const db = await getDatabase();
      
      const stats = await db.getFirstAsync<any>(
        `SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN recurrence_type = 'daily' THEN 1 ELSE 0 END) as daily,
          SUM(CASE WHEN recurrence_type = 'weekly' THEN 1 ELSE 0 END) as weekly,
          SUM(CASE WHEN recurrence_type = 'monthly' THEN 1 ELSE 0 END) as monthly,
          SUM(CASE WHEN recurrence_type = 'yearly' THEN 1 ELSE 0 END) as yearly
         FROM transactions 
         WHERE user_id = ? AND is_recurring = 1`,
        [userId]
      );

      return {
        total: stats?.total || 0,
        daily: stats?.daily || 0,
        weekly: stats?.weekly || 0,
        monthly: stats?.monthly || 0,
        yearly: stats?.yearly || 0
      };
    } catch (error) {
      console.error('❌ Erreur récupération stats récurrence:', error);
      return { total: 0, daily: 0, weekly: 0, monthly: 0, yearly: 0 };
    }
  },

  // ✅ DÉSACTIVER UNE RÉCURRENCE
  async disableRecurrence(transactionId: string, userId: string = 'default-user'): Promise<void> {
    try {
      const db = await getDatabase();
      
      await db.runAsync(
        `UPDATE transactions 
         SET is_recurring = 0, recurrence_type = NULL, recurrence_end_date = NULL 
         WHERE id = ? AND user_id = ?`,
        [transactionId, userId]
      );

      console.log(`✅ Récurrence désactivée pour transaction ${transactionId}`);
    } catch (error) {
      console.error('❌ Erreur désactivation récurrence:', error);
      throw error;
    }
  },

  // ✅ OBTENIR TOUTES LES OCCURRENCES D'UNE TRANSACTION PARENT
  async getTransactionOccurrences(parentId: string, userId: string = 'default-user'): Promise<Transaction[]> {
    try {
      const db = await getDatabase();
      
      const occurrences = await db.getAllAsync(
        `SELECT * FROM transactions 
         WHERE user_id = ? 
         AND parent_transaction_id = ?
         ORDER BY date DESC`,
        [userId, parentId]
      ) as any[];

      return occurrences.map((dbTx: any) => ({
        id: dbTx.id,
        userId: dbTx.user_id,
        amount: dbTx.amount,
        type: dbTx.type,
        category: dbTx.category,
        accountId: dbTx.account_id,
        description: dbTx.description,
        date: dbTx.date,
        createdAt: dbTx.created_at,
        isRecurring: Boolean(dbTx.is_recurring),
        recurrenceType: dbTx.recurrence_type,
        recurrenceEndDate: dbTx.recurrence_end_date,
        parentTransactionId: dbTx.parent_transaction_id
      }));
    } catch (error) {
      console.error('❌ Erreur récupération occurrences:', error);
      return [];
    }
  }
};

export default transactionRecurrenceService;
