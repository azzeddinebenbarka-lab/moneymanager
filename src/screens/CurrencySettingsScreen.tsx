// src/screens/CurrencySettingsScreen.tsx - VERSION AVEC API TEMPS RÉEL
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Modal,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { CURRENCIES, useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import { useRefresh } from '../context/RefreshContext';
import { useDesignSystem, useTheme } from '../context/ThemeContext';
import { convertCurrency, getAllRates } from '../services/exchangeRateService';

const { width } = Dimensions.get('window');

interface CurrencyOption {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

const CurrencySettingsScreen = ({ navigation }: any) => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const { colors } = useDesignSystem();
  const { currency, setCurrency } = useCurrency();
  const { triggerRefresh } = useRefresh();
  const isDark = theme === 'dark';

  // États pour le convertisseur
  const [amount, setAmount] = useState('1000');
  const [sourceCurrency, setSourceCurrency] = useState('MAD');
  const [targetCurrency, setTargetCurrency] = useState('USD');
  const [convertedAmount, setConvertedAmount] = useState<number>(0);
  const [exchangeRate, setExchangeRate] = useState<number>(0);
  
  // États pour les taux et le chargement
  const [allRates, setAllRates] = useState<{ [key: string]: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  
  // États pour les modals de sélection
  const [showSourcePicker, setShowSourcePicker] = useState(false);
  const [showTargetPicker, setShowTargetPicker] = useState(false);

  const currencies: CurrencyOption[] = [
    { code: 'MAD', name: 'Dirham Marocain', symbol: 'Dh', flag: '🇲🇦' },
    { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
    { code: 'USD', name: 'Dollar américain', symbol: '$', flag: '🇺🇸' },
    { code: 'GBP', name: 'Livre sterling', symbol: '£', flag: '🇬🇧' },
    { code: 'CHF', name: 'Franc suisse', symbol: 'CHF', flag: '🇨🇭' },
    { code: 'JPY', name: 'Yen japonais', symbol: '¥', flag: '🇯🇵' },
    { code: 'CAD', name: 'Dollar canadien', symbol: 'C$', flag: '🇨🇦' },
    { code: 'AUD', name: 'Dollar australien', symbol: 'A$', flag: '🇦🇺' },
    { code: 'CNY', name: 'Yuan chinois', symbol: '¥', flag: '🇨🇳' },
    { code: 'SEK', name: 'Couronne suédoise', symbol: 'kr', flag: '🇸🇪' },
    { code: 'NOK', name: 'Couronne norvégienne', symbol: 'kr', flag: '🇳🇴' },
  ];

  // Charger les taux au montage
  useEffect(() => {
    loadExchangeRates();
  }, []);

  // Calculer la conversion quand les valeurs changent
  useEffect(() => {
    performConversion();
  }, [amount, sourceCurrency, targetCurrency, allRates]);

  const loadExchangeRates = async () => {
    setIsLoading(true);
    try {
      const rates = await getAllRates();
      if (rates) {
        setAllRates(rates);
        setLastUpdate(new Date());
        console.log('✅ Taux de change chargés avec succès');
      }
    } catch (error) {
      console.error('❌ Erreur chargement taux:', error);
      Alert.alert(
        'Erreur',
        'Impossible de charger les taux de change. Vérifiez votre connexion Internet.',
        [{ text: t.ok }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const performConversion = async () => {
    if (!amount || isNaN(parseFloat(amount))) {
      setConvertedAmount(0);
      setExchangeRate(0);
      return;
    }

    try {
      const amountNum = parseFloat(amount);
      const result = await convertCurrency(amountNum, sourceCurrency, targetCurrency);
      setConvertedAmount(result);
      
      // Calculer le taux de change
      if (amountNum !== 0) {
        setExchangeRate(result / amountNum);
      }
    } catch (error) {
      console.error('❌ Erreur conversion:', error);
    }
  };

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadExchangeRates();
    setIsRefreshing(false);
  }, []);

  const handleCurrencyChange = async (currencyCode: string) => {
    const selectedCurrency = CURRENCIES[currencyCode];
    if (selectedCurrency) {
      try {
        await setCurrency(selectedCurrency);
        
        Alert.alert(
          'Devise changée',
          `La devise a été changée en ${selectedCurrency.name}. Tous vos montants sont maintenant affichés en ${selectedCurrency.symbol}.`,
          [{ text: t.ok }]
        );
        
        console.log(`✅ Devise changée en ${selectedCurrency.code}`);
      } catch (error) {
        console.error('❌ Erreur changement devise:', error);
        Alert.alert(t.error, t.cannotChangeCurrency, [{ text: t.ok }]);
      }
    }
  };

  const swapCurrencies = () => {
    const temp = sourceCurrency;
    setSourceCurrency(targetCurrency);
    setTargetCurrency(temp);
  };

  // Modal de sélection de devise
  const CurrencyPickerModal = ({ 
    visible, 
    onClose, 
    onSelect, 
    selectedCode 
  }: { 
    visible: boolean; 
    onClose: () => void; 
    onSelect: (code: string) => void; 
    selectedCode: string;
  }) => (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.background.card }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border.primary }]}>
            <Text style={[styles.modalTitle, { color: colors.text.primary }]}>Sélectionner une devise</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.text.primary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalList}>
            {currencies.map((curr) => (
              <TouchableOpacity
                key={curr.code}
                style={[
                  styles.modalItem,
                  { backgroundColor: curr.code === selectedCode ? colors.primary[100] : colors.background.secondary }
                ]}
                onPress={() => {
                  onSelect(curr.code);
                  onClose();
                }}
              >
                <Text style={styles.currencyFlag}>{curr.flag}</Text>
                <View style={styles.modalItemText}>
                  <Text style={[styles.modalItemName, { color: colors.text.primary }]}>
                    {curr.name}
                  </Text>
                  <Text style={[styles.modalItemCode, { color: colors.text.secondary }]}>
                    {curr.code} • {curr.symbol}
                  </Text>
                </View>
                {curr.code === selectedCode && (
                  <Ionicons name="checkmark-circle" size={24} color={colors.semantic.success} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      {/* Header */}
      <View style={[styles.header, { 
        backgroundColor: colors.background.card, 
        borderBottomColor: colors.border.primary 
      }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Devises</Text>
        <TouchableOpacity 
          style={styles.refreshButton} 
          onPress={handleRefresh}
          disabled={isRefreshing}
        >
          {isRefreshing ? (
            <ActivityIndicator size="small" color={colors.primary[500]} />
          ) : (
            <Ionicons name="refresh" size={24} color={colors.primary[500]} />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Devise actuelle */}
        <View style={[styles.currentCurrencyCard, { backgroundColor: colors.background.card }]}>
          <View style={styles.currentCurrencyHeader}>
            <Ionicons name="wallet" size={24} color={colors.primary[500]} />
            <Text style={[styles.currentCurrencyLabel, { color: colors.text.secondary }]}>
              DEVISE PRINCIPALE
            </Text>
          </View>
          <View style={styles.currentCurrencyContent}>
            <View style={styles.currentCurrencyInfo}>
              <Text style={styles.currencyEmojiLarge}>
                {currencies.find(c => c.code === currency.code)?.flag || '💰'}
              </Text>
              <View>
                <Text style={[styles.currentCurrencyCode, { color: colors.text.primary }]}>
                  {currency.code}
                </Text>
                <Text style={[styles.currentCurrencyName, { color: colors.text.secondary }]}>
                  {currencies.find(c => c.code === currency.code)?.name || currency.name}
                </Text>
              </View>
              <Ionicons name="checkmark-circle" size={24} color={colors.semantic.success} />
            </View>
          </View>
        </View>

        {/* Statut de connexion */}
        {lastUpdate && (
          <View style={[styles.statusCard, { backgroundColor: allRates ? colors.semantic.success + '20' : colors.semantic.error + '20' }]}>
            <Ionicons 
              name={allRates ? "cloud-done" : "cloud-offline"} 
              size={16} 
              color={allRates ? colors.semantic.success : colors.semantic.error} 
            />
            <Text style={[styles.statusText, { color: colors.text.secondary }]}>
              {allRates 
                ? `Taux mis à jour ${lastUpdate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`
                : 'Hors ligne - Utilisation du cache'
              }
            </Text>
          </View>
        )}

        {/* Convertisseur en temps réel */}
        <View style={[styles.converterCard, { backgroundColor: colors.background.card }]}>
          <View style={styles.converterHeader}>
            <Ionicons name="swap-horizontal" size={24} color={colors.primary[500]} />
            <Text style={[styles.converterTitle, { color: colors.text.primary }]}>
              Convertisseur en temps réel
            </Text>
          </View>
          
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary[500]} />
              <Text style={[styles.loadingText, { color: colors.text.secondary }]}>
                Chargement des taux de change...
              </Text>
            </View>
          ) : (
            <>
              {/* Montant source */}
              <View style={styles.converterRow}>
                <View style={styles.converterInputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.text.secondary }]}>Montant</Text>
                  <TextInput
                    style={[styles.amountInput, { backgroundColor: colors.background.secondary, color: colors.text.primary }]}
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="numeric"
                    placeholder="1000"
                    placeholderTextColor={colors.text.disabled}
                  />
                </View>
                
                <TouchableOpacity
                  style={[styles.currencySelector, { backgroundColor: colors.background.secondary }]}
                  onPress={() => setShowSourcePicker(true)}
                >
                  <Text style={styles.currencySelectorFlag}>
                    {currencies.find(c => c.code === sourceCurrency)?.flag}
                  </Text>
                  <Text style={[styles.currencySelectorCode, { color: colors.text.primary }]}>
                    {sourceCurrency}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color={colors.text.primary} />
                </TouchableOpacity>
              </View>

              {/* Bouton swap */}
              <View style={styles.swapContainer}>
                <TouchableOpacity style={[styles.swapButton, { backgroundColor: colors.primary[100] }]} onPress={swapCurrencies}>
                  <Ionicons name="swap-vertical" size={24} color={colors.primary[500]} />
                </TouchableOpacity>
              </View>

              {/* Montant cible */}
              <View style={styles.converterRow}>
                <View style={[styles.resultBox, { backgroundColor: colors.background.secondary }]}>
                  <Text style={[styles.resultLabel, { color: colors.text.secondary }]}>Résultat</Text>
                  <Text style={[styles.resultAmount, { color: colors.primary[500] }]}>
                    {convertedAmount.toLocaleString('fr-FR', { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 2 
                    })}
                  </Text>
                </View>
                
                <TouchableOpacity
                  style={[styles.currencySelector, { backgroundColor: colors.background.secondary }]}
                  onPress={() => setShowTargetPicker(true)}
                >
                  <Text style={styles.currencySelectorFlag}>
                    {currencies.find(c => c.code === targetCurrency)?.flag}
                  </Text>
                  <Text style={[styles.currencySelectorCode, { color: colors.text.primary }]}>
                    {targetCurrency}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color={colors.text.primary} />
                </TouchableOpacity>
              </View>

              {/* Taux de change */}
              {exchangeRate > 0 && (
                <View style={[styles.rateInfo, { backgroundColor: colors.primary[100] }]}>
                  <Ionicons name="information-circle" size={16} color={colors.primary[500]} />
                  <Text style={[styles.rateText, { color: colors.text.secondary }]}>
                    1 {sourceCurrency} = {exchangeRate.toFixed(4)} {targetCurrency}
                  </Text>
                </View>
              )}
            </>
          )}
        </View>

        {/* Changer la devise principale */}
        <View style={styles.section}>
          <View style={[styles.warningBox, { backgroundColor: colors.semantic.warning + '20' }]}>
            <Ionicons name="warning" size={20} color={colors.semantic.warning} />
            <Text style={[styles.warningText, { color: colors.text.primary }]}>
              Changer la devise principale affectera l'affichage de tous vos montants dans l'application.
            </Text>
          </View>

          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Changer la devise principale
          </Text>

          {currencies.map((curr) => (
            <TouchableOpacity
              key={curr.code}
              style={[
                styles.currencyItem,
                { backgroundColor: colors.background.card },
                curr.code === currency.code && { borderWidth: 2, borderColor: colors.semantic.success }
              ]}
              onPress={() => handleCurrencyChange(curr.code)}
            >
              <View style={styles.currencyItemLeft}>
                <Text style={styles.currencyItemFlag}>{curr.flag}</Text>
                <View>
                  <Text style={[styles.currencyItemName, { color: colors.text.primary }]}>
                    {curr.name}
                  </Text>
                  <Text style={[styles.currencyItemCode, { color: colors.text.secondary }]}>
                    {curr.code} • {curr.symbol}
                  </Text>
                </View>
              </View>
              {curr.code === currency.code && (
                <Ionicons name="checkmark-circle" size={24} color={colors.semantic.success} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Modals de sélection */}
      <CurrencyPickerModal
        visible={showSourcePicker}
        onClose={() => setShowSourcePicker(false)}
        onSelect={setSourceCurrency}
        selectedCode={sourceCurrency}
      />
      <CurrencyPickerModal
        visible={showTargetPicker}
        onClose={() => setShowTargetPicker(false)}
        onSelect={setTargetCurrency}
        selectedCode={targetCurrency}
      />
    </View>
  );
};

export default CurrencySettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginRight: 40,
  },
  refreshButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  
  // Devise actuelle
  currentCurrencyCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  currentCurrencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  currentCurrencyLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  currentCurrencyContent: {
    gap: 12,
  },
  currentCurrencyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  currencyEmojiLarge: {
    fontSize: 32,
  },
  currentCurrencyCode: {
    fontSize: 28,
    fontWeight: '700',
  },
  currentCurrencyName: {
    fontSize: 14,
    marginTop: 4,
  },
  
  // Statut
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  statusText: {
    fontSize: 12,
  },
  
  // Convertisseur
  converterCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  converterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },
  converterTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
  },
  converterRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: 12,
  },
  converterInputGroup: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 8,
  },
  amountInput: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 20,
    fontWeight: '600',
    height: 52,
  },
  currencySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 6,
    minWidth: 110,
  },
  currencySelectorFlag: {
    fontSize: 18,
  },
  currencySelectorCode: {
    fontSize: 15,
    fontWeight: '600',
  },
  swapContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  swapButton: {
    borderRadius: 24,
    padding: 12,
  },
  resultBox: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
    height: 52,
  },
  resultLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  resultAmount: {
    fontSize: 20,
    fontWeight: '700',
  },
  rateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    gap: 8,
  },
  rateText: {
    fontSize: 12,
  },
  
  // Section
  section: {
    marginTop: 8,
    marginBottom: 32,
  },
  warningBox: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    gap: 12,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  
  // Liste des devises
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  currencyItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  currencyItemFlag: {
    fontSize: 28,
  },
  currencyItemName: {
    fontSize: 16,
    fontWeight: '500',
  },
  currencyItemCode: {
    fontSize: 12,
    marginTop: 2,
  },
  currencyFlag: {
    fontSize: 24,
  },
  
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalList: {
    padding: 16,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
  },
  modalItemText: {
    flex: 1,
  },
  modalItemName: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalItemCode: {
    fontSize: 12,
    marginTop: 2,
  },
});
