// src/services/database/unifiedMigration.ts - SERVICE DE MIGRATION UNIFIÉE
import { getDatabase } from './sqlite';

export interface MigrationResult {
  success: boolean;
  migratedTransactions: number;
  migratedRecurring: number;
  errors: string[];
}

export const unifiedMigrationService = {
  // Migrer les transactions récurrentes vers le système unifié
  async migrateRecurringToUnified(): Promise<MigrationResult> {
    const db = await getDatabase();
    const result: MigrationResult = {
      success: true,
      migratedTransactions: 0,
      migratedRecurring: 0,
      errors: []
    };

    try {
      console.log('🔄 [unifiedMigration] Starting migration of recurring transactions...');

      // 1. Vérifier si la table recurring_transactions existe
      const recurringTableExists = await db.getFirstAsync(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='recurring_transactions'"
      );

      if (!recurringTableExists) {
        console.log('ℹ️ [unifiedMigration] No recurring transactions table found, skipping migration');
        return result;
      }

      // 2. Récupérer toutes les transactions récurrentes
      const recurringTransactions = await db.getAllAsync(
        `SELECT * FROM recurring_transactions WHERE is_active = 1`
      ) as any[];

      console.log(`🔍 [unifiedMigration] Found ${recurringTransactions.length} recurring transactions to migrate`);

      // 3. Pour chaque transaction récurrente, créer une transaction normale avec un flag de récurrence
      for (const recurringTx of recurringTransactions) {
        try {
          // Vérifier si une transaction similaire existe déjà
          const existingTransaction = await db.getFirstAsync(
            `SELECT * FROM transactions WHERE description = ? AND amount = ? AND type = ?`,
            [recurringTx.description, recurringTx.amount, recurringTx.type]
          );

          if (!existingTransaction) {
            // Créer une nouvelle transaction avec les données de récurrence
            const transactionId = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            
            await db.runAsync(
              `INSERT INTO transactions (id, user_id, amount, type, category, account_id, description, date, created_at, is_recurring, recurrence_pattern, recurrence_start_date, recurrence_end_date) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                transactionId,
                recurringTx.user_id || 'default-user',
                recurringTx.amount,
                recurringTx.type,
                recurringTx.category,
                recurringTx.account_id,
                recurringTx.description,
                recurringTx.start_date || new Date().toISOString(),
                recurringTx.created_at || new Date().toISOString(),
                1, // is_recurring
                recurringTx.frequency || 'monthly',
                recurringTx.start_date,
                recurringTx.end_date
              ]
            );

            result.migratedTransactions++;
          }

          // Marquer la transaction récurrente comme migrée
          await db.runAsync(
            `UPDATE recurring_transactions SET is_active = 0, migrated_at = ? WHERE id = ?`,
            [new Date().toISOString(), recurringTx.id]
          );

          result.migratedRecurring++;

        } catch (error) {
          const errorMsg = `Error migrating recurring transaction ${recurringTx.id}: ${error instanceof Error ? error.message : 'Unknown error'}`;
          result.errors.push(errorMsg);
          console.error(`❌ [unifiedMigration] ${errorMsg}`);
        }
      }

      console.log(`✅ [unifiedMigration] Migration completed: ${result.migratedTransactions} transactions created, ${result.migratedRecurring} recurring transactions migrated`);

      if (result.errors.length > 0) {
        result.success = false;
        console.warn(`⚠️ [unifiedMigration] Migration completed with ${result.errors.length} errors`);
      }

      return result;

    } catch (error) {
      const errorMsg = `Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      result.errors.push(errorMsg);
      result.success = false;
      console.error(`❌ [unifiedMigration] ${errorMsg}`);
      return result;
    }
  },

  // Vérifier l'état de la migration
  async getMigrationStatus(): Promise<{
    hasRecurringTable: boolean;
    pendingRecurring: number;
    migratedCount: number;
    needsMigration: boolean;
  }> {
    const db = await getDatabase();

    try {
      // Vérifier si la table recurring_transactions existe
      const recurringTableExists = await db.getFirstAsync(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='recurring_transactions'"
      );

      if (!recurringTableExists) {
        return {
          hasRecurringTable: false,
          pendingRecurring: 0,
          migratedCount: 0,
          needsMigration: false
        };
      }

      // Compter les transactions récurrentes actives
      const pendingResult = await db.getFirstAsync(
        `SELECT COUNT(*) as count FROM recurring_transactions WHERE is_active = 1`
      ) as { count: number } | null;

      const pendingRecurring = pendingResult?.count || 0;

      // Compter les transactions migrées
      const migratedResult = await db.getFirstAsync(
        `SELECT COUNT(*) as count FROM recurring_transactions WHERE is_active = 0 AND migrated_at IS NOT NULL`
      ) as { count: number } | null;

      const migratedCount = migratedResult?.count || 0;

      return {
        hasRecurringTable: true,
        pendingRecurring,
        migratedCount,
        needsMigration: pendingRecurring > 0
      };

    } catch (error) {
      console.error('❌ [unifiedMigration] Error getting migration status:', error);
      return {
        hasRecurringTable: false,
        pendingRecurring: 0,
        migratedCount: 0,
        needsMigration: false
      };
    }
  },

  // Annuler la migration (en cas de problème)
  async rollbackMigration(): Promise<{ success: boolean; rolledBack: number; errors: string[] }> {
    const db = await getDatabase();
    const result = {
      success: true,
      rolledBack: 0,
      errors: [] as string[]
    };

    try {
      console.log('🔄 [unifiedMigration] Starting migration rollback...');

      // Réactiver les transactions récurrentes
      await db.runAsync(
        `UPDATE recurring_transactions SET is_active = 1, migrated_at = NULL WHERE migrated_at IS NOT NULL`
      );

      // Supprimer les transactions créées pendant la migration
      const deleteResult = await db.runAsync(
        `DELETE FROM transactions WHERE is_recurring = 1 AND created_at > datetime('now', '-1 hour')`
      );

      result.rolledBack = deleteResult.changes || 0;

      console.log(`✅ [unifiedMigration] Rollback completed: ${result.rolledBack} transactions removed`);

      return result;

    } catch (error) {
      const errorMsg = `Rollback failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      result.errors.push(errorMsg);
      result.success = false;
      console.error(`❌ [unifiedMigration] ${errorMsg}`);
      return result;
    }
  }
};

export default unifiedMigrationService;