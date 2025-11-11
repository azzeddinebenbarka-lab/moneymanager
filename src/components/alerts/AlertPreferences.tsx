// src/components/alerts/AlertPreferences.tsx - VERSION AVEC SYNCHRONISATION
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { secureStorage } from '../../services/storage/secureStorage';

// Types améliorés
export interface AlertPreferencesData {
  // Catégories d'alertes
  categories: {
    netWorth: boolean;
    savings: boolean;
    debts: boolean;
    annualCharges: boolean;
    accounts: boolean;
    budgets: boolean;
    spending: boolean;
    financialHealth: boolean;
  };
  
  // Types spécifiques
  types: {
    // Patrimoine
    negativeNetWorth: boolean;
    
    // Épargne
    savingsGoalAlmostReached: boolean;
    savingsGoalReached: boolean;
    
    // Dettes
    debtPaymentMissed: boolean;
    debtDueSoon: boolean;
    
    // Charges
    annualChargeUpcoming: boolean;
    
    // Comptes
    lowBalance: boolean;
    negativeBalance: boolean;
    
    // Budgets
    budgetExceeded: boolean;
    budgetAlmostExceeded: boolean;
    
    // Dépenses
    unusualSpending: boolean;
    
    // Santé financière
    financialHealthImprovement: boolean;
    financialHealthDecline: boolean;
  };
  
  // Préférences de notification
  notifications: {
    pushEnabled: boolean;
    soundEnabled: boolean;
    vibrationEnabled: boolean;
    badgeEnabled: boolean;
    priorityFilter: 'all' | 'critical_high' | 'critical_only';
  };
  
  // Planification
  scheduling: {
    immediateAlerts: boolean;
    dailySummary: boolean;
    weeklyReport: boolean;
    monthlyReview: boolean;
    smartChecks: boolean;
  };
  
  // Seuils personnalisés
  thresholds: {
    lowBalance: number;
    budgetWarning: number;
    unusualSpending: number;
    savingsGoalWarning: number;
    debtReminderDays: number;
    chargeReminderDays: number;
  };
}

interface AlertPreferencesProps {
  preferences: AlertPreferencesData;
  onPreferencesChange: (preferences: AlertPreferencesData) => void;
  onSave?: () => void;
  onReset?: () => void;
}

// Valeurs par défaut
const DEFAULT_PREFERENCES: AlertPreferencesData = {
  categories: {
    netWorth: true,
    savings: true,
    debts: true,
    annualCharges: true,
    accounts: true,
    budgets: true,
    spending: true,
    financialHealth: true,
  },
  types: {
    negativeNetWorth: true,
    savingsGoalAlmostReached: true,
    savingsGoalReached: true,
    debtPaymentMissed: true,
    debtDueSoon: true,
    annualChargeUpcoming: true,
    lowBalance: true,
    negativeBalance: true,
    budgetExceeded: true,
    budgetAlmostExceeded: true,
    unusualSpending: true,
    financialHealthImprovement: true,
    financialHealthDecline: true,
  },
  notifications: {
    pushEnabled: true,
    soundEnabled: true,
    vibrationEnabled: true,
    badgeEnabled: true,
    priorityFilter: 'critical_high',
  },
  scheduling: {
    immediateAlerts: true,
    dailySummary: true,
    weeklyReport: true,
    monthlyReview: true,
    smartChecks: true,
  },
  thresholds: {
    lowBalance: 50,
    budgetWarning: 90,
    unusualSpending: 200,
    savingsGoalWarning: 90,
    debtReminderDays: 7,
    chargeReminderDays: 30,
  },
};

export const AlertPreferences = ({ 
  preferences, 
  onPreferencesChange,
  onSave,
  onReset
}: AlertPreferencesProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Charger les préférences sauvegardées
  useEffect(() => {
    loadSavedPreferences();
  }, []);

  const loadSavedPreferences = async () => {
    try {
      const saved = await secureStorage.getItem('alert_preferences');
      if (saved) {
        const parsed = JSON.parse(saved);
        onPreferencesChange({ ...DEFAULT_PREFERENCES, ...parsed });
      }
    } catch (error) {
      console.error('Error loading alert preferences:', error);
    }
  };

  const savePreferences = async () => {
    try {
      await secureStorage.setItem('alert_preferences', JSON.stringify(preferences));
      setHasUnsavedChanges(false);
      if (onSave) onSave();
      Alert.alert('Succès', 'Préférences sauvegardées avec succès');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de sauvegarder les préférences');
    }
  };

  const updatePreference = (path: string, value: any) => {
    const keys = path.split('.');
    const newPreferences = JSON.parse(JSON.stringify(preferences));
    
    let current = newPreferences;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;

    // Logique de dépendance
    applyDependencyLogic(newPreferences, path, value);
    
    setHasUnsavedChanges(true);
    onPreferencesChange(newPreferences);
  };

  const applyDependencyLogic = (prefs: AlertPreferencesData, path: string, value: boolean) => {
    // Si une catégorie est désactivée, désactiver tous ses types
    if (path.startsWith('categories.')) {
      const category = path.split('.')[1];
      if (!value) {
        // Désactiver tous les types de cette catégorie
        Object.keys(prefs.types).forEach(typeKey => {
          if (shouldDisableType(category, typeKey)) {
            prefs.types[typeKey as keyof typeof prefs.types] = false;
          }
        });
      }
    }

    // Si les notifications push sont désactivées, désactiver le son et les vibrations
    if (path === 'notifications.pushEnabled' && !value) {
      prefs.notifications.soundEnabled = false;
      prefs.notifications.vibrationEnabled = false;
      prefs.notifications.badgeEnabled = false;
    }

    // Si les vérifications intelligentes sont désactivées, désactiver les alertes immédiates
    if (path === 'scheduling.smartChecks' && !value) {
      prefs.scheduling.immediateAlerts = false;
    }
  };

  const shouldDisableType = (category: string, typeKey: string): boolean => {
    const categoryMapping: Record<string, string[]> = {
      netWorth: ['negativeNetWorth'],
      savings: ['savingsGoalAlmostReached', 'savingsGoalReached'],
      debts: ['debtPaymentMissed', 'debtDueSoon'],
      annualCharges: ['annualChargeUpcoming'],
      accounts: ['lowBalance', 'negativeBalance'],
      budgets: ['budgetExceeded', 'budgetAlmostExceeded'],
      spending: ['unusualSpending'],
      financialHealth: ['financialHealthImprovement', 'financialHealthDecline'],
    };
    
    return categoryMapping[category]?.includes(typeKey) || false;
  };

  const resetToDefaults = () => {
    Alert.alert(
      'Réinitialiser',
      'Êtes-vous sûr de vouloir restaurer les paramètres par défaut ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Réinitialiser', 
          style: 'destructive',
          onPress: () => {
            onPreferencesChange(DEFAULT_PREFERENCES);
            setHasUnsavedChanges(true);
            if (onReset) onReset();
          }
        }
      ]
    );
  };

  const enableAll = () => {
    const allEnabled = JSON.parse(JSON.stringify(DEFAULT_PREFERENCES));
    onPreferencesChange(allEnabled);
    setHasUnsavedChanges(true);
  };

  const disableAll = () => {
    const allDisabled = JSON.parse(JSON.stringify(DEFAULT_PREFERENCES));
    
    // Désactiver toutes les catégories et types
    Object.keys(allDisabled.categories).forEach(key => {
      allDisabled.categories[key as keyof typeof allDisabled.categories] = false;
    });
    Object.keys(allDisabled.types).forEach(key => {
      allDisabled.types[key as keyof typeof allDisabled.types] = false;
    });
    
    // Désactiver les notifications
    allDisabled.notifications.pushEnabled = false;
    allDisabled.notifications.soundEnabled = false;
    allDisabled.notifications.vibrationEnabled = false;
    allDisabled.notifications.badgeEnabled = false;
    
    // Désactiver la planification
    allDisabled.scheduling.immediateAlerts = false;
    allDisabled.scheduling.dailySummary = false;
    allDisabled.scheduling.weeklyReport = false;
    allDisabled.scheduling.monthlyReview = false;
    allDisabled.scheduling.smartChecks = false;

    onPreferencesChange(allDisabled);
    setHasUnsavedChanges(true);
  };

  // Composants réutilisables
  const PreferenceSwitch = ({ 
    label, 
    description,
    value,
    onValueChange,
    disabled = false,
    emoji = '⚙️'
  }: {
    label: string;
    description?: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
    disabled?: boolean;
    emoji?: string;
  }) => (
    <View style={[
      styles.preferenceItem,
      disabled && styles.preferenceItemDisabled
    ]}>
      <View style={styles.preferenceLeft}>
        <Text style={styles.preferenceEmoji}>{emoji}</Text>
        <View style={styles.preferenceText}>
          <Text style={[
            styles.preferenceLabel,
            isDark && styles.darkText,
            disabled && styles.preferenceTextDisabled
          ]}>
            {label}
          </Text>
          {description && (
            <Text style={[
              styles.preferenceDescription,
              isDark && styles.darkSubtext,
              disabled && styles.preferenceTextDisabled
            ]}>
              {description}
            </Text>
          )}
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ false: isDark ? '#38383a' : '#f0f0f0', true: '#007AFF' }}
        thumbColor={value ? '#fff' : isDark ? '#888' : '#f4f3f4'}
      />
    </View>
  );

  const Section = ({ 
    title, 
    description,
    children 
  }: { 
    title: string; 
    description?: string;
    children: React.ReactNode;
  }) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, isDark && styles.darkText]}>
          {title}
        </Text>
        {description && (
          <Text style={[styles.sectionDescription, isDark && styles.darkSubtext]}>
            {description}
          </Text>
        )}
      </View>
      <View style={[styles.sectionContent, isDark && styles.darkSectionContent]}>
        {children}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
      {/* En-tête avec actions */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, isDark && styles.darkText]}>
          Préférences des Alertes
        </Text>
        {hasUnsavedChanges && (
          <Text style={styles.unsavedIndicator}>●</Text>
        )}
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Catégories d'alertes */}
        <Section 
          title="📊 Catégories d'Alertes" 
          description="Choisissez les types d'alertes que vous souhaitez recevoir"
        >
          <PreferenceSwitch
            emoji="💰"
            label="Patrimoine net"
            description="Alertes concernant votre situation patrimoniale"
            value={preferences.categories.netWorth}
            onValueChange={(value) => updatePreference('categories.netWorth', value)}
          />
          <PreferenceSwitch
            emoji="🎯"
            label="Objectifs d'épargne"
            description="Progression et atteinte de vos objectifs d'épargne"
            value={preferences.categories.savings}
            onValueChange={(value) => updatePreference('categories.savings', value)}
          />
          <PreferenceSwitch
            emoji="💳"
            label="Dettes et prêts"
            description="Échéances et retards de paiement"
            value={preferences.categories.debts}
            onValueChange={(value) => updatePreference('categories.debts', value)}
          />
          <PreferenceSwitch
            emoji="📅"
            label="Charges annuelles"
            description="Rappels pour vos charges récurrentes"
            value={preferences.categories.annualCharges}
            onValueChange={(value) => updatePreference('categories.annualCharges', value)}
          />
          <PreferenceSwitch
            emoji="💎"
            label="État des comptes"
            description="Soldes faibles et découverts"
            value={preferences.categories.accounts}
            onValueChange={(value) => updatePreference('categories.accounts', value)}
          />
          <PreferenceSwitch
            emoji="📈"
            label="Budgets"
            description="Dépassements et alertes de budget"
            value={preferences.categories.budgets}
            onValueChange={(value) => updatePreference('categories.budgets', value)}
          />
          <PreferenceSwitch
            emoji="🔍"
            label="Analyse des dépenses"
            description="Dépenses inhabituelles et patterns"
            value={preferences.categories.spending}
            onValueChange={(value) => updatePreference('categories.spending', value)}
          />
          <PreferenceSwitch
            emoji="❤️"
            label="Santé financière"
            description="Évolution de votre santé financière"
            value={preferences.categories.financialHealth}
            onValueChange={(value) => updatePreference('categories.financialHealth', value)}
          />
        </Section>

        {/* Types spécifiques */}
        <Section 
          title="🎯 Types d'Alertes Spécifiques" 
          description="Personnalisez les alertes que vous recevez"
        >
          <PreferenceSwitch
            emoji="🚨"
            label="Patrimoine négatif"
            description="Alerte si votre patrimoine devient négatif"
            value={preferences.types.negativeNetWorth}
            onValueChange={(value) => updatePreference('types.negativeNetWorth', value)}
            disabled={!preferences.categories.netWorth}
          />
          <PreferenceSwitch
            emoji="⚠️"
            label="Budget presque épuisé"
            description="Alerte à 90% de votre budget"
            value={preferences.types.budgetAlmostExceeded}
            onValueChange={(value) => updatePreference('types.budgetAlmostExceeded', value)}
            disabled={!preferences.categories.budgets}
          />
          <PreferenceSwitch
            emoji="🔔"
            label="Dépense inhabituelle"
            description="Alerte pour les dépenses anormalement élevées"
            value={preferences.types.unusualSpending}
            onValueChange={(value) => updatePreference('types.unusualSpending', value)}
            disabled={!preferences.categories.spending}
          />
        </Section>

        {/* Notifications */}
        <Section 
          title="🔔 Préférences de Notification" 
          description="Configurez comment vous recevez les alertes"
        >
          <PreferenceSwitch
            emoji="📱"
            label="Notifications push"
            description="Recevoir des notifications sur votre appareil"
            value={preferences.notifications.pushEnabled}
            onValueChange={(value) => updatePreference('notifications.pushEnabled', value)}
          />
          <PreferenceSwitch
            emoji="🔊"
            label="Son"
            description="Jouer un son pour les notifications"
            value={preferences.notifications.soundEnabled}
            onValueChange={(value) => updatePreference('notifications.soundEnabled', value)}
            disabled={!preferences.notifications.pushEnabled}
          />
          <PreferenceSwitch
            emoji="📳"
            label="Vibration"
            description="Vibrer pour les notifications importantes"
            value={preferences.notifications.vibrationEnabled}
            onValueChange={(value) => updatePreference('notifications.vibrationEnabled', value)}
            disabled={!preferences.notifications.pushEnabled}
          />
        </Section>

        {/* Planification */}
        <Section 
          title="⏰ Planification" 
          description="Quand et comment recevoir les alertes"
        >
          <PreferenceSwitch
            emoji="⚡"
            label="Alertes immédiates"
            description="Alertes en temps réel pour les événements critiques"
            value={preferences.scheduling.immediateAlerts}
            onValueChange={(value) => updatePreference('scheduling.immediateAlerts', value)}
          />
          <PreferenceSwitch
            emoji="🧠"
            label="Vérifications intelligentes"
            description="Analyses automatiques pour détecter les problèmes"
            value={preferences.scheduling.smartChecks}
            onValueChange={(value) => updatePreference('scheduling.smartChecks', value)}
          />
          <PreferenceSwitch
            emoji="📊"
            label="Résumé quotidien"
            description="Reçu chaque matin à 8h00"
            value={preferences.scheduling.dailySummary}
            onValueChange={(value) => updatePreference('scheduling.dailySummary', value)}
          />
        </Section>

        {/* Actions globales */}
        <Section title="⚡ Actions Rapides">
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.enableAllButton]}
              onPress={enableAll}
            >
              <Text style={styles.actionButtonText}>Tout Activer</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.disableAllButton]}
              onPress={disableAll}
            >
              <Text style={styles.actionButtonText}>Tout Désactiver</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.resetButton]}
              onPress={resetToDefaults}
            >
              <Text style={styles.actionButtonText}>Par Défaut</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.saveButton]}
              onPress={savePreferences}
              disabled={!hasUnsavedChanges}
            >
              <Text style={[
                styles.actionButtonText,
                !hasUnsavedChanges && styles.saveButtonTextDisabled
              ]}>
                Sauvegarder
              </Text>
            </TouchableOpacity>
          </View>
        </Section>

        <View style={styles.spacer} />
      </ScrollView>
    </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  darkHeader: {
    borderBottomColor: '#38383a',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  unsavedIndicator: {
    color: '#FF9500',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 8,
  },
  sectionHeader: {
    padding: 20,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  sectionContent: {
    backgroundColor: '#f8f9fa',
    borderRadius: 0,
  },
  darkSectionContent: {
    backgroundColor: '#2c2c2e',
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  preferenceItemDisabled: {
    opacity: 0.5,
  },
  preferenceLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  preferenceEmoji: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  preferenceText: {
    flex: 1,
  },
  preferenceLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
  },
  preferenceDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  preferenceTextDisabled: {
    color: '#999',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  enableAllButton: {
    backgroundColor: '#34C759',
  },
  disableAllButton: {
    backgroundColor: '#FF3B30',
  },
  resetButton: {
    backgroundColor: '#8E8E93',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  saveButtonTextDisabled: {
    opacity: 0.5,
  },
  spacer: {
    height: 20,
  },
  darkText: {
    color: '#fff',
  },
  darkSubtext: {
    color: '#888',
  },
});

export default AlertPreferences;