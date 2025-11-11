// src/utils/emergencyFix.ts - VERSION CORRIGÉE
import { getDatabase } from '../services/database/sqlite'; // ✅ CORRECTION du chemin

export const emergencyFixService = {
  // ✅ CORRECTION URGENTE : Ajouter la colonne user_id si elle manque
  async fixAccountsTable(): Promise<{ success: boolean; message: string }> {
    try {
      const db = await getDatabase(); // ✅ DÉFINITION de db
      
      console.log('🚨 [EMERGENCY] Checking accounts table structure...');
      
      // Vérifier si la colonne user_id existe
      const tableInfo = await db.getAllAsync(`PRAGMA table_info(accounts)`) as any[];
      const hasUserId = tableInfo.some(col => col.name === 'user_id');
      
      if (!hasUserId) {
        console.log('🛠️ [EMERGENCY] Adding user_id column to accounts table...');
        
        // Ajouter la colonne user_id
        await db.execAsync(`ALTER TABLE accounts ADD COLUMN user_id TEXT DEFAULT 'default-user'`);
        
        // Mettre à jour les enregistrements existants
        await db.runAsync(`UPDATE accounts SET user_id = 'default-user' WHERE user_id IS NULL`);
        
        console.log('✅ [EMERGENCY] user_id column added successfully');
        return { success: true, message: 'Colonne user_id ajoutée avec succès' };
      } else {
        console.log('✅ [EMERGENCY] user_id column already exists');
        return { success: true, message: 'Colonne user_id existe déjà' };
      }
    } catch (error) {
      console.error('❌ [EMERGENCY] Error fixing accounts table:', error);
      return { success: false, message: `Erreur: ${error}` };
    }
  },

  // ✅ VÉRIFICATION COMPLÈTE DE LA STRUCTURE
  async verifyAndFixAllTables(): Promise<{ success: boolean; fixes: string[] }> {
    const fixes: string[] = [];
    
    try {
      console.log('🔧 [EMERGENCY] Verifying and fixing all tables...');
      
      const db = await getDatabase(); // ✅ DÉFINITION de db
      
      // 1. Vérifier et corriger la table accounts
      const accountsFix = await this.fixAccountsTable();
      if (accountsFix.success) {
        fixes.push('Accounts table: OK');
      } else {
        fixes.push(`Accounts table: ${accountsFix.message}`);
      }
      
      // 2. Vérifier les autres tables importantes
      const tablesToCheck = ['categories', 'transactions', 'budgets'];
      
      for (const table of tablesToCheck) {
        try {
          const tableExists = await db.getFirstAsync(
            "SELECT name FROM sqlite_master WHERE type='table' AND name=?",
            [table]
          );
          
          if (tableExists) {
            fixes.push(`${table}: Table exists`);
          } else {
            fixes.push(`${table}: Table missing - needs creation`);
          }
        } catch (error) {
          fixes.push(`${table}: Error checking`);
        }
      }
      
      console.log('✅ [EMERGENCY] All tables verified');
      return { success: true, fixes };
      
    } catch (error) {
      console.error('❌ [EMERGENCY] Error during verification:', error);
      fixes.push(`Global error: ${error}`);
      return { success: false, fixes };
    }
  },

  // ✅ RÉINITIALISATION COMPLÈTE (Dernier recours)
  async emergencyReset(): Promise<{ success: boolean; message: string }> {
    try {
      console.log('🔄 [EMERGENCY] Performing emergency reset...');
      
      const db = await getDatabase(); // ✅ DÉFINITION de db
      
      // Sauvegarder les données importantes
      const accounts = await db.getAllAsync('SELECT * FROM accounts') as any[];
      const transactions = await db.getAllAsync('SELECT * FROM transactions') as any[];
      
      // Supprimer et recréer les tables problématiques
      await db.execAsync('DROP TABLE IF EXISTS accounts');
      
      // Recréer la table avec la bonne structure
      await db.execAsync(`
        CREATE TABLE accounts (
          id TEXT PRIMARY KEY NOT NULL,
          user_id TEXT NOT NULL DEFAULT 'default-user',
          name TEXT NOT NULL,
          type TEXT NOT NULL,
          balance REAL NOT NULL DEFAULT 0,
          currency TEXT NOT NULL DEFAULT 'MAD',
          color TEXT NOT NULL,
          icon TEXT DEFAULT 'wallet',
          is_active INTEGER NOT NULL DEFAULT 1,
          created_at TEXT NOT NULL
        );
      `);
      
      // Réinsérer les données
      for (const account of accounts) {
        await db.runAsync(
          `INSERT INTO accounts (id, user_id, name, type, balance, currency, color, icon, is_active, created_at) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            account.id,
            account.user_id || 'default-user', // Utiliser user_id ou valeur par défaut
            account.name,
            account.type,
            account.balance,
            account.currency || 'MAD',
            account.color,
            account.icon || 'wallet',
            account.is_active !== undefined ? account.is_active : 1,
            account.created_at || new Date().toISOString()
          ]
        );
      }
      
      console.log('✅ [EMERGENCY] Emergency reset completed successfully');
      return { success: true, message: 'Réinitialisation d\'urgence terminée' };
      
    } catch (error) {
      console.error('❌ [EMERGENCY] Error during emergency reset:', error);
      return { success: false, message: `Erreur lors de la réinitialisation: ${error}` };
    }
  }
};

export default emergencyFixService;