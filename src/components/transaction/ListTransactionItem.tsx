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
}

interface ListTransactionItemProps {
  item: Transaction;
  onPress?: (id: string) => void;
}

export const ListTransactionItem: React.FC<ListTransactionItemProps> = ({ item, onPress }) => {
  const { colors } = useDesignSystem();
  const { formatAmount } = useCurrency();
  const { categories } = useCategories();
  
  const isIncome = item.type === 'income';
  const isTransfer = item.type === 'transfer';
  const resolved = resolveCategoryLabel(item.subCategory || item.category, categories || []);
  const label = resolved.child;

  return (
    <TouchableOpacity 
      style={[styles.transactionCard, { backgroundColor: colors.background.card }]} 
      onPress={() => onPress?.(item.id)} 
      activeOpacity={0.85}
    >
      <View style={styles.transactionMain}>
        <View style={styles.transactionLeft}>
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
            <Text 
              style={[styles.transactionDescription, { color: colors.text.primary }]} 
              numberOfLines={1}
            >
              {item.description || 'Sans description'}
            </Text>
            <View style={styles.transactionMeta}>
              <Text style={[styles.transactionCategory, { color: colors.text.secondary }]}>
                {label}
              </Text>
              <Text style={[styles.transactionDate, { color: colors.text.secondary }]}>
                {new Date(item.date).toLocaleDateString('fr-FR')}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.transactionRight}>
          <Text 
            style={[
              styles.transactionAmount, 
              { color: isTransfer ? colors.primary[500] : (isIncome ? colors.semantic.success : colors.semantic.error) }
            ]}
          >
            {isTransfer ? '' : (isIncome ? '+' : '-')}{formatAmount(Math.abs(item.amount))}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  transactionCard: {
    borderRadius: 16,
    marginHorizontal: 20,
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
  transactionDescription: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  transactionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  transactionCategory: {
    fontSize: 13,
    fontWeight: '500',
  },
  transactionDate: {
    fontSize: 13,
  },
  transactionRight: {
    alignItems: 'flex-end',
    marginLeft: 12,
  },
  transactionAmount: {
    fontSize: 17,
    fontWeight: '700',
  },
});

export default ListTransactionItem;
