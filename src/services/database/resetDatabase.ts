// src/services/database/resetDatabase.ts - VERSION COMPLÈTE
import { getDatabase, initDatabase } from './sqlite';

export const forceResetDatabase = async (): Promise<void> => {
  try {
    const db = await getDatabase();
    
    console.log('🛠️ [RESET] Starting forced database reset...');
    
    // Désactiver les foreign keys temporairement
    await db.execAsync('PRAGMA foreign_keys = OFF');
    
    // Supprimer toutes les tables dans l'ordre inverse des dépendances
    await db.execAsync('DROP TABLE IF EXISTS alerts'); 
    await db.execAsync('DROP TABLE IF EXISTS budgets');
    await db.execAsync('DROP TABLE IF EXISTS recurring_transactions');
    await db.execAsync('DROP TABLE IF EXISTS transactions');
    await db.execAsync('DROP TABLE IF EXISTS categories');
    await db.execAsync('DROP TABLE IF EXISTS accounts');
    
    console.log('✅ [RESET] All tables dropped');
    
    // Réactiver les foreign keys
    await db.execAsync('PRAGMA foreign_keys = ON');
    
    console.log('🔄 [RESET] Reinitializing database...');
    
    // Réinitialiser complètement
    await initDatabase();
    
    console.log('🎉 [RESET] Database reset successfully');
    
  } catch (error) {
    console.error('❌ [RESET] Error resetting database:', error);
    throw error;
  }
};

export const softResetDatabase = async (): Promise<void> => {
  try {
    console.log('🔄 [SOFT RESET] Starting soft reset...');
    
    // Réinitialiser normalement
    await initDatabase();
    
    console.log('✅ [SOFT RESET] Soft reset completed');
  } catch (error) {
    console.error('❌ [SOFT RESET] Error during soft reset:', error);
    throw error;
  }
};

export const resetCategoriesOnly = async (): Promise<void> => {
  try {
    const db = await getDatabase();
    
    console.log('🔄 [CATEGORIES RESET] Resetting categories table...');
    
    // Sauvegarder les catégories existantes si nécessaire
    const existingCategories = await db.getAllAsync('SELECT * FROM categories') as any[];
    console.log(`💾 Sauvegarde de ${existingCategories.length} catégories`);
    
    // Supprimer et recréer seulement la table categories
    await db.execAsync('DROP TABLE IF EXISTS categories');
    
    await db.execAsync(`
      CREATE TABLE categories (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        type TEXT NOT NULL DEFAULT 'custom',
        icon TEXT NOT NULL DEFAULT 'help-circle',
        color TEXT NOT NULL DEFAULT '#666666',
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('✅ [CATEGORIES RESET] Categories table reset successfully');
    
  } catch (error) {
    console.error('❌ [CATEGORIES RESET] Error resetting categories:', error);
    throw error;
  }
};

export const resetTransactionsOnly = async (): Promise<void> => {
  try {
    const db = await getDatabase();
    
    console.log('🔄 [TRANSACTIONS RESET] Resetting transactions table...');
    
    await db.execAsync('DROP TABLE IF EXISTS transactions');
    
    await db.execAsync(`
      CREATE TABLE transactions (
        id TEXT PRIMARY KEY NOT NULL,
        amount REAL NOT NULL,
        type TEXT NOT NULL,
        category TEXT NOT NULL,
        account_id TEXT NOT NULL,
        description TEXT,
        date TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('✅ [TRANSACTIONS RESET] Transactions table reset successfully');
    
  } catch (error) {
    console.error('❌ [TRANSACTIONS RESET] Error resetting transactions:', error);
    throw error;
  }
};

export const resetAccountsOnly = async (): Promise<void> => {
  try {
    const db = await getDatabase();
    
    console.log('🔄 [ACCOUNTS RESET] Resetting accounts table...');
    
    // Sauvegarder les comptes existants
    const existingAccounts = await db.getAllAsync('SELECT * FROM accounts') as any[];
    console.log(`💾 Sauvegarde de ${existingAccounts.length} comptes`);
    
    await db.execAsync('DROP TABLE IF EXISTS accounts');
    
    await db.execAsync(`
      CREATE TABLE accounts (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        type TEXT NOT NULL DEFAULT 'cash',
        balance REAL NOT NULL DEFAULT 0,
        currency TEXT NOT NULL DEFAULT 'EUR',
        color TEXT NOT NULL DEFAULT '#007AFF',
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('✅ [ACCOUNTS RESET] Accounts table reset successfully');
    
  } catch (error) {
    console.error('❌ [ACCOUNTS RESET] Error resetting accounts:', error);
    throw error;
  }
};

export const resetBudgetsOnly = async (): Promise<void> => {
  try {
    const db = await getDatabase();
    
    console.log('🔄 [BUDGETS RESET] Resetting budgets table...');
    
    await db.execAsync('DROP TABLE IF EXISTS budgets');
    
    await db.execAsync(`
      CREATE TABLE budgets (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        amount REAL NOT NULL,
        spent REAL NOT NULL DEFAULT 0,
        period TEXT NOT NULL,
        start_date TEXT NOT NULL,
        end_date TEXT,
        is_active BOOLEAN NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('✅ [BUDGETS RESET] Budgets table reset successfully');
    
  } catch (error) {
    console.error('❌ [BUDGETS RESET] Error resetting budgets:', error);
    throw error;
  }
};

export const resetAlertsOnly = async (): Promise<void> => {
  try {
    const db = await getDatabase();
    
    console.log('🔄 [ALERTS RESET] Resetting alerts table...');
    
    await db.execAsync('DROP TABLE IF EXISTS alerts');
    
    await db.execAsync(`
      CREATE TABLE alerts (
        id TEXT PRIMARY KEY NOT NULL,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        priority TEXT NOT NULL,
        is_read BOOLEAN NOT NULL DEFAULT 0,
        data TEXT,
        action_url TEXT,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('✅ [ALERTS RESET] Alerts table reset successfully');
    
  } catch (error) {
    console.error('❌ [ALERTS RESET] Error resetting alerts:', error);
    throw error;
  }
};

export const resetRecurringTransactionsOnly = async (): Promise<void> => {
  try {
    const db = await getDatabase();
    
    console.log('🔄 [RECURRING TRANSACTIONS RESET] Resetting recurring transactions table...');
    
    await db.execAsync('DROP TABLE IF EXISTS recurring_transactions');
    
    await db.execAsync(`
      CREATE TABLE recurring_transactions (
        id TEXT PRIMARY KEY NOT NULL,
        description TEXT NOT NULL,
        amount REAL NOT NULL,
        type TEXT NOT NULL,
        category TEXT NOT NULL,
        account_id TEXT NOT NULL,
        frequency TEXT NOT NULL,
        start_date TEXT NOT NULL,
        end_date TEXT,
        last_processed TEXT,
        is_active BOOLEAN NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('✅ [RECURRING TRANSACTIONS RESET] Recurring transactions table reset successfully');
    
  } catch (error) {
    console.error('❌ [RECURRING TRANSACTIONS RESET] Error resetting recurring transactions:', error);
    throw error;
  }
};

export const resetAllDataButKeepStructure = async (): Promise<void> => {
  try {
    const db = await getDatabase();
    
    console.log('🔄 [DATA RESET] Resetting all data but keeping table structure...');
    
    // Désactiver les foreign keys
    await db.execAsync('PRAGMA foreign_keys = OFF');
    
    // Supprimer toutes les données mais garder les tables
    await db.execAsync('DELETE FROM alerts');
    await db.execAsync('DELETE FROM budgets');
    await db.execAsync('DELETE FROM recurring_transactions');
    await db.execAsync('DELETE FROM transactions');
    await db.execAsync('DELETE FROM categories');
    await db.execAsync('DELETE FROM accounts');
    
    // Réactiver les foreign keys
    await db.execAsync('PRAGMA foreign_keys = ON');
    
    console.log('✅ [DATA RESET] All data reset successfully');
    
  } catch (error) {
    console.error('❌ [DATA RESET] Error resetting data:', error);
    throw error;
  }
};

export const resetSpecificTables = async (tables: string[]): Promise<void> => {
  try {
    const db = await getDatabase();
    
    console.log(`🔄 [SPECIFIC RESET] Resetting specific tables: ${tables.join(', ')}`);
    
    // Désactiver les foreign keys
    await db.execAsync('PRAGMA foreign_keys = OFF');
    
    for (const table of tables) {
      console.log(`🔄 Resetting table: ${table}`);
      await db.execAsync(`DROP TABLE IF EXISTS ${table}`);
      
      // Recréer la table basée sur son nom
      switch (table) {
        case 'accounts':
          await db.execAsync(`
            CREATE TABLE accounts (
              id TEXT PRIMARY KEY NOT NULL,
              name TEXT NOT NULL,
              type TEXT NOT NULL DEFAULT 'cash',
              balance REAL NOT NULL DEFAULT 0,
              currency TEXT NOT NULL DEFAULT 'EUR',
              color TEXT NOT NULL DEFAULT '#007AFF',
              created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
          `);
          break;
          
        case 'categories':
          await db.execAsync(`
            CREATE TABLE categories (
              id TEXT PRIMARY KEY NOT NULL,
              name TEXT NOT NULL,
              type TEXT NOT NULL DEFAULT 'custom',
              icon TEXT NOT NULL DEFAULT 'help-circle',
              color TEXT NOT NULL DEFAULT '#666666',
              created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
          `);
          break;
          
        case 'transactions':
          await db.execAsync(`
            CREATE TABLE transactions (
              id TEXT PRIMARY KEY NOT NULL,
              amount REAL NOT NULL,
              type TEXT NOT NULL,
              category TEXT NOT NULL,
              account_id TEXT NOT NULL,
              description TEXT,
              date TEXT NOT NULL,
              created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
          `);
          break;
          
        case 'budgets':
          await db.execAsync(`
            CREATE TABLE budgets (
              id TEXT PRIMARY KEY NOT NULL,
              name TEXT NOT NULL,
              category TEXT NOT NULL,
              amount REAL NOT NULL,
              spent REAL NOT NULL DEFAULT 0,
              period TEXT NOT NULL,
              start_date TEXT NOT NULL,
              end_date TEXT,
              is_active BOOLEAN NOT NULL DEFAULT 1,
              created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
          `);
          break;
          
        case 'alerts':
          await db.execAsync(`
            CREATE TABLE alerts (
              id TEXT PRIMARY KEY NOT NULL,
              type TEXT NOT NULL,
              title TEXT NOT NULL,
              message TEXT NOT NULL,
              priority TEXT NOT NULL,
              is_read BOOLEAN NOT NULL DEFAULT 0,
              data TEXT,
              action_url TEXT,
              created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
          `);
          break;
          
        case 'recurring_transactions':
          await db.execAsync(`
            CREATE TABLE recurring_transactions (
              id TEXT PRIMARY KEY NOT NULL,
              description TEXT NOT NULL,
              amount REAL NOT NULL,
              type TEXT NOT NULL,
              category TEXT NOT NULL,
              account_id TEXT NOT NULL,
              frequency TEXT NOT NULL,
              start_date TEXT NOT NULL,
              end_date TEXT,
              last_processed TEXT,
              is_active BOOLEAN NOT NULL DEFAULT 1,
              created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
          `);
          break;
      }
      
      console.log(`✅ Table ${table} reset successfully`);
    }
    
    // Réactiver les foreign keys
    await db.execAsync('PRAGMA foreign_keys = ON');
    
    console.log('🎉 [SPECIFIC RESET] Specific tables reset successfully');
    
  } catch (error) {
    console.error('❌ [SPECIFIC RESET] Error resetting specific tables:', error);
    throw error;
  }
};

export const getDatabaseStatus = async (): Promise<{
  tableCounts: Record<string, number>;
  tableExists: Record<string, boolean>;
}> => {
  try {
    const db = await getDatabase();
    
    console.log('🔍 [STATUS] Getting database status...');
    
    const tables = ['accounts', 'categories', 'transactions', 'budgets', 'alerts', 'recurring_transactions'];
    const tableCounts: Record<string, number> = {};
    const tableExists: Record<string, boolean> = {};
    
    for (const table of tables) {
      try {
        // Vérifier si la table existe
        const exists = await db.getFirstAsync(
          "SELECT name FROM sqlite_master WHERE type='table' AND name=?",
          [table]
        );
        tableExists[table] = !!exists;
        
        // Compter les lignes si la table existe
        if (exists) {
          const countResult = await db.getFirstAsync(`SELECT COUNT(*) as count FROM ${table}`) as { count: number };
          tableCounts[table] = countResult.count;
        } else {
          tableCounts[table] = 0;
        }
      } catch (error) {
        console.warn(`⚠️ Could not check table ${table}:`, error);
        tableExists[table] = false;
        tableCounts[table] = 0;
      }
    }
    
    console.log('📊 [STATUS] Database status:', { tableCounts, tableExists });
    
    return {
      tableCounts,
      tableExists
    };
  } catch (error) {
    console.error('❌ [STATUS] Error getting database status:', error);
    throw error;
  }
};

// Fonction utilitaire pour réinitialiser uniquement les tables problématiques
export const fixProblematicTables = async (): Promise<void> => {
  try {
    console.log('🔧 [FIX] Fixing problematic tables...');
    
    const status = await getDatabaseStatus();
    
    const problematicTables = Object.entries(status.tableExists)
      .filter(([table, exists]) => !exists)
      .map(([table]) => table);
    
    if (problematicTables.length > 0) {
      console.log(`🛠️ [FIX] Found problematic tables: ${problematicTables.join(', ')}`);
      await resetSpecificTables(problematicTables);
    } else {
      console.log('✅ [FIX] No problematic tables found');
    }
    
    console.log('🎉 [FIX] Table fixing completed');
  } catch (error) {
    console.error('❌ [FIX] Error fixing tables:', error);
    throw error;
  }
};