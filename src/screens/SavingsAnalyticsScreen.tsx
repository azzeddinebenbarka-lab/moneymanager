// src/screens/SavingsAnalyticsScreen.tsx
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

// Composant Header personnalisé
const Header = ({ 
  title, 
  showBackButton, 
  onBackPress 
}: { 
  title: string; 
  showBackButton?: boolean; 
  onBackPress?: () => void;
}) => (
  <View style={styles.header}>
    <View style={styles.headerContent}>
      {showBackButton && (
        <Text style={styles.backButton} onPress={onBackPress}>
          ←
        </Text>
      )}
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={styles.headerSpacer} />
    </View>
  </View>
);

export const SavingsAnalyticsScreen = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
      <Header 
        title="Analyses Épargne"
        showBackButton
        onBackPress={() => {}}
      />
      
      <ScrollView style={styles.content}>
        <View style={[styles.card, isDark && styles.darkCard]}>
          <Text style={[styles.cardTitle, isDark && styles.darkText]}>
            Statistiques d'Épargne
          </Text>
          <Text style={[styles.cardText, isDark && styles.darkSubtext]}>
            Fonctionnalité en cours de développement...
          </Text>
        </View>

        <View style={[styles.card, isDark && styles.darkCard]}>
          <Text style={[styles.cardTitle, isDark && styles.darkText]}>
            Progression des Objectifs
          </Text>
          <Text style={[styles.cardText, isDark && styles.darkSubtext]}>
            Graphiques et analyses détaillées à venir.
          </Text>
        </View>

        <View style={[styles.card, isDark && styles.darkCard]}>
          <Text style={[styles.cardTitle, isDark && styles.darkText]}>
            Tendances d'Épargne
          </Text>
          <Text style={[styles.cardText, isDark && styles.darkSubtext]}>
            Analyse des habitudes d'épargne mensuelles.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  darkContainer: {
    backgroundColor: '#1c1c1e',
  },
  header: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingTop: 50,
    paddingBottom: 12,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backButton: {
    fontSize: 24,
    color: '#007AFF',
    fontWeight: 'bold',
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  darkCard: {
    backgroundColor: '#2c2c2e',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  cardText: {
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

export default SavingsAnalyticsScreen;