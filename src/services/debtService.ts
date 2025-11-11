// src/services/debtService.ts - VERSION AVEC SYSTÈME D'ÉCHÉANCES STRICTES
import { CreateDebtData, Debt, DebtPayment, PaymentEligibility, UpdateDebtData } from '../types/Debt';
import { accountService } from './accountService';
import { getDatabase } from './database/sqlite';
import { transferService } from './transferService';

interface DatabaseDebt {
  id: string;
  user_id: string;
  name: string;
  creditor: string;
  initial_amount: number;
  current_amount: number;
  interest_rate: number;
  monthly_payment: number;
  start_date: string;
  due_date: string;
  due_month: string;
  status: string;
  category: string;
  color: string;
  notes?: string;
  created_at: string;
  next_due_date?: string;
  type: string;
  auto_pay: number;
  payment_account_id?: string;
}

interface DatabaseDebtPayment {
  id: string;
  debt_id: string;
  user_id: string;
  amount: number;
  payment_date: string;
  payment_status: string;
  created_at: string;
  from_account_id?: string;
  principal: number;
  interest: number;
  remaining_balance: number;
  payment_month: string;
}

export const debtService = {
  /**
   * ✅ CRÉATION DE DETTE AVEC GESTION AUTOMATIQUE DU STATUT
   */
  async createDebt(debtData: CreateDebtData, userId: string = 'default-user'): Promise<string> {
    try {
      const db = await getDatabase();
      const id = `debt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const createdAt = new Date().toISOString();

      console.log('🔄 [debtService] Creating debt:', { id, ...debtData });

      // ✅ CALCUL AUTOMATIQUE DU STATUT ET DU MOIS D'ÉCHÉANCE
      const dueDate = new Date(debtData.dueDate);
      const dueMonth = dueDate.toISOString().slice(0, 7); // Format "YYYY-MM"
      const now = new Date();
      
      let status: Debt['status'] = 'active';
      if (dueDate > now) {
        status = 'future';
      } else if (dueDate < now) {
        status = 'overdue';
      }

      // ✅ CALCUL DE L'ÉLIGIBILITÉ INITIALE
      const paymentEligibility = this.calculatePaymentEligibility({
        dueDate: debtData.dueDate,
        dueMonth,
        status,
        currentAmount: debtData.initialAmount
      });

      await db.runAsync(
        `INSERT INTO debts (
          id, user_id, name, creditor, initial_amount, current_amount, 
          interest_rate, monthly_payment, start_date, due_date, due_month, status, 
          category, color, notes, created_at, type, auto_pay, payment_account_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          userId,
          debtData.name,
          debtData.creditor,
          debtData.initialAmount,
          debtData.initialAmount, // current_amount = initial_amount au début
          debtData.interestRate,
          debtData.monthlyPayment,
          debtData.startDate,
          debtData.dueDate,
          dueMonth, // ✅ NOUVEAU CHAMP
          status,
          debtData.category,
          debtData.color,
          debtData.notes || null,
          createdAt,
          debtData.type,
          debtData.autoPay ? 1 : 0,
          debtData.paymentAccountId || null
        ]
      );

      console.log('✅ [debtService] Debt created with status:', status);
      return id;
    } catch (error) {
      console.error('❌ [debtService] Error in createDebt:', error);
      throw error;
    }
  },

  /**
   * ✅ RÉCUPÉRATION DE TOUTES LES DETTES AVEC ÉLIGIBILITÉ CALCULÉE
   */
  async getAllDebts(userId: string = 'default-user'): Promise<Debt[]> {
    try {
      const db = await getDatabase();
      
      const result = await db.getAllAsync(
        `SELECT * FROM debts WHERE user_id = ? ORDER BY 
         CASE status
           WHEN 'overdue' THEN 1
           WHEN 'active' THEN 2
           WHEN 'future' THEN 3
           ELSE 4
         END, due_date ASC`,
        [userId]
      ) as DatabaseDebt[];

      const debts: Debt[] = result.map((item) => {
        const paymentEligibility = this.calculatePaymentEligibility({
          dueDate: item.due_date,
          dueMonth: item.due_month,
          status: item.status as Debt['status'],
          currentAmount: item.current_amount
        });

        return {
          id: item.id,
          userId: item.user_id,
          name: item.name,
          creditor: item.creditor,
          initialAmount: item.initial_amount,
          currentAmount: item.current_amount,
          interestRate: item.interest_rate,
          monthlyPayment: item.monthly_payment,
          startDate: item.start_date,
          dueDate: item.due_date,
          dueMonth: item.due_month,
          status: item.status as Debt['status'],
          category: item.category,
          color: item.color,
          notes: item.notes || undefined,
          createdAt: item.created_at,
          nextDueDate: item.next_due_date || undefined,
          type: item.type as Debt['type'],
          autoPay: Boolean(item.auto_pay),
          paymentAccountId: item.payment_account_id || undefined,
          paymentEligibility
        };
      });

      return debts;
    } catch (error) {
      console.error('❌ [debtService] Error in getAllDebts:', error);
      throw error;
    }
  },

  /**
   * ✅ CALCUL D'ÉLIGIBILITÉ AVEC RÈGLES STRICTES D'ÉCHÉANCE
   */
  calculatePaymentEligibility(params: {
    dueDate: string;
    dueMonth: string;
    status: Debt['status'];
    currentAmount: number;
  }): PaymentEligibility {
    const now = new Date();
    const dueDate = new Date(params.dueDate);
    const currentMonth = now.toISOString().slice(0, 7); // "YYYY-MM" actuel
    
    // ✅ VÉRIFICATIONS DE BASE
    if (params.currentAmount <= 0 || params.status === 'paid') {
      return { 
        isEligible: false, 
        reason: 'Cette dette est déjà réglée',
        dueMonth: params.dueMonth,
        isCurrentMonth: false,
        isPastDue: false,
        isFutureDue: false
      };
    }

    // ✅ RÈGLE PRINCIPALE : Paiement uniquement pendant le mois d'échéance
    const isCurrentMonth = params.dueMonth === currentMonth;
    const isPastDue = dueDate < now && !isCurrentMonth;
    const isFutureDue = dueDate > now && !isCurrentMonth;

    // ✅ DETTE DU MOIS EN COURS : Sera traitée normalement
    if (isCurrentMonth) {
      return { 
        isEligible: true,
        reason: 'Paiement autorisé pendant le mois d\'échéance',
        dueMonth: params.dueMonth,
        isCurrentMonth: true,
        isPastDue: false,
        isFutureDue: false
      };
    }

    // ✅ DETTE ANCIENNE : Ne sera PAS traitée avant son mois d'échéance
    if (isPastDue) {
      return { 
        isEligible: false, 
        reason: 'Période de paiement expirée. Cette dette est en retard et nécessite une régularisation manuelle.',
        dueMonth: params.dueMonth,
        isCurrentMonth: false,
        isPastDue: true,
        isFutureDue: false
      };
    }

    // ✅ DETTE FUTURE : Attend son mois d'échéance
    if (isFutureDue) {
      const nextEligibleDate = new Date(params.dueMonth + '-01');
      return { 
        isEligible: false, 
        reason: 'Paiement disponible seulement pendant le mois d\'échéance',
        nextEligibleDate: nextEligibleDate.toISOString().split('T')[0],
        dueMonth: params.dueMonth,
        isCurrentMonth: false,
        isPastDue: false,
        isFutureDue: true
      };
    }

    return { 
      isEligible: false, 
      reason: 'Paiement non autorisé pour cette période',
      dueMonth: params.dueMonth,
      isCurrentMonth: false,
      isPastDue: false,
      isFutureDue: false
    };
  },

  /**
   * ✅ AJOUT DE PAIEMENT AVEC VÉRIFICATION STRICTE D'ÉLIGIBILITÉ
   */
  async addPayment(
    debtId: string, 
    amount: number, 
    fromAccountId?: string, 
    userId: string = 'default-user'
  ): Promise<string> {
    try {
      const db = await getDatabase();
      const id = `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const paymentDate = new Date().toISOString().split('T')[0];
      const paymentMonth = new Date().toISOString().slice(0, 7); // "YYYY-MM"
      const createdAt = new Date().toISOString();

      console.log('🔄 [debtService] Adding payment:', { 
        debtId, 
        amount, 
        fromAccountId,
        paymentMonth 
      });

      const debt = await this.getDebtById(debtId, userId);
      if (!debt) {
        throw new Error('Dette non trouvée');
      }

      // ✅ VÉRIFICATION STRICTE DE L'ÉLIGIBILITÉ
      if (!debt.paymentEligibility.isEligible) {
        throw new Error(debt.paymentEligibility.reason || 'Paiement non autorisé');
      }

      // ✅ PAIMENT MANUEL : Impossible si hors période
      if (!debt.paymentEligibility.isCurrentMonth) {
        throw new Error('Paiement manuel non autorisé hors période d\'échéance');
      }

      let effectiveFromAccountId = fromAccountId;
      if (!effectiveFromAccountId) {
        const allAccounts = await accountService.getAllAccounts();
        const sourceAccounts = allAccounts.filter(acc => 
          acc.type !== 'savings' && acc.balance >= amount
        );
        
        if (sourceAccounts.length > 0) {
          effectiveFromAccountId = sourceAccounts[0].id;
          console.log('💰 [debtService] Auto-assigned from account:', effectiveFromAccountId);
        } else {
          throw new Error('Aucun compte source disponible avec suffisamment de fonds');
        }
      }

      const fromAccount = await accountService.getAccountById(effectiveFromAccountId);
      if (!fromAccount) {
        throw new Error('Compte source non trouvé');
      }

      if (fromAccount.balance < amount) {
        throw new Error(`Solde insuffisant sur ${fromAccount.name}. Solde disponible: ${fromAccount.balance}€`);
      }

      // Calculer la répartition principal/intérêts
      const monthlyInterest = (debt.currentAmount * debt.interestRate) / 100 / 12;
      const principal = Math.max(0, amount - monthlyInterest);
      const interest = Math.min(amount, monthlyInterest);

      const newBalance = Math.max(0, debt.currentAmount - principal);
      const isPaid = newBalance <= 0;

      await db.execAsync('BEGIN TRANSACTION');

      try {
        // ✅ TRANSFERT VERS LE COMPTE VIRTUEL DES DETTES
        await transferService.executeTransfer({
          fromAccountId: effectiveFromAccountId,
          toAccountId: 'debt_account', // Compte virtuel pour les dettes
          amount: amount,
          description: `Paiement dette: ${debt.name}`,
          date: paymentDate,
        }, userId);

        // ✅ ENREGISTREMENT DU PAIEMENT
        await this.ensurePaymentsTableExists();

        await db.runAsync(
          `INSERT INTO debt_payments (
            id, debt_id, user_id, amount, payment_date, payment_status, 
            created_at, from_account_id, principal, interest, remaining_balance, payment_month
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            id,
            debtId,
            userId,
            amount,
            paymentDate,
            'completed',
            createdAt,
            effectiveFromAccountId,
            principal,
            interest,
            newBalance,
            paymentMonth // ✅ NOUVEAU CHAMP
          ]
        );

        // ✅ MISE À JOUR DE LA DETTE
        const newStatus = isPaid ? 'paid' : debt.status;
        await db.runAsync(
          `UPDATE debts SET current_amount = ?, status = ? WHERE id = ? AND user_id = ?`,
          [newBalance, newStatus, debtId, userId]
        );

        await db.execAsync('COMMIT');
        
        console.log('✅ [debtService] Payment added successfully');
        return id;

      } catch (error) {
        await db.execAsync('ROLLBACK');
        console.error('❌ [debtService] Transaction failed, rolling back:', error);
        throw error;
      }

    } catch (error) {
      console.error('❌ [debtService] Error in addPayment:', error);
      throw error;
    }
  },

  /**
   * ✅ MISE À JOUR AUTOMATIQUE DES STATUTS BASÉS SUR LES DATES
   */
  async updateDebtStatuses(userId: string = 'default-user'): Promise<void> {
    try {
      const db = await getDatabase();
      const now = new Date();
      const currentMonth = now.toISOString().slice(0, 7);
      
      const debts = await this.getAllDebts(userId);
      let changes = 0;

      for (const debt of debts) {
        if (debt.currentAmount <= 0) {
          // Dette payée
          if (debt.status !== 'paid') {
            await this.updateDebt(debt.id, { status: 'paid' }, userId);
            changes++;
          }
          continue;
        }

        const dueDate = new Date(debt.dueDate);
        const dueMonth = debt.dueMonth;
        let newStatus = debt.status;

        // ✅ DETTE FUTURE → ACTIVE si le mois d'échéance est arrivé
        if (debt.status === 'future' && dueMonth === currentMonth) {
          newStatus = 'active';
        }
        // ✅ DETTE ACTIVE → OVERDUE si la date est passée
        else if (debt.status === 'active' && dueDate < now && dueMonth !== currentMonth) {
          newStatus = 'overdue';
        }
        // ✅ DETTE OVERDUE → ACTIVE si on est dans le mois d'échéance
        else if (debt.status === 'overdue' && dueMonth === currentMonth) {
          newStatus = 'active';
        }

        if (newStatus !== debt.status) {
          await this.updateDebt(debt.id, { status: newStatus }, userId);
          changes++;
          console.log(`🔄 [debtService] Updated debt ${debt.name} status: ${debt.status} -> ${newStatus}`);
        }
      }

      if (changes > 0) {
        console.log(`✅ [debtService] ${changes} debt statuses updated successfully`);
      }
    } catch (error) {
      console.error('❌ [debtService] Error updating debt statuses:', error);
      throw error;
    }
  },

  /**
   * ✅ RÉCUPÉRATION D'UNE DETTE PAR ID
   */
  async getDebtById(id: string, userId: string = 'default-user'): Promise<Debt | null> {
    try {
      const db = await getDatabase();
      
      const result = await db.getFirstAsync(
        `SELECT * FROM debts WHERE id = ? AND user_id = ?`,
        [id, userId]
      ) as DatabaseDebt | null;

      if (result) {
        const paymentEligibility = this.calculatePaymentEligibility({
          dueDate: result.due_date,
          dueMonth: result.due_month,
          status: result.status as Debt['status'],
          currentAmount: result.current_amount
        });

        const debt: Debt = {
          id: result.id,
          userId: result.user_id,
          name: result.name,
          creditor: result.creditor,
          initialAmount: result.initial_amount,
          currentAmount: result.current_amount,
          interestRate: result.interest_rate,
          monthlyPayment: result.monthly_payment,
          startDate: result.start_date,
          dueDate: result.due_date,
          dueMonth: result.due_month,
          status: result.status as Debt['status'],
          category: result.category,
          color: result.color,
          notes: result.notes || undefined,
          createdAt: result.created_at,
          nextDueDate: result.next_due_date || undefined,
          type: result.type as Debt['type'],
          autoPay: Boolean(result.auto_pay),
          paymentAccountId: result.payment_account_id || undefined,
          paymentEligibility
        };
        return debt;
      }
      return null;
    } catch (error) {
      console.error('❌ [debtService] Error in getDebtById:', error);
      throw error;
    }
  },

  /**
   * ✅ MISE À JOUR D'UNE DETTE
   */
  async updateDebt(id: string, updates: UpdateDebtData, userId: string = 'default-user'): Promise<void> {
    try {
      const db = await getDatabase();
      
      const fields = Object.keys(updates);
      if (fields.length === 0) return;

      // ✅ GESTION DES CHAMPS SPÉCIAUX
      const dbFields = fields.map(field => {
        const mapping: { [key: string]: string } = {
          'initialAmount': 'initial_amount',
          'currentAmount': 'current_amount',
          'interestRate': 'interest_rate',
          'monthlyPayment': 'monthly_payment',
          'startDate': 'start_date',
          'dueDate': 'due_date',
          'dueMonth': 'due_month',
          'autoPay': 'auto_pay',
          'paymentAccountId': 'payment_account_id'
        };
        return mapping[field] || field;
      });

      const setClause = dbFields.map(field => `${field} = ?`).join(', ');

      const values = fields.map(field => {
        const value = (updates as any)[field];
        // Conversion booléenne pour autoPay
        if (field === 'autoPay') {
          return value ? 1 : 0;
        }
        return value;
      });

      values.push(id, userId);

      await db.runAsync(
        `UPDATE debts SET ${setClause} WHERE id = ? AND user_id = ?`,
        values
      );

      console.log('✅ [debtService] Debt updated successfully');
    } catch (error) {
      console.error('❌ [debtService] Error in updateDebt:', error);
      throw error;
    }
  },

  /**
   * ✅ SUPPRESSION D'UNE DETTE
   */
  async deleteDebt(id: string, userId: string = 'default-user'): Promise<void> {
    try {
      const db = await getDatabase();
      
      await db.runAsync(
        `DELETE FROM debts WHERE id = ? AND user_id = ?`,
        [id, userId]
      );

      console.log('✅ [debtService] Debt deleted successfully');
    } catch (error) {
      console.error('❌ [debtService] Error in deleteDebt:', error);
      throw error;
    }
  },

  /**
   * ✅ HISTORIQUE DES PAIEMENTS
   */
  async getPaymentHistory(debtId: string, userId: string = 'default-user'): Promise<DebtPayment[]> {
    try {
      const db = await getDatabase();
      
      await this.ensurePaymentsTableExists();
      
      const result = await db.getAllAsync(
        `SELECT dp.* FROM debt_payments dp
         JOIN debts d ON dp.debt_id = d.id
         WHERE dp.debt_id = ? AND d.user_id = ?
         ORDER BY dp.payment_date DESC`,
        [debtId, userId]
      ) as DatabaseDebtPayment[];

      const payments: DebtPayment[] = result.map((item) => ({
        id: item.id,
        debtId: item.debt_id,
        amount: item.amount,
        paymentDate: item.payment_date,
        paymentStatus: item.payment_status as 'completed' | 'pending' | 'failed',
        createdAt: item.created_at,
        fromAccountId: item.from_account_id || undefined,
        principal: item.principal,
        interest: item.interest,
        remainingBalance: item.remaining_balance,
        paymentMonth: item.payment_month
      }));

      return payments;
    } catch (error) {
      console.error('❌ [debtService] Error in getPaymentHistory:', error);
      throw error;
    }
  },

  /**
   * ✅ CRÉATION DE LA TABLE DES PAIEMENTS SI ELLE N'EXISTE PAS
   */
  async ensurePaymentsTableExists(): Promise<void> {
    try {
      const db = await getDatabase();
      
      const tableExists = await db.getFirstAsync(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='debt_payments'"
      );
      
      if (!tableExists) {
        console.log('🛠️ [debtService] Creating debt_payments table...');
        
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS debt_payments (
            id TEXT PRIMARY KEY NOT NULL,
            debt_id TEXT NOT NULL,
            user_id TEXT NOT NULL,
            amount REAL NOT NULL,
            payment_date TEXT NOT NULL,
            payment_status TEXT NOT NULL DEFAULT 'completed',
            created_at TEXT NOT NULL,
            from_account_id TEXT,
            principal REAL NOT NULL,
            interest REAL NOT NULL,
            remaining_balance REAL NOT NULL,
            payment_month TEXT NOT NULL,
            FOREIGN KEY (debt_id) REFERENCES debts (id) ON DELETE CASCADE
          );
        `);
        
        console.log('✅ [debtService] debt_payments table created successfully');
      }
    } catch (error) {
      console.error('❌ [debtService] Error ensuring payments table exists:', error);
      throw error;
    }
  },

  /**
   * ✅ STATISTIQUES DES DETTES
   */
  async getDebtStats(userId: string = 'default-user'): Promise<{
    totalDebt: number;
    monthlyPayment: number;
    paidDebts: number;
    activeDebts: number;
    overdueDebts: number;
    futureDebts: number;
    totalInterest: number;
    totalRemaining: number;
    totalPaid: number;
    interestPaid: number;
    debtFreeDate: string;
    progressPercentage: number;
    dueThisMonth: number;
    totalDueThisMonth: number;
    upcomingDebts: Debt[];
  }> {
    try {
      const debts = await this.getAllDebts(userId);
      const now = new Date();
      const currentMonth = now.toISOString().slice(0, 7);
      
      const totalDebt = debts.length;
      const activeDebts = debts.filter(debt => debt.status === 'active').length;
      const overdueDebts = debts.filter(debt => debt.status === 'overdue').length;
      const paidDebts = debts.filter(debt => debt.status === 'paid').length;
      const futureDebts = debts.filter(debt => debt.status === 'future').length;
      
      const totalRemaining = debts.reduce((sum, debt) => sum + debt.currentAmount, 0);
      const totalPaid = debts.reduce((sum, debt) => sum + (debt.initialAmount - debt.currentAmount), 0);
      const monthlyPayment = debts
        .filter(debt => debt.status === 'active' || debt.status === 'overdue')
        .reduce((sum, debt) => sum + debt.monthlyPayment, 0);
      
      const interestPaid = debts.reduce((sum, debt) => {
        return sum + (debt.initialAmount - debt.currentAmount) * (debt.interestRate / 100);
      }, 0);

      const totalInterest = debts.reduce((sum, debt) => {
        const monthlyInterest = (debt.currentAmount * debt.interestRate) / 100 / 12;
        return sum + monthlyInterest;
      }, 0);

      // ✅ DETTES DU MOIS EN COURS
      const dueThisMonth = debts.filter(debt => 
        debt.dueMonth === currentMonth && 
        (debt.status === 'active' || debt.status === 'overdue')
      ).length;

      const totalDueThisMonth = debts
        .filter(debt => debt.dueMonth === currentMonth)
        .reduce((sum, debt) => sum + debt.monthlyPayment, 0);

      const upcomingDebts = debts
        .filter(debt => {
          if (!debt.dueDate || debt.status === 'paid') return false;
          const dueDate = new Date(debt.dueDate);
          return dueDate > now;
        })
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        .slice(0, 5);

      const progressPercentage = totalPaid > 0 ? 
        (totalPaid / (totalPaid + totalRemaining)) * 100 : 0;

      // Calcul simplifié de la date de libération
      const activeDebtsList = debts.filter(debt => 
        debt.status === 'active' || debt.status === 'overdue'
      );
      
      let debtFreeDate = new Date().toISOString().split('T')[0];
      if (activeDebtsList.length > 0) {
        let maxDate = new Date();
        activeDebtsList.forEach(debt => {
          if (debt.dueDate) {
            const dueDate = new Date(debt.dueDate);
            if (dueDate > maxDate) {
              maxDate = dueDate;
            }
          }
        });
        debtFreeDate = maxDate.toISOString().split('T')[0];
      }

      return {
        totalDebt,
        activeDebts,
        overdueDebts,
        paidDebts,
        futureDebts,
        totalRemaining,
        totalPaid,
        monthlyPayment,
        interestPaid,
        totalInterest,
        debtFreeDate,
        progressPercentage,
        dueThisMonth,
        totalDueThisMonth,
        upcomingDebts
      };
    } catch (error) {
      console.error('❌ [debtService] Error getting debt stats:', error);
      throw error;
    }
  },

  /**
   * ✅ DETTES ÉLIGIBLES AU PAIEMENT CE MOIS
   */
  async getEligibleDebtsThisMonth(userId: string = 'default-user'): Promise<Debt[]> {
    try {
      const debts = await this.getAllDebts(userId);
      return debts.filter(debt => 
        debt.paymentEligibility.isEligible && 
        debt.paymentEligibility.isCurrentMonth
      );
    } catch (error) {
      console.error('❌ [debtService] Error getting eligible debts:', error);
      throw error;
    }
  },

  /**
   * ✅ DETTES EN RETARD
   */
  async getOverdueDebts(userId: string = 'default-user'): Promise<Debt[]> {
    try {
      const debts = await this.getAllDebts(userId);
      return debts.filter(debt => 
        debt.status === 'overdue' || 
        debt.paymentEligibility.isPastDue
      );
    } catch (error) {
      console.error('❌ [debtService] Error getting overdue debts:', error);
      throw error;
    }
  }
};

export default debtService;