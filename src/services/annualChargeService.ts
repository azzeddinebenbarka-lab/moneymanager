// src/services/annualChargeService.ts - VERSION COMPLÈTEMENT CORRIGÉE
import { AnnualCharge, CreateAnnualChargeData, UpdateAnnualChargeData } from '../types/AnnualCharge';
import { getDatabase } from './database/sqlite';
import { transactionService } from './transactionService';

interface DatabaseAnnualCharge {
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

// ✅ FONCTIONS UTILITAIRES POUR LA GESTION DES DATES
const isChargeDueThisMonth = (dueDate: string): boolean => {
  const today = new Date();
  const due = new Date(dueDate);
  
  // Vérifier que c'est le même mois ET la même année
  return due.getMonth() === today.getMonth() && 
         due.getFullYear() === today.getFullYear();
};

const shouldProcessCharge = (charge: AnnualCharge): boolean => {
  const today = new Date();
  const dueDate = new Date(charge.dueDate);
  
  // Ne pas traiter les charges déjà payées
  if (charge.isPaid) return false;
  
  // Ne pas traiter les charges futures (au-delà du mois en cours)
  if (dueDate > today) return false;
  
  // Vérifier spécifiquement le mois/année en cours
  return isChargeDueThisMonth(charge.dueDate);
};

export const annualChargeService = {
  async createAnnualCharge(chargeData: CreateAnnualChargeData, userId: string = 'default-user'): Promise<string> {
    try {
      const db = await getDatabase();
      const id = `charge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const createdAt = new Date().toISOString();

      console.log('🔄 [annualChargeService] Creating annual charge:', { id, ...chargeData });
      
      await db.runAsync(
        `INSERT INTO annual_charges (
          id, user_id, name, amount, due_date, category, is_paid, reminder_days, 
          created_at, notes, payment_method, recurrence, account_id, auto_deduct
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          userId,
          chargeData.name,
          chargeData.amount,
          chargeData.dueDate,
          chargeData.category,
          0, // Toujours non payée à la création
          chargeData.reminderDays || 7,
          createdAt,
          chargeData.notes || null,
          chargeData.paymentMethod || null,
          chargeData.recurrence || null,
          chargeData.accountId || null,
          chargeData.autoDeduct ? 1 : 0
        ]
      );
      
      console.log('✅ [annualChargeService] Annual charge created successfully');
      return id;
    } catch (error) {
      console.error('❌ [annualChargeService] Error in createAnnualCharge:', error);
      throw error;
    }
  },

  async getAllAnnualCharges(userId: string = 'default-user'): Promise<AnnualCharge[]> {
    try {
      const db = await getDatabase();
      
      const result = await db.getAllAsync(
        `SELECT * FROM annual_charges WHERE user_id = ? ORDER BY due_date ASC`,
        [userId]
      ) as DatabaseAnnualCharge[];
      
      const charges: AnnualCharge[] = result.map((item) => ({
        id: item.id,
        userId: item.user_id,
        name: item.name,
        amount: item.amount,
        dueDate: item.due_date,
        category: item.category,
        isPaid: Boolean(item.is_paid),
        reminderDays: item.reminder_days,
        createdAt: item.created_at,
        notes: item.notes || undefined,
        paymentMethod: item.payment_method || undefined,
        recurrence: item.recurrence as 'yearly' | 'monthly' | 'quarterly' | undefined,
        accountId: item.account_id || undefined,
        autoDeduct: Boolean(item.auto_deduct),
      }));
      
      console.log('✅ [annualChargeService] Found', charges.length, 'annual charges');
      return charges;
    } catch (error) {
      console.error('❌ [annualChargeService] Error in getAllAnnualCharges:', error);
      throw error;
    }
  },

  async getAnnualChargeById(id: string, userId: string = 'default-user'): Promise<AnnualCharge | null> {
    try {
      const db = await getDatabase();
      
      const result = await db.getFirstAsync(
        `SELECT * FROM annual_charges WHERE id = ? AND user_id = ?`,
        [id, userId]
      ) as DatabaseAnnualCharge | null;
      
      if (result) {
        const charge: AnnualCharge = {
          id: result.id,
          userId: result.user_id,
          name: result.name,
          amount: result.amount,
          dueDate: result.due_date,
          category: result.category,
          isPaid: Boolean(result.is_paid),
          reminderDays: result.reminder_days,
          createdAt: result.created_at,
          notes: result.notes || undefined,
          paymentMethod: result.payment_method || undefined,
          recurrence: result.recurrence as 'yearly' | 'monthly' | 'quarterly' | undefined,
          accountId: result.account_id || undefined,
          autoDeduct: Boolean(result.auto_deduct),
        };
        return charge;
      }
      return null;
    } catch (error) {
      console.error('❌ [annualChargeService] Error in getAnnualChargeById:', error);
      throw error;
    }
  },

  async updateAnnualCharge(id: string, updates: UpdateAnnualChargeData, userId: string = 'default-user'): Promise<void> {
    try {
      const db = await getDatabase();
      
      const fields = Object.keys(updates);
      if (fields.length === 0) return;

      const setClause = fields.map(field => {
        const dbField = field === 'dueDate' ? 'due_date' :
                       field === 'isPaid' ? 'is_paid' :
                       field === 'reminderDays' ? 'reminder_days' :
                       field === 'accountId' ? 'account_id' :
                       field === 'autoDeduct' ? 'auto_deduct' : field;
        return `${dbField} = ?`;
      }).join(', ');

      const values = fields.map(field => {
        const value = (updates as any)[field];
        return field === 'isPaid' || field === 'autoDeduct' ? (value ? 1 : 0) : value;
      });
      values.push(id, userId);

      await db.runAsync(
        `UPDATE annual_charges SET ${setClause} WHERE id = ? AND user_id = ?`,
        values
      );
      
      console.log('✅ [annualChargeService] Annual charge updated successfully');
    } catch (error) {
      console.error('❌ [annualChargeService] Error in updateAnnualCharge:', error);
      throw error;
    }
  },

  async deleteAnnualCharge(id: string, userId: string = 'default-user'): Promise<void> {
    try {
      const db = await getDatabase();
      
      await db.runAsync(
        `DELETE FROM annual_charges WHERE id = ? AND user_id = ?`,
        [id, userId]
      );
      
      console.log('✅ [annualChargeService] Annual charge deleted successfully');
    } catch (error) {
      console.error('❌ [annualChargeService] Error in deleteAnnualCharge:', error);
      throw error;
    }
  },

  // ✅ CORRECTION CRITIQUE : TOGGLE PAID STATUS AVEC VÉRIFICATION TEMPORELLE
  async togglePaidStatus(id: string, isPaid: boolean, userId: string = 'default-user'): Promise<void> {
    try {
      const db = await getDatabase();
      
      const charge = await this.getAnnualChargeById(id, userId);
      if (!charge) throw new Error('Charge annuelle non trouvée');

      const today = new Date();
      const dueDate = new Date(charge.dueDate);
      
      // ✅ VÉRIFICATION CRITIQUE : Empêcher le paiement si ce n'est pas le bon mois
      if (isPaid && !isChargeDueThisMonth(charge.dueDate)) {
        const errorMsg = `Cette charge n'est pas due ce mois-ci (échéance: ${charge.dueDate})`;
        console.warn('⚠️ [annualChargeService] Tentative de paiement hors période:', errorMsg);
        throw new Error(errorMsg);
      }

      console.log('🔄 [annualChargeService] Changement statut paiement:', {
        chargeId: id,
        nom: charge.name,
        dateÉchéance: charge.dueDate,
        autoDeduct: charge.autoDeduct,
        accountId: charge.accountId
      });

      // ✅ SI ON MARQUE COMME PAYÉE ET AUTO-DÉDUCTION ACTIVÉE
      if (isPaid && charge.autoDeduct && charge.accountId) {
        console.log('💰 [annualChargeService] Création transaction auto-déduite...');
        
        try {
          await transactionService.createTransaction({
            amount: -Math.abs(charge.amount),
            type: 'expense',
            category: charge.category,
            accountId: charge.accountId,
            description: `[Charge annuelle] ${charge.name}`,
            date: today.toISOString().split('T')[0], // Toujours la date actuelle
          }, userId);
          
          console.log('✅ [annualChargeService] Transaction créée avec succès');
        } catch (transactionError) {
          console.error('❌ [annualChargeService] Erreur création transaction:', transactionError);
          throw new Error(`Impossible de créer la transaction: ${transactionError}`);
        }
      }

      // Mettre à jour le statut de paiement
      await db.runAsync(
        `UPDATE annual_charges SET is_paid = ? WHERE id = ? AND user_id = ?`,
        [isPaid ? 1 : 0, id, userId]
      );
      
      console.log('✅ [annualChargeService] Statut paiement mis à jour avec succès');
    } catch (error) {
      console.error('❌ [annualChargeService] Error in togglePaidStatus:', error);
      throw error;
    }
  },

  async getAnnualChargeStats(userId: string = 'default-user'): Promise<{
    totalCharges: number;
    totalAmount: number;
    paidAmount: number;
    pendingAmount: number;
    upcomingCharges: AnnualCharge[];
    overdueCharges: AnnualCharge[];
  }> {
    try {
      const charges = await this.getAllAnnualCharges(userId);
      const today = new Date().toISOString().split('T')[0];
      
      const totalCharges = charges.length;
      const totalAmount = charges.reduce((sum, charge) => sum + charge.amount, 0);
      const paidAmount = charges
        .filter(charge => charge.isPaid)
        .reduce((sum, charge) => sum + charge.amount, 0);
      const pendingAmount = totalAmount - paidAmount;

      const upcomingCharges = charges
        .filter(charge => !charge.isPaid && charge.dueDate >= today)
        .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
        .slice(0, 5);

      const overdueCharges = charges
        .filter(charge => !charge.isPaid && charge.dueDate < today)
        .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

      console.log('📊 [annualChargeService] Stats charges:', {
        totalCharges,
        paidAmount,
        pendingAmount,
        upcoming: upcomingCharges.length,
        overdue: overdueCharges.length
      });

      return {
        totalCharges,
        totalAmount,
        paidAmount,
        pendingAmount,
        upcomingCharges,
        overdueCharges,
      };
    } catch (error) {
      console.error('❌ [annualChargeService] Error in getAnnualChargeStats:', error);
      throw error;
    }
  },

  async getChargesByStatus(status: 'all' | 'paid' | 'pending' | 'upcoming' | 'overdue', userId: string = 'default-user'): Promise<AnnualCharge[]> {
    try {
      const charges = await this.getAllAnnualCharges(userId);
      const today = new Date().toISOString().split('T')[0];

      switch (status) {
        case 'paid':
          return charges.filter(charge => charge.isPaid);
        case 'pending':
          return charges.filter(charge => !charge.isPaid);
        case 'upcoming':
          return charges.filter(charge => !charge.isPaid && charge.dueDate >= today);
        case 'overdue':
          return charges.filter(charge => !charge.isPaid && charge.dueDate < today);
        default:
          return charges;
      }
    } catch (error) {
      console.error('❌ [annualChargeService] Error in getChargesByStatus:', error);
      throw error;
    }
  },

  // ✅ CORRECTION CRITIQUE : PROCESS DUE CHARGES AVEC FILTRAGE TEMPOREL
  async processDueCharges(userId: string = 'default-user'): Promise<{ processed: number; errors: string[] }> {
    try {
      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      
      console.log('🔄 [annualChargeService] Vérification charges du mois:', {
        mois: currentMonth + 1,
        année: currentYear
      });

      const charges = await this.getAllAnnualCharges(userId);
      
      // ✅ CORRECTION : Filtrer uniquement les charges du mois/année en cours
      const chargesToProcess = charges.filter(charge => {
        if (charge.isPaid) return false;
        
        const dueDate = new Date(charge.dueDate);
        const isDueThisMonth = dueDate.getMonth() === currentMonth && 
                             dueDate.getFullYear() === currentYear;
        
        console.log('📅 [annualChargeService] Vérification charge:', {
          nom: charge.name,
          dateÉchéance: charge.dueDate,
          moisÉchéance: dueDate.getMonth() + 1,
          annéeÉchéance: dueDate.getFullYear(),
          moisActuel: currentMonth + 1,
          annéeActuelle: currentYear,
          àTraiter: isDueThisMonth
        });
        
        return isDueThisMonth;
      });

      const errors: string[] = [];
      let processed = 0;

      console.log('💰 [annualChargeService] Charges à traiter ce mois:', chargesToProcess.length);

      for (const charge of chargesToProcess) {
        try {
          // ✅ CORRECTION : Vérifier si auto-déduction activée
          if (charge.autoDeduct && charge.accountId) {
            console.log('💳 [annualChargeService] Paiement automatique pour:', charge.name);
            
            // Utiliser la méthode sans mise à jour de solde pour éviter les doubles déductions
            await transactionService.createTransaction({
              amount: -Math.abs(charge.amount),
              type: 'expense',
              category: charge.category,
              accountId: charge.accountId,
              description: `[Charge annuelle] ${charge.name}`,
              date: new Date().toISOString().split('T')[0], // Date actuelle
            }, userId);
          }

          // ✅ Marquer comme payée UNIQUEMENT si traitement réussi
          await this.togglePaidStatus(charge.id, true, userId);
          processed++;
          
          console.log('✅ [annualChargeService] Charge traitée:', charge.name);
        } catch (error) {
          const errorMsg = `Erreur avec la charge ${charge.name}: ${error}`;
          console.error('❌ [annualChargeService]', errorMsg);
          errors.push(errorMsg);
        }
      }

      console.log('🎯 [annualChargeService] Traitement terminé:', { 
        processed, 
        errors: errors.length,
        mois: currentMonth + 1
      });
      
      return { processed, errors };
    } catch (error) {
      console.error('❌ [annualChargeService] Error in processDueCharges:', error);
      throw error;
    }
  },

  // ✅ NOUVELLE MÉTHODE : Obtenir les charges du mois en cours
  async getChargesForCurrentMonth(userId: string = 'default-user'): Promise<AnnualCharge[]> {
    try {
      const charges = await this.getAllAnnualCharges(userId);
      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      
      const currentMonthCharges = charges.filter(charge => {
        const dueDate = new Date(charge.dueDate);
        return dueDate.getMonth() === currentMonth && 
               dueDate.getFullYear() === currentYear;
      });

      console.log('📅 [annualChargeService] Charges du mois en cours:', {
        mois: currentMonth + 1,
        année: currentYear,
        count: currentMonthCharges.length
      });

      return currentMonthCharges;
    } catch (error) {
      console.error('❌ [annualChargeService] Error getting current month charges:', error);
      return [];
    }
  },

  // ✅ NOUVELLE MÉTHODE : Vérifier si une charge peut être payée
  async canChargeBePaid(chargeId: string, userId: string = 'default-user'): Promise<{ canPay: boolean; reason?: string }> {
    try {
      const charge = await this.getAnnualChargeById(chargeId, userId);
      if (!charge) {
        return { canPay: false, reason: 'Charge non trouvée' };
      }

      if (charge.isPaid) {
        return { canPay: false, reason: 'Charge déjà payée' };
      }

      if (!isChargeDueThisMonth(charge.dueDate)) {
        const dueDate = new Date(charge.dueDate);
        return { 
          canPay: false, 
          reason: `Cette charge n'est pas due ce mois-ci (échéance: ${dueDate.toLocaleDateString('fr-FR')})` 
        };
      }

      return { canPay: true };
    } catch (error) {
      console.error('❌ [annualChargeService] Error checking if charge can be paid:', error);
      return { canPay: false, reason: 'Erreur de vérification' };
    }
  },

  // ✅ NOUVELLE MÉTHODE : Obtenir le prochain mois avec des charges
  async getNextMonthWithCharges(userId: string = 'default-user'): Promise<{ month: number; year: number; charges: AnnualCharge[] } | null> {
    try {
      const charges = await this.getAllAnnualCharges(userId);
      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();

      // Trouver tous les mois futurs avec des charges non payées
      const futureMonths = new Map<string, AnnualCharge[]>();

      charges.forEach(charge => {
        if (!charge.isPaid) {
          const dueDate = new Date(charge.dueDate);
          const dueMonth = dueDate.getMonth();
          const dueYear = dueDate.getFullYear();
          
          // Ne considérer que les mois futurs
          if (dueYear > currentYear || (dueYear === currentYear && dueMonth > currentMonth)) {
            const key = `${dueYear}-${dueMonth}`;
            if (!futureMonths.has(key)) {
              futureMonths.set(key, []);
            }
            futureMonths.get(key)!.push(charge);
          }
        }
      });

      // Trouver le prochain mois
      if (futureMonths.size === 0) {
        return null;
      }

      const sortedKeys = Array.from(futureMonths.keys()).sort();
      const nextKey = sortedKeys[0];
      const [year, month] = nextKey.split('-').map(Number);

      return {
        month: month + 1, // +1 car les mois sont 0-indexés
        year,
        charges: futureMonths.get(nextKey)!
      };
    } catch (error) {
      console.error('❌ [annualChargeService] Error getting next month with charges:', error);
      return null;
    }
  },

  // ✅ NOUVELLE MÉTHODE : Réinitialiser les charges payées pour le nouveau mois (pour les charges récurrentes)
  async resetRecurringCharges(userId: string = 'default-user'): Promise<{ reset: number }> {
    try {
      const charges = await this.getAllAnnualCharges(userId);
      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();

      let resetCount = 0;

      for (const charge of charges) {
        if (charge.isPaid && charge.recurrence) {
          const dueDate = new Date(charge.dueDate);
          const dueMonth = dueDate.getMonth();
          const dueYear = dueDate.getFullYear();

          // Si la charge est payée mais que sa date d'échéance est passée et qu'elle est récurrente
          // On la réinitialise pour le prochain cycle
          if (dueYear < currentYear || (dueYear === currentYear && dueMonth < currentMonth)) {
            // Calculer la prochaine date d'échéance selon la récurrence
            let nextDueDate = new Date(dueDate);
            
            switch (charge.recurrence) {
              case 'monthly':
                nextDueDate.setMonth(currentMonth + 1);
                break;
              case 'quarterly':
                nextDueDate.setMonth(currentMonth + 3);
                break;
              case 'yearly':
                nextDueDate.setFullYear(currentYear + 1);
                break;
            }

            await this.updateAnnualCharge(charge.id, {
              isPaid: false,
              dueDate: nextDueDate.toISOString().split('T')[0]
            }, userId);

            resetCount++;
            console.log('🔄 [annualChargeService] Charge récurrente réinitialisée:', {
              nom: charge.name,
              ancienneDate: charge.dueDate,
              nouvelleDate: nextDueDate.toISOString().split('T')[0]
            });
          }
        }
      }

      console.log('✅ [annualChargeService] Charges récurrentes réinitialisées:', resetCount);
      return { reset: resetCount };
    } catch (error) {
      console.error('❌ [annualChargeService] Error resetting recurring charges:', error);
      throw error;
    }
  }
};