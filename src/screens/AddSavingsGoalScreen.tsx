// src/screens/AddSavingsGoalScreen.tsx - VERSION COMPLÈTEMENT CORRIGÉE AVEC DEVISE
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
import { useSavings } from '../hooks/useSavings';
import { CreateSavingsGoalData, SavingsGoal } from '../types/Savings';

interface SavingsGoalForm {
  name: string;
  targetAmount: string;
  currentAmount: string;
  targetDate: Date;
  monthlyContribution: string;
  category: SavingsGoal['category'];
  color: string;
  icon: string;
  savingsAccountId: string;
  contributionAccountId: string;
}

interface AddSavingsGoalScreenProps {
  navigation: any;
}

const AddSavingsGoalScreen: React.FC<AddSavingsGoalScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const { formatAmount } = useCurrency(); // ✅ CORRECTION: Utilisation du contexte devise
  const { createGoal } = useSavings();
  const { accounts } = useAccounts();
  
  const [form, setForm] = useState<SavingsGoalForm>({
    name: '',
    targetAmount: '',
    currentAmount: '0',
    targetDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    monthlyContribution: '',
    category: 'other',
    color: '#007AFF',
    icon: 'flag',
    savingsAccountId: '',
    contributionAccountId: '',
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const isDark = theme === 'dark';

  const savingsAccounts = accounts.filter(acc => acc.type === 'savings');
  const contributionAccounts = accounts.filter(acc => acc.type !== 'savings');

  const categories = [
    { value: 'vacation' as const, label: 'Vacances', icon: 'airplane' },
    { value: 'car' as const, label: 'Voiture', icon: 'car' },
    { value: 'house' as const, label: 'Maison', icon: 'home' },
    { value: 'emergency' as const, label: 'Urgence', icon: 'medical' },
    { value: 'education' as const, label: 'Éducation', icon: 'school' },
    { value: 'retirement' as const, label: 'Retraite', icon: 'heart' },
    { value: 'other' as const, label: 'Autre', icon: 'flag' },
  ];

  const colors = [
    '#007AFF', '#34C759', '#FF3B30', '#FF9500', '#5856D6', 
    '#AF52DE', '#FF2D55', '#32D74B', '#FFD60A'
  ];

  // ✅ CORRECTION: Nouvelle fonction de gestion des montants avec devise
  const handleAmountChange = (field: 'targetAmount' | 'currentAmount' | 'monthlyContribution', value: string) => {
    let cleanedValue = value.replace(/[^\d,.]/g, '');
    cleanedValue = cleanedValue.replace(',', '.');
    
    const parts = cleanedValue.split('.');
    if (parts.length > 2) {
      cleanedValue = parts[0] + '.' + parts.slice(1).join('');
    }
    
    setForm(prev => ({ 
      ...prev, 
      [field]: cleanedValue 
    }));
  };

  // ✅ CORRECTION: Formatage avec la devise courante
  const formatDisplayAmount = (value: string): string => {
    if (!value) return '';
    
    const num = parseFloat(value);
    if (isNaN(num)) return '';
    
    return formatAmount(num, false); // ✅ Utilise la fonction du contexte devise
  };

  // ✅ CORRECTION: Récupérer le symbole de devise
  const getCurrencySymbol = () => {
    return formatAmount(0, true).replace(/[0-9.,\s]/g, '').trim() || 'MAD';
  };

  const handleSave = async () => {
    if (!form.name || !form.targetAmount || !form.monthlyContribution || !form.savingsAccountId) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    const targetAmount = parseFloat(form.targetAmount);
    const monthlyContribution = parseFloat(form.monthlyContribution);
    const currentAmount = parseFloat(form.currentAmount || '0');

    if (isNaN(targetAmount) || targetAmount <= 0) {
      Alert.alert('Erreur', 'Le montant cible doit être un nombre positif');
      return;
    }

    if (isNaN(monthlyContribution) || monthlyContribution <= 0) {
      Alert.alert('Erreur', 'La contribution mensuelle doit être un nombre positif');
      return;
    }

    if (isNaN(currentAmount) || currentAmount < 0) {
      Alert.alert('Erreur', 'L\'épargne actuelle doit être un nombre positif ou zéro');
      return;
    }

    setLoading(true);
    try {
      const goalData: CreateSavingsGoalData = {
        name: form.name.trim(),
        targetAmount: targetAmount,
        targetDate: form.targetDate.toISOString().split('T')[0],
        monthlyContribution: monthlyContribution,
        category: form.category,
        color: form.color,
        icon: form.icon,
        savingsAccountId: form.savingsAccountId,
        contributionAccountId: form.contributionAccountId || undefined,
      };

      await createGoal(goalData);
      
      Alert.alert(
        'Succès',
        'Objectif d\'épargne créé avec succès',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Erreur création objectif:', error);
      Alert.alert('Erreur', 'Impossible de créer l\'objectif d\'épargne');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setForm(prev => ({ ...prev, targetDate: selectedDate }));
    }
  };

  const calculateMonthsRemaining = (): number => {
    if (!form.targetAmount || !form.monthlyContribution) return 0;
    
    const target = parseFloat(form.targetAmount);
    const monthly = parseFloat(form.monthlyContribution);
    const current = parseFloat(form.currentAmount || '0');
    
    if (isNaN(target) || isNaN(monthly) || monthly <= 0) return 0;
    
    const remaining = target - current;
    return Math.ceil(remaining / monthly);
  };

  const monthsRemaining = calculateMonthsRemaining();

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
            Nouvel Objectif
          </Text>
        </View>

        {/* Nom de l'objectif */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, isDark && styles.darkText]}>
            Nom de l'objectif *
          </Text>
          <TextInput
            style={[styles.input, isDark && styles.darkInput]}
            value={form.name}
            onChangeText={(text) => setForm(prev => ({ ...prev, name: text }))}
            placeholder="Ex: Achat voiture, Vacances..."
            placeholderTextColor={isDark ? "#888" : "#999"}
          />
        </View>

        {/* Montant cible */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, isDark && styles.darkText]}>
            Montant cible *
          </Text>
          <View style={styles.amountContainer}>
            <TextInput
              style={[styles.input, styles.amountInput, isDark && styles.darkInput]}
              value={form.targetAmount}
              onChangeText={(value) => handleAmountChange('targetAmount', value)}
              placeholder="0,00"
              placeholderTextColor={isDark ? "#888" : "#999"}
              keyboardType="decimal-pad"
              returnKeyType="done"
            />
          </View>
          {form.targetAmount && (
            <Text style={[styles.hint, isDark && styles.darkSubtext]}>
              {formatDisplayAmount(form.targetAmount)}
            </Text>
          )}
        </View>

        {/* Épargne actuelle */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, isDark && styles.darkText]}>
            Épargne actuelle
          </Text>
          <View style={styles.amountContainer}>
            <TextInput
              style={[styles.input, styles.amountInput, isDark && styles.darkInput]}
              value={form.currentAmount}
              onChangeText={(value) => handleAmountChange('currentAmount', value)}
              placeholder="0,00"
              placeholderTextColor={isDark ? "#888" : "#999"}
              keyboardType="decimal-pad"
              returnKeyType="done"
            />
          </View>
          {form.currentAmount && (
            <Text style={[styles.hint, isDark && styles.darkSubtext]}>
              {formatDisplayAmount(form.currentAmount)}
            </Text>
          )}
        </View>

        {/* Contribution mensuelle */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, isDark && styles.darkText]}>
            Contribution mensuelle *
          </Text>
          <View style={styles.amountContainer}>
            <TextInput
              style={[styles.input, styles.amountInput, isDark && styles.darkInput]}
              value={form.monthlyContribution}
              onChangeText={(value) => handleAmountChange('monthlyContribution', value)}
              placeholder="0,00"
              placeholderTextColor={isDark ? "#888" : "#999"}
              keyboardType="decimal-pad"
              returnKeyType="done"
            />
          </View>
          {form.monthlyContribution && (
            <Text style={[styles.hint, isDark && styles.darkSubtext]}>
              {formatDisplayAmount(form.monthlyContribution)}
            </Text>
          )}
          {monthsRemaining > 0 && (
            <Text style={[styles.hint, isDark && styles.darkSubtext]}>
              Temps estimé: {monthsRemaining} mois
            </Text>
          )}
        </View>

        {/* Date cible */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, isDark && styles.darkText]}>
            Date cible
          </Text>
          <TouchableOpacity 
            style={[styles.dateButton, isDark && styles.darkInput]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={[styles.dateText, isDark && styles.darkText]}>
              {form.targetDate.toLocaleDateString('fr-FR')}
            </Text>
            <Ionicons name="calendar" size={20} color={isDark ? "#fff" : "#666"} />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={form.targetDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}
        </View>

        {/* Compte d'épargne */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, isDark && styles.darkText]}>
            Compte d'épargne *
          </Text>
          <View style={styles.accountsContainer}>
            {savingsAccounts.map((account) => (
              <TouchableOpacity
                key={account.id}
                style={[
                  styles.accountButton,
                  form.savingsAccountId === account.id && styles.accountButtonSelected,
                  isDark && styles.darkAccountButton
                ]}
                onPress={() => setForm(prev => ({ ...prev, savingsAccountId: account.id }))}
              >
                <View style={[styles.accountColor, { backgroundColor: account.color }]} />
                <View style={styles.accountInfo}>
                  <Text style={[styles.accountName, isDark && styles.darkText]}>
                    {account.name}
                  </Text>
                  <Text style={[styles.accountBalance, isDark && styles.darkSubtext]}>
                    {formatAmount(account.balance, false)} {/* ✅ CORRECTION: Format devise */}
                  </Text>
                </View>
                {form.savingsAccountId === account.id && (
                  <Ionicons name="checkmark-circle" size={20} color="#007AFF" />
                )}
              </TouchableOpacity>
            ))}
          </View>
          {savingsAccounts.length === 0 && (
            <Text style={[styles.warningText, isDark && styles.darkSubtext]}>
              Aucun compte d'épargne trouvé. Créez d'abord un compte d'épargne.
            </Text>
          )}
        </View>

        {/* Compte source des contributions */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, isDark && styles.darkText]}>
            Compte source des contributions
          </Text>
          <View style={styles.accountsContainer}>
            {contributionAccounts.map((account) => (
              <TouchableOpacity
                key={account.id}
                style={[
                  styles.accountButton,
                  form.contributionAccountId === account.id && styles.accountButtonSelected,
                  isDark && styles.darkAccountButton
                ]}
                onPress={() => setForm(prev => ({ ...prev, contributionAccountId: account.id }))}
              >
                <View style={[styles.accountColor, { backgroundColor: account.color }]} />
                <View style={styles.accountInfo}>
                  <Text style={[styles.accountName, isDark && styles.darkText]}>
                    {account.name}
                  </Text>
                  <Text style={[styles.accountBalance, isDark && styles.darkSubtext]}>
                    {formatAmount(account.balance, false)} {/* ✅ CORRECTION: Format devise */}
                  </Text>
                </View>
                {form.contributionAccountId === account.id && (
                  <Ionicons name="checkmark-circle" size={20} color="#007AFF" />
                )}
              </TouchableOpacity>
            ))}
          </View>
          <Text style={[styles.hint, isDark && styles.darkSubtext]}>
            Sélectionnez le compte depuis lequel les fonds seront transférés
          </Text>
        </View>

        {/* Catégorie */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, isDark && styles.darkText]}>
            Catégorie
          </Text>
          <View style={styles.categoriesContainer}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.value}
                style={[
                  styles.categoryButton,
                  form.category === category.value && styles.categoryButtonSelected,
                  isDark && styles.darkCategoryButton
                ]}
                onPress={() => setForm(prev => ({ 
                  ...prev, 
                  category: category.value,
                  icon: category.icon 
                }))}
              >
                <Ionicons 
                  name={category.icon as any} 
                  size={20} 
                  color={form.category === category.value ? '#fff' : '#666'} 
                />
                <Text style={[
                  styles.categoryText,
                  form.category === category.value && styles.categoryTextSelected,
                  isDark && styles.darkText
                ]}>
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Couleur */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, isDark && styles.darkText]}>
            Couleur
          </Text>
          <View style={styles.colorsContainer}>
            {colors.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorButton,
                  { backgroundColor: color },
                  form.color === color && styles.colorButtonSelected
                ]}
                onPress={() => setForm(prev => ({ ...prev, color }))}
              >
                {form.color === color && (
                  <Ionicons name="checkmark" size={16} color="#fff" />
                )}
              </TouchableOpacity>
            ))}
          </View>
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
              (loading || !form.name || !form.targetAmount || !form.monthlyContribution || !form.savingsAccountId) && styles.saveButtonDisabled
            ]}
            onPress={handleSave}
            disabled={loading || !form.name || !form.targetAmount || !form.monthlyContribution || !form.savingsAccountId}
          >
            <Text style={styles.saveButtonText}>
              {loading ? 'Création...' : 'Créer l\'objectif'}
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
  accountsContainer: {
    gap: 8,
  },
  accountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 12,
    marginBottom: 4,
  },
  darkAccountButton: {
    backgroundColor: '#2c2c2e',
    borderColor: '#444',
  },
  accountButtonSelected: {
    borderColor: '#007AFF',
    borderWidth: 2,
    backgroundColor: '#F0F8FF',
  },
  accountColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  accountBalance: {
    fontSize: 12,
    color: '#666',
  },
  warningText: {
    fontSize: 12,
    color: '#FF3B30',
    fontStyle: 'italic',
    marginTop: 4,
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
    paddingVertical: 12,
    borderRadius: 12,
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
  colorsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorButtonSelected: {
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
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
});

export default AddSavingsGoalScreen;