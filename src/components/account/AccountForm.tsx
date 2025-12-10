// src/components/account/AccountForm.tsx - VERSION CORRIGÉE
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
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
import { useLanguage } from '../../context/LanguageContext';
import { useDesignSystem } from '../../context/ThemeContext';
import { Account, ACCOUNT_TYPES } from '../../types';

interface AccountFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (accountData: Omit<Account, 'id' | 'createdAt'>) => Promise<void>;
  editingAccount?: Account;
}

const AccountForm: React.FC<AccountFormProps> = ({
  visible,
  onClose,
  onSubmit,
  editingAccount,
}) => {
  const { colors } = useDesignSystem();
  const { t } = useLanguage();

  const [form, setForm] = useState({
    name: '',
    type: 'cash' as Account['type'],
    balance: '',
    currency: 'MAD',
    color: '#007AFF',
    icon: 'wallet',
    isActive: true,
    userId: 'default-user',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingAccount) {
      setForm({
        name: editingAccount.name,
        type: editingAccount.type,
        balance: editingAccount.balance.toString(),
        currency: editingAccount.currency,
        color: editingAccount.color,
        icon: editingAccount.icon || 'wallet',
        isActive: editingAccount.isActive !== false,
        userId: editingAccount.userId || 'default-user',
      });
    } else {
      setForm({
        name: '',
        type: 'cash',
        balance: '',
        currency: 'MAD',
        color: '#007AFF',
        icon: 'wallet',
        isActive: true,
        userId: 'default-user',
      });
    }
  }, [editingAccount, visible]);

  const accountColors = [
    '#007AFF', '#34C759', '#FF3B30', '#FF9500', '#5856D6',
    '#AF52DE', '#FF2D55', '#32D74B', '#FFD60A', '#5AC8FA',
  ];

  const handleAmountChange = (value: string) => {
    let cleanedValue = value.replace(/[^\d,.]/g, '');
    cleanedValue = cleanedValue.replace(',', '.');
    
    const parts = cleanedValue.split('.');
    if (parts.length > 2) {
      cleanedValue = parts[0] + '.' + parts.slice(1).join('');
    }
    
    setForm(prev => ({ ...prev, balance: cleanedValue }));
  };

  const formatDisplayAmount = (value: string): string => {
    if (!value) return '';
    
    const num = parseFloat(value);
    if (isNaN(num)) return '';
    
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: form.currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      Alert.alert(t.error, t.accountNameRequired);
      return;
    }

    if (!form.balance) {
      Alert.alert(t.error, t.initialBalanceRequired);
      return;
    }

    const balance = parseFloat(form.balance);
    if (isNaN(balance)) {
      Alert.alert(t.error, t.invalidBalance);
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        name: form.name.trim(),
        type: form.type,
        balance: balance,
        currency: form.currency,
        color: form.color,
        icon: form.icon,
        isActive: form.isActive,
        userId: form.userId,
      });
      
      onClose();
    } catch (error) {
      console.error('Error submitting account form:', error);
      Alert.alert(t.error, t.accountSaveError);
    } finally {
      setLoading(false);
    }
  };

  const getAccountTypeIcon = (type: string): string => {
    const accountType = ACCOUNT_TYPES.find(t => t.value === type);
    return accountType?.icon || 'wallet';
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} disabled={loading}>
            <Text style={[styles.cancelText, { color: colors.text.primary }]}>
              {t.cancel}
            </Text>
          </TouchableOpacity>
          
          <Text style={[styles.title, { color: colors.text.primary }]}>
            {editingAccount ? t.editAccount : t.newAccount}
          </Text>
          
          <TouchableOpacity onPress={handleSubmit} disabled={loading}>
            <Text style={[styles.saveText, loading && styles.saveTextDisabled]}>
              {loading ? '...' : t.save}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Nom du compte */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text.primary }]}>
              {t.accountNameLabel}
            </Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background.card, color: colors.text.primary, borderColor: colors.border.primary }]}
              value={form.name}
              onChangeText={(text) => setForm(prev => ({ ...prev, name: text }))}
              placeholder={t.accountNamePlaceholder}
              placeholderTextColor={colors.text.disabled}
              editable={!loading}
            />
          </View>

          {/* Type de compte */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text.primary }]}>
              {t.accountTypeLabelRequired}
            </Text>
            <View style={styles.typesContainer}>
              {ACCOUNT_TYPES.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.typeButton,
                    form.type === type.value && styles.typeButtonSelected,
                    { backgroundColor: form.type === type.value ? colors.primary[500] + '20' : colors.background.card, borderColor: colors.border.primary }
                  ]}
                  onPress={() => setForm(prev => ({ 
                    ...prev, 
                    type: type.value as Account['type'],
                    icon: type.icon
                  }))}
                  disabled={loading}
                >
                  <Ionicons 
                    name={type.icon as any} 
                    size={24} 
                    color={form.type === type.value ? '#007AFF' : colors.text.secondary} 
                  />
                  <Text style={[
                    styles.typeText,
                    form.type === type.value && styles.typeTextSelected,
                    { color: form.type === type.value ? colors.primary[500] : colors.text.primary }
                  ]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Solde initial */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text.primary }]}>
              {t.initialBalanceLabel}
            </Text>
            <View style={styles.amountContainer}>
              <TextInput
                style={[styles.input, styles.amountInput, { backgroundColor: colors.background.card, color: colors.text.primary, borderColor: colors.border.primary }]}
                value={form.balance}
                onChangeText={handleAmountChange}
                placeholder={t.balancePlaceholder}
                placeholderTextColor={colors.text.disabled}
                keyboardType="decimal-pad"
                returnKeyType="done"
                editable={!loading}
              />
            </View>
            {form.balance && (
              <Text style={[styles.hint, { color: colors.text.secondary }]}>
                {formatDisplayAmount(form.balance)}
              </Text>
            )}
          </View>

          {/* Devise */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text.primary }]}>
              {t.currencyLabel}
            </Text>
            <View style={styles.currenciesContainer}>
              <TouchableOpacity
                style={[
                  styles.currencyButton,
                  form.currency === 'MAD' && styles.currencyButtonSelected,
                  { backgroundColor: form.currency === 'MAD' ? colors.primary[500] : colors.background.card, borderColor: colors.border.primary }
                ]}
                onPress={() => setForm(prev => ({ ...prev, currency: 'MAD' }))}
                disabled={loading}
              >
                <Text style={[
                  styles.currencyText,
                  form.currency === 'MAD' && styles.currencyTextSelected,
                  { color: form.currency === 'MAD' ? '#fff' : colors.text.primary }
                ]}>
                  MAD
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.currencyButton,
                  form.currency === 'EUR' && styles.currencyButtonSelected,
                  { backgroundColor: form.currency === 'EUR' ? colors.primary[500] : colors.background.card, borderColor: colors.border.primary }
                ]}
                onPress={() => setForm(prev => ({ ...prev, currency: 'EUR' }))}
                disabled={loading}
              >
                <Text style={[
                  styles.currencyText,
                  form.currency === 'EUR' && styles.currencyTextSelected,
                  { color: form.currency === 'EUR' ? '#fff' : colors.text.primary }
                ]}>
                  EUR
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Couleur */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text.primary }]}>
              {t.colorLabel}
            </Text>
            <View style={styles.colorsContainer}>
              {accountColors.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorButton,
                    { backgroundColor: color },
                    form.color === color && styles.colorButtonSelected
                  ]}
                  onPress={() => setForm(prev => ({ ...prev, color }))}
                  disabled={loading}
                >
                  {form.color === color && (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Statut actif/inactif */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text.primary }]}>
              {t.accountStatusLabel}
            </Text>
            <View style={styles.statusContainer}>
              <TouchableOpacity
                style={[
                  styles.statusButton,
                  form.isActive && styles.statusButtonSelected,
                  { backgroundColor: form.isActive ? '#34C75920' : colors.background.card, borderColor: colors.border.primary }
                ]}
                onPress={() => setForm(prev => ({ ...prev, isActive: true }))}
                disabled={loading}
              >
                <Ionicons 
                  name="checkmark-circle" 
                  size={20} 
                  color={form.isActive ? '#34C759' : colors.text.secondary} 
                />
                <Text style={[
                  styles.statusText,
                  form.isActive && styles.statusTextSelected,
                  { color: form.isActive ? '#34C759' : colors.text.primary }
                ]}>
                  {t.active}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.statusButton,
                  !form.isActive && styles.statusButtonSelected,
                  { backgroundColor: !form.isActive ? '#FF3B3020' : colors.background.card, borderColor: colors.border.primary }
                ]}
                onPress={() => setForm(prev => ({ ...prev, isActive: false }))}
                disabled={loading}
              >
                <Ionicons 
                  name="close-circle" 
                  size={20} 
                  color={!form.isActive ? '#FF3B30' : colors.text.secondary} 
                />
                <Text style={[
                  styles.statusText,
                  !form.isActive && styles.statusTextSelected,
                  { color: !form.isActive ? '#FF3B30' : colors.text.primary }
                ]}>
                  {t.inactive}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Aperçu */}
          <View style={styles.previewSection}>
            <Text style={[styles.label, { color: colors.text.primary }]}>
              {t.previewLabel}
            </Text>
            <View style={[styles.previewCard, { backgroundColor: form.color }]}>
              <View style={styles.previewHeader}>
                <Ionicons 
                  name={getAccountTypeIcon(form.type) as any} 
                  size={32} 
                  color="#fff" 
                />
                <View style={styles.previewInfo}>
                  <Text style={styles.previewName} numberOfLines={1}>
                    {form.name || t.accountNamePreview}
                  </Text>
                  <Text style={styles.previewType}>
                    {ACCOUNT_TYPES.find(t => t.value === form.type)?.label || t.typePreview}
                  </Text>
                </View>
              </View>
              <Text style={styles.previewBalance}>
                {formatDisplayAmount(form.balance || '0')}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  cancelText: {
    fontSize: 16,
    color: '#007AFF',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  saveTextDisabled: {
    opacity: 0.5,
  },
  content: {
    flex: 1,
    padding: 20,
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
  typesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    gap: 8,
    minWidth: 120,
  },
  typeButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  typeText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  typeTextSelected: {
    color: '#fff',
  },
  currenciesContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  currencyButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  currencyButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  currencyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  currencyTextSelected: {
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
  statusContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statusButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    gap: 8,
  },
  statusButtonSelected: {
    backgroundColor: '#007AFF20',
    borderColor: '#007AFF',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  statusTextSelected: {
    color: '#007AFF',
  },
  previewSection: {
    marginTop: 8,
  },
  previewCard: {
    padding: 20,
    borderRadius: 16,
    marginTop: 8,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  previewInfo: {
    marginLeft: 12,
    flex: 1,
  },
  previewName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  previewType: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  previewBalance: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
});

export default AccountForm;