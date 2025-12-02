// src/services/backup/importService.ts
import * as FileSystem from 'expo-file-system/legacy';
import { getDatabase } from '../database/sqlite';

export class ImportService {
  // Helper pour mapper camelCase vers snake_case
  private static mapField(obj: any, camelCase: string, snakeCase: string, defaultValue?: any): any {
    // Essayer d'abord la version camelCase
    if (obj[camelCase] !== undefined) {
      return obj[camelCase];
    }
    // Sinon essayer snake_case
    if (obj[snakeCase] !== undefined) {
      return obj[snakeCase];
    }
    // Valeur par défaut
    return defaultValue;
  }

  // Importer et restaurer depuis un fichier JSON
  static async importFromJSON(fileUri: string): Promise<{ success: boolean; error?: string; imported?: any }> {
    try {
      console.log('📥 Début import JSON:', fileUri);
      
      // Lire le fichier
      const fileContent = await FileSystem.readAsStringAsync(fileUri);
      let backupData: any = JSON.parse(fileContent);
      
      // 🔧 AUTO-FIX: Détecter et corriger l'ancien format (sans wrapper "data")
      if (!backupData.data) {
        console.log('🔄 Ancien format détecté, conversion automatique...');
        
        // Vérifier si c'est un ancien format avec les données directement à la racine
        const hasOldFormatKeys = backupData.accounts || backupData.transactions || 
                                  backupData.categories || backupData.budgets;
        
        if (hasOldFormatKeys) {
          // Convertir vers le nouveau format
          backupData = {
            version: backupData.version || '1.0.0',
            timestamp: backupData.timestamp || new Date().toISOString(),
            data: {
              accounts: backupData.accounts || [],
              transactions: backupData.transactions || [],
              categories: backupData.categories || [],
              budgets: backupData.budgets || [],
              debts: backupData.debts || [],
              savingsGoals: backupData.savingsGoals || [],
              annualCharges: backupData.annualCharges || [],
              recurringTransactions: backupData.recurringTransactions || []
            }
          };
          console.log('✅ Format converti automatiquement');
        } else {
          throw new Error('Format de sauvegarde invalide : propriété "data" manquante et pas de données détectées');
        }
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
                this.mapField(account, 'userId', 'user_id', 'default-user'),
                account.name,
                account.type,
                account.balance || 0,
                account.currency || 'MAD',
                account.color || '#6C63FF',
                account.icon || 'wallet',
                this.mapField(account, 'isActive', 'is_active', true) ? 1 : 0,
                this.mapField(account, 'createdAt', 'created_at', new Date().toISOString()),
                new Date().toISOString()
              ]
            );
            result.accounts++;
          } catch (err) {
            console.warn('⚠️ Erreur import compte:', account, err);
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
                this.mapField(transaction, 'userId', 'user_id', 'default-user'),
                transaction.amount,
                transaction.type,
                transaction.category,
                this.mapField(transaction, 'subCategory', 'sub_category', null),
                this.mapField(transaction, 'accountId', 'account_id'),
                transaction.description || '',
                transaction.date,
                this.mapField(transaction, 'isRecurring', 'is_recurring', false) ? 1 : 0,
                this.mapField(transaction, 'recurrenceType', 'recurrence_type', null),
                this.mapField(transaction, 'recurrenceEndDate', 'recurrence_end_date', null),
                this.mapField(transaction, 'parentTransactionId', 'parent_transaction_id', null),
                this.mapField(transaction, 'createdAt', 'created_at', new Date().toISOString())
              ]
            );
            result.transactions++;
          } catch (err) {
            console.warn('⚠️ Erreur import transaction:', transaction, err);
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
                this.mapField(category, 'userId', 'user_id', 'default-user'),
                category.name,
                category.type,
                category.color || '#6C63FF',
                category.icon || 'help-circle',
                this.mapField(category, 'parentId', 'parent_id', null),
                this.mapField(category, 'isActive', 'is_active', true) ? 1 : 0,
                this.mapField(category, 'createdAt', 'created_at', new Date().toISOString())
              ]
            );
            result.categories++;
          } catch (err) {
            console.warn('⚠️ Erreur import catégorie:', category, err);
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
                this.mapField(budget, 'userId', 'user_id', 'default-user'),
                this.mapField(budget, 'categoryId', 'category_id'),
                budget.amount,
                budget.period || 'monthly',
                this.mapField(budget, 'startDate', 'start_date'),
                this.mapField(budget, 'endDate', 'end_date', null),
                this.mapField(budget, 'createdAt', 'created_at', new Date().toISOString())
              ]
            );
            result.budgets++;
          } catch (err) {
            console.warn('⚠️ Erreur import budget:', budget, err);
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
                this.mapField(charge, 'userId', 'user_id', 'default-user'),
                charge.name,
                charge.amount,
                charge.category || 'Autre',
                this.mapField(charge, 'dueDate', 'due_date'),
                this.mapField(charge, 'isPaid', 'is_paid', false) ? 1 : 0,
                this.mapField(charge, 'autoDeduct', 'auto_deduct', false) ? 1 : 0,
                this.mapField(charge, 'accountId', 'account_id', null),
                this.mapField(charge, 'createdAt', 'created_at', new Date().toISOString())
              ]
            );
            result.annualCharges++;
          } catch (err) {
            console.warn('⚠️ Erreur import charge annuelle:', charge, err);
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
                this.mapField(debt, 'userId', 'user_id', 'default-user'),
                debt.name,
                debt.amount,
                this.mapField(debt, 'paidAmount', 'paid_amount', 0),
                debt.creditor || '',
                this.mapField(debt, 'dueDate', 'due_date', null),
                this.mapField(debt, 'isPaid', 'is_paid', false) ? 1 : 0,
                this.mapField(debt, 'createdAt', 'created_at', new Date().toISOString())
              ]
            );
            result.debts++;
          } catch (err) {
            console.warn('⚠️ Erreur import dette:', debt, err);
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
                this.mapField(goal, 'userId', 'user_id', 'default-user'),
                goal.name,
                this.mapField(goal, 'targetAmount', 'target_amount'),
                this.mapField(goal, 'currentAmount', 'current_amount', 0),
                this.mapField(goal, 'targetDate', 'target_date', null),
                this.mapField(goal, 'createdAt', 'created_at', new Date().toISOString())
              ]
            );
            result.savingsGoals++;
          } catch (err) {
            console.warn('⚠️ Erreur import objectif épargne:', goal, err);
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
                this.mapField(recurring, 'userId', 'user_id', 'default-user'),
                recurring.amount,
                recurring.type,
                recurring.category,
                this.mapField(recurring, 'accountId', 'account_id'),
                recurring.description || '',
                recurring.frequency || 'monthly',
                this.mapField(recurring, 'startDate', 'start_date'),
                this.mapField(recurring, 'endDate', 'end_date', null),
                this.mapField(recurring, 'isActive', 'is_active', true) ? 1 : 0,
                this.mapField(recurring, 'createdAt', 'created_at', new Date().toISOString())
              ]
            );
            result.recurringTransactions++;
          } catch (err) {
            console.warn('⚠️ Erreur import transaction récurrente:', recurring, err);
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
