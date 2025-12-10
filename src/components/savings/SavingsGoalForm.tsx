// src/components/savings/SavingsGoalForm.tsx - VERSION AVEC DÉFILEMENT CORRIGÉ
import DateTimePicker from '@react-native-community/datetimepicker';
import { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useCurrency } from '../../context/CurrencyContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useAccounts } from '../../hooks/useAccounts';
import { useSavings } from '../../hooks/useSavings';
import { CreateSavingsGoalData } from '../../types/Savings';

interface SavingsGoalFormData {
  name: string;
  targetAmount: string;
  monthlyContribution: string;
  targetDate: Date;
  category: 'vacation' | 'emergency' | 'house' | 'car' | 'education' | 'retirement' | 'other';
  color: string;
  icon: string;
  savingsAccountId: string;
  contributionAccountId: string;
} 

interface Props {
  onSubmit: (data: CreateSavingsGoalData) => void;
  loading: boolean;
}

const COLORS = [
  '#FF6B6B', '#4D96FF', '#6BCF7F', '#F2994A', '#9B51E0', '#FFD93D', '#828282'
];

export const SavingsGoalForm = ({ onSubmit, loading }: Props) => {
  const { theme } = useTheme();
  const { formatAmount } = useCurrency();
  const { t } = useLanguage();
  const { accounts } = useAccounts();
  const { calculateRequiredMonthlySavings, calculateGoalAchievementDate } = useSavings();
  
  // Définir les catégories avec traductions
  const CATEGORIES = [
    { value: 'vacation' as const, label: `🏖️ ${t.vacation}`, color: '#FF6B6B' },
    { value: 'emergency' as const, label: `🆘 ${t.emergency}`, color: '#FFD93D' },
    { value: 'house' as const, label: `🏠 ${t.house}`, color: '#6BCF7F' },
    { value: 'car' as const, label: `🚗 ${t.car}`, color: '#4D96FF' },
    { value: 'education' as const, label: `🎓 ${t.education}`, color: '#9B51E0' },
    { value: 'retirement' as const, label: `👵 ${t.retirement}`, color: '#F2994A' },
    { value: 'other' as const, label: `💰 ${t.other}`, color: '#828282' },
  ];
  
  const [formData, setFormData] = useState<SavingsGoalFormData>({
    name: '',
    targetAmount: '',
    monthlyContribution: '',
    targetDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // +1 an
    category: 'other',
    color: COLORS[0],
    icon: '💰',
    savingsAccountId: '',
    contributionAccountId: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [calculateMode, setCalculateMode] = useState<'manual' | 'auto'>('manual');

  const isDark = theme === 'dark';

  // Filtrer les comptes (épargne vs comptes courants)
  const savingsAccounts = accounts.filter(acc => acc.type === 'savings');
  const contributionAccounts = accounts.filter(acc => acc.type !== 'savings');

  // Calcul automatique de la mensualité
  const calculatedMonthlyContribution = useMemo(() => {
    if (calculateMode !== 'auto' || !formData.targetAmount) return 0;

    const targetAmount = parseFloat(formData.targetAmount);
    const today = new Date();
    const monthsDiff = Math.ceil(
      (formData.targetDate.getTime() - today.getTime()) / (30 * 24 * 60 * 60 * 1000)
    );

    if (monthsDiff <= 0) return targetAmount;

    return calculateRequiredMonthlySavings(targetAmount, 0, formData.targetDate.toISOString());
  }, [formData.targetAmount, formData.targetDate, calculateMode, calculateRequiredMonthlySavings]);

  // Calcul de la date d'atteinte
  const calculatedTargetDate = useMemo(() => {
    if (!formData.targetAmount || !formData.monthlyContribution) return null;

    const targetAmount = parseFloat(formData.targetAmount);
    const monthlyContribution = parseFloat(formData.monthlyContribution);

    if (monthlyContribution <= 0) return null;

    return calculateGoalAchievementDate(targetAmount, 0, monthlyContribution);
  }, [formData.targetAmount, formData.monthlyContribution, calculateGoalAchievementDate]);

  const handleSubmit = () => {
    // Validation
    if (!formData.name.trim()) {
      Alert.alert(t.error, t.accountNameRequired);
      return;
    }

    if (!formData.targetAmount || parseFloat(formData.targetAmount) <= 0) {
      Alert.alert(t.error, t.targetAmountPositive);
      return;
    }

    if (!formData.savingsAccountId) {
      Alert.alert(t.error, t.selectSavingsAccountRequired);
      return;
    }

    const submitData: CreateSavingsGoalData = {
      name: formData.name.trim(),
      targetAmount: parseFloat(formData.targetAmount),
      targetDate: formData.targetDate.toISOString().split('T')[0],
      monthlyContribution: calculateMode === 'auto' ? 
        calculatedMonthlyContribution : parseFloat(formData.monthlyContribution),
      category: formData.category,
      color: formData.color,
      icon: formData.icon,
      savingsAccountId: formData.savingsAccountId,
      contributionAccountId: formData.contributionAccountId || undefined,
    };

    if (submitData.monthlyContribution <= 0) {
      Alert.alert(t.error, t.monthlyContributionPositive);
      return;
    }

    onSubmit(submitData);
  };

  const updateFormData = (key: keyof SavingsGoalFormData, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      vacation: '🏖️',
      emergency: '🆘',
      house: '🏠',
      car: '🚗',
      education: '🎓',
      retirement: '👵',
      other: '💰'
    };
    return icons[category] || '💰';
  };

  // Fonction pour obtenir le symbole de devise
  const getCurrencySymbol = () => {
    return formatAmount(0, false).split(' ')[0];
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* ✅ CORRECTION: ScrollView principal avec défilement complet */}
      <ScrollView 
        style={[styles.scrollView, isDark && styles.darkForm]} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        keyboardShouldPersistTaps="handled"
      >
        {/* Nom de l'objectif */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, isDark && styles.darkText]}>{t.goalNameLabel}</Text>
          <TextInput
            style={[styles.input, isDark && styles.darkInput]}
            value={formData.name}
            onChangeText={(value) => updateFormData('name', value)}
            placeholder={t.savingsGoalPlaceholder}
            placeholderTextColor={isDark ? "#888" : "#999"}
          />
        </View>

        {/* Catégorie */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, isDark && styles.darkText]}>{t.categoryLabel}</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.categoriesContainer}
            contentContainerStyle={styles.horizontalContent}
          >
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.value}
                style={[
                  styles.categoryButton,
                  formData.category === category.value && styles.activeCategoryButton,
                  { borderColor: category.color }
                ]}
                onPress={() => {
                  updateFormData('category', category.value);
                  updateFormData('icon', getCategoryIcon(category.value));
                  updateFormData('color', category.color);
                }}
              >
                <Text style={[
                  styles.categoryText,
                  formData.category === category.value && styles.activeCategoryText,
                ]}>
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Montant cible */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, isDark && styles.darkText]}>{t.targetAmountLabel}</Text>
          <View style={[styles.amountInput, isDark && styles.darkAmountInput]}>
            <Text style={[styles.currencySymbol, isDark && styles.darkText]}>
              {getCurrencySymbol()}
            </Text>
            <TextInput
              style={[styles.input, styles.amountTextInput, isDark && styles.darkInput]}
              value={formData.targetAmount}
              onChangeText={(value) => updateFormData('targetAmount', value.replace(',', '.'))}
              placeholder="0.00"
              placeholderTextColor={isDark ? "#888" : "#999"}
              keyboardType="decimal-pad"
            />
          </View>
          {formData.targetAmount && (
            <Text style={[styles.hint, isDark && styles.darkSubtext]}>
              {t.targetAmountHint} {formatAmount(parseFloat(formData.targetAmount) || 0)}
            </Text>
          )}
        </View>

        {/* Compte d'épargne */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, isDark && styles.darkText]}>{t.savingsAccountLabel}</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.accountsContainer}
            contentContainerStyle={styles.horizontalContent}
          >
            {savingsAccounts.map((account) => (
              <TouchableOpacity
                key={account.id}
                style={[
                  styles.accountButton,
                  formData.savingsAccountId === account.id && styles.activeAccountButton,
                  isDark && styles.darkAccountButton
                ]}
                onPress={() => updateFormData('savingsAccountId', account.id)}
              >
                <View style={[styles.accountColor, { backgroundColor: account.color }]} />
                <View style={styles.accountInfo}>
                  <Text style={[
                    styles.accountName, 
                    isDark && styles.darkText,
                    formData.savingsAccountId === account.id && styles.activeAccountText
                  ]}>
                    {account.name}
                  </Text>
                  <Text style={[
                    styles.accountBalance, 
                    isDark && styles.darkSubtext,
                    formData.savingsAccountId === account.id && styles.activeAccountSubtext
                  ]}>
                    {formatAmount(account.balance)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {savingsAccounts.length === 0 && (
            <Text style={[styles.warningText, isDark && styles.darkSubtext]}>
              {t.noSavingsAccountFound}
            </Text>
          )}
        </View>

        {/* Compte de contribution */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, isDark && styles.darkText]}>{t.contributionSourceAccountLabel}</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.accountsContainer}
            contentContainerStyle={styles.horizontalContent}
          >
            {contributionAccounts.map((account) => (
              <TouchableOpacity
                key={account.id}
                style={[
                  styles.accountButton,
                  formData.contributionAccountId === account.id && styles.activeAccountButton,
                  isDark && styles.darkAccountButton
                ]}
                onPress={() => updateFormData('contributionAccountId', account.id)}
              >
                <View style={[styles.accountColor, { backgroundColor: account.color }]} />
                <View style={styles.accountInfo}>
                  <Text style={[
                    styles.accountName, 
                    isDark && styles.darkText,
                    formData.contributionAccountId === account.id && styles.activeAccountText
                  ]}>
                    {account.name}
                  </Text>
                  <Text style={[
                    styles.accountBalance, 
                    isDark && styles.darkSubtext,
                    formData.contributionAccountId === account.id && styles.activeAccountSubtext
                  ]}>
                    {formatAmount(account.balance)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Text style={[styles.hint, isDark && styles.darkSubtext]}>
            {t.selectContributionSource}
          </Text>
        </View>

        {/* Date cible */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, isDark && styles.darkText]}>{t.targetDateLabel}</Text>
          <TouchableOpacity 
            style={[styles.dateButton, isDark && styles.darkInput]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={[styles.dateButtonText, isDark && styles.darkText]}>
              {formData.targetDate.toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
          </TouchableOpacity>
          
          {showDatePicker && (
            <DateTimePicker
              value={formData.targetDate}
              mode="date"
              display="default"
              minimumDate={new Date()}
              onChange={(event, date) => {
                setShowDatePicker(false);
                if (date) updateFormData('targetDate', date);
              }}
            />
          )}
        </View>

        {/* Mode de calcul */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, isDark && styles.darkText]}>{t.monthlyContributionCalculationLabel}</Text>
          <View style={styles.calculationMode}>
            <TouchableOpacity
              style={[
                styles.modeButton,
                calculateMode === 'auto' && styles.modeButtonActive,
                isDark && styles.darkModeButton
              ]}
              onPress={() => setCalculateMode('auto')}
            >
              <Text style={[
                styles.modeButtonText,
                calculateMode === 'auto' && styles.modeButtonTextActive,
                isDark && styles.darkText
              ]}>
                {t.autoMode}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modeButton,
                calculateMode === 'manual' && styles.modeButtonActive,
                isDark && styles.darkModeButton
              ]}
              onPress={() => setCalculateMode('manual')}
            >
              <Text style={[
                styles.modeButtonText,
                calculateMode === 'manual' && styles.modeButtonTextActive,
                isDark && styles.darkText
              ]}>
                {t.manualMode}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Contribution mensuelle */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, isDark && styles.darkText]}>
            {t.monthlyContributionLabel} {calculateMode === 'auto' && t.calculatedAutomatically}
          </Text>
          <View style={[styles.amountInput, isDark && styles.darkAmountInput]}>
            <Text style={[styles.currencySymbol, isDark && styles.darkText]}>
              {getCurrencySymbol()}
            </Text>
            {calculateMode === 'auto' ? (
              <Text style={[styles.calculatedAmount, isDark && styles.darkText]}>
                {calculatedMonthlyContribution.toFixed(2)}
              </Text>
            ) : (
              <TextInput
                style={[styles.input, styles.amountTextInput, isDark && styles.darkInput]}
                value={formData.monthlyContribution}
                onChangeText={(value) => updateFormData('monthlyContribution', value.replace(',', '.'))}
                placeholder="0.00"
                placeholderTextColor={isDark ? "#888" : "#999"}
                keyboardType="decimal-pad"
              />
            )}
          </View>
          {calculateMode === 'auto' && formData.targetAmount && (
            <Text style={[styles.hint, isDark && styles.darkSubtext]}>
              {t.contributionPrefix} {formatAmount(calculatedMonthlyContribution)}
            </Text>
          )}
          {calculateMode === 'manual' && formData.monthlyContribution && (
            <Text style={[styles.hint, isDark && styles.darkSubtext]}>
              {t.contributionPrefix} {formatAmount(parseFloat(formData.monthlyContribution) || 0)}
            </Text>
          )}
        </View>

        {/* Informations calculées */}
        {calculatedTargetDate && calculateMode === 'manual' && (
          <View style={[styles.calculationInfo, isDark && styles.darkCalculationInfo]}>
            <Text style={[styles.calculationInfoText, isDark && styles.darkText]}>
              {t.withThisContribution} {' '}
              {new Date(calculatedTargetDate).toLocaleDateString('fr-FR', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </Text>
          </View>
        )}

        {calculateMode === 'auto' && (
          <View style={[styles.calculationInfo, isDark && styles.darkCalculationInfo]}>
            <Text style={[styles.calculationInfoText, isDark && styles.darkText]}>
              {t.toReachGoalByDate} {' '}
              <Text style={styles.highlight}>
                {formatAmount(calculatedMonthlyContribution)} {t.perMonth}
              </Text>
            </Text>
          </View>
        )}

        {/* Couleur */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, isDark && styles.darkText]}>{t.colorLabel}</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.colorsContainer}
            contentContainerStyle={styles.horizontalContent}
          >
            {COLORS.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorButton,
                  { backgroundColor: color },
                  formData.color === color && styles.colorButtonSelected
                ]}
                onPress={() => updateFormData('color', color)}
              >
                {formData.color === color && (
                  <Text style={styles.colorCheck}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ✅ CORRECTION: Bouton de soumission DANS le ScrollView */}
        <TouchableOpacity
          style={[
            styles.submitButton, 
            loading && styles.submitButtonDisabled,
            (!formData.name || !formData.targetAmount || !formData.savingsAccountId) && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={loading || !formData.name || !formData.targetAmount || !formData.savingsAccountId}
        >
          <Text style={styles.submitButtonText}>
            {loading ? t.creatingGoal : t.createGoal}
          </Text>
        </TouchableOpacity>

        {/* ✅ CORRECTION: Espace supplémentaire pour le défilement */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  darkForm: {
    backgroundColor: '#1c1c1e',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000',
  },
  darkInput: {
    backgroundColor: '#2c2c2e',
    borderColor: '#444',
    color: '#fff',
  },
  amountInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  darkAmountInput: {
    backgroundColor: '#2c2c2e',
    borderColor: '#444',
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7f8c8d',
    marginRight: 8,
  },
  amountTextInput: {
    flex: 1,
    borderWidth: 0,
    paddingHorizontal: 0,
    backgroundColor: 'transparent',
  },
  calculatedAmount: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '600',
  },
  categoriesContainer: {
    flexDirection: 'row',
  },
  horizontalContent: {
    paddingRight: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#ddd',
    marginRight: 8,
    backgroundColor: '#fff',
  },
  activeCategoryButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2c3e50',
  },
  activeCategoryText: {
    color: '#007AFF',
    fontWeight: '600',
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
  activeAccountButton: {
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
  accountName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2c3e50',
  },
  activeAccountText: {
    color: '#fff',
  },
  accountBalance: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  activeAccountSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  warningText: {
    fontSize: 12,
    color: '#e74c3c',
    fontStyle: 'italic',
    marginTop: 4,
  },
  hint: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 4,
    fontStyle: 'italic',
  },
  dateButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  calculationMode: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 4,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  darkModeButton: {
    backgroundColor: '#2c2c2e',
  },
  modeButtonActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#7f8c8d',
  },
  modeButtonTextActive: {
    color: '#007AFF',
  },
  calculationInfo: {
    backgroundColor: '#e8f4fd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  darkCalculationInfo: {
    backgroundColor: '#1a365d',
  },
  calculationInfoText: {
    fontSize: 14,
    color: '#2c3e50',
    lineHeight: 20,
  },
  highlight: {
    fontWeight: '700',
    color: '#007AFF',
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
    marginRight: 8,
  },
  colorButtonSelected: {
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  colorCheck: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  submitButtonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 30,
  },
  darkText: {
    color: '#fff',
  },
  darkSubtext: {
    color: '#888',
  },
});

export default SavingsGoalForm;