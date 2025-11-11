// src/utils/fixExports.ts - VERSION COMPLÈTEMENT CORRIGÉE
import { getDatabase } from '../services/database/sqlite';

/**
 * Fichier de correction temporaire pour résoudre les erreurs d'export
 * À supprimer une fois que tous les imports sont corrigés
 */

// ✅ Correction pour emergencyFixTransactionsTable manquant
export const emergencyFixTransactionsTable = async (): Promise<void> => {
  try {
    const db = await getDatabase();
    console.log('🔧 [FIX] Temporary emergencyFixTransactionsTable called');
    
    // Logique de correction temporaire
    const tableInfo = await db.getAllAsync(`PRAGMA table_info(transactions)`) as any[];
    const hasAccountId = tableInfo.some(col => col.name === 'account_id');
    
    if (!hasAccountId) {
      console.log('🛠️ [FIX] Adding account_id column...');
      await db.execAsync(`ALTER TABLE transactions ADD COLUMN account_id TEXT`);
    }
    
    console.log('✅ [FIX] Temporary fix completed');
  } catch (error) {
    console.error('❌ [FIX] Error in temporary fix:', error);
  }
};

// ✅ Correction pour les types Debt harmonisés
export const DebtType = {
  personal: 'personal' as const,
  mortgage: 'mortgage' as const,
  auto: 'auto' as const,
  student: 'student' as const,
  credit_card: 'credit_card' as const,
  loan: 'loan' as const,
  other: 'other' as const
};

export const DebtStatus = {
  active: 'active' as const,
  paid: 'paid' as const,
  overdue: 'overdue' as const,
  settled: 'settled' as const
};

// ✅ Interface temporaire pour Debt (export séparé)
export interface TemporaryDebt {
  id: string;
  name: string;
  initialAmount: number;
  currentAmount: number;
  interestRate: number;
  monthlyPayment: number;
  dueDate: string;
  creditor: string;
  type: keyof typeof DebtType;
  status: keyof typeof DebtStatus;
  createdAt: string;
}

// ✅ Fonction de correction globale
export const applyQuickFixes = async (): Promise<void> => {
  console.log('🚀 Applying quick fixes for missing exports...');
  
  try {
    await emergencyFixTransactionsTable();
    console.log('✅ All quick fixes applied successfully');
  } catch (error) {
    console.error('❌ Error applying quick fixes:', error);
  }
};

// ✅ Export par défaut pour faciliter l'import (sans TemporaryDebt)
const QuickFix = {
  emergencyFixTransactionsTable,
  DebtType,
  DebtStatus,
  applyQuickFixes
};

export default QuickFix;