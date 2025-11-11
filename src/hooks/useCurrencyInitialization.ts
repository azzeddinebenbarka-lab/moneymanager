// src/hooks/useCurrencyInitialization.ts - NOUVEAU FICHIER
import { useEffect, useState } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { currencyMigrationService } from '../services/currencyMigrationService';
import { useMultiCurrency } from './useMultiCurrency';

export const useCurrencyInitialization = () => {
  const { currency, setMADAsPrimary, ensureMADCurrency } = useCurrency();
  const { setMADAsPrimary: setMADInMultiCurrency, syncWithCurrencyContext } = useMultiCurrency();
  const [isInitializing, setIsInitializing] = useState(true);
  const [needsMigration, setNeedsMigration] = useState(false);

  useEffect(() => {
    initializeCurrency();
  }, []);

  const initializeCurrency = async () => {
    try {
      setIsInitializing(true);
      console.log('💰 Initialisation du système de devises...');

      // 1. Vérifier la cohérence des devises
      const consistency = await currencyMigrationService.checkCurrencyConsistency();
      
      if (!consistency.isConsistent) {
        console.warn('⚠️ Incohérences de devises détectées:', consistency.issues);
        setNeedsMigration(true);
        
        // Migration automatique si nécessaire
        await migrateToMAD();
      }

      // 2. S'assurer que MAD est la devise principale
      if (currency.code !== 'MAD') {
        console.log('🔄 Forcer MAD comme devise principale...');
        await setMADAsPrimary();
        await setMADInMultiCurrency();
      }

      // 3. Synchroniser les contextes
      await syncWithCurrencyContext();
      
      // 4. Vérifier que MAD est disponible
      ensureMADCurrency();

      console.log('✅ Système de devises initialisé avec MAD');
      
    } catch (error) {
      console.error('❌ Erreur initialisation devises:', error);
    } finally {
      setIsInitializing(false);
    }
  };

  const migrateToMAD = async () => {
    try {
      console.log('🔄 Migration de toutes les données vers MAD...');
      const result = await currencyMigrationService.migrateAllDataToMAD();
      
      if (result.success) {
        console.log('✅ Migration vers MAD réussie:', result.migrated);
        setNeedsMigration(false);
      } else {
        console.error('❌ Échec migration vers MAD:', result.errors);
      }
    } catch (error) {
      console.error('❌ Erreur lors de la migration:', error);
    }
  };

  const forceMADMigration = async () => {
    await migrateToMAD();
    await initializeCurrency();
  };

  return {
    isInitializing,
    needsMigration,
    currentCurrency: currency,
    forceMADMigration,
    reinitialize: initializeCurrency
  };
};