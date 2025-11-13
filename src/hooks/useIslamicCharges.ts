// src/hooks/useIslamicCharges.ts - VERSION COMPLÈTEMENT CORRIGÉE
import { useCallback, useEffect, useState } from 'react';
import IslamicCalendarService from '../services/islamicCalendarService';
import { secureStorage } from '../services/storage/secureStorage';
import { DEFAULT_ISLAMIC_SETTINGS, IslamicCharge, IslamicHoliday, IslamicSettings } from '../types/IslamicCharge';
import { useAnnualCharges } from './useAnnualCharges';

export const useIslamicCharges = () => {
  const [islamicCharges, setIslamicCharges] = useState<IslamicCharge[]>([]);
  const [settings, setSettings] = useState<IslamicSettings>(DEFAULT_ISLAMIC_SETTINGS);
  const [isLoading, setIsLoading] = useState(false);

  const { addAnnualCharge, refreshAnnualCharges } = useAnnualCharges();

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    if (settings.isEnabled && settings.autoCreateCharges) {
      loadChargesForCurrentYear();
    }
  }, [settings.isEnabled, settings.autoCreateCharges]);

  const loadSettings = useCallback(async () => {
    try {
      const savedSettings = await secureStorage.getItem('islamic_settings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings({
          ...DEFAULT_ISLAMIC_SETTINGS,
          ...parsedSettings
        });
      }
    } catch (error) {
      console.error('Error loading islamic settings:', error);
    }
  }, []);

  const saveSettings = useCallback(async (newSettings: IslamicSettings) => {
    try {
      setSettings(newSettings);
      await secureStorage.setItem('islamic_settings', JSON.stringify(newSettings));
      console.log('✅ Islamic settings saved:', newSettings);
    } catch (error) {
      console.error('Error saving islamic settings:', error);
      throw error;
    }
  }, []);

  const loadChargesForCurrentYear = useCallback(async () => {
    if (!settings.isEnabled) return;

    try {
      setIsLoading(true);
      const currentYear = new Date().getFullYear();
      
      // Obtenir les charges COMPLÈTES avec toutes les propriétés
      const charges = IslamicCalendarService.getChargesForYear(currentYear);
      
      // Filtrer selon les paramètres
      const filteredCharges = charges.filter(charge => {
        if (charge.type === 'recommended') {
          return settings.includeRecommended;
        }
        return true;
      });
      
      setIslamicCharges(filteredCharges);
      console.log(`✅ Loaded ${filteredCharges.length} islamic charges for year ${currentYear}`);
    } catch (error) {
      console.error('Error loading islamic charges:', error);
    } finally {
      setIsLoading(false);
    }
  }, [settings.isEnabled, settings.includeRecommended]);

  const generateChargesForCurrentYear = useCallback(async (): Promise<void> => { // ✅ CORRECTION: Retourne Promise<void>
    if (!settings.isEnabled) {
      console.log('⚠️ Islamic charges generation skipped: feature disabled');
      return;
    }

    try {
      console.log('🔄 Generating islamic charges for current year...');
      
      const currentYear = new Date().getFullYear();
      const charges = IslamicCalendarService.getChargesForYear(currentYear);
      
      // Filtrer selon les paramètres
      const filteredCharges = charges.filter(charge => {
        if (charge.type === 'recommended') {
          return settings.includeRecommended;
        }
        return true;
      });
      
      // Convertir en charges annuelles
      for (const charge of filteredCharges) {
        try {
          // Utiliser le montant par défaut approprié
          const amount = charge.defaultAmount || settings.defaultAmounts[charge.type];
          
          // Convertir le type pour correspondre à AnnualCharge
          const annualChargeType = charge.type === 'custom' ? 'normal' : charge.type;
          
          await addAnnualCharge({
            name: `${charge.name} (${charge.arabicName})`,
            amount: amount,
            dueDate: charge.calculatedDate,
            category: 'islamic',
            description: charge.description,
            isRecurring: true,
            isActive: true,
            isIslamic: true,
            islamicHolidayId: charge.id,
            arabicName: charge.arabicName,
            type: annualChargeType,
            isPaid: false // ✅ CORRECTION: Ajout de isPaid
          });
          
          console.log(`✅ Islamic charge created: ${charge.name}`);
        } catch (chargeError) {
          console.error(`❌ Error creating islamic charge ${charge.name}:`, chargeError);
        }
      }
      
      setIslamicCharges(filteredCharges);
      await refreshAnnualCharges();
      
      console.log('✅ Islamic charges generation completed successfully');
    } catch (error) {
      console.error('❌ Error generating islamic charges:', error);
      throw error;
    }
  }, [settings, addAnnualCharge, refreshAnnualCharges]);

  const updateChargeAmount = useCallback(async (chargeId: string, newAmount: number) => {
    setIslamicCharges(prev => 
      prev.map(charge => 
        charge.id === chargeId ? { ...charge, amount: newAmount } : charge
      )
    );
    console.log(`💰 Islamic charge amount updated: ${chargeId} -> ${newAmount}`);
  }, []);

  const markAsPaid = useCallback(async (chargeId: string, paidDate: Date = new Date()) => {
    setIslamicCharges(prev =>
      prev.map(charge =>
        charge.id === chargeId 
          ? { ...charge, isPaid: true, paidDate } 
          : charge
      )
    );
    console.log(`✅ Islamic charge marked as paid: ${chargeId}`);
  }, []);

  const addCustomCharge = useCallback(async (holiday: Omit<IslamicHoliday, 'id'>) => {
    const newHoliday: IslamicHoliday = {
      ...holiday,
      id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    
    const newSettings: IslamicSettings = {
      ...settings,
      customCharges: [...settings.customCharges, newHoliday]
    };
    await saveSettings(newSettings);
    console.log(`✅ Custom islamic charge added: ${newHoliday.name}`);
  }, [settings, saveSettings]);

  const updateDefaultAmount = useCallback(async (type: 'obligatory' | 'recommended' | 'custom', amount: number) => {
    const newSettings: IslamicSettings = {
      ...settings,
      defaultAmounts: {
        ...settings.defaultAmounts,
        [type]: amount
      }
    };
    await saveSettings(newSettings);
  }, [settings, saveSettings]);

  const enableIslamicCharges = useCallback(async (): Promise<void> => { // ✅ CORRECTION: Retourne Promise<void>
    const newSettings: IslamicSettings = { ...settings, isEnabled: true };
    await saveSettings(newSettings);
    
    if (newSettings.autoCreateCharges) {
      await generateChargesForCurrentYear();
    }
  }, [settings, saveSettings, generateChargesForCurrentYear]);

  const disableIslamicCharges = useCallback(async (): Promise<void> => { // ✅ CORRECTION: Retourne Promise<void>
    const newSettings: IslamicSettings = { ...settings, isEnabled: false };
    await saveSettings(newSettings);
    setIslamicCharges([]);
  }, [settings, saveSettings]);

  const toggleIncludeRecommended = useCallback(async () => {
    const newSettings: IslamicSettings = {
      ...settings,
      includeRecommended: !settings.includeRecommended
    };
    await saveSettings(newSettings);
  }, [settings, saveSettings]);

  const toggleAutoCreateCharges = useCallback(async () => {
    const newSettings: IslamicSettings = {
      ...settings,
      autoCreateCharges: !settings.autoCreateCharges
    };
    await saveSettings(newSettings);
  }, [settings, saveSettings]);

  const removeCustomCharge = useCallback(async (chargeId: string) => {
    const newSettings: IslamicSettings = {
      ...settings,
      customCharges: settings.customCharges.filter(charge => charge.id !== chargeId)
    };
    await saveSettings(newSettings);
    console.log(`🗑️ Custom islamic charge removed: ${chargeId}`);
  }, [settings, saveSettings]);

  const resetSettings = useCallback(async () => {
    await saveSettings(DEFAULT_ISLAMIC_SETTINGS);
    setIslamicCharges([]);
    console.log('🔄 Islamic settings reset to defaults');
  }, [saveSettings]);

  // Fonction utilitaire pour obtenir un montant sécurisé
  const getSafeAmount = useCallback((holiday: IslamicHoliday): number => {
    return holiday.defaultAmount || settings.defaultAmounts[holiday.type] || 0;
  }, [settings.defaultAmounts]);

  // Vérifier s'il y a des charges
  const hasCharges = islamicCharges.length > 0;

  // ✅ NOUVELLE PROPRIÉTÉ: isEnabled pour compatibilité
  const isEnabled = settings.isEnabled;

  return {
    // État
    islamicCharges,
    settings,
    isLoading,
    hasCharges,
    isEnabled, // ✅ CORRECTION: Ajout pour compatibilité
    
    // Actions
    saveSettings,
    updateChargeAmount,
    markAsPaid,
    addCustomCharge,
    removeCustomCharge,
    updateDefaultAmount,
    generateChargesForCurrentYear,
    loadChargesForCurrentYear,
    enableIslamicCharges,
    disableIslamicCharges,
    toggleIncludeRecommended,
    toggleAutoCreateCharges,
    resetSettings,
    loadSettings,
    
    // Utilitaires
    getSafeAmount,
    
    // Données
    availableHolidays: IslamicCalendarService.getAllHolidays(),
    customCharges: settings.customCharges
  };
};

export default useIslamicCharges;