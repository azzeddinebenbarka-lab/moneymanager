// screens/RecurringTransactionsScreen.tsx - VERSION CORRIGÉE
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useRecurringTransactions } from '../hooks/useRecurringTransactions';
import { RecurringTransaction } from '../types';

const RecurringTransactionsScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const { 
    recurringTransactions, 
    loading, 
    error, 
    toggleRecurringTransaction,
    deleteRecurringTransaction,
    refreshRecurringTransactions,
    processRecurringTransactions // ✅ AJOUT: Import depuis le hook
  } = useRecurringTransactions();
  
  const [refreshing, setRefreshing] = useState(false);
  const isDark = theme === 'dark';

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // ✅ CORRECTION : Utilise la fonction importée du hook
      console.log('🔄 Processing recurring transactions before refresh...');
      await processRecurringTransactions(); // ✅ MAINTENANT DÉFINIE
      await refreshRecurringTransactions();
      console.log('✅ Refresh completed with recurring processing');
    } catch (error) {
      console.error('Error refreshing recurring transactions:', error);
      Alert.alert('Erreur', 'Impossible de rafraîchir les transactions récurrentes');
    } finally {
      setRefreshing(false);
    }
  };

  const handleToggle = async (id: string, isActive: boolean) => {
    try {
      await toggleRecurringTransaction(id, !isActive);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de modifier la transaction');
    }
  };

  const handleDelete = (transaction: RecurringTransaction) => {
    Alert.alert(
      'Supprimer la transaction',
      `Êtes-vous sûr de vouloir supprimer "${transaction.description}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Supprimer', 
          style: 'destructive',
          onPress: () => deleteRecurringTransaction(transaction.id)
        },
      ]
    );
  };

  const handleAddTransaction = () => {
    navigation.navigate('AddRecurringTransaction');
  };

  const formatCurrency = (amount: number) => {
    return `${amount >= 0 ? '' : '-'}${Math.abs(amount).toFixed(2)} €`;
  };

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'Quotidienne';
      case 'weekly': return 'Hebdomadaire';
      case 'monthly': return 'Mensuelle';
      case 'yearly': return 'Annuelle';
      default: return frequency;
    }
  };

  const renderTransactionItem = ({ item }: { item: RecurringTransaction }) => (
    <TouchableOpacity 
      style={[styles.transactionCard, isDark && styles.darkCard]}
      onLongPress={() => handleDelete(item)}
    >
      <View style={styles.transactionHeader}>
        <View style={styles.transactionInfo}>
          <Ionicons 
            name={item.type === 'income' ? 'arrow-down-circle' : 'arrow-up-circle'} 
            size={24} 
            color={item.type === 'income' ? '#34C759' : '#FF3B30'} 
          />
          <View style={styles.transactionDetails}>
            <Text style={[styles.description, isDark && styles.darkText]}>
              {item.description}
            </Text>
            <Text style={[styles.category, isDark && styles.darkSubtext]}>
              {item.category} • {getFrequencyLabel(item.frequency)}
            </Text>
          </View>
        </View>
        
        <View style={styles.transactionAmounts}>
          <Text style={[
            styles.amount,
            { color: item.type === 'income' ? '#34C759' : '#FF3B30' }
          ]}>
            {formatCurrency(item.amount)}
          </Text>
          <Text style={[styles.frequency, isDark && styles.darkSubtext]}>
            Prochain: {item.lastProcessed || 'Jamais'}
          </Text>
        </View>
      </View>

      <View style={styles.transactionActions}>
        <TouchableOpacity 
          style={[
            styles.statusButton,
            item.isActive ? styles.activeButton : styles.inactiveButton
          ]}
          onPress={() => handleToggle(item.id, item.isActive)}
        >
          <Ionicons 
            name={item.isActive ? 'pause-circle' : 'play-circle'} 
            size={16} 
            color="#fff" 
          />
          <Text style={styles.statusButtonText}>
            {item.isActive ? 'Active' : 'Inactive'}
          </Text>
        </TouchableOpacity>

        <View style={styles.actionButtons}>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDelete(item)}
          >
            <Ionicons name="trash-outline" size={16} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const activeTransactions = recurringTransactions.filter(t => t.isActive);
  const inactiveTransactions = recurringTransactions.filter(t => !t.isActive);

  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
      {/* Header */}
      <View style={[styles.header, isDark && styles.darkHeader]}>
        <Text style={[styles.title, isDark && styles.darkText]}>
          Transactions Récurrentes
        </Text>
        <Text style={[styles.subtitle, isDark && styles.darkSubtext]}>
          Gérez vos transactions automatiques
        </Text>
      </View>

      <FlatList
        data={[]}
        renderItem={null}
        refreshing={refreshing}
        onRefresh={onRefresh}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {/* Transactions Actives */}
            {activeTransactions.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, isDark && styles.darkText]}>
                  Actives ({activeTransactions.length})
                </Text>
                {activeTransactions.map((transaction) => (
                  <View key={transaction.id}>
                    {renderTransactionItem({ item: transaction })}
                  </View>
                ))}
              </View>
            )}

            {/* Transactions Inactives */}
            {inactiveTransactions.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, isDark && styles.darkText]}>
                  Inactives ({inactiveTransactions.length})
                </Text>
                {inactiveTransactions.map((transaction) => (
                  <View key={transaction.id}>
                    {renderTransactionItem({ item: transaction })}
                  </View>
                ))}
              </View>
            )}
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons 
              name="repeat-outline" 
              size={64} 
              color={isDark ? '#555' : '#ccc'} 
            />
            <Text style={[styles.emptyText, isDark && styles.darkSubtext]}>
              Aucune transaction récurrente
            </Text>
            <Text style={[styles.emptySubtext, isDark && styles.darkSubtext]}>
              Créez votre première transaction automatique
            </Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={handleAddTransaction}
            >
              <Text style={styles.addButtonText}>Créer une transaction</Text>
            </TouchableOpacity>
          </View>
        }
        ListFooterComponent={<View style={styles.spacer} />}
      />

      {/* Bouton d'ajout */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={handleAddTransaction}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>
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
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  darkHeader: {
    backgroundColor: '#2c2c2e',
    borderBottomColor: '#38383a',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  section: {
    padding: 16,
    paddingBottom: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  transactionCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  darkCard: {
    backgroundColor: '#2c2c2e',
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  transactionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionDetails: {
    marginLeft: 12,
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: '#666',
  },
  transactionAmounts: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  frequency: {
    fontSize: 12,
    color: '#666',
  },
  transactionActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  activeButton: {
    backgroundColor: '#34C759',
  },
  inactiveButton: {
    backgroundColor: '#8E8E93',
  },
  statusButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
  },
  editButton: {
    // Style spécifique pour édition
  },
  deleteButton: {
    // Style spécifique pour suppression
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 24,
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  spacer: {
    height: 100,
  },
  darkText: {
    color: '#fff',
  },
  darkSubtext: {
    color: '#888',
  },
});

export default RecurringTransactionsScreen;