// src/design/Components/Buttons.tsx
import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  GestureResponderEvent,
} from 'react-native';
import { useDesignSystem } from '../../context/ThemeContext';
import { getTextStyle, TextVariant } from '../Typography';
import { getBorderRadius } from '../Spacing';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: string;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  onPress,
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const { colors, spacing } = useDesignSystem();

  const getButtonStyles = (): ViewStyle[] => {
    const baseStyle: ViewStyle = {
      borderRadius: getBorderRadius('md'),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: fullWidth ? 'stretch' : 'flex-start',
      opacity: disabled ? 0.6 : 1,
    };

    // Styles de taille
    const sizeStyles: Record<ButtonSize, ViewStyle> = {
      sm: {
        paddingVertical: spacing[1.5],
        paddingHorizontal: spacing[3],
        minHeight: 32,
      },
      md: {
        paddingVertical: spacing[2],
        paddingHorizontal: spacing[4],
        minHeight: 40,
      },
      lg: {
        paddingVertical: spacing[3],
        paddingHorizontal: spacing[6],
        minHeight: 48,
      },
    };

    // Styles de variant
    const variantStyles: Record<ButtonVariant, ViewStyle> = {
      primary: {
        backgroundColor: colors.primary[500],
      },
      secondary: {
        backgroundColor: colors.neutral[100],
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.border.primary,
      },
      ghost: {
        backgroundColor: 'transparent',
      },
      danger: {
        backgroundColor: colors.semantic.error,
      },
    };

    return [baseStyle, sizeStyles[size], variantStyles[variant], style];
  };

  const getTextStyles = (): TextStyle[] => {
    const baseStyle: TextStyle = {
      textAlign: 'center',
    };

    // Couleurs de texte par variant
    const textColorStyles: Record<ButtonVariant, TextStyle> = {
      primary: { color: colors.text.inverse },
      secondary: { color: colors.text.primary },
      outline: { color: colors.text.primary },
      ghost: { color: colors.primary[500] },
      danger: { color: colors.text.inverse },
    };

    // Tailles de texte
    const textSizeStyles: Record<ButtonSize, TextStyle> = {
      sm: getTextStyle('buttonSmall'),
      md: getTextStyle('button'),
      lg: getTextStyle('button'),
    };

    return [baseStyle, textSizeStyles[size], textColorStyles[variant], textStyle];
  };

  const getIconColor = (): string => {
    const iconColors: Record<ButtonVariant, string> = {
      primary: colors.text.inverse,
      secondary: colors.text.primary,
      outline: colors.text.primary,
      ghost: colors.primary[500],
      danger: colors.text.inverse,
    };
    return iconColors[variant];
  };

  return (
    <TouchableOpacity
      style={getButtonStyles()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={getIconColor()} 
          style={styles.loading} 
        />
      ) : (
        <>
          {leftIcon && (
            <ButtonIcon icon={leftIcon} color={getIconColor()} style={styles.leftIcon} />
          )}
          <Text style={getTextStyles()}>
            {children}
          </Text>
          {rightIcon && (
            <ButtonIcon icon={rightIcon} color={getIconColor()} style={styles.rightIcon} />
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

// Composant d'icône pour bouton
interface ButtonIconProps {
  icon: React.ReactNode;
  color: string;
  style?: ViewStyle;
}

const ButtonIcon: React.FC<ButtonIconProps> = ({ icon, color, style }) => {
  return (
    <div style={[styles.iconContainer, style]}>
      {React.isValidElement(icon) 
        ? React.cloneElement(icon as React.ReactElement<any>, { 
            color,
            size: 16,
          })
        : icon
      }
    </div>
  );
};

// Bouton avec icône (variante courante)
interface IconButtonProps extends Omit<ButtonProps, 'children'> {
  icon: React.ReactNode;
  accessibilityLabel: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  accessibilityLabel,
  size = 'md',
  ...buttonProps
}) => {
  const { spacing } = useDesignSystem();

  const sizeStyles: Record<ButtonSize, ViewStyle> = {
    sm: { width: 32, height: 32 },
    md: { width: 40, height: 40 },
    lg: { width: 48, height: 48 },
  };

  return (
    <Button
      {...buttonProps}
      size={size}
      style={[sizeStyles[size], { padding: 0 }]}
      leftIcon={icon}
    >
      {''} {/* Texte vide pour conserver la structure */}
    </Button>
  );
};

// Groupe de boutons
interface ButtonGroupProps {
  children: React.ReactNode;
  direction?: 'horizontal' | 'vertical';
  spacing?: number;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  direction = 'horizontal',
  spacing = 8,
}) => {
  const groupStyle: ViewStyle = {
    flexDirection: direction === 'horizontal' ? 'row' : 'column',
    gap: spacing,
  };

  return <div style={groupStyle}>{children}</div>;
};

const styles = StyleSheet.create({
  loading: {
    marginRight: 0,
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Button;