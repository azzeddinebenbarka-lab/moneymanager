// src/components/security/BiometricPrompt.tsx
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { BiometricAuth } from '../../services/auth/biometricAuth';

interface BiometricPromptProps { 
  visible: boolean;
  onSuccess: () => void;
  onCancel: () => void;
  onFallback?: () => void;
  title?: string;
  subtitle?: string;
}

export const BiometricPrompt: React.FC<BiometricPromptProps> = ({
  visible,
  onSuccess,
  onCancel,
  onFallback,
  title = 'Authentification biométrique',
  subtitle = 'Utilisez votre empreinte digitale ou votre visage pour vous authentifier',
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [biometricInfo, setBiometricInfo] = useState<{
    available: boolean;
    type: string;
  } | null>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    if (visible) {
      checkBiometricAvailability();
    }
  }, [visible]);

  const checkBiometricAvailability = async () => {
    try {
      const { available, types } = await BiometricAuth.isAvailable();
      const typeName = BiometricAuth.getBiometricTypeName(types);
      
      setBiometricInfo({
        available,
        type: typeName,
      });

      if (available) {
        startBiometricAuth();
      } else {
        setError(`${typeName} non disponible`);
      }
    } catch (error) {
      setError('Erreur de vérification biométrique');
    }
  };

  const startBiometricAuth = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await BiometricAuth.authenticate();

      if (result.success) {
        onSuccess();
      } else {
        setError(result.error || 'Authentification échouée');
      }
    } catch (error) {
      setError('Erreur lors de l\'authentification');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    startBiometricAuth();
  };

  const handleFallback = () => {
    onFallback?.();
  };

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
      borderRadius: 16,
      padding: 24,
      margin: 20,
      width: '80%',
      maxWidth: 400,
      alignItems: 'center',
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 8,
      color: isDark ? '#FFFFFF' : '#000000',
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      marginBottom: 24,
      color: isDark ? '#8E8E93' : '#666666',
      textAlign: 'center',
      lineHeight: 22,
    },
    biometricType: {
      fontSize: 14,
      marginBottom: 24,
      color: isDark ? '#8E8E93' : '#666666',
      textAlign: 'center',
      fontStyle: 'italic',
    },
    errorText: {
      color: '#FF3B30',
      fontSize: 14,
      textAlign: 'center',
      marginBottom: 16,
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: 12,
      width: '100%',
    },
    button: {
      flex: 1,
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    primaryButton: {
      backgroundColor: '#007AFF',
    },
    secondaryButton: {
      backgroundColor: isDark ? '#48484A' : '#F2F2F7',
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '600',
    },
    primaryButtonText: {
      color: '#FFFFFF',
    },
    secondaryButtonText: {
      color: isDark ? '#FFFFFF' : '#007AFF',
    },
    loadingContainer: {
      padding: 20,
      alignItems: 'center',
    },
  });

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={[styles.subtitle, { marginTop: 16 }]}>
                Authentification en cours...
              </Text>
            </View>
          ) : (
            <>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subtitle}>{subtitle}</Text>
              
              {biometricInfo && (
                <Text style={styles.biometricType}>
                  {biometricInfo.type} disponible
                </Text>
              )}

              {error && (
                <Text style={styles.errorText}>{error}</Text>
              )}

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.secondaryButton]}
                  onPress={onCancel}
                >
                  <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                    Annuler
                  </Text>
                </TouchableOpacity>

                {onFallback && (
                  <TouchableOpacity
                    style={[styles.button, styles.secondaryButton]}
                    onPress={handleFallback}
                  >
                    <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                      Code PIN
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={[styles.button, styles.primaryButton]}
                  onPress={handleRetry}
                >
                  <Text style={[styles.buttonText, styles.primaryButtonText]}>
                    Réessayer
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};