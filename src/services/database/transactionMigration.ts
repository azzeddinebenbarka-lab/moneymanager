// src/services/database/transactionMigration.ts
import { getDatabase } from './sqlite';

export const migrateTransactionsTable = async (): Promise<void> => {
  try {
    const db = await getDatabase();
    console.log('🔄 [MIGRATION] Starting transactions table migration...');

    // Vérifier si la table transactions existe
    const tableExists = await db.getFirstAsync(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='transactions'"
    );

    if (!tableExists) {
      console.log('📋 [MIGRATION] Transactions table does not exist, creating...');
      await createTransactionsTable();
      return;
    }

    // Vérifier la structure de la table
    const tableInfo = await db.getAllAsync(`PRAGMA table_info(transactions)`) as any[];
    console.log('🔍 [MIGRATION] Current transactions table structure:', tableInfo);

    // Colonnes requises
    const requiredColumns = [
      'id', 'user_id', 'amount', 'type', 'category', 'account_id', 
      'description', 'date', 'created_at'
    ];

    const missingColumns = requiredColumns.filter(col => 
      !tableInfo.some(column => column.name === col)
    );

    if (missingColumns.length > 0) {
      console.log('🛠️ [MIGRATION] Missing columns detected:', missingColumns);
      await fixTransactionsTableStructure();
    }

    // Vérifier et migrer les données existantes
    await migrateExistingTransactionsData();

    console.log('✅ [MIGRATION] Transactions table migration completed');
  } catch (error) {
    console.error('❌ [MIGRATION] Error during transactions migration:', error);
    throw error;
  }
};

const createTransactionsTable = async (): Promise<void> => {
  const db = await getDatabase();
  
  await db.execAsync(`
    CREATE TABLE transactions (
      id TEXT PRIMARY KEY NOT NULL,
      user_id TEXT NOT NULL DEFAULT 'default-user',
      amount REAL NOT NULL,
      type TEXT NOT NULL,
      category TEXT NOT NULL,
      account_id TEXT NOT NULL,
      description TEXT,
      date TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
      FOREIGN KEY (account_id) REFERENCES accounts (id) ON DELETE CASCADE
    );
  `);
  
  console.log('✅ [MIGRATION] Transactions table created successfully');
};

const fixTransactionsTableStructure = async (): Promise<void> => {
  const db = await getDatabase();
  
  try {
    // Sauvegarder les données existantes
    let existingData: any[] = [];
    try {
      existingData = await db.getAllAsync(`SELECT * FROM transactions`);
      console.log(`📦 [MIGRATION] Backing up ${existingData.length} transactions`);
    } catch (error) {
      console.log('ℹ️ [MIGRATION] No existing transaction data to backup');
    }

    // Recréer la table avec la structure correcte
    await db.execAsync('DROP TABLE IF EXISTS transactions');
    await createTransactionsTable();

    // Réinsérer les données sauvegardées si possible
    if (existingData.length > 0) {
      let restoredCount = 0;
      for (const transaction of existingData) {
        try {
          await db.runAsync(
            `INSERT INTO transactions (id, user_id, amount, type, category, account_id, description, date, created_at) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              transaction.id,
              transaction.user_id || 'default-user',
              transaction.amount,
              transaction.type,
              transaction.category,
              transaction.account_id || transaction.accountId, // Support both names
              transaction.description || '',
              transaction.date,
              transaction.created_at || transaction.createdAt || new Date().toISOString()
            ]
          );
          restoredCount++;
        } catch (insertError) {
          console.warn('⚠️ [MIGRATION] Could not restore transaction:', transaction.id);
        }
      }
      console.log(`✅ [MIGRATION] Restored ${restoredCount}/${existingData.length} transactions`);
    }
  } catch (error) {
    console.error('❌ [MIGRATION] Error fixing transactions table structure:', error);
    throw error;
  }
};

const migrateExistingTransactionsData = async (): Promise<void> => {
  const db = await getDatabase();
  
  try {
    // Vérifier si des transactions utilisent l'ancien nom de colonne accountId
    const tableInfo = await db.getAllAsync(`PRAGMA table_info(transactions)`) as any[];
    const hasOldAccountId = tableInfo.some(col => col.name === 'accountId');
    
    if (hasOldAccountId) {
      console.log('🔄 [MIGRATION] Migrating from accountId to account_id...');
      
      // Copier les données de accountId vers account_id pour les lignes où account_id est NULL
      const result = await db.runAsync(`
        UPDATE transactions 
        SET account_id = accountId 
        WHERE account_id IS NULL AND accountId IS NOT NULL
      `);
      
      console.log(`✅ [MIGRATION] Migrated ${result.changes} transactions from accountId to account_id`);
      
      // Supprimer l'ancienne colonne (optionnel)
      try {
        await db.execAsync('ALTER TABLE transactions DROP COLUMN accountId');
        console.log('✅ [MIGRATION] Removed old accountId column');
      } catch (dropError) {
        console.log('ℹ️ [MIGRATION] Could not remove accountId column (may not be supported)');
      }
    }
  } catch (error) {
    console.warn('⚠️ [MIGRATION] Could not migrate existing data:', error);
  }
};

export default migrateTransactionsTable;