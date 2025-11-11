// src/components/security/SecuritySettings.tsx
import React, { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { BiometricAuth } from '../../services/auth/biometricAuth';
import { SecurityService } from '../../services/auth/securityService';

export const SecuritySettings: React.FC = () => {
  const [securityStatus, setSecurityStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    loadSecurityStatus();
  }, []);

  const loadSecurityStatus = async () => {
    try {
      setIsLoading(true);
      const status = await SecurityService.getSecurityStatus();
      setSecurityStatus(status);
    } catch (error) {
      console.error('Error loading security status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometricToggle = async (enabled: boolean) => {
    try {
      if (enabled) {
        const { available } = await BiometricAuth.isAvailable();
        if (!available) {
          Alert.alert(
            'Biométrie non disponible',
            'L\'authentification biométrique n\'est pas disponible sur cet appareil.'
          );
          return;
        }

        // Tester l'authentification biométrique
        const result = await BiometricAuth.authenticate();
        if (result.success) {
          await BiometricAuth.saveBiometricPreference(true);
          await SecurityService.changeAuthMethod(
            securityStatus?.pinConfigured ? 'both' : 'biometric'
          );
          await loadSecurityStatus();
        } else {
          Alert.alert('Échec', 'L\'authentification biométrique a échoué.');
        }
      } else {
        await BiometricAuth.saveBiometricPreference(false);
        await SecurityService.changeAuthMethod(
          securityStatus?.pinConfigured ? 'pin' : 'none'
        );
        await loadSecurityStatus();
      }
    } catch (error) {
      console.error('Error toggling biometric:', error);
      Alert.alert('Erreur', 'Impossible de modifier les paramètres biométriques.');
    }
  };

  const handleAutoLockToggle = async (enabled: boolean) => {
    try {
      const config = await SecurityService.getConfig();
      if (config) {
        config.autoLock = enabled;
        await SecurityService.saveConfig(config);
        await loadSecurityStatus();
      }
    } catch (error) {
      console.error('Error toggling auto lock:', error);
    }
  };

  const handleSetPin = async () => {
    // Dans une implémentation réelle, vous navigueriez vers l'écran de configuration PIN
    Alert.alert(
      'Configuration du PIN',
      'Redirection vers l\'écran de configuration du PIN...'
    );
  };

  const handleChangePin = async () => {
    Alert.alert(
      'Changement de PIN',
      'Redirection vers l\'écran de changement de PIN...'
    );
  };

  const handleResetSecurity = () => {
    Alert.alert(
      'Réinitialiser la sécurité',
      'Êtes-vous sûr de vouloir réinitialiser tous les paramètres de sécurité ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Réinitialiser',
          style: 'destructive',
          onPress: async () => {
            try {
              await SecurityService.resetSecurity();
              await loadSecurityStatus();
              Alert.alert('Succès', 'Sécurité réinitialisée avec succès.');
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de réinitialiser la sécurité.');
            }
          },
        },
      ]
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
    },
    section: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#38383A' : '#E5E5EA',
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 16,
      color: isDark ? '#FFFFFF' : '#000000',
    },
    settingRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
    },
    settingInfo: {
      flex: 1,
    },
    settingTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#000000',
      marginBottom: 4,
    },
    settingDescription: {
      fontSize: 14,
      color: isDark ? '#8E8E93' : '#666666',
      lineHeight: 18,
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      marginTop: 4,
    },
    statusActive: {
      backgroundColor: '#34C759',
    },
    statusInactive: {
      backgroundColor: '#FF3B30',
    },
    statusText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    button: {
      padding: 16,
      borderRadius: 8,
      backgroundColor: isDark ? '#48484A' : '#F2F2F7',
      marginTop: 8,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#007AFF',
      textAlign: 'center',
    },
    dangerButton: {
      backgroundColor: '#FF3B30',
    },
    dangerButtonText: {
      color: '#FFFFFF',
    },
  });

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={[styles.sectionTitle, { textAlign: 'center', marginTop: 20 }]}>
          Chargement...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Section Authentification */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Authentification</Text>

        {/* PIN */}
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Code PIN</Text>
            <Text style={styles.settingDescription}>
              Protéger l'accès avec un code PIN
            </Text>
            <View style={[
              styles.statusBadge,
              securityStatus?.pinConfigured ? styles.statusActive : styles.statusInactive
            ]}>
              <Text style={styles.statusText}>
                {securityStatus?.pinConfigured ? 'Activé' : 'Désactivé'}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={
            securityStatus?.pinConfigured ? handleChangePin : handleSetPin
          }>
            <Text style={styles.buttonText}>
              {securityStatus?.pinConfigured ? 'Changer' : 'Activer'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Biométrie */}
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Authentification biométrique</Text>
            <Text style={styles.settingDescription}>
              Utiliser l'empreinte digitale ou la reconnaissance faciale
            </Text>
            <View style={[
              styles.statusBadge,
              securityStatus?.biometricAvailable && securityStatus?.authMethod !== 'pin' 
                ? styles.statusActive 
                : styles.statusInactive
            ]}>
              <Text style={styles.statusText}>
                {securityStatus?.biometricAvailable ? 'Disponible' : 'Indisponible'}
              </Text>
            </View>
          </View>
          <Switch
            value={securityStatus?.biometricAvailable && securityStatus?.authMethod !== 'pin'}
            onValueChange={handleBiometricToggle}
            disabled={!securityStatus?.biometricAvailable}
          />
        </View>
      </View>

      {/* Section Sécurité */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sécurité</Text>

        {/* Verrouillage automatique */}
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Verrouillage automatique</Text>
            <Text style={styles.settingDescription}>
              Verrouiller l'application après inactivité
            </Text>
          </View>
          <Switch
            value={securityStatus?.authMethod !== 'none' && securityStatus?.sessionActive}
            onValueChange={handleAutoLockToggle}
            disabled={securityStatus?.authMethod === 'none'}
          />
        </View>
      </View>

      {/* Actions */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.button} onPress={handleResetSecurity}>
          <Text style={[styles.buttonText, styles.dangerButtonText]}>
            Réinitialiser la sécurité
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};