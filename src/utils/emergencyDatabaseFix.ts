// src/utils/emergencyDatabaseFix.ts - NOUVEAU FICHIER
import { getDatabase } from '../services/database/sqlite';

export const emergencyDatabaseFix = {
  async fixUserIdColumn(): Promise<{ success: boolean; message: string }> {
    try {
      const db = await getDatabase();
      
      console.log('🚨 [EMERGENCY FIX] Starting emergency database repair...');
      
      // 1. Vérifier si la colonne user_id existe
      const tableInfo = await db.getAllAsync(`PRAGMA table_info(accounts)`) as any[];
      const hasUserId = tableInfo.some(col => col.name === 'user_id');
      
      if (!hasUserId) {
        console.log('🛠️ [EMERGENCY FIX] Adding missing user_id column...');
        
        // Ajouter la colonne user_id
        await db.execAsync(`ALTER TABLE accounts ADD COLUMN user_id TEXT DEFAULT 'default-user'`);
        
        // Mettre à jour les enregistrements existants
        await db.runAsync(`UPDATE accounts SET user_id = 'default-user' WHERE user_id IS NULL`);
        
        console.log('✅ [EMERGENCY FIX] user_id column added successfully');
      }
      
      // 2. Vérifier s'il y a des colonnes problématiques
      const hasUserIdWrong = tableInfo.some(col => col.name === 'userId');
      if (hasUserIdWrong) {
        console.log('🛠️ [EMERGENCY FIX] Removing incorrect userId column...');
        
        // Créer une table temporaire avec la bonne structure
        await db.execAsync(`
          CREATE TABLE accounts_temp (
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
        
        // Copier les données
        await db.execAsync(`
          INSERT INTO accounts_temp (id, user_id, name, type, balance, currency, color, icon, is_active, created_at)
          SELECT 
            id,
            COALESCE(user_id, 'default-user') as user_id,
            name,
            type,
            balance,
            currency,
            color,
            icon,
            is_active,
            created_at
          FROM accounts
        `);
        
        // Remplacer l'ancienne table
        await db.execAsync('DROP TABLE accounts');
        await db.execAsync('ALTER TABLE accounts_temp RENAME TO accounts');
        
        console.log('✅ [EMERGENCY FIX] Table structure corrected');
      }
      
      // 3. Vérifier le résultat final
      const finalStructure = await db.getAllAsync(`PRAGMA table_info(accounts)`) as any[];
      console.log('📋 [EMERGENCY FIX] Final table structure:', 
        finalStructure.map(col => ({ name: col.name, type: col.type }))
      );
      
      return { 
        success: true, 
        message: 'Emergency repair completed successfully' 
      };
      
    } catch (error) {
      console.error('❌ [EMERGENCY FIX] Error during repair:', error);
      return { 
        success: false, 
        message: `Emergency repair failed: ${error}` 
      };
    }
  },

  async verifyDatabase(): Promise<{ isValid: boolean; issues: string[] }> {
    const issues: string[] = [];
    
    try {
      const db = await getDatabase();
      
      // Vérifier la table accounts
      const accountsStructure = await db.getAllAsync(`PRAGMA table_info(accounts)`) as any[];
      const accountColumns = accountsStructure.map(col => col.name);
      
      // Vérifier les colonnes requises
      const requiredColumns = ['id', 'user_id', 'name', 'type', 'balance', 'currency', 'color', 'icon', 'is_active', 'created_at'];
      const missingColumns = requiredColumns.filter(col => !accountColumns.includes(col));
      
      if (missingColumns.length > 0) {
        issues.push(`Missing columns in accounts: ${missingColumns.join(', ')}`);
      }
      
      // Vérifier les colonnes problématiques
      const problematicColumns = accountColumns.filter(col => col === 'userId');
      if (problematicColumns.length > 0) {
        issues.push(`Problematic columns found: ${problematicColumns.join(', ')}`);
      }
      
      return {
        isValid: issues.length === 0,
        issues
      };
      
    } catch (error) {
      issues.push(`Verification error: ${error}`);
      return { isValid: false, issues };
    }
  }
};