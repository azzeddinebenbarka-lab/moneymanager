// src/utils/constants.ts - VERSION CORRIGÉE
import { Category } from '../types';

export const DEFAULT_CATEGORIES: Omit<Category, 'createdAt'>[] = [
  // Dépenses
  { id: 'cat_1', name: 'Alimentation', type: 'expense', color: '#FF6B6B', icon: 'restaurant' },
  { id: 'cat_2', name: 'Transport', type: 'expense', color: '#4ECDC4', icon: 'car' },
  { id: 'cat_3', name: 'Logement', type: 'expense', color: '#45B7D1', icon: 'home' },
  { id: 'cat_4', name: 'Loisirs', type: 'expense', color: '#96CEB4', icon: 'game-controller' },
  { id: 'cat_5', name: 'Santé', type: 'expense', color: '#FFEAA7', icon: 'medical' },
  { id: 'cat_6', name: 'Shopping', type: 'expense', color: '#DDA0DD', icon: 'cart' },
  { id: 'cat_7', name: 'Éducation', type: 'expense', color: '#98D8C8', icon: 'school' },
  { id: 'cat_8', name: 'Voyages', type: 'expense', color: '#F7DC6F', icon: 'airplane' },
  { id: 'cat_9', name: 'Autres dépenses', type: 'expense', color: '#778899', icon: 'ellipsis-horizontal' },
  
  // Revenus
  { id: 'cat_10', name: 'Salaire', type: 'income', color: '#52C41A', icon: 'cash' },
  { id: 'cat_11', name: 'Investissements', type: 'income', color: '#FAAD14', icon: 'trending-up' },
  { id: 'cat_12', name: 'Cadeaux', type: 'income', color: '#722ED1', icon: 'gift' },
  { id: 'cat_13', name: 'Prime', type: 'income', color: '#13C2C2', icon: 'trophy' },
  { id: 'cat_14', name: 'Autres revenus', type: 'income', color: '#20B2AA', icon: 'add-circle' },
];

export const CURRENCY_CONSTANTS = {
  DEFAULT_CURRENCY: 'MAD',
  CURRENCY_STORAGE_KEY: 'selectedCurrency',
  BASE_CURRENCY_STORAGE_KEY: 'base_currency',
  EXCHANGE_RATES_KEY: 'exchange_rates',
  
  // Codes de devises supportées
  SUPPORTED_CURRENCIES: [
    { code: 'MAD', name: 'Dirham Marocain', symbol: 'MAD ', locale: 'fr-FR' },
    { code: 'EUR', name: 'Euro', symbol: '€', locale: 'fr-FR' },
    { code: 'USD', name: 'Dollar US', symbol: '$', locale: 'en-US' },
    { code: 'GBP', name: 'Livre Sterling', symbol: '£', locale: 'en-GB' },
    { code: 'JPY', name: 'Yen Japonais', symbol: '¥', locale: 'ja-JP' },
    { code: 'CAD', name: 'Dollar Canadien', symbol: 'CA$', locale: 'en-CA' },
    { code: 'AUD', name: 'Dollar Australien', symbol: 'A$', locale: 'en-AU' },
    { code: 'CHF', name: 'Franc Suisse', symbol: 'CHF', locale: 'de-CH' }
  ]
};

export const STORAGE_KEYS = {
  // ... autres clés existantes ...
  SELECTED_CURRENCY: 'selectedCurrency',
  BASE_CURRENCY: 'base_currency',
  EXCHANGE_RATES: 'exchange_rates'
};

// Types pour les comptes
export const ACCOUNT_TYPES = [
  { value: 'cash', label: '💵 Espèces', icon: 'cash' },
  { value: 'bank', label: '🏦 Banque', icon: 'business' },
  { value: 'card', label: '💳 Carte', icon: 'card' },
  { value: 'savings', label: '💰 Épargne', icon: 'trending-up' },
];

export const ACCOUNT_COLORS = [
  '#007AFF', '#34C759', '#FF9500', '#FF3B30', 
  '#AF52DE', '#FF2D55', '#5856D6', '#A2845E'
];