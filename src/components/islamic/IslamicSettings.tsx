// src/components/islamic/IslamicSettings.tsx - VERSION COMPLÈTE
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export const IslamicSettings: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
      <Text style={[styles.title, isDark && styles.darkText]}>
        Paramètres Islamiques
      </Text>
      <Text style={[styles.description, isDark && styles.darkSubtext]}>
        Configurez les paramètres des charges islamiques
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
  },
  darkContainer: {
    backgroundColor: '#2c2c2e',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  darkText: {
    color: '#fff',
  },
  darkSubtext: {
    color: '#888',
  },
});

export default IslamicSettings;