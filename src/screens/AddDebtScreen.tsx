// src/screens/AddDebtScreen.tsx - VERSION CORRIGÉE POUR PHASE 2
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from '../components/SafeAreaView';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useAccounts } from '../hooks/useAccounts';
import { useDebts } from '../hooks/useDebts';
import { CreateDebtData, DEBT_CATEGORIES, DEBT_TYPES, DebtCategory, DebtType } from '../types/Debt';
import { getDebtCategoryLabel, getDebtTypeLabel } from '../utils/debtTranslations';

interface DebtFormData {
  name: string;
  initialAmount: string;
  interestRate: string;
  monthlyPayment: string;
  startDate: Date;
  creditor: string;
  type: DebtType;
  category: DebtCategory;
  color: string;
  autoPay: boolean;
  paymentAccountId: string;
  paymentDay: number;
  startPaymentNextMonth: boolean;
}

const AddDebtScreen = ({ navigation }: any) => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const { formatAmount } = useCurrency();
  const { createDebt } = useDebts();
  const { accounts } = useAccounts();
  
  const [form, setForm] = useState<DebtFormData>({
    name: '',
    initialAmount: '',
    interestRate: '0',
    monthlyPayment: '',
    startDate: new Date(),
    creditor: '',
    type: 'personal',
    category: 'consumption',
    color: '#FFA07A',
    autoPay: false,
    paymentAccountId: '',
    paymentDay: 1,
    startPaymentNextMonth: true, // Par défaut: commencer le mois prochain
  });
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const isDark = theme === 'dark';

  // ✅ CORRECTION : Utiliser DEBT_TYPES et DEBT_CATEGORIES depuis les types
  const debtTypes = DEBT_TYPES;
  const categories = DEBT_CATEGORIES;

  const colors = [
    '#007AFF', '#34C759', '#FF3B30', '#FF9500', '#5856D6', 
    '#AF52DE', '#FF2D55', '#32D74B', '#FFD60A'
  ];

  const handleSave = async () => {
    if (!form.name || !form.initialAmount || !form.monthlyPayment || !form.creditor) {
      Alert.alert(t.error, t.fillAllFields);
      return;
    }

    if (form.autoPay && !form.paymentAccountId) {
      Alert.alert(t.error, t.selectPaymentAccount);
      return;
    }

    const initialAmount = parseFloat(form.initialAmount);
    const monthlyPayment = parseFloat(form.monthlyPayment);
    const interestRate = parseFloat(form.interestRate);

    if (isNaN(initialAmount) || initialAmount <= 0) {
      Alert.alert(t.error, t.initialAmountPositive);
      return;
    }

    if (isNaN(monthlyPayment) || monthlyPayment <= 0) {
      Alert.alert(t.error, t.monthlyPaymentPositive);
      return;
    }

    if (monthlyPayment > initialAmount) {
      Alert.alert(t.error, t.monthlyPaymentCannotExceedInitial);
      return;
    }

    setLoading(true);
    try {
      console.log('🔄 [AddDebtScreen] Creating debt...');
      
      // ✅ CORRECTION : Inclure tous les champs requis
      const debtData: CreateDebtData = {
        name: form.name,
        initialAmount: initialAmount,
        interestRate: interestRate,
        monthlyPayment: monthlyPayment,
        startDate: form.startDate.toISOString().split('T')[0],
        creditor: form.creditor,
        type: form.type,
        category: form.category,
        color: form.color,
        autoPay: form.autoPay,
        paymentAccountId: form.autoPay ? form.paymentAccountId : undefined,
        paymentDay: form.autoPay ? form.paymentDay : undefined,
        startPaymentNextMonth: form.autoPay ? form.startPaymentNextMonth : undefined,
      };

      await createDebt(debtData);
      
      console.log('✅ [AddDebtScreen] Debt created successfully');
      Alert.alert(
        t.success,
        t.debtAddedSuccess,
        [{ text: 'OK', onPress: () => navigation.navigate('DebtsList') }]
      );
    } catch (error) {
      console.error('❌ [AddDebtScreen] Error creating debt:', error);
      Alert.alert(t.error, t.cannotAddDebt);
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

  const handleAmountChange = (field: 'initialAmount' | 'monthlyPayment', value: string) => {
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

  const handleInterestRateChange = (value: string) => {
    let cleanedValue = value.replace(/[^\d,.]/g, '');
    cleanedValue = cleanedValue.replace(',', '.');
    
    const parts = cleanedValue.split('.');
    if (parts.length > 2) {
      cleanedValue = parts[0] + '.' + parts.slice(1).join('');
    }
    
    setForm(prev => ({ 
      ...prev, 
      interestRate: cleanedValue 
    }));
  };

  const formatDisplayAmount = (value: string): string => {
    if (!value) return '';
    
    const num = parseFloat(value);
    if (isNaN(num)) return '';
    
    return formatAmount(num);
  };

  const formatDisplayPercentage = (value: string): string => {
    if (!value) return '';
    
    const num = parseFloat(value);
    if (isNaN(num)) return '';
    
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num) + '%';
  };

  const calculateMonthlyPayment = (): void => {
    if (!form.initialAmount || !form.interestRate) return;

    const principal = parseFloat(form.initialAmount);
    const annualRate = parseFloat(form.interestRate) / 100;
    const monthlyRate = annualRate / 12;
    
    if (monthlyRate > 0) {
      const monthlyPayment = principal * monthlyRate / (1 - Math.pow(1 + monthlyRate, -12));
      if (!isNaN(monthlyPayment) && isFinite(monthlyPayment)) {
        setForm(prev => ({ 
          ...prev, 
          monthlyPayment: monthlyPayment.toFixed(2) 
        }));
      }
    }
  };

  const handleTypeChange = (value: DebtType) => {
    setForm(prev => ({ 
      ...prev, 
      type: value 
    }));
  };

  const handleCategoryChange = (value: string) => {
    setForm(prev => ({ 
      ...prev, 
      category: value 
    }));
  };

  const handleColorChange = (value: string) => {
    setForm(prev => ({ 
      ...prev, 
      color: value 
    }));
  };

  return (
    <SafeAreaView>
      <ScrollView 
        style={[styles.container, isDark && styles.darkContainer]}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.navigate('DebtsList')}
          >
            <Ionicons name="close" size={24} color={isDark ? "#fff" : "#000"} />
          </TouchableOpacity>
          <Text style={[styles.title, isDark && styles.darkText]}>
            {t.newDebt}
          </Text>
        </View>

        {/* Section: Informations de base */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && styles.darkText]}>
            📋 {t.baseInformation}
          </Text>

        {/* Nom de la dette */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, isDark && styles.darkText]}>
            {t.debtName} *
          </Text>
          <TextInput
            style={[styles.input, isDark && styles.darkInput]}
            value={form.name}
            onChangeText={(text) => setForm(prev => ({ ...prev, name: text }))}
            placeholder="Ex: Prêt voiture"
            placeholderTextColor={isDark ? "#888" : "#999"}
          />
        </View>

        {/* Créancier */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, isDark && styles.darkText]}>
            {t.creditorName} *
          </Text>
          <TextInput
            style={[styles.input, isDark && styles.darkInput]}
            value={form.creditor}
            onChangeText={(text) => setForm(prev => ({ ...prev, creditor: text }))}
            placeholder="Ex: Ma banque"
            placeholderTextColor={isDark ? "#888" : "#999"}
          />
        </View>
        </View>

        {/* Section: Type et catégorie */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && styles.darkText]}>
            🏷️ {t.typeAndCategory}
          </Text>

        {/* Type de dette */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, isDark && styles.darkText]}>
            {t.debtType}
          </Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
            contentContainerStyle={styles.chipsContainer}
          >
            {debtTypes.map((type) => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.chip,
                  isDark && styles.chipDark,
                  form.type === type.value && styles.chipSelected,
                  form.type === type.value && { borderColor: form.color }
                ]}
                onPress={() => handleTypeChange(type.value)}
              >
                <Ionicons 
                  name={type.icon as any} 
                  size={18} 
                  color={form.type === type.value ? form.color : (isDark ? "#888" : "#666")} 
                />
                <Text style={[
                  styles.chipText,
                  isDark && styles.chipTextDark,
                  form.type === type.value && styles.chipTextSelected,
                  form.type === type.value && { color: form.color }
                ]}>
                  {getDebtTypeLabel(type.value, t)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Catégorie */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, isDark && styles.darkText]}>
            {t.category}
          </Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
            contentContainerStyle={styles.chipsContainer}
          >
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.value}
                style={[
                  styles.chip,
                  isDark && styles.chipDark,
                  form.category === cat.value && styles.chipSelected,
                  form.category === cat.value && { borderColor: cat.color }
                ]}
                onPress={() => handleCategoryChange(cat.value)}
              >
                <Ionicons 
                  name={cat.icon as any} 
                  size={18} 
                  color={form.category === cat.value ? cat.color : (isDark ? "#888" : "#666")} 
                />
                <Text style={[
                  styles.chipText,
                  isDark && styles.chipTextDark,
                  form.category === cat.value && styles.chipTextSelected,
                  form.category === cat.value && { color: cat.color }
                ]}>
                  {getDebtCategoryLabel(cat.value, t)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        </View>

        {/* Section: Détails financiers */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && styles.darkText]}>
            💰 {t.financialDetails}
          </Text>

        {/* Montant initial */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, isDark && styles.darkText]}>
            {t.initialAmount} *
          </Text>
          <TextInput
            style={[styles.input, isDark && styles.darkInput]}
            value={form.initialAmount}
            onChangeText={(value) => handleAmountChange('initialAmount', value)}
            placeholder="0.00"
            placeholderTextColor={isDark ? "#888" : "#999"}
            keyboardType="decimal-pad"
            returnKeyType="done"
          />
          {form.initialAmount && (
            <Text style={[styles.hint, isDark && styles.darkSubtext]}>
              {formatDisplayAmount(form.initialAmount)}
            </Text>
          )}
        </View>

        {/* Taux d'intérêt */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, isDark && styles.darkText]}>
            {t.interestRate} (%)
          </Text>
          <View style={styles.interestContainer}>
            <TextInput
              style={[styles.input, isDark && styles.darkInput]}
              value={form.interestRate}
              onChangeText={handleInterestRateChange}
              placeholder="0.00"
              placeholderTextColor={isDark ? "#888" : "#999"}
              keyboardType="decimal-pad"
              returnKeyType="done"
            />
            <TouchableOpacity 
              style={styles.calculateButton}
              onPress={calculateMonthlyPayment}
            >
              <Text style={styles.calculateButtonText}>Calculer</Text>
            </TouchableOpacity>
          </View>
          {form.interestRate && (
            <Text style={[styles.hint, isDark && styles.darkSubtext]}>
              {formatDisplayPercentage(form.interestRate)}
            </Text>
          )}
        </View>

        {/* Paiement mensuel */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, isDark && styles.darkText]}>
            {t.monthlyPayment} *
          </Text>
          <TextInput
            style={[styles.input, isDark && styles.darkInput]}
            value={form.monthlyPayment}
            onChangeText={(value) => handleAmountChange('monthlyPayment', value)}
            placeholder="0.00"
            placeholderTextColor={isDark ? "#888" : "#999"}
            keyboardType="decimal-pad"
            returnKeyType="done"
          />
          {form.monthlyPayment && (
            <Text style={[styles.hint, isDark && styles.darkSubtext]}>
              {formatDisplayAmount(form.monthlyPayment)}
            </Text>
          )}
        </View>

        {/* Date de début */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, isDark && styles.darkText]}>
            {t.startDate}
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
          <Text style={[styles.hint, isDark && styles.darkSubtext]}>
            {t.debtStartDate}
          </Text>
        </View>

        {/* Date d'échéance calculée (affichage uniquement) */}
        {form.autoPay && (
          <View style={[styles.inputGroup, styles.calculatedDateGroup]}>
            <Text style={[styles.label, isDark && styles.darkText]}>
              📅 {t.dueDateFirstPayment}
            </Text>
            <View style={[styles.calculatedDateBox, isDark && styles.darkInput]}>
              <Text style={[styles.calculatedDateText, isDark && styles.darkText]}>
                {(() => {
                  const startDate = new Date(form.startDate);
                  const paymentDay = form.paymentDay;
                  let dueYear = startDate.getFullYear();
                  let dueMonth = startDate.getMonth(); // 0-11
                  
                  if (form.startPaymentNextMonth) {
                    // Option "Mois prochain" : passer au mois suivant
                    dueMonth += 1;
                    if (dueMonth > 11) {
                      dueMonth = 0;
                      dueYear += 1;
                    }
                  }
                  // Option "Dès que possible" : rester dans le mois actuel
                  
                  const dueDate = new Date(dueYear, dueMonth, paymentDay);
                  return dueDate.toLocaleDateString('fr-FR', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  });
                })()}
              </Text>
            </View>
            <Text style={[styles.hint, isDark && styles.darkSubtext]}>
              {form.startPaymentNextMonth 
                ? t.firstPaymentNextMonth
                : t.firstPaymentAsap}
            </Text>
          </View>
        )}
        </View>

        {/* Section: Options de paiement */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && styles.darkText]}>
            💳 {t.paymentOptions}
          </Text>

        {/* Paiement automatique */}
        <View style={[styles.autoPaySection, isDark && styles.darkAutoPaySection]}>
          <View style={styles.switchRow}>
            <View style={styles.switchLabelCompact}>
              <Ionicons name="card-outline" size={20} color={isDark ? "#fff" : "#000"} />
              <Text style={[styles.labelBold, isDark && styles.darkText]}>
                {t.automaticPayment}
              </Text>
            </View>
            <Switch
              value={form.autoPay}
              onValueChange={(value) => setForm(prev => ({ ...prev, autoPay: value }))}
              trackColor={{ false: '#767577', true: '#34C759' }}
              thumbColor={form.autoPay ? '#fff' : '#f4f3f4'}
            />
          </View>

          {form.autoPay && (
            <View style={styles.accountSelectorCompact}>
              <Text style={[styles.sublabel, isDark && styles.darkSubtext]}>
                {t.selectAccountForAutoPay}
              </Text>
              
              {/* Jour du mois pour le paiement */}
              <View style={styles.paymentDayContainer}>
                <Text style={[styles.label, isDark && styles.darkText]}>
                  {t.dayOfMonthForPayment}
                </Text>
                <TextInput
                  style={[styles.input, styles.dayInput, isDark && styles.darkInput]}
                  value={form.paymentDay.toString()}
                  onChangeText={(value) => {
                    const day = parseInt(value) || 1;
                    if (day >= 1 && day <= 31) {
                      setForm(prev => ({ ...prev, paymentDay: day }));
                    }
                  }}
                  placeholder="1-31"
                  placeholderTextColor={isDark ? "#888" : "#999"}
                  keyboardType="number-pad"
                  maxLength={2}
                />
                <Text style={[styles.hint, isDark && styles.darkSubtext]}>
                  {t.automaticPaymentOnDay} {form.paymentDay} {t.dayOfEachMonth}
                </Text>
              </View>

              {/* Choix du début des paiements */}
              <View style={styles.paymentStartContainer}>
                <Text style={[styles.label, isDark && styles.darkText]}>
                  {t.automaticPaymentStart}
                </Text>
                
                <TouchableOpacity
                  style={[
                    styles.radioOption,
                    form.startPaymentNextMonth && styles.radioOptionSelected,
                    isDark && styles.darkInput
                  ]}
                  onPress={() => setForm(prev => ({ ...prev, startPaymentNextMonth: true }))}
                >
                  <View style={styles.radioCircle}>
                    {form.startPaymentNextMonth && <View style={styles.radioInner} />}
                  </View>
                  <View style={styles.radioContent}>
                    <Text style={[styles.radioTitle, isDark && styles.darkText]}>
                      {t.nextMonthRecommended}
                    </Text>
                    <Text style={[styles.radioSubtitle, isDark && styles.darkSubtext]}>
                      {(() => {
                        const nextMonth = new Date(form.startDate);
                        nextMonth.setMonth(nextMonth.getMonth() + 1);
                        nextMonth.setDate(form.paymentDay);
                        return `🗓️ ${t.firstDebitOn} : ${nextMonth.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`;
                      })()}
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.radioOption,
                    !form.startPaymentNextMonth && styles.radioOptionSelected,
                    isDark && styles.darkInput
                  ]}
                  onPress={() => setForm(prev => ({ ...prev, startPaymentNextMonth: false }))}
                >
                  <View style={styles.radioCircle}>
                    {!form.startPaymentNextMonth && <View style={styles.radioInner} />}
                  </View>
                  <View style={styles.radioContent}>
                    <Text style={[styles.radioTitle, isDark && styles.darkText]}>
                      {t.asapPayment}
                    </Text>
                    <Text style={[styles.radioSubtitle, isDark && styles.darkSubtext]}>
                      ⚡ {t.ifDueDatePassedImmediate}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              {accounts.length === 0 ? (
                <Text style={[styles.hint, isDark && styles.darkSubtext]}>
                  {t.noAccountAvailable}
                </Text>
              ) : (
                <View style={styles.accountsRow}>
                  {accounts.map((account) => (
                    <TouchableOpacity
                      key={account.id}
                      style={[
                        styles.accountChip,
                        form.paymentAccountId === account.id && styles.accountChipSelected,
                        isDark && styles.darkAccountChip
                      ]}
                      onPress={() => setForm(prev => ({ ...prev, paymentAccountId: account.id }))}
                    >
                      <Text style={[
                        styles.accountChipText,
                        form.paymentAccountId === account.id && styles.accountChipTextSelected,
                        isDark && styles.darkText
                      ]}>
                        {account.name}
                      </Text>
                      {form.paymentAccountId === account.id && (
                        <Ionicons name="checkmark-circle" size={16} color="#34C759" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}
        </View>

        {/* Couleur */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, isDark && styles.darkText]}>
            {t.color}
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
                onPress={() => handleColorChange(color)}
              >
                {form.color === color && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
        </View>

        {/* Boutons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={[styles.cancelButton, isDark && styles.darkCancelButton]}
            onPress={() => navigation.navigate('Debts', { screen: 'DebtsList' })}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>{t.cancel}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={loading || !form.name || !form.initialAmount || !form.monthlyPayment || !form.creditor}
          >
            <Text style={styles.saveButtonText}>
              {loading ? t.adding : t.add}
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
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
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
    marginBottom: 16,
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
    padding: 12,
    fontSize: 16,
    color: '#000',
  },
  darkInput: {
    backgroundColor: '#2c2c2e',
    borderColor: '#444',
    color: '#fff',
  },
  interestContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  section: {
    marginTop: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  calculateButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  calculateButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
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
    marginTop: 24,
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
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    lineHeight: 20,
  },
  hint: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  checkmark: {
    color: '#fff',
    fontWeight: 'bold',
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
  darkText: {
    color: '#fff',
  },
  darkSubtext: {
    color: '#888',
  },
  autoPaySection: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  darkAutoPaySection: {
    backgroundColor: '#2c2c2e',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: {
    flex: 1,
    marginRight: 16,
  },
  switchLabelCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  labelBold: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  sublabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
  },
  accountSelector: {
    marginTop: 16,
  },
  accountSelectorCompact: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  paymentDayContainer: {
    marginTop: 12,
    marginBottom: 16,
  },
  dayInput: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  accountsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  accountChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  accountChipSelected: {
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
    borderColor: '#34C759',
  },
  darkAccountChip: {
    backgroundColor: '#1c1c1e',
    borderColor: '#38383a',
  },
  accountChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  accountChipTextSelected: {
    color: '#34C759',
    fontWeight: '600',
  },
  accountButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  accountButtonSelected: {
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
    borderColor: '#34C759',
  },
  darkAccountButton: {
    backgroundColor: '#2c2c2e',
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  accountNameSelected: {
    color: '#34C759',
  },
  accountBalance: {
    fontSize: 14,
    color: '#666',
  },
  paymentStartContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    marginBottom: 12,
  },
  radioOptionSelected: {
    borderColor: '#34C759',
    backgroundColor: 'rgba(52, 199, 89, 0.05)',
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#34C759',
  },
  radioContent: {
    flex: 1,
  },
  radioTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  radioSubtitle: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  calculatedDateGroup: {
    backgroundColor: '#f0f8ff',
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  calculatedDateBox: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginVertical: 8,
  },
  calculatedDateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    textAlign: 'center',
  },
  horizontalScroll: {
    marginTop: 8,
  },
  chipsContainer: {
    gap: 8,
    paddingRight: 16,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  chipDark: {
    backgroundColor: '#1c1c1e',
    borderColor: '#38383a',
  },
  chipSelected: {
    backgroundColor: 'rgba(52, 199, 89, 0.05)',
    borderWidth: 2,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  chipTextDark: {
    color: '#fff',
  },
  chipTextSelected: {
    fontWeight: '600',
  },
});

export default AddDebtScreen;