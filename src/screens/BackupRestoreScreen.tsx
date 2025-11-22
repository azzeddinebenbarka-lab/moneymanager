// src/screens/BackupRestoreScreen.tsx - VERSION CORRIGÉE
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useBackup } from '../hooks/useBackup';
import { CloudBackupService } from '../services/backup/cloudBackup';
import { LocalBackupService } from '../services/backup/localBackup';

interface BackupItem {
  filePath: string;
  fileName: string;
  size: number;
  timestamp: string;
  recordCount?: number;
}

export const BackupRestoreScreen: React.FC = () => {
  const { t } = useLanguage();
  const [localBackups, setLocalBackups] = useState<BackupItem[]>([]);
  const [cloudBackups, setCloudBackups] = useState<BackupItem[]>([]);
  const [cloudConfig, setCloudConfig] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBackup, setSelectedBackup] = useState<string | null>(null);
  
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const backup = useBackup();

  useEffect(() => {
    loadBackupData();
  }, []);

  const loadBackupData = async () => {
    try {
      setIsLoading(true);
      
      // Charger les sauvegardes locales
      const localResult = await LocalBackupService.listLocalBackups();
      if (localResult.success && localResult.backups) {
        setLocalBackups(localResult.backups);
      }

      // Charger les sauvegardes cloud
      const cloudResult = await CloudBackupService.listCloudBackups();
      if (cloudResult.success && cloudResult.backups) {
        // Convertir le format cloud vers BackupItem
        const formattedCloudBackups: BackupItem[] = cloudResult.backups.map(backup => ({
          filePath: backup.path,
          fileName: backup.name,
          size: backup.size,
          timestamp: backup.date,
        }));
        setCloudBackups(formattedCloudBackups);
      }

      // Charger la configuration cloud
      const config = await CloudBackupService.getConfig();
      setCloudConfig(config);

    } catch (error) {
      console.error('Error loading backup data:', error);
      Alert.alert('Erreur', 'Impossible de charger les sauvegardes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBackup = async () => {
    try {
      Alert.alert(
        'Créer une sauvegarde',
        'Choisissez le type de sauvegarde:',
        [
          {
            text: 'Locale uniquement',
            onPress: async () => {
              const result = await backup.createBackup({
                encrypt: true,
                includeSensitiveData: false,
                compression: true,
              });
              
              if (result.success) {
                Alert.alert('Succès', 'Sauvegarde locale créée avec succès');
                await loadBackupData();
              } else {
                Alert.alert('Erreur', result.error || 'Échec de la sauvegarde');
              }
            },
          },
          {
            text: 'Locale + Cloud',
            onPress: async () => {
              const localResult = await backup.createBackup();
              if (localResult.success && localResult.filePath) {
                const cloudResult = await backup.backupToCloud(localResult.filePath);
                if (cloudResult.success) {
                  Alert.alert('Succès', 'Sauvegarde locale et cloud créée avec succès');
                } else {
                  Alert.alert('Succès partiel', 'Sauvegarde locale créée, mais échec cloud');
                }
                await loadBackupData();
              } else {
                Alert.alert('Erreur', localResult.error || 'Échec de la sauvegarde locale');
              }
            },
          },
          {
            text: 'Annuler',
            style: 'cancel',
          },
        ]
      );
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de créer la sauvegarde');
    }
  };

  const handleRestoreBackup = async (backupItem: BackupItem) => {
    Alert.alert(
      'Restaurer la sauvegarde',
      `Êtes-vous sûr de vouloir restaurer "${backupItem.fileName}" ?\n\nCette action écrasera vos données actuelles.`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Sauvegarder et restaurer',
          onPress: async () => {
            try {
              // Créer une sauvegarde avant restauration
              await backup.createBackup();
              
              const result = await backup.restoreBackup(backupItem.filePath, {
                backupBeforeRestore: false, // Déjà fait
                mergeData: false,
              });
              
              if (result.success) {
                // ✅ CORRECTION : Utiliser un message générique au lieu de restoredRecords
                Alert.alert('Succès', 'Sauvegarde restaurée avec succès');
                await loadBackupData();
              } else {
                Alert.alert('Erreur', result.error || 'Échec de la restauration');
              }
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de restaurer la sauvegarde');
            }
          },
        },
        {
          text: 'Restaurer directement',
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await backup.restoreBackup(backupItem.filePath);
              if (result.success) {
                // ✅ CORRECTION : Utiliser un message générique au lieu de restoredRecords
                Alert.alert('Succès', 'Sauvegarde restaurée avec succès');
                await loadBackupData();
              } else {
                Alert.alert('Erreur', result.error || 'Échec de la restauration');
              }
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de restaurer la sauvegarde');
            }
          },
        },
      ]
    );
  };

  const handleDeleteBackup = async (backupItem: BackupItem) => {
    Alert.alert(
      'Supprimer la sauvegarde',
      `Êtes-vous sûr de vouloir supprimer "${backupItem.fileName}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await LocalBackupService.deleteBackup(backupItem.filePath);
              if (result.success) {
                await loadBackupData();
                Alert.alert('Succès', 'Sauvegarde supprimée');
              } else {
                Alert.alert('Erreur', result.error || 'Impossible de supprimer la sauvegarde');
              }
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de supprimer la sauvegarde');
            }
          },
        },
      ]
    );
  };

  const handleCloudConfigChange = async (key: string, value: any) => {
    try {
      const newConfig = { ...cloudConfig, [key]: value };
      await CloudBackupService.configure(newConfig);
      setCloudConfig(newConfig);
      
      // ✅ CORRECTION : Passer la fréquence à scheduleAutoBackup
      if (key === 'autoBackup' && value) {
        await CloudBackupService.scheduleAutoBackup(newConfig.backupFrequency || 'weekly');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de modifier la configuration cloud');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
    },
    content: {
      padding: 16,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 16,
      color: isDark ? '#FFFFFF' : '#000000',
    },
    card: {
      backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
    },
    backupItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#38383A' : '#E5E5EA',
    },
    backupInfo: {
      flex: 1,
    },
    backupName: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#000000',
      marginBottom: 4,
    },
    backupDetails: {
      fontSize: 14,
      color: isDark ? '#8E8E93' : '#666666',
    },
    backupActions: {
      flexDirection: 'row',
      gap: 12,
    },
    actionButton: {
      padding: 8,
      borderRadius: 6,
    },
    restoreButton: {
      backgroundColor: '#007AFF',
    },
    deleteButton: {
      backgroundColor: '#FF3B30',
    },
    actionButtonText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
    },
    primaryButton: {
      backgroundColor: '#007AFF',
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginBottom: 16,
    },
    primaryButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    configRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#38383A' : '#E5E5EA',
    },
    configLabel: {
      fontSize: 16,
      color: isDark ? '#FFFFFF' : '#000000',
    },
    configValue: {
      fontSize: 14,
      color: isDark ? '#8E8E93' : '#666666',
    },
    emptyState: {
      alignItems: 'center',
      padding: 32,
    },
    emptyStateText: {
      fontSize: 16,
      color: isDark ? '#8E8E93' : '#666666',
      textAlign: 'center',
      marginTop: 8,
    },
  });

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={[styles.emptyStateText, { marginTop: 16 }]}>Chargement des sauvegardes...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Bouton de création de sauvegarde */}
        <TouchableOpacity style={styles.primaryButton} onPress={handleCreateBackup}>
          <Text style={styles.primaryButtonText}>Créer une sauvegarde</Text>
        </TouchableOpacity>

        {/* Configuration Cloud */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sauvegarde Cloud</Text>
          <View style={styles.card}>
            <View style={styles.configRow}>
              <Text style={styles.configLabel}>Sauvegarde automatique</Text>
              <Switch
                value={cloudConfig?.autoBackup || false}
                onValueChange={(value) => handleCloudConfigChange('autoBackup', value)}
              />
            </View>
            
            {cloudConfig?.autoBackup && (
              <>
                <View style={styles.configRow}>
                  <Text style={styles.configLabel}>Fournisseur</Text>
                  <Text style={styles.configValue}>
                    {cloudConfig.provider === 'google_drive' ? 'Google Drive' : 
                     cloudConfig.provider === 'icloud' ? 'iCloud' : 'Dropbox'}
                  </Text>
                </View>
                
                <View style={styles.configRow}>
                  <Text style={styles.configLabel}>Fréquence</Text>
                  <Text style={styles.configValue}>
                    {cloudConfig.backupFrequency === 'daily' ? 'Quotidienne' :
                     cloudConfig.backupFrequency === 'weekly' ? 'Hebdomadaire' : 'Mensuelle'}
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Sauvegardes Locales */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Sauvegardes Locales ({localBackups.length})
          </Text>
          
          {localBackups.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>Aucune sauvegarde locale</Text>
              <Text style={styles.emptyStateText}>
                Créez votre première sauvegarde pour protéger vos données
              </Text>
            </View>
          ) : (
            <View style={styles.card}>
              {localBackups.map((backupItem, index) => (
                <View key={backupItem.filePath} style={styles.backupItem}>
                  <View style={styles.backupInfo}>
                    <Text style={styles.backupName}>{backupItem.fileName}</Text>
                    <Text style={styles.backupDetails}>
                      {backupItem.timestamp} • {formatFileSize(backupItem.size)}
                    </Text>
                  </View>
                  
                  <View style={styles.backupActions}>
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.restoreButton]}
                      onPress={() => handleRestoreBackup(backupItem)}
                    >
                      <Text style={styles.actionButtonText}>Restaurer</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.deleteButton]}
                      onPress={() => handleDeleteBackup(backupItem)}
                    >
                      <Text style={styles.actionButtonText}>Supprimer</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Sauvegardes Cloud */}
        {cloudConfig?.autoBackup && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Sauvegardes Cloud ({cloudBackups.length})
            </Text>
            
            {cloudBackups.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>Aucune sauvegarde cloud</Text>
                <Text style={styles.emptyStateText}>
                  Les sauvegardes automatiques apparaîtront ici
                </Text>
              </View>
            ) : (
              <View style={styles.card}>
                {cloudBackups.map((backupItem, index) => (
                  <View key={backupItem.filePath} style={styles.backupItem}>
                    <View style={styles.backupInfo}>
                      <Text style={styles.backupName}>{backupItem.fileName}</Text>
                      <Text style={styles.backupDetails}>
                        {backupItem.timestamp} • {formatFileSize(backupItem.size)}
                      </Text>
                    </View>
                    
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.restoreButton]}
                      onPress={() => handleRestoreBackup(backupItem)}
                    >
                      <Text style={styles.actionButtonText}>Restaurer</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default BackupRestoreScreen;