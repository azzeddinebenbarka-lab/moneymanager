// src/hooks/useMultiCurrency.ts - VERSION CORRIGÉE ET SYNCHRONISÉE
import { useCallback, useEffect, useState } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { secureStorage } from '../services/storage/secureStorage';

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  rate?: number;
}

export interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
  lastUpdated: string;
}

export const useMultiCurrency = () => {
  const { 
    currency: currentCurrency, 
    formatAmount: contextFormatAmount,
    setCurrency: setContextCurrency,
    availableCurrencies: contextCurrencies
  } = useCurrency();
  
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [baseCurrency, setBaseCurrency] = useState<string>('MAD'); // MAD par défaut
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Devises supportées - MAD en premier (synchronisé avec le contexte)
  const supportedCurrencies: Currency[] = [
    { code: 'MAD', name: 'Dirham Marocain', symbol: 'MAD' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  ];

  useEffect(() => {
    loadCurrencySettings();
    loadExchangeRates();
  }, []);

  // Synchronisation automatique avec le contexte
  useEffect(() => {
    if (currentCurrency.code !== baseCurrency) {
      console.log('🔄 Synchronisation devise contexte:', currentCurrency.code);
      setBaseCurrency(currentCurrency.code);
    }
  }, [currentCurrency.code]);

  const loadCurrencySettings = useCallback(async () => {
    try {
      const savedBaseCurrency = await secureStorage.getItem('base_currency');
      if (savedBaseCurrency && supportedCurrencies.some(c => c.code === savedBaseCurrency)) {
        setBaseCurrency(savedBaseCurrency);
        
        // Synchroniser avec le contexte
        const contextCurrency = contextCurrencies.find(c => c.code === savedBaseCurrency);
        if (contextCurrency && savedBaseCurrency !== currentCurrency.code) {
          setContextCurrency(contextCurrency);
        }
      } else {
        // Utiliser MAD par défaut si non trouvé ou invalide
        setBaseCurrency('MAD');
        await secureStorage.setItem('base_currency', 'MAD');
        
        // Synchroniser le contexte avec MAD
        if (currentCurrency.code !== 'MAD') {
          const madCurrency = contextCurrencies.find(c => c.code === 'MAD');
          if (madCurrency) {
            setContextCurrency(madCurrency);
          }
        }
      }
      
      setCurrencies(supportedCurrencies);
    } catch (err) {
      console.error('Error loading currency settings:', err);
      setCurrencies(supportedCurrencies);
      setBaseCurrency('MAD');
    }
  }, [currentCurrency.code, contextCurrencies, setContextCurrency]);

  const loadExchangeRates = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Taux de change simulés avec MAD comme base
      const simulatedRates: ExchangeRate[] = [
        { from: 'MAD', to: 'EUR', rate: 0.093, lastUpdated: new Date().toISOString() },
        { from: 'MAD', to: 'USD', rate: 0.10, lastUpdated: new Date().toISOString() },
        { from: 'MAD', to: 'GBP', rate: 0.078, lastUpdated: new Date().toISOString() },
        { from: 'MAD', to: 'JPY', rate: 14.67, lastUpdated: new Date().toISOString() },
        { from: 'MAD', to: 'CAD', rate: 0.136, lastUpdated: new Date().toISOString() },
        { from: 'MAD', to: 'AUD', rate: 0.152, lastUpdated: new Date().toISOString() },
        { from: 'MAD', to: 'CHF', rate: 0.089, lastUpdated: new Date().toISOString() },
        
        // Conversions inverses
        { from: 'EUR', to: 'MAD', rate: 10.8, lastUpdated: new Date().toISOString() },
        { from: 'USD', to: 'MAD', rate: 10.0, lastUpdated: new Date().toISOString() },
        { from: 'GBP', to: 'MAD', rate: 12.8, lastUpdated: new Date().toISOString() },
        { from: 'JPY', to: 'MAD', rate: 0.068, lastUpdated: new Date().toISOString() },
      ];

      setExchangeRates(simulatedRates);

      // Sauvegarder les taux
      await secureStorage.setItem('exchange_rates', JSON.stringify(simulatedRates));
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erreur de chargement des taux';
      setError(errorMsg);
      console.error('Error loading exchange rates:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setBaseCurrencyCode = useCallback(async (currencyCode: string) => {
    try {
      const currency = supportedCurrencies.find(c => c.code === currencyCode);
      if (!currency) {
        throw new Error('Devise non supportée');
      }

      setBaseCurrency(currencyCode);
      await secureStorage.setItem('base_currency', currencyCode);
      
      // Synchroniser avec le contexte Currency
      const contextCurrency = contextCurrencies.find(c => c.code === currencyCode);
      if (contextCurrency) {
        setContextCurrency(contextCurrency);
      }
      
      // Recharger les taux de change après changement de devise de base
      await loadExchangeRates();
      
      console.log(`💰 Devise de base changée: ${currencyCode}`);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erreur de changement de devise';
      setError(errorMsg);
      throw err;
    }
  }, [loadExchangeRates, contextCurrencies, setContextCurrency]);

  const convertCurrency = useCallback((
    amount: number,
    fromCurrency: string,
    toCurrency: string
  ): number => {
    if (fromCurrency === toCurrency) {
      return amount;
    }

    // Trouver le taux de change direct
    const directRate = exchangeRates.find(
      rate => rate.from === fromCurrency && rate.to === toCurrency
    );

    if (directRate) {
      return amount * directRate.rate;
    }

    // Trouver un taux via MAD (devise de base)
    const toMADRate = exchangeRates.find(
      rate => rate.from === fromCurrency && rate.to === 'MAD'
    );
    const fromMADRate = exchangeRates.find(
      rate => rate.from === 'MAD' && rate.to === toCurrency
    );

    if (toMADRate && fromMADRate) {
      return amount * toMADRate.rate * fromMADRate.rate;
    }

    // Si aucun taux n'est trouvé, essayer de trouver un chemin inverse
    const reverseRate = exchangeRates.find(
      rate => rate.from === toCurrency && rate.to === fromCurrency
    );
    
    if (reverseRate) {
      return amount / reverseRate.rate;
    }

    // Si aucun taux n'est trouvé, retourner le montant original avec un avertissement
    console.warn(`Taux de change non trouvé: ${fromCurrency} -> ${toCurrency}`);
    return amount;
  }, [exchangeRates]);

  const formatCurrency = useCallback((
    amount: number,
    currencyCode: string = currentCurrency.code,
    options?: Intl.NumberFormatOptions
  ): string => {
    try {
      // Utiliser la fonction formatAmount du contexte qui gère mieux MAD
      return contextFormatAmount(amount, true, currencyCode);
    } catch (err) {
      console.error('Erreur formatage devise:', err);
      // Fallback si la devise n'est pas supportée
      const currency = supportedCurrencies.find(c => c.code === currencyCode);
      const symbol = currency?.symbol || currencyCode;
      return `${symbol} ${amount.toFixed(2)}`;
    }
  }, [currentCurrency.code, contextFormatAmount]);

  const getCurrencySymbol = useCallback((currencyCode: string): string => {
    const currency = supportedCurrencies.find(c => c.code === currencyCode);
    return currency?.symbol || currencyCode;
  }, []);

  const refreshExchangeRates = useCallback(async () => {
    await loadExchangeRates();
  }, [loadExchangeRates]);

  const getSupportedCurrencies = useCallback((): Currency[] => {
    return supportedCurrencies;
  }, []);

  // Fonction pour forcer la synchronisation avec le CurrencyContext
  const syncWithCurrencyContext = useCallback(async () => {
    try {
      if (currentCurrency.code !== baseCurrency) {
        console.log('🔄 Synchronisation forcée avec contexte devise:', currentCurrency.code);
        await setBaseCurrencyCode(currentCurrency.code);
      }
    } catch (err) {
      console.error('Error syncing with currency context:', err);
    }
  }, [currentCurrency.code, baseCurrency, setBaseCurrencyCode]);

  // Fonction pour définir MAD comme devise principale
  const setMADAsPrimary = useCallback(async () => {
    try {
      await setBaseCurrencyCode('MAD');
      console.log('💰 MAD défini comme devise principale');
    } catch (err) {
      console.error('Error setting MAD as primary:', err);
      throw err;
    }
  }, [setBaseCurrencyCode]);

  return {
    // État
    currencies,
    baseCurrency,
    exchangeRates,
    isLoading,
    error,
    
    // Actions
    setBaseCurrency: setBaseCurrencyCode,
    convertCurrency,
    formatCurrency,
    getCurrencySymbol,
    refreshExchangeRates,
    getSupportedCurrencies,
    syncWithCurrencyContext,
    setMADAsPrimary,
    
    // Utilitaires
    clearError: () => setError(null),
    
    // Synchronisation
    isSyncedWithContext: currentCurrency.code === baseCurrency,
    currentContextCurrency: currentCurrency,
  };
};