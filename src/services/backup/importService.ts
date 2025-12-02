// src/services/backup/importService.ts
import * as FileSystem from 'expo-file-system/legacy';
import { getDatabase } from '../database/sqlite';
import { BackupData } from './localBackup';

export class ImportService {
  // Importer et restaurer depuis un fichier JSON
  static async importFromJSON(fileUri: string): Promise<{ success: boolean; error?: string; imported?: any }> {
    try {
      console.log('📥 Début import JSON:', fileUri);
      
      // Lire le fichier
      const fileContent = await FileSystem.readAsStringAsync(fileUri);
      const backupData: BackupData = JSON.parse(fileContent);
      
      // Validation améliorée du format
      if (!backupData.data) {
        throw new Error('Format de sauvegarde invalide : propriété "data" manquante');
      }
      
      // Vérifier que data contient au moins une propriété
      const hasData = Object.keys(backupData.data).length > 0;
      if (!hasData) {
        throw new Error('Le fichier de sauvegarde est vide');
      }
      
      console.log('✅ Format de sauvegarde valide:', Object.keys(backupData.data));
      
      // Restaurer les données dans la base de données
      const result = await this.restoreToDatabase(backupData.data);
      
      return {
        success: true,
        imported: result
      };
      
    } catch (error) {
      console.error('❌ Erreur import JSON:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  }
  
  // Importer depuis un fichier CSV
  static async importFromCSV(fileUri: string): Promise<{ success: boolean; error?: string; imported?: number }> {
    try {
      console.log('📥 Début import CSV:', fileUri);
      
      // Lire le fichier CSV
      const fileContent = await FileSystem.readAsStringAsync(fileUri);
      const lines = fileContent.split('\n');
      
      if (lines.length < 2) {
        throw new Error('Fichier CSV vide ou invalide');
      }
      
      // Parser l'en-tête
      const headers = lines[0].split(',').map(h => h.trim());
      
      // Parser les lignes de données
      const transactions = [];
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const values = line.split(',');
        const transaction: any = {};
        
        headers.forEach((header, index) => {
          transaction[header] = values[index]?.trim() || '';
        });
        
        transactions.push(transaction);
      }
      
      // Importer les transactions dans la base de données
      const db = await getDatabase();
      let imported = 0;
      
      for (const transaction of transactions) {
        try {
          await db.runAsync(
            `INSERT INTO transactions (
              id, user_id, amount, type, category, account_id, 
              description, date, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              `import_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              'default-user',
              parseFloat(transaction.amount || '0'),
              transaction.type || 'expense',
              transaction.category || 'Autre',
              transaction.account_id || '',
              transaction.description || '',
              transaction.date || new Date().toISOString(),
              new Date().toISOString()
            ]
          );
          imported++;
        } catch (err) {
          console.warn('⚠️ Erreur import transaction:', err);
        }
      }
      
      return {
        success: true,
        imported
      };
      
    } catch (error) {
      console.error('❌ Erreur import CSV:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  }
  
  // Restaurer les données dans la base de données
  private static async restoreToDatabase(data: any): Promise<any> {
    const db = await getDatabase();
    const result: any = {
      accounts: 0,
      transactions: 0,
      categories: 0,
      budgets: 0,
      debts: 0,
      savingsGoals: 0,
      annualCharges: 0,
      recurringTransactions: 0
    };
    
    try {
      console.log('🔄 Début restauration base de données...');
      await db.execAsync('BEGIN TRANSACTION');
      
      // Restaurer les comptes
      if (data.accounts && Array.isArray(data.accounts)) {
        console.log(`👛 Import de ${data.accounts.length} comptes...`);
        for (const account of data.accounts) {
          try {
            await db.runAsync(
              `INSERT OR REPLACE INTO accounts (
                id, user_id, name, type, balance, currency, color, icon, 
                is_active, created_at, updated_at
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                account.id || `acc_${Date.now()}`,
                account.user_id || 'default-user',
                account.name,
                account.type,
                account.balance || 0,
                account.currency || 'MAD',
                account.color || '#6C63FF',
                account.icon || 'wallet',
                account.is_active !== false ? 1 : 0,
                account.created_at || new Date().toISOString(),
                new Date().toISOString()
              ]
            );
            result.accounts++;
          } catch (err) {
            console.warn('⚠️ Erreur import compte:', err);
          }
        }
      }
      
      // Restaurer les transactions
      if (data.transactions && Array.isArray(data.transactions)) {
        console.log(`💰 Import de ${data.transactions.length} transactions...`);
        for (const transaction of data.transactions) {
          try {
            await db.runAsync(
              `INSERT OR REPLACE INTO transactions (
                id, user_id, amount, type, category, sub_category, account_id,
                description, date, is_recurring, recurrence_type, 
                recurrence_end_date, parent_transaction_id, created_at
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                transaction.id || `trx_${Date.now()}`,
                transaction.user_id || 'default-user',
                transaction.amount,
                transaction.type,
                transaction.category,
                transaction.sub_category || null,
                transaction.account_id,
                transaction.description || '',
                transaction.date,
                transaction.is_recurring ? 1 : 0,
                transaction.recurrence_type || null,
                transaction.recurrence_end_date || null,
                transaction.parent_transaction_id || null,
                transaction.created_at || new Date().toISOString()
              ]
            );
            result.transactions++;
          } catch (err) {
            console.warn('⚠️ Erreur import transaction:', err);
          }
        }
      }
      
      // Restaurer les catégories
      if (data.categories && Array.isArray(data.categories)) {
        console.log(`📁 Import de ${data.categories.length} catégories...`);
        for (const category of data.categories) {
          try {
            await db.runAsync(
              `INSERT OR REPLACE INTO categories (
                id, user_id, name, type, color, icon, parent_id, is_active, created_at
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                category.id || `cat_${Date.now()}`,
                category.user_id || 'default-user',
                category.name,
                category.type,
                category.color || '#6C63FF',
                category.icon || 'help-circle',
                category.parent_id || null,
                category.is_active !== false ? 1 : 0,
                category.created_at || new Date().toISOString()
              ]
            );
            result.categories++;
          } catch (err) {
            console.warn('⚠️ Erreur import catégorie:', err);
          }
        }
      }
      
      // Restaurer les budgets
      if (data.budgets && Array.isArray(data.budgets)) {
        console.log(`💼 Import de ${data.budgets.length} budgets...`);
        for (const budget of data.budgets) {
          try {
            await db.runAsync(
              `INSERT OR REPLACE INTO budgets (
                id, user_id, category_id, amount, period, start_date, end_date, created_at
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                budget.id || `bdg_${Date.now()}`,
                budget.user_id || 'default-user',
                budget.category_id,
                budget.amount,
                budget.period || 'monthly',
                budget.start_date,
                budget.end_date || null,
                budget.created_at || new Date().toISOString()
              ]
            );
            result.budgets++;
          } catch (err) {
            console.warn('⚠️ Erreur import budget:', err);
          }
        }
      }
      
      // Restaurer les charges annuelles
      if (data.annualCharges && Array.isArray(data.annualCharges)) {
        console.log(`📋 Import de ${data.annualCharges.length} charges annuelles...`);
        for (const charge of data.annualCharges) {
          try {
            await db.runAsync(
              `INSERT OR REPLACE INTO annual_charges (
                id, user_id, name, amount, category, due_date, is_paid, 
                auto_deduct, account_id, created_at
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                charge.id || `chg_${Date.now()}`,
                charge.user_id || 'default-user',
                charge.name,
                charge.amount,
                charge.category || 'Autre',
                charge.due_date,
                charge.is_paid ? 1 : 0,
                charge.auto_deduct ? 1 : 0,
                charge.account_id || null,
                charge.created_at || new Date().toISOString()
              ]
            );
            result.annualCharges++;
          } catch (err) {
            console.warn('⚠️ Erreur import charge annuelle:', err);
          }
        }
      }
      
      // Restaurer les dettes
      if (data.debts && Array.isArray(data.debts)) {
        console.log(`💳 Import de ${data.debts.length} dettes...`);
        for (const debt of data.debts) {
          try {
            await db.runAsync(
              `INSERT OR REPLACE INTO debts (
                id, user_id, name, amount, paid_amount, creditor, 
                due_date, is_paid, created_at
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                debt.id || `debt_${Date.now()}`,
                debt.user_id || 'default-user',
                debt.name,
                debt.amount,
                debt.paid_amount || 0,
                debt.creditor || '',
                debt.due_date || null,
                debt.is_paid ? 1 : 0,
                debt.created_at || new Date().toISOString()
              ]
            );
            result.debts++;
          } catch (err) {
            console.warn('⚠️ Erreur import dette:', err);
          }
        }
      }
      
      // Restaurer les objectifs d'épargne
      if (data.savingsGoals && Array.isArray(data.savingsGoals)) {
        console.log(`🎯 Import de ${data.savingsGoals.length} objectifs d'épargne...`);
        for (const goal of data.savingsGoals) {
          try {
            await db.runAsync(
              `INSERT OR REPLACE INTO savings_goals (
                id, user_id, name, target_amount, current_amount, 
                target_date, created_at
              ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
              [
                goal.id || `goal_${Date.now()}`,
                goal.user_id || 'default-user',
                goal.name,
                goal.target_amount,
                goal.current_amount || 0,
                goal.target_date || null,
                goal.created_at || new Date().toISOString()
              ]
            );
            result.savingsGoals++;
          } catch (err) {
            console.warn('⚠️ Erreur import objectif épargne:', err);
          }
        }
      }
      
      // Restaurer les transactions récurrentes
      if (data.recurringTransactions && Array.isArray(data.recurringTransactions)) {
        console.log(`🔄 Import de ${data.recurringTransactions.length} transactions récurrentes...`);
        for (const recurring of data.recurringTransactions) {
          try {
            await db.runAsync(
              `INSERT OR REPLACE INTO recurring_transactions (
                id, user_id, amount, type, category, account_id, 
                description, frequency, start_date, end_date, 
                is_active, created_at
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                recurring.id || `rec_${Date.now()}`,
                recurring.user_id || 'default-user',
                recurring.amount,
                recurring.type,
                recurring.category,
                recurring.account_id,
                recurring.description || '',
                recurring.frequency || 'monthly',
                recurring.start_date,
                recurring.end_date || null,
                recurring.is_active !== false ? 1 : 0,
                recurring.created_at || new Date().toISOString()
              ]
            );
            result.recurringTransactions++;
          } catch (err) {
            console.warn('⚠️ Erreur import transaction récurrente:', err);
          }
        }
      }
      
      await db.execAsync('COMMIT');
      
      console.log('✅ Import terminé:', result);
      return result;
      
    } catch (error) {
      await db.execAsync('ROLLBACK');
      console.error('❌ Erreur restauration base de données:', error);
      throw error;
    }
  }
}
