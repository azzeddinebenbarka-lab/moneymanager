// src/screens/TransactionsScreen.tsx - VERSION COMPLÈTEMENT CORRIGÉE
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
import { useCurrency } from '../context/CurrencyContext';
import { useTheme } from '../context/ThemeContext';
import { useTransactions } from '../hooks/useTransactions';
import { Transaction } from '../types';

const TransactionsScreen = ({ navigation }: any) => {
  const { formatAmount } = useCurrency();
  const { theme } = useTheme();
  const { 
    transactions, 
    loading, 
    error,
    refreshTransactions 
  } = useTransactions();
  
  const [refreshing, setRefreshing] = useState(false);

  const isDark = theme === 'dark';

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

  const renderTransactionItem = ({ item }: { item: Transaction }) => (
    <TouchableOpacity 
      style={[
        styles.transactionItem,
        isDark && styles.darkTransactionItem
      ]}
      onPress={() => handleTransactionPress(item.id)} // ✅ CORRECTION : Appel de fonction
    >
      <View style={styles.transactionLeft}>
        <View style={[
          styles.iconContainer,
          { backgroundColor: item.type === 'income' ? '#34C75920' : '#FF3B3020' }
        ]}>
          <Ionicons 
            name={item.type === 'income' ? 'arrow-down' : 'arrow-up'} 
            size={20} 
            color={item.type === 'income' ? '#34C759' : '#FF3B30'} 
          />
        </View>
        <View style={styles.transactionInfo}>
          <Text style={[
            styles.transactionDescription,
            isDark && styles.darkText
          ]}>
            {item.description || 'Sans description'}
          </Text>
          <Text style={[
            styles.transactionCategory,
            isDark && styles.darkSubtext
          ]}>
            {item.category}
          </Text>
          <Text style={[
            styles.transactionDate,
            isDark && styles.darkSubtext
          ]}>
            {new Date(item.date).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </Text>
        </View>
      </View>
      <View style={styles.transactionRight}>
        <Text style={[
          styles.transactionAmount,
          { color: item.type === 'income' ? '#34C759' : '#FF3B30' }
        ]}>
          {item.type === 'income' ? '+' : '-'}{formatAmount(Math.abs(item.amount))} {/* ✅ CORRECTION : Syntaxe corrigée */}
        </Text>
      </View>
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
        <TouchableOpacity 
          style={[styles.addButton, isDark && styles.darkAddButton]}
          onPress={() => navigation.navigate('AddTransaction')}
        >
          <Ionicons name="add" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Liste des transactions */}
      <FlatList
        data={transactions}
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
              name="receipt-outline" 
              size={64} 
              color={isDark ? '#555' : '#ccc'} 
            />
            <Text style={[styles.emptyText, isDark && styles.darkText]}>
              Aucune transaction
            </Text>
            <Text style={[styles.emptySubtext, isDark && styles.darkSubtext]}>
              Ajoutez votre première transaction pour commencer
            </Text>
            <TouchableOpacity 
              style={styles.addEmptyButton}
              onPress={() => navigation.navigate('AddTransaction')}
            >
              <Text style={styles.addEmptyButtonText}>Ajouter une transaction</Text>
            </TouchableOpacity>
          </View>
        }
        ListHeaderComponent={
          transactions.length > 0 ? (
            <View style={[styles.statsContainer, isDark && styles.darkStatsContainer]}>
              <Text style={[styles.statsTitle, isDark && styles.darkText]}>
                Résumé du mois
              </Text>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={[styles.statLabel, isDark && styles.darkSubtext]}>
                    Revenus
                  </Text>
                  <Text style={[styles.statValue, { color: '#34C759' }]}>
                    {formatAmount(
                      transactions
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
                      transactions
                        .filter(t => t.type === 'expense')
                        .reduce((sum, t) => sum + t.amount, 0)
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
                      color: transactions.reduce((sum, t) => 
                        t.type === 'income' ? sum + t.amount : sum - t.amount, 0
                      ) >= 0 ? '#34C759' : '#FF3B30'
                    }
                  ]}>
                    {formatAmount(
                      transactions.reduce((sum, t) => 
                        t.type === 'income' ? sum + t.amount : sum - t.amount, 0
                      )
                    )}
                  </Text>
                </View>
              </View>
            </View>
          ) : null
        }
      />

      {/* Bouton d'ajout flottant */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('AddTransaction')}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  darkAddButton: {
    backgroundColor: '#2c2c2e',
  },
  listContent: {
    paddingBottom: 100,
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
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  darkTransactionItem: {
    backgroundColor: '#2c2c2e',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  transactionCategory: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: '#999',
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
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
  darkText: {
    color: '#fff',
  },
  darkSubtext: {
    color: '#888',
  },
});

export default TransactionsScreen;