// src/components/debts/DebtForm.tsx - VERSION CORRIGÉE AVEC MAD
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useCurrency } from '../../context/CurrencyContext'; // ✅ AJOUT
import { useTheme } from '../../context/ThemeContext';
import { useAccounts } from '../../hooks/useAccounts';
import { CreateDebtData, Debt, DEBT_TYPES, DebtType } from '../../types/Debt';

interface DebtFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (debtData: CreateDebtData) => void;
  editingDebt?: Debt | null;
}

export const DebtForm = ({ visible, onClose, onSubmit, editingDebt }: DebtFormProps) => {
  const { theme } = useTheme();
  const { formatAmount } = useCurrency(); // ✅ AJOUT
  const { accounts } = useAccounts();
  const isDark = theme === 'dark';

  const [formData, setFormData] = useState({
    name: editingDebt?.name || '',
    creditor: editingDebt?.creditor || '',
    initialAmount: editingDebt?.initialAmount.toString() || '',
    interestRate: editingDebt?.interestRate.toString() || '0',
    monthlyPayment: editingDebt?.monthlyPayment.toString() || '',
    dueDate: editingDebt?.dueDate || new Date().toISOString().split('T')[0],
    startDate: editingDebt?.startDate || new Date().toISOString().split('T')[0],
    type: (editingDebt?.type || 'personal') as DebtType,
    paymentAccountId: editingDebt?.paymentAccountId || '',
    autoPay: editingDebt?.autoPay || false,
    category: editingDebt?.category || 'Prêt personnel',
    color: editingDebt?.color || '#007AFF',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);

  // ✅ CORRECTION : Utiliser DEBT_TYPES depuis les types
  const debtTypes = DEBT_TYPES;

  const categories = [
    'Prêt personnel',
    'Hypothèque', 
    'Voiture',
    'Éducation',
    'Carte de crédit',
    'Médical',
    'Familial',
    'Autre'
  ];

  const colors = [
    '#007AFF', '#34C759', '#FF3B30', '#FF9500', '#5856D6', 
    '#AF52DE', '#FF2D55', '#32D74B', '#FFD60A'
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTypeChange = (value: DebtType) => {
    setFormData(prev => ({
      ...prev,
      type: value,
    }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      category: value,
    }));
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        dueDate: selectedDate.toISOString().split('T')[0],
      }));
    }
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        startDate: selectedDate.toISOString().split('T')[0],
      }));
    }
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir un nom pour la dette');
      return false;
    }

    if (!formData.initialAmount || parseFloat(formData.initialAmount) <= 0) {
      Alert.alert('Erreur', 'Le montant initial doit être supérieur à 0');
      return false;
    }

    if (!formData.monthlyPayment || parseFloat(formData.monthlyPayment) <= 0) {
      Alert.alert('Erreur', 'Le paiement mensuel doit être supérieur à 0');
      return false;
    }

    if (!formData.dueDate) {
      Alert.alert('Erreur', 'Veuillez sélectionner une date d\'échéance');
      return false;
    }

    if (!formData.startDate) {
      Alert.alert('Erreur', 'Veuillez sélectionner une date de début');
      return false;
    }

    // Validation de la date d'échéance
    const dueDate = new Date(formData.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dueDate < today) {
      Alert.alert('Erreur', 'La date d\'échéance ne peut pas être dans le passé');
      return false;
    }

    // Validation de la date de début
    const startDate = new Date(formData.startDate);
    if (startDate > dueDate) {
      Alert.alert('Erreur', 'La date de début ne peut pas être après la date d\'échéance');
      return false;
    }

    // Validation du taux d'intérêt
    const interestRate = parseFloat(formData.interestRate);
    if (isNaN(interestRate) || interestRate < 0) {
      Alert.alert('Erreur', 'Le taux d\'intérêt doit être un nombre positif');
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const debtData: CreateDebtData = {
      name: formData.name.trim(),
      creditor: formData.creditor.trim(),
      initialAmount: parseFloat(formData.initialAmount),
      interestRate: parseFloat(formData.interestRate) || 0,
      monthlyPayment: parseFloat(formData.monthlyPayment),
      dueDate: formData.dueDate,
      startDate: formData.startDate,
      type: formData.type,
      paymentAccountId: formData.paymentAccountId || undefined,
      autoPay: formData.autoPay,
      category: formData.category,
      color: formData.color,
    };

    onSubmit(debtData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: '',
      creditor: '',
      initialAmount: '',
      interestRate: '0',
      monthlyPayment: '',
      dueDate: new Date().toISOString().split('T')[0],
      startDate: new Date().toISOString().split('T')[0],
      type: 'personal',
      paymentAccountId: '',
      autoPay: false,
      category: 'Prêt personnel',
      color: '#007AFF',
    });
    setShowDatePicker(false);
    setShowStartDatePicker(false);
    onClose();
  };

  // ✅ CORRECTION : Utiliser formatAmount pour l'affichage
  const formatCurrencyDisplay = (amount: string): string => {
    const num = parseFloat(amount);
    return isNaN(num) ? '' : formatAmount(num);
  };

  const formatPercentage = (rate: string): string => {
    const num = parseFloat(rate);
    return isNaN(num) ? '' : `${num.toFixed(2)}%`;
  };

  const calculateMinimumPayment = (): string => {
    const amount = parseFloat(formData.initialAmount);
    const rate = parseFloat(formData.interestRate) / 100 / 12;
    
    if (isNaN(amount) || amount <= 0) return '';
    
    // Calcul basique de la mensualité minimale (1% du principal + intérêts)
    const minimumPayment = amount * 0.01 + (amount * rate);
    return minimumPayment.toFixed(2);
  };

  // ✅ COMPOSANT D'INFORMATION SUR LE SYSTÈME D'ÉCHÉANCES
  const EligibilityInfoMessage = () => (
    <View style={styles.infoMessage}>
      <Text style={styles.infoIcon}>💡</Text>
      <Text style={styles.infoText}>
        Le paiement sera uniquement autorisé pendant le mois d'échéance
      </Text>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={[styles.container, isDark && styles.darkContainer]}>
        <View style={styles.header}>
          <Text style={[styles.title, isDark && styles.darkText]}>
            {editingDebt ? 'Modifier la dette' : 'Nouvelle dette'}
          </Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Text style={[styles.closeButtonText, isDark && styles.darkText]}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
          {/* Nom de la dette */}
          <View style={styles.field}>
            <Text style={[styles.label, isDark && styles.darkText]}>Nom de la dette *</Text>
            <TextInput
              style={[styles.input, isDark && styles.darkInput]}
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              placeholder="Ex: Prêt voiture, Carte de crédit..."
              placeholderTextColor={isDark ? '#888' : '#999'}
            />
          </View>

          {/* Créancier */}
          <View style={styles.field}>
            <Text style={[styles.label, isDark && styles.darkText]}>Créancier</Text>
            <TextInput
              style={[styles.input, isDark && styles.darkInput]}
              value={formData.creditor}
              onChangeText={(value) => handleInputChange('creditor', value)}
              placeholder="Ex: Ma Banque, Société Générale..."
              placeholderTextColor={isDark ? '#888' : '#999'}
            />
          </View>

          {/* Type de dette */}
          <View style={styles.field}>
            <Text style={[styles.label, isDark && styles.darkText]}>Type de dette *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeContainer}>
              {debtTypes.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.typeButton,
                    formData.type === type.value && styles.typeButtonActive,
                    formData.type === type.value && { backgroundColor: isDark ? '#007AFF' : '#007AFF' }
                  ]}
                  onPress={() => handleTypeChange(type.value)}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      formData.type === type.value && styles.typeButtonTextActive
                    ]}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Catégorie */}
          <View style={styles.field}>
            <Text style={[styles.label, isDark && styles.darkText]}>Catégorie</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    formData.category === category && styles.categoryButtonActive,
                    isDark && styles.darkCategoryButton
                  ]}
                  onPress={() => handleCategoryChange(category)}
                >
                  <Text style={[
                    styles.categoryText,
                    formData.category === category && styles.categoryTextActive,
                    isDark && styles.darkText
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Montant initial */}
          <View style={styles.field}>
            <Text style={[styles.label, isDark && styles.darkText]}>Montant initial *</Text>
            <TextInput
              style={[styles.input, isDark && styles.darkInput]}
              value={formData.initialAmount}
              onChangeText={(value) => handleInputChange('initialAmount', value.replace(/[^0-9.,]/g, '').replace(',', '.'))}
              placeholder="0.00"
              placeholderTextColor={isDark ? '#888' : '#999'}
              keyboardType="decimal-pad"
            />
            {formData.initialAmount && (
              <Text style={[styles.hint, isDark && styles.darkSubtext]}>
                {/* ✅ CORRECTION : Utiliser formatAmount */}
                {formatCurrencyDisplay(formData.initialAmount)}
              </Text>
            )}
          </View>

          {/* Taux d'intérêt */}
          <View style={styles.field}>
            <Text style={[styles.label, isDark && styles.darkText]}>Taux d'intérêt annuel (%)</Text>
            <TextInput
              style={[styles.input, isDark && styles.darkInput]}
              value={formData.interestRate}
              onChangeText={(value) => handleInputChange('interestRate', value.replace(/[^0-9.,]/g, '').replace(',', '.'))}
              placeholder="0.00"
              placeholderTextColor={isDark ? '#888' : '#999'}
              keyboardType="decimal-pad"
            />
            {formData.interestRate && (
              <Text style={[styles.hint, isDark && styles.darkSubtext]}>
                {formatPercentage(formData.interestRate)}
              </Text>
            )}
          </View>

          {/* Paiement mensuel */}
          <View style={styles.field}>
            <Text style={[styles.label, isDark && styles.darkText]}>Paiement mensuel *</Text>
            <TextInput
              style={[styles.input, isDark && styles.darkInput]}
              value={formData.monthlyPayment}
              onChangeText={(value) => handleInputChange('monthlyPayment', value.replace(/[^0-9.,]/g, '').replace(',', '.'))}
              placeholder="0.00"
              placeholderTextColor={isDark ? '#888' : '#999'}
              keyboardType="decimal-pad"
            />
            {formData.monthlyPayment && (
              <Text style={[styles.hint, isDark && styles.darkSubtext]}>
                {/* ✅ CORRECTION : Utiliser formatAmount */}
                {formatCurrencyDisplay(formData.monthlyPayment)}
              </Text>
            )}
            {formData.initialAmount && formData.interestRate && (
              <Text style={[styles.hint, isDark && styles.darkSubtext]}>
                {/* ✅ CORRECTION : Utiliser formatAmount */}
                Paiement minimum recommandé: {formatAmount(parseFloat(calculateMinimumPayment()) || 0)}
              </Text>
            )}
          </View>

          {/* Date de début */}
          <View style={styles.field}>
            <Text style={[styles.label, isDark && styles.darkText]}>Date de début *</Text>
            <TouchableOpacity 
              style={[styles.dateButton, isDark && styles.darkInput]}
              onPress={() => setShowStartDatePicker(true)}
            >
              <Text style={[styles.dateText, isDark && styles.darkText]}>
                {new Date(formData.startDate).toLocaleDateString('fr-FR')}
              </Text>
              <Text style={[styles.dateIcon, isDark && styles.darkText]}>📅</Text>
            </TouchableOpacity>
            {showStartDatePicker && (
              <DateTimePicker
                value={new Date(formData.startDate)}
                mode="date"
                display="default"
                onChange={handleStartDateChange}
                maximumDate={new Date(formData.dueDate)}
              />
            )}
          </View>

          {/* Date d'échéance */}
          <View style={styles.field}>
            <Text style={[styles.label, isDark && styles.darkText]}>Date d'échéance *</Text>
            <TouchableOpacity 
              style={[styles.dateButton, isDark && styles.darkInput]}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={[styles.dateText, isDark && styles.darkText]}>
                {new Date(formData.dueDate).toLocaleDateString('fr-FR')}
              </Text>
              <Text style={[styles.dateIcon, isDark && styles.darkText]}>📅</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={new Date(formData.dueDate)}
                mode="date"
                display="default"
                onChange={handleDateChange}
                minimumDate={new Date(formData.startDate)}
              />
            )}
            
            {/* ✅ MESSAGE D'INFORMATION SUR LES ÉCHÉANCES */}
            <EligibilityInfoMessage />
            
            <Text style={[styles.hint, isDark && styles.darkSubtext]}>
              Mois d'échéance: {new Date(formData.dueDate).toISOString().slice(0, 7)}
              {'\n'}
              La dette ne pourra être payée qu'à partir de cette date
            </Text>
          </View>

          {/* Couleur */}
          <View style={styles.field}>
            <Text style={[styles.label, isDark && styles.darkText]}>Couleur</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorsContainer}>
              {colors.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorButton,
                    { backgroundColor: color },
                    formData.color === color && styles.colorButtonSelected
                  ]}
                  onPress={() => handleInputChange('color', color)}
                >
                  {formData.color === color && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Compte de paiement */}
          <View style={styles.field}>
            <Text style={[styles.label, isDark && styles.darkText]}>Compte de paiement</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.accountsContainer}>
              {accounts.map((account) => (
                <TouchableOpacity
                  key={account.id}
                  style={[
                    styles.accountButton,
                    formData.paymentAccountId === account.id && styles.accountButtonActive,
                    isDark && styles.darkAccountButton
                  ]}
                  onPress={() => handleInputChange('paymentAccountId', account.id)}
                >
                  <View style={[styles.accountColor, { backgroundColor: account.color }]} />
                  <View style={styles.accountInfo}>
                    <Text style={[
                      styles.accountText,
                      formData.paymentAccountId === account.id && styles.accountTextActive,
                      isDark && styles.darkText
                    ]}>
                      {account.name}
                    </Text>
                    {/* ✅ CORRECTION : Utiliser formatAmount pour le solde */}
                    <Text style={[styles.accountBalance, isDark && styles.darkSubtext]}>
                      {formatAmount(account.balance)}
                    </Text>
                  </View>
                  {formData.paymentAccountId === account.id && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Text style={[styles.hint, isDark && styles.darkSubtext]}>
              Sélectionnez le compte utilisé pour les paiements
            </Text>
          </View>

          {/* Paiement automatique */}
          <View style={styles.field}>
            <View style={styles.switchContainer}>
              <Text style={[styles.label, isDark && styles.darkText]}>Paiement automatique</Text>
              <TouchableOpacity
                style={[
                  styles.switch,
                  formData.autoPay && styles.switchActive
                ]}
                onPress={() => handleInputChange('autoPay', !formData.autoPay)}
              >
                <View style={[
                  styles.switchThumb,
                  formData.autoPay && styles.switchThumbActive
                ]} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.hint, isDark && styles.darkSubtext]}>
              {formData.autoPay 
                ? 'Les paiements seront effectués automatiquement à la date d\'échéance' 
                : 'Paiements manuels requis'
              }
            </Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={handleClose}
          >
            <Text style={styles.cancelButtonText}>Annuler</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.submitButton]}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>
              {editingDebt ? 'Modifier' : 'Créer'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#1c1c1e',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  darkText: {
    color: '#fff',
  },
  darkSubtext: {
    color: '#888',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  form: {
    flex: 1,
    padding: 20,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  darkInput: {
    borderColor: '#38383a',
    backgroundColor: '#2c2c2e',
    color: '#fff',
  },
  typeContainer: {
    flexDirection: 'row',
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  typeButtonActive: {
    backgroundColor: '#007AFF',
  },
  typeButtonText: {
    fontSize: 14,
    color: '#666',
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  categoriesContainer: {
    flexDirection: 'row',
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
  },
  darkCategoryButton: {
    backgroundColor: '#333',
    borderColor: '#555',
  },
  categoryButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#fff',
  },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  dateText: {
    fontSize: 16,
    color: '#000',
  },
  dateIcon: {
    fontSize: 16,
  },
  colorsContainer: {
    flexDirection: 'row',
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    marginRight: 8,
  },
  colorButtonSelected: {
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  accountsContainer: {
    flexDirection: 'row',
  },
  accountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    marginRight: 8,
    minWidth: 200,
  },
  darkAccountButton: {
    backgroundColor: '#2c2c2e',
    borderColor: '#444',
  },
  accountButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
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
  accountText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  accountTextActive: {
    color: '#fff',
  },
  accountBalance: {
    fontSize: 12,
    color: '#666',
  },
  checkmark: {
    color: '#fff',
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  hint: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f8f9fa',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  submitButton: {
    backgroundColor: '#007AFF',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  // Styles pour le message d'information
  infoMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    gap: 8,
  },
  infoIcon: {
    fontSize: 16,
  },
  infoText: {
    fontSize: 12,
    color: '#007AFF',
    flex: 1,
    fontStyle: 'italic',
  },
});

export default DebtForm;