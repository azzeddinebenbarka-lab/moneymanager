// components/DatabaseLoader.tsx - VERSION AMÉLIORÉE
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDatabase } from '../context/DatabaseContext';
import { useTheme } from '../context/ThemeContext';

export const DatabaseLoader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { dbInitialized, isLoading, error, retryInitialization, resetDatabase } = useDatabase();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (isLoading) {
    return (
      <View style={[styles.container, isDark && styles.darkContainer]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={[styles.loadingText, isDark && styles.darkText]}>
          Initialisation de la base de données...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, isDark && styles.darkContainer]}>
        <Text style={[styles.errorTitle, isDark && styles.darkText]}>
          Erreur de base de données
        </Text>
        <Text style={[styles.errorMessage, isDark && styles.darkText]}>
          {error}
        </Text>
        <Text style={[styles.errorAdvice, isDark && styles.darkSubtext]}>
          L'application ne peut pas fonctionner sans la base de données.
        </Text>
        <View style={styles.errorButtons}>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={retryInitialization}
          >
            <Text style={styles.retryButtonText}>Réessayer</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.resetButton}
            onPress={resetDatabase}
          >
            <Text style={styles.resetButtonText}>Réinitialiser</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!dbInitialized) {
    return (
      <View style={[styles.container, isDark && styles.darkContainer]}>
        <Text style={[styles.errorTitle, isDark && styles.darkText]}>
          Base de données non initialisée
        </Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={retryInitialization}
        >
          <Text style={styles.retryButtonText}>Initialiser</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  darkContainer: {
    backgroundColor: '#1c1c1e',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginBottom: 16,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 22,
  },
  errorAdvice: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  errorButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resetButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  darkText: {
    color: '#fff',
  },
  darkSubtext: {
    color: '#888',
  },
});