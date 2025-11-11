// src/services/currencyMigrationService.ts - NOUVEAU FICHIER
import { getDatabase } from './database/sqlite';
import { secureStorage } from './storage/secureStorage';

export const currencyMigrationService = {
  /**
   * Migre toutes les données existantes vers MAD
   */
  async migrateAllDataToMAD(userId: string = 'default-user'): Promise<{
    success: boolean;
    migrated: {
      accounts: number;
      transactions: number;
      budgets: number;
      savings: number;
      debts: number;
    };
    errors: string[];
  }> {
    const results = {
      success: true,
      migrated: {
        accounts: 0,
        transactions: 0,
        budgets: 0,
        savings: 0,
        debts: 0
      },
      errors: [] as string[]
    };

    try {
      const db = await getDatabase();
      
      await db.execAsync('BEGIN TRANSACTION');

      try {
        // 1. Migrer les comptes
        const accountsResult = await db.runAsync(
          'UPDATE accounts SET currency = ? WHERE user_id = ? AND currency != ?',
          ['MAD', userId, 'MAD']
        );
        results.migrated.accounts = accountsResult.changes || 0;

        // 2. Migrer les transactions (mettre à jour currency si le champ existe)
        try {
          const transactionsResult = await db.runAsync(
            'UPDATE transactions SET currency = ? WHERE user_id = ? AND (currency IS NULL OR currency != ?)',
            ['MAD', userId, 'MAD']
          );
          results.migrated.transactions = transactionsResult.changes || 0;
        } catch (error) {
          console.log('ℹ️ Table transactions n\'a pas de colonne currency');
        }

        // 3. Migrer les budgets
        try {
          const budgetsResult = await db.runAsync(
            'UPDATE budgets SET currency = ? WHERE user_id = ? AND (currency IS NULL OR currency != ?)',
            ['MAD', userId, 'MAD']
          );
          results.migrated.budgets = budgetsResult.changes || 0;
        } catch (error) {
          console.log('ℹ️ Table budgets n\'a pas de colonne currency');
        }

        // 4. Migrer les objectifs d'épargne
        try {
          const savingsResult = await db.runAsync(
            'UPDATE savings_goals SET currency = ? WHERE user_id = ? AND (currency IS NULL OR currency != ?)',
            ['MAD', userId, 'MAD']
          );
          results.migrated.savings = savingsResult.changes || 0;
        } catch (error) {
          console.log('ℹ️ Table savings_goals n\'a pas de colonne currency');
        }

        // 5. Migrer les dettes
        try {
          const debtsResult = await db.runAsync(
            'UPDATE debts SET currency = ? WHERE user_id = ? AND (currency IS NULL OR currency != ?)',
            ['MAD', userId, 'MAD']
          );
          results.migrated.debts = debtsResult.changes || 0;
        } catch (error) {
          console.log('ℹ️ Table debts n\'a pas de colonne currency');
        }

        await db.execAsync('COMMIT');
        
        console.log('✅ Migration vers MAD terminée:', results.migrated);
        
      } catch (error) {
        await db.execAsync('ROLLBACK');
        throw error;
      }

      // 6. Forcer MAD comme devise dans le stockage
      await secureStorage.setItem('selectedCurrency', JSON.stringify({
        code: 'MAD',
        symbol: 'MAD ',
        name: 'Dirham Marocain',
        locale: 'fr-FR'
      }));
      
      await secureStorage.setItem('base_currency', 'MAD');

    } catch (error) {
      results.success = false;
      results.errors.push(error instanceof Error ? error.message : 'Erreur inconnue');
      console.error('❌ Erreur migration vers MAD:', error);
    }

    return results;
  },

  /**
   * Vérifie la cohérence des devises dans toute la base
   */
  async checkCurrencyConsistency(userId: string = 'default-user'): Promise<{
    isConsistent: boolean;
    details: {
      table: string;
      total: number;
      madCount: number;
      otherCount: number;
      otherCurrencies: string[];
    }[];
    issues: string[];
  }> {
    const details = [];
    const issues = [];

    try {
      const db = await getDatabase();

      // Vérifier les comptes
      const accounts = await db.getAllAsync(
        'SELECT currency, COUNT(*) as count FROM accounts WHERE user_id = ? GROUP BY currency',
        [userId]
      ) as { currency: string; count: number }[];
      
      const accountDetail = {
        table: 'accounts',
        total: accounts.reduce((sum, acc) => sum + acc.count, 0),
        madCount: accounts.find(acc => acc.currency === 'MAD')?.count || 0,
        otherCount: accounts.filter(acc => acc.currency !== 'MAD').reduce((sum, acc) => sum + acc.count, 0),
        otherCurrencies: accounts.filter(acc => acc.currency !== 'MAD').map(acc => acc.currency)
      };
      details.push(accountDetail);

      if (accountDetail.otherCount > 0) {
        issues.push(`Comptes avec devises autres que MAD: ${accountDetail.otherCurrencies.join(', ')}`);
      }

      // Vérifier d'autres tables si elles ont une colonne currency
      const tablesToCheck = ['transactions', 'budgets', 'savings_goals', 'debts'];
      
      for (const table of tablesToCheck) {
        try {
          const tableData = await db.getAllAsync(
            `SELECT currency, COUNT(*) as count FROM ${table} WHERE user_id = ? GROUP BY currency`,
            [userId]
          ) as { currency: string; count: number }[];
          
          const tableDetail = {
            table,
            total: tableData.reduce((sum, item) => sum + item.count, 0),
            madCount: tableData.find(item => item.currency === 'MAD')?.count || 0,
            otherCount: tableData.filter(item => item.currency !== 'MAD').reduce((sum, item) => sum + item.count, 0),
            otherCurrencies: tableData.filter(item => item.currency !== 'MAD').map(item => item.currency)
          };
          details.push(tableDetail);

          if (tableDetail.otherCount > 0) {
            issues.push(`${table} avec devises autres que MAD: ${tableDetail.otherCurrencies.join(', ')}`);
          }
        } catch (error) {
          console.log(`ℹ️ Table ${table} n'a pas de colonne currency ou n'existe pas`);
        }
      }

    } catch (error) {
      console.error('❌ Erreur vérification cohérence devises:', error);
      issues.push('Erreur lors de la vérification de cohérence');
    }

    return {
      isConsistent: issues.length === 0,
      details,
      issues
    };
  }
};

export default currencyMigrationService;