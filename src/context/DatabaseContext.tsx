// src/context/DatabaseContext.tsx - VERSION COMPLÈTEMENT CORRIGÉE
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { autoMigrateCategories } from '../services/categoryMigrationService';
import { checkDatabaseStatus, initDatabase, resetDatabase } from '../services/database/sqlite';
import { runAnnualChargesCleanup } from '../utils/annualChargesCleanup';
import { emergencyAnnualChargesFix } from '../utils/emergencyAnnualChargesFix';

interface DatabaseContextType {
  dbInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  retryInitialization: () => void;
  resetDatabase: () => Promise<void>;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

interface DatabaseProviderProps {
  children: ReactNode;
}

export const DatabaseProvider: React.FC<DatabaseProviderProps> = ({ children }) => {
  const [dbInitialized, setDbInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initializeDatabaseWithRepair = async (retryCount = 0): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('🔄 [DB CONTEXT] Starting database initialization with repair...');
      
      // 1. Initialisation normale
      await initDatabase();
      
      // 2. Réparation d'urgence pour les charges annuelles
      try {
        console.log('🛠️ [DB CONTEXT] Running annual charges emergency fix...');
        await emergencyAnnualChargesFix();
        console.log('✅ [DB CONTEXT] Annual charges emergency fix completed');
      } catch (annualChargesError) {
        console.warn('⚠️ [DB CONTEXT] Annual charges fix had issues, but continuing...', annualChargesError);
      }
      
      // 3. Nettoyage catégories/dupli des charges annuelles (idempotent)
      try {
        console.log('🧹 [DB CONTEXT] Running annual charges data cleanup...');
        const res = await runAnnualChargesCleanup();
        console.log('✅ [DB CONTEXT] Cleanup done:', res);
      } catch (cleanupError) {
        console.warn('⚠️ [DB CONTEXT] Annual charges cleanup had issues, continuing...', cleanupError);
      }

      // 3ter. Recalage final des soldes des comptes d'après l'historique - DÉSACTIVÉ
      try {
        console.log('ℹ️ [DB CONTEXT] Recalcul automatique des soldes désactivé (évite corruption)');
        // await accountService.updateAllAccountBalances(); // ⚠️ DÉSACTIVÉ - causait corruption des soldes
        console.log('✅ [DB CONTEXT] Account balances preserved (no automatic recalculation)');
      } catch (balanceError) {
        console.warn('⚠️ [DB CONTEXT] Could not sync account balances, continuing...', balanceError);
      }
      
      // 4. Vérification de l'état
      const status = await checkDatabaseStatus();
      console.log('📋 [DB CONTEXT] Database status after repair:', status);
      
      // 5. 🗑️ SUPPRESSION DÉFINITIVE DES ANCIENNES CATÉGORIES + INSTALLATION DES 50 NOUVELLES
      try {
        console.log('🗑️ [DB CONTEXT] SUPPRESSION DÉFINITIVE de toutes les anciennes catégories...');
        const { getDatabase: getDb } = await import('../services/database/sqlite');
        const db = await getDb();
        
        // Compter les catégories avant suppression
        const beforeCount = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM categories');
        console.log(`📊 [DB CONTEXT] ${beforeCount?.count || 0} catégories dans la BD avant suppression`);
        
        // SUPPRESSION TOTALE ET DÉFINITIVE
        await db.runAsync('DELETE FROM categories');
        console.log('✅ [DB CONTEXT] TOUTES les anciennes catégories SUPPRIMÉES DÉFINITIVEMENT');
        
        // Reset auto-increment
        try {
          await db.runAsync('DELETE FROM sqlite_sequence WHERE name="categories"');
        } catch (e) {
          console.log('ℹ️  [DB CONTEXT] Auto-increment reset non nécessaire');
        }
        
        // Maintenant installer les nouvelles via la migration
        await autoMigrateCategories();
        
        // Vérifier le résultat
        const afterCount = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM categories');
        console.log(`✅ [DB CONTEXT] ${afterCount?.count || 0} NOUVELLES catégories installées`);
        console.log('🎉 [DB CONTEXT] BASE DE DONNÉES NETTOYÉE - Anciennes catégories DISPARUES POUR TOUJOURS');
      } catch (migrationError) {
        console.error('❌ [DB CONTEXT] Categories cleanup FAILED:', migrationError);
      }
      
      // 6. DÉSACTIVÉ : Pas d'autre système d'initialisation
      console.log('🚫 [DB CONTEXT] Aucun autre système - BD propre avec 50 catégories uniquement');
      
      // 7. Traitement automatique des transactions récurrentes (UNE SEULE FOIS au démarrage)
      try {
        console.log('🔄 [DB CONTEXT] Processing recurring transactions...');
        const { transactionRecurrenceService } = await import('../services/transactionRecurrenceService');
        const result = await transactionRecurrenceService.processRecurringTransactions();
        if (result.processed > 0) {
          console.log(`✅ [DB CONTEXT] ${result.processed} recurring transaction(s) created`);
        }
      } catch (recurringError) {
        console.warn('⚠️ [DB CONTEXT] Recurring transactions processing had issues, continuing...', recurringError);
      }
      
      setDbInitialized(true);
      console.log('✅ [DB CONTEXT] Database initialized with repair successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error during database initialization';
      console.error('❌ [DB CONTEXT] Failed to initialize database:', errorMessage);
      
      if (retryCount < 2) {
        console.log(`🔄 [DB CONTEXT] Retrying... (${retryCount + 1}/2)`);
        setTimeout(() => initializeDatabaseWithRepair(retryCount + 1), 1000);
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const retryInitialization = () => {
    console.log('🔄 [DB CONTEXT] Retrying database initialization...');
    initializeDatabaseWithRepair();
  };

  const handleResetDatabase = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await resetDatabase();
      await initializeDatabaseWithRepair();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error resetting database';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initializeDatabaseWithRepair();
  }, []);

  const value: DatabaseContextType = {
    dbInitialized,
    isLoading,
    error,
    retryInitialization,
    resetDatabase: handleResetDatabase
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = (): DatabaseContextType => {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};

export default DatabaseContext;