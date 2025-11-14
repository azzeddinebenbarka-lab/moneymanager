// src/components/transaction/TransactionCard.tsx - VERSION UNIFIÉE COMPLÈTE
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useCurrency } from '../../context/CurrencyContext';
import { useTheme } from '../../context/ThemeContext';
import { Transaction } from '../../types';

interface TransactionCardProps {
  transaction: Transaction;
  onPress: () => void;
  showAccount?: boolean;
  compact?: boolean;
}

const TransactionCard: React.FC<TransactionCardProps> = ({ 
  transaction, 
  onPress, 
  showAccount = false,
  compact = false 
}) => {
  const { formatAmount } = useCurrency();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Icône selon le type et la récurrence
  const getIconName = () => {
    if (transaction.isRecurring) {
      return 'repeat';
    }
    return transaction.type === 'income' ? 'arrow-down' : 'arrow-up';
  };

  // Couleur selon le type
  const getIconColor = () => {
    if (transaction.isRecurring) {
      return '#007AFF'; // Bleu pour les récurrentes
    }
    return transaction.type === 'income' ? '#34C759' : '#FF3B30';
  };

  // Background de l'icône
  const getIconBackground = () => {
    if (transaction.isRecurring) {
      return '#007AFF20'; // Bleu très transparent
    }
    return transaction.type === 'income' ? '#34C75920' : '#FF3B3020';
  };

  // Formatage de la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: short',
      year: 'numeric'
    });
  };

  // Prochaine occurrence pour les récurrentes
  const getNextOccurrenceText = () => {
    if (!transaction.isRecurring || !transaction.nextOccurrence) return null;
    
    const nextDate = new Date(transaction.nextOccurrence);
    const today = new Date();
    const diffTime = nextDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return 'Demain';
    if (diffDays < 7) return `Dans ${diffDays} jours`;
    
    return `Le ${nextDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}`;
  };

  const nextOccurrenceText = getNextOccurrenceText();

  if (compact) {
    return (
      <TouchableOpacity 
        style={[
          styles.compactCard,
          isDark && styles.darkCompactCard
        ]}
        onPress={onPress}
      >
        <View style={styles.compactLeft}>
          <View style={[
            styles.compactIconContainer,
            { backgroundColor: getIconBackground() }
          ]}>
            <Ionicons 
              name={getIconName()}
              size={16} 
              color={getIconColor()} 
            />
          </View>
          <View style={styles.compactInfo}>
            <Text style={[
              styles.compactDescription,
              isDark && styles.darkText
            ]} numberOfLines={1}>
              {transaction.description}
            </Text>
            <Text style={[
              styles.compactCategory,
              isDark && styles.darkSubtext
            ]}>
              {transaction.category}
              {transaction.isRecurring && ' 🔄'}
            </Text>
          </View>
        </View>
        <View style={styles.compactRight}>
          <Text style={[
            styles.compactAmount,
            { color: transaction.type === 'income' ? '#34C759' : '#FF3B30' }
          ]}>
            {transaction.type === 'income' ? '+' : '-'}{formatAmount(Math.abs(transaction.amount))}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      style={[
        styles.card,
        isDark && styles.darkCard
      ]}
      onPress={onPress}
    >
      <View style={styles.leftSection}>
        <View style={[
          styles.iconContainer,
          { backgroundColor: getIconBackground() }
        ]}>
          <Ionicons 
            name={getIconName()}
            size={20} 
            color={getIconColor()} 
          />
          {transaction.isRecurring && (
            <View style={styles.recurringBadge}>
              <Ionicons name="repeat" size={8} color="#007AFF" />
            </View>
          )}
        </View>
        
        <View style={styles.infoSection}>
          <Text style={[
            styles.description,
            isDark && styles.darkText
          ]} numberOfLines={2}>
            {transaction.description}
          </Text>
          
          <View style={styles.detailsRow}>
            <Text style={[
              styles.category,
              isDark && styles.darkSubtext
            ]}>
              {transaction.category}
            </Text>
            
            {showAccount && (
              <>
                <Text style={[styles.separator, isDark && styles.darkSubtext]}>•</Text>
                <Text style={[styles.account, isDark && styles.darkSubtext]}>
                  Compte {transaction.accountId.slice(0, 8)}...
                </Text>
              </>
            )}
          </View>
          
          <View style={styles.detailsRow}>
            <Text style={[
              styles.date,
              isDark && styles.darkSubtext
            ]}>
              {formatDate(transaction.date)}
            </Text>
            
            {transaction.isRecurring && transaction.recurrenceType && (
              <>
                <Text style={[styles.separator, isDark && styles.darkSubtext]}>•</Text>
                <Text style={[styles.recurrenceType, isDark && styles.darkSubtext]}>
                  {getRecurrenceLabel(transaction.recurrenceType)}
                </Text>
              </>
            )}
          </View>

          {nextOccurrenceText && (
            <View style={styles.nextOccurrenceContainer}>
              <Ionicons name="time-outline" size={12} color="#007AFF" />
              <Text style={styles.nextOccurrenceText}>
                {nextOccurrenceText}
              </Text>
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.rightSection}>
        <Text style={[
          styles.amount,
          { color: transaction.type === 'income' ? '#34C759' : '#FF3B30' }
        ]}>
          {transaction.type === 'income' ? '+' : '-'}{formatAmount(Math.abs(transaction.amount))}
        </Text>
        
        {transaction.isRecurring && (
          <Text style={[
            styles.recurringLabel,
            isDark && styles.darkSubtext
          ]}>
            Récurrente
          </Text>
        )}
        
        {transaction.parentTransactionId && (
          <Text style={[
            styles.instanceLabel,
            isDark && styles.darkSubtext
          ]}>
            Instance
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

// Helper pour les labels de récurrence
const getRecurrenceLabel = (recurrenceType: string): string => {
  switch (recurrenceType) {
    case 'daily': return 'Quotidienne';
    case 'weekly': return 'Hebdomadaire';
    case 'monthly': return 'Mensuelle';
    case 'yearly': return 'Annuelle';
    default: return recurrenceType;
  }
};

const styles = StyleSheet.create({
  // Style normal
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  darkCard: {
    backgroundColor: '#2c2c2e',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    position: 'relative',
  },
  recurringBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#fff',
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  infoSection: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
    lineHeight: 20,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
    flexWrap: 'wrap',
  },
  category: {
    fontSize: 14,
    color: '#666',
  },
  separator: {
    fontSize: 12,
    color: '#999',
    marginHorizontal: 6,
  },
  account: {
    fontSize: 12,
    color: '#666',
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  recurrenceType: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  nextOccurrenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    backgroundColor: '#007AFF10',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  nextOccurrenceText: {
    fontSize: 11,
    color: '#007AFF',
    fontWeight: '500',
    marginLeft: 4,
  },
  rightSection: {
    alignItems: 'flex-end',
    marginLeft: 12,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  recurringLabel: {
    fontSize: 11,
    color: '#007AFF',
    fontWeight: '500',
    backgroundColor: '#007AFF15',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 2,
  },
  instanceLabel: {
    fontSize: 10,
    color: '#666',
    fontStyle: 'italic',
  },
  
  // Style compact
  compactCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 6,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 0.5,
  },
  darkCompactCard: {
    backgroundColor: '#2c2c2e',
  },
  compactLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  compactIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  compactInfo: {
    flex: 1,
  },
  compactDescription: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  compactCategory: {
    fontSize: 12,
    color: '#666',
  },
  compactRight: {
    alignItems: 'flex-end',
  },
  compactAmount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  
  // Textes communs
  darkText: {
    color: '#fff',
  },
  darkSubtext: {
    color: '#888',
  },
});

export default TransactionCard;