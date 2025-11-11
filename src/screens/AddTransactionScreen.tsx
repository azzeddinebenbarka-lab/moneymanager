// src/screens/AddTransactionScreen.tsx - VERSION COMPLÈTEMENT CORRIGÉE AVEC MAD
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from '../components/SafeAreaView';
import { useCurrency } from '../context/CurrencyContext'; // ✅ AJOUT
import { useTheme } from '../context/ThemeContext';
import { useAccounts } from '../hooks/useAccounts';
import { useCategories } from '../hooks/useCategories';
import { useTransactions } from '../hooks/useTransactions';
import { Account, Category } from '../types';

const AddTransactionScreen = ({ navigation, route }: any) => {
  const { theme } = useTheme();
  const { formatAmount } = useCurrency(); // ✅ AJOUT
  const { accounts, loading: accountsLoading, error: accountsError, refreshAccounts, createAccount } = useAccounts();
  const { categories, loading: categoriesLoading } = useCategories();
  const { createTransaction } = useTransactions();
  
  const initialType = route.params?.initialType || 'expense';
  
  const [form, setForm] = useState({
    amount: '',
    type: initialType as 'expense' | 'income',
    category: '',
    accountId: '',
    description: '',
    date: new Date(),
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const isDark = theme === 'dark';

  // ✅ CORRECTION : Charger au focus de l'écran
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('🎯 [AddTransactionScreen] Screen focused, loading accounts...');
      refreshAccounts();
    });

    return unsubscribe;
  }, [navigation]);

  // ✅ CORRECTION : Charger au montage
  useEffect(() => {
    console.log('🔍 [AddTransactionScreen] Component mounted');
    refreshAccounts();
  }, []);

  // ✅ CORRECTION : Réinitialiser la catégorie quand le type change
  useEffect(() => {
    setForm(prev => ({ ...prev, category: '' }));
  }, [form.type]);

  // ✅ CORRECTION : Filtrer les catégories par type
  const filteredCategories = categories.filter((cat: Category) => cat.type === form.type);

  const handleSave = async () => {
    if (!form.amount || parseFloat(form.amount) <= 0) {
      Alert.alert('Erreur', 'Veuillez saisir un montant valide');
      return;
    }

    if (!form.category) {
      Alert.alert('Erreur', 'Veuillez sélectionner une catégorie');
      return;
    }

    if (!form.accountId) {
      Alert.alert('Erreur', 'Veuillez sélectionner un compte');
      return;
    }

    setLoading(true);
    try {
      const amount = form.type === 'expense' ? -Math.abs(parseFloat(form.amount)) : Math.abs(parseFloat(form.amount));
      
      await createTransaction({
        amount: amount,
        type: form.type,
        category: form.category,
        accountId: form.accountId,
        description: form.description,
        date: form.date.toISOString().split('T')[0],
      });

      Alert.alert(
        'Succès',
        'Transaction ajoutée avec succès',
        [{ 
          text: 'OK', 
          onPress: () => navigation.navigate('Transactions')
        }]
      );
    } catch (error) {
      console.error('Error creating transaction:', error);
      Alert.alert('Erreur', 'Impossible d\'ajouter la transaction');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setForm(prev => ({ ...prev, date: selectedDate }));
    }
  };

  // ✅ CORRECTION : Debug des comptes
  useEffect(() => {
    console.log('📊 [AddTransactionScreen] Accounts state:', {
      loading: accountsLoading,
      error: accountsError,
      count: accounts.length,
      accounts: accounts.map((acc: Account) => ({ 
        id: acc.id, 
        name: acc.name, 
        balance: acc.balance,
        type: acc.type 
      }))
    });
  }, [accounts, accountsLoading, accountsError]);

  return (
    <SafeAreaView>
      <ScrollView 
        style={[styles.container, isDark && styles.darkContainer]}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={isDark ? "#fff" : "#000"} />
          </TouchableOpacity>
          <Text style={[styles.title, isDark && styles.darkText]}>
            Nouvelle Transaction
          </Text>
        </View>

        {/* Type de transaction */}
        <View style={styles.typeSelector}>
          <TouchableOpacity 
            style={[
              styles.typeButton, 
              form.type === 'expense' && styles.typeButtonActive
            ]}
            onPress={() => setForm(prev => ({ ...prev, type: 'expense' }))}
          >
            <Ionicons 
              name="arrow-up" 
              size={20} 
              color={form.type === 'expense' ? '#fff' : '#FF3B30'} 
            />
            <Text style={[
              styles.typeButtonText,
              form.type === 'expense' && styles.typeButtonTextActive
            ]}>
              Dépense
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.typeButton, 
              form.type === 'income' && styles.typeButtonActive
            ]}
            onPress={() => setForm(prev => ({ ...prev, type: 'income' }))}
          >
            <Ionicons 
              name="arrow-down" 
              size={20} 
              color={form.type === 'income' ? '#fff' : '#34C759'} 
            />
            <Text style={[
              styles.typeButtonText,
              form.type === 'income' && styles.typeButtonTextActive
            ]}>
              Revenu
            </Text>
          </TouchableOpacity>
        </View>

        {/* Montant */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, isDark && styles.darkText]}>
            Montant *
          </Text>
          <View style={styles.amountContainer}>
            {/* ✅ CORRECTION : Utiliser le symbole de devise dynamique */}
            <TextInput
              style={[
                styles.input, 
                styles.amountInput, 
                isDark && styles.darkInput,
              ]}
              value={form.amount}
              onChangeText={(text) => setForm(prev => ({ ...prev, amount: text.replace(',', '.') }))}
              placeholder="0.00"
              placeholderTextColor={isDark ? "#888" : "#999"}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        {/* Catégorie */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, isDark && styles.darkText]}>
            Catégorie *
          </Text>
          {categoriesLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#007AFF" />
              <Text style={[styles.loadingText, isDark && styles.darkSubtext]}>
                Chargement des catégories...
              </Text>
            </View>
          ) : (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesContainer}
            >
              {filteredCategories.map((category: Category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryButton,
                    form.category === category.id && styles.categoryButtonSelected,
                    isDark && styles.darkCategoryButton
                  ]}
                  onPress={() => setForm(prev => ({ ...prev, category: category.id }))}
                >
                  <Ionicons 
                    name={category.icon as any} 
                    size={16} 
                    color={form.category === category.id ? '#fff' : category.color} 
                  />
                  <Text style={[
                    styles.categoryText,
                    form.category === category.id && styles.categoryTextSelected,
                  ]}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Compte */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, isDark && styles.darkText]}>
            Compte *
          </Text>
          
          {accountsLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#007AFF" />
              <Text style={[styles.loadingText, isDark && styles.darkSubtext]}>
                Chargement des comptes...
              </Text>
            </View>
          ) : accountsError ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={24} color="#FF3B30" />
              <Text style={styles.errorText}>
                Erreur de chargement: {accountsError}
              </Text>
              <TouchableOpacity 
                style={styles.retryButton}
                onPress={refreshAccounts}
              >
                <Text style={styles.retryButtonText}>Réessayer</Text>
              </TouchableOpacity>
            </View>
          ) : accounts.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="wallet-outline" size={32} color={isDark ? "#555" : "#ccc"} />
              <Text style={[styles.emptyText, isDark && styles.darkSubtext]}>
                Aucun compte disponible
              </Text>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => navigation.navigate('Accounts')}
              >
                <Text style={styles.addButtonText}>Créer un compte</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.accountsContainer}
            >
              {accounts.map((account: Account) => (
                <TouchableOpacity
                  key={account.id}
                  style={[
                    styles.accountButton,
                    form.accountId === account.id && styles.accountButtonSelected,
                    isDark && styles.darkAccountButton
                  ]}
                  onPress={() => setForm(prev => ({ ...prev, accountId: account.id }))}
                >
                  <View style={[styles.colorIndicator, { backgroundColor: account.color }]} />
                  <View style={styles.accountInfo}>
                    <Text style={[
                      styles.accountText,
                      form.accountId === account.id && styles.accountTextSelected,
                      isDark && styles.darkText
                    ]}>
                      {account.name}
                    </Text>
                    {/* ✅ CORRECTION : Utiliser formatAmount pour le solde */}
                    <Text style={[
                      styles.accountBalance,
                      form.accountId === account.id && styles.accountBalanceSelected,
                      isDark && styles.darkSubtext
                    ]}>
                      {formatAmount(account.balance)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Description */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, isDark && styles.darkText]}>
            Description
          </Text>
          <TextInput
            style={[styles.input, isDark && styles.darkInput]}
            value={form.description}
            onChangeText={(text) => setForm(prev => ({ ...prev, description: text }))}
            placeholder="Ajouter une description..."
            placeholderTextColor={isDark ? "#888" : "#999"}
            multiline
          />
        </View>

        {/* Date */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, isDark && styles.darkText]}>
            Date
          </Text>
          <TouchableOpacity 
            style={[styles.dateButton, isDark && styles.darkInput]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={[styles.dateText, isDark && styles.darkText]}>
              {form.date.toLocaleDateString('fr-FR')}
            </Text>
            <Ionicons name="calendar" size={20} color={isDark ? "#fff" : "#666"} />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={form.date}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </View>

        {/* Boutons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={[styles.cancelButton, isDark && styles.darkCancelButton]}
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Annuler</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.saveButton, 
              loading && styles.saveButtonDisabled,
              (!form.amount || !form.category || !form.accountId) && styles.saveButtonDisabled
            ]}
            onPress={handleSave}
            disabled={loading || !form.amount || !form.category || !form.accountId}
          >
            <Text style={styles.saveButtonText}>
              {loading ? 'Ajout...' : 'Ajouter'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 30,
    gap: 12,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    gap: 8,
  },
  typeButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#000',
  },
  darkInput: {
    backgroundColor: '#2c2c2e',
    borderColor: '#444',
    color: '#fff',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  amountInput: {
    paddingLeft: 10,
  },
  categoriesContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    gap: 8,
  },
  darkCategoryButton: {
    backgroundColor: '#333',
    borderColor: '#555',
  },
  categoryButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  categoryTextSelected: {
    color: '#fff',
  },
  accountsContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  accountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    minWidth: 200,
  },
  darkAccountButton: {
    backgroundColor: '#2c2c2e',
    borderColor: '#444',
  },
  accountButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  colorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  accountInfo: {
    flex: 1,
  },
  accountText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  accountTextSelected: {
    color: '#fff',
  },
  accountBalance: {
    fontSize: 14,
    color: '#666',
  },
  accountBalanceSelected: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
  },
  dateText: {
    fontSize: 16,
    color: '#000',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  darkCancelButton: {
    backgroundColor: '#333',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF3B30',
    gap: 12,
  },
  errorText: {
    fontSize: 14,
    color: '#FF3B30',
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  darkText: {
    color: '#fff',
  },
  darkSubtext: {
    color: '#888',
  },
});

export default AddTransactionScreen;