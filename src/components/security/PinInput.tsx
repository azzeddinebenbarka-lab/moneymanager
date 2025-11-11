// components/security/PinInput.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');

interface PinInputProps {
  length?: number;
  onPinComplete: (pin: string) => void;
  title?: string;
  subtitle?: string;
  error?: string;
  onClearError?: () => void;
}

export const PinInput: React.FC<PinInputProps> = ({
  length = 4,
  onPinComplete,
  title = 'Entrez votre code PIN',
  subtitle = 'Pour sécuriser votre application',
  error,
  onClearError,
}) => {
  const [pin, setPin] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<TextInput[]>([]);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    if (error && onClearError) {
      const timer = setTimeout(() => {
        onClearError();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, onClearError]);

  const handlePinChange = (text: string, index: number) => {
    if (text.length > 1) {
      // Gestion du collage
      const pastedText = text.slice(0, length);
      const newPin = [...pin];
      
      pastedText.split('').forEach((char, i) => {
        if (index + i < length) {
          newPin[index + i] = char;
        }
      });
      
      setPin(newPin);
      
      // Focus sur le dernier champ
      const lastIndex = Math.min(index + pastedText.length, length - 1);
      inputRefs.current[lastIndex]?.focus();
      
      // Vérifier si le PIN est complet
      if (newPin.every(digit => digit !== '')) {
        onPinComplete(newPin.join(''));
      }
      return;
    }

    const newPin = [...pin];
    newPin[index] = text;
    setPin(newPin);

    // Passer au champ suivant si un chiffre est saisi
    if (text && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Passer au champ précédent si on efface
    if (!text && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    // Vérifier si le PIN est complet
    if (newPin.every(digit => digit !== '')) {
      onPinComplete(newPin.join(''));
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const clearPin = () => {
    setPin(Array(length).fill(''));
    inputRefs.current[0]?.focus();
  };

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 8,
      color: isDark ? '#FFFFFF' : '#000000',
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      marginBottom: 32,
      color: isDark ? '#8E8E93' : '#666666',
      textAlign: 'center',
    },
    pinContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 24,
    },
    pinInput: {
      width: 60,
      height: 60,
      borderWidth: 2,
      borderRadius: 12,
      marginHorizontal: 8,
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      color: isDark ? '#FFFFFF' : '#000000',
      borderColor: isDark ? '#48484A' : '#C6C6C8',
      backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
    },
    pinInputFocused: {
      borderColor: '#007AFF',
    },
    pinInputError: {
      borderColor: '#FF3B30',
    },
    errorText: {
      color: '#FF3B30',
      fontSize: 14,
      textAlign: 'center',
      marginBottom: 16,
    },
    clearButton: {
      padding: 12,
      borderRadius: 8,
      backgroundColor: isDark ? '#48484A' : '#F2F2F7',
    },
    clearButtonText: {
      color: isDark ? '#FFFFFF' : '#007AFF',
      fontSize: 16,
      fontWeight: '600',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      <View style={styles.pinContainer}>
        {Array.from({ length }).map((_, index) => (
          <TextInput
            key={index}
            ref={ref => {
              if (ref) inputRefs.current[index] = ref;
            }}
            style={[
              styles.pinInput,
              pin[index] && !error ? styles.pinInputFocused : {},
              error ? styles.pinInputError : {},
            ]}
            value={pin[index]}
            onChangeText={text => handlePinChange(text, index)}
            onKeyPress={e => handleKeyPress(e, index)}
            keyboardType="number-pad"
            maxLength={1}
            secureTextEntry
            autoFocus={index === 0}
            selectTextOnFocus
          />
        ))}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <TouchableOpacity style={styles.clearButton} onPress={clearPin}>
        <Text style={styles.clearButtonText}>Effacer</Text>
      </TouchableOpacity>
    </View>
  );
};