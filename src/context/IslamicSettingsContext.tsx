// src/context/IslamicSettingsContext.tsx - VERSION CORRIGÉE
import React, { createContext, ReactNode, useContext } from 'react';
import { useIslamicCharges } from '../hooks/useIslamicCharges';

// Type du contexte
interface IslamicSettingsContextType {
  // État
  islamicCharges: ReturnType<typeof useIslamicCharges>['islamicCharges'];
  settings: ReturnType<typeof useIslamicCharges>['settings'];
  isLoading: boolean;
  
  // Actions principales - CORRECTION DES TYPES
  enableIslamicCharges: () => Promise<void>;
  disableIslamicCharges: () => Promise<void>;
  generateChargesForCurrentYear: () => Promise<void>;
  refreshCharges: () => Promise<void>;
  
  // Utilitaires
  isEnabled: boolean;
  hasCharges: boolean;
}

// Création du contexte
const IslamicSettingsContext = createContext<IslamicSettingsContextType | undefined>(undefined);

// Provider
interface IslamicSettingsProviderProps {
  children: ReactNode;
}

export const IslamicSettingsProvider: React.FC<IslamicSettingsProviderProps> = ({ children }) => {
  const {
    islamicCharges,
    settings,
    isLoading,
    enableIslamicCharges,
    disableIslamicCharges,
    generateChargesForCurrentYear,
    loadChargesForCurrentYear // ✅ CORRECTION: Utiliser loadChargesForCurrentYear au lieu de refreshCharges
  } = useIslamicCharges();

  const value: IslamicSettingsContextType = {
    // État
    islamicCharges,
    settings,
    isLoading,
    
    // Actions - CORRECTION DES TYPES
    enableIslamicCharges,
    disableIslamicCharges,
    generateChargesForCurrentYear,
    refreshCharges: loadChargesForCurrentYear, // ✅ CORRECTION: Mapping correct
    
    // Utilitaires
    isEnabled: settings.isEnabled,
    hasCharges: islamicCharges.length > 0
  };

  return (
    <IslamicSettingsContext.Provider value={value}>
      {children}
    </IslamicSettingsContext.Provider>
  );
};

// Hook personnalisé
export const useIslamicSettings = (): IslamicSettingsContextType => {
  const context = useContext(IslamicSettingsContext);
  if (context === undefined) {
    throw new Error('useIslamicSettings must be used within an IslamicSettingsProvider');
  }
  return context;
};

export default IslamicSettingsContext;