// src/context/LanguageContext.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { I18nManager } from 'react-native';
import { translations, Translations } from '../i18n/translations';

type Language = 'fr' | 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  t: Translations;
  changeLanguage: (lang: Language) => Promise<void>;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_KEY = '@app_language';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('fr');
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (savedLanguage && (savedLanguage === 'fr' || savedLanguage === 'en' || savedLanguage === 'ar')) {
        setLanguage(savedLanguage);
        const rtl = savedLanguage === 'ar';
        setIsRTL(rtl);
        
        // Configure RTL pour l'arabe
        if (I18nManager.isRTL !== rtl) {
          I18nManager.forceRTL(rtl);
          I18nManager.allowRTL(rtl);
        }
      }
    } catch (error) {
      console.error('Error loading language:', error);
    }
  };

  const changeLanguage = async (lang: Language) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, lang);
      setLanguage(lang);
      
      const rtl = lang === 'ar';
      setIsRTL(rtl);
      
      // Configurer RTL
      if (I18nManager.isRTL !== rtl) {
        I18nManager.forceRTL(rtl);
        I18nManager.allowRTL(rtl);
        
        // Note: L'app doit être rechargée pour appliquer les changements RTL
        console.log('⚠️ L\'application doit être rechargée pour appliquer le changement de direction');
      }
      
      console.log('✅ Langue changée:', lang);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const value: LanguageContextType = {
    language,
    t: translations[language],
    changeLanguage,
    isRTL,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
