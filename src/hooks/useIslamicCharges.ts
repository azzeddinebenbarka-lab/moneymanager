// src/hooks/useIslamicCharges.ts - VERSION CORRIGÉE
import { useCallback, useEffect, useState } from 'react';
import IslamicCalendarService from '../services/islamicCalendarService';
import { secureStorage } from '../services/storage/secureStorage';
import { IslamicCharge, IslamicHoliday, IslamicSettings } from '../types/IslamicCharge';
import { useAccounts } from './useAccounts';
import { useAnnualCharges } from './useAnnualCharges';

export const useIslamicCharges = () => {
  const [islamicCharges, setIslamicCharges] = useState<IslamicCharge[]>([]);
  const [settings, setSettings] = useState<IslamicSettings>({
    isEnabled: false,
    calculationMethod: 'UmmAlQura',
    customCharges: [],
    autoCreateCharges: true,
    includeRecommended: true,
    defaultAmounts: {
      obligatory: 100,
      recommended: 50
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  const { createCharge, updateAnnualCharge } = useAnnualCharges();
  const { accounts } = useAccounts();

  useEffect(() => { 
    loadSettings();
    if (settings.isEnabled) {
      loadChargesForCurrentYear();
    }
  }, []);

  const loadSettings = useCallback(async () => {
    try {
      const savedSettings = await secureStorage.getItem('islamic_settings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading islamic settings:', error);
    }
  }, []);

  const saveSettings = useCallback(async (newSettings: IslamicSettings) => {
    try {
      setSettings(newSettings);
      await secureStorage.setItem('islamic_settings', JSON.stringify(newSettings));
      
      if (newSettings.autoCreateCharges && newSettings.isEnabled) {
        await generateChargesForCurrentYear();
      }
    } catch (error) {
      console.error('Error saving islamic settings:', error);
    }
  }, []);

  const loadChargesForCurrentYear = useCallback(async () => {
    if (!settings.isEnabled) return;

    try {
      setIsLoading(true);
      const currentYear = new Date().getFullYear();
      const charges = IslamicCalendarService.getChargesForYear(currentYear);
      
      // Filtrer selon les paramètres
      let filteredCharges = charges;
      if (!settings.includeRecommended) {
        filteredCharges = charges.filter(charge => charge.type === 'obligatory');
      }
      
      setIslamicCharges(filteredCharges);
    } catch (error) {
      console.error('Error loading islamic charges:', error);
    } finally {
      setIsLoading(false);
    }
  }, [settings.isEnabled, settings.includeRecommended]);

  const generateChargesForCurrentYear = useCallback(async () => {
    if (!settings.isEnabled) return;

    try {
      const currentYear = new Date().getFullYear();
      const charges = IslamicCalendarService.getChargesForYear(currentYear);
      
      // Filtrer selon les paramètres
      let chargesToCreate = charges;
      if (!settings.includeRecommended) {
        chargesToCreate = charges.filter(charge => charge.type === 'obligatory');
      }
      
      // Convertir en charges annuelles avec compte par défaut
      const defaultAccount = accounts.find(acc => acc.type === 'bank') || accounts[0];
      
      for (const charge of chargesToCreate) {
        const amount = charge.type === 'obligatory' 
          ? settings.defaultAmounts.obligatory 
          : settings.defaultAmounts.recommended;

        // ✅ CORRECTION : Convertir le type "custom" en "recommended" pour la compatibilité
        const chargeType = charge.type === 'custom' ? 'recommended' : charge.type;

        await createCharge({
          name: charge.name,
          amount: amount,
          dueDate: charge.calculatedDate.toISOString().split('T')[0],
          category: 'islamic',
          notes: charge.description,
          accountId: defaultAccount?.id,
          autoDeduct: false,
          recurrence: 'yearly',
          isIslamic: true,
          arabicName: charge.arabicName,
          type: chargeType, // ✅ CORRIGÉ : Utiliser le type converti
          isActive: true,
          isRecurring: true,
        });
      }
      
      setIslamicCharges(chargesToCreate);
    } catch (error) {
      console.error('Error generating islamic charges:', error);
    }
  }, [settings, accounts, createCharge]);

  const updateChargeAmount = useCallback(async (chargeId: string, newAmount: number) => {
    setIslamicCharges(prev => 
      prev.map(charge => 
        charge.id === chargeId ? { ...charge, amount: newAmount } : charge
      )
    );

    // Mettre à jour aussi la charge annuelle correspondante
    try {
      const charge = islamicCharges.find(c => c.id === chargeId);
      if (charge) {
        // Extraire l'ID de la charge annuelle (format: holidayId_year)
        const annualChargeId = charge.id.split('_')[0];
        await updateAnnualCharge(annualChargeId, { amount: newAmount });
      }
    } catch (error) {
      console.error('Error updating annual charge amount:', error);
    }
  }, [islamicCharges, updateAnnualCharge]);

  const markAsPaid = useCallback(async (chargeId: string, accountId?: string) => {
    try {
      const charge = islamicCharges.find(c => c.id === chargeId);
      if (!charge) return;

      const paidDate = new Date();
      
      // Mettre à jour l'état local
      setIslamicCharges(prev =>
        prev.map(charge =>
          charge.id === chargeId 
            ? { ...charge, isPaid: true, paidDate, accountId } 
            : charge
        )
      );

      // Mettre à jour la charge annuelle correspondante
      try {
        const annualChargeId = charge.id.split('_')[0];
        
        // ✅ CORRECTION : Convertir Date en string pour la compatibilité
        await updateAnnualCharge(annualChargeId, { 
          isPaid: true, 
          paidDate: paidDate.toISOString(), // ✅ CORRIGÉ : Convertir en string
          accountId: accountId || charge.accountId 
        });
      } catch (error) {
        console.error('Error updating annual charge:', error);
      }

    } catch (error) {
      console.error('Error marking charge as paid:', error);
      throw error;
    }
  }, [islamicCharges, updateAnnualCharge]);

  const assignAccountToCharge = useCallback(async (chargeId: string, accountId: string, autoDeduct: boolean = false) => {
    try {
      const charge = islamicCharges.find(c => c.id === chargeId);
      if (!charge) return;

      // Mettre à jour l'état local
      setIslamicCharges(prev =>
        prev.map(charge =>
          charge.id === chargeId 
            ? { ...charge, accountId, autoDeduct } 
            : charge
        )
      );

      // Mettre à jour la charge annuelle correspondante
      try {
        const annualChargeId = charge.id.split('_')[0];
        await updateAnnualCharge(annualChargeId, { 
          accountId, 
          autoDeduct 
        });
      } catch (error) {
        console.error('Error updating annual charge account:', error);
      }

    } catch (error) {
      console.error('Error assigning account to charge:', error);
      throw error;
    }
  }, [islamicCharges, updateAnnualCharge]);

  const addCustomCharge = useCallback(async (holidayData: Omit<IslamicHoliday, 'id'>) => {
    try {
      const newHoliday: IslamicHoliday = {
        ...holidayData,
        id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      };

      const newSettings = {
        ...settings,
        customCharges: [...settings.customCharges, newHoliday]
      };
      
      await saveSettings(newSettings);
    } catch (error) {
      console.error('Error adding custom charge:', error);
      throw error;
    }
  }, [settings, saveSettings]);

  const removeCustomCharge = useCallback(async (holidayId: string) => {
    try {
      const newSettings = {
        ...settings,
        customCharges: settings.customCharges.filter(h => h.id !== holidayId)
      };
      
      await saveSettings(newSettings);
    } catch (error) {
      console.error('Error removing custom charge:', error);
      throw error;
    }
  }, [settings, saveSettings]);

  return {
    // État
    islamicCharges,
    settings,
    isLoading,
    
    // Actions des paramètres
    saveSettings,
    
    // Actions des charges
    updateChargeAmount,
    markAsPaid,
    assignAccountToCharge,
    addCustomCharge,
    removeCustomCharge,
    
    // Génération
    generateChargesForCurrentYear,
    loadChargesForCurrentYear,
    
    // Données
    availableHolidays: IslamicCalendarService.getAllHolidays(),
    customCharges: settings.customCharges,
  };
};