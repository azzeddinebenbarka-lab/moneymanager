// src/design/index.ts

/**
 * Point d'entrée unique pour le Design System
 */

// Couleurs
export * from './Colors';

// Typographie
export * from './Typography';

// Espacements
export * from './Spacing';

// Réexport des types depuis les fichiers individuels
export type { 
  ColorPalette,
} from './Colors';

export type {
  TypographySystem,
  FontSizeScale,
  FontWeightScale,
  LineHeightScale,
  TextVariant,
} from './Typography';

export type {
  SpacingScale,
  BorderRadius,
  BorderWidth,
} from './Spacing';