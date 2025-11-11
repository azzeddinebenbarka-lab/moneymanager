// src/utils/savingsEmergencyFix.ts
import { getDatabase } from '../services/database/sqlite';

export const emergencyFixSavingsTables = async (): Promise<void> => {
  try {
    const db = await getDatabase();
    
    console.log('🛠️ Applying emergency fixes for savings tables...');
    
    // 1. Vérifier et corriger la table savings_goals
    const goalsTableInfo = await db.getAllAsync("PRAGMA table_info(savings_goals)");
    const hasMonthlyContribution = goalsTableInfo.some((col: any) => col.name === 'monthly_contribution');
    
    if (!hasMonthlyContribution) {
      console.log('⚠️ Adding missing monthly_contribution column to savings_goals');
      await db.execAsync(`
        ALTER TABLE savings_goals ADD COLUMN monthly_contribution REAL NOT NULL DEFAULT 0
      `);
    }
    
    // 2. Vérifier et corriger la table savings_contributions
    const contribTableInfo = await db.getAllAsync("PRAGMA table_info(savings_contributions)");
    const hasCorrectColumns = contribTableInfo.some((col: any) => col.name === 'goal_id');
    
    if (!hasCorrectColumns) {
      console.log('⚠️ Recreating savings_contributions table with correct structure');
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS savings_contributions_new (
          id TEXT PRIMARY KEY NOT NULL,
          goal_id TEXT NOT NULL,
          amount REAL NOT NULL,
          date TEXT NOT NULL,
          created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (goal_id) REFERENCES savings_goals (id) ON DELETE CASCADE
        )
      `);
      
      // Copier les données si l'ancienne table existe
      const oldTableExists = await db.getFirstAsync(
        "SELECT 1 FROM sqlite_master WHERE type='table' AND name='savings_contributions'"
      );
      
      if (oldTableExists) {
        await db.execAsync(`
          INSERT INTO savings_contributions_new (id, goal_id, amount, date, created_at)
          SELECT id, savings_goal_id, amount, contribution_date, created_at 
          FROM savings_contributions
        `);
        await db.execAsync('DROP TABLE savings_contributions');
      }
      
      await db.execAsync('ALTER TABLE savings_contributions_new RENAME TO savings_contributions');
    }
    
    console.log('✅ Emergency fixes applied successfully');
  } catch (error) {
    console.error('❌ Error applying emergency fixes:', error);
    throw error;
  }
};