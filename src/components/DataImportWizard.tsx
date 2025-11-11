// src/components/DataImportWizard.tsx
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    Button as RNButton // Import correct du Button React Native
    ,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useDataMigration } from '../hooks/useDataMigration';
import { MySQLData } from '../services/database/migrationService';

interface DataImportWizardProps {
  onComplete: () => void;
  onCancel: () => void;
}

export const DataImportWizard: React.FC<DataImportWizardProps> = ({ 
  onComplete, 
  onCancel 
}) => {
  const [importData, setImportData] = useState<MySQLData | null>(null);
  const { 
    isMigrating, 
    migrationProgress, 
    migrationError, 
    migrationStats, 
    migrateData,
    resetMigration 
  } = useDataMigration();

  const handleFileSelect = () => {
    // Simulation de sélection de fichier
    Alert.alert(
      'Sélection de fichier',
      'Fonctionnalité à implémenter. Pour le moment, nous utiliserons des données de test.',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Utiliser données de test', 
          onPress: () => {
            const sampleData: MySQLData = {
              accounts: [
                {
                  id: 1,
                  household_id: 1,
                  name: 'Espèces',
                  type: 'cash',
                  balance: 0.00,
                  color: '#10B981',
                  icon: '💵',
                  is_default: 0,
                  created_at: '2025-10-17 15:31:02'
                },
                {
                  id: 2,
                  household_id: 1,
                  name: 'Compte Courant',
                  type: 'bank',
                  balance: 0.00,
                  color: '#3B82F6',
                  icon: '🏦',
                  is_default: 0,
                  created_at: '2025-10-17 15:31:02'
                }
              ],
              categories: [
                {
                  id: 1,
                  household_id: 1,
                  name: 'Prime',
                  type: 'income',
                  color: '#10B981',
                  icon: '💰',
                  created_at: '2025-10-14 11:37:19'
                },
                {
                  id: 2,
                  household_id: 1,
                  name: 'T9edya',
                  type: 'expense',
                  color: '#06D6A0',
                  icon: '💵',
                  created_at: '2025-10-14 11:37:19'
                }
              ],
              expenses: [
                {
                  id: 167,
                  household_id: 1,
                  amount: 1000.00,
                  category: 'T9edya',
                  date: '2025-10-05',
                  description: 'T9edya octobre 2025',
                  created_at: '2025-10-14 12:40:56',
                  account_id: 1,
                  payment_method: 'cash'
                }
              ],
              incomes: [
                {
                  id: 83,
                  household_id: 1,
                  amount: 8000.00,
                  type: 'Salaire',
                  date: '2025-10-01',
                  description: '',
                  created_at: '2025-10-17 09:41:38',
                  is_recurring: 1,
                  account_id: 1
                }
              ],
              debts: [
                {
                  id: 3,
                  household_id: 1,
                  creditor: 'Cr. Mr Hussain',
                  amount: 1000.00,
                  due_date: '2025-12-10',
                  created_at: '2025-10-14 12:43:38',
                  paid: 0,
                  account_id: null
                }
              ],
              annual_expenses: [
                {
                  id: 1,
                  household_id: 1,
                  description: 'Vignette Automobile',
                  estimated_amount: 350.00,
                  is_muslim_holiday: 0,
                  hijri_month: null,
                  gregorian_month: null,
                  is_fixed_date: 1,
                  fixed_month: 1,
                  paid: 0,
                  year: 2026,
                  date_confirmed: 0,
                  created_at: '2025-10-14 09:51:40'
                }
              ],
              savings_goals: [],
              transfers: []
            };
            setImportData(sampleData);
          }
        }
      ]
    );
  };

  const handleStartMigration = async () => {
    if (!importData) {
      Alert.alert('Erreur', 'Aucune donnée à importer');
      return;
    }

    try {
      const result = await migrateData(importData);
      
      if (result.success) {
        Alert.alert('Succès', 'Migration terminée avec succès!');
        onComplete();
      } else {
        Alert.alert(
          'Avertissement', 
          `Migration terminée avec ${result.errors.length} erreurs. Vérifiez les détails.`
        );
      }
    } catch (error) {
      Alert.alert('Erreur', 'Échec de la migration des données');
    }
  };

  return (
    <Modal
      visible={true}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Assistant d'Importation</Text>
          <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <Text style={styles.subtitle}>
            Importez vos données depuis MySQL vers SQLite
          </Text>
          
          {!isMigrating && !migrationStats && (
            <View>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>1. Sélection des données</Text>
                <TouchableOpacity 
                  style={styles.fileButton}
                  onPress={handleFileSelect}
                >
                  <Text style={styles.fileButtonText}>
                    {importData ? '✅ Données chargées' : '📁 Sélectionner les données'}
                  </Text>
                </TouchableOpacity>
                {importData && (
                  <Text style={styles.fileInfo}>
                    {importData.accounts.length} comptes, {importData.categories.length} catégories, {importData.expenses.length + importData.incomes.length} transactions
                  </Text>
                )}
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>2. Vérification</Text>
                <View style={styles.infoCard}>
                  <Text style={styles.infoText}>
                    Le système va :{'\n'}
                    • Valider la structure des données{'\n'}
                    • Convertir les formats MySQL → SQLite{'\n'}
                    • Préserver les relations{'\n'}
                    • Garantir l'intégrité
                  </Text>
                </View>
              </View>

              <View style={styles.buttonContainer}>
                <RNButton 
                  title="Commencer l'import" 
                  onPress={handleStartMigration}
                  disabled={!importData}
                  color="#007AFF"
                />
                <View style={styles.spacer} />
                <RNButton 
                  title="Annuler" 
                  onPress={onCancel}
                  color="#8E8E93"
                />
              </View>
            </View>
          )}

          {isMigrating && (
            <View style={styles.progressContainer}>
              <Text style={styles.progressTitle}>Migration en cours...</Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${migrationProgress}%` }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>{migrationProgress}%</Text>
              <ActivityIndicator size="large" color="#007AFF" style={styles.spinner} />
            </View>
          )}

          {migrationStats && (
            <View style={styles.resultsContainer}>
              <Text style={styles.resultsTitle}>✅ Migration Terminée</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{migrationStats.accounts}</Text>
                  <Text style={styles.statLabel}>Comptes</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{migrationStats.categories}</Text>
                  <Text style={styles.statLabel}>Catégories</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{migrationStats.transactions}</Text>
                  <Text style={styles.statLabel}>Transactions</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{migrationStats.debts}</Text>
                  <Text style={styles.statLabel}>Dettes</Text>
                </View>
              </View>
              
              <TouchableOpacity 
                style={styles.doneButton}
                onPress={onComplete}
              >
                <Text style={styles.doneButtonText}>Terminer</Text>
              </TouchableOpacity>
            </View>
          )}

          {migrationError && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorTitle}>❌ Erreur</Text>
              <Text style={styles.errorText}>{migrationError}</Text>
              <TouchableOpacity 
                style={styles.retryButton}
                onPress={() => {
                  resetMigration();
                  setImportData(null);
                }}
              >
                <Text style={styles.retryButtonText}>Réessayer</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#8E8E93',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#000',
  },
  fileButton: {
    backgroundColor: '#F2F2F7',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C6C6C8',
    borderStyle: 'dashed',
  },
  fileButtonText: {
    fontSize: 16,
    color: '#000',
  },
  fileInfo: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 8,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: '#F2F8FF',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  infoText: {
    fontSize: 14,
    color: '#000',
    lineHeight: 20,
  },
  buttonContainer: {
    marginTop: 24,
  },
  spacer: {
    height: 12,
  },
  progressContainer: {
    alignItems: 'center',
    padding: 24,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#000',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#F2F2F7',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 16,
  },
  spinner: {
    marginTop: 8,
  },
  resultsContainer: {
    alignItems: 'center',
    padding: 24,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#000',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
    width: '48%',
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#F2F8FF',
    borderRadius: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
  },
  doneButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  doneButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: '#FFF2F2',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30',
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#D70000',
  },
  errorText: {
    fontSize: 14,
    color: '#D70000',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#FF3B30',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DataImportWizard;