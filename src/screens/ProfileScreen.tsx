// src/screens/ProfileScreen.tsx
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from '../components/SafeAreaView';
import { useTheme } from '../context/ThemeContext';

const ProfileScreen: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <SafeAreaView>
      <ScrollView style={[styles.container, isDark && styles.darkContainer]}>
        <View style={styles.header}>
          <Text style={[styles.title, isDark && styles.darkText]}>Mon Profil</Text>
        </View>

        <View style={[styles.card, isDark && styles.darkCard]}>
          <Text style={[styles.cardTitle, isDark && styles.darkText]}>
            Informations Personnelles
          </Text>
          <View style={styles.infoItem}>
            <Text style={[styles.label, isDark && styles.darkSubtext]}>Nom</Text>
            <Text style={[styles.value, isDark && styles.darkText]}>Utilisateur</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={[styles.label, isDark && styles.darkSubtext]}>Email</Text>
            <Text style={[styles.value, isDark && styles.darkText]}>utilisateur@example.com</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={[styles.label, isDark && styles.darkSubtext]}>Devise</Text>
            <Text style={[styles.value, isDark && styles.darkText]}>MAD</Text>
          </View>
        </View>

        <View style={[styles.card, isDark && styles.darkCard]}>
          <Text style={[styles.cardTitle, isDark && styles.darkText]}>
            Statistiques
          </Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, isDark && styles.darkText]}>0</Text>
              <Text style={[styles.statLabel, isDark && styles.darkSubtext]}>Transactions</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, isDark && styles.darkText]}>0</Text>
              <Text style={[styles.statLabel, isDark && styles.darkSubtext]}>Comptes</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, isDark && styles.darkText]}>0</Text>
              <Text style={[styles.statLabel, isDark && styles.darkSubtext]}>Budgets</Text>
            </View>
          </View>
        </View>

        <View style={[styles.card, isDark && styles.darkCard]}>
          <Text style={[styles.note, isDark && styles.darkSubtext]}>
            Plus de fonctionnalités de profil seront ajoutées prochainement.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  darkContainer: {
    backgroundColor: '#1c1c1e',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  darkCard: {
    backgroundColor: '#2c2c2e',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  note: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  darkText: {
    color: '#fff',
  },
  darkSubtext: {
    color: '#888',
  },
});

export default ProfileScreen;