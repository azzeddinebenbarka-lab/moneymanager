// src/utils/numberUtils.ts - VERSION CORRIGÉE AVEC MAD PAR DÉFAUT
import { useCurrency } from '../context/CurrencyContext';

export const generateId = (): string => {
  return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const formatCurrency = (amount: number, currency: string = 'MAD'): string => {
  try {
    // Formatage spécial pour MAD
    if (currency === 'MAD') {
      const formatted = new Intl.NumberFormat('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(Math.abs(amount));
      
      const sign = amount < 0 ? '-' : '';
      return `${sign}MAD ${formatted}`;
    }

    // Pour les autres devises
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    // Fallback pour toutes les devises
    return `${currency} ${amount.toFixed(2)}`;
  }
};

export const formatNumber = (number: number): string => {
  return new Intl.NumberFormat('fr-FR').format(number);
};

export const parseNumber = (value: string): number => {
  const cleaned = value.replace(/[^\d.,]/g, '');
  const normalized = cleaned.replace(',', '.');
  return parseFloat(normalized) || 0;
};

export const calculatePercentage = (part: number, total: number): number => {
  if (total === 0) return 0;
  return (part / total) * 100;
};

export const roundToDecimal = (value: number, decimals: number = 2): number => {
  return Number(value.toFixed(decimals));
};

export const generateAccountNumber = (): string => {
  return `ACC${Date.now()}${Math.floor(Math.random() * 1000)}`;
};

// Fonction utilitaire pour formater les montants avec la devise courante
export const useFormatAmount = () => {
  const { formatAmount } = useCurrency();
  return formatAmount;
};

// Nouvelle fonction pour formater avec MAD par défaut
export const formatWithMADDefault = (amount: number, showSymbol: boolean = true): string => {
  const { formatAmount } = useCurrency();
  return formatAmount(amount, showSymbol, 'MAD');
};

// Conversion de devise sécurisée
export const safeCurrencyConvert = (
  amount: number, 
  fromCurrency: string, 
  toCurrency: string,
  rates: { [key: string]: number } = {}
): number => {
  if (fromCurrency === toCurrency) return amount;
  
  const rateKey = `${fromCurrency}-${toCurrency}`;
  const rate = rates[rateKey] || 1;
  
  return amount * rate;
};

export default {
  generateId,
  formatCurrency,
  formatNumber,
  parseNumber,
  calculatePercentage,
  roundToDecimal,
  generateAccountNumber,
  useFormatAmount,
  formatWithMADDefault,
  safeCurrencyConvert
};