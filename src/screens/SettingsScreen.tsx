import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from '../components/SafeAreaView';
import { useTheme } from '../context/ThemeContext';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const { theme, toggleTheme } = useTheme();
  
  const [settings, setSettings] = useState({
    // Notifications
    budgetAlerts: true,
    paymentReminders: true,
    monthlyReports: true,
    securityAlerts: true,
    
    // Sécurité
    biometricAuth: false,
    autoLock: true,
    dataBackup: true,
    
    // Général
    currency: 'EUR',
    language: 'fr',
    weeklyReports: false,
  });

  const isDark = theme === 'dark';

  const handleSettingToggle = (setting: keyof typeof settings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
    
    // Logique de sauvegarde des paramètres
    console.log(`🔄 Paramètre modifié: ${setting} = ${value}`);
  };

  const handleExportData = () => {
    Alert.alert(
      'Exporter les données',
      'Voulez-vous exporter toutes vos données financières ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Exporter', 
          onPress: () => {
            console.log('📤 Export des données...');
            // Implémenter l'export
          }
        },
      ]
    );
  };

  const handleBackup = () => {
    Alert.alert(
      'Sauvegarde',
      'Sauvegarder vos données localement ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Sauvegarder', 
          onPress: () => {
            console.log('💾 Sauvegarde des données...');
            // Implémenter la sauvegarde
          }
        },
      ]
    );
  };

  const handleReset = () => {
    Alert.alert(
      'Réinitialisation',
      'Cette action supprimera toutes vos données. Êtes-vous sûr ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Réinitialiser', 
          style: 'destructive',
          onPress: () => {
            console.log('🔄 Réinitialisation des données...');
            // Implémenter la réinitialisation
          }
        },
      ]
    );
  };

  const SettingsSection = ({ 
    title, 
    children 
  }: { 
    title: string; 
    children: React.ReactNode;
  }) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, isDark && styles.darkText]}>
        {title}
      </Text>
      <View style={[styles.sectionContent, isDark && styles.darkSectionContent]}>
        {children}
      </View>
    </View>
  );

  const SettingItem = ({ 
    icon, 
    title, 
    description, 
    rightElement 
  }: {
    icon: string;
    title: string;
    description?: string;
    rightElement: React.ReactNode;
  }) => (
    <View style={[styles.settingItem, isDark && styles.darkSettingItem]}>
      <View style={styles.settingLeft}>
        <View style={[styles.settingIcon, isDark && styles.darkSettingIcon]}>
          <Ionicons name={icon as any} size={20} color={isDark ? "#fff" : "#007AFF"} />
        </View>
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, isDark && styles.darkText]}>
            {title}
          </Text>
          {description && (
            <Text style={[styles.settingDescription, isDark && styles.darkSubtext]}>
              {description}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.settingRight}>
        {rightElement}
      </View>
    </View>
  );

  const SwitchSetting = ({ 
    icon, 
    title, 
    description, 
    value, 
    onValueChange 
  }: {
    icon: string;
    title: string;
    description?: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
  }) => (
    <SettingItem
      icon={icon}
      title={title}
      description={description}
      rightElement={
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: isDark ? '#38383a' : '#f0f0f0', true: '#007AFF' }}
          thumbColor={value ? '#fff' : isDark ? '#888' : '#f4f3f4'}
        />
      }
    />
  );

  return (
    <SafeAreaView>
      <View style={[styles.container, isDark && styles.darkContainer]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={isDark ? "#fff" : "#000"} />
          </TouchableOpacity>
          <Text style={[styles.title, isDark && styles.darkText]}>
            Paramètres
          </Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Profil */}
          <TouchableOpacity 
            style={[styles.profileCard, isDark && styles.darkCard]}
            onPress={() => navigation.navigate('Profile' as never)}
          >
            <View style={styles.avatar}>
              <Ionicons name="person" size={32} color="#fff" />
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, isDark && styles.darkText]}>
                Utilisateur MoneyManager
              </Text>
              <Text style={[styles.profileEmail, isDark && styles.darkSubtext]}>
                Gérer votre profil et préférences
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={isDark ? "#888" : "#666"} />
          </TouchableOpacity>

          {/* Notifications */}
          <SettingsSection title="Notifications">
            <SwitchSetting
              icon="notifications"
              title="Alertes de budget"
              description="Recevoir des alertes quand vous approchez vos limites"
              value={settings.budgetAlerts}
              onValueChange={(value) => handleSettingToggle('budgetAlerts', value)}
            />
            <SwitchSetting
              icon="calendar"
              title="Rappels de paiement"
              description="Rappels pour les factures et dettes"
              value={settings.paymentReminders}
              onValueChange={(value) => handleSettingToggle('paymentReminders', value)}
            />
            <SwitchSetting
              icon="document-text"
              title="Rapports mensuels"
              description="Recevoir un résumé mensuel"
              value={settings.monthlyReports}
              onValueChange={(value) => handleSettingToggle('monthlyReports', value)}
            />
            <SwitchSetting
              icon="shield-checkmark"
              title="Alertes de sécurité"
              description="Notifications importantes de sécurité"
              value={settings.securityAlerts}
              onValueChange={(value) => handleSettingToggle('securityAlerts', value)}
            />
          </SettingsSection>

          {/* Apparence */}
          <SettingsSection title="Apparence">
            <SettingItem
              icon={isDark ? "moon" : "sunny"}
              title="Mode sombre"
              description="Activer/désactiver le thème sombre"
              rightElement={
                <Switch
                  value={isDark}
                  onValueChange={toggleTheme}
                  trackColor={{ false: isDark ? '#38383a' : '#f0f0f0', true: '#007AFF' }}
                  thumbColor={isDark ? '#fff' : '#f4f3f4'}
                />
              }
            />
            <TouchableOpacity 
              style={[styles.settingItem, isDark && styles.darkSettingItem]}
              onPress={() => navigation.navigate('CurrencySettings' as never)}
            >
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, isDark && styles.darkSettingIcon]}>
                  <Ionicons name="cash" size={20} color={isDark ? "#fff" : "#007AFF"} />
                </View>
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, isDark && styles.darkText]}>
                    Devise
                  </Text>
                  <Text style={[styles.settingDescription, isDark && styles.darkSubtext]}>
                    {settings.currency} - Modifier la devise principale
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={isDark ? "#888" : "#666"} />
            </TouchableOpacity>
          </SettingsSection>

          {/* Sécurité */}
          <SettingsSection title="Sécurité">
            <SwitchSetting
              icon="finger-print"
              title="Authentification biométrique"
              description="Utiliser l'empreinte digitale ou faciale"
              value={settings.biometricAuth}
              onValueChange={(value) => handleSettingToggle('biometricAuth', value)}
            />
            <SwitchSetting
              icon="lock-closed"
              title="Verrouillage automatique"
              description="Verrouiller l'app après inactivité"
              value={settings.autoLock}
              onValueChange={(value) => handleSettingToggle('autoLock', value)}
            />
            <SwitchSetting
              icon="cloud-upload"
              title="Sauvegarde automatique"
              description="Sauvegarder les données localement"
              value={settings.dataBackup}
              onValueChange={(value) => handleSettingToggle('dataBackup', value)}
            />
          </SettingsSection>

          {/* Gestion des données */}
          <SettingsSection title="Gestion des données">
            <TouchableOpacity 
              style={[styles.settingItem, isDark && styles.darkSettingItem]}
              onPress={handleExportData}
            >
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, isDark && styles.darkSettingIcon]}>
                  <Ionicons name="download" size={20} color={isDark ? "#fff" : "#007AFF"} />
                </View>
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, isDark && styles.darkText]}>
                    Exporter les données
                  </Text>
                  <Text style={[styles.settingDescription, isDark && styles.darkSubtext]}>
                    Télécharger vos données en CSV/PDF
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={isDark ? "#888" : "#666"} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.settingItem, isDark && styles.darkSettingItem]}
              onPress={handleBackup}
            >
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, isDark && styles.darkSettingIcon]}>
                  <Ionicons name="save" size={20} color={isDark ? "#fff" : "#007AFF"} />
                </View>
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, isDark && styles.darkText]}>
                    Sauvegarder
                  </Text>
                  <Text style={[styles.settingDescription, isDark && styles.darkSubtext]}>
                    Créer une sauvegarde locale
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={isDark ? "#888" : "#666"} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.settingItem, isDark && styles.darkSettingItem]}
              onPress={() => navigation.navigate('Backup' as never)}
            >
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, isDark && styles.darkSettingIcon]}>
                  <Ionicons name="cloud" size={20} color={isDark ? "#fff" : "#007AFF"} />
                </View>
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, isDark && styles.darkText]}>
                    Sauvegarde & Restauration
                  </Text>
                  <Text style={[styles.settingDescription, isDark && styles.darkSubtext]}>
                    Gérer les sauvegardes cloud
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={isDark ? "#888" : "#666"} />
            </TouchableOpacity>
          </SettingsSection>

          {/* Aide et support */}
          <SettingsSection title="Aide et support">
            <TouchableOpacity 
              style={[styles.settingItem, isDark && styles.darkSettingItem]}
              onPress={() => console.log('Contact support')}
            >
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, isDark && styles.darkSettingIcon]}>
                  <Ionicons name="help-circle" size={20} color={isDark ? "#fff" : "#007AFF"} />
                </View>
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, isDark && styles.darkText]}>
                    Centre d'aide
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={isDark ? "#888" : "#666"} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.settingItem, isDark && styles.darkSettingItem]}
              onPress={() => console.log('Send feedback')}
            >
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, isDark && styles.darkSettingIcon]}>
                  <Ionicons name="chatbubble" size={20} color={isDark ? "#fff" : "#007AFF"} />
                </View>
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, isDark && styles.darkText]}>
                    Donner votre avis
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={isDark ? "#888" : "#666"} />
            </TouchableOpacity>
          </SettingsSection>

          {/* Actions critiques */}
          <SettingsSection title="Actions">
            <TouchableOpacity 
              style={[styles.dangerButton, isDark && styles.darkDangerButton]}
              onPress={handleReset}
            >
              <Ionicons name="trash" size={20} color="#FF3B30" />
              <Text style={styles.dangerButtonText}>
                Réinitialiser toutes les données
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.infoButton, isDark && styles.darkInfoButton]}
              onPress={() => console.log('App info')}
            >
              <Ionicons name="information-circle" size={20} color={isDark ? "#fff" : "#007AFF"} />
              <Text style={[styles.infoButtonText, isDark && styles.darkText]}>
                À propos de MoneyManager v1.0.0
              </Text>
            </TouchableOpacity>
          </SettingsSection>

          <View style={styles.spacer} />
        </ScrollView>
      </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  darkCard: {
    backgroundColor: '#2c2c2e',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
    marginHorizontal: 20,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionContent: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  darkSectionContent: {
    backgroundColor: '#2c2c2e',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  darkSettingItem: {
    borderBottomColor: '#38383a',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  darkSettingIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: '#666',
  },
  settingRight: {
    marginLeft: 12,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  darkDangerButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FF3B30',
    marginLeft: 12,
  },
  infoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginHorizontal: 20,
  },
  darkInfoButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  infoButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#007AFF',
    marginLeft: 12,
  },
  spacer: {
    height: 40,
  },
  darkText: {
    color: '#fff',
  },
  darkSubtext: {
    color: '#888',
  },
});

export default SettingsScreen;