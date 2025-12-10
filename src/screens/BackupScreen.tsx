// src/screens/BackupScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import * as Sharing from 'expo-sharing';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from '../components/SafeAreaView';
import { useLanguage } from '../context/LanguageContext';
import { useDesignSystem } from '../context/ThemeContext';
import { useBackup } from '../hooks/useBackup';
import { AutoBackupScheduler } from '../services/backup/autoBackupScheduler';

const AUTO_BACKUP_KEY = '@auto_backup_enabled';
const LAST_BACKUP_KEY = '@last_backup_date';

export const BackupScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { t } = useLanguage();
  const { colors } = useDesignSystem();
  const { createBackup, importData, isLoading: backupLoading } = useBackup();
  
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(false);
  const [lastBackupDate, setLastBackupDate] = useState<string | null>(null);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);

  // Charger les paramètres au montage
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const [autoBackup, lastBackup] = await Promise.all([
        AsyncStorage.getItem(AUTO_BACKUP_KEY),
        AsyncStorage.getItem(LAST_BACKUP_KEY)
      ]);
      
      setAutoBackupEnabled(autoBackup === 'true');
      setLastBackupDate(lastBackup);
    } catch (error) {
      console.error('❌ Erreur chargement paramètres:', error);
    } finally {
      setIsLoadingSettings(false);
    }
  };

  const handleToggleAutoBackup = async (value: boolean) => {
    try {
      await AsyncStorage.setItem(AUTO_BACKUP_KEY, value.toString());
      setAutoBackupEnabled(value);
      
      // Activer/désactiver la sauvegarde automatique avec le scheduler
      if (value) {
        await AutoBackupScheduler.enable();
        Alert.alert(
          t.autoBackupTitle,
          t.autoBackupEnabledMessage,
          [{ text: 'OK' }]
        );
      } else {
        await AutoBackupScheduler.disable();
      }
    } catch (error) {
      Alert.alert(t.error, t.cannotModifySettings);
    }
  };

  const handleCreateBackup = async () => {
    try {
      Alert.alert(
        t.createBackup,
        t.createBackupQuestion,
        [
          { text: t.cancel, style: 'cancel' },
          {
            text: t.createAction,
            onPress: async () => {
              try {
                const result = await createBackup();
                
                if (result.success) {
                  const now = new Date().toISOString();
                  await AsyncStorage.setItem(LAST_BACKUP_KEY, now);
                  setLastBackupDate(now);
                  
                  Alert.alert(
                    t.createBackup,
                    t.backupCreated,
                    [{ text: 'OK' }]
                  );
                }
              } catch (error) {
                Alert.alert(
                  t.error,
                  error instanceof Error ? error.message : t.cannotChangePassword
                );
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('❌ Erreur création backup:', error);
    }
  };

  const handleExportJSON = async () => {
    try {
      Alert.alert(
        t.exportJSON,
        t.exportJSONQuestion,
        [
          { text: t.cancel, style: 'cancel' },
          {
            text: t.exportAction,
            onPress: async () => {
              try {
                console.log('📤 Début export JSON complet...');
                const result = await createBackup();
                
                if (result.success && result.filePath) {
                  console.log('✅ Export créé:', result.filePath);
                  
                  const canShare = await Sharing.isAvailableAsync();
                  if (canShare) {
                    await Sharing.shareAsync(result.filePath, {
                      mimeType: 'application/json',
                      dialogTitle: t.exportAction
                    });
                  }
                  
                  // Mettre à jour la date de dernière sauvegarde
                  const now = new Date().toISOString();
                  await AsyncStorage.setItem(LAST_BACKUP_KEY, now);
                  setLastBackupDate(now);
                  
                  Alert.alert(t.success, t.exportJSONSuccess, [{ text: 'OK' }]);
                } else {
                  throw new Error(result.error || t.exportFailed);
                }
              } catch (error) {
                console.error('❌ Erreur export JSON:', error);
                Alert.alert(
                  t.exportError,
                  error instanceof Error ? error.message : t.cannotExportData
                );
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('❌ Erreur export JSON:', error);
    }
  };

  const handleExportCSV = async () => {
    try {
      Alert.alert(
        t.exportCSV,
        t.exportCSVQuestion,
        [
          { text: t.cancel, style: 'cancel' },
          {
            text: t.exportAction,
            onPress: async () => {
              try {
                const result = await exportTransactions(undefined, undefined, 'csv');
                
                if (result.success && result.filePath) {
                  const canShare = await Sharing.isAvailableAsync();
                  if (canShare) {
                    await Sharing.shareAsync(result.filePath, {
                      mimeType: 'text/csv',
                      dialogTitle: t.exportAction
                    });
                  }
                  
                  Alert.alert(t.success, t.exportCompleted, [{ text: 'OK' }]);
                }
              } catch (error) {
                Alert.alert(
                  t.exportError,
                  error instanceof Error ? error.message : t.cannotExportTransactions
                );
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('❌ Erreur export CSV:', error);
    }
  };

  const handleImportData = async () => {
    try {
      Alert.alert(
        t.importData,
        t.replaceCurrentData,
        [
          { text: t.cancel, style: 'cancel' },
          {
            text: t.continue,
            style: 'destructive',
            onPress: async () => {
              try {
                const result = await DocumentPicker.getDocumentAsync({
                  type: ['application/json', 'text/csv'],
                  copyToCacheDirectory: true
                });

                if (result.canceled) return;

                // Déterminer le format
                const fileName = result.assets[0].name;
                const format = fileName.endsWith('.csv') ? 'csv' : 'json';
                const fileUri = result.assets[0].uri;

                // Importer les données
                const importResult = await importData(fileUri, format);

                if (importResult.success) {
                  Alert.alert(
                    t.importSuccess,
                    format === 'json'
                      ? `Import terminé:\n• ${importResult.imported?.accounts || 0} comptes\n• ${importResult.imported?.transactions || 0} transactions\n• ${importResult.imported?.categories || 0} catégories\n• ${importResult.imported?.budgets || 0} budgets\n• ${importResult.imported?.annualCharges || 0} charges annuelles`
                      : `${importResult.imported} transactions importées`,
                    [{ text: 'OK' }]
                  );
                } else {
                  Alert.alert(t.error, importResult.error || t.cannotImportData);
                }
              } catch (error) {
                Alert.alert(
                  t.error,
                  error instanceof Error ? error.message : t.cannotImportData
                );
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('❌ Erreur import:', error);
    }
  };

  const formatDate = (isoDate: string | null) => {
    if (!isoDate) return t.never;
    
    const date = new Date(isoDate);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoadingSettings) {
    return (
      <SafeAreaView>
        <View style={[styles.container, { backgroundColor: colors.background.primary }, styles.loadingContainer]}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
          <Text style={[styles.loadingText, { color: colors.text.primary }]}>
            {t.loading}...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.background.card }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
              {t.backupExport}
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.text.secondary }]}>
              {t.protectFinancialData}
            </Text>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Sauvegarde automatique */}
          <View style={styles.section}>
            <Text style={[styles.sectionHeader, { color: colors.text.secondary }]}>
              {t.autoBackupTitle.toUpperCase()}
            </Text>
            
            <View style={[styles.card, { backgroundColor: colors.background.secondary }]}>
              <View style={[styles.iconContainer, { backgroundColor: colors.primary[100] }]}>
                <Ionicons name="cloud-upload-outline" size={24} color={colors.primary[500]} />
              </View>
              <View style={styles.cardContent}>
                <Text style={[styles.cardTitle, { color: colors.text.primary }]}>
                  {t.autoBackupTitle}
                </Text>
                <Text style={[styles.cardDescription, { color: colors.text.secondary }]}>
                  {t.dailyAutoBackup}
                </Text>
              </View>
              <Switch
                value={autoBackupEnabled}
                onValueChange={handleToggleAutoBackup}
                trackColor={{ false: colors.text.tertiary, true: colors.primary[500] }}
                thumbColor="#ffffff"
              />
            </View>

            {lastBackupDate && (
              <View style={[styles.infoCard, { backgroundColor: colors.primary[50] }]}>
                <Ionicons name="time-outline" size={16} color={colors.primary[500]} />
                <Text style={[styles.infoText, { color: colors.primary[700] }]}>
                  {t.lastBackup} : {formatDate(lastBackupDate)}
                </Text>
              </View>
            )}
          </View>

          {/* Sauvegarde manuelle */}
          <View style={styles.section}>
            <Text style={[styles.sectionHeader, { color: colors.text.secondary }]}>
              {t.createBackup.toUpperCase()}
            </Text>
            
            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: colors.background.secondary }]}
              onPress={handleCreateBackup}
              disabled={backupLoading}
            >
              <View style={[styles.actionIconBox, { backgroundColor: '#E8F5E9' }]}>
                <Ionicons name="save-outline" size={24} color="#4CAF50" />
              </View>
              <View style={styles.actionContent}>
                <Text style={[styles.actionTitle, { color: colors.text.primary }]}>
                  {t.createBackup}
                </Text>
                <Text style={[styles.actionDescription, { color: colors.text.secondary }]}>
                  {t.completeBackupAllData}
                </Text>
              </View>
              {backupLoading ? (
                <ActivityIndicator size="small" color={colors.primary[500]} />
              ) : (
                <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
              )}
            </TouchableOpacity>
          </View>

          {/* Export des données */}
          <View style={styles.section}>
            <Text style={[styles.sectionHeader, { color: colors.text.secondary }]}>
              {t.exportAction.toUpperCase()}
            </Text>
            
            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: colors.background.secondary }]}
              onPress={handleExportJSON}
              disabled={backupLoading}
            >
              <View style={[styles.actionIconBox, { backgroundColor: '#E3F2FD' }]}>
                <Ionicons name="code-outline" size={24} color="#2196F3" />
              </View>
              <View style={styles.actionContent}>
                <Text style={[styles.actionTitle, { color: colors.text.primary }]}>
                  {t.exportJSON}
                </Text>
                <Text style={[styles.actionDescription, { color: colors.text.secondary }]}>
                  {t.structuredFormatReimport}
                </Text>
              </View>
              {backupLoading ? (
                <ActivityIndicator size="small" color={colors.primary[500]} />
              ) : (
                <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: colors.background.secondary }]}
              onPress={handleExportCSV}
              disabled={backupLoading}
            >
              <View style={[styles.actionIconBox, { backgroundColor: '#FFF3E0' }]}>
                <Ionicons name="document-text-outline" size={24} color="#FF9800" />
              </View>
              <View style={styles.actionContent}>
                <Text style={[styles.actionTitle, { color: colors.text.primary }]}>
                  {t.exportCSV}
                </Text>
                <Text style={[styles.actionDescription, { color: colors.text.secondary }]}>
                  {t.exportTransactionsCSV}
                </Text>
              </View>
              {backupLoading ? (
                <ActivityIndicator size="small" color={colors.primary[500]} />
              ) : (
                <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
              )}
            </TouchableOpacity>
          </View>

          {/* Import des données */}
          <View style={styles.section}>
            <Text style={[styles.sectionHeader, { color: colors.text.secondary }]}>
              {t.importDataTitle.toUpperCase()}
            </Text>
            
            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: colors.background.secondary }]}
              onPress={handleImportData}
            >
              <View style={[styles.actionIconBox, { backgroundColor: '#FFF3E0' }]}>
                <Ionicons name="cloud-download-outline" size={24} color="#FF9800" />
              </View>
              <View style={styles.actionContent}>
                <Text style={[styles.actionTitle, { color: colors.text.primary }]}>
                  {t.restoreBackup}
                </Text>
                <Text style={[styles.actionDescription, { color: colors.text.secondary }]}>
                  {t.importFromJSONorCSV}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
            </TouchableOpacity>

            <View style={[styles.warningCard, { backgroundColor: '#FFF3E0' }]}>
              <Ionicons name="warning-outline" size={20} color="#F57C00" />
              <Text style={[styles.warningText, { color: '#E65100' }]}>
                {t.importWarning}
              </Text>
            </View>
          </View>

          {/* Informations */}
          <View style={[styles.infoSection, { backgroundColor: colors.primary[50] }]}>
            <Ionicons name="information-circle-outline" size={24} color={colors.primary[500]} />
            <View style={styles.infoContent}>
              <Text style={[styles.infoTitle, { color: colors.primary[700] }]}>
                {t.dataSecurity}
              </Text>
              <Text style={[styles.infoDescription, { color: colors.primary[600] }]}>
                {t.dataSecurityMessage}
              </Text>
            </View>
          </View>

          <View style={styles.spacer} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  cardDescription: {
    fontSize: 14,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  infoText: {
    fontSize: 13,
    flex: 1,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 14,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  warningCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 12,
    gap: 12,
    marginTop: 4,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  infoSection: {
    marginHorizontal: 20,
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  infoDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  spacer: {
    height: 40,
  },
});

export default BackupScreen;