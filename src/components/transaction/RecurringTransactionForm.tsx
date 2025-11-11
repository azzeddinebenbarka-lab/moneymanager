// src/components/transaction/RecurringTransactionForm.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAccounts } from '../../hooks/useAccounts';
import { useCategories } from '../../hooks/useCategories';
import { RecurringTransaction } from '../../types';

interface RecurringTransactionFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (transaction: Omit<RecurringTransaction, 'id' | 'createdAt'>) => void;
  editingTransaction?: RecurringTransaction | null;
}

const FREQUENCY_OPTIONS = [
  { value: 'daily', label: 'Quotidienne', icon: 'calendar' },
  { value: 'weekly', label: 'Hebdomadaire', icon: 'calendar' },
  { value: 'monthly', label: 'Mensuelle', icon: 'calendar' },
  { value: 'yearly', label: 'Annuelle', icon: 'calendar' },
];

const RecurringTransactionForm: React.FC<RecurringTransactionFormProps> = ({
  visible,
  onClose,
  onSubmit,
  editingTransaction,
}) => {
  const { theme } = useTheme();
  const { accounts, loading: accountsLoading } = useAccounts();
  const { categories, loading: categoriesLoading } = useCategories();
  const isDark = theme === 'dark';

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense' as 'expense' | 'income',
    category: '',
    accountId: '',
    frequency: 'monthly' as 'daily' | 'weekly' | 'monthly' | 'yearly',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    isActive: true,
  });

  const [filteredCategories, setFilteredCategories] = useState(categories);

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        description: editingTransaction.description,
        amount: Math.abs(editingTransaction.amount).toString(),
        type: editingTransaction.type,
        category: editingTransaction.category,
        accountId: editingTransaction.accountId,
        frequency: editingTransaction.frequency,
        startDate: editingTransaction.startDate,
        endDate: editingTransaction.endDate || '',
        isActive: editingTransaction.isActive,
      });
    } else {
      setFormData({
        description: '',
        amount: '',
        type: 'expense',
        category: '',
        accountId: '',
        frequency: 'monthly',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        isActive: true,
      });
    }
  }, [editingTransaction, visible]);

  useEffect(() => {
    const filtered = categories.filter(cat => cat.type === formData.type);
    setFilteredCategories(filtered);
    
    if (formData.category) {
      const currentCategory = categories.find(cat => cat.id === formData.category);
      if (currentCategory && currentCategory.type !== formData.type) {
        setFormData(prev => ({ ...prev, category: '' }));
      }
    }
  }, [formData.type, categories]);

  const handleSubmit = () => {
    if (!formData.description.trim()) {
      alert('Veuillez saisir une description');
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert('Veuillez saisir un montant valide');
      return;
    }

    if (!formData.category) {
      alert('Veuillez sélectionner une catégorie');
      return;
    }

    if (!formData.accountId) {
      alert('Veuillez sélectionner un compte');
      return;
    }

    const transactionData: Omit<RecurringTransaction, 'id' | 'createdAt'> = {
      description: formData.description.trim(),
      amount: parseFloat(formData.amount),
      type: formData.type,
      category: formData.category,
      accountId: formData.accountId,
      frequency: formData.frequency,
      startDate: formData.startDate,
      endDate: formData.endDate || undefined,
      isActive: formData.isActive,
    };

    onSubmit(transactionData);
    onClose();
  };

  if (accountsLoading || categoriesLoading) {
    return (
      <Modal visible={visible} animationType="slide">
        <View style={[styles.container, isDark && styles.darkContainer, styles.center]}>
          <Text style={[styles.loadingText, isDark && styles.darkText]}>
            Chargement...
          </Text>
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={[styles.container, isDark && styles.darkContainer]}>
        <View style={[styles.header, isDark && styles.darkHeader]}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={isDark ? '#fff' : '#000'} />
          </TouchableOpacity>
          <Text style={[styles.title, isDark && styles.darkText]}>
            {editingTransaction ? 'Modifier' : 'Nouvelle'} transaction récurrente
          </Text>
          <View style={styles.closeButton} />
        </View>

        <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, isDark && styles.darkText]}>Description</Text>
            <TextInput
              style={[styles.input, isDark && styles.darkInput]}
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              placeholder="Description de la transaction"
              placeholderTextColor={isDark ? '#666' : '#999'}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, isDark && styles.darkText]}>Type</Text>
            <View style={styles.typeContainer}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  formData.type === 'expense' && styles.typeButtonSelected,
                  isDark && styles.darkTypeButton,
                ]}
                onPress={() => setFormData({ ...formData, type: 'expense' })}
              >
                <Ionicons 
                  name="arrow-up" 
                  size={20} 
                  color={formData.type === 'expense' ? '#fff' : '#FF3B30'} 
                />
                <Text style={[
                  styles.typeButtonText,
                  formData.type === 'expense' && styles.typeButtonTextSelected,
                ]}>
                  Dépense
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeButton,
                  formData.type === 'income' && styles.typeButtonSelected,
                  isDark && styles.darkTypeButton,
                ]}
                onPress={() => setFormData({ ...formData, type: 'income' })}
              >
                <Ionicons 
                  name="arrow-down" 
                  size={20} 
                  color={formData.type === 'income' ? '#fff' : '#34C759'} 
                />
                <Text style={[
                  styles.typeButtonText,
                  formData.type === 'income' && styles.typeButtonTextSelected,
                ]}>
                  Revenu
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, isDark && styles.darkText]}>Montant</Text>
            <TextInput
              style={[styles.input, isDark && styles.darkInput]}
              value={formData.amount}
              onChangeText={(text) => setFormData({ ...formData, amount: text.replace(',', '.') })}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor={isDark ? '#666' : '#999'}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, isDark && styles.darkText]}>Catégorie</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
              {filteredCategories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryButton,
                    formData.category === category.id && styles.categoryButtonSelected,
                    isDark && styles.darkCategoryButton,
                    { borderLeftColor: category.color }
                  ]}
                  onPress={() => setFormData({ ...formData, category: category.id })}
                >
                  <Ionicons 
                    name={category.icon as any} 
                    size={16} 
                    color={formData.category === category.id ? '#fff' : category.color} 
                  />
                  <Text style={[
                    styles.categoryButtonText,
                    formData.category === category.id && styles.categoryButtonTextSelected,
                  ]}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, isDark && styles.darkText]}>Compte</Text>
            {accounts.map((account) => (
              <TouchableOpacity
                key={account.id}
                style={[
                  styles.accountButton,
                  formData.accountId === account.id && styles.accountButtonSelected,
                  isDark && styles.darkAccountButton,
                ]}
                onPress={() => setFormData({ ...formData, accountId: account.id })}
              >
                <View style={[styles.colorIndicator, { backgroundColor: account.color }]} />
                <Text style={[
                  styles.accountButtonText,
                  formData.accountId === account.id && styles.accountButtonTextSelected,
                  isDark && styles.darkText,
                ]}>
                  {account.name}
                </Text>
                <Text style={[
                  styles.accountBalance,
                  isDark && styles.darkSubtext,
                ]}>
                  {account.balance.toFixed(2)} €
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, isDark && styles.darkText]}>Fréquence</Text>
            <View style={styles.frequencyGrid}>
              {FREQUENCY_OPTIONS.map((frequency) => (
                <TouchableOpacity
                  key={frequency.value}
                  style={[
                    styles.frequencyButton,
                    formData.frequency === frequency.value && styles.frequencyButtonSelected,
                    isDark && styles.darkFrequencyButton,
                  ]}
                  onPress={() => setFormData({ ...formData, frequency: frequency.value as any })}
                >
                  <Text style={[
                    styles.frequencyButtonText,
                    formData.frequency === frequency.value && styles.frequencyButtonTextSelected,
                    isDark && styles.darkText,
                  ]}>
                    {frequency.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, isDark && styles.darkText]}>Date de début</Text>
            <TextInput
              style={[styles.input, isDark && styles.darkInput]}
              value={formData.startDate}
              onChangeText={(text) => setFormData({ ...formData, startDate: text })}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={isDark ? '#666' : '#999'}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, isDark && styles.darkText]}>
              Date de fin (optionnelle)
            </Text>
            <TextInput
              style={[styles.input, isDark && styles.darkInput]}
              value={formData.endDate}
              onChangeText={(text) => setFormData({ ...formData, endDate: text })}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={isDark ? '#666' : '#999'}
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.switchContainer}>
              <Text style={[styles.label, isDark && styles.darkText]}>Transaction active</Text>
              <TouchableOpacity
                style={[
                  styles.switch,
                  formData.isActive && styles.switchActive,
                  isDark && styles.darkSwitch,
                ]}
                onPress={() => setFormData({ ...formData, isActive: !formData.isActive })}
              >
                <View style={[
                  styles.switchThumb,
                  formData.isActive && styles.switchThumbActive,
                ]} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.helperText, isDark && styles.darkSubtext]}>
              {formData.isActive 
                ? 'La transaction sera traitée automatiquement' 
                : 'La transaction est suspendue'
              }
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.submitButton,
              (!formData.description || !formData.amount || !formData.category || !formData.accountId) && 
              styles.submitButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={!formData.description || !formData.amount || !formData.category || !formData.accountId}
          >
            <Text style={styles.submitButtonText}>
              {editingTransaction ? 'Modifier' : 'Créer'} la transaction récurrente
            </Text>
          </TouchableOpacity>

          <View style={styles.spacer} />
        </ScrollView>
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
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  darkHeader: {
    borderBottomColor: '#38383a',
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  form: {
    flex: 1,
    padding: 16,
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
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#000',
  },
  darkInput: {
    backgroundColor: '#2c2c2e',
    borderColor: '#38383a',
    color: '#fff',
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    gap: 8,
  },
  darkTypeButton: {
    backgroundColor: '#2c2c2e',
    borderColor: '#38383a',
  },
  typeButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  typeButtonTextSelected: {
    color: '#fff',
  },
  categoriesContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderLeftWidth: 4,
    gap: 8,
  },
  darkCategoryButton: {
    backgroundColor: '#2c2c2e',
    borderColor: '#38383a',
  },
  categoryButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  categoryButtonTextSelected: {
    color: '#fff',
  },
  accountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 8,
  },
  darkAccountButton: {
    backgroundColor: '#2c2c2e',
    borderColor: '#38383a',
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
  accountButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  accountButtonTextSelected: {
    color: '#fff',
  },
  accountBalance: {
    fontSize: 14,
    color: '#666',
  },
  frequencyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  frequencyButton: {
    flex: 1,
    minWidth: '48%',
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  darkFrequencyButton: {
    backgroundColor: '#2c2c2e',
    borderColor: '#38383a',
  },
  frequencyButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  frequencyButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  frequencyButtonTextSelected: {
    color: '#fff',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  switch: {
    width: 50,
    height: 28,
    backgroundColor: '#ccc',
    borderRadius: 14,
    padding: 2,
    justifyContent: 'center',
  },
  darkSwitch: {
    backgroundColor: '#38383a',
  },
  switchActive: {
    backgroundColor: '#34C759',
  },
  switchThumb: {
    width: 24,
    height: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    transform: [{ translateX: 0 }],
  },
  switchThumbActive: {
    transform: [{ translateX: 22 }],
  },
  helperText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  spacer: {
    height: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  darkText: {
    color: '#fff',
  },
  darkSubtext: {
    color: '#888',
  },
});

export default RecurringTransactionForm;