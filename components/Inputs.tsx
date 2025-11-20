// src/design/Components/Inputs.tsx
import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import { useDesignSystem } from '../../context/ThemeContext';
import { getTextStyle } from '../Typography';

export type InputVariant = 'outlined' | 'filled' | 'underlined';
export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  variant?: InputVariant;
  size?: InputSize;
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  variant = 'outlined',
  size = 'md',
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  containerStyle,
  inputStyle,
  fullWidth = false,
  onFocus,
  onBlur,
  ...textInputProps
}) => {
  const { colors, spacing } = useDesignSystem();
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const getContainerStyles = (): ViewStyle[] => {
    const baseStyle: ViewStyle = {
      alignSelf: fullWidth ? 'stretch' : 'flex-start',
    };

    const variantStyles: Record<InputVariant, ViewStyle> = {
      outlined: {
        borderWidth: 1,
        borderColor: error 
          ? colors.semantic.error 
          : isFocused 
          ? colors.primary[500] 
          : colors.border.primary,
        borderRadius: 8,
        backgroundColor: colors.background.primary,
      },
      filled: {
        backgroundColor: colors.background.secondary,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'transparent',
      },
      underlined: {
        borderBottomWidth: 1,
        borderColor: error 
          ? colors.semantic.error 
          : isFocused 
          ? colors.primary[500] 
          : colors.border.primary,
        backgroundColor: 'transparent',
        borderRadius: 0,
      },
    };

    const sizeStyles: Record<InputSize, ViewStyle> = {
      sm: {
        paddingVertical: spacing[1.5],
        paddingHorizontal: spacing[3],
        minHeight: 32,
      },
      md: {
        paddingVertical: spacing[2],
        paddingHorizontal: spacing[3],
        minHeight: 40,
      },
      lg: {
        paddingVertical: spacing[3],
        paddingHorizontal: spacing[4],
        minHeight: 48,
      },
    };

    return [baseStyle, variantStyles[variant], sizeStyles[size], containerStyle];
  };

  const getInputStyles = (): TextStyle[] => {
    const baseStyle: TextStyle = {
      color: colors.text.primary,
      flex: 1,
      padding: 0,
      margin: 0,
    };

    const sizeStyles: Record<InputSize, TextStyle> = {
      sm: getTextStyle('bodySmall'),
      md: getTextStyle('body'),
      lg: getTextStyle('bodyLarge'),
    };

    return [baseStyle, sizeStyles[size], inputStyle];
  };

  const hasLeftIcon = !!leftIcon;
  const hasRightIcon = !!rightIcon;

  return (
    <View style={[styles.container, { width: fullWidth ? '100%' : 'auto' }]}>
      {label && (
        <Text style={[getTextStyle('label'), styles.label, { color: colors.text.secondary }]}>
          {label}
        </Text>
      )}
      
      <View style={getContainerStyles()}>
        <View style={styles.inputWrapper}>
          {leftIcon && (
            <View style={[styles.icon, styles.leftIcon]}>
              {leftIcon}
            </View>
          )}
          
          <TextInput
            style={getInputStyles()}
            placeholderTextColor={colors.text.disabled}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...textInputProps}
          />
          
          {rightIcon && (
            <View style={[styles.icon, styles.rightIcon]}>
              {rightIcon}
            </View>
          )}
        </View>
      </View>

      {(error || helperText) && (
        <Text 
          style={[
            getTextStyle('caption'), 
            styles.helperText, 
            { color: error ? colors.semantic.error : colors.text.tertiary }
          ]}
        >
          {error || helperText}
        </Text>
      )}
    </View>
  );
};

// Champ de saisie avec masque (pour montants)
interface CurrencyInputProps extends Omit<InputProps, 'value' | 'onChangeText'> {
  value: number;
  onValueChange: (value: number) => void;
  currency?: string;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  value,
  onValueChange,
  currency = 'MAD',
  ...inputProps
}) => {
  const [displayValue, setDisplayValue] = useState(value ? value.toString() : '');

  const handleChange = (text: string) => {
    // Nettoyer le texte (supprimer tout sauf les chiffres et le point décimal)
    const cleaned = text.replace(/[^\d.,]/g, '').replace(',', '.');
    
    // Si vide, mettre à jour avec 0
    if (cleaned === '') {
      setDisplayValue('');
      onValueChange(0);
      return;
    }

    // Vérifier si c'est un nombre valide
    const numberValue = parseFloat(cleaned);
    if (!isNaN(numberValue)) {
      setDisplayValue(cleaned);
      onValueChange(numberValue);
    }
  };

  const formatDisplayValue = (val: number): string => {
    if (val === 0) return '';
    return val.toString().replace('.', ',');
  };

  return (
    <Input
      {...inputProps}
      value={value ? formatDisplayValue(value) : displayValue}
      onChangeText={handleChange}
      keyboardType="decimal-pad"
      placeholder={`0,00 ${currency}`}
    />
  );
};

// Champ de recherche
interface SearchInputProps extends Omit<InputProps, 'leftIcon'> {
  onClear?: () => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onClear,
  ...inputProps
}) => {
  const { colors } = useDesignSystem();

  return (
    <Input
      {...inputProps}
      leftIcon={<>🔍</>} // Icône de recherche
      rightIcon={
        value ? (
          <TouchableOpacity onPress={onClear} style={styles.clearButton}>
            <Text style={[getTextStyle('body'), { color: colors.text.tertiary }]}>
              ✕
            </Text>
          </TouchableOpacity>
        ) : undefined
      }
      placeholder="Rechercher..."
    />
  );
};

// Sélecteur
interface SelectProps extends Omit<InputProps, 'editable'> {
  options: { label: string; value: string }[];
  onValueChange: (value: string) => void;
  value?: string;
}

export const Select: React.FC<SelectProps> = ({
  options,
  onValueChange,
  value,
  ...inputProps
}) => {
  const { colors } = useDesignSystem();
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <View style={styles.selectContainer}>
      <TouchableOpacity
        onPress={() => setIsOpen(!isOpen)}
        style={styles.selectTrigger}
      >
        <Input
          {...inputProps}
          value={selectedOption?.label || ''}
          editable={false}
          rightIcon={<>▼</>}
          pointerEvents="none"
        />
      </TouchableOpacity>

      {isOpen && (
        <View style={[styles.selectOptions, { backgroundColor: colors.background.card }]}>
          {options.map(option => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.selectOption,
                { 
                  backgroundColor: option.value === value 
                    ? colors.primary[50] 
                    : 'transparent' 
                }
              ]}
              onPress={() => {
                onValueChange(option.value);
                setIsOpen(false);
              }}
            >
              <Text style={getTextStyle('body')}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  label: {
    marginBottom: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
  helperText: {
    marginTop: 4,
  },
  clearButton: {
    padding: 4,
  },
  selectContainer: {
    position: 'relative',
  },
  selectTrigger: {
    width: '100%',
  },
  selectOptions: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    zIndex: 1000,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginTop: 4,
    maxHeight: 200,
    overflow: 'scroll',
  },
  selectOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
});

export default Input;