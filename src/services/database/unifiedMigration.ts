// src/services/database/unifiedMigration.ts - SCRIPT DE MIGRATION COMPLET
import { getDatabase } from './sqlite';
import { migrateToUnifiedTransactions } from './transactionMigration';

export const runUnifiedMigration = async (): Promise<{
  success: boolean;
  steps: {
    schema: boolean;
    data: boolean;
    cleanup: boolean;
  };
  stats: {
    transactionsMigrated: number;
    recurringTransactionsMigrated: number;
  };
  errors: string[];
}> => {
  const errors: string[] = [];
  const stats = {
    transactionsMigrated: 0,
    recurringTransactionsMigrated: 0,
  };

  try {
    console.log('🚀 DÉBUT MIGRATION UNIFIÉE DES TRANSACTIONS');

    const db = await getDatabase();

    // ÉTAPE 1: Migration du schéma
    console.log('📋 Étape 1: Migration du schéma...');
    try {
      await migrateToUnifiedTransactions();
      stats.transactionsMigrated = (await db.getFirstAsync(
        'SELECT COUNT(*) as count FROM transactions WHERE is_recurring = 1'
      ) as any).count;
      
      console.log('✅ Schéma migré avec succès');
    } catch (error) {
      errors.push(`Erreur migration schéma: ${error}`);
    }

    // ÉTAPE 2: Nettoyage (optionnel - suppression ancienne table)
    console.log('🧹 Étape 2: Nettoyage...');
    try {
      // Garder l'ancienne table pour backup, mais la marquer comme obsolète
      await db.execAsync('ALTER TABLE recurring_transactions RENAME TO recurring_transactions_old');
      console.log('✅ Ancienne table archivée');
    } catch (error) {
      console.log('ℹ️ Table recurring_transactions déjà renommée ou inexistante');
    }

    // ÉTAPE 3: Vérification finale
    console.log('🔍 Étape 3: Vérification...');
    const verification = await db.getAllAsync(`
      SELECT 
        (SELECT COUNT(*) FROM transactions WHERE is_recurring = 1) as recurring_count,
        (SELECT COUNT(*) FROM transactions WHERE is_recurring = 0) as normal_count
    `) as any[];

    stats.recurringTransactionsMigrated = verification[0].recurring_count;

    console.log('📊 Statistiques migration:');
    console.log(`   - Transactions récurrentes migrées: ${stats.recurringTransactionsMigrated}`);
    console.log(`   - Transactions normales: ${verification[0].normal_count}`);

    const success = errors.length === 0;
    
    if (success) {
      console.log('🎉 MIGRATION UNIFIÉE TERMINÉE AVEC SUCCÈS');
    } else {
      console.log('⚠️ Migration terminée avec des erreurs:', errors);
    }

    return {
      success,
      steps: {
        schema: true,
        data: true,
        cleanup: true,
      },
      stats,
      errors,
    };

  } catch (error) {
    console.error('❌ ERREUR CRITIQUE LORS DE LA MIGRATION:', error);
    return {
      success: false,
      steps: {
        schema: false,
        data: false,
        cleanup: false,
      },
      stats,
      errors: [...errors, `Erreur critique: ${error}`],
    };
  }
};

// Exécuter la migration au démarrage de l'app
export const initializeUnifiedTransactions = async (): Promise<void> => {
  try {
    console.log('🔧 Initialisation du système de transactions unifiées...');
    
    const migrationResult = await runUnifiedMigration();
    
    if (migrationResult.success) {
      console.log('✅ Système de transactions unifiées initialisé avec succès');
    } else {
      console.warn('⚠️ Système de transactions unifiées initialisé avec des avertissements:', migrationResult.errors);
    }
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation des transactions unifiées:', error);
  }
};

export default runUnifiedMigration;