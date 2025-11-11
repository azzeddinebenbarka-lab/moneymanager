// components/ui/Button.tsx - Version temporaire
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  isDark?: boolean; // ← Ajout manuel
}

export const Button: React.FC<ButtonProps> = ({ 
  title, 
  onPress, 
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  isDark = false // ← Valeur par défaut
}) => {
  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[size]];
    
    if (disabled) {
      return [...baseStyle, styles.disabled];
    }

    switch (variant) {
      case 'primary':
        return [...baseStyle, styles.primary, isDark && styles.darkPrimary];
      case 'secondary':
        return [...baseStyle, styles.secondary, isDark && styles.darkSecondary];
      case 'outline':
        return [...baseStyle, styles.outline, isDark && styles.darkOutline];
      default:
        return baseStyle;
    }
  };

  const getTextStyle = () => {
    const baseStyle = [styles.buttonText, styles[`${size}Text`]];
    
    if (disabled) {
      return [...baseStyle, styles.disabledText];
    }

    switch (variant) {
      case 'primary':
        return [...baseStyle, styles.primaryText];
      case 'secondary':
        return [...baseStyle, styles.secondaryText, isDark && styles.darkSecondaryText];
      case 'outline':
        return [...baseStyle, styles.outlineText, isDark && styles.darkOutlineText];
      default:
        return baseStyle;
    }
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' ? '#fff' : '#007AFF'} 
        />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

// Les styles restent identiques...
const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  small: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  medium: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  large: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  primary: {
    backgroundColor: '#007AFF',
  },
  darkPrimary: {
    backgroundColor: '#0A84FF',
  },
  secondary: {
    backgroundColor: '#f8f9fa',
  },
  darkSecondary: {
    backgroundColor: '#2c2c2e',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  darkOutline: {
    borderColor: '#0A84FF',
  },
  disabled: {
    backgroundColor: '#ccc',
    borderColor: '#ccc',
  },
  buttonText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  primaryText: {
    color: '#fff',
  },
  secondaryText: {
    color: '#000',
  },
  darkSecondaryText: {
    color: '#fff',
  },
  outlineText: {
    color: '#007AFF',
  },
  darkOutlineText: {
    color: '#0A84FF',
  },
  disabledText: {
    color: '#999',
  },
});