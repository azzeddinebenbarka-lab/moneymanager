// hooks/useSearch.ts
import { useMemo, useState } from 'react';
import { Transaction } from '../types';

interface SearchFilters {
  type: 'all' | 'income' | 'expense';
  category: string;
  dateRange: 'all' | 'today' | 'week' | 'month' | 'year';
  minAmount: string;
  maxAmount: string;
}

export const useSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    type: 'all',
    category: 'all',
    dateRange: 'all',
    minAmount: '',
    maxAmount: ''
  });

  const searchTransactions = (transactions: Transaction[]): Transaction[] => {
    return transactions.filter(transaction => {
      // Recherche par texte
      const matchesSearch = searchTerm === '' || 
        transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        Math.abs(transaction.amount).toString().includes(searchTerm);

      // Filtre par type
      const matchesType = filters.type === 'all' || transaction.type === filters.type;
      
      // Filtre par catégorie
      const matchesCategory = filters.category === 'all' || transaction.category === filters.category;
      
      // Filtre par montant
      const amount = Math.abs(transaction.amount);
      const matchesMinAmount = !filters.minAmount || amount >= parseFloat(filters.minAmount);
      const matchesMaxAmount = !filters.maxAmount || amount <= parseFloat(filters.maxAmount);
      
      // Filtre par date
      const matchesDate = filterByDate(transaction.date, filters.dateRange);

      return matchesSearch && matchesType && matchesCategory && matchesMinAmount && matchesMaxAmount && matchesDate;
    });
  };

  const filterByDate = (date: string, range: string): boolean => {
    if (range === 'all') return true;
    
    const transactionDate = new Date(date);
    const today = new Date();
    
    switch (range) {
      case 'today':
        return transactionDate.toDateString() === today.toDateString();
      case 'week':
        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 7);
        return transactionDate >= weekAgo;
      case 'month':
        return transactionDate.getMonth() === today.getMonth() && 
               transactionDate.getFullYear() === today.getFullYear();
      case 'year':
        return transactionDate.getFullYear() === today.getFullYear();
      default:
        return true;
    }
  };

  const clearFilters = () => {
    setFilters({
      type: 'all',
      category: 'all',
      dateRange: 'all',
      minAmount: '',
      maxAmount: ''
    });
    setSearchTerm('');
  };

  const hasActiveFilters = useMemo(() => {
    return searchTerm !== '' || 
           filters.type !== 'all' || 
           filters.category !== 'all' || 
           filters.dateRange !== 'all' || 
           filters.minAmount !== '' || 
           filters.maxAmount !== '';
  }, [searchTerm, filters]);

  return {
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    searchTransactions,
    clearFilters,
    hasActiveFilters
  };
};