// src/hooks/useCurrencyFormat.ts
import { useCurrency } from '../context/CurrencyContext';

export const useCurrencyFormat = () => {
  const { formatAmount, convertAmount, currency } = useCurrency();

  const formatWithCurrency = (amount: number, showSymbol: boolean = true) => {
    return formatAmount(amount, showSymbol);
  };

  const formatPositiveNegative = (amount: number, showSymbol: boolean = true) => {
    const formatted = formatAmount(Math.abs(amount), showSymbol);
    return amount < 0 ? `-${formatted}` : `+${formatted}`;
  };

  const formatForInput = (amount: number) => {
    return Math.abs(amount).toFixed(2);
  };

  const parseAmount = (amountString: string): number => {
    const cleanString = amountString.replace(/[^\d,.-]/g, '').replace(',', '.');
    return parseFloat(cleanString) || 0;
  };

  return {
    formatAmount: formatWithCurrency,
    formatPositiveNegative,
    formatForInput,
    parseAmount,
    convertAmount,
    currentCurrency: currency,
  };
};