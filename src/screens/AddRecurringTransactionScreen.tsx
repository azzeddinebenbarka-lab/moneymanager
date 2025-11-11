// src/screens/AddRecurringTransactionScreen.tsx - VERSION COMPLÈTEMENT CORRIGÉE AVEC DEVISE
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from '../components/SafeAreaView';
import { useCurrency } from '../context/CurrencyContext'; // ✅ AJOUT: Import du contexte devise
import { useTheme } from '../context/ThemeContext';
import { useAccounts } from '../hooks/useAccounts';
import { useCategories } from '../hooks/useCategories';
import { useRecurringTransactions } from '../hooks/useRecurringTransactions';

interface RecurringTransactionForm {
  description: string;
  amount: string;
  type: 'expense' | 'income';
  category: string;
  accountId: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: Date;
  endDate?: Date;
}

type FrequencyOption = {
  value: 'daily' | 'weekly' | 'monthly' | 'yearly';
  label: string;
};

const AddRecurringTransactionScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const { formatAmount } = useCurrency(); // ✅ CORRECTION: Utilisation du contexte devise
  const { accounts, loading: accountsLoading } = useAccounts();
  const { categories, loading: categoriesLoading } = useCategories();
  const { createRecurringTransaction } = useRecurringTransactions();
  
  const [form, setForm] = useState<RecurringTransactionForm>({
    description: '',
    amount: '',
    type: 'expense',
    category: '',
    accountId: '',
    frequency: 'monthly',
    startDate: new Date(),
  });
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [hasEndDate, setHasEndDate] = useState(false);
  const [loading, setLoading] = useState(false);

  const isDark = theme === 'dark';

  const frequencyOptions: FrequencyOption[] = [
    { value: 'daily', label: 'Quotidienne' },
    { value: 'weekly', label: 'Hebdomadaire' },
    { value: 'monthly', label: 'Mensuelle' },
    { value: 'yearly', label: 'Annuelle' },
  ];

  const filteredCategories = categories.filter(cat => cat.type === form.type);

  // ✅ CORRECTION: Récupérer le symbole de devise
  const getCurrencySymbol = () => {
    return formatAmount(0, true).replace(/[0-9.,\s]/g, '').trim() || 'MAD';
  };

  const handleSave = async () => {
    if (!form.description || !form.amount || !form.category || !form.accountId) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    const amount = parseFloat(form.amount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Erreur', 'Veuillez saisir un montant valide');
      return;
    }

    if (!form.accountId) {
      Alert.alert('Erreur', 'Veuillez sélectionner un compte');
      return;
    }

    if (!form.category) {
      Alert.alert('Erreur', 'Veuillez sélectionner une catégorie');
      return;
    }

    setLoading(true);
    try {
      await createRecurringTransaction({
        description: form.description,
        amount: form.type === 'expense' ? -Math.abs(amount) : Math.abs(amount),
        type: form.type,
        category: form.category,
        accountId: form.accountId,
        frequency: form.frequency,
        startDate: form.startDate.toISOString().split('T')[0],
        endDate: hasEndDate && form.endDate ? form.endDate.toISOString().split('T')[0] : undefined,
        isActive: true,
        userId: 'default-user',
      });
    
      Alert.alert(
        'Succès',
        'Transaction récurrente créée avec succès',
        [{ 
          text: 'OK', 
          onPress: () => navigation.navigate('RecurringTransactions') 
        }]
      );
    } catch (error: any) {
      console.error('Error creating recurring transaction:', error);
      
      let errorMessage = 'Impossible de créer la transaction récurrente';
      if (error.message.includes('FOREIGN KEY constraint failed')) {
        errorMessage = 'Erreur : Le compte sélectionné n\'existe pas. Veuillez sélectionner un compte valide.';
      } else if (error.message.includes('no such table')) {
        errorMessage = 'Erreur système. Veuillez réessayer.';
      }
      
      Alert.alert('Erreur', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setForm(prev => ({ ...prev, startDate: selectedDate }));
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setForm(prev => ({ ...prev, endDate: selectedDate }));
    }
  };

  // ✅ CORRECTION: Nouvelle fonction de formatage avec devise
  const handleAmountChange = (value: string) => {
    let cleanedValue = value.replace(/[^\d,.]/g, '');
    cleanedValue = cleanedValue.replace(',', '.');
    
    const parts = cleanedValue.split('.');
    if (parts.length > 2) {
      cleanedValue = parts[0] + '.' + parts.slice(1).join('');
    }
    
    setForm(prev => ({ ...prev, amount: cleanedValue }));
  };

  // ✅ CORRECTION: Formatage avec la devise courante
  const formatDisplayAmount = (value: string): string => {
    if (!value) return '';
    
    const num = parseFloat(value);
    if (isNaN(num)) return '';
    
    return formatAmount(num, false); // ✅ Utilise la fonction du contexte devise
  };

  const getNextOccurrence = () => {
    const now = new Date();
    const start = new Date(form.startDate);
    
    if (start > now) return start;
    
    const next = new Date(start);
    switch (form.frequency) {
      case 'daily':
        next.setDate(next.getDate() + 1);
        break;
      case 'weekly':
        next.setDate(next.getDate() + 7);
        break;
      case 'monthly':
        next.setMonth(next.getMonth() + 1);
        break;
      case 'yearly':
        next.setFullYear(next.getFullYear() + 1);
        break;
    }
    
    return next;
  };

  const nextOccurrence = getNextOccurrence();

  if (accountsLoading || categoriesLoading) {
    return (
      <SafeAreaView>
        <View style={[styles.container, isDark && styles.darkContainer]}>
          <Text style={[styles.loadingText, isDark && styles.darkText]}>
            Chargement...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <ScrollView 
        style={[styles.container, isDark && styles.darkContainer]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={true} // ✅ CORRECTION: Activation du défilement
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={isDark ? "#fff" : "#000"} />
          </TouchableOpacity>
          <Text style={[styles.title, isDark && styles.darkText]}>
            Nouvelle Transaction Récurrente
          </Text>
        </View>

        {/* Type de transaction */}
        <View style={styles.typeSelector}>
          <TouchableOpacity 
            style={[
              styles.typeButton, 
              form.type === 'expense' && styles.typeButtonActive
            ]}
            onPress={() => setForm(prev => ({ ...prev, type: 'expense', category: '' }))}
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
            onPress={() => setForm(prev => ({ ...prev, type: 'income', category: '' }))}
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

        {/* Description */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, isDark && styles.darkText]}>
            Description *
          </Text>
          <TextInput
            style={[styles.input, isDark && styles.darkInput]}
            value={form.description}
            onChangeText={(text) => setForm(prev => ({ ...prev, description: text }))}
            placeholder="Ex: Loyer, Salaire, Abonnement..."
            placeholderTextColor={isDark ? "#888" : "#999"}
          />
        </View>

        {/* Montant */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, isDark && styles.darkText]}>
            Montant *
          </Text>
          <View style={styles.amountContainer}>
            <TextInput
              style={[
                styles.input, 
                styles.amountInput, 
                isDark && styles.darkInput,
              ]}
              value={form.amount}
              onChangeText={handleAmountChange}
              placeholder="0.00"
              placeholderTextColor={isDark ? "#888" : "#999"}
              keyboardType="decimal-pad"
            />
          </View>
          {form.amount && (
            <Text style={[styles.hint, isDark && styles.darkSubtext]}>
              {formatDisplayAmount(form.amount)} {/* ✅ CORRECTION: Affichage formaté */}
            </Text>
          )}
        </View>

        {/* Catégorie */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, isDark && styles.darkText]}>
            Catégorie *
          </Text>
          {filteredCategories.length === 0 ? (
            <Text style={[styles.noCategoriesText, isDark && styles.darkSubtext]}>
              Aucune catégorie disponible pour {form.type === 'expense' ? 'les dépenses' : 'les revenus'}
            </Text>
          ) : (
            <View style={styles.categoriesContainer}>
              {filteredCategories.map((category) => (
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
            </View>
          )}
        </View>

        {/* Compte */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, isDark && styles.darkText]}>
            Compte *
          </Text>
          {accounts.length === 0 ? (
            <Text style={[styles.noAccountsText, isDark && styles.darkSubtext]}>
              Aucun compte disponible. Veuillez d'abord créer un compte.
            </Text>
          ) : (
            <View style={styles.accountsContainer}>
              {accounts.map((account) => (
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
                  <Text style={[
                    styles.accountText,
                    form.accountId === account.id && styles.accountTextSelected,
                  ]}>
                    {account.name}
                  </Text>
                  <Text style={[
                    styles.accountBalance,
                    isDark && styles.darkSubtext
                  ]}>
                    {formatAmount(account.balance, false)} {/* ✅ CORRECTION: Format devise */}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Fréquence */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, isDark && styles.darkText]}>
            Fréquence *
          </Text>
          <View style={styles.frequencyContainer}>
            {frequencyOptions.map((freq) => (
              <TouchableOpacity
                key={freq.value}
                style={[
                  styles.frequencyButton,
                  form.frequency === freq.value && styles.frequencyButtonSelected,
                  isDark && styles.darkFrequencyButton
                ]}
                onPress={() => setForm(prev => ({ ...prev, frequency: freq.value }))}
              >
                <Text style={[
                  styles.frequencyText,
                  form.frequency === freq.value && styles.frequencyTextSelected,
                ]}>
                  {freq.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Date de début */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, isDark && styles.darkText]}>
            Date de début *
          </Text>
          <TouchableOpacity 
            style={[styles.dateButton, isDark && styles.darkInput]}
            onPress={() => setShowStartDatePicker(true)}
          >
            <Text style={[styles.dateText, isDark && styles.darkText]}>
              {form.startDate.toLocaleDateString('fr-FR')}
            </Text>
            <Ionicons name="calendar" size={20} color={isDark ? "#fff" : "#666"} />
          </TouchableOpacity>
          {showStartDatePicker && (
            <DateTimePicker
              value={form.startDate}
              mode="date"
              display="default"
              onChange={handleStartDateChange}
            />
          )}
        </View>

        {/* Date de fin */}
        <View style={styles.inputGroup}>
          <View style={styles.endDateHeader}>
            <Text style={[styles.label, isDark && styles.darkText]}>
              Date de fin
            </Text>
            <TouchableOpacity 
              style={styles.toggleButton}
              onPress={() => {
                setHasEndDate(!hasEndDate);
                if (hasEndDate) {
                  setForm(prev => ({ ...prev, endDate: undefined }));
                }
              }}
            >
              <Text style={styles.toggleButtonText}>
                {hasEndDate ? 'Désactiver' : 'Activer'}
              </Text>
            </TouchableOpacity>
          </View>
          
          {hasEndDate && (
            <TouchableOpacity 
              style={[styles.dateButton, isDark && styles.darkInput]}
              onPress={() => setShowEndDatePicker(true)}
            >
              <Text style={[styles.dateText, isDark && styles.darkText]}>
                {form.endDate ? form.endDate.toLocaleDateString('fr-FR') : 'Sélectionner une date'}
              </Text>
              <Ionicons name="calendar" size={20} color={isDark ? "#fff" : "#666"} />
            </TouchableOpacity>
          )}
          {showEndDatePicker && (
            <DateTimePicker
              value={form.endDate || new Date()}
              mode="date"
              display="default"
              onChange={handleEndDateChange}
            />
          )}
        </View>

        {/* Prochaine occurrence */}
        <View style={[styles.nextOccurrenceCard, isDark && styles.darkCard]}>
          <Text style={[styles.nextOccurrenceLabel, isDark && styles.darkSubtext]}>
            Prochaine occurrence
          </Text>
          <Text style={[styles.nextOccurrenceDate, isDark && styles.darkText]}>
            {nextOccurrence.toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Text>
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
              (!form.description || !form.amount || !form.category || !form.accountId) && styles.saveButtonDisabled
            ]}
            onPress={handleSave}
            disabled={loading || !form.description || !form.amount || !form.category || !form.accountId || accounts.length === 0}
          >
            <Text style={styles.saveButtonText}>
              {loading ? 'Création...' : 'Créer'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Les styles restent identiques à votre version
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
    marginBottom: 8,
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
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginRight: 12,
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  amountInput: {
    paddingLeft: 10,
  },
  hint: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
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
  noCategoriesText: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 16,
  },
  accountsContainer: {
    gap: 8,
  },
  accountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
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
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  accountText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  accountTextSelected: {
    color: '#fff',
  },
  accountBalance: {
    fontSize: 14,
    color: '#666',
  },
  noAccountsText: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 16,
    color: '#666',
  },
  frequencyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  frequencyButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    minWidth: 100,
  },
  darkFrequencyButton: {
    backgroundColor: '#333',
    borderColor: '#555',
  },
  frequencyButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  frequencyText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
  },
  frequencyTextSelected: {
    color: '#fff',
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
  endDateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  toggleButton: {
    padding: 8,
  },
  toggleButtonText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  nextOccurrenceCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
    marginBottom: 24,
  },
  darkCard: {
    backgroundColor: '#2c2c2e',
  },
  nextOccurrenceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  nextOccurrenceDate: {
    fontSize: 16,
    fontWeight: '600',
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
  darkText: {
    color: '#fff',
  },
  darkSubtext: {
    color: '#888',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#000',
  },
});

export default AddRecurringTransactionScreen;