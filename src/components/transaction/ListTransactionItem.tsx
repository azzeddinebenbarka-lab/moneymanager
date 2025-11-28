// src/components/transaction/ListTransactionItem.tsx
// Composant de transaction unifié pour toutes les pages

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useCurrency } from '../../context/CurrencyContext';
import { useDesignSystem } from '../../context/ThemeContext';
import useCategories from '../../hooks/useCategories';
import resolveCategoryLabel from '../../utils/categoryResolver';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  category?: string;
  subCategory?: string;
  date: string;
  createdAt?: string;
  isRecurring?: boolean;
  recurrenceType?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  parentTransactionId?: string;
}

interface ListTransactionItemProps {
  item: Transaction;
  onPress?: (id: string) => void;
  disablePress?: boolean;
}

export const ListTransactionItem: React.FC<ListTransactionItemProps> = ({ item, onPress, disablePress = false }) => {
  const { colors } = useDesignSystem();
  const { formatAmount } = useCurrency();
  const { categories } = useCategories();
  
  const isIncome = item.type === 'income';
  const isTransfer = item.type === 'transfer';
  const resolved = resolveCategoryLabel(item.subCategory || item.category, categories || []);
  const label = resolved.child;
  
  // Formater le montant (sans décimales maintenant géré dans formatAmount)
  const formattedAmount = formatAmount(Math.abs(item.amount));

  return (
    <TouchableOpacity 
      style={[
        styles.transactionCard, 
        { backgroundColor: colors.background.card }
      ]} 
      onPress={() => onPress?.(item.id)} 
      activeOpacity={0.7}
      disabled={disablePress}
    >
      <View style={styles.transactionMain}>
        <View style={[
          styles.iconContainer, 
          { 
            backgroundColor: colors.background.primary, 
            borderColor: colors.border.primary 
          }
        ]}>
          <Ionicons 
            name={isTransfer ? 'swap-horizontal' : (isIncome ? 'arrow-down' : 'arrow-up')} 
            size={20} 
            color={isTransfer ? colors.primary[500] : (isIncome ? colors.semantic.success : colors.semantic.error)} 
          />
        </View>

        <View style={styles.transactionInfo}>
          <View style={styles.descriptionRow}>
            <Text 
              style={[styles.transactionDescription, { color: colors.text.primary }]} 
              numberOfLines={2}
            >
              {item.description || 'Sans description'}
            </Text>
            {item.isRecurring && item.recurrenceType && (
              <View style={[styles.recurrenceBadge, { backgroundColor: '#8B5CF6' + '15', borderColor: '#8B5CF6' + '40' }]}>
                <Ionicons name="repeat" size={10} color="#8B5CF6" />
                <Text style={[styles.recurrenceText, { color: '#8B5CF6' }]}>
                  {item.recurrenceType === 'daily' ? 'J' : 
                   item.recurrenceType === 'weekly' ? 'S' : 
                   item.recurrenceType === 'monthly' ? 'M' : 'A'}
                </Text>
              </View>
            )}
            {item.parentTransactionId && (
              <View style={[styles.recurrenceBadge, { backgroundColor: '#34C759' + '15', borderColor: '#34C759' + '40' }]}>
                <Ionicons name="calendar" size={10} color="#34C759" />
              </View>
            )}
          </View>
          <View style={styles.transactionBottom}>
            <View style={styles.transactionMeta}>
              <Text style={[styles.transactionCategory, { color: colors.text.secondary }]}>
                {label}
              </Text>
              <Text style={[styles.transactionDate, { color: colors.text.secondary }]}>
                {new Date(item.date).toLocaleDateString('fr-FR')}
              </Text>
            </View>
            <Text 
              style={[
                styles.transactionAmount, 
                { color: isTransfer ? colors.primary[500] : (isIncome ? colors.semantic.success : colors.semantic.error) }
              ]}
            >
              {isTransfer ? '' : (isIncome ? '+' : '-')}{formattedAmount}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  transactionCard: {
    borderRadius: 16,
    marginHorizontal: 0,
    marginVertical: 6,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  transactionMain: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
  },
  transactionInfo: {
    flex: 1,
  },
  descriptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  recurrenceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    gap: 2,
  },
  recurrenceText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  transactionBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionMeta: {
    flexDirection: 'column',
    gap: 2,
  },
  transactionCategory: {
    fontSize: 11,
    fontWeight: '500',
  },
  transactionDate: {
    fontSize: 12,
  },
  transactionAmount: {
    fontSize: 15,
    fontWeight: '700',
  },
});

export default ListTransactionItem;
