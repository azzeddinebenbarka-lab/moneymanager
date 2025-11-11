// src/screens/FinancialCalendarScreen.tsx
import React, { useMemo, useState } from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Header } from '../components/ui/Header';
import { useTheme } from '../context/ThemeContext';
import { useTransactions } from '../hooks/useTransactions';

const { width } = Dimensions.get('window');

export const FinancialCalendarScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const { transactions } = useTransactions();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('month');

  const isDark = theme === 'dark';

  // Filtrer les transactions pour la période sélectionnée
  const filteredTransactions = useMemo(() => {
    const startDate = new Date(selectedDate);
    const endDate = new Date(selectedDate);

    switch (viewMode) {
      case 'day':
        endDate.setDate(startDate.getDate() + 1);
        break;
      case 'week':
        startDate.setDate(startDate.getDate() - startDate.getDay());
        endDate.setDate(startDate.getDate() + 7);
        break;
      case 'month':
        startDate.setDate(1);
        endDate.setMonth(startDate.getMonth() + 1);
        endDate.setDate(0);
        break;
    }

    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= startDate && transactionDate < endDate;
    });
  }, [transactions, selectedDate, viewMode]);

  // Calculer les totaux
  const totals = useMemo(() => {
    return filteredTransactions.reduce(
      (acc, transaction) => {
        if (transaction.type === 'income') {
          acc.income += transaction.amount;
        } else if (transaction.type === 'expense') {
          acc.expenses += Math.abs(transaction.amount);
        }
        return acc;
      },
      { income: 0, expenses: 0, balance: 0 }
    );
  }, [filteredTransactions]);

  totals.balance = totals.income - totals.expenses;

  // Navigation entre les périodes
  const navigatePeriod = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    
    switch (viewMode) {
      case 'day':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
        break;
    }
    
    setSelectedDate(newDate);
  };

  // Formater la période affichée
  const getPeriodLabel = () => {
    switch (viewMode) {
      case 'day':
        return selectedDate.toLocaleDateString('fr-FR', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
      case 'week':
        const startOfWeek = new Date(selectedDate);
        startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        
        return `Semaine du ${startOfWeek.toLocaleDateString('fr-FR', { 
          day: 'numeric', 
          month: 'short' 
        })} au ${endOfWeek.toLocaleDateString('fr-FR', { 
          day: 'numeric', 
          month: 'short', 
          year: 'numeric' 
        })}`;
      case 'month':
        return selectedDate.toLocaleDateString('fr-FR', {
          month: 'long',
          year: 'numeric'
        });
    }
  };

  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
      <Header 
        title="Calendrier Financier" 
        onBack={() => navigation.goBack()}
      />

      {/* Sélecteur de vue */}
      <View style={[styles.viewSelector, isDark && styles.darkCard]}>
        {(['day', 'week', 'month'] as const).map(mode => (
          <TouchableOpacity
            key={mode}
            style={[
              styles.viewButton,
              viewMode === mode && styles.viewButtonActive,
              isDark && viewMode === mode && styles.viewButtonActiveDark
            ]}
            onPress={() => setViewMode(mode)}
          >
            <Text style={[
              styles.viewButtonText,
              viewMode === mode && styles.viewButtonTextActive,
              isDark && styles.darkText
            ]}>
              {mode === 'day' ? 'Jour' : mode === 'week' ? 'Semaine' : 'Mois'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Navigation de période */}
      <View style={[styles.periodNavigation, isDark && styles.darkCard]}>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigatePeriod('prev')}
        >
          <Text style={[styles.navButtonText, isDark && styles.darkText]}>‹</Text>
        </TouchableOpacity>
        
        <Text style={[styles.periodLabel, isDark && styles.darkText]}>
          {getPeriodLabel()}
        </Text>
        
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigatePeriod('next')}
        >
          <Text style={[styles.navButtonText, isDark && styles.darkText]}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Résumé financier */}
      <View style={[styles.summaryCard, isDark && styles.darkCard]}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, isDark && styles.darkSubtext]}>Revenus</Text>
            <Text style={[styles.incomeAmount, isDark && styles.darkText]}>
              +{totals.income.toFixed(2)}€
            </Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, isDark && styles.darkSubtext]}>Dépenses</Text>
            <Text style={[styles.expenseAmount, isDark && styles.darkText]}>
              -{totals.expenses.toFixed(2)}€
            </Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, isDark && styles.darkSubtext]}>Solde</Text>
            <Text style={[
              styles.balanceAmount,
              totals.balance >= 0 ? styles.positiveBalance : styles.negativeBalance,
              isDark && styles.darkText
            ]}>
              {totals.balance >= 0 ? '+' : ''}{totals.balance.toFixed(2)}€
            </Text>
          </View>
        </View>
      </View>

      {/* Liste des transactions */}
      <ScrollView style={styles.transactionsList}>
        <Text style={[styles.sectionTitle, isDark && styles.darkText]}>
          Transactions ({filteredTransactions.length})
        </Text>
        
        {filteredTransactions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, isDark && styles.darkSubtext]}>
              Aucune transaction pour cette période
            </Text>
          </View>
        ) : (
          filteredTransactions.map(transaction => (
            <View 
              key={transaction.id} 
              style={[styles.transactionItem, isDark && styles.darkCard]}
            >
              <View style={styles.transactionInfo}>
                <Text style={[styles.transactionDescription, isDark && styles.darkText]}>
                  {transaction.description}
                </Text>
                <Text style={[styles.transactionDate, isDark && styles.darkSubtext]}>
                  {new Date(transaction.date).toLocaleDateString('fr-FR')}
                </Text>
              </View>
              
              <Text style={[
                styles.transactionAmount,
                transaction.type === 'income' ? styles.incomeAmount : styles.expenseAmount,
                isDark && styles.darkText
              ]}>
                {transaction.type === 'income' ? '+' : '-'}{Math.abs(transaction.amount).toFixed(2)}€
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  darkContainer: {
    backgroundColor: '#1c1c1e',
  },
  viewSelector: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 4,
  },
  darkCard: {
    backgroundColor: '#2c2c2e',
  },
  viewButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  viewButtonActive: {
    backgroundColor: '#007AFF',
  },
  viewButtonActiveDark: {
    backgroundColor: '#0A84FF',
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  viewButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  periodNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  navButton: {
    padding: 8,
  },
  navButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  periodLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  summaryCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  incomeAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#34C759',
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF3B30',
  },
  balanceAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  positiveBalance: {
    color: '#34C759',
  },
  negativeBalance: {
    color: '#FF3B30',
  },
  transactionsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 14,
    color: '#666',
  },
   transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  darkText: {
    color: '#fff',
  },
  darkSubtext: {
    color: '#888',
  },
});

export default FinancialCalendarScreen;