// src/design/Spacing.ts

/**
 * Système d'espacement cohérent
 * Basé sur une échelle de 4px
 */

export interface SpacingScale {
  px: number;
  0: number;
  0.5: number;
  1: number;
  1.5: number;
  2: number;
  2.5: number;
  3: number;
  3.5: number;
  4: number;
  5: number;
  6: number;
  7: number;
  8: number;
  9: number;
  10: number;
  11: number;
  12: number;
  14: number;
  16: number;
  20: number;
  24: number;
  28: number;
  32: number;
  36: number;
  40: number;
  44: number;
  48: number;
  52: number;
  56: number;
  60: number;
  64: number;
  72: number;
  80: number;
  96: number;
}

// Échelle d'espacement basée sur 4px (0.25rem)
export const spacing: SpacingScale = {
  px: 1,
  0: 0,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  3.5: 14,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
  28: 112,
  32: 128,
  36: 144,
  40: 160,
  44: 176,
  48: 192,
  52: 208,
  56: 224,
  60: 240,
  64: 256,
  72: 288,
  80: 320,
  96: 384,
};

// Espacements sémantiques pour une utilisation cohérente
export const layout = {
  // Conteneurs
  container: {
    sm: spacing[20], // 80px
    md: spacing[24], // 96px
    lg: spacing[32], // 128px
    xl: spacing[40], // 160px
  },
  
  // Grilles et gabarits
  grid: {
    gutter: spacing[4], // 16px
    column: spacing[20], // 80px
  },
  
  // En-têtes
  header: {
    height: 56,
    paddingHorizontal: spacing[4],
  },
  
  // Cartes
  card: {
    padding: spacing[4],
    borderRadius: 12,
    gap: spacing[3],
  },
  
  // Boutons
  button: {
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
    borderRadius: 8,
    gap: spacing[2],
  },
  
  // Formulaires
  form: {
    gap: spacing[4],
    fieldGap: spacing[3],
    labelGap: spacing[1],
  },
  
  // Listes
  list: {
    itemGap: spacing[2],
    sectionGap: spacing[4],
    padding: spacing[4],
  },
  
  // Icônes
  icon: {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
  },
};

// Bordures et rayons
export const borders = {
  radius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 20,
    '3xl': 24,
    full: 9999,
  },
  width: {
    none: 0,
    thin: 1,
    medium: 2,
    thick: 4,
  },
};

// Types pour TypeScript
export type Spacing = keyof SpacingScale;
export type BorderRadius = keyof typeof borders.radius;
export type BorderWidth = keyof typeof borders.width;

// Helper functions
export const getSpacing = (size: Spacing): number => {
  return spacing[size];
};

export const getBorderRadius = (radius: BorderRadius): number => {
  return borders.radius[radius];
};

export const getBorderWidth = (width: BorderWidth): number => {
  return borders.width[width];
};

// Configuration responsive (pour future utilisation)
export const responsiveSpacing = {
  small: spacing,
  medium: {
    ...spacing,
    4: 20,
    5: 24,
    6: 28,
  },
  large: {
    ...spacing,
    4: 24,
    5: 28,
    6: 32,
  },
};