// ✅ COMPONENT: Sélecteur de langue avec support RTL
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLanguage } from '../../context/LanguageContext';
import { useDesignSystem } from '../../context/ThemeContext';

// Type des langues disponibles
type LanguageOption = {
  code: 'fr' | 'en' | 'ar';
  name: string;
  nativeName: string;
  flag: string;
};

// Configuration des langues
const LANGUAGES: LanguageOption[] = [
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
];

export const LanguageSelector: React.FC = () => {
  const { language, changeLanguage, isRTL } = useLanguage();
  const { colors } = useDesignSystem();

  // Gestion du changement de langue
  const handleLanguageChange = async (code: 'fr' | 'en' | 'ar') => {
    if (code === language) return;

    // Vérifier si on change vers/depuis l'arabe (nécessite redémarrage)
    const needsReload = code === 'ar' || language === 'ar';

    if (needsReload) {
      Alert.alert(
        code === 'ar' ? 'تغيير اللغة' : 'Changement de langue',
        code === 'ar' 
          ? 'سيتم إعادة تشغيل التطبيق لتطبيق تخطيط RTL'
          : "L'application doit être redémarrée pour appliquer le changement de direction (RTL)",
        [
          {
            text: code === 'ar' ? 'إلغاء' : 'Annuler',
            style: 'cancel',
          },
          {
            text: code === 'ar' ? 'موافق' : 'OK',
            onPress: async () => {
              await changeLanguage(code);
              // Note: L'utilisateur devra redémarrer manuellement l'app
              Alert.alert(
                code === 'ar' ? 'إعادة التشغيل مطلوبة' : 'Redémarrage requis',
                code === 'ar'
                  ? 'يرجى إغلاق وإعادة فتح التطبيق'
                  : t.pleaseCloseReopenApp,
                [{ text: t.ok }]
              );
            },
          },
        ]
      );
    } else {
      await changeLanguage(code);
    }
  };

  return (
    <View style={styles.container}>
      {LANGUAGES.map((lang) => (
        <TouchableOpacity
          key={lang.code}
          style={[
            styles.languageOption,
            {
              backgroundColor: colors.background.card,
              borderColor: language === lang.code ? colors.primary[500] : colors.border.primary,
              borderWidth: language === lang.code ? 2 : 1,
            },
          ]}
          onPress={() => handleLanguageChange(lang.code)}
          activeOpacity={0.7}
        >
          <View style={styles.languageContent}>
            {/* Drapeau */}
            <Text style={styles.flag}>{lang.flag}</Text>

            {/* Nom de la langue */}
            <View style={styles.languageInfo}>
              <Text
                style={[
                  styles.languageName,
                  { color: colors.text.primary },
                  language === lang.code && styles.selectedText,
                ]}
              >
                {lang.nativeName}
              </Text>
              <Text
                style={[
                  styles.languageSubName,
                  { color: colors.text.secondary },
                ]}
              >
                {lang.name}
              </Text>
            </View>

            {/* Indicateur de sélection */}
            {language === lang.code && (
              <Ionicons
                name="checkmark-circle"
                size={24}
                color={colors.primary[500]}
              />
            )}
          </View>

          {/* Badge RTL pour l'arabe */}
          {lang.code === 'ar' && (
            <View
              style={[
                styles.rtlBadge,
                { backgroundColor: colors.primary[100] },
              ]}
            >
              <Text
                style={[
                  styles.rtlBadgeText,
                  { color: colors.primary[700] },
                ]}
              >
                RTL
              </Text>
            </View>
          )}
        </TouchableOpacity>
      ))}

      {/* Note informative */}
      <View
        style={[
          styles.infoBox,
          { backgroundColor: colors.primary[50] },
        ]}
      >
        <Ionicons
          name="information-circle-outline"
          size={20}
          color={colors.primary[500]}
          style={styles.infoIcon}
        />
        <Text
          style={[
            styles.infoText,
            { color: colors.primary[700] },
          ]}
        >
          {isRTL
            ? 'اللغة الحالية: العربية (RTL)'
            : 'Le changement de langue prend effet immédiatement'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  languageOption: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  languageContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  flag: {
    fontSize: 32,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  selectedText: {
    fontWeight: '700',
  },
  languageSubName: {
    fontSize: 13,
  },
  rtlBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  rtlBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  infoIcon: {
    marginRight: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
});
