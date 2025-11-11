// src/services/database/sqlite.ts - VERSION CORRIGÉE AVEC COLONNES account_id
import * as SQLite from 'expo-sqlite';

export interface DatabaseAccount {
  id: string;
  user_id: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
  color: string;
  created_at: string;
}

export interface DatabaseTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: string;
  category: string;
  account_id: string;
  description: string;
  date: string;
  created_at: string;
}

export interface DatabaseAnnualCharge {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  due_date: string;
  category: string;
  is_paid: number;
  reminder_days: number;
  created_at: string;
  notes?: string;
  payment_method?: string;
  recurrence?: string;
  account_id?: string;
  auto_deduct?: number;
}

export interface DatabaseDebt {
  id: string;
  user_id: string;
  name: string;
  initial_amount: number;
  current_amount: number;
  interest_rate: number;
  monthly_payment: number;
  due_date: string;
  creditor: string;
  type: string;
  status: string;
  created_at: string;
  payment_account_id?: string;
  auto_pay?: number;
}

export interface DatabaseSavingsGoal {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  target_date: string;
  monthly_contribution: number;
  category: string;
  color: string;
  icon: string;
  is_completed: number;
  created_at: string;
  savings_account_id?: string;
  contribution_account_id?: string;
}

export let database: SQLite.SQLiteDatabase | null = null;

export const initDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  try {
    if (database) {
      return database;
    }

    console.log('🗄️ Initialisation de la base de données...');
    
    database = await SQLite.openDatabaseAsync('moneyManager.db');
    
    // DÉSACTIVER les foreign keys temporairement pendant l'initialisation
    await database.execAsync('PRAGMA foreign_keys = OFF');
    
    await createTables();
    
    await createDefaultUser();
    
    await initializeDefaultData();
    
    // RÉACTIVER les foreign keys après l'initialisation
    await database.execAsync('PRAGMA foreign_keys = ON');
    
    console.log('✅ Base de données initialisée avec succès');
    return database;
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation de la base de données:', error);
    throw error;
  }
};

const createDefaultUser = async (): Promise<void> => {
  if (!database) throw new Error('Database not initialized');

  try {
    // Vérifier si un utilisateur existe déjà
    const userExists = await database.getFirstAsync(
      'SELECT 1 FROM users LIMIT 1'
    );

    if (!userExists) {
      console.log('🔄 Création de l\'utilisateur par défaut...');
      
      const defaultUserId = 'default-user';
      const now = new Date().toISOString();
      
      await database.runAsync(`
        INSERT INTO users (id, email, password_hash, first_name, last_name, currency, language, created_at, last_login, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        defaultUserId,
        'user@example.com',
        'default-hash',
        'John',
        'Doe',
        'MAD',
        'fr',
        now,
        now,
        1
      ]);

      // Créer les préférences par défaut
      await database.runAsync(`
        INSERT INTO user_preferences (user_id, theme, biometric_auth, monthly_reports, budget_alerts, push_notifications)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [
        defaultUserId,
        'light',
        0,
        1,
        1,
        1
      ]);

      console.log('✅ Utilisateur par défaut créé avec succès');
    }
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'utilisateur par défaut:', error);
    throw error;
  }
};

const createTables = async (): Promise<void> => {
  if (!database) throw new Error('Database not initialized');

  // ===== TABLES PRINCIPALES =====

  // Table des utilisateurs
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      currency TEXT NOT NULL DEFAULT 'EUR',
      language TEXT NOT NULL DEFAULT 'fr',
      created_at TEXT NOT NULL,
      last_login TEXT NOT NULL,
      is_active INTEGER NOT NULL DEFAULT 1
    );
  `);

  // Table des préférences utilisateur
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS user_preferences (
      user_id TEXT PRIMARY KEY NOT NULL,
      theme TEXT NOT NULL DEFAULT 'light',
      biometric_auth INTEGER NOT NULL DEFAULT 0,
      monthly_reports INTEGER NOT NULL DEFAULT 1,
      budget_alerts INTEGER NOT NULL DEFAULT 1,
      push_notifications INTEGER NOT NULL DEFAULT 1,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );
  `);

  // Table des comptes
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS accounts (
      id TEXT PRIMARY KEY NOT NULL,
      user_id TEXT NOT NULL DEFAULT 'default-user',
      name TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'cash',
      balance REAL NOT NULL DEFAULT 0,
      currency TEXT NOT NULL DEFAULT 'EUR',
      color TEXT NOT NULL DEFAULT '#007AFF',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );
  `);

  // Table des catégories
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY NOT NULL,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      color TEXT NOT NULL,
      icon TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );
  `);

  // ===== TABLES DES TRANSACTIONS =====

  // Table des transactions
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS transactions (
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

  // Table des transactions récurrentes AVEC next_date
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS recurring_transactions (
      id TEXT PRIMARY KEY NOT NULL,
      user_id TEXT NOT NULL,
      description TEXT NOT NULL,
      amount REAL NOT NULL,
      type TEXT NOT NULL,
      category TEXT NOT NULL,
      account_id TEXT NOT NULL,
      frequency TEXT NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT,
      last_processed TEXT,
      next_date TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
      FOREIGN KEY (account_id) REFERENCES accounts (id) ON DELETE CASCADE
    );
  `);

  // ===== TABLES DE BUDGET ET PLANIFICATION =====

  // Table des budgets
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS budgets (
      id TEXT PRIMARY KEY NOT NULL,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      amount REAL NOT NULL,
      spent REAL NOT NULL DEFAULT 0,
      period TEXT NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );
  `);

  // ✅ CORRIGÉ : Table des charges annuelles AVEC account_id
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS annual_charges (
      id TEXT PRIMARY KEY NOT NULL,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      amount REAL NOT NULL,
      due_date TEXT NOT NULL,
      category TEXT NOT NULL,
      is_paid INTEGER NOT NULL DEFAULT 0,
      reminder_days INTEGER NOT NULL DEFAULT 7,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      notes TEXT,
      payment_method TEXT,
      recurrence TEXT,
      account_id TEXT,
      auto_deduct INTEGER DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
      FOREIGN KEY (account_id) REFERENCES accounts (id) ON DELETE SET NULL
    );
  `);

  // ===== TABLES DE DETTES =====

  // ✅ CORRIGÉ : Table des dettes AVEC payment_account_id
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS debts (
      id TEXT PRIMARY KEY NOT NULL,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      initial_amount REAL NOT NULL,
      current_amount REAL NOT NULL,
      interest_rate REAL NOT NULL DEFAULT 0,
      monthly_payment REAL NOT NULL,
      due_date TEXT NOT NULL,
      creditor TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'personal',
      status TEXT NOT NULL DEFAULT 'active',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      payment_account_id TEXT,
      auto_pay INTEGER DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
      FOREIGN KEY (payment_account_id) REFERENCES accounts (id) ON DELETE SET NULL
    );
  `);

  // Table des paiements de dettes
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS debt_payments (
      id TEXT PRIMARY KEY NOT NULL,
      debt_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      amount REAL NOT NULL,
      payment_date TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      from_account_id TEXT,
      FOREIGN KEY (debt_id) REFERENCES debts (id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
      FOREIGN KEY (from_account_id) REFERENCES accounts (id) ON DELETE SET NULL
    );
  `);

  // ===== TABLES D'ÉPARGNE =====

  // ✅ CORRIGÉ : Table des objectifs d'épargne AVEC comptes associés
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS savings_goals (
      id TEXT PRIMARY KEY NOT NULL,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      target_amount REAL NOT NULL,
      current_amount REAL NOT NULL DEFAULT 0,
      target_date TEXT NOT NULL,
      monthly_contribution REAL NOT NULL,
      category TEXT NOT NULL DEFAULT 'other',
      color TEXT NOT NULL DEFAULT '#007AFF',
      icon TEXT NOT NULL DEFAULT 'flag',
      is_completed INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      savings_account_id TEXT,
      contribution_account_id TEXT,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
      FOREIGN KEY (savings_account_id) REFERENCES accounts (id) ON DELETE SET NULL,
      FOREIGN KEY (contribution_account_id) REFERENCES accounts (id) ON DELETE SET NULL
    );
  `);

  // Table des comptes d'épargne
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS savings_accounts (
      id TEXT PRIMARY KEY NOT NULL,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'savings',
      balance REAL NOT NULL DEFAULT 0,
      currency TEXT NOT NULL DEFAULT 'EUR',
      color TEXT NOT NULL DEFAULT '#34C759',
      target_amount REAL,
      target_date TEXT,
      monthly_contribution REAL DEFAULT 0,
      interest_rate REAL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );
  `);

  // Table des contributions d'épargne
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS savings_contributions (
      id TEXT PRIMARY KEY NOT NULL,
      savings_goal_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      amount REAL NOT NULL,
      contribution_date TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      from_account_id TEXT,
      FOREIGN KEY (savings_goal_id) REFERENCES savings_goals (id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
      FOREIGN KEY (from_account_id) REFERENCES accounts (id) ON DELETE SET NULL
    );
  `);

  // ===== TABLES D'ALERTES ET NOTIFICATIONS =====

  // Table des alertes
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS alerts (
      id TEXT PRIMARY KEY NOT NULL,
      user_id TEXT NOT NULL,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      priority TEXT NOT NULL,
      is_read INTEGER NOT NULL DEFAULT 0,
      data TEXT,
      action_url TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );
  `);

  // Table des paramètres de notification
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS notification_settings (
      user_id TEXT PRIMARY KEY NOT NULL,
      budget_alerts INTEGER NOT NULL DEFAULT 1,
      bill_reminders INTEGER NOT NULL DEFAULT 1,
      savings_goals INTEGER NOT NULL DEFAULT 1,
      debt_payments INTEGER NOT NULL DEFAULT 1,
      monthly_reports INTEGER NOT NULL DEFAULT 1,
      push_enabled INTEGER NOT NULL DEFAULT 1,
      email_enabled INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );
  `);

  // ===== TABLES DE SYNCHRONISATION ET BACKUP =====

  // Table des sessions de synchronisation
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS sync_sessions (
      id TEXT PRIMARY KEY NOT NULL,
      user_id TEXT NOT NULL,
      sync_type TEXT NOT NULL,
      status TEXT NOT NULL,
      started_at TEXT NOT NULL,
      completed_at TEXT,
      records_synced INTEGER DEFAULT 0,
      error_message TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );
  `);

  // Table des sauvegardes
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS backups (
      id TEXT PRIMARY KEY NOT NULL,
      user_id TEXT NOT NULL,
      backup_type TEXT NOT NULL,
      file_path TEXT NOT NULL,
      file_size INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      is_encrypted INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );
  `);

  console.log('✅ Toutes les tables créées avec succès');
};

// Fonction séparée pour initialiser les catégories
const initializeDefaultCategories = async (userId: string = 'default-user'): Promise<void> => {
  if (!database) throw new Error('Database not initialized');

  try {
    const categoriesExist = await database.getFirstAsync(
      'SELECT 1 FROM categories LIMIT 1'
    );

    if (!categoriesExist) {
      console.log('🔄 Initialisation des catégories par défaut...');
      
      const defaultCategories = [
        // Dépenses
        { id: 'cat_1', name: 'Alimentation', type: 'expense', color: '#FF6B6B', icon: 'restaurant' },
        { id: 'cat_2', name: 'Transport', type: 'expense', color: '#4ECDC4', icon: 'car' },
        { id: 'cat_3', name: 'Logement', type: 'expense', color: '#45B7D1', icon: 'home' },
        { id: 'cat_4', name: 'Loisirs', type: 'expense', color: '#96CEB4', icon: 'game-controller' },
        { id: 'cat_5', name: 'Santé', type: 'expense', color: '#FFEAA7', icon: 'medical' },
        { id: 'cat_6', name: 'Shopping', type: 'expense', color: '#DDA0DD', icon: 'cart' },
        { id: 'cat_7', name: 'Éducation', type: 'expense', color: '#98D8C8', icon: 'school' },
        { id: 'cat_8', name: 'Voyages', type: 'expense', color: '#F7DC6F', icon: 'airplane' },
        { id: 'cat_9', name: 'Autres dépenses', type: 'expense', color: '#778899', icon: 'ellipsis-horizontal' },
        
        // Revenus
        { id: 'cat_10', name: 'Salaire', type: 'income', color: '#52C41A', icon: 'cash' },
        { id: 'cat_11', name: 'Investissements', type: 'income', color: '#FAAD14', icon: 'trending-up' },
        { id: 'cat_12', name: 'Cadeaux', type: 'income', color: '#722ED1', icon: 'gift' },
        { id: 'cat_13', name: 'Prime', type: 'income', color: '#13C2C2', icon: 'trophy' },
        { id: 'cat_14', name: 'Autres revenus', type: 'income', color: '#20B2AA', icon: 'add-circle' },
      ];

      for (const category of defaultCategories) {
        const createdAt = new Date().toISOString();
        await database.runAsync(
          `INSERT INTO categories (id, user_id, name, type, color, icon, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [category.id, userId, category.name, category.type, category.color, category.icon, createdAt]
        );
      }
      
      console.log('✅ Catégories par défaut initialisées avec succès');
    } else {
      console.log('ℹ️ Catégories déjà existantes, initialisation ignorée');
    }
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation des catégories par défaut:', error);
    throw error;
  }
};

const initializeDefaultData = async (): Promise<void> => {
  if (!database) throw new Error('Database not initialized');

  try {
    await initializeDefaultCategories('default-user');

    // Initialiser les paramètres de notification par défaut
    const notificationSettingsExist = await database.getFirstAsync(
      'SELECT 1 FROM notification_settings LIMIT 1'
    );

    if (!notificationSettingsExist) {
      console.log('🔄 Initialisation des paramètres de notification...');
      await database.runAsync(`
        INSERT INTO notification_settings (
          user_id, budget_alerts, bill_reminders, savings_goals, debt_payments, monthly_reports, push_enabled, email_enabled
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        'default-user',
        1, 1, 1, 1, 1, 1, 0
      ]);
    }
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation des données par défaut:', error);
    throw error;
  }
};

export const getDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (!database) {
    return await initDatabase();
  }
  return database;
};

export const closeDatabase = async (): Promise<void> => {
  if (database) {
    await database.closeAsync();
    database = null;
  }
};

export const checkDatabaseStatus = async (): Promise<{
  isInitialized: boolean;
  tablesCount: number;
  lastBackup?: string;
}> => {
  try {
    if (!database) {
      return { isInitialized: false, tablesCount: 0 };
    }

    const tables = await database.getAllAsync(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
    `) as { name: string }[];

    return {
      isInitialized: true,
      tablesCount: tables.length,
    };
  } catch (error) {
    console.error('Error checking database status:', error);
    return { isInitialized: false, tablesCount: 0 };
  }
};

export const resetDatabase = async (): Promise<void> => {
  try {
    if (database) {
      await database.closeAsync();
      database = null;
    }

    await initDatabase();
    console.log('✅ Database reset successfully');
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    throw error;
  }
};

export const getTableInfo = async (tableName: string): Promise<any[]> => {
  try {
    const db = await getDatabase();
    return await db.getAllAsync(`PRAGMA table_info(${tableName})`);
  } catch (error) {
    console.error(`Error getting table info for ${tableName}:`, error);
    return [];
  }
};

export const getAllTables = async (): Promise<string[]> => {
  try {
    const db = await getDatabase();
    const tables = await db.getAllAsync(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
    `) as { name: string }[];
    
    return tables.map(table => table.name);
  } catch (error) {
    console.error('Error getting all tables:', error);
    return [];
  }
};

// ✅ NOUVELLE FONCTION : Migration pour ajouter les colonnes account_id
export const runAccountIdMigration = async (): Promise<void> => {
  try {
    const db = await getDatabase();
    
    console.log('🔄 Exécution de la migration account_id...');
    
    // Migration pour ajouter account_id aux tables
    try {
      await db.execAsync(`
        ALTER TABLE annual_charges ADD COLUMN account_id TEXT;
      `);
      console.log('✅ Colonne account_id ajoutée à annual_charges');
    } catch (error) {
      console.log('ℹ️ Colonne account_id existe déjà dans annual_charges');
    }
    
    try {
      await db.execAsync(`
        ALTER TABLE annual_charges ADD COLUMN auto_deduct INTEGER DEFAULT 0;
      `);
      console.log('✅ Colonne auto_deduct ajoutée à annual_charges');
    } catch (error) {
      console.log('ℹ️ Colonne auto_deduct existe déjà dans annual_charges');
    }
    
    try {
      await db.execAsync(`
        ALTER TABLE debts ADD COLUMN payment_account_id TEXT;
      `);
      console.log('✅ Colonne payment_account_id ajoutée à debts');
    } catch (error) {
      console.log('ℹ️ Colonne payment_account_id existe déjà dans debts');
    }
    
    try {
      await db.execAsync(`
        ALTER TABLE debts ADD COLUMN auto_pay INTEGER DEFAULT 0;
      `);
      console.log('✅ Colonne auto_pay ajoutée à debts');
    } catch (error) {
      console.log('ℹ️ Colonne auto_pay existe déjà dans debts');
    }
    
    try {
      await db.execAsync(`
        ALTER TABLE savings_goals ADD COLUMN savings_account_id TEXT;
      `);
      console.log('✅ Colonne savings_account_id ajoutée à savings_goals');
    } catch (error) {
      console.log('ℹ️ Colonne savings_account_id existe déjà dans savings_goals');
    }
    
    try {
      await db.execAsync(`
        ALTER TABLE savings_goals ADD COLUMN contribution_account_id TEXT;
      `);
      console.log('✅ Colonne contribution_account_id ajoutée à savings_goals');
    } catch (error) {
      console.log('ℹ️ Colonne contribution_account_id existe déjà dans savings_goals');
    }
    
    console.log('✅ Migration account_id terminée avec succès');
  } catch (error) {
    console.error('❌ Erreur lors de la migration account_id:', error);
    throw error;
  }
};

export const databaseUtils = {
  checkDatabaseStatus,
  resetDatabase,
  closeDatabase,
  getDatabase,
  initDatabase,
  getTableInfo,
  getAllTables,
  runAccountIdMigration,
};

export const sqlite = {
  getDatabase,
  initDatabase,
  closeDatabase,
  resetDatabase,
  checkDatabaseStatus,
  getTableInfo,
  getAllTables,
  runAccountIdMigration,
};