// src/services/transferService.ts - VERSION COMPLÈTEMENT CORRIGÉE
import { accountService } from './accountService';
import { getDatabase } from './database/sqlite';
import { transactionService } from './transactionService';

export interface TransferData {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  description?: string;
  date: string;
}

export interface TransferValidationResult {
  isValid: boolean;
  message?: string;
  currentBalance?: number;
}

export const transferService = {
  // ✅ CORRECTION : Méthode sans transaction pour usage dans d'autres transactions
  async executeTransferWithoutTransaction(transferData: TransferData, userId: string = 'default-user'): Promise<void> {
    try {
      console.log('🔄 [transferService] Transfert sans transaction:', transferData);

      const fromAccount = await accountService.getAccountById(transferData.fromAccountId);
      const toAccount = await accountService.getAccountById(transferData.toAccountId);

      if (!fromAccount) {
        throw new Error('Compte source introuvable');
      }

      if (!toAccount) {
        throw new Error('Compte destination introuvable');
      }

      if (fromAccount.balance < transferData.amount) {
        throw new Error('Fonds insuffisants sur le compte source');
      }

      if (transferData.amount <= 0) {
        throw new Error('Le montant du transfert doit être positif');
      }

      // ✅ CORRECTION : Créer les transactions sans transaction SQLite
      await transactionService.createTransactionWithoutBalanceUpdate({
        amount: -transferData.amount,
        type: 'expense',
        category: 'transfert', // ✅ Catégorie spéciale pour exclusion des calculs
        accountId: transferData.fromAccountId,
        description: `Transfert vers ${toAccount.name}${transferData.description ? ` - ${transferData.description}` : ''}`,
        date: transferData.date,
      }, userId);

      await transactionService.createTransactionWithoutBalanceUpdate({
        amount: transferData.amount,
        type: 'income',
        category: 'transfert', // ✅ Même catégorie pour exclusion
        accountId: transferData.toAccountId,
        description: `Transfert depuis ${fromAccount.name}${transferData.description ? ` - ${transferData.description}` : ''}`,
        date: transferData.date,
      }, userId);

      // Mettre à jour les soldes directement
      const newFromBalance = fromAccount.balance - transferData.amount;
      const newToBalance = toAccount.balance + transferData.amount;

      await accountService.updateAccountBalanceDirect(transferData.fromAccountId, newFromBalance);
      await accountService.updateAccountBalanceDirect(transferData.toAccountId, newToBalance);

      console.log('✅ [transferService] Transfert sans transaction réussi:', {
        fromAccount: fromAccount.name,
        toAccount: toAccount.name,
        amount: transferData.amount,
        newFromBalance,
        newToBalance
      });

    } catch (error) {
      console.error('❌ [transferService] Erreur transfert sans transaction:', error);
      throw new Error(`Échec du transfert: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  },

  // ✅ Méthode principale avec transaction (pour usage indépendant)
  async executeTransfer(transferData: TransferData, userId: string = 'default-user'): Promise<void> {
    const db = await getDatabase();
    
    try {
      console.log('🔄 [transferService] Début du transfert avec transaction:', transferData);

      const fromAccount = await accountService.getAccountById(transferData.fromAccountId);
      const toAccount = await accountService.getAccountById(transferData.toAccountId);

      if (!fromAccount) {
        throw new Error('Compte source introuvable');
      }

      if (!toAccount) {
        throw new Error('Compte destination introuvable');
      }

      if (fromAccount.balance < transferData.amount) {
        throw new Error('Fonds insuffisants sur le compte source');
      }

      if (transferData.amount <= 0) {
        throw new Error('Le montant du transfert doit être positif');
      }

      await db.execAsync('BEGIN TRANSACTION');

      try {
        // ✅ CORRECTION : Utiliser la méthode sans mise à jour de solde
        await transactionService.createTransactionWithoutBalanceUpdate({
          amount: -transferData.amount,
          type: 'expense',
          category: 'transfert', // ✅ Exclu des calculs de flux
          accountId: transferData.fromAccountId,
          description: `Transfert vers ${toAccount.name}${transferData.description ? ` - ${transferData.description}` : ''}`,
          date: transferData.date,
        }, userId);

        await transactionService.createTransactionWithoutBalanceUpdate({
          amount: transferData.amount,
          type: 'income',
          category: 'transfert', // ✅ Exclu des calculs de flux
          accountId: transferData.toAccountId,
          description: `Transfert depuis ${fromAccount.name}${transferData.description ? ` - ${transferData.description}` : ''}`,
          date: transferData.date,
        }, userId);

        const newFromBalance = fromAccount.balance - transferData.amount;
        const newToBalance = toAccount.balance + transferData.amount;

        // Mettre à jour les soldes directement
        await accountService.updateAccountBalanceDirect(transferData.fromAccountId, newFromBalance);
        await accountService.updateAccountBalanceDirect(transferData.toAccountId, newToBalance);

        await db.execAsync('COMMIT');

        console.log('✅ [transferService] Transfert avec transaction réussi:', {
          fromAccount: fromAccount.name,
          toAccount: toAccount.name,
          amount: transferData.amount,
          newFromBalance,
          newToBalance
        });

      } catch (error) {
        await db.execAsync('ROLLBACK');
        throw error;
      }

    } catch (error) {
      console.error('❌ [transferService] Erreur lors du transfert:', error);
      throw new Error(`Échec du transfert: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  },

  async createTransfer(transferData: TransferData, userId: string = 'default-user'): Promise<void> {
    return transferService.executeTransfer(transferData, userId);
  },

  async validateTransfer(fromAccountId: string, amount: number): Promise<TransferValidationResult> {
    try {
      const fromAccount = await accountService.getAccountById(fromAccountId);
      
      if (!fromAccount) {
        return { isValid: false, message: 'Compte source introuvable' };
      }

      if (amount <= 0) {
        return { isValid: false, message: 'Le montant doit être positif' };
      }

      if (fromAccount.balance < amount) {
        return { 
          isValid: false, 
          message: 'Fonds insuffisants', 
          currentBalance: fromAccount.balance 
        };
      }

      return { isValid: true, currentBalance: fromAccount.balance };
    } catch (error) {
      console.error('❌ [transferService] Erreur de validation:', error);
      return { isValid: false, message: 'Erreur lors de la validation' };
    }
  },

  // ✅ NOUVELLE MÉTHODE : Transfert pour épargne avec catégorie spécifique
  async executeSavingsTransfer(transferData: TransferData, goalName: string, userId: string = 'default-user'): Promise<void> {
    const db = await getDatabase();
    
    try {
      console.log('💰 [transferService] Transfert épargne:', { ...transferData, goalName });

      const fromAccount = await accountService.getAccountById(transferData.fromAccountId);
      const toAccount = await accountService.getAccountById(transferData.toAccountId);

      if (!fromAccount) {
        throw new Error('Compte source introuvable');
      }

      if (!toAccount) {
        throw new Error('Compte épargne introuvable');
      }

      if (fromAccount.balance < transferData.amount) {
        throw new Error('Fonds insuffisants sur le compte source');
      }

      if (transferData.amount <= 0) {
        throw new Error('Le montant du transfert doit être positif');
      }

      await db.execAsync('BEGIN TRANSACTION');

      try {
        // ✅ CORRECTION : Utiliser catégorie "épargne" pour exclusion des calculs
        await transactionService.createTransactionWithoutBalanceUpdate({
          amount: -transferData.amount,
          type: 'expense',
          category: 'épargne', // ✅ Exclu des calculs de flux
          accountId: transferData.fromAccountId,
          description: `Épargne: ${goalName}`,
          date: transferData.date,
        }, userId);

        await transactionService.createTransactionWithoutBalanceUpdate({
          amount: transferData.amount,
          type: 'income',
          category: 'épargne', // ✅ Exclu des calculs de flux
          accountId: transferData.toAccountId,
          description: `Épargne: ${goalName}`,
          date: transferData.date,
        }, userId);

        const newFromBalance = fromAccount.balance - transferData.amount;
        const newToBalance = toAccount.balance + transferData.amount;

        await accountService.updateAccountBalanceDirect(transferData.fromAccountId, newFromBalance);
        await accountService.updateAccountBalanceDirect(transferData.toAccountId, newToBalance);

        await db.execAsync('COMMIT');

        console.log('✅ [transferService] Transfert épargne réussi:', {
          fromAccount: fromAccount.name,
          toAccount: toAccount.name,
          amount: transferData.amount,
          goalName,
          newFromBalance,
          newToBalance
        });

      } catch (error) {
        await db.execAsync('ROLLBACK');
        throw error;
      }

    } catch (error) {
      console.error('❌ [transferService] Erreur transfert épargne:', error);
      throw new Error(`Échec du transfert épargne: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  },

  // ✅ NOUVELLE MÉTHODE : Remboursement épargne avec catégorie spécifique
  async executeSavingsRefund(transferData: TransferData, goalName: string, userId: string = 'default-user'): Promise<void> {
    const db = await getDatabase();
    
    try {
      console.log('💸 [transferService] Remboursement épargne:', { ...transferData, goalName });

      const fromAccount = await accountService.getAccountById(transferData.fromAccountId);
      const toAccount = await accountService.getAccountById(transferData.toAccountId);

      if (!fromAccount) {
        throw new Error('Compte épargne introuvable');
      }

      if (!toAccount) {
        throw new Error('Compte destination introuvable');
      }

      if (fromAccount.balance < transferData.amount) {
        throw new Error('Fonds insuffisants sur le compte épargne');
      }

      if (transferData.amount <= 0) {
        throw new Error('Le montant du remboursement doit être positif');
      }

      await db.execAsync('BEGIN TRANSACTION');

      try {
        // ✅ CORRECTION : Utiliser catégorie "remboursement épargne" pour exclusion
        await transactionService.createTransactionWithoutBalanceUpdate({
          amount: -transferData.amount,
          type: 'expense',
          category: 'remboursement épargne', // ✅ Exclu des calculs de flux
          accountId: transferData.fromAccountId,
          description: `Remboursement: ${goalName}`,
          date: transferData.date,
        }, userId);

        await transactionService.createTransactionWithoutBalanceUpdate({
          amount: transferData.amount,
          type: 'income',
          category: 'remboursement épargne', // ✅ Exclu des calculs de flux
          accountId: transferData.toAccountId,
          description: `Remboursement: ${goalName}`,
          date: transferData.date,
        }, userId);

        const newFromBalance = fromAccount.balance - transferData.amount;
        const newToBalance = toAccount.balance + transferData.amount;

        await accountService.updateAccountBalanceDirect(transferData.fromAccountId, newFromBalance);
        await accountService.updateAccountBalanceDirect(transferData.toAccountId, newToBalance);

        await db.execAsync('COMMIT');

        console.log('✅ [transferService] Remboursement épargne réussi:', {
          fromAccount: fromAccount.name,
          toAccount: toAccount.name,
          amount: transferData.amount,
          goalName,
          newFromBalance,
          newToBalance
        });

      } catch (error) {
        await db.execAsync('ROLLBACK');
        throw error;
      }

    } catch (error) {
      console.error('❌ [transferService] Erreur remboursement épargne:', error);
      throw new Error(`Échec du remboursement: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }
};