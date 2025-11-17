// src/services/recurrenceService.ts - VERSION AMÉLIORÉE
import { AnnualCharge } from '../types/AnnualCharge';
import { generateId } from '../utils/numberUtils';
import { annualChargeService } from './annualChargeService';
import { getDatabase } from './database/sqlite';

export const recurrenceService = {
  // ✅ GÉNÉRER LA PROCHAINE OCCURRENCE AUTOMATIQUEMENT
  async generateNextOccurrence(charge: AnnualCharge, userId: string = 'default-user'): Promise<string | null> {
    try {
      if (!charge.isRecurring || !charge.recurrence) {
        console.log('ℹ️ Charge non récurrente - aucune occurrence à générer');
        return null;
      }

      const db = await getDatabase();
      
      // Calculer la prochaine date selon la récurrence
      let nextDueDate: Date;
      const originalDate = new Date(charge.dueDate);

      switch (charge.recurrence) {
        case 'monthly':
          nextDueDate = new Date(originalDate);
          nextDueDate.setMonth(originalDate.getMonth() + 1);
          break;
        case 'quarterly':
          nextDueDate = new Date(originalDate);
          nextDueDate.setMonth(originalDate.getMonth() + 3);
          break;
        case 'yearly':
        default:
          nextDueDate = new Date(originalDate);
          nextDueDate.setFullYear(originalDate.getFullYear() + 1);
          break;
      }

      // Vérifier si l'occurrence existe déjà
      const existingCharge = await db.getFirstAsync(
        `SELECT id FROM annual_charges 
         WHERE user_id = ? 
         AND name = ? 
         AND strftime('%Y-%m-%d', due_date) = ? 
         AND recurrence = ?`,
        [userId, charge.name, nextDueDate.toISOString().split('T')[0], charge.recurrence]
      );

      if (existingCharge) {
        console.log(`ℹ️ Occurrence déjà existante pour ${charge.name} le ${nextDueDate.toISOString().split('T')[0]}`);
        return null;
      }

      // Créer la nouvelle occurrence
      const newChargeId = generateId();
      const createdAt = new Date().toISOString();

      await db.runAsync(
        `INSERT INTO annual_charges (
          id, user_id, name, amount, due_date, category, description, 
          is_recurring, is_active, created_at, is_islamic, islamic_holiday_id, 
          arabic_name, type, is_paid, paid_date, reminder_days,
          account_id, auto_deduct, payment_method, recurrence
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          newChargeId,
          userId,
          charge.name,
          charge.amount,
          nextDueDate.toISOString().split('T')[0],
          charge.category,
          charge.notes || '',
          1, // is_recurring
          1, // is_active
          createdAt,
          charge.isIslamic ? 1 : 0,
          charge.islamicHolidayId || null,
          charge.arabicName || null,
          charge.type || 'normal',
          0, // is_paid (non payée)
          null, // paid_date
          charge.reminderDays || 7,
          charge.accountId || null,
          charge.autoDeduct ? 1 : 0,
          charge.paymentMethod || null,
          charge.recurrence || null
        ]
      );

      console.log(`✅ Occurrence créée: ${charge.name} pour ${nextDueDate.toISOString().split('T')[0]}`);
      return newChargeId;
    } catch (error) {
      console.error('❌ Erreur génération occurrence:', error);
      throw error;
    }
  },

  // ✅ TRAITER TOUTES LES CHARGES RÉCURRENTES PAYÉES
  async processRecurringCharges(userId: string = 'default-user'): Promise<{ processed: number; errors: string[] }> {
    try {
      const db = await getDatabase();
      
      // Récupérer les charges récurrentes payées qui n'ont pas encore généré leur prochaine occurrence
      const paidRecurringCharges = await db.getAllAsync(
        `SELECT * FROM annual_charges 
         WHERE user_id = ? 
         AND is_paid = 1 
         AND is_recurring = 1 
         AND recurrence IS NOT NULL
         AND is_active = 1`,
        [userId]
      ) as any[];

      console.log(`🔄 Traitement de ${paidRecurringCharges.length} charges récurrentes payées`);

      const results = {
        processed: 0,
        errors: [] as string[]
      };

      for (const charge of paidRecurringCharges) {
        try {
          const annualCharge: AnnualCharge = {
            id: charge.id,
            userId: charge.user_id,
            name: charge.name,
            amount: charge.amount,
            dueDate: charge.due_date,
            category: charge.category,
            notes: charge.description || '',
            isRecurring: Boolean(charge.is_recurring),
            isActive: Boolean(charge.is_active),
            createdAt: charge.created_at,
            isIslamic: Boolean(charge.is_islamic),
            islamicHolidayId: charge.islamic_holiday_id,
            arabicName: charge.arabic_name,
            type: charge.type as 'normal' | 'obligatory' | 'recommended',
            isPaid: Boolean(charge.is_paid),
            paidDate: charge.paid_date || undefined,
            reminderDays: charge.reminder_days || 7,
            accountId: charge.account_id,
            autoDeduct: Boolean(charge.auto_deduct),
            paymentMethod: charge.payment_method,
            recurrence: charge.recurrence as 'yearly' | 'monthly' | 'quarterly'
          };

          await this.generateNextOccurrence(annualCharge, userId);
          results.processed++;
        } catch (error) {
          const errorMessage = `Erreur avec la charge ${charge.name}: ${error}`;
          console.error('❌', errorMessage);
          results.errors.push(errorMessage);
        }
      }

      console.log(`✅ Traitement récurrent terminé: ${results.processed} occurrences créées`);
      return results;
    } catch (error) {
      console.error('❌ Erreur traitement charges récurrentes:', error);
      throw error;
    }
  },

  // Reste des méthodes inchangées mais optimisées...
  async enableRecurrence(chargeId: string, recurrence: 'yearly' | 'monthly' | 'quarterly', userId: string = 'default-user'): Promise<void> {
    try {
      await annualChargeService.updateAnnualCharge(chargeId, { 
        isRecurring: true, 
        recurrence 
      }, userId);
      console.log(`✅ Récurrence ${recurrence} activée pour la charge: ${chargeId}`);
    } catch (error) {
      console.error('❌ Erreur activation récurrence:', error);
      throw error;
    }
  },

  async disableRecurrence(chargeId: string, userId: string = 'default-user'): Promise<void> {
    try {
      await annualChargeService.updateAnnualCharge(chargeId, { 
        isRecurring: false, 
        recurrence: null 
      }, userId);
      console.log(`✅ Récurrence désactivée pour la charge: ${chargeId}`);
    } catch (error) {
      console.error('❌ Erreur désactivation récurrence:', error);
      throw error;
    }
  },

  async getRecurringChargesStats(userId: string = 'default-user'): Promise<{
    totalRecurring: number;
    yearly: number;
    monthly: number;
    quarterly: number;
    active: number;
    inactive: number;
  }> {
    try {
      const db = await getDatabase();
      
      const result = await db.getFirstAsync(
        `SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN recurrence = 'yearly' THEN 1 ELSE 0 END) as yearly,
          SUM(CASE WHEN recurrence = 'monthly' THEN 1 ELSE 0 END) as monthly,
          SUM(CASE WHEN recurrence = 'quarterly' THEN 1 ELSE 0 END) as quarterly,
          SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active,
          SUM(CASE WHEN is_active = 0 THEN 1 ELSE 0 END) as inactive
         FROM annual_charges 
         WHERE user_id = ? AND is_recurring = 1`,
        [userId]
      ) as any;

      return {
        totalRecurring: result?.total || 0,
        yearly: result?.yearly || 0,
        monthly: result?.monthly || 0,
        quarterly: result?.quarterly || 0,
        active: result?.active || 0,
        inactive: result?.inactive || 0
      };
    } catch (error) {
      console.error('❌ Erreur statistiques récurrence:', error);
      throw error;
    }
  }
};

export default recurrenceService;