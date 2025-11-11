// screens/BackupScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const BackupScreen = () => {
  const { theme } = useTheme();
  const [backupEnabled, setBackupEnabled] = useState(false);
  const isDark = theme === 'dark';

  const handleBackupToggle = () => {
    setBackupEnabled(!backupEnabled);
    Alert.alert(
      backupEnabled ? 'Sauvegarde désactivée' : 'Sauvegarde activée',
      backupEnabled 
        ? 'La sauvegarde automatique est désactivée'
        : 'Vos données seront sauvegardées automatiquement'
    );
  };

  const handleExportData = () => {
    Alert.alert('Export réussi', 'Vos données ont été exportées avec succès');
  };

  const handleImportData = () => {
    Alert.alert('Import', 'Fonctionnalité d\'import à venir');
  };

  return (
    <ScrollView style={[styles.container, isDark && styles.darkContainer]}>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, isDark && styles.darkText]}>
          Sauvegarde & Export
        </Text>

        {/* Sauvegarde automatique */}
        <View style={[styles.card, isDark && styles.darkCard]}>
          <View style={styles.cardHeader}>
            <Ionicons name="cloud-upload" size={24} color="#007AFF" />
            <Text style={[styles.cardTitle, isDark && styles.darkText]}>
              Sauvegarde automatique
            </Text>
          </View>
          <Text style={[styles.cardDescription, isDark && styles.darkSubtext]}>
            Sauvegarde automatique de vos données sur le cloud
          </Text>
          <TouchableOpacity 
            style={[styles.toggleButton, backupEnabled && styles.toggleButtonActive]}
            onPress={handleBackupToggle}
          >
            <View style={[styles.toggleCircle, backupEnabled && styles.toggleCircleActive]} />
          </TouchableOpacity>
        </View>

        {/* Export manuel */}
        <View style={[styles.card, isDark && styles.darkCard]}>
          <View style={styles.cardHeader}>
            <Ionicons name="download-outline" size={24} color="#34C759" />
            <Text style={[styles.cardTitle, isDark && styles.darkText]}>
              Export des données
            </Text>
          </View>
          <Text style={[styles.cardDescription, isDark && styles.darkSubtext]}>
            Téléchargez vos données au format CSV ou JSON
          </Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.exportButton]}
              onPress={handleExportData}
            >
              <Ionicons name="document-text-outline" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Exporter CSV</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.exportButton]}
              onPress={handleExportData}
            >
              <Ionicons name="code-outline" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Exporter JSON</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Import */}
        <View style={[styles.card, isDark && styles.darkCard]}>
          <View style={styles.cardHeader}>
            <Ionicons name="cloud-download-outline" size={24} color="#FF9500" />
            <Text style={[styles.cardTitle, isDark && styles.darkText]}>
              Import des données
            </Text>
          </View>
          <Text style={[styles.cardDescription, isDark && styles.darkSubtext]}>
            Importez vos données depuis un fichier
          </Text>
          <TouchableOpacity 
            style={[styles.actionButton, styles.importButton]}
            onPress={handleImportData}
          >
            <Ionicons name="folder-open-outline" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Importer des données</Text>
          </TouchableOpacity>
        </View>

        {/* Informations */}
        <View style={[styles.card, isDark && styles.darkCard]}>
          <View style={styles.cardHeader}>
            <Ionicons name="information-circle-outline" size={24} color="#FF3B30" />
            <Text style={[styles.cardTitle, isDark && styles.darkText]}>
              Informations
            </Text>
          </View>
          <Text style={[styles.infoText, isDark && styles.darkSubtext]}>
            • Dernière sauvegarde: Aujourd'hui, 14:30
          </Text>
          <Text style={[styles.infoText, isDark && styles.darkSubtext]}>
            • Taille des données: 2.4 MB
          </Text>
          <Text style={[styles.infoText, isDark && styles.darkSubtext]}>
            • Comptes sauvegardés: 3
          </Text>
          <Text style={[styles.infoText, isDark && styles.darkSubtext]}>
            • Transactions sauvegardées: 45
          </Text>
        </View>
      </View>
    </ScrollView>
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
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginLeft: 12,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  toggleButton: {
    width: 50,
    height: 28,
    backgroundColor: '#ccc',
    borderRadius: 14,
    padding: 2,
    alignSelf: 'flex-start',
  },
  toggleButtonActive: {
    backgroundColor: '#007AFF',
  },
  toggleCircle: {
    width: 24,
    height: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    transform: [{ translateX: 0 }],
  },
  toggleCircleActive: {
    transform: [{ translateX: 22 }],
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  exportButton: {
    backgroundColor: '#34C759',
  },
  importButton: {
    backgroundColor: '#FF9500',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  darkText: {
    color: '#fff',
  },
  darkSubtext: {
    color: '#888',
  },
});

export default BackupScreen;