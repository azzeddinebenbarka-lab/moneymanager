// src/hooks/useDataMigration.ts
import { useState, useCallback } from 'react';
import { MySQLData, MigrationService } from '../services/database/migrationService';

export const useDataMigration = () => {
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationProgress, setMigrationProgress] = useState(0);
  const [migrationError, setMigrationError] = useState<string | null>(null);
  const [migrationStats, setMigrationStats] = useState<any>(null);

  const migrateData = useCallback(async (mysqlData: MySQLData) => {
    setIsMigrating(true);
    setMigrationError(null);
    setMigrationProgress(0);

    try {
      setMigrationProgress(10);
      
      // Validation initiale
      const migrationService = MigrationService.getInstance();
      
      setMigrationProgress(30);
      
      // Exécuter la migration
      const result = await migrationService.migrateData(mysqlData);
      
      setMigrationProgress(80);
      
      // Vérification post-migration
      if (result.success) {
        const verification = await migrationService.verifyMigration();
        setMigrationStats({ ...result.stats, verification });
      } else {
        setMigrationError(`Migration partiellement réussie avec erreurs: ${result.errors.join(', ')}`);
      }
      
      setMigrationProgress(100);
      
      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue lors de la migration';
      setMigrationError(errorMessage);
      throw error;
    } finally {
      setIsMigrating(false);
    }
  }, []);

  const resetMigration = useCallback(() => {
    setIsMigrating(false);
    setMigrationProgress(0);
    setMigrationError(null);
    setMigrationStats(null);
  }, []);

  return {
    isMigrating,
    migrationProgress,
    migrationError,
    migrationStats,
    migrateData,
    resetMigration
  };
};