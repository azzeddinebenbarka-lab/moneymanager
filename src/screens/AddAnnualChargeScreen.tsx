// src/screens/AddAnnualChargeScreen.tsx - VERSION COMPLÈTEMENT CORRIGÉE
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from '../components/SafeAreaView';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import { useDesignSystem } from '../context/ThemeContext';
import { useAccounts } from '../hooks/useAccounts';
import { useAnnualCharges } from '../hooks/useAnnualCharges';
import { CreateAnnualChargeData, getAllSubcategories } from '../types/AnnualCharge';

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
  isIslamic: boolean;
  islamicHolidayId?: string;
  arabicName?: string;
  type: 'normal' | 'obligatory' | 'recommended';
}

const AddAnnualChargeScreen = ({ navigation, route }: any) => {
  const { t, language } = useLanguage();
  const { colors } = useDesignSystem();
  const { formatAmount } = useCurrency();
  const { accounts } = useAccounts();
  const subcategories = getAllSubcategories();
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
    isIslamic: route.params?.isIslamic || false,
    type: 'normal'
  });
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const recurrenceOptions = [
    { value: 'yearly' as const, label: t.recurrenceYearly },
    { value: 'monthly' as const, label: t.recurrenceMonthly },
    { value: 'quarterly' as const, label: t.recurrenceQuarterly },
    { value: 'none' as const, label: t.recurrenceOneTime },
  ];

  const islamicTypes = [
    { value: 'normal' as const, label: t.normalType },
    { value: 'obligatory' as const, label: t.obligatoryType },
    { value: 'recommended' as const, label: t.recommendedType },
  ];

  const handleSave = async () => {
    if (!form.name || !form.amount || !form.category || !form.dueDate) {
      Alert.alert(t.error, t.fillAllRequiredFields);
      return;
    }

    const amount = parseFloat(form.amount.replace(',', '.'));
    if (isNaN(amount) || amount <= 0) {
      Alert.alert(t.error, t.enterValidChargeAmount);
      return;
    }

    if (form.autoDeduct && !form.accountId) {
      Alert.alert(t.error, t.selectAccountForAutoDeduct);
      return;
    }

    setLoading(true);
    try {
      // ✅ CORRECTION : dueDate doit être une string
      const chargeData: CreateAnnualChargeData = {
  name: form.name.trim(),
  amount: amount,
  dueDate: form.dueDate.toISOString().split('T')[0], // ✅ CORRIGÉ
  category: form.category,
  reminderDays: parseInt(form.reminderDays) || 7,
  accountId: form.accountId || undefined,
  autoDeduct: form.autoDeduct,
  notes: form.notes || undefined,
  paymentMethod: form.paymentMethod || undefined,
  recurrence: form.recurrence !== 'none' ? form.recurrence : undefined,
  isIslamic: form.isIslamic,
  arabicName: form.arabicName || undefined,
  type: form.type,
  isActive: true,
  isRecurring: form.recurrence !== 'none',
  isPaid: false
};

      await createCharge(chargeData);
      
      Alert.alert(
        t.success,
        t.chargeCreatedSuccess,
        [{ text: 'OK', onPress: () => navigation.navigate('AnnualChargesList') }]
      );
    } catch (error) {
      console.error('Error creating annual charge:', error);
      Alert.alert(t.error, t.cannotCreateCharge);
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
    let cleanedValue = value.replace(/[^\d,.]/g, '');
    cleanedValue = cleanedValue.replace(',', '.');
    
    const parts = cleanedValue.split('.');
    if (parts.length > 2) {
      cleanedValue = parts[0] + '.' + parts.slice(1).join('');
    }
    
    setForm(prev => ({ ...prev, amount: cleanedValue }));
  };

  const formatDisplayAmount = (value: string): string => {
    if (!value) return '';
    const num = parseFloat(value.replace(',', '.'));
    if (isNaN(num)) return '';
    return formatAmount(num);
  };

  const getAccountName = (accountId: string) => {
    const account = accounts.find(acc => acc.id === accountId);
    return account ? account.name : t.selectAccount;
  };

  // Fonction pour traduire les catégories
  const translateCategory = (categoryValue: string): string => {
    const categoryMap: { [key: string]: string } = {
      'taxes': t.ac_taxes,
      'insurance': t.ac_insurance,
      'subscriptions': t.ac_subscriptions,
      'maintenance': t.ac_maintenance,
      'education': t.ac_education,
      'health': t.ac_healthcare,
      'gifts': language === 'fr' ? 'Cadeaux' : language === 'en' ? 'Gifts' : 'هدايا',
      'vacation': language === 'fr' ? 'Vacances' : language === 'en' ? 'Vacation' : 'عطلة',
      'islamic': language === 'fr' ? 'Charges islamiques' : language === 'en' ? 'Islamic charges' : 'رسوم إسلامية',
      'vehicle': language === 'fr' ? 'Véhicule' : language === 'en' ? 'Vehicle' : 'مركبة',
      'technical_visit': language === 'fr' ? 'Visite technique' : language === 'en' ? 'Technical visit' : 'زيارة فنية',
    };
    return categoryMap[categoryValue.toLowerCase()] || categoryValue;
  };

  // Fonction pour traduire les sous-catégories
  const translateSubcategory = (subcategoryValue: string): string => {
    const subcategoryMap: { [key: string]: string } = {
      // Taxes
      'income_tax': language === 'fr' ? 'Impôt sur le revenu' : language === 'en' ? 'Income tax' : 'ضريبة الدخل',
      'property_tax': language === 'fr' ? 'Taxe foncière' : language === 'en' ? 'Property tax' : 'ضريبة الممتلكات',
      'business_tax': language === 'fr' ? 'Taxe professionnelle' : language === 'en' ? 'Business tax' : 'الضريبة المهنية',
      // Assurances
      'health_insurance': language === 'fr' ? 'Assurance santé' : language === 'en' ? 'Health insurance' : 'التأمين الصحي',
      'auto_insurance': language === 'fr' ? 'Assurance auto' : language === 'en' ? 'Auto insurance' : 'تأمين السيارات',
      'home_insurance': language === 'fr' ? 'Assurance habitation' : language === 'en' ? 'Home insurance' : 'تأمين المنزل',
      // Abonnements
      'digital_services': language === 'fr' ? 'Services numériques' : language === 'en' ? 'Digital services' : 'الخدمات الرقمية',
      'media_streaming': language === 'fr' ? 'Streaming multimédia' : language === 'en' ? 'Media streaming' : 'بث الوسائط',
      'professional_tools': language === 'fr' ? 'Outils professionnels' : language === 'en' ? 'Professional tools' : 'أدوات احترافية',
      // Maintenance
      'home_maintenance': language === 'fr' ? 'Entretien maison' : language === 'en' ? 'Home maintenance' : 'صيانة المنزل',
      'vehicle_maintenance': language === 'fr' ? 'Entretien véhicule' : language === 'en' ? 'Vehicle maintenance' : 'صيانة المركبة',
      'equipment_maintenance': language === 'fr' ? 'Entretien équipements' : language === 'en' ? 'Equipment maintenance' : 'صيانة المعدات',
      // Éducation
      'school_fees': language === 'fr' ? 'Frais scolaires' : language === 'en' ? 'School fees' : 'الرسوم المدرسية',
      'training_courses': language === 'fr' ? 'Formation continue' : language === 'en' ? 'Training courses' : 'التدريب',
      'educational_materials': language === 'fr' ? 'Matériel éducatif' : language === 'en' ? 'Educational materials' : 'المواد التعليمية',
      // Santé
      'medical_checkup': language === 'fr' ? 'Bilans médicaux' : language === 'en' ? 'Medical checkup' : 'الفحص الطبي',
      'dental_care': language === 'fr' ? 'Soins dentaires' : language === 'en' ? 'Dental care' : 'العناية بالأسنان',
      'medical_treatments': language === 'fr' ? 'Traitements médicaux' : language === 'en' ? 'Medical treatments' : 'العلاجات الطبية',
      // Islamiques
      'zakat': language === 'fr' ? 'Zakat' : language === 'en' ? 'Zakat' : 'زكاة',
      'sadaqah': language === 'fr' ? 'Sadaqah' : language === 'en' ? 'Sadaqah' : 'صدقة',
      'eid_expenses': language === 'fr' ? 'Dépenses Aïd' : language === 'en' ? 'Eid expenses' : 'نفقات العيد',
      'hajj_umrah': language === 'fr' ? 'Hajj / Omra' : language === 'en' ? 'Hajj / Umrah' : 'الحج والعمرة',
      'ramadan': language === 'fr' ? 'Ramadan' : language === 'en' ? 'Ramadan' : 'رمضان',
      'ramadan_expenses': language === 'fr' ? 'Dépenses Ramadan' : language === 'en' ? 'Ramadan expenses' : 'نفقات رمضان',
      'islamic_charity': language === 'fr' ? 'Œuvres de charité' : language === 'en' ? 'Islamic charity' : 'الأعمال الخيرية',
      // Véhicule
      'vehicle_registration': language === 'fr' ? 'Vignette voiture' : language === 'en' ? 'Vehicle registration' : 'تسجيل المركبة',
      'vehicle_insurance': language === 'fr' ? 'Assurance véhicule' : language === 'en' ? 'Vehicle insurance' : 'تأمين المركبة',
      'vehicle_tax': language === 'fr' ? 'Taxe véhicule' : language === 'en' ? 'Vehicle tax' : 'ضريبة المركبة',
      'technical_inspection': language === 'fr' ? 'Contrôle technique' : language === 'en' ? 'Technical inspection' : 'الفحص الفني',
      // Visite technique
      'vehicle_technical_visit': language === 'fr' ? 'Visite technique véhicule' : language === 'en' ? 'Vehicle technical visit' : 'الزيارة الفنية للمركبة',
      'home_technical_visit': language === 'fr' ? 'Diagnostic immobilier' : language === 'en' ? 'Home technical visit' : 'التشخيص العقاري',
      'equipment_inspection': language === 'fr' ? 'Inspection équipements' : language === 'en' ? 'Equipment inspection' : 'فحص المعدات',
      'safety_inspection': language === 'fr' ? 'Contrôle de sécurité' : language === 'en' ? 'Safety inspection' : 'فحص السلامة',
      // Autres
      'birthday_gifts': language === 'fr' ? 'Cadeaux anniversaires' : language === 'en' ? 'Birthday gifts' : 'هدايا أعياد الميلاد',
      'holiday_gifts': language === 'fr' ? 'Cadeaux fêtes' : language === 'en' ? 'Holiday gifts' : 'هدايا الأعياد',
      'special_occasions': language === 'fr' ? 'Occasions spéciales' : language === 'en' ? 'Special occasions' : 'مناسبات خاصة',
      'travel_expenses': language === 'fr' ? 'Frais de voyage' : language === 'en' ? 'Travel expenses' : 'مصاريف السفر',
      'accommodation': language === 'fr' ? 'Hébergement' : language === 'en' ? 'Accommodation' : 'الإقامة',
      'leisure_activities': language === 'fr' ? 'Activités loisirs' : language === 'en' ? 'Leisure activities' : 'أنشطة الترفيه',
    };
    return subcategoryMap[subcategoryValue] || subcategoryValue;
  };

  const getCategoryName = (categoryId: string) => {
    if (!categoryId) return t.selectCategory;
    const subcategory = subcategories.find(sub => sub.value === categoryId);
    if (!subcategory) return t.selectCategory;
    const translatedParent = translateCategory(subcategory.parentCategory);
    const translatedSub = translateSubcategory(subcategory.value);
    return `${translatedParent} - ${translatedSub}`;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView 
          style={[styles.container, { backgroundColor: colors.background.primary }]}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={true}
          nestedScrollEnabled={true}
        >
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.navigate('AnnualChargesList')}
            >
              <Ionicons name="close" size={24} color={colors.text.primary} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: colors.text.primary }]}>
              {form.isIslamic ? t.newIslamicCharge : t.newAnnualCharge}
            </Text>
          </View>

        {/* Type de charge */}
        {form.isIslamic && (
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text.primary }]}>
              {t.islamicChargeType}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typesContainer}>
              {islamicTypes.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.typeButton,
                    form.type === type.value && styles.typeButtonSelected,
                    { backgroundColor: form.type === type.value ? colors.primary[500] : colors.background.card }
                  ]}
                  onPress={() => setForm(prev => ({ ...prev, type: type.value }))}
                >
                  <Text style={[
                    styles.typeText,
                    form.type === type.value && styles.typeTextSelected,
                  ]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Nom de la charge */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text.primary }]}>
            {t.chargeName}
          </Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.background.card, color: colors.text.primary, borderColor: colors.border.primary }]}
            value={form.name}
            onChangeText={(text) => setForm(prev => ({ ...prev, name: text }))}
            placeholder={t.chargeNamePlaceholder}
            placeholderTextColor={colors.text.disabled}
          />
        </View>

        {/* Nom arabe (pour charges islamiques) */}
        {form.isIslamic && (
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text.primary }]}>
              {t.arabicNameOptional}
            </Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background.card, color: colors.text.primary, borderColor: colors.border.primary }]}
              value={form.arabicName}
              onChangeText={(text) => setForm(prev => ({ ...prev, arabicName: text }))}
              placeholder={t.arabicNamePlaceholder}
              placeholderTextColor={colors.text.disabled}
              textAlign="right"
            />
          </View>
        )}

        {/* Montant */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text.primary }]}>
            {t.amount} *
          </Text>
          <View style={styles.amountContainer}>
            <TextInput
              style={[styles.input, styles.amountInput, { backgroundColor: colors.background.card, color: colors.text.primary, borderColor: colors.border.primary }]}
              value={form.amount}
              onChangeText={handleAmountChange}
              placeholder={t.amountPlaceholder}
              placeholderTextColor={colors.text.disabled}
              keyboardType="decimal-pad"
            />
          </View>
          {form.amount && (
            <Text style={[styles.hint, { color: colors.text.secondary }]}>
              {formatDisplayAmount(form.amount)}
            </Text>
          )}
        </View>

        {/* Catégorie */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text.primary }]}>
            {t.category} *
          </Text>
          <TouchableOpacity 
            style={[styles.selectButton, { backgroundColor: colors.background.card, borderColor: colors.border.primary }]}
            onPress={() => setShowCategoryModal(true)}
          >
            <Text style={[styles.selectButtonText, { color: colors.text.primary }]}>
              {form.category ? getCategoryName(form.category) : t.selectCategory}
            </Text>
            <Ionicons name="chevron-down" size={20} color={colors.text.secondary} />
          </TouchableOpacity>
        </View>

        {/* Compte associé */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text.primary }]}>
            {t.associatedAccount}
          </Text>
          <TouchableOpacity 
            style={[styles.selectButton, { backgroundColor: colors.background.card, borderColor: colors.border.primary }]}
            onPress={() => setShowAccountModal(true)}
          >
            <Text style={[styles.selectButtonText, { color: colors.text.primary }]}>
              {getAccountName(form.accountId)}
            </Text>
            <Ionicons name="chevron-down" size={20} color={colors.text.secondary} />
          </TouchableOpacity>
          <Text style={[styles.hint, { color: colors.text.secondary }]}>
            {t.selectAccountHelper}
          </Text>
        </View>

        {/* Prélèvement automatique */}
        {form.accountId && (
          <View style={styles.inputGroup}>
            <View style={styles.switchContainer}>
              <Text style={[styles.label, { color: colors.text.primary }]}>
                {t.autoDeduct}
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
            <Text style={[styles.hint, { color: colors.text.secondary }]}>
              {form.autoDeduct 
                ? t.autoDeductActive
                : t.manualPaymentRequired
              }
            </Text>
          </View>
        )}

        {/* Date d'échéance */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text.primary }]}>
            {t.dueDate} *
          </Text>
          <TouchableOpacity 
            style={[styles.dateButton, { backgroundColor: colors.background.card, borderColor: colors.border.primary }]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={[styles.dateText, { color: colors.text.primary }]}>
              {form.dueDate.toLocaleDateString('fr-FR')}
            </Text>
            <Ionicons name="calendar" size={20} color={colors.text.secondary} />
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
          <Text style={[styles.label, { color: colors.text.primary }]}>
            {t.recurrence}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recurrenceContainer}>
            {recurrenceOptions.map((recurrence) => (
              <TouchableOpacity
                key={recurrence.value}
                style={[
                  styles.recurrenceButton,
                  form.recurrence === recurrence.value && styles.recurrenceButtonSelected,
                  { backgroundColor: form.recurrence === recurrence.value ? colors.primary[500] : colors.background.card, borderColor: colors.border.primary }
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

        {/* Jours de rappel */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text.primary }]}>
            {t.reminderDaysBefore}
          </Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.background.card, color: colors.text.primary, borderColor: colors.border.primary }]}
            value={form.reminderDays}
            onChangeText={(text) => setForm(prev => ({ ...prev, reminderDays: text.replace(/[^0-9]/g, '') }))}
            placeholder={t.reminderPlaceholder}
            placeholderTextColor={colors.text.disabled}
            keyboardType="number-pad"
          />
          <Text style={[styles.hint, { color: colors.text.secondary }]}>
            {t.reminderHelper}
          </Text>
        </View>

        {/* Notes */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text.primary }]}>
            {t.notes}
          </Text>
          <TextInput
            style={[styles.input, styles.textArea, { backgroundColor: colors.background.card, color: colors.text.primary, borderColor: colors.border.primary }]}
            value={form.notes}
            onChangeText={(text) => setForm(prev => ({ ...prev, notes: text }))}
            placeholder={t.notesPlaceholder}
            placeholderTextColor={colors.text.disabled}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Boutons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={[styles.cancelButton, { backgroundColor: colors.background.card, borderColor: colors.border.primary }]}
            onPress={() => navigation.navigate('AnnualCharges', { screen: 'AnnualChargesList' })}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>{t.cancel}</Text>
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
              {loading ? t.creating : t.create}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal de sélection de compte */}
      <Modal
        visible={showAccountModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAccountModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text.primary }]}>
              {t.selectAnAccount}
            </Text>
            <ScrollView style={styles.modalList}>
              {accounts.map(account => (
                <TouchableOpacity
                  key={account.id}
                  style={[
                    styles.modalItem,
                    form.accountId === account.id && styles.modalItemSelected,
                    { backgroundColor: form.accountId === account.id ? colors.primary[500] + '20' : 'transparent', borderColor: colors.border.primary }
                  ]}
                  onPress={() => {
                    setForm(prev => ({ ...prev, accountId: account.id }));
                    setShowAccountModal(false);
                  }}
                >
                  <View style={[styles.colorIndicator, { backgroundColor: account.color }]} />
                  <View style={styles.modalItemInfo}>
                    <Text style={[
                      styles.modalItemText,
                      form.accountId === account.id && styles.modalItemTextSelected,
                      { color: colors.text.primary }
                    ]}>
                      {account.name}
                    </Text>
                    <Text style={[styles.modalItemSubtext, { color: colors.text.secondary }]}>
                      {formatAmount(account.balance)} • {account.type}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity 
              style={[styles.modalCloseButton, { backgroundColor: colors.background.secondary }]}
              onPress={() => setShowAccountModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>{t.close}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de sélection de catégorie */}
      <Modal
        visible={showCategoryModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text.primary }]}>
              {t.selectCategory}
            </Text>
            <ScrollView style={styles.modalList}>
              {subcategories.map(subcategory => (
                <TouchableOpacity
                  key={subcategory.value}
                  style={[
                    styles.modalItem,
                    form.category === subcategory.value && styles.modalItemSelected,
                    { backgroundColor: form.category === subcategory.value ? colors.primary[500] + '20' : 'transparent', borderColor: colors.border.primary }
                  ]}
                  onPress={() => {
                    setForm(prev => ({ ...prev, category: subcategory.value }));
                    setShowCategoryModal(false);
                  }}
                >
                  <Ionicons 
                    name={subcategory.parentIcon as any} 
                    size={20} 
                    color={form.category === subcategory.value ? '#fff' : subcategory.parentColor} 
                  />
                  <View style={styles.categoryTextContainer}>
                    <Text style={[
                      styles.modalItemText,
                      form.category === subcategory.value && styles.modalItemTextSelected,
                      { color: colors.text.primary }
                    ]}>
                      {translateSubcategory(subcategory.value)}
                    </Text>
                    <Text style={[
                      styles.modalItemSubtext,
                      { color: colors.text.secondary }
                    ]}>
                      {translateCategory(subcategory.parentCategory)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity 
              style={[styles.modalCloseButton, { backgroundColor: colors.background.secondary }]}
              onPress={() => setShowCategoryModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>{t.close}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 16,
    paddingBottom: 120,
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
  textArea: {
    minHeight: 80,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountInput: {
    paddingLeft: 10,
  },
  selectButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
  },
  selectButtonText: {
    fontSize: 16,
    color: '#000',
  },
  typesContainer: {
    flexDirection: 'row',
  },
  typeButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
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
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 16,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalList: {
    maxHeight: 300,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  modalItemSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  modalItemInfo: {
    flex: 1,
  },
  categoryTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  modalItemText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  modalItemTextSelected: {
    color: '#fff',
  },
  modalItemSubtext: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  modalCloseButton: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  modalCloseButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
});

export default AddAnnualChargeScreen;