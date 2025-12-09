// src/screens/GeneralSettingsScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from '../components/SafeAreaView';
import { LanguageSelector } from '../components/settings/LanguageSelector';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import { useDesignSystem, useTheme } from '../context/ThemeContext';
import { cleanupService } from '../services/cleanupService';

export const GeneralSettingsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { t } = useLanguage();
  const { colors } = useDesignSystem();
  const { theme, setTheme } = useTheme();
  const { currentCurrency } = useCurrency();
  const [isCleaningDuplicates, setIsCleaningDuplicates] = useState(false);

  const themeOptions = [
    { value: 'light', label: t.light, icon: 'sunny-outline' },
    { value: 'dark', label: t.dark, icon: 'moon-outline' },
  ];

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
  };

  const handleCleanDuplicates = async () => {
    Alert.alert(
      t.cleanDuplicates,
      t.cleanDuplicatesQuestion,
      [
        { text: t.cancel, style: 'cancel' },
        {
          text: t.cleanDuplicates,
          style: 'destructive',
          onPress: async () => {
            setIsCleaningDuplicates(true);
            try {
              const result = await cleanupService.cleanDuplicateRecurringTransactions();
              Alert.alert(
                t.finished,
                `${result.deleted} ${t.duplicatesDeleted}.\n${result.errors.length > 0 ? `\n⚠️ ${result.errors.length} ${t.error}(s)` : ''}`,
                [{ text: 'OK' }]
              );
            } catch (error) {
              Alert.alert(t.error, t.cannotCleanDuplicates);
            } finally {
              setIsCleaningDuplicates(false);
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView>
      <ScrollView style={[styles.container, { backgroundColor: colors.background.primary }]}>
        {/* Section Devise */}
        <Text style={[styles.sectionHeader, { color: colors.text.secondary }]}>
          {t.currency.toUpperCase()}
        </Text>
        <TouchableOpacity
          style={[styles.settingCard, { backgroundColor: colors.background.secondary }]}
          onPress={() => navigation.navigate('CurrencySettings')}
        >
          <View style={[styles.iconContainer, { backgroundColor: colors.primary[100] }]}>
            <Ionicons name="cash-outline" size={24} color={colors.primary[500]} />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: colors.text.primary }]}>
              {t.mainCurrency}
            </Text>
            <Text style={[styles.settingValue, { color: colors.text.secondary }]}>
              {currentCurrency || 'MAD'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
        </TouchableOpacity>

        {/* Section Thème */}
        <Text style={[styles.sectionHeader, { color: colors.text.secondary }]}>
          {t.appearance.toUpperCase()}
        </Text>
        {themeOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[styles.settingCard, { backgroundColor: colors.background.secondary }]}
            onPress={() => handleThemeChange(option.value as any)}
          >
            <View style={[styles.iconContainer, { backgroundColor: colors.primary[100] }]}>
              <Ionicons name={option.icon as any} size={24} color={colors.primary[500]} />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, { color: colors.text.primary }]}>
                {option.label}
              </Text>
            </View>
            {theme === option.value && (
              <Ionicons name="checkmark-circle" size={24} color={colors.primary[500]} />
            )}
          </TouchableOpacity>
        ))}

        {/* Section Langue */}
        <Text style={[styles.sectionHeader, { color: colors.text.secondary }]}>
          LANGUE / LANGUAGE / اللغة
        </Text>
        <View style={styles.languageContainer}>
          <LanguageSelector />
        </View>

        {/* Section Maintenance (temporaire) */}
        <Text style={[styles.sectionHeader, { color: colors.text.secondary }]}>
          {t.maintenance.toUpperCase()}
        </Text>
        <TouchableOpacity
          style={[styles.settingCard, { backgroundColor: colors.background.secondary }]}
          onPress={handleCleanDuplicates}
          disabled={isCleaningDuplicates}
        >
          <View style={[styles.iconContainer, { backgroundColor: '#FFE5E5' }]}>
            <Ionicons name="trash-outline" size={24} color="#FF6B6B" />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: colors.text.primary }]}>
              {isCleaningDuplicates ? t.cleaning : t.cleanDuplicates}
            </Text>
            <Text style={[styles.settingValue, { color: colors.text.secondary }]}>
              {t.cleanDuplicatesDesc}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
        </TouchableOpacity>
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
  },
  settingValue: {
    fontSize: 14,
    marginTop: 2,
  },
  languageContainer: {
    marginHorizontal: 16,
  },
});

export default GeneralSettingsScreen;
