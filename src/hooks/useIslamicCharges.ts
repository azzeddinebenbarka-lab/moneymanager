// src/hooks/useIslamicCharges.ts - VERSION SANS CONTEXTE
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { annualChargeService } from '../services/annualChargeService';
import { IslamicCalendarService } from '../services/islamicCalendarService';
import { secureStorage } from '../services/storage/secureStorage'; // ✅ AJOUT
import { CreateAnnualChargeData } from '../types/AnnualCharge';
import { DEFAULT_ISLAMIC_SETTINGS, IslamicCharge, IslamicSettings } from '../types/IslamicCharge';

export const useIslamicCharges = (userId: string = 'default-user') => {
  const [islamicCharges, setIslamicCharges] = useState<IslamicCharge[]>([]);
  const [settings, setSettings] = useState<IslamicSettings>(DEFAULT_ISLAMIC_SETTINGS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ CHARGER LES PARAMÈTRES DEPUIS LE STOCKAGE
  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      const savedSettings = await secureStorage.getItem('islamic_settings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
        console.log('✅ Paramètres islamiques chargés:', parsedSettings.isEnabled);
      } else {
        // Utiliser les paramètres par défaut
        setSettings(DEFAULT_ISLAMIC_SETTINGS);
        console.log('✅ Paramètres islamiques par défaut chargés');
      }
    } catch (error) {
      console.error('❌ Erreur chargement paramètres islamiques:', error);
      setSettings(DEFAULT_ISLAMIC_SETTINGS);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ SAUVEGARDER LES PARAMÈTRES DANS LE STOCKAGE
  const saveSettings = useCallback(async (newSettings: IslamicSettings): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('💾 Sauvegarde paramètres islamiques:', {
        enabled: newSettings.isEnabled,
        autoCreate: newSettings.autoCreateCharges
      });

      // Sauvegarder dans le state local
      setSettings(newSettings);

      // Sauvegarder dans le stockage sécurisé
      await secureStorage.setItem('islamic_settings', JSON.stringify(newSettings));

      // ✅ CRITIQUE : Générer immédiatement les charges si activation
      if (newSettings.isEnabled && newSettings.autoCreateCharges) {
        console.log('🚀 Activation + génération automatique des charges');
        await generateChargesForCurrentYear();
      }
      
      // ✅ CRITIQUE : Nettoyer les charges si désactivation
      if (!newSettings.isEnabled) {
        console.log('🧹 Désactivation - nettoyage des charges islamiques');
        setIslamicCharges([]);
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur sauvegarde paramètres';
      console.error('❌ Erreur sauvegarde:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ NOUVELLE MÉTHODE : Convertir IslamicCharge en AnnualCharge
  const convertToAnnualChargeData = (islamicCharge: IslamicCharge): CreateAnnualChargeData => {
    return {
      name: islamicCharge.name,
      amount: islamicCharge.amount,
      dueDate: islamicCharge.calculatedDate.toISOString().split('T')[0],
      category: 'islamic',
      isIslamic: true,
      islamicHolidayId: islamicCharge.id,
      arabicName: islamicCharge.arabicName,
      type: islamicCharge.type === 'obligatory' ? 'obligatory' : 
            islamicCharge.type === 'recommended' ? 'recommended' : 'normal',
      notes: islamicCharge.description,
      isActive: true,
      isRecurring: islamicCharge.isRecurring,
      isPaid: islamicCharge.isPaid,
      reminderDays: 7
    };
  };

  // ✅ CORRECTION CRITIQUE : Générer les charges pour l'année courante
  const generateChargesForCurrentYear = useCallback(async (): Promise<void> => {
    try {
      if (!settings.isEnabled) {
        console.log('⏸️ Génération ignorée - fonctionnalité désactivée');
        Alert.alert('Information', 'Veuillez d\'abord activer les charges islamiques dans les paramètres');
        return;
      }

      setLoading(true);
      setError(null);

      console.log('🔄 Génération charges islamiques...');

      const currentYear = new Date().getFullYear();
      const charges = IslamicCalendarService.getChargesForYear(currentYear);

      // Filtrer selon les paramètres
      const filteredCharges = charges.filter(charge => {
        if (charge.type === 'recommended' && !settings.includeRecommended) {
          return false;
        }
        return true;
      });

      console.log(`📋 ${filteredCharges.length} charges à créer`);

      const createdCharges: IslamicCharge[] = [];
      const skippedCharges: string[] = [];

      for (const islamicCharge of filteredCharges) {
        try {
          // Vérification robuste contre les doublons
          const existsById = await annualChargeService.checkIfIslamicChargeExists(
            islamicCharge.id,
            currentYear,
            userId
          );

          // Vérifier aussi par nom + année
          const existingCharges = await annualChargeService.getAllAnnualCharges(userId);
          const existsByNameAndYear = existingCharges.some(charge => 
            charge.name === islamicCharge.name && 
            new Date(charge.dueDate).getFullYear() === currentYear &&
            charge.isIslamic
          );

          if (!existsById && !existsByNameAndYear) {
            const chargeData = convertToAnnualChargeData(islamicCharge);
            await annualChargeService.createAnnualCharge(chargeData, userId);
            createdCharges.push(islamicCharge);
            console.log(`✅ Charge créée: ${islamicCharge.name}`);
          } else {
            skippedCharges.push(islamicCharge.name);
            console.log(`ℹ️ Charge déjà existante: ${islamicCharge.name}`);
          }
        } catch (chargeError) {
          console.error(`❌ Erreur création charge ${islamicCharge.name}:`, chargeError);
        }
      }

      // Mettre à jour l'état local
      setIslamicCharges(prev => [...prev, ...createdCharges]);

      console.log(`✅ ${createdCharges.length} charges islamiques générées, ${skippedCharges.length} ignorées (doublons)`);

      if (createdCharges.length > 0) {
        Alert.alert(
          '✅ Charges Générées',
          `${createdCharges.length} charges islamiques ont été créées pour cette année`
        );
      } else if (skippedCharges.length > 0) {
        Alert.alert(
          'ℹ️ Aucune nouvelle charge',
          `Toutes les charges islamiques pour ${currentYear} existent déjà`
        );
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur génération charges';
      console.error('❌ Erreur génération:', errorMessage);
      setError(errorMessage);
      Alert.alert('Erreur', 'Impossible de générer les charges islamiques');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [settings.isEnabled, settings.includeRecommended, userId]);

  // ✅ CHARGER LES CHARGES EXISTANTES
  const loadIslamicCharges = useCallback(async (): Promise<void> => {
    try {
      if (!settings.isEnabled) {
        console.log('⏸️ Chargement ignoré - fonctionnalité désactivée');
        setIslamicCharges([]);
        return;
      }

      setLoading(true);
      setError(null);

      console.log('🔍 Chargement charges islamiques...');

      const annualCharges = await annualChargeService.getIslamicAnnualCharges(userId);
      
      // Convertir AnnualCharge en IslamicCharge
      const convertedCharges: IslamicCharge[] = annualCharges.map(charge => {
        const holiday = IslamicCalendarService.getHolidayById(charge.islamicHolidayId || '');
        
        return {
          id: charge.id,
          name: charge.name,
          arabicName: charge.arabicName || '',
          description: charge.notes || '',
          hijriMonth: holiday?.hijriMonth || 1,
          hijriDay: holiday?.hijriDay || 1,
          type: charge.type as 'obligatory' | 'recommended' | 'custom',
          defaultAmount: charge.amount,
          isRecurring: charge.recurrence !== undefined,
          year: new Date(charge.dueDate).getFullYear(),
          calculatedDate: new Date(charge.dueDate),
          amount: charge.amount,
          isPaid: charge.isPaid,
          paidDate: charge.paidDate ? new Date(charge.paidDate) : undefined,
          accountId: charge.accountId,
          autoDeduct: charge.autoDeduct || false
        };
      });

      setIslamicCharges(convertedCharges);
      console.log(`✅ ${convertedCharges.length} charges islamiques chargées`);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur chargement charges';
      console.error('❌ Erreur chargement:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [settings.isEnabled, userId]);

  // ✅ MÉTHODE : Mettre à jour le montant d'une charge
  const updateChargeAmount = useCallback(async (chargeId: string, newAmount: number): Promise<void> => {
    try {
      setError(null);
      
      await annualChargeService.updateAnnualCharge(chargeId, { amount: newAmount }, userId);
      
      // Mettre à jour l'état local
      setIslamicCharges(prev => 
        prev.map(charge => 
          charge.id === chargeId ? { ...charge, amount: newAmount } : charge
        )
      );
      
      console.log(`💰 Montant mis à jour: ${chargeId} -> ${newAmount} MAD`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur mise à jour montant';
      console.error('❌ Erreur mise à jour montant:', errorMessage);
      setError(errorMessage);
      throw err;
    }
  }, [userId]);

  // ✅ MÉTHODE : Marquer comme payé avec validation
  const markAsPaid = useCallback(async (chargeId: string, accountId?: string): Promise<void> => {
    try {
      setError(null);
      
      console.log(`💰 Paiement charge islamique: ${chargeId}`, { accountId });

      // Vérifier d'abord si la charge peut être payée
      const canPay = await annualChargeService.canPayCharge(chargeId, userId);
      if (!canPay.canPay) {
        throw new Error(canPay.reason || 'Cette charge ne peut pas être payée pour le moment');
      }

      // Utiliser le service annualCharge pour le paiement
      await annualChargeService.payCharge(chargeId, accountId, userId);
      
      // Mettre à jour l'état local
      setIslamicCharges(prev => 
        prev.map(charge => 
          charge.id === chargeId ? { 
            ...charge, 
            isPaid: true, 
            paidDate: new Date() 
          } : charge
        )
      );
      
      console.log(`✅ Charge marquée comme payée: ${chargeId}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur paiement charge';
      console.error('❌ Erreur paiement:', errorMessage);
      setError(errorMessage);
      throw err;
    }
  }, [userId]);

  // ✅ MÉTHODE : Assigner un compte
  const assignAccount = useCallback(async (chargeId: string, accountId: string, autoDeduct: boolean = false): Promise<void> => {
    try {
      setError(null);
      
      await annualChargeService.updateAnnualCharge(
        chargeId, 
        { accountId, autoDeduct }, 
        userId
      );
      
      // Mettre à jour l'état local
      setIslamicCharges(prev => 
        prev.map(charge => 
          charge.id === chargeId ? { 
            ...charge, 
            accountId, 
            autoDeduct 
          } : charge
        )
      );
      
      console.log(`🏦 Compte assigné: ${chargeId} -> ${accountId} (auto: ${autoDeduct})`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur assignation compte';
      console.error('❌ Erreur assignation compte:', errorMessage);
      setError(errorMessage);
      throw err;
    }
  }, [userId]);

  // ✅ MÉTHODE : Supprimer une charge
  const deleteCharge = useCallback(async (chargeId: string): Promise<void> => {
    try {
      setError(null);
      
      await annualChargeService.deleteAnnualCharge(chargeId, userId);
      
      // Mettre à jour l'état local
      setIslamicCharges(prev => prev.filter(charge => charge.id !== chargeId));
      
      console.log(`🗑️ Charge supprimée: ${chargeId}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur suppression charge';
      console.error('❌ Erreur suppression:', errorMessage);
      setError(errorMessage);
      throw err;
    }
  }, [userId]);

  // ✅ MÉTHODE : Vérifier si une charge peut être payée
  const canPayCharge = useCallback(async (chargeId: string): Promise<{ canPay: boolean; reason?: string }> => {
    try {
      return await annualChargeService.canPayCharge(chargeId, userId);
    } catch (err) {
      console.error('❌ Erreur vérification paiement:', err);
      return { canPay: false, reason: 'Erreur de vérification' };
    }
  }, [userId]);

  // ✅ EFFETS : Chargement initial
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  useEffect(() => {
    loadIslamicCharges();
  }, [loadIslamicCharges]);

  return {
    // État
    islamicCharges,
    settings,
    loading,
    error,
    
    // Actions paramètres
    saveSettings,
    
    // Actions charges
    generateChargesForCurrentYear,
    updateChargeAmount,
    markAsPaid,
    assignAccount,
    deleteCharge,
    canPayCharge,
    
    // Utilitaires
    refreshCharges: loadIslamicCharges,
    clearError: () => setError(null)
  };
};

export default useIslamicCharges;