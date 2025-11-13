// src/screens/islamic/IslamicSettingsSection.tsx - VERSION COMPLÈTEMENT CORRIGÉE
import React, { useEffect, useState } from 'react';
import {
    Alert,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useCurrency } from '../../context/CurrencyContext';
import { useTheme } from '../../context/ThemeContext';
import { useIslamicCharges } from '../../hooks/useIslamicCharges';

const IslamicSettingsSection: React.FC = () => {
  const { theme } = useTheme();
  const { formatAmount } = useCurrency();
  const {
    settings,
    isLoading,
    enableIslamicCharges,
    disableIslamicCharges,
    updateDefaultAmount,
    toggleIncludeRecommended,
    toggleAutoCreateCharges,
    generateChargesForCurrentYear,
    availableHolidays,
    customCharges,
    addCustomCharge,
    removeCustomCharge,
    getSafeAmount,
    loadSettings
  } = useIslamicCharges();

  const isDark = theme === 'dark';
  const [localAmounts, setLocalAmounts] = useState(settings.defaultAmounts);
  const [newCustomCharge, setNewCustomCharge] = useState({
    name: '',
    arabicName: '',
    description: '',
    amount: 0,
    type: 'custom' as 'obligatory' | 'recommended' | 'custom'
  });

  useEffect(() => {
    setLocalAmounts(settings.defaultAmounts);
  }, [settings.defaultAmounts]);

  const handleAmountChange = (type: 'obligatory' | 'recommended' | 'custom', value: string) => {
    const amount = parseFloat(value) || 0;
    setLocalAmounts(prev => ({
      ...prev,
      [type]: amount
    }));
  };

  const saveAmount = (type: 'obligatory' | 'recommended' | 'custom') => {
    updateDefaultAmount(type, localAmounts[type]);
  };

  const handleToggleIslamicCharges = async () => {
    if (settings.isEnabled) {
      Alert.alert(
        'Désactiver les charges islamiques',
        'Êtes-vous sûr de vouloir désactiver les charges islamiques ? Les charges existantes seront conservées mais aucune nouvelle charge ne sera générée automatiquement.',
        [
          { text: 'Annuler', style: 'cancel' },
          { 
            text: 'Désactiver', 
            style: 'destructive',
            onPress: disableIslamicCharges
          }
        ]
      );
    } else {
      try {
        await enableIslamicCharges();
        Alert.alert(
          'Charges islamiques activées',
          'Les charges islamiques ont été activées. Les charges pour cette année seront générées automatiquement.',
          [{ text: 'OK' }]
        );
      } catch (error) {
        Alert.alert('Erreur', 'Impossible d\'activer les charges islamiques');
      }
    }
  };

  const handleGenerateCharges = async () => {
    try {
      await generateChargesForCurrentYear();
      Alert.alert(
        'Succès',
        'Les charges islamiques ont été générées avec succès.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert(
        'Erreur',
        'Une erreur est survenue lors de la génération des charges.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleAddCustomCharge = () => {
    if (!newCustomCharge.name.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir un nom pour la charge personnalisée.');
      return;
    }

    addCustomCharge({
      name: newCustomCharge.name,
      arabicName: newCustomCharge.arabicName,
      description: newCustomCharge.description,
      hijriMonth: 1,
      hijriDay: 1,
      type: newCustomCharge.type,
      defaultAmount: newCustomCharge.amount,
      isRecurring: true
    });

    setNewCustomCharge({
      name: '',
      arabicName: '',
      description: '',
      amount: 0,
      type: 'custom'
    });

    Alert.alert('Succès', 'Charge personnalisée ajoutée avec succès.');
  };

  const handleRemoveCustomCharge = (chargeId: string, chargeName: string) => {
    Alert.alert(
      'Supprimer la charge',
      `Êtes-vous sûr de vouloir supprimer la charge "${chargeName}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Supprimer', 
          style: 'destructive',
          onPress: () => removeCustomCharge(chargeId)
        }
      ]
    );
  };

  const handleReloadSettings = async () => {
    await loadSettings();
    Alert.alert('Succès', 'Paramètres rechargés.');
  };

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, isDark && styles.darkText]}>
        🕌 Charges Islamiques
      </Text>

      {/* Activation des charges islamiques */}
      <View style={[styles.settingItem, isDark && styles.darkSettingItem]}>
        <View style={styles.settingInfo}>
          <Text style={[styles.settingLabel, isDark && styles.darkText]}>
            Activer les charges islamiques
          </Text>
          <Text style={[styles.settingDescription, isDark && styles.darkSubtext]}>
            Gérer automatiquement les charges liées aux fêtes musulmanes
          </Text>
        </View>
        <Switch
          value={settings.isEnabled}
          onValueChange={handleToggleIslamicCharges}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={settings.isEnabled ? '#f5dd4b' : '#f4f3f4'}
        />
      </View>

      {settings.isEnabled && (
        <>
          {/* Montants par défaut */}
          <View style={[styles.amountsSection, isDark && styles.darkCard]}>
            <Text style={[styles.subsectionTitle, isDark && styles.darkText]}>
              Montants par défaut
            </Text>

            {(['obligatory', 'recommended', 'custom'] as const).map((type) => (
              <View key={type} style={styles.amountInput}>
                <Text style={[styles.amountLabel, isDark && styles.darkSubtext]}>
                  {type === 'obligatory' ? 'Obligatoires' : 
                   type === 'recommended' ? 'Recommandées' : 'Personnalisées'}
                </Text>
                <View style={styles.amountInputRow}>
                  <TextInput
                    style={[styles.input, isDark && styles.darkInput]}
                    value={localAmounts[type].toString()}
                    onChangeText={(value) => handleAmountChange(type, value)}
                    onBlur={() => saveAmount(type)}
                    keyboardType="numeric"
                    placeholder="0"
                  />
                  <Text style={[styles.currency, isDark && styles.darkSubtext]}>
                    {formatAmount(localAmounts[type]).split(' ')[0]}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Paramètres avancés */}
          <View style={[styles.settingsGroup, isDark && styles.darkCard]}>
            <Text style={[styles.subsectionTitle, isDark && styles.darkText]}>
              Paramètres
            </Text>

            <View style={[styles.settingItem, isDark && styles.darkSettingItem]}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, isDark && styles.darkText]}>
                  Inclure les charges recommandées
                </Text>
                <Text style={[styles.settingDescription, isDark && styles.darkSubtext]}>
                  Achoura, Mawlid, etc.
                </Text>
              </View>
              <Switch
                value={settings.includeRecommended}
                onValueChange={toggleIncludeRecommended}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={settings.includeRecommended ? '#f5dd4b' : '#f4f3f4'}
              />
            </View>

            <View style={[styles.settingItem, isDark && styles.darkSettingItem]}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, isDark && styles.darkText]}>
                  Création automatique
                </Text>
                <Text style={[styles.settingDescription, isDark && styles.darkSubtext]}>
                  Générer les charges automatiquement chaque année
                </Text>
              </View>
              <Switch
                value={settings.autoCreateCharges}
                onValueChange={toggleAutoCreateCharges}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={settings.autoCreateCharges ? '#f5dd4b' : '#f4f3f4'}
              />
            </View>
          </View>

          {/* Charges prédéfinies */}
          <View style={[styles.holidaysSection, isDark && styles.darkCard]}>
            <Text style={[styles.subsectionTitle, isDark && styles.darkText]}>
              Fêtes Islamiques
            </Text>
            {availableHolidays.map(holiday => (
              <View key={holiday.id} style={styles.holidayItem}>
                <View style={styles.holidayInfo}>
                  <Text style={[styles.holidayName, isDark && styles.darkText]}>
                    {holiday.name}
                  </Text>
                  <Text style={[styles.holidayArabic, isDark && styles.darkSubtext]}>
                    {holiday.arabicName}
                  </Text>
                  <Text style={[styles.holidayDescription, isDark && styles.darkSubtext]}>
                    {holiday.description}
                  </Text>
                  <Text style={[styles.holidayAmount, isDark && styles.darkSubtext]}>
                    Montant: {formatAmount(getSafeAmount(holiday))}
                  </Text>
                </View>
                <View style={[
                  styles.typeBadge,
                  holiday.type === 'obligatory' ? styles.obligatoryBadge : 
                  holiday.type === 'recommended' ? styles.recommendedBadge : styles.customBadge
                ]}>
                  <Text style={styles.typeText}>
                    {holiday.type === 'obligatory' ? 'Obligatoire' : 
                     holiday.type === 'recommended' ? 'Recommandé' : 'Personnalisé'}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Charges personnalisées */}
          <View style={[styles.customChargesSection, isDark && styles.darkCard]}>
            <Text style={[styles.subsectionTitle, isDark && styles.darkText]}>
              Charges Personnalisées
            </Text>

            {/* Formulaire d'ajout */}
            <View style={styles.addCustomForm}>
              <TextInput
                style={[styles.input, isDark && styles.darkInput]}
                placeholder="Nom de la charge"
                value={newCustomCharge.name}
                onChangeText={(text) => setNewCustomCharge(prev => ({ ...prev, name: text }))}
              />
              <TextInput
                style={[styles.input, isDark && styles.darkInput]}
                placeholder="Nom en arabe (optionnel)"
                value={newCustomCharge.arabicName}
                onChangeText={(text) => setNewCustomCharge(prev => ({ ...prev, arabicName: text }))}
              />
              <TextInput
                style={[styles.input, isDark && styles.darkInput]}
                placeholder="Description"
                value={newCustomCharge.description}
                onChangeText={(text) => setNewCustomCharge(prev => ({ ...prev, description: text }))}
              />
              <TextInput
                style={[styles.input, isDark && styles.darkInput]}
                placeholder="Montant"
                value={newCustomCharge.amount.toString()}
                onChangeText={(text) => setNewCustomCharge(prev => ({ ...prev, amount: parseFloat(text) || 0 }))}
                keyboardType="numeric"
              />
              <TouchableOpacity 
                style={styles.addButton}
                onPress={handleAddCustomCharge}
              >
                <Text style={styles.addButtonText}>Ajouter la charge</Text>
              </TouchableOpacity>
            </View>

            {/* Liste des charges personnalisées */}
            {customCharges.map(charge => (
              <View key={charge.id} style={styles.customChargeItem}>
                <View style={styles.customChargeInfo}>
                  <Text style={[styles.customChargeName, isDark && styles.darkText]}>
                    {charge.name}
                  </Text>
                  {charge.arabicName && (
                    <Text style={[styles.customChargeArabic, isDark && styles.darkSubtext]}>
                      {charge.arabicName}
                    </Text>
                  )}
                  <Text style={[styles.customChargeDescription, isDark && styles.darkSubtext]}>
                    {charge.description}
                  </Text>
                  <Text style={[styles.customChargeAmount, isDark && styles.darkText]}>
                    {formatAmount(charge.defaultAmount || 0)}
                  </Text>
                </View>
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => handleRemoveCustomCharge(charge.id, charge.name)}
                >
                  <Text style={styles.deleteButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Actions */}
          <View style={styles.actionsSection}>
            <TouchableOpacity 
              style={styles.generateButton}
              onPress={handleGenerateCharges}
              disabled={isLoading}
            >
              <Text style={styles.generateButtonText}>
                {isLoading ? 'Génération...' : 'Générer les charges cette année'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.reloadButton}
              onPress={handleReloadSettings}
            >
              <Text style={styles.reloadButtonText}>
                Recharger les paramètres
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  darkSettingItem: {
    backgroundColor: '#2c2c2e',
  },
  settingInfo: {
    flex: 1,
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  amountsSection: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  settingsGroup: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  holidaysSection: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  customChargesSection: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  darkCard: {
    backgroundColor: '#2c2c2e',
  },
  amountInput: {
    marginBottom: 12,
  },
  amountLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  amountInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 8,
    marginRight: 8,
    backgroundColor: '#fff',
  },
  darkInput: {
    backgroundColor: '#3a3a3c',
    borderColor: '#555',
    color: '#fff',
  },
  currency: {
    fontSize: 14,
    color: '#666',
    minWidth: 60,
  },
  holidayItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  holidayInfo: {
    flex: 1,
    marginRight: 12,
  },
  holidayName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  holidayArabic: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  holidayDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 14,
    marginBottom: 4,
  },
  holidayAmount: {
    fontSize: 11,
    color: '#666',
    fontStyle: 'italic',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  obligatoryBadge: {
    backgroundColor: '#FFE5E5',
  },
  recommendedBadge: {
    backgroundColor: '#E5F3FF',
  },
  customBadge: {
    backgroundColor: '#F0F0F0',
  },
  typeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  addCustomForm: {
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  customChargeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  customChargeInfo: {
    flex: 1,
    marginRight: 12,
  },
  customChargeName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  customChargeArabic: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  customChargeDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  customChargeAmount: {
    fontSize: 12,
    color: '#000',
    fontWeight: '500',
  },
  deleteButton: {
    padding: 6,
  },
  deleteButtonText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionsSection: {
    marginTop: 16,
    gap: 12,
  },
  generateButton: {
    backgroundColor: '#34C759',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  generateButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  reloadButton: {
    backgroundColor: '#8E8E93',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  reloadButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  darkText: {
    color: '#fff',
  },
  darkSubtext: {
    color: '#888',
  },
});

export default IslamicSettingsSection;