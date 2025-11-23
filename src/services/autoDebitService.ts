// src/services/autoDebitService.ts
// Service de prélèvement automatique pour charges annuelles

import { getDatabase } from './database/database';

export interface PendingDebit {
  id: string;
  type: 'annual_charge' | 'recurring_transaction';
  name: string;
  amount: number;
  dueDate: string;
  accountId: string;
  category: string;
}

/**
 * Vérifie et exécute les prélèvements automatiques en attente
 * Appelé au démarrage de l'app et lors du refresh
 */
export async function processAutomaticDebits(): Promise<{
  processed: number;
  errors: string[];
}> {
  const db = await getDatabase();
  const today = new Date().toISOString().split('T')[0];
  const processed: string[] = [];
  const errors: string[] = [];

  try {
    // 1. Récupérer les charges annuelles dues
    const annualCharges = await db.getAllAsync<any>(`
      SELECT * FROM annual_charges
      WHERE dueDate <= ? 
      AND (lastProcessedDate IS NULL OR lastProcessedDate < ?)
      AND isActive = 1
    `, [today, today]);

    console.log(`💳 ${annualCharges.length} charge(s) annuelle(s) à traiter`);

    for (const charge of annualCharges) {
      try {
        // Créer la transaction de prélèvement
        await db.runAsync(`
          INSERT INTO transactions (
            id, description, amount, type, category, 
            accountId, date, isRecurring, createdAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?)
        `, [
          `charge_${charge.id}_${Date.now()}`,
          `Prélèvement automatique: ${charge.name}`,
          charge.amount,
          'expense',
          'charge_annuelle',
          charge.accountId,
          today,
          new Date().toISOString(),
        ]);

        // Mettre à jour la date de traitement
        await db.runAsync(`
          UPDATE annual_charges
          SET lastProcessedDate = ?
          WHERE id = ?
        `, [today, charge.id]);

        // Calculer la prochaine date d'échéance (un an plus tard)
        const nextYear = new Date(charge.dueDate);
        nextYear.setFullYear(nextYear.getFullYear() + 1);
        
        await db.runAsync(`
          UPDATE annual_charges
          SET dueDate = ?
          WHERE id = ?
        `, [nextYear.toISOString().split('T')[0], charge.id]);

        processed.push(charge.id);
        console.log(`✅ Charge annuelle prélevée: ${charge.name}`);
      } catch (error) {
        console.error(`❌ Erreur prélèvement charge ${charge.name}:`, error);
        errors.push(`${charge.name}: ${error}`);
      }
    }

    // 2. Récupérer les transactions récurrentes dues
    const recurringTransactions = await db.getAllAsync<any>(`
      SELECT * FROM transactions
      WHERE isRecurring = 1
      AND date <= ?
      AND (lastRecurredDate IS NULL OR lastRecurredDate < ?)
    `, [today, today]);

    console.log(`🔄 ${recurringTransactions.length} transaction(s) récurrente(s) à traiter`);

    for (const transaction of recurringTransactions) {
      try {
        // Calculer la prochaine date (un mois plus tard, même jour)
        const currentDate = new Date(transaction.date);
        const nextMonth = new Date(currentDate);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        
        // Créer la nouvelle transaction récurrente
        await db.runAsync(`
          INSERT INTO transactions (
            id, description, amount, type, category, subCategory,
            accountId, date, isRecurring, createdAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
        `, [
          `recur_${transaction.id}_${Date.now()}`,
          transaction.description,
          transaction.amount,
          transaction.type,
          transaction.category,
          transaction.subCategory,
          transaction.accountId,
          nextMonth.toISOString().split('T')[0],
          new Date().toISOString(),
        ]);

        // Mettre à jour la date de traitement de l'originale
        await db.runAsync(`
          UPDATE transactions
          SET lastRecurredDate = ?
          WHERE id = ?
        `, [today, transaction.id]);

        processed.push(transaction.id);
        console.log(`✅ Transaction récurrente créée: ${transaction.description}`);
      } catch (error) {
        console.error(`❌ Erreur récurrence transaction ${transaction.description}:`, error);
        errors.push(`${transaction.description}: ${error}`);
      }
    }

    return {
      processed: processed.length,
      errors,
    };
  } catch (error) {
    console.error('❌ Erreur processAutomaticDebits:', error);
    return {
      processed: 0,
      errors: [`Erreur globale: ${error}`],
    };
  }
}

/**
 * Récupère la liste des prélèvements en attente (à venir dans les 7 jours)
 */
export async function getPendingDebits(): Promise<PendingDebit[]> {
  const db = await getDatabase();
  const today = new Date().toISOString().split('T')[0];
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  const nextWeekStr = nextWeek.toISOString().split('T')[0];

  try {
    const charges = await db.getAllAsync<any>(`
      SELECT 
        id,
        'annual_charge' as type,
        name,
        amount,
        dueDate,
        accountId,
        'charge_annuelle' as category
      FROM annual_charges
      WHERE dueDate BETWEEN ? AND ?
      AND isActive = 1
      ORDER BY dueDate ASC
    `, [today, nextWeekStr]);

    return charges.map(charge => ({
      id: charge.id,
      type: 'annual_charge',
      name: charge.name,
      amount: charge.amount,
      dueDate: charge.dueDate,
      accountId: charge.accountId,
      category: charge.category,
    }));
  } catch (error) {
    console.error('❌ Erreur getPendingDebits:', error);
    return [];
  }
}
