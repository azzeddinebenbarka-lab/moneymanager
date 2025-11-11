// src/screens/AddAnnualChargeScreen.tsx - VERSION CORRIGÉE AVEC MAD
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
import { useCurrency } from '../context/CurrencyContext'; // ✅ AJOUT
import { useTheme } from '../context/ThemeContext';
import { useAccounts } from '../hooks/useAccounts';
import { useAnnualCharges } from '../hooks/useAnnualCharges';
import { useCategories } from '../hooks/useCategories';
import { CreateAnnualChargeData } from '../types/AnnualCharge';

interface AnnualChargeFormData {
  name: string;
  amount: string;
  dueDate: Date;
  category: string;
  reminderDays: string;
  accountId: string;
  autoDeduct: boolean;
  notes: string;
  paymentMethod: string;
  recurrence: 'yearly' | 'monthly' | 'quarterly' | 'none';
}

const AddAnnualChargeScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const { formatAmount } = useCurrency(); // ✅ AJOUT
  const { accounts } = useAccounts();
  const { categories } = useCategories();
  const { createCharge } = useAnnualCharges();
  
  const [form, setForm] = useState<AnnualChargeFormData>({
    name: '',
    amount: '',
    dueDate: new Date(),
    category: '',
    reminderDays: '7',
    accountId: '',
    autoDeduct: false,
    notes: '',
    paymentMethod: '',
    recurrence: 'yearly',
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const isDark = theme === 'dark';

  const recurrenceOptions = [
    { value: 'yearly' as const, label: 'Annuelle' },
    { value: 'monthly' as const, label: 'Mensuelle' },
    { value: 'quarterly' as const, label: 'Trimestrielle' },
    { value: 'none' as const, label: 'Ponctuelle' },
  ];

  const paymentMethods = [
    'Prélèvement automatique',
    'Virement',
    'Carte bancaire',
    'Espèces',
    'Chèque',
    'Autre'
  ];

  const handleSave = async () => {
    if (!form.name || !form.amount || !form.category || !form.dueDate) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    const amount = parseFloat(form.amount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Erreur', 'Veuillez saisir un montant valide');
      return;
    }

    if (form.autoDeduct && !form.accountId) {
      Alert.alert('Erreur', 'Veuillez sélectionner un compte pour le prélèvement automatique');
      return;
    }

    setLoading(true);
    try {
      const chargeData: CreateAnnualChargeData = {
        name: form.name.trim(),
        amount: amount,
        dueDate: form.dueDate.toISOString().split('T')[0],
        category: form.category,
        reminderDays: parseInt(form.reminderDays) || 7,
        accountId: form.accountId || undefined,
        autoDeduct: form.autoDeduct,
        notes: form.notes || undefined,
        paymentMethod: form.paymentMethod || undefined,
        recurrence: form.recurrence !== 'none' ? form.recurrence : undefined,
      };

      await createCharge(chargeData);
      
      Alert.alert(
        'Succès',
        'Charge annuelle créée avec succès',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Error creating annual charge:', error);
      Alert.alert('Erreur', 'Impossible de créer la charge annuelle');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setForm(prev => ({ ...prev, dueDate: selectedDate }));
    }
  };

  const handleAmountChange = (value: string) => {
    // Permettre la saisie naturelle avec virgule ou point
    let cleanedValue = value.replace(/[^\d,.]/g, '');
    cleanedValue = cleanedValue.replace(',', '.');
    
    const parts = cleanedValue.split('.');
    if (parts.length > 2) {
      cleanedValue = parts[0] + '.' + parts.slice(1).join('');
    }
    
    setForm(prev => ({ ...prev, amount: cleanedValue }));
  };

  // ✅ CORRECTION : Utiliser formatAmount pour l'affichage
  const formatDisplayAmount = (value: string): string => {
    if (!value) return '';
    const num = parseFloat(value);
    if (isNaN(num)) return '';
    return formatAmount(num);
  };

  const expenseCategories = categories.filter(cat => cat.type === 'expense');

  return (
    <SafeAreaView>
      <ScrollView 
        style={[styles.container, isDark && styles.darkContainer]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={isDark ? "#fff" : "#000"} />
          </TouchableOpacity>
          <Text style={[styles.title, isDark && styles.darkText]}>
            Nouvelle Charge Annuelle
          </Text>
        </View>

        {/* Nom de la charge */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, isDark && styles.darkText]}>
            Nom de la charge *
          </Text>
          <TextInput
            style={[styles.input, isDark && styles.darkInput]}
            value={form.name}
            onChangeText={(text) => setForm(prev => ({ ...prev, name: text }))}
            placeholder="Ex: Assurance habitation, Impôts..."
            placeholderTextColor={isDark ? "#888" : "#999"}
          />
        </View>

        {/* Montant */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, isDark && styles.darkText]}>
            Montant *
          </Text>
          <View style={styles.amountContainer}>
            {/* ✅ CORRECTION : Utiliser le symbole de devise dynamique */}
            <TextInput
              style={[styles.input, styles.amountInput, isDark && styles.darkInput]}
              value={form.amount}
              onChangeText={handleAmountChange}
              placeholder="0,00"
              placeholderTextColor={isDark ? "#888" : "#999"}
              keyboardType="decimal-pad"
            />
          </View>
          {form.amount && (
            <Text style={[styles.hint, isDark && styles.darkSubtext]}>
              {/* ✅ CORRECTION : Utiliser formatAmount */}
              {formatDisplayAmount(form.amount)}
            </Text>
          )}
        </View>

        {/* Catégorie */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, isDark && styles.darkText]}>
            Catégorie *
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
            {expenseCategories.map((category) => (
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
        </View>

        {/* Compte associé */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, isDark && styles.darkText]}>
            Compte associé
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.accountsContainer}>
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
                {/* ✅ CORRECTION : Utiliser formatAmount pour le solde */}
                <Text style={[
                  styles.accountBalance,
                  isDark && styles.darkSubtext
                ]}>
                  {formatAmount(account.balance)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Text style={[styles.hint, isDark && styles.darkSubtext]}>
            Sélectionnez le compte pour le prélèvement automatique
          </Text>
        </View>

        {/* Prélèvement automatique */}
        <View style={styles.inputGroup}>
          <View style={styles.switchContainer}>
            <Text style={[styles.label, isDark && styles.darkText]}>
              Prélèvement automatique
            </Text>
            <TouchableOpacity
              style={[
                styles.switch,
                form.autoDeduct && styles.switchActive
              ]}
              onPress={() => setForm(prev => ({ ...prev, autoDeduct: !prev.autoDeduct }))}
            >
              <View style={[
                styles.switchThumb,
                form.autoDeduct && styles.switchThumbActive
              ]} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.hint, isDark && styles.darkSubtext]}>
            {form.autoDeduct 
              ? 'Le montant sera automatiquement débité à la date d\'échéance'
              : 'Paiement manuel requis'
            }
          </Text>
        </View>

        {/* Date d'échéance */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, isDark && styles.darkText]}>
            Date d'échéance *
          </Text>
          <TouchableOpacity 
            style={[styles.dateButton, isDark && styles.darkInput]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={[styles.dateText, isDark && styles.darkText]}>
              {form.dueDate.toLocaleDateString('fr-FR')}
            </Text>
            <Ionicons name="calendar" size={20} color={isDark ? "#fff" : "#666"} />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={form.dueDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </View>

        {/* Récurrence */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, isDark && styles.darkText]}>
            Récurrence
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recurrenceContainer}>
            {recurrenceOptions.map((recurrence) => (
              <TouchableOpacity
                key={recurrence.value}
                style={[
                  styles.recurrenceButton,
                  form.recurrence === recurrence.value && styles.recurrenceButtonSelected,
                  isDark && styles.darkRecurrenceButton
                ]}
                onPress={() => setForm(prev => ({ ...prev, recurrence: recurrence.value }))}
              >
                <Text style={[
                  styles.recurrenceText,
                  form.recurrence === recurrence.value && styles.recurrenceTextSelected,
                ]}>
                  {recurrence.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Méthode de paiement */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, isDark && styles.darkText]}>
            Méthode de paiement
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.paymentMethodsContainer}>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method}
                style={[
                  styles.paymentMethodButton,
                  form.paymentMethod === method && styles.paymentMethodButtonSelected,
                  isDark && styles.darkPaymentMethodButton
                ]}
                onPress={() => setForm(prev => ({ ...prev, paymentMethod: method }))}
              >
                <Text style={[
                  styles.paymentMethodText,
                  form.paymentMethod === method && styles.paymentMethodTextSelected,
                ]}>
                  {method}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Jours de rappel */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, isDark && styles.darkText]}>
            Rappel (jours avant)
          </Text>
          <TextInput
            style={[styles.input, isDark && styles.darkInput]}
            value={form.reminderDays}
            onChangeText={(text) => setForm(prev => ({ ...prev, reminderDays: text.replace(/[^0-9]/g, '') }))}
            placeholder="7"
            placeholderTextColor={isDark ? "#888" : "#999"}
            keyboardType="number-pad"
          />
          <Text style={[styles.hint, isDark && styles.darkSubtext]}>
            Nombre de jours avant l'échéance pour le rappel
          </Text>
        </View>

        {/* Notes */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, isDark && styles.darkText]}>
            Notes
          </Text>
          <TextInput
            style={[styles.input, styles.textArea, isDark && styles.darkInput]}
            value={form.notes}
            onChangeText={(text) => setForm(prev => ({ ...prev, notes: text }))}
            placeholder="Informations supplémentaires..."
            placeholderTextColor={isDark ? "#888" : "#999"}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
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
              (!form.name || !form.amount || !form.category) && styles.saveButtonDisabled
            ]}
            onPress={handleSave}
            disabled={loading || !form.name || !form.amount || !form.category}
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
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  subLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
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
  textArea: {
    minHeight: 80,
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
  categoriesContainer: {
    flexDirection: 'row',
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
    marginRight: 8,
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
  },
  accountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
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
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  accountText: {
    flex: 1,
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  accountTextSelected: {
    color: '#fff',
  },
  accountBalance: {
    fontSize: 12,
    color: '#666',
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
  recurrenceContainer: {
    flexDirection: 'row',
  },
  recurrenceButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
  },
  darkRecurrenceButton: {
    backgroundColor: '#333',
    borderColor: '#555',
  },
  recurrenceButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  recurrenceText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  recurrenceTextSelected: {
    color: '#fff',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  switch: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e9ecef',
    padding: 2,
  },
  switchActive: {
    backgroundColor: '#007AFF',
  },
  switchThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    transform: [{ translateX: 0 }],
  },
  switchThumbActive: {
    transform: [{ translateX: 22 }],
  },
  paymentMethodsContainer: {
    flexDirection: 'row',
  },
  paymentMethodButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
  },
  darkPaymentMethodButton: {
    backgroundColor: '#333',
    borderColor: '#555',
  },
  paymentMethodButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  paymentMethodText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  paymentMethodTextSelected: {
    color: '#fff',
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
  hint: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  darkText: {
    color: '#fff',
  },
  darkSubtext: {
    color: '#888',
  },
});

export default AddAnnualChargeScreen;