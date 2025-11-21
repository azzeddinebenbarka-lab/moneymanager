// src/screens/AccountsScreen.tsx - VERSION COMPLÈTEMENT CORRIGÉE
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AccountForm from '../components/account/AccountForm';
import { useCurrency } from '../context/CurrencyContext';
import { useTheme } from '../context/ThemeContext';
import { useAccounts } from '../hooks/useAccounts';
import { Account } from '../types';

const AccountsScreen = ({ navigation }: any) => {
  const { formatAmount } = useCurrency();
  const { theme } = useTheme();
  const { 
    accounts, 
    loading, 
    totalBalance, 
    createAccount,
    updateAccount, 
    deleteAccount,
    refreshAccounts // ✅ AJOUT DU RAFRAÎCHISSEMENT
  } = useAccounts();
  
  const [showAccountForm, setShowAccountForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const isDark = theme === 'dark';

  // ✅ RAFRAÎCHISSEMENT AUTOMATIQUE AU FOCUS
  useFocusEffect(
    useCallback(() => {
      console.log('🔄 [AccountsScreen] Rafraîchissement automatique');
      refreshAccounts();
    }, [refreshAccounts])
  );

  // ✅ RAFRAÎCHISSEMENT MANUEL
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    console.log('🔄 [AccountsScreen] Rafraîchissement manuel');
    await refreshAccounts();
    setRefreshing(false);
  }, [refreshAccounts]);

  const handleCreateAccount = async (accountData: Omit<Account, 'id' | 'createdAt'>) => {
    try {
      await createAccount(accountData);
      setShowAccountForm(false);
      setEditingAccount(null);
      await refreshAccounts();
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de créer le compte');
    }
  };

  const handleUpdateAccount = async (accountData: Account) => {
    try {
      if (!accountData.id) throw new Error('Identifiant manquant');
      await updateAccount(accountData.id, accountData);
      setShowAccountForm(false);
      setEditingAccount(null);
      await refreshAccounts();
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de modifier le compte');
    }
  };

  const handleDeleteAccount = (account: Account) => {
    Alert.alert(
      'Supprimer le compte',
      `Êtes-vous sûr de vouloir supprimer le compte "${account.name}" ?\n\nCette action est irréversible.`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAccount(account.id);
              // ✅ RAFRAÎCHIR APRÈS SUPPRESSION
              await refreshAccounts();
            } catch (error: any) {
              Alert.alert('Erreur', error.message || 'Impossible de supprimer le compte');
            }
          },
        },
      ]
    );
  };

  const handleEditAccount = (account: Account) => {
    console.log('✏️ [AccountsScreen] Modification du compte:', account.name);
    setEditingAccount(account);
    setShowAccountForm(true);
  };

  const renderAccountItem = ({ item }: { item: Account }) => (
    <TouchableOpacity 
      style={[styles.accountCard, isDark && styles.darkCard]}
      onPress={() => navigation.navigate('AccountDetail', { accountId: item.id })}
    >
      <View style={styles.accountMainInfo}>
        <View style={styles.accountHeader}>
          <View style={[styles.colorIndicator, { backgroundColor: item.color }]} />
          <View style={styles.accountTextContainer}>
            <Text style={[styles.accountName, isDark && styles.darkText]} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={[styles.accountType, isDark && styles.darkSubtext]}>
              {item.type === 'cash' ? 'Espèces' : 
               item.type === 'bank' ? 'Banque' : 
               item.type === 'card' ? 'Carte' : 'Épargne'}
            </Text>
          </View>
        </View>
        <Text style={[styles.accountBalance, isDark && styles.darkText]}>
          {formatAmount(item.balance)}
        </Text>
      </View>

      {/* Actions */}
      <View style={styles.accountActions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleEditAccount(item)}
        >
          <Ionicons name="create-outline" size={18} color="#007AFF" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteAccount(item)}
        >
          <Ionicons name="trash-outline" size={18} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  
  
  // New header matching design
  const Header = () => (
    <View style={[styles.topHeader, isDark && styles.darkHeader]}> 
      <View style={styles.topHeaderRow}>
        <TouchableOpacity style={styles.backWrap} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={20} color={isDark ? '#fff' : '#0F172A'} />
        </TouchableOpacity>

        <Text style={[styles.pageTitle, isDark && styles.darkText]}>Mes Comptes</Text>

        <TouchableOpacity style={styles.refreshIcon} onPress={onRefresh} disabled={refreshing}>
          <Ionicons name="refresh" size={20} color={isDark ? '#fff' : '#0F172A'} />
        </TouchableOpacity>
      </View>

      <View style={[styles.summaryCard, isDark && styles.darkCard]}> 
        <View style={styles.summaryTop}>
          <View>
            <Text style={[styles.summaryLabel, isDark && styles.darkSubtext]}>TOTAL DES AVOIRS</Text>
            <Text style={[styles.summaryAmount, isDark && styles.darkText]}>{formatAmount(totalBalance)}</Text>
          </View>
          <View style={styles.summaryIcon}>
            <Ionicons name="library-outline" size={28} color="#007AFF" />
          </View>
        </View>

        <View style={styles.summarySplit}>
          <View style={styles.splitItem}>
            <Text style={[styles.splitLabel, isDark && styles.darkSubtext]}>Comptes courants</Text>
            <Text style={[styles.splitValue, isDark && styles.darkText]}>{formatAmount(accounts.filter(a => a.type !== 'savings').reduce((s, a) => s + a.balance, 0))}</Text>
          </View>
          <View style={styles.splitItem}>
            <Text style={[styles.splitLabel, isDark && styles.darkSubtext]}>Épargne</Text>
            <Text style={[styles.splitValue, isDark && styles.darkText]}>{formatAmount(accounts.filter(a => a.type === 'savings').reduce((s, a) => s + a.balance, 0))}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  if (loading && accounts.length === 0) {
    return (
      <View style={[styles.container, isDark && styles.darkContainer, styles.center]}>
        <Text style={[styles.loadingText, isDark && styles.darkText]}>
          Chargement des comptes...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, isDark && styles.darkContainer]} edges={["top"]}>
      <Header />

      <View style={styles.content}>
        <View style={styles.listContainer}>
          <FlatList
            data={accounts}
            renderItem={renderAccountItem}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#007AFF']}
                tintColor={isDark ? '#fff' : '#007AFF'}
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Ionicons 
                  name="wallet-outline" 
                  size={64} 
                  color={isDark ? '#555' : '#ccc'} 
                />
                <Text style={[styles.emptyText, isDark && styles.darkSubtext]}>
                  Aucun compte créé
                </Text>
                <Text style={[styles.emptySubtext, isDark && styles.darkSubtext]}>
                  Ajoutez votre premier compte pour commencer
                </Text>
              </View>
            }
          />
        </View>

        <TouchableOpacity style={[styles.primaryCTA, isDark && styles.darkCTA]} onPress={() => { setEditingAccount(null); setShowAccountForm(true); }}>
          <Text style={styles.primaryCTAText}>Ajouter un compte</Text>
        </TouchableOpacity>

        <AccountForm
          visible={showAccountForm}
          onClose={() => {
            setShowAccountForm(false);
            setEditingAccount(null);
          }}
          onSubmit={editingAccount ? handleUpdateAccount : handleCreateAccount}
          editingAccount={editingAccount || undefined}
        />
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
  center: {
    justifyContent: 'center',
    alignItems: 'center',
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
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  refreshButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkRefreshButton: {
    backgroundColor: '#38383a',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  accountCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  darkCard: {
    backgroundColor: '#2c2c2e',
  },
  accountMainInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  colorIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 12,
  },
  accountTextContainer: {
    flex: 1,
  },
  accountName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  darkText: {
    color: '#fff',
  },
  accountBalance: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  accountType: {
    fontSize: 14,
    color: '#666',
  },
  darkSubtext: {
    color: '#888',
  },
  accountActions: {
    flexDirection: 'row',
    gap: 8,
    marginLeft: 12,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
  },
  editButton: {
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  deleteButton: {
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
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
  },
  addButton: {
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
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  // New header / summary styles
  topHeader: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e6e6e6',
  },
  topHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  backWrap: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  refreshIcon: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  summaryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
  },
  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#f0f6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summarySplit: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  splitItem: {
    flex: 1,
  },
  splitLabel: {
    fontSize: 12,
    color: '#888',
  },
  splitValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginTop: 6,
  },
  // Layout helpers
  content: {
    flex: 1,
    padding: 16,
  },
  listContainer: {
    flex: 1,
  },
  separator: {
    height: 12,
  },
  primaryCTA: {
    marginTop: 12,
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  darkCTA: {
    backgroundColor: '#0a84ff',
  },
  primaryCTAText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  emptyWrap: {
    padding: 30,
    alignItems: 'center',
  },
});

export default AccountsScreen;