// src/screens/SecuritySettingsScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from '../components/SafeAreaView';
import { useLanguage } from '../context/LanguageContext';
import { useSecurity } from '../context/SecurityContext';
import { useDesignSystem } from '../context/ThemeContext';

export const SecuritySettingsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { t } = useLanguage();
  const { colors } = useDesignSystem();
  const {
    preferences,
    biometricAvailable,
    toggleBiometric,
    toggleAutoLock,
    setAutoLockTimeout,
  } = useSecurity();

  const [isUpdating, setIsUpdating] = useState(false);

  const timeoutOptions = [
    { label: t.immediate, value: 0 },
    { label: t.oneMinute, value: 1 },
    { label: t.fiveMinutes, value: 5 },
    { label: t.fifteenMinutes, value: 15 },
    { label: t.thirtyMinutes, value: 30 },
    { label: t.oneHour, value: 60 },
  ];

  const handleToggleBiometric = async (value: boolean) => {
    if (isUpdating) return;

    if (!biometricAvailable && value) {
      Alert.alert(
        t.notAvailableDevice,
        t.notAvailableDevice,
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      setIsUpdating(true);
      await toggleBiometric(value);

      if (value) {
        Alert.alert(
          t.securityEnabled,
          t.biometricEnabledMessage,
          [{ text: 'OK' }]
        );
      }
    } catch (error: any) {
      Alert.alert(t.error, error?.message || t.cannotEnableSecurity);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleAutoLock = async (value: boolean) => {
    if (isUpdating) return;

    try {
      setIsUpdating(true);
      await toggleAutoLock(value);
    } catch (error) {
      Alert.alert(t.error, t.cannotModifyAutoLock);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSelectTimeout = (timeout: number) => {
    Alert.alert(
      t.lockDelayQuestion,
      `${t.autoLockDesc} ${timeout === 0 ? t.afterImmediate : timeout === 1 ? t.afterOneMinute : timeout < 60 ? `${timeout} ${t.afterXMinutes}` : t.afterOneHour} ?`,
      [
        { text: t.cancel, style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: async () => {
            try {
              await setAutoLockTimeout(timeout);
            } catch (error) {
              Alert.alert(t.error, t.cannotModifyDelay);
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView>
      <ScrollView style={[styles.container, { backgroundColor: colors.background.primary }]}>
        {/* Section Authentification Biométrique */}
        <Text style={[styles.sectionHeader, { color: colors.text.secondary }]}>
          {t.biometricAuth.toUpperCase()}
        </Text>
        <View style={[styles.settingCard, { backgroundColor: colors.background.secondary }]}>
          <View style={[styles.iconContainer, { backgroundColor: colors.primary[100] }]}>
            <Ionicons name="finger-print-outline" size={24} color={colors.primary[500]} />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: colors.text.primary }]}>
              {t.enableBiometric}
            </Text>
            <Text style={[styles.settingDescription, { color: colors.text.secondary }]}>
              {biometricAvailable
                ? t.protectWithBiometric
                : t.notAvailableDevice}
            </Text>
          </View>
          <Switch
            value={preferences.biometricEnabled}
            onValueChange={handleToggleBiometric}
            disabled={!biometricAvailable || isUpdating}
            trackColor={{ false: colors.text.tertiary, true: colors.primary[500] }}
            thumbColor="#ffffff"
          />
        </View>

        {/* Section Verrouillage Automatique */}
        {preferences.biometricEnabled && (
          <>
            <Text style={[styles.sectionHeader, { color: colors.text.secondary }]}>
              {t.autoLock.toUpperCase()}
            </Text>
            <View style={[styles.settingCard, { backgroundColor: colors.background.secondary }]}>
              <View style={[styles.iconContainer, { backgroundColor: '#FFF3E020' }]}>
                <Ionicons name="time-outline" size={24} color="#FF9800" />
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, { color: colors.text.primary }]}>
                  {t.autoLock}
                </Text>
                <Text style={[styles.settingDescription, { color: colors.text.secondary }]}>
                  {t.autoLockDesc}
                </Text>
              </View>
              <Switch
                value={preferences.autoLockEnabled}
                onValueChange={handleToggleAutoLock}
                disabled={isUpdating}
                trackColor={{ false: colors.text.tertiary, true: colors.primary[500] }}
                thumbColor="#ffffff"
              />
            </View>

            {preferences.autoLockEnabled && (
              <View style={[styles.timeoutCard, { backgroundColor: colors.background.secondary }]}>
                <Text style={[styles.timeoutTitle, { color: colors.text.secondary }]}>
                  {t.lockDelay}
                </Text>
                <View style={styles.timeoutOptions}>
                  {timeoutOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.timeoutOption,
                        {
                          backgroundColor: preferences.autoLockTimeout === option.value
                            ? colors.primary[500]
                            : colors.background.primary
                        }
                      ]}
                      onPress={() => handleSelectTimeout(option.value)}
                    >
                      <Text
                        style={[
                          styles.timeoutText,
                          {
                            color: preferences.autoLockTimeout === option.value
                              ? '#fff'
                              : colors.text.primary
                          }
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </>
        )}

        {/* Informations de sécurité */}
        <View style={[styles.infoCard, { backgroundColor: colors.primary[50] }]}>
          <Ionicons name="shield-checkmark-outline" size={24} color={colors.primary[500]} />
          <Text style={[styles.infoText, { color: colors.primary[700] }]}>
            L'authentification biométrique utilise le matériel sécurisé de votre appareil pour protéger vos données financières.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 24,
    marginTop: 24,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  settingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
  },
  timeoutCard: {
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
  },
  timeoutTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 12,
  },
  timeoutOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeoutOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  timeoutText: {
    fontSize: 14,
    fontWeight: '600',
  },
  infoCard: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    lineHeight: 20,
  },
});

export default SecuritySettingsScreen;
