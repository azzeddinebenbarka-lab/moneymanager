// src/design/Typography.ts

/**
 * Système typographique complet
 * Échelle modulaire avec support responsive
 */

export interface FontSizeScale {
  xs: number;
  sm: number;
  base: number;
  lg: number;
  xl: number;
  '2xl': number;
  '3xl': number;
  '4xl': number;
  '5xl': number;
}

export interface LineHeightScale {
  tight: number;
  normal: number;
  relaxed: number;
}

export interface FontWeightScale {
  light: '300';
  normal: '400';
  medium: '500';
  semibold: '600';
  bold: '700';
  extrabold: '800';
}

export interface TypographySystem {
  fontSize: FontSizeScale;
  lineHeight: LineHeightScale;
  fontWeight: FontWeightScale;
  letterSpacing: {
    tighter: number;
    tight: number;
    normal: number;
    wide: number;
  };
}

// Configuration typographique
export const typography: TypographySystem = {
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
  
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  
  letterSpacing: {
    tighter: -0.5,
    tight: -0.25,
    normal: 0,
    wide: 0.25,
  },
};

// Styles typographiques prédéfinis
export const textStyles = {
  // En-têtes
  h1: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.lineHeight.tight,
    letterSpacing: typography.letterSpacing.tight,
  },
  h2: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.lineHeight.tight,
    letterSpacing: typography.letterSpacing.tight,
  },
  h3: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.tight,
    letterSpacing: typography.letterSpacing.tight,
  },
  h4: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.tight,
    letterSpacing: typography.letterSpacing.normal,
  },
  
  // Corps de texte
  body: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.normal,
    letterSpacing: typography.letterSpacing.normal,
  },
  bodyLarge: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.relaxed,
    letterSpacing: typography.letterSpacing.normal,
  },
  bodySmall: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.normal,
    letterSpacing: typography.letterSpacing.normal,
  },
  bodyXSmall: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.normal,
    letterSpacing: typography.letterSpacing.normal,
  },
  
  // Labels et boutons
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.lineHeight.normal,
    letterSpacing: typography.letterSpacing.wide,
  },
  button: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.normal,
    letterSpacing: typography.letterSpacing.wide,
  },
  buttonSmall: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.normal,
    letterSpacing: typography.letterSpacing.wide,
  },
  
  // Spécialités
  caption: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.normal,
    letterSpacing: typography.letterSpacing.normal,
  },
  overline: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.lineHeight.normal,
    letterSpacing: typography.letterSpacing.wide,
    textTransform: 'uppercase' as const,
  },
  numeric: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.lineHeight.normal,
    letterSpacing: typography.letterSpacing.tight,
    fontVariant: ['tabular-nums'] as any,
  },
  numericLarge: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.tight,
    letterSpacing: typography.letterSpacing.tight,
    fontVariant: ['tabular-nums'] as any,
  },
};

// Types pour TypeScript
export type TextVariant = keyof typeof textStyles;
export type FontSize = keyof FontSizeScale;
export type FontWeight = keyof FontWeightScale;
export type LineHeight = keyof LineHeightScale;

// Helper pour obtenir les styles typographiques
export const getTextStyle = (variant: TextVariant) => {
  return textStyles[variant];
};

// Configuration responsive (pour future utilisation)
export const responsiveTypography = {
  small: typography,
  medium: {
    ...typography,
    fontSize: {
      ...typography.fontSize,
      '4xl': 40,
      '5xl': 56,
    },
  },
  large: {
    ...typography,
    fontSize: {
      ...typography.fontSize,
      '4xl': 44,
      '5xl': 64,
    },
  },
};