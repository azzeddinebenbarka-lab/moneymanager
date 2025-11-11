// src/utils/config.ts - VERSION COMPLÈTEMENT CORRIGÉE
import { Platform } from 'react-native';

// Configuration de l'application
export const APP_CONFIG = {
  APP_NAME: 'MoneyManager',
  VERSION: '1.0.0',
  SUPPORT_EMAIL: 'support@moneymanager.com',
};

// Configuration de la base de données
export const DATABASE_CONFIG = {
  NAME: 'MoneyManager.db',
  VERSION: 1,
};

// Configuration des sauvegardes
export const BACKUP_CONFIG = {
  BACKUP_DIR: 'MoneyManagerBackups',
  BACKUP_PREFIX: 'backup_',
  MAX_LOCAL_BACKUPS: 10,
  AUTO_BACKUP_INTERVAL: 24 * 60 * 60 * 1000, // 24 heures
};

// Configuration de sécurité
export const SECURITY_CONFIG = {
  PIN_MAX_ATTEMPTS: 5,
  PIN_LOCKOUT_TIME: 5 * 60 * 1000, // 5 minutes
  BIOMETRIC_TIMEOUT: 60, // secondes
};

// Configuration de synchronisation
export const SYNC_CONFIG = {
  SYNC_INTERVAL: 30 * 60 * 1000, // 30 minutes
  MAX_RETRY_ATTEMPTS: 3,
  CONFLICT_RESOLUTION: 'client_wins' as 'client_wins' | 'server_wins',
};

// Configuration des notifications
export const NOTIFICATION_CONFIG = {
  BUDGET_ALERT_HOUR: 9, // 9h du matin
  DEBT_REMINDER_DAYS: [7, 3, 1], // Jours avant échéance
  DEFAULT_SNOOZE_DURATION: 24 * 60 * 60 * 1000, // 24 heures
};

// Configuration des devises
export const CURRENCY_CONFIG = {
  DEFAULT_CURRENCY: 'MAD',
  SUPPORTED_CURRENCIES: [
    { code: 'USD', symbol: '$', name: 'Dollar américain' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'Livre sterling' },
    { code: 'JPY', symbol: '¥', name: 'Yen japonais' },
    { code: 'CAD', symbol: 'C$', name: 'Dollar canadien' },
    { code: 'AUD', symbol: 'A$', name: 'Dollar australien' },
    { code: 'CHF', symbol: 'CHF', name: 'Franc suisse' },
    { code: 'CNY', symbol: '¥', name: 'Yuan chinois' },
    { code: 'MAD', symbol: 'DH', name: 'Dirham marocain' },
  ],
  CURRENCY_FORMATS: {
    USD: { decimal: '.', thousands: ',', precision: 2 },
    EUR: { decimal: ',', thousands: ' ', precision: 2 },
    GBP: { decimal: '.', thousands: ',', precision: 2 },
    JPY: { decimal: '.', thousands: ',', precision: 0 },
    CAD: { decimal: '.', thousands: ',', precision: 2 },
    AUD: { decimal: '.', thousands: ',', precision: 2 },
    CHF: { decimal: '.', thousands: "'", precision: 2 },
    CNY: { decimal: '.', thousands: ',', precision: 2 },
    MAD: { decimal: '.', thousands: ',', precision: 2 },
  }
};

// Configuration des limites
export const LIMIT_CONFIG = {
  MAX_ACCOUNTS: 50,
  MAX_TRANSACTIONS_PER_ACCOUNT: 10000,
  MAX_BUDGETS: 100,
  MAX_CATEGORIES: 200,
  MAX_DEBTS: 100,
  MAX_SAVINGS_GOALS: 50,
};

// Configuration des fonctionnalités premium
export const PREMIUM_CONFIG = {
  FREE_ACCOUNT_LIMIT: 5,
  FREE_TRANSACTION_LIMIT: 100,
  FREE_BACKUP_LIMIT: 1,
  PREMIUM_FEATURES: [
    'advanced_analytics',
    'multi_currency',
    'cloud_sync',
    'unlimited_backups',
    'custom_categories',
    'debt_amortization',
  ],
};

// Configuration des exports
export const EXPORT_CONFIG = {
  CSV_DELIMITER: ',',
  DATE_FORMAT: 'YYYY-MM-DD',
  MAX_EXPORT_ROWS: 10000,
  SUPPORTED_FORMATS: ['csv', 'excel', 'pdf'] as const,
};

// Configuration du thème
export const THEME_CONFIG = {
  LIGHT: {
    primary: '#2563eb',
    secondary: '#64748b',
    background: '#ffffff',
    card: '#f8fafc',
    text: '#1e293b',
    border: '#e2e8f0',
  },
  DARK: {
    primary: '#3b82f6',
    secondary: '#94a3b8',
    background: '#0f172a',
    card: '#1e293b',
    text: '#f1f5f9',
    border: '#334155',
  },
};

// Configuration des performances
export const PERFORMANCE_CONFIG = {
  DEBOUNCE_DELAY: 300,
  LAZY_LOAD_DELAY: 100,
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
  BATCH_OPERATION_SIZE: 100,
};

// Configuration du debug
export const DEBUG_CONFIG = {
  LOG_SQL: __DEV__,
  LOG_SYNC: __DEV__,
  LOG_PERFORMANCE: __DEV__,
  ENABLE_ANALYTICS: !__DEV__,
};

// Configuration spécifique à la plateforme
export const PLATFORM_CONFIG = {
  IS_IOS: Platform.OS === 'ios',
  IS_ANDROID: Platform.OS === 'android',
  IS_WEB: Platform.OS === 'web',
  // ✅ CORRECTION : Conversion sécurisée de Platform.Version
  HAS_NOTCH: Platform.OS === 'ios' && parseInt(String(Platform.Version), 10) >= 11,
};

// Configuration des chemins de navigation
export const NAVIGATION_CONFIG = {
  AUTH_STACK: 'AuthStack',
  MAIN_DRAWER: 'MainDrawer',
  DASHBOARD: 'Dashboard',
  TRANSACTIONS: 'Transactions',
  ACCOUNTS: 'Accounts',
  BUDGETS: 'Budgets',
  DEBTS: 'Debts',
  SAVINGS: 'Savings',
  ANALYTICS: 'Analytics',
  SETTINGS: 'Settings',
  PREMIUM: 'Premium',
};

export default {
  APP_CONFIG,
  DATABASE_CONFIG,
  BACKUP_CONFIG,
  SECURITY_CONFIG,
  SYNC_CONFIG,
  NOTIFICATION_CONFIG,
  CURRENCY_CONFIG,
  LIMIT_CONFIG,
  PREMIUM_CONFIG,
  EXPORT_CONFIG,
  THEME_CONFIG,
  PERFORMANCE_CONFIG,
  DEBUG_CONFIG,
  PLATFORM_CONFIG,
  NAVIGATION_CONFIG,
};