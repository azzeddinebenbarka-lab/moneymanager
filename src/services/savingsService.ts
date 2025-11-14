// src/services/savingsService.ts - VERSION COMPLÈTEMENT CORRIGÉE
import {
  CreateSavingsGoalData,
  SavingsContribution,
  SavingsGoal,
  SavingsStats,
  UpdateSavingsGoalData
} from '../types/Savings';
import { accountService } from './accountService';
import { getDatabase } from './database/sqlite';
import { transferService } from './transferService';

interface DatabaseSavingsGoal {
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

interface DatabaseSavingsContribution {
  id: string;
  goal_id: string;
  user_id: string;
  amount: number;
  date: string;
  created_at: string;
  from_account_id?: string;
}

export const savingsService = {
  // ✅ MÉTHODE AMÉLIORÉE : Supprimer un objectif d'épargne avec ses transactions
  async deleteSavingsGoalWithTransactions(
    goalId: string, 
    deleteTransactions: boolean = true,
    userId: string = 'default-user'
  ): Promise<void> {
    try {
      console.log('🗑️ [savingsService] Deleting savings goal with transactions:', { 
        goalId, 
        deleteTransactions 
      });
      
      const goal = await this.getSavingsGoalById(goalId, userId);
      if (!goal) {
        throw new Error('Objectif d\'épargne non trouvé');
      }

      const db = await getDatabase();
      
      await db.execAsync('BEGIN TRANSACTION');

      try {
        const contributionsDeleted = await db.runAsync(
          'DELETE FROM savings_contributions WHERE goal_id = ? AND user_id = ?',
          [goalId, userId]
        );
        console.log(`✅ [savingsService] ${contributionsDeleted.changes || 0} contributions supprimées`);

        let transactionsDeleted = 0;
        if (deleteTransactions) {
          transactionsDeleted = await this.deleteRelatedTransactions(goalId, userId);
        }

        await db.runAsync(
          'DELETE FROM savings_goals WHERE id = ? AND user_id = ?',
          [goalId, userId]
        );

        await db.execAsync('COMMIT');
        
        console.log(`✅ [savingsService] Savings goal deleted successfully: ${contributionsDeleted.changes || 0} contributions, ${transactionsDeleted} transactions`);
        
      } catch (error) {
        await db.execAsync('ROLLBACK');
        console.error('❌ [savingsService] Transaction failed, rolling back:', error);
        throw new Error(`Échec de la suppression: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      }

    } catch (error) {
      console.error('❌ [savingsService] Error deleting savings goal with transactions:', error);
      throw error;
    }
  },

  // ✅ MÉTHODE AMÉLIORÉE : Supprimer les transactions liées à un objectif d'épargne
  async deleteRelatedTransactions(goalId: string, userId: string = 'default-user'): Promise<number> {
    try {
      console.log('🔍 [savingsService] Searching for transactions related to savings goal:', goalId);
      
      const goal = await this.getSavingsGoalById(goalId, userId);
      if (!goal) {
        console.log('⚠️ [savingsService] Goal not found, skipping transaction deletion');
        return 0;
      }

      let deletedCount = 0;

      const searchPatterns = [
        `%Épargne: ${goal.name}%`,
        `%épargne: ${goal.name}%`,
        `%Savings: ${goal.name}%`,
        `%savings: ${goal.name}%`,
        `%${goal.name}%`,
        `%Remboursement: ${goal.name}%`,
        `%remboursement: ${goal.name}%`,
        `%Refund: ${goal.name}%`,
        `%refund: ${goal.name}%`
      ];

      for (const pattern of searchPatterns) {
        try {
          const { transactionService } = await import('./transactionService');
          const allTransactions = await transactionService.getAllTransactions(userId);
          const transactions = allTransactions.filter(tx => 
            tx.description && tx.description.toLowerCase().includes(pattern.replace(/%/g, '').toLowerCase())
          );

          for (const transaction of transactions) {
            try {
              await transactionService.deleteTransaction(transaction.id, userId);
              deletedCount++;
              console.log(`✅ [savingsService] Deleted transaction: ${transaction.id} - ${transaction.description}`);
            } catch (txError) {
              console.warn(`⚠️ [savingsService] Could not delete transaction ${transaction.id}:`, txError);
            }
          }
        } catch (error) {
          console.warn(`⚠️ [savingsService] Error searching transactions with pattern ${pattern}:`, error);
        }
      }

      if (goal.savingsAccountId) {
        try {
          const { transactionService } = await import('./transactionService');
          const savingsTransactions = await transactionService.getTransactionsByAccount(goal.savingsAccountId, userId);
          
          const relatedTransactions = savingsTransactions.filter(tx => 
            tx.description.includes(goal.name) ||
            tx.description.includes('Épargne') ||
            tx.description.includes('épargne') ||
            tx.description.includes('Savings') ||
            tx.description.includes('savings')
          );

          for (const transaction of relatedTransactions) {
            try {
              await transactionService.deleteTransaction(transaction.id, userId);
              deletedCount++;
              console.log(`✅ [savingsService] Deleted savings account transaction: ${transaction.id}`);
            } catch (txError) {
              console.warn(`⚠️ [savingsService] Could not delete savings transaction ${transaction.id}:`, txError);
            }
          }
        } catch (error) {
          console.warn('⚠️ [savingsService] Error searching savings account transactions:', error);
        }
      }

      console.log(`✅ [savingsService] Deleted ${deletedCount} transactions related to goal: ${goal.name}`);
      return deletedCount;
      
    } catch (error) {
      console.error('❌ [savingsService] Error deleting related transactions:', error);
      return 0;
    }
  },

  // ✅ MÉTHODE EXISTANTE AMÉLIORÉE : Suppression avec remboursement et transactions
  async deleteSavingsGoalWithRefund(
    goalId: string, 
    deleteTransactions: boolean = true,
    userId: string = 'default-user'
  ): Promise<void> {
    try {
      console.log('🔄 [savingsService] Deleting savings goal with refund and transactions:', { 
        goalId, 
        deleteTransactions 
      });
      
      const goal = await this.getSavingsGoalById(goalId, userId);
      if (!goal) {
        throw new Error('Objectif d\'épargne non trouvé');
      }

      const contributions = await this.getContributionHistory(goalId, userId);
      
      const db = await getDatabase();
      
      await db.execAsync('BEGIN TRANSACTION');

      try {
        let totalRefunded = 0;
        let refundedContributions = 0;

        for (const contribution of contributions.reverse()) {
          if (contribution.fromAccountId && goal.savingsAccountId) {
            console.log('💰 [savingsService] Refunding contribution:', {
              amount: contribution.amount,
              fromAccount: contribution.fromAccountId,
              toAccount: goal.savingsAccountId
            });
            
            const date = new Date().toISOString().split('T')[0];
            
            const savingsAccount = await accountService.getAccountById(goal.savingsAccountId);
            if (!savingsAccount) {
              console.warn(`⚠️ Compte épargne ${goal.savingsAccountId} non trouvé, skip remboursement`);
              continue;
            }
            
            if (savingsAccount.balance < contribution.amount) {
              console.warn(`⚠️ Solde insuffisant pour rembourser ${contribution.amount} (solde: ${savingsAccount.balance})`);
              continue;
            }

            await transferService.executeSavingsRefund({
              fromAccountId: goal.savingsAccountId,
              toAccountId: contribution.fromAccountId,
              amount: contribution.amount,
              description: `Remboursement: ${goal.name}`,
              date: date
            }, goal.name, userId);

            totalRefunded += contribution.amount;
            refundedContributions++;
            console.log('✅ [savingsService] Contribution refunded successfully');
          }
        }

        await db.runAsync(
          'DELETE FROM savings_contributions WHERE goal_id = ? AND user_id = ?',
          [goalId, userId]
        );

        let transactionsDeleted = 0;
        if (deleteTransactions) {
          transactionsDeleted = await this.deleteRelatedTransactions(goalId, userId);
        }

        await db.runAsync(
          'DELETE FROM savings_goals WHERE id = ? AND user_id = ?',
          [goalId, userId]
        );

        await db.execAsync('COMMIT');
        
        console.log(`✅ [savingsService] Savings goal deleted with refund successfully. ${refundedContributions}/${contributions.length} contributions refunded (${totalRefunded}), ${transactionsDeleted} transactions deleted`);

      } catch (error) {
        await db.execAsync('ROLLBACK');
        console.error('❌ [savingsService] Transaction failed, rolling back:', error);
        throw new Error(`Échec du remboursement: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      }

    } catch (error) {
      console.error('❌ [savingsService] Error deleting savings goal with refund:', error);
      throw error;
    }
  },

  // ✅ NOUVELLE MÉTHODE : Vérifier les transactions liées à un objectif
  async getRelatedTransactionsCount(goalId: string, userId: string = 'default-user'): Promise<number> {
    try {
      const goal = await this.getSavingsGoalById(goalId, userId);
      if (!goal) return 0;

      let totalCount = 0;

      const searchPatterns = [
        `%Épargne: ${goal.name}%`,
        `%épargne: ${goal.name}%`,
        `%Savings: ${goal.name}%`,
        `%savings: ${goal.name}%`,
        `%${goal.name}%`
      ];

      for (const pattern of searchPatterns) {
        try {
          const { transactionService } = await import('./transactionService');
          const allTransactions = await transactionService.getAllTransactions(userId);
          const transactions = allTransactions.filter(tx => 
            tx.description && tx.description.toLowerCase().includes(pattern.replace(/%/g, '').toLowerCase())
          );
          totalCount += transactions.length;
        } catch (error) {
          console.warn(`⚠️ [savingsService] Error counting transactions with pattern ${pattern}:`, error);
        }
      }

      console.log(`🔍 [savingsService] Found ${totalCount} related transactions for goal: ${goal.name}`);
      return totalCount;

    } catch (error) {
      console.error('❌ [savingsService] Error counting related transactions:', error);
      return 0;
    }
  },

  // ✅ NOUVELLE MÉTHODE : Obtenir les détails des transactions liées
  async getRelatedTransactionsDetails(goalId: string, userId: string = 'default-user'): Promise<any[]> {
    try {
      const goal = await this.getSavingsGoalById(goalId, userId);
      if (!goal) return [];

      const allRelatedTransactions: any[] = [];

      const searchPatterns = [
        `%Épargne: ${goal.name}%`,
        `%épargne: ${goal.name}%`,
        `%Savings: ${goal.name}%`,
        `%savings: ${goal.name}%`,
        `%${goal.name}%`
      ];

      for (const pattern of searchPatterns) {
        try {
          const { transactionService } = await import('./transactionService');
          const allTransactions = await transactionService.getAllTransactions(userId);
          const transactions = allTransactions.filter(tx => 
            tx.description && tx.description.toLowerCase().includes(pattern.replace(/%/g, '').toLowerCase())
          );
          
          allRelatedTransactions.push(...transactions.map(tx => ({
            ...tx,
            matchPattern: pattern
          })));
        } catch (error) {
          console.warn(`⚠️ [savingsService] Error getting transactions with pattern ${pattern}:`, error);
        }
      }

      const uniqueTransactions = allRelatedTransactions.filter((tx, index, self) =>
        index === self.findIndex(t => t.id === tx.id)
      );

      console.log(`🔍 [savingsService] Found ${uniqueTransactions.length} unique related transactions for goal: ${goal.name}`);
      return uniqueTransactions;

    } catch (error) {
      console.error('❌ [savingsService] Error getting related transactions details:', error);
      return [];
    }
  },

  // ✅ MÉTHODE AMÉLIORÉE : Ajouter une contribution avec validation de compte
  async addContribution(goalId: string, amount: number, fromAccountId?: string, userId: string = 'default-user'): Promise<string> {
    try {
      console.log('🔄 [savingsService] Ajout contribution avec validation...', { 
        goalId, 
        amount, 
        fromAccountId 
      });
      
      const goal = await this.getSavingsGoalById(goalId, userId);
      if (!goal) {
        throw new Error('Objectif d\'épargne non trouvé');
      }

      let effectiveFromAccountId = fromAccountId;
      let effectiveSavingsAccountId = goal.savingsAccountId;

      // ✅ VALIDATION COMPTE SOURCE
      if (!effectiveFromAccountId) {
        const validAccount = await accountService.findValidAccountForOperation(amount);
        if (validAccount) {
          effectiveFromAccountId = validAccount.id;
          console.log('💰 [savingsService] Compte source auto-assigné:', effectiveFromAccountId);
        } else {
          throw new Error('Aucun compte source disponible avec suffisamment de fonds');
        }
      }

      // ✅ VALIDATION COMPTE SOURCE
      const sourceValidation = await accountService.validateAccountForOperation(effectiveFromAccountId, amount, 'debit');
      if (!sourceValidation.isValid) {
        throw new Error(sourceValidation.message || 'Compte source invalide');
      }

      // ✅ VALIDATION COMPTE ÉPARGNE
      if (!effectiveSavingsAccountId) {
        const savingsAccounts = await accountService.getAccountsByType('savings');
        const activeSavingsAccounts = savingsAccounts.filter(acc => acc.isActive);
        
        if (activeSavingsAccounts.length > 0) {
          effectiveSavingsAccountId = activeSavingsAccounts[0].id;
          await this.updateSavingsGoal(goalId, { savingsAccountId: effectiveSavingsAccountId }, userId);
          console.log('💰 [savingsService] Compte épargne auto-assigné:', effectiveSavingsAccountId);
        } else {
          throw new Error('Aucun compte d\'épargne actif disponible');
        }
      }

      const savingsValidation = await accountService.validateAccountForOperation(effectiveSavingsAccountId);
      if (!savingsValidation.isValid) {
        throw new Error(savingsValidation.message || 'Compte épargne invalide');
      }

      console.log('💰 [savingsService] Création transfert épargne...', {
        fromAccountId: effectiveFromAccountId,
        toAccountId: effectiveSavingsAccountId,
        amount
      });

      // ✅ UTILISER transferService CORRIGÉ
      await transferService.executeSavingsTransfer({
        fromAccountId: effectiveFromAccountId,
        toAccountId: effectiveSavingsAccountId,
        amount: amount,
        description: `Épargne: ${goal.name}`,
        date: new Date().toISOString().split('T')[0],
      }, goal.name, userId);
      
      console.log('✅ [savingsService] Transfert créé avec succès');

      const db = await getDatabase();
      const id = `contrib_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const date = new Date().toISOString().split('T')[0];
      const createdAt = new Date().toISOString();

      await this.ensureContributionsTableExists();

      await db.runAsync(
        `INSERT INTO savings_contributions (id, goal_id, user_id, amount, date, created_at, from_account_id) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [id, goalId, userId, amount, date, createdAt, effectiveFromAccountId]
      );

      const newAmount = goal.currentAmount + amount;
      const isCompleted = newAmount >= goal.targetAmount;

      await db.runAsync(
        `UPDATE savings_goals SET current_amount = ?, is_completed = ? WHERE id = ? AND user_id = ?`,
        [newAmount, isCompleted ? 1 : 0, goalId, userId]
      );

      console.log('✅ [savingsService] Contribution ajoutée avec succès');
      return id;
    } catch (error) {
      console.error('❌ [savingsService] Error in addContribution:', error);
      throw error;
    }
  },

  // MÉTHODES EXISTANTES (conservées pour compatibilité)
  async createSavingsGoal(goalData: CreateSavingsGoalData, userId: string = 'default-user'): Promise<string> {
    try {
      const db = await getDatabase();
      const id = `savings_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const createdAt = new Date().toISOString();

      console.log('🔄 [savingsService] Creating savings goal:', { id, ...goalData });
      
      let savingsAccountId = goalData.savingsAccountId;
      if (!savingsAccountId) {
        const savingsAccounts = await accountService.getAccountsByType('savings');
        if (savingsAccounts.length > 0) {
          savingsAccountId = savingsAccounts[0].id;
          console.log('💰 [savingsService] Auto-assigned savings account:', savingsAccountId);
        }
      }
      
      await db.runAsync(
        `INSERT INTO savings_goals (
          id, user_id, name, target_amount, current_amount, target_date, 
          monthly_contribution, category, color, icon, is_completed, created_at,
          savings_account_id, contribution_account_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          userId,
          goalData.name,
          goalData.targetAmount,
          0,
          goalData.targetDate,
          goalData.monthlyContribution,
          goalData.category,
          goalData.color,
          goalData.icon,
          0,
          createdAt,
          savingsAccountId || null,
          goalData.contributionAccountId || null
        ]
      );
      
      console.log('✅ [savingsService] Savings goal created successfully');
      return id;
    } catch (error) {
      console.error('❌ [savingsService] Error in createSavingsGoal:', error);
      throw error;
    }
  },

  async getAllSavingsGoals(userId: string = 'default-user'): Promise<SavingsGoal[]> {
    try {
      const db = await getDatabase();
      
      const result = await db.getAllAsync(
        `SELECT * FROM savings_goals WHERE user_id = ? ORDER BY 
         CASE 
           WHEN is_completed = 1 THEN 2 
           ELSE 1 
         END, target_date ASC`,
        [userId]
      ) as DatabaseSavingsGoal[];
      
      const goals: SavingsGoal[] = result.map((item) => ({
        id: item.id,
        userId: item.user_id,
        name: item.name,
        targetAmount: item.target_amount,
        currentAmount: item.current_amount,
        targetDate: item.target_date,
        monthlyContribution: item.monthly_contribution,
        category: item.category as SavingsGoal['category'],
        color: item.color,
        icon: item.icon,
        isCompleted: Boolean(item.is_completed),
        createdAt: item.created_at,
        savingsAccountId: item.savings_account_id || undefined,
        contributionAccountId: item.contribution_account_id || undefined,
      }));
      
      return goals;
    } catch (error) {
      console.error('❌ [savingsService] Error in getAllSavingsGoals:', error);
      throw error;
    }
  },

  async getSavingsGoalById(id: string, userId: string = 'default-user'): Promise<SavingsGoal | null> {
    try {
      const db = await getDatabase();
      
      const result = await db.getFirstAsync(
        `SELECT * FROM savings_goals WHERE id = ? AND user_id = ?`,
        [id, userId]
      ) as DatabaseSavingsGoal | null;
      
      if (result) {
        const goal: SavingsGoal = {
          id: result.id,
          userId: result.user_id,
          name: result.name,
          targetAmount: result.target_amount,
          currentAmount: result.current_amount,
          targetDate: result.target_date,
          monthlyContribution: result.monthly_contribution,
          category: result.category as SavingsGoal['category'],
          color: result.color,
          icon: result.icon,
          isCompleted: Boolean(result.is_completed),
          createdAt: result.created_at,
          savingsAccountId: result.savings_account_id || undefined,
          contributionAccountId: result.contribution_account_id || undefined,
        };
        return goal;
      }
      return null;
    } catch (error) {
      console.error('❌ [savingsService] Error in getSavingsGoalById:', error);
      throw error;
    }
  },

  async updateSavingsGoal(id: string, updates: UpdateSavingsGoalData, userId: string = 'default-user'): Promise<void> {
    try {
      const db = await getDatabase();
      
      const fields = Object.keys(updates);
      if (fields.length === 0) return;

      const setClause = fields.map(field => {
        const dbField = field === 'targetAmount' ? 'target_amount' :
                       field === 'currentAmount' ? 'current_amount' :
                       field === 'targetDate' ? 'target_date' :
                       field === 'monthlyContribution' ? 'monthly_contribution' :
                       field === 'isCompleted' ? 'is_completed' :
                       field === 'savingsAccountId' ? 'savings_account_id' :
                       field === 'contributionAccountId' ? 'contribution_account_id' : field;
        return `${dbField} = ?`;
      }).join(', ');

      const values = fields.map(field => {
        const value = (updates as any)[field];
        return field === 'isCompleted' ? (value ? 1 : 0) : value;
      });
      values.push(id, userId);

      await db.runAsync(
        `UPDATE savings_goals SET ${setClause} WHERE id = ? AND user_id = ?`,
        values
      );
      
      console.log('✅ [savingsService] Savings goal updated successfully');
    } catch (error) {
      console.error('❌ [savingsService] Error in updateSavingsGoal:', error);
      throw error;
    }
  },

  async deleteSavingsGoal(id: string, userId: string = 'default-user'): Promise<void> {
    try {
      const db = await getDatabase();
      
      await db.runAsync(
        `DELETE FROM savings_goals WHERE id = ? AND user_id = ?`,
        [id, userId]
      );
      
      console.log('✅ [savingsService] Savings goal deleted successfully');
    } catch (error) {
      console.error('❌ [savingsService] Error in deleteSavingsGoal:', error);
      throw error;
    }
  },

  async getContributionHistory(goalId: string, userId: string = 'default-user'): Promise<SavingsContribution[]> {
    try {
      const db = await getDatabase();
      
      await this.ensureContributionsTableExists();
      
      const result = await db.getAllAsync(
        `SELECT sc.* FROM savings_contributions sc
         JOIN savings_goals sg ON sc.goal_id = sg.id
         WHERE sc.goal_id = ? AND sg.user_id = ?
         ORDER BY sc.date DESC`,
        [goalId, userId]
      ) as DatabaseSavingsContribution[];

      const contributions: SavingsContribution[] = result.map((item) => ({
        id: item.id,
        goalId: item.goal_id,
        amount: item.amount,
        date: item.date,
        createdAt: item.created_at,
        fromAccountId: item.from_account_id || undefined,
      }));

      return contributions;
    } catch (error) {
      console.error('❌ [savingsService] Error in getContributionHistory:', error);
      throw error;
    }
  },

  async deleteContributionWithRefund(contributionId: string, userId: string = 'default-user'): Promise<void> {
    try {
      console.log('🔄 [savingsService] Deleting contribution with refund:', contributionId);
      
      const db = await getDatabase();
      
      const contribution = await db.getFirstAsync(
        `SELECT * FROM savings_contributions WHERE id = ? AND user_id = ?`,
        [contributionId, userId]
      ) as DatabaseSavingsContribution | null;

      if (!contribution) {
        throw new Error('Contribution non trouvée');
      }

      const goal = await this.getSavingsGoalById(contribution.goal_id, userId);
      if (!goal) {
        throw new Error('Objectif d\'épargne non trouvé');
      }

      await db.execAsync('BEGIN TRANSACTION');

      try {
        if (contribution.from_account_id && goal.savingsAccountId) {
          console.log('💰 [savingsService] Refunding contribution amount:', {
            amount: contribution.amount,
            fromAccount: contribution.from_account_id,
            toAccount: goal.savingsAccountId
          });
          
          const date = new Date().toISOString().split('T')[0];
          
          await transferService.executeSavingsRefund({
            fromAccountId: goal.savingsAccountId,
            toAccountId: contribution.from_account_id,
            amount: contribution.amount,
            description: `Annulation: ${goal.name}`,
            date: date
          }, goal.name, userId);

          console.log('✅ [savingsService] Contribution refunded successfully');
        }

        const newAmount = Math.max(0, goal.currentAmount - contribution.amount);
        const isCompleted = newAmount >= goal.targetAmount;
        
        await db.runAsync(
          'UPDATE savings_goals SET current_amount = ?, is_completed = ? WHERE id = ? AND user_id = ?',
          [newAmount, isCompleted ? 1 : 0, goal.id, userId]
        );

        await db.runAsync(
          'DELETE FROM savings_contributions WHERE id = ? AND user_id = ?',
          [contributionId, userId]
        );

        await db.execAsync('COMMIT');
        
        console.log('✅ [savingsService] Contribution deleted with refund successfully');

      } catch (error) {
        await db.execAsync('ROLLBACK');
        console.error('❌ [savingsService] Transaction failed, rolling back:', error);
        throw error;
      }

    } catch (error) {
      console.error('❌ [savingsService] Error deleting contribution with refund:', error);
      throw error;
    }
  },

  async processAutoContributions(userId: string = 'default-user'): Promise<{ processed: number; errors: string[] }> {
    try {
      const goals = await this.getAllSavingsGoals(userId);
      const autoContributionGoals = goals.filter(goal => 
        !goal.isCompleted && 
        goal.monthlyContribution > 0 &&
        goal.contributionAccountId &&
        goal.savingsAccountId
      );

      const errors: string[] = [];
      let processed = 0;

      for (const goal of autoContributionGoals) {
        try {
          await this.addContribution(
            goal.id,
            goal.monthlyContribution,
            goal.contributionAccountId,
            userId
          );
          processed++;
        } catch (error) {
          errors.push(`Erreur avec l'objectif ${goal.name}: ${error}`);
        }
      }

      return { processed, errors };
    } catch (error) {
      console.error('❌ [savingsService] Error in processAutoContributions:', error);
      throw error;
    }
  },

  async getSavingsStats(userId: string = 'default-user'): Promise<SavingsStats> {
    try {
      const goals = await this.getAllSavingsGoals(userId);
      const activeGoals = goals.filter(goal => !goal.isCompleted);
      const completedGoals = goals.filter(goal => goal.isCompleted);
      
      const totalSaved = goals.reduce((sum: number, goal) => sum + goal.currentAmount, 0);
      const monthlyContributions = activeGoals.reduce((sum: number, goal) => sum + goal.monthlyContribution, 0);
      
      const totalTarget = goals.reduce((sum: number, goal) => sum + goal.targetAmount, 0);
      const progressPercentage = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

      const threeMonthsFromNow = new Date();
      threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
      
      const upcomingGoals = activeGoals
        .filter(goal => new Date(goal.targetDate) <= threeMonthsFromNow)
        .sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime())
        .slice(0, 5);

      const stats: SavingsStats = {
        totalSaved,
        totalGoals: goals.length,
        completedGoals: completedGoals.length,
        monthlyContributions,
        progressPercentage,
        upcomingGoals
      };
      
      console.log('📊 [savingsService] Savings stats:', stats);
      return stats;
    } catch (error) {
      console.error('❌ [savingsService] Error in getSavingsStats:', error);
      throw error;
    }
  },

  calculateRequiredMonthlySavings(targetAmount: number, currentAmount: number, targetDate: string): number {
    const today = new Date();
    const target = new Date(targetDate);
    const monthsRemaining = Math.max(1, (target.getFullYear() - today.getFullYear()) * 12 + (target.getMonth() - today.getMonth()));
    
    const remainingAmount = targetAmount - currentAmount;
    return remainingAmount / monthsRemaining;
  },

  calculateGoalAchievementDate(targetAmount: number, currentAmount: number, monthlyContribution: number): string {
    if (monthlyContribution <= 0) {
      return new Date().toISOString().split('T')[0];
    }
    
    const remainingAmount = targetAmount - currentAmount;
    const monthsNeeded = Math.ceil(remainingAmount / monthlyContribution);
    
    const achievementDate = new Date();
    achievementDate.setMonth(achievementDate.getMonth() + monthsNeeded);
    
    return achievementDate.toISOString().split('T')[0];
  },

  calculateCompoundInterest(principal: number, monthlyContribution: number, annualInterestRate: number, years: number): number {
    const monthlyRate = annualInterestRate / 100 / 12;
    const months = years * 12;
    
    let futureValue = principal * Math.pow(1 + monthlyRate, months);
    
    for (let i = 0; i < months; i++) {
      futureValue += monthlyContribution * Math.pow(1 + monthlyRate, months - i - 1);
    }
    
    return futureValue;
  },

  async ensureContributionsTableExists(): Promise<void> {
    try {
      const db = await getDatabase();
      
      const tableExists = await db.getFirstAsync(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='savings_contributions'"
      );
      
      if (!tableExists) {
        console.log('🛠️ [savingsService] Creating savings_contributions table...');
        
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS savings_contributions (
            id TEXT PRIMARY KEY NOT NULL,
            goal_id TEXT NOT NULL,
            user_id TEXT NOT NULL,
            amount REAL NOT NULL,
            date TEXT NOT NULL,
            created_at TEXT NOT NULL,
            from_account_id TEXT,
            FOREIGN KEY (goal_id) REFERENCES savings_goals (id) ON DELETE CASCADE
          );
        `);
        
        console.log('✅ [savingsService] savings_contributions table created successfully');
      } else {
        console.log('🔍 [savingsService] Checking savings_contributions table structure...');
        
        const tableInfo = await db.getAllAsync(`PRAGMA table_info(savings_contributions)`) as any[];
        console.log('📋 [savingsService] Table structure:', tableInfo);
        
        const requiredColumns = [
          { name: 'id', type: 'TEXT' },
          { name: 'goal_id', type: 'TEXT' },
          { name: 'user_id', type: 'TEXT' },
          { name: 'amount', type: 'REAL' },
          { name: 'date', type: 'TEXT' },
          { name: 'created_at', type: 'TEXT' },
          { name: 'from_account_id', type: 'TEXT' }
        ];
        
        for (const requiredColumn of requiredColumns) {
          const columnExists = tableInfo.some(col => col.name === requiredColumn.name);
          if (!columnExists) {
            console.log(`🛠️ [savingsService] Adding ${requiredColumn.name} column to savings_contributions...`);
            
            try {
              await db.execAsync(`
                ALTER TABLE savings_contributions ADD COLUMN ${requiredColumn.name} ${requiredColumn.type};
              `);
              console.log(`✅ [savingsService] ${requiredColumn.name} column added successfully`);
            } catch (alterError) {
              console.warn(`⚠️ [savingsService] Could not add column ${requiredColumn.name}:`, alterError);
            }
          }
        }
      }
    } catch (error) {
      console.error('❌ [savingsService] Error ensuring contributions table exists:', error);
      throw error;
    }
  },

  async diagnoseDatabase(): Promise<{
    goalsTableExists: boolean;
    contributionsTableExists: boolean;
    goalsCount: number;
    contributionsCount: number;
    contributionsStructure: any[];
  }> {
    try {
      const db = await getDatabase();
      
      const goalsTableExists = !!(await db.getFirstAsync(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='savings_goals'"
      ));
      
      const contributionsTableExists = !!(await db.getFirstAsync(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='savings_contributions'"
      ));
      
      let goalsCount = 0;
      let contributionsCount = 0;
      let contributionsStructure: any[] = [];
      
      if (goalsTableExists) {
        const goalsResult = await db.getFirstAsync(`SELECT COUNT(*) as count FROM savings_goals`) as { count: number };
        goalsCount = goalsResult?.count || 0;
      }
      
      if (contributionsTableExists) {
        const contributionsResult = await db.getFirstAsync(`SELECT COUNT(*) as count FROM savings_contributions`) as { count: number };
        contributionsCount = contributionsResult?.count || 0;
        contributionsStructure = await db.getAllAsync(`PRAGMA table_info(savings_contributions)`) as any[];
      }
      
      return {
        goalsTableExists,
        contributionsTableExists,
        goalsCount,
        contributionsCount,
        contributionsStructure
      };
    } catch (error) {
      console.error('❌ [savingsService] Error diagnosing database:', error);
      throw error;
    }
  },

  async emergencyFixExistingGoals(userId: string = 'default-user'): Promise<{ fixed: number; errors: string[] }> {
    try {
      console.log('🛠️ [savingsService] Emergency fix: Assigning savings accounts to existing goals...');
      
      const goals = await this.getAllSavingsGoals(userId);
      const savingsAccounts = await accountService.getAccountsByType('savings');
      
      if (savingsAccounts.length === 0) {
        throw new Error('Aucun compte épargne disponible');
      }
      
      const defaultSavingsAccount = savingsAccounts[0];
      let fixed = 0;
      const errors: string[] = [];

      for (const goal of goals) {
        if (!goal.savingsAccountId) {
          try {
            await this.updateSavingsGoal(goal.id, { 
              savingsAccountId: defaultSavingsAccount.id 
            }, userId);
            console.log(`✅ Fixed goal: ${goal.name} -> ${defaultSavingsAccount.name}`);
            fixed++;
          } catch (error) {
            errors.push(`Erreur avec ${goal.name}: ${error}`);
          }
        }
      }
      
      console.log(`✅ [savingsService] Emergency fix completed: ${fixed} goals fixed`);
      return { fixed, errors };
      
    } catch (error) {
      console.error('❌ [savingsService] Emergency fix failed:', error);
      throw error;
    }
  },

  async emergencySyncAccountBalances(userId: string = 'default-user'): Promise<void> {
    try {
      console.log('🛠️ [savingsService] Emergency sync: Synchronizing account balances...');
      
      await accountService.updateAllAccountBalances(userId);
      
      console.log('✅ [savingsService] Emergency sync completed');
    } catch (error) {
      console.error('❌ [savingsService] Emergency sync failed:', error);
      throw error;
    }
  },

  async testRefundSystem(goalId: string, userId: string = 'default-user'): Promise<{ success: boolean; message: string }> {
    try {
      console.log('🧪 [savingsService] Testing refund system for goal:', goalId);
      
      const goal = await this.getSavingsGoalById(goalId, userId);
      if (!goal) {
        return { success: false, message: 'Objectif non trouvé' };
      }

      const contributions = await this.getContributionHistory(goalId, userId);
      
      if (contributions.length === 0) {
        return { success: false, message: 'Aucune contribution à rembourser' };
      }

      const lastContribution = contributions[0];
      
      if (!lastContribution.fromAccountId || !goal.savingsAccountId) {
        return { success: false, message: 'Comptes manquants pour le remboursement' };
      }

      const fromAccountBefore = await accountService.getAccountById(lastContribution.fromAccountId);
      const savingsAccountBefore = await accountService.getAccountById(goal.savingsAccountId);

      console.log('🧪 [savingsService] Before refund:', {
        fromAccountBalance: fromAccountBefore?.balance,
        savingsAccountBalance: savingsAccountBefore?.balance,
        contributionAmount: lastContribution.amount
      });

      await this.deleteContributionWithRefund(lastContribution.id, userId);

      const fromAccountAfter = await accountService.getAccountById(lastContribution.fromAccountId);
      const savingsAccountAfter = await accountService.getAccountById(goal.savingsAccountId);

      console.log('🧪 [savingsService] After refund:', {
        fromAccountBalance: fromAccountAfter?.balance,
        savingsAccountBalance: savingsAccountAfter?.balance
      });

      return { 
        success: true, 
        message: `Test réussi! Remboursement de ${lastContribution.amount} MAD effectué.` 
      };

    } catch (error) {
      console.error('❌ [savingsService] Refund system test failed:', error);
      return { 
        success: false, 
        message: `Échec du test: ${error instanceof Error ? error.message : 'Erreur inconnue'}` 
      };
    }
  }
};

export default savingsService;