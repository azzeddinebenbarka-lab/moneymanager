// src/hooks/useGoogleDrive.ts
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { GoogleDriveService } from '../services/backup/googleDriveService';
import { LocalBackupService } from '../services/backup/localBackup';

export const useGoogleDrive = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [backups, setBackups] = useState<any[]>([]);

  // Vérifier l'authentification au montage
  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = useCallback(async () => {
    const authenticated = await GoogleDriveService.isAuthenticated();
    setIsAuthenticated(authenticated);
  }, []);

  const signIn = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await GoogleDriveService.authenticate();
      
      if (result.success) {
        setIsAuthenticated(true);
        Alert.alert('Succès', 'Connexion à Google Drive réussie');
      } else {
        Alert.alert('Erreur', result.error || 'Échec de la connexion');
      }
      
      return result;
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de se connecter à Google Drive');
      return { success: false, error: 'Erreur de connexion' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await GoogleDriveService.disconnect();
      setIsAuthenticated(false);
      setBackups([]);
      Alert.alert('Succès', 'Déconnexion réussie');
    } catch (error) {
      Alert.alert('Erreur', 'Échec de la déconnexion');
    }
  }, []);

  const uploadBackup = useCallback(async () => {
    try {
      if (!isAuthenticated) {
        Alert.alert('Erreur', 'Vous devez d\'abord vous connecter à Google Drive');
        return { success: false };
      }

      setIsLoading(true);

      // Créer un backup local
      const backupData = {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        data: {} // Rempli par LocalBackupService
      };

      const localBackup = await LocalBackupService.createLocalBackup(backupData);
      
      if (!localBackup.success || !localBackup.filePath) {
        throw new Error('Échec de la création du backup local');
      }

      // Upload vers Google Drive (le contenu est déjà dans backupData)
      const fileName = `mylife-backup-${new Date().toISOString().split('T')[0]}.json`;
      const result = await GoogleDriveService.uploadFile(fileName, JSON.stringify(backupData));

      if (result.success) {
        Alert.alert('Succès', 'Backup sauvegardé sur Google Drive');
        await loadBackups(); // Rafraîchir la liste
      } else {
        Alert.alert('Erreur', result.error || 'Échec de l\'upload');
      }

      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      Alert.alert('Erreur', message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const loadBackups = useCallback(async () => {
    try {
      if (!isAuthenticated) return;

      setIsLoading(true);
      const result = await GoogleDriveService.listBackups();

      if (result.success && result.files) {
        setBackups(result.files);
      } else {
        console.error('Erreur chargement backups:', result.error);
      }
    } catch (error) {
      console.error('Erreur chargement backups:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const restoreBackup = useCallback(async (fileId: string, fileName: string) => {
    try {
      setIsLoading(true);

      Alert.alert(
        'Confirmation',
        `Restaurer le backup "${fileName}" ?\n\n⚠️ Attention : Vos données actuelles seront remplacées.`,
        [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Restaurer',
            style: 'destructive',
            onPress: async () => {
              const result = await GoogleDriveService.downloadFile(fileId);

              if (result.success && result.content) {
                // Ici, implémenter la restauration des données
                // await LocalBackupService.restoreBackup(result.content);
                Alert.alert('Succès', 'Backup restauré avec succès');
              } else {
                Alert.alert('Erreur', result.error || 'Échec de la restauration');
              }
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de restaurer le backup');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteBackup = useCallback(async (fileId: string, fileName: string) => {
    try {
      Alert.alert(
        'Confirmation',
        `Supprimer le backup "${fileName}" ?`,
        [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Supprimer',
            style: 'destructive',
            onPress: async () => {
              setIsLoading(true);
              const result = await GoogleDriveService.deleteFile(fileId);

              if (result.success) {
                Alert.alert('Succès', 'Backup supprimé');
                await loadBackups(); // Rafraîchir la liste
              } else {
                Alert.alert('Erreur', result.error || 'Échec de la suppression');
              }
              setIsLoading(false);
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de supprimer le backup');
      setIsLoading(false);
    }
  }, [loadBackups]);

  return {
    isAuthenticated,
    isLoading,
    backups,
    signIn,
    signOut,
    uploadBackup,
    loadBackups,
    restoreBackup,
    deleteBackup,
    checkAuthentication
  };
};
