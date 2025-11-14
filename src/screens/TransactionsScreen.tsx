// src/screens/TransactionsScreen.tsx - VERSION UNIFIÉE AVEC ONGLETS
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from '../components/SafeAreaView';
import TransactionCard from '../components/transaction/TransactionCard';
import { useCurrency } from '../context/CurrencyContext';
import { useTheme } from '../context/ThemeContext';
import { useTransactions } from '../hooks/useTransactions';
import { Transaction } from '../types';

type TabType = 'all' | 'normal' | 'recurring';

const TransactionsScreen = ({ navigation }: any) => {
  const { formatAmount } = useCurrency();
  const { theme } = useTheme();
  const { 
    transactions, 
    loading, 
    error,
    refreshTransactions,
    getStats
  } = useTransactions();
  
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [refreshing, setRefreshing] = useState(false);

  const isDark = theme === 'dark';
  const stats = getStats();

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshTransactions();
    setRefreshing(false);
  };

  // ✅ CORRECTION : Recharger les transactions à chaque focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refreshTransactions();
    });
    return unsubscribe;
  }, [navigation, refreshTransactions]);

  // ✅ CORRECTION : Navigation vers l'édition
  const handleTransactionPress = (transactionId: string) => {
    console.log('🔄 Navigation vers modification transaction:', transactionId);
    navigation.navigate('EditTransaction', { transactionId });
  };

  // Filtrage des transactions par onglet
  const getFilteredTransactions = (): Transaction[] => {
    switch (activeTab) {
      case 'normal':
        return transactions.filter(transaction => !transaction.isRecurring);
      case 'recurring':
        return transactions.filter(transaction => transaction.isRecurring);
      case 'all':
      default:
        return transactions;
    }
  };

  const filteredTransactions = getFilteredTransactions();

  const renderTransactionItem = ({ item }: { item: Transaction }) => (
    <TransactionCard 
      transaction={item}
      onPress={() => handleTransactionPress(item.id)}
    />
  );

  // Composant Onglets
  const TabButton = ({ tab, label, count }: { tab: TabType; label: string; count: number }) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        activeTab === tab && styles.tabButtonActive,
        isDark && styles.darkTabButton,
        activeTab === tab && isDark && styles.darkTabButtonActive,
      ]}
      onPress={() => setActiveTab(tab)}
    >
      <Text style={[
        styles.tabButtonText,
        activeTab === tab && styles.tabButtonTextActive,
        isDark && styles.darkTabButtonText,
        activeTab === tab && isDark && styles.darkTabButtonTextActive,
      ]}>
        {label} ({count})
      </Text>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={[styles.container, isDark && styles.darkContainer]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={[styles.loadingText, isDark && styles.darkText]}>
            Chargement des transactions...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, isDark && styles.darkContainer]}>
      {/* Header */}
      <View style={[styles.header, isDark && styles.darkHeader]}>
        <Text style={[styles.title, isDark && styles.darkText]}>
          Transactions
        </Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={[styles.addButton, isDark && styles.darkAddButton]}
            onPress={() => navigation.navigate('AddTransaction')}
          >
            <Ionicons name="add" size={20} color="#007AFF" />
            <Text style={styles.addButtonText}>Normale</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.addButton, isDark && styles.darkAddButton]}
            onPress={() => navigation.navigate('AddTransaction', { isRecurring: true })}
          >
            <Ionicons name="repeat" size={16} color="#007AFF" />
            <Text style={styles.addButtonText}>Récurrente</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Onglets */}
      <View style={[styles.tabsContainer, isDark && styles.darkTabsContainer]}>
        <TabButton tab="all" label="Toutes" count={stats.total} />
        <TabButton tab="normal" label="Normales" count={stats.normal} />
        <TabButton tab="recurring" label="Récurrentes" count={stats.recurring} />
      </View>

      {/* Résumé statistique */}
      {filteredTransactions.length > 0 && (
        <View style={[styles.statsContainer, isDark && styles.darkStatsContainer]}>
          <Text style={[styles.statsTitle, isDark && styles.darkText]}>
            {activeTab === 'all' && 'Résumé global'}
            {activeTab === 'normal' && 'Résumé transactions normales'}
            {activeTab === 'recurring' && 'Résumé transactions récurrentes'}
          </Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, isDark && styles.darkSubtext]}>
                Revenus
              </Text>
              <Text style={[styles.statValue, { color: '#34C759' }]}>
                {formatAmount(
                  filteredTransactions
                    .filter(t => t.type === 'income')
                    .reduce((sum, t) => sum + t.amount, 0)
                )}
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, isDark && styles.darkSubtext]}>
                Dépenses
              </Text>
              <Text style={[styles.statValue, { color: '#FF3B30' }]}>
                {formatAmount(
                  filteredTransactions
                    .filter(t => t.type === 'expense')
                    .reduce((sum, t) => sum + Math.abs(t.amount), 0)
                )}
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, isDark && styles.darkSubtext]}>
                Solde
              </Text>
              <Text style={[
                styles.statValue, 
                { 
                  color: filteredTransactions.reduce((sum, t) => 
                    t.type === 'income' ? sum + t.amount : sum - Math.abs(t.amount), 0
                  ) >= 0 ? '#34C759' : '#FF3B30'
                }
              ]}>
                {formatAmount(
                  filteredTransactions.reduce((sum, t) => 
                    t.type === 'income' ? sum + t.amount : sum - Math.abs(t.amount), 0
                  )
                )}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Liste des transactions */}
      <FlatList
        data={filteredTransactions}
        renderItem={renderTransactionItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor={isDark ? "#fff" : "#000"}
          />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons 
              name={activeTab === 'recurring' ? "repeat-outline" : "receipt-outline"}
              size={64} 
              color={isDark ? '#555' : '#ccc'} 
            />
            <Text style={[styles.emptyText, isDark && styles.darkText]}>
              {activeTab === 'all' && 'Aucune transaction'}
              {activeTab === 'normal' && 'Aucune transaction normale'}
              {activeTab === 'recurring' && 'Aucune transaction récurrente'}
            </Text>
            <Text style={[styles.emptySubtext, isDark && styles.darkSubtext]}>
              {activeTab === 'all' && 'Ajoutez votre première transaction pour commencer'}
              {activeTab === 'normal' && 'Créez une transaction normale'}
              {activeTab === 'recurring' && 'Créez une transaction récurrente'}
            </Text>
            <TouchableOpacity 
              style={styles.addEmptyButton}
              onPress={() => navigation.navigate('AddTransaction', { 
                isRecurring: activeTab === 'recurring' 
              })}
            >
              <Text style={styles.addEmptyButtonText}>
                {activeTab === 'recurring' ? 'Créer une transaction récurrente' : 'Ajouter une transaction'}
              </Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Bouton d'ajout flottant */}
      <View style={styles.fabContainer}>
        <TouchableOpacity 
          style={styles.fab}
          onPress={() => navigation.navigate('AddTransaction')}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
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
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  darkAddButton: {
    backgroundColor: '#2c2c2e',
  },
  addButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007AFF',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  darkTabsContainer: {
    backgroundColor: '#2c2c2e',
    borderBottomColor: '#38383a',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  tabButtonActive: {
    backgroundColor: '#007AFF',
  },
  darkTabButton: {
    backgroundColor: 'transparent',
  },
  darkTabButtonActive: {
    backgroundColor: '#007AFF',
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  tabButtonTextActive: {
    color: '#fff',
  },
  darkTabButtonText: {
    color: '#888',
  },
  darkTabButtonTextActive: {
    color: '#fff',
  },
  statsContainer: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  darkStatsContainer: {
    backgroundColor: '#2c2c2e',
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#e0e0e0',
  },
  listContent: {
    paddingBottom: 100,
    flexGrow: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
    flex: 1,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 24,
  },
  addEmptyButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addEmptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 30,
    right: 30,
  },
  fab: {
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
  darkText: {
    color: '#fff',
  },
  darkSubtext: {
    color: '#888',
  },
});

export default TransactionsScreen;