// src/design/Colors.ts

/**
 * Système de couleurs complet pour MoneyManager
 * Design moderne avec support dark/light mode
 */

export interface ColorPalette {
  // Couleurs primaires
  primary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  
  // Couleurs neutres
  neutral: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  
  // Couleurs sémantiques
  semantic: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  
  // Couleurs fonctionnelles
  functional: {
    income: string;
    expense: string;
    savings: string;
    debt: string;
    investment: string;
  };
  
  // Couleurs de fond
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
    card: string;
    overlay: string;
  };
  
  // Couleurs de texte
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
    disabled: string;
  };
  
  // Couleurs de bordure
  border: {
    primary: string;
    secondary: string;
    focused: string;
  };
}

// Palette de couleurs light mode
export const lightColors: ColorPalette = {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  
  neutral: {
    50: '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    900: '#18181b',
  },
  
  semantic: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
  
  functional: {
    income: '#10b981',
    expense: '#ef4444',
    savings: '#8b5cf6',
    debt: '#f59e0b',
    investment: '#06b6d4',
  },
  
  background: {
    primary: '#ffffff',
    secondary: '#f8fafc',
    tertiary: '#f1f5f9',
    card: '#ffffff',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  
  text: {
    primary: '#0f172a',
    secondary: '#475569',
    tertiary: '#64748b',
    inverse: '#ffffff',
    disabled: '#94a3b8',
  },
  
  border: {
    primary: '#e2e8f0',
    secondary: '#f1f5f9',
    focused: '#0ea5e9',
  },
};

// Palette de couleurs dark mode
export const darkColors: ColorPalette = {
  primary: {
    50: '#0c4a6e',
    100: '#075985',
    200: '#0369a1',
    300: '#0284c7',
    400: '#0ea5e9',
    500: '#38bdf8',
    600: '#7dd3fc',
    700: '#bae6fd',
    800: '#e0f2fe',
    900: '#f0f9ff',
  },
  
  neutral: {
    50: '#18181b',
    100: '#27272a',
    200: '#3f3f46',
    300: '#52525b',
    400: '#71717a',
    500: '#a1a1aa',
    600: '#d4d4d8',
    700: '#e4e4e7',
    800: '#f4f4f5',
    900: '#fafafa',
  },
  
  semantic: {
    success: '#34d399',
    warning: '#fbbf24',
    error: '#f87171',
    info: '#60a5fa',
  },
  
  functional: {
    income: '#34d399',
    expense: '#f87171',
    savings: '#a78bfa',
    debt: '#fbbf24',
    investment: '#22d3ee',
  },
  
  background: {
    primary: '#0f172a',
    secondary: '#1e293b',
    tertiary: '#334155',
    card: '#1e293b',
    overlay: 'rgba(0, 0, 0, 0.7)',
  },
  
  text: {
    primary: '#f1f5f9',
    secondary: '#cbd5e1',
    tertiary: '#94a3b8',
    inverse: '#0f172a',
    disabled: '#475569',
  },
  
  border: {
    primary: '#334155',
    secondary: '#475569',
    focused: '#38bdf8',
  },
};

// Gradients modernes
export const gradients = {
  primary: ['#0ea5e9', '#3b82f6'],
  success: ['#10b981', '#34d399'],
  warning: ['#f59e0b', '#fbbf24'],
  error: ['#ef4444', '#f87171'],
  premium: ['#8b5cf6', '#ec4899'],
  savings: ['#8b5cf6', '#06b6d4'],
  debt: ['#f59e0b', '#ef4444'],
};

// Ombres et élévations
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
};

// Export utilitaire pour utiliser les couleurs
export const getColors = (isDark: boolean): ColorPalette => {
  return isDark ? darkColors : lightColors;
};

export type ThemeColors = ColorPalette;