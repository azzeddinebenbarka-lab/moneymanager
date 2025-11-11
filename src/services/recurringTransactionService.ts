// src/services/recurringTransactionService.ts - VERSION COMPLÈTEMENT CORRIGÉE
import { RecurringTransaction } from '../types';
import { getDatabase } from './database/sqlite';
import { transactionService } from './transactionService';

interface DatabaseRecurringTransaction {
  id: string;
  user_id: string;
  description: string;
  amount: number;
  type: string;
  category: string;
  account_id: string;
  frequency: string;
  start_date: string;
  end_date: string | null;
  last_processed: string | null;
  is_active: number;
  created_at: string;
}

export const recurringTransactionService = {
  // ✅ CRÉATION AVEC VALIDATION DU COMPTE
  createRecurringTransaction: async (
    transaction: Omit<RecurringTransaction, 'id' | 'createdAt'>
  ): Promise<string> => {
    const db = await getDatabase();
    
    try {
      await checkAndRepairRecurringTransactionsTable();

      // ✅ VÉRIFIER QUE LE COMPTE EXISTE
      const accountExists = await db.getFirstAsync(
        'SELECT 1 FROM accounts WHERE id = ?',
        [transaction.accountId]
      );

      if (!accountExists) {
        throw new Error(`Le compte avec l'ID ${transaction.accountId} n'existe pas`);
      }

      const id = `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const createdAt = new Date().toISOString();

      console.log('🔧 [recurringTransactionService] Creating recurring transaction:', {
        id,
        description: transaction.description,
        amount: transaction.amount,
        type: transaction.type,
        accountId: transaction.accountId,
        frequency: transaction.frequency
      });

      await db.runAsync(
        `INSERT INTO recurring_transactions (
          id, user_id, description, amount, type, category, account_id, 
          frequency, start_date, end_date, last_processed, is_active, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          transaction.userId || 'default-user',
          transaction.description,
          transaction.amount,
          transaction.type,
          transaction.category,
          transaction.accountId,
          transaction.frequency,
          transaction.startDate,
          transaction.endDate || null,
          transaction.lastProcessed || null,
          transaction.isActive ? 1 : 0,
          createdAt
        ]
      );

      console.log('✅ [recurringTransactionService] Recurring transaction created successfully');
      return id;
      
    } catch (error) {
      console.error('❌ [recurringTransactionService] Error creating recurring transaction:', error);
      
      if (error instanceof Error && (
        error.message.includes('no such table') ||
        error.message.includes('FOREIGN KEY constraint failed')
      )) {
        console.log('🛠️ [recurringTransactionService] Table or foreign key issue detected, repairing...');
        await repairRecurringTransactionsTable();
        return await recurringTransactionService.createRecurringTransaction(transaction);
      }
      
      throw new Error(`Impossible de créer la transaction récurrente: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  },

  // ✅ RÉCUPÉRATION TOUTES LES TRANSACTIONS
  getAllRecurringTransactions: async (userId: string = 'default-user'): Promise<RecurringTransaction[]> => {
    try {
      const db = await getDatabase();
      
      await checkAndRepairRecurringTransactionsTable();
      
      console.log('🔧 [recurringTransactionService] Fetching all recurring transactions...');
      
      const result = await db.getAllAsync(
        `SELECT * FROM recurring_transactions WHERE user_id = ? ORDER BY created_at DESC`,
        [userId]
      ) as DatabaseRecurringTransaction[];
      
      console.log('✅ [recurringTransactionService] Found', result.length, 'recurring transactions');
      
      const transactions: RecurringTransaction[] = result.map((item) => ({
        id: item.id,
        userId: item.user_id,
        description: item.description,
        amount: Number(item.amount),
        type: item.type as 'income' | 'expense',
        category: item.category,
        accountId: item.account_id,
        frequency: item.frequency as 'daily' | 'weekly' | 'monthly' | 'yearly',
        startDate: item.start_date,
        endDate: item.end_date || undefined,
        lastProcessed: item.last_processed || undefined,
        isActive: Boolean(item.is_active),
        createdAt: item.created_at,
      }));
      
      return transactions;
    } catch (error) {
      console.error('❌ [recurringTransactionService] Error getting recurring transactions:', error);
      
      if (error instanceof Error && error.message.includes('no such table')) {
        await repairRecurringTransactionsTable();
        return [];
      }
      
      throw error;
    }
  },

  // ✅ RÉCUPÉRATION PAR ID
  getRecurringTransactionById: async (id: string, userId: string = 'default-user'): Promise<RecurringTransaction | null> => {
    try {
      const db = await getDatabase();
      
      await checkAndRepairRecurringTransactionsTable();
      
      const result = await db.getFirstAsync(
        `SELECT * FROM recurring_transactions WHERE id = ? AND user_id = ?`,
        [id, userId]
      ) as DatabaseRecurringTransaction | null;
      
      if (result) {
        const transaction: RecurringTransaction = {
          id: result.id,
          userId: result.user_id,
          description: result.description,
          amount: Number(result.amount),
          type: result.type as 'income' | 'expense',
          category: result.category,
          accountId: result.account_id,
          frequency: result.frequency as 'daily' | 'weekly' | 'monthly' | 'yearly',
          startDate: result.start_date,
          endDate: result.end_date || undefined,
          lastProcessed: result.last_processed || undefined,
          isActive: Boolean(result.is_active),
          createdAt: result.created_at,
        };
        return transaction;
      }
      return null;
    } catch (error) {
      console.error('❌ [recurringTransactionService] Error getting recurring transaction by ID:', error);
      
      if (error instanceof Error && error.message.includes('no such table')) {
        await repairRecurringTransactionsTable();
        return null;
      }
      
      throw error;
    }
  },

  // ✅ MISE À JOUR
  updateRecurringTransaction: async (
    id: string, 
    updates: Partial<Omit<RecurringTransaction, 'id' | 'createdAt'>>,
    userId: string = 'default-user'
  ): Promise<void> => {
    const db = await getDatabase();
    
    await checkAndRepairRecurringTransactionsTable();
    
    try {
      // ✅ VALIDATION DU COMPTE SI MIS À JOUR
      if (updates.accountId) {
        const accountExists = await db.getFirstAsync(
          'SELECT 1 FROM accounts WHERE id = ?',
          [updates.accountId]
        );

        if (!accountExists) {
          throw new Error(`Le compte avec l'ID ${updates.accountId} n'existe pas`);
        }
      }

      const updateFields: string[] = [];
      const values: any[] = [];

      if (updates.description !== undefined) {
        updateFields.push('description = ?');
        values.push(updates.description);
      }
      if (updates.amount !== undefined) {
        updateFields.push('amount = ?');
        values.push(updates.amount);
      }
      if (updates.type !== undefined) {
        updateFields.push('type = ?');
        values.push(updates.type);
      }
      if (updates.category !== undefined) {
        updateFields.push('category = ?');
        values.push(updates.category);
      }
      if (updates.accountId !== undefined) {
        updateFields.push('account_id = ?');
        values.push(updates.accountId);
      }
      if (updates.frequency !== undefined) {
        updateFields.push('frequency = ?');
        values.push(updates.frequency);
      }
      if (updates.startDate !== undefined) {
        updateFields.push('start_date = ?');
        values.push(updates.startDate);
      }
      if (updates.endDate !== undefined) {
        updateFields.push('end_date = ?');
        values.push(updates.endDate);
      }
      if (updates.lastProcessed !== undefined) {
        updateFields.push('last_processed = ?');
        values.push(updates.lastProcessed);
      }
      if (updates.isActive !== undefined) {
        updateFields.push('is_active = ?');
        values.push(updates.isActive ? 1 : 0);
      }

      if (updateFields.length === 0) {
        console.log('⚠️ [recurringTransactionService] No updates provided');
        return;
      }

      values.push(id, userId);

      await db.runAsync(
        `UPDATE recurring_transactions SET ${updateFields.join(', ')} WHERE id = ? AND user_id = ?`,
        values
      );
      
      console.log('✅ [recurringTransactionService] Recurring transaction updated successfully:', id);
    } catch (error) {
      console.error('❌ [recurringTransactionService] Error updating recurring transaction:', error);
      throw error;
    }
  },

  // ✅ SUPPRESSION
  deleteRecurringTransaction: async (id: string, userId: string = 'default-user'): Promise<void> => {
    const db = await getDatabase();
    
    await checkAndRepairRecurringTransactionsTable();
    
    try {
      await db.runAsync(`DELETE FROM recurring_transactions WHERE id = ? AND user_id = ?`, [id, userId]);
      console.log('✅ [recurringTransactionService] Recurring transaction deleted successfully:', id);
    } catch (error) {
      console.error('❌ [recurringTransactionService] Error deleting recurring transaction:', error);
      throw error;
    }
  },

  // ✅ ACTIVATION/DÉSACTIVATION
  toggleRecurringTransaction: async (id: string, isActive: boolean, userId: string = 'default-user'): Promise<void> => {
    try {
      await recurringTransactionService.updateRecurringTransaction(id, { isActive }, userId);
      console.log('✅ [recurringTransactionService] Recurring transaction toggled:', { id, isActive });
    } catch (error) {
      console.error('❌ [recurringTransactionService] Error toggling recurring transaction:', error);
      throw error;
    }
  },

  // ✅ TRAITEMENT DES TRANSACTIONS RÉCURRENTES
  processRecurringTransactions: async (userId: string = 'default-user'): Promise<{ processed: number; errors: string[] }> => {
    try {
      const db = await getDatabase();
      
      await checkAndRepairRecurringTransactionsTable();
      
      const today = new Date().toISOString().split('T')[0];
      console.log('🔧 [recurringTransactionService] Processing recurring transactions for:', today);
      
      const recurringTransactions = await recurringTransactionService.getAllRecurringTransactions(userId);
      const activeTransactions = recurringTransactions.filter(transaction => 
        transaction.isActive && 
        (!transaction.endDate || transaction.endDate >= today) &&
        transaction.startDate <= today
      );

      console.log(`🔧 [recurringTransactionService] Found ${activeTransactions.length} active recurring transactions`);

      let processedCount = 0;
      const errors: string[] = [];

      for (const transaction of activeTransactions) {
        try {
          const shouldProcess = await shouldProcessTransaction(transaction, today);
          
          if (shouldProcess) {
            // ✅ UTILISER LE SERVICE DE TRANSACTION POUR LA CRÉATION
            await transactionService.createTransaction({
              amount: transaction.amount,
              type: transaction.type,
              category: transaction.category,
              accountId: transaction.accountId,
              description: `[Récurrente] ${transaction.description}`,
              date: today,
            }, userId);

            await recurringTransactionService.updateRecurringTransaction(transaction.id, {
              lastProcessed: today
            }, userId);

            processedCount++;
            console.log(`✅ [recurringTransactionService] Processed recurring transaction: ${transaction.description}`);
          }
        } catch (error) {
          const errorMessage = `Erreur avec la transaction ${transaction.description}: ${error}`;
          console.error(`❌ [recurringTransactionService] ${errorMessage}`);
          errors.push(errorMessage);
        }
      }

      console.log(`✅ [recurringTransactionService] Successfully processed ${processedCount} recurring transactions`);
      
      return { processed: processedCount, errors };
      
    } catch (error) {
      console.error('❌ [recurringTransactionService] Error processing recurring transactions:', error);
      throw error;
    }
  },

  // ✅ STATISTIQUES
  getRecurringTransactionStats: async (userId: string = 'default-user'): Promise<{
    total: number;
    active: number;
    inactive: number;
    byFrequency: Record<string, number>;
    totalAmount: number;
  }> => {
    try {
      const db = await getDatabase();
      
      await checkAndRepairRecurringTransactionsTable();
      
      const totalResult = await db.getFirstAsync(
        `SELECT COUNT(*) as count FROM recurring_transactions WHERE user_id = ?`,
        [userId]
      ) as { count: number };
      const total = Number(totalResult?.count) || 0;
      
      const activeResult = await db.getFirstAsync(
        `SELECT COUNT(*) as count FROM recurring_transactions WHERE is_active = 1 AND user_id = ?`,
        [userId]
      ) as { count: number };
      const active = Number(activeResult?.count) || 0;
      
      const amountResult = await db.getFirstAsync(
        `SELECT SUM(amount) as total FROM recurring_transactions WHERE user_id = ?`,
        [userId]
      ) as { total: number };
      const totalAmount = Number(amountResult?.total) || 0;
      
      const frequencyResult = await db.getAllAsync(
        `SELECT frequency, COUNT(*) as count FROM recurring_transactions WHERE user_id = ? GROUP BY frequency`,
        [userId]
      ) as { frequency: string; count: number }[];
      
      const byFrequency: Record<string, number> = {};
      frequencyResult.forEach(item => {
        byFrequency[item.frequency] = Number(item.count);
      });
      
      console.log('🔧 [recurringTransactionService] Recurring transaction stats:', {
        total,
        active,
        inactive: total - active,
        totalAmount,
        byFrequency
      });
      
      return {
        total,
        active,
        inactive: total - active,
        byFrequency,
        totalAmount
      };
    } catch (error) {
      console.error('❌ [recurringTransactionService] Error getting recurring transaction stats:', error);
      
      if (error instanceof Error && error.message.includes('no such table')) {
        await repairRecurringTransactionsTable();
        return {
          total: 0,
          active: 0,
          inactive: 0,
          byFrequency: {},
          totalAmount: 0
        };
      }
      
      throw error;
    }
  },

  // ✅ VÉRIFICATION DE L'INTÉGRITÉ DES DONNÉES
  checkDataIntegrity: async (userId: string = 'default-user'): Promise<{
    valid: number;
    invalid: number;
    missingAccounts: string[];
  }> => {
    try {
      const db = await getDatabase();
      
      const recurringTransactions = await recurringTransactionService.getAllRecurringTransactions(userId);
      let valid = 0;
      let invalid = 0;
      const missingAccounts: string[] = [];

      for (const transaction of recurringTransactions) {
        const accountExists = await db.getFirstAsync(
          'SELECT 1 FROM accounts WHERE id = ?',
          [transaction.accountId]
        );

        if (accountExists) {
          valid++;
        } else {
          invalid++;
          missingAccounts.push(transaction.accountId);
        }
      }

      return { valid, invalid, missingAccounts };
    } catch (error) {
      console.error('❌ [recurringTransactionService] Error checking data integrity:', error);
      return { valid: 0, invalid: 0, missingAccounts: [] };
    }
  },

  // ✅ RÉPARATION DES DONNÉES CORROMPUES
  repairDataIntegrity: async (userId: string = 'default-user'): Promise<{ repaired: number; errors: string[] }> => {
    try {
      const db = await getDatabase();
      const integrity = await recurringTransactionService.checkDataIntegrity(userId);
      let repaired = 0;
      const errors: string[] = [];

      for (const missingAccountId of integrity.missingAccounts) {
        try {
          // Supprimer les transactions avec des comptes manquants
          await db.runAsync(
            'DELETE FROM recurring_transactions WHERE account_id = ? AND user_id = ?',
            [missingAccountId, userId]
          );
          repaired++;
        } catch (error) {
          errors.push(`Erreur suppression transaction compte ${missingAccountId}: ${error}`);
        }
      }

      return { repaired, errors };
    } catch (error) {
      console.error('❌ [recurringTransactionService] Error repairing data integrity:', error);
      return { repaired: 0, errors: [error instanceof Error ? error.message : 'Erreur inconnue'] };
    }
  }
};

// ✅ FONCTION POUR DÉTERMINER SI UNE TRANSACTION DOIT ÊTRE TRAITÉE
const shouldProcessTransaction = async (transaction: RecurringTransaction, today: string): Promise<boolean> => {
  if (!transaction.lastProcessed) {
    return transaction.startDate <= today;
  }

  const lastProcessed = new Date(transaction.lastProcessed);
  const currentDate = new Date(today);

  switch (transaction.frequency) {
    case 'daily':
      const oneDayMs = 24 * 60 * 60 * 1000;
      return currentDate.getTime() - lastProcessed.getTime() >= oneDayMs;

    case 'weekly':
      const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
      return currentDate.getTime() - lastProcessed.getTime() >= oneWeekMs;

    case 'monthly':
      const nextMonth = new Date(lastProcessed);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      return currentDate >= nextMonth;

    case 'yearly':
      const nextYear = new Date(lastProcessed);
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      return currentDate >= nextYear;

    default:
      return false;
  }
};

// ✅ VÉRIFICATION ET RÉPARATION DE LA TABLE
const checkAndRepairRecurringTransactionsTable = async (): Promise<void> => {
  try {
    const db = await getDatabase();
    
    const tableExists = await db.getFirstAsync(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='recurring_transactions'"
    );
    
    if (!tableExists) {
      console.log('🛠️ [recurringTransactionService] Recurring transactions table does not exist, creating...');
      await repairRecurringTransactionsTable();
      return;
    }
    
    // Vérifier la structure de la table
    const tableInfo = await db.getAllAsync(`PRAGMA table_info(recurring_transactions)`) as any[];
    const requiredColumns = [
      'id', 'user_id', 'description', 'amount', 'type', 'category', 
      'account_id', 'frequency', 'start_date', 'end_date', 'last_processed', 
      'is_active', 'created_at'
    ];
    
    const missingColumns = requiredColumns.filter(col => 
      !tableInfo.some(column => column.name === col)
    );
    
    if (missingColumns.length > 0) {
      console.log('🛠️ [recurringTransactionService] Missing columns detected:', missingColumns);
      await repairRecurringTransactionsTable();
    }
    
  } catch (error) {
    console.error('❌ [recurringTransactionService] Error checking table structure:', error);
    await repairRecurringTransactionsTable();
  }
};

// ✅ RÉPARATION COMPLÈTE DE LA TABLE
const repairRecurringTransactionsTable = async (): Promise<void> => {
  try {
    const db = await getDatabase();
    console.log('🛠️ [recurringTransactionService] Repairing recurring transactions table...');
    
    // Sauvegarder les données existantes
    let existingData: DatabaseRecurringTransaction[] = [];
    try {
      existingData = await db.getAllAsync(`SELECT * FROM recurring_transactions`) as DatabaseRecurringTransaction[];
      console.log(`🔧 [recurringTransactionService] Backing up ${existingData.length} recurring transactions`);
    } catch (error) {
      console.log('🔧 [recurringTransactionService] No existing data to backup');
    }
    
    // Supprimer et recréer la table
    await db.execAsync('DROP TABLE IF EXISTS recurring_transactions');
    
    await db.execAsync(`
      CREATE TABLE recurring_transactions (
        id TEXT PRIMARY KEY NOT NULL,
        user_id TEXT NOT NULL DEFAULT 'default-user',
        description TEXT NOT NULL,
        amount REAL NOT NULL,
        type TEXT NOT NULL,
        category TEXT NOT NULL,
        account_id TEXT NOT NULL,
        frequency TEXT NOT NULL,
        start_date TEXT NOT NULL,
        end_date TEXT,
        last_processed TEXT,
        is_active INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('✅ [recurringTransactionService] Recurring transactions table recreated');
    
    // Réinsérer les données sauvegardées
    if (existingData.length > 0) {
      let restoredCount = 0;
      for (const transaction of existingData) {
        try {
          // Vérifier que le compte existe avant de réinsérer
          const accountExists = await db.getFirstAsync(
            'SELECT 1 FROM accounts WHERE id = ?',
            [transaction.account_id]
          );

          if (accountExists) {
            await db.runAsync(
              `INSERT INTO recurring_transactions (
                id, user_id, description, amount, type, category, account_id, 
                frequency, start_date, end_date, last_processed, is_active, created_at
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                transaction.id,
                transaction.user_id,
                transaction.description,
                transaction.amount,
                transaction.type,
                transaction.category,
                transaction.account_id,
                transaction.frequency,
                transaction.start_date,
                transaction.end_date,
                transaction.last_processed,
                transaction.is_active,
                transaction.created_at
              ]
            );
            restoredCount++;
          } else {
            console.warn(`⚠️ [recurringTransactionService] Skipping transaction ${transaction.id} - account ${transaction.account_id} not found`);
          }
        } catch (insertError) {
          console.warn('⚠️ [recurringTransactionService] Could not restore recurring transaction:', transaction.id);
        }
      }
      console.log(`✅ [recurringTransactionService] Restored ${restoredCount}/${existingData.length} recurring transactions`);
    }
    
  } catch (error) {
    console.error('❌ [recurringTransactionService] Error repairing recurring transactions table:', error);
    throw error;
  }
};

export default recurringTransactionService;