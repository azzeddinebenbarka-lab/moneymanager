// src/services/database/repairDatabase.ts
import { getDatabase } from './sqlite';

export const repairDatabase = async (): Promise<void> => {
  try {
    console.log('🔧 Début de la réparation de la base de données...');
    const db = await getDatabase();

    // Réparer la table accounts
    await checkAndRepairTable('accounts', [
      { name: 'type', definition: 'TEXT NOT NULL DEFAULT "checking"' },
      { name: 'balance', definition: 'REAL NOT NULL DEFAULT 0' },
      { name: 'currency', definition: 'TEXT NOT NULL DEFAULT "EUR"' },
      { name: 'color', definition: 'TEXT NOT NULL DEFAULT "#007AFF"' },
      { name: 'created_at', definition: 'TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP' }
    ]); 

    // Réparer la table categories
    await checkAndRepairTable('categories', [
      { name: 'type', definition: 'TEXT NOT NULL DEFAULT "custom"' },
      { name: 'icon', definition: 'TEXT NOT NULL DEFAULT "help-circle"' },
      { name: 'color', definition: 'TEXT NOT NULL DEFAULT "#666666"' },
      { name: 'created_at', definition: 'TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP' }
    ]);

    // Réparer la table transactions
    await checkAndRepairTable('transactions', [
      { name: 'description', definition: 'TEXT' },
      { name: 'date', definition: 'TEXT NOT NULL' },
      { name: 'created_at', definition: 'TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP' }
    ]);

    // Réparer la table budgets
    await checkAndRepairTable('budgets', [
      { name: 'spent', definition: 'REAL NOT NULL DEFAULT 0' },
      { name: 'is_active', definition: 'BOOLEAN NOT NULL DEFAULT 1' },
      { name: 'created_at', definition: 'TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP' }
    ]);

    // Réparer la table alerts
    await checkAndRepairTable('alerts', [
      { name: 'is_read', definition: 'BOOLEAN NOT NULL DEFAULT 0' },
      { name: 'data', definition: 'TEXT' },
      { name: 'action_url', definition: 'TEXT' },
      { name: 'created_at', definition: 'TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP' }
    ]);

    // Réparer la table recurring_transactions
    await checkAndRepairTable('recurring_transactions', [
      { name: 'end_date', definition: 'TEXT' },
      { name: 'last_processed', definition: 'TEXT' },
      { name: 'is_active', definition: 'BOOLEAN NOT NULL DEFAULT 1' },
      { name: 'created_at', definition: 'TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP' }
    ]);

    console.log('✅ Réparation de la base de données terminée avec succès');
  } catch (error) {
    console.error('❌ Erreur lors de la réparation de la base de données:', error);
    throw error;
  }
};

const checkAndRepairTable = async (tableName: string, requiredColumns: { name: string; definition: string }[]): Promise<void> => {
  try {
    const db = await getDatabase();
    
    // Vérifier si la table existe
    const tableExists = await db.getFirstAsync(
      "SELECT name FROM sqlite_master WHERE type='table' AND name=?",
      [tableName]
    );
    
    if (!tableExists) {
      console.log(`❌ Table ${tableName} n'existe pas, création...`);
      await createTable(tableName);
      return;
    }

    const tableInfo = await db.getAllAsync(`PRAGMA table_info(${tableName})`) as any[];
    
    console.log(`🔍 Vérification de la table ${tableName}...`);
    console.log(`📊 Colonnes existantes:`, tableInfo.map(col => col.name));
    
    for (const { name, definition } of requiredColumns) {
      const columnExists = tableInfo.some(col => col.name === name);
      
      if (!columnExists) {
        console.log(`➕ Ajout de la colonne ${name} à la table ${tableName}...`);
        try {
          await db.execAsync(`ALTER TABLE ${tableName} ADD COLUMN ${name} ${definition}`);
          console.log(`✅ Colonne ${name} ajoutée à ${tableName}`);
        } catch (error) {
          console.error(`❌ Erreur lors de l'ajout de ${name} à ${tableName}:`, error);
        }
      } else {
        console.log(`✅ Colonne ${name} existe déjà dans ${tableName}`);
      }
    }
  } catch (error) {
    console.error(`❌ Erreur lors de la vérification de ${tableName}:`, error);
  }
};

const createTable = async (tableName: string): Promise<void> => {
  const db = await getDatabase();
  
  switch (tableName) {
    case 'accounts':
      await db.execAsync(`
        CREATE TABLE accounts (
          id TEXT PRIMARY KEY NOT NULL,
          name TEXT NOT NULL,
          type TEXT NOT NULL DEFAULT 'checking',
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
          period TEXT NOT NULL,
          start_date TEXT NOT NULL,
          end_date TEXT,
          is_active BOOLEAN NOT NULL DEFAULT 1,
          spent REAL NOT NULL DEFAULT 0,
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
  
  console.log(`✅ Table ${tableName} créée avec succès`);
};

export const quickDatabaseFix = async (): Promise<boolean> => {
  try {
    console.log('⚡ Réparation rapide de la base de données...');
    
    // Réparer toutes les tables
    await repairDatabase();
    
    console.log('✅ Réparation rapide terminée');
    return true;
  } catch (error) {
    console.error('❌ Échec de la réparation rapide:', error);
    return false;
  }
};

// AJOUTER à la fin du fichier repairDatabase.ts
export const emergencyFixTransactionsTable = async (): Promise<void> => {
  try {
    const db = await getDatabase();
    console.log('🚨 [REPAIR] Starting emergency fix for transactions table...');
    
    // Vérifier si la colonne account_id existe
    const tableInfo = await db.getAllAsync(`PRAGMA table_info(transactions)`) as any[];
    const hasAccountId = tableInfo.some(col => col.name === 'account_id');
    
    if (!hasAccountId) {
      console.log('🛠️ [REPAIR] Adding missing account_id column to transactions table...');
      await db.execAsync(`ALTER TABLE transactions ADD COLUMN account_id TEXT`);
      console.log('✅ [REPAIR] account_id column added successfully');
    }
    
    // Vérifier et corriger les données existantes
    try {
      const transactions = await db.getAllAsync(`SELECT * FROM transactions`) as any[];
      console.log(`🔍 [REPAIR] Checking ${transactions.length} existing transactions...`);
      
      let fixedCount = 0;
      for (const transaction of transactions) {
        // Si accountId existe mais pas account_id, copier la valeur
        if (transaction.accountId && !transaction.account_id) {
          await db.runAsync(
            `UPDATE transactions SET account_id = ? WHERE id = ?`,
            [transaction.accountId, transaction.id]
          );
          fixedCount++;
        }
      }
      
      if (fixedCount > 0) {
        console.log(`✅ [REPAIR] Fixed ${fixedCount} transactions with missing account_id`);
      }
    } catch (dataError) {
      console.log('ℹ️ [REPAIR] No existing transaction data to fix');
    }
    
    console.log('✅ [REPAIR] Emergency fix completed successfully');
  } catch (error) {
    console.error('❌ [REPAIR] Error in emergency fix:', error);
    throw error;
  }
};