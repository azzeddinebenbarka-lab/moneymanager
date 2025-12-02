// src/components/settings/GoogleDriveBackup.tsx
import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useDesignSystem } from '../../context/ThemeContext';
import { useGoogleDrive } from '../../hooks/useGoogleDrive';

export const GoogleDriveBackup = () => {
  const { colors } = useDesignSystem();
  const {
    isAuthenticated,
    isLoading,
    backups,
    signIn,
    signOut,
    uploadBackup,
    loadBackups,
    restoreBackup,
    deleteBackup
  } = useGoogleDrive();

  useEffect(() => {
    if (isAuthenticated) {
      loadBackups();
    }
  }, [isAuthenticated, loadBackups]);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isAuthenticated) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background.card }]}>
        <View style={styles.header}>
          <Ionicons name="logo-google" size={48} color="#4285F4" />
          <Text style={[styles.title, { color: colors.text.primary }]}>
            Google Drive
          </Text>
          <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
            Sauvegardez vos données sur Google Drive pour ne jamais les perdre
          </Text>
        </View>

        <View style={styles.features}>
          <View style={styles.feature}>
            <Ionicons name="cloud-upload" size={24} color={colors.primary[500]} />
            <Text style={[styles.featureText, { color: colors.text.primary }]}>
              Backup automatique
            </Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="shield-checkmark" size={24} color={colors.primary[500]} />
            <Text style={[styles.featureText, { color: colors.text.primary }]}>
              Données sécurisées
            </Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="sync" size={24} color={colors.primary[500]} />
            <Text style={[styles.featureText, { color: colors.text.primary }]}>
              Synchronisation multi-appareils
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.signInButton, { backgroundColor: colors.primary[500] }]}
          onPress={signIn}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="logo-google" size={20} color="#fff" />
              <Text style={styles.signInText}>Se connecter avec Google</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background.card }]}>
      {/* Header avec statut connecté */}
      <View style={styles.connectedHeader}>
        <View style={styles.connectedInfo}>
          <Ionicons name="checkmark-circle" size={24} color="#34C759" />
          <Text style={[styles.connectedText, { color: colors.text.primary }]}>
            Connecté à Google Drive
          </Text>
        </View>
        <TouchableOpacity onPress={signOut} style={styles.signOutButton}>
          <Text style={[styles.signOutText, { color: '#FF3B30' }]}>
            Déconnexion
          </Text>
        </TouchableOpacity>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.primary[500] }]}
          onPress={uploadBackup}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="cloud-upload" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Sauvegarder maintenant</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.background.secondary }]}
          onPress={loadBackups}
          disabled={isLoading}
        >
          <Ionicons name="refresh" size={20} color={colors.primary[500]} />
          <Text style={[styles.actionButtonText, { color: colors.primary[500] }]}>
            Actualiser
          </Text>
        </TouchableOpacity>
      </View>

      {/* Liste des backups */}
      <View style={styles.backupsList}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
          Sauvegardes sur Google Drive ({backups.length})
        </Text>

        {isLoading && backups.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary[500]} />
            <Text style={[styles.loadingText, { color: colors.text.secondary }]}>
              Chargement...
            </Text>
          </View>
        ) : backups.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="cloud-offline" size={48} color={colors.text.secondary} />
            <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
              Aucune sauvegarde sur Google Drive
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.text.tertiary }]}>
              Créez votre première sauvegarde cloud
            </Text>
          </View>
        ) : (
          <FlatList
            data={backups}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={[styles.backupItem, { backgroundColor: colors.background.secondary }]}>
                <View style={styles.backupIcon}>
                  <Ionicons name="cloud-done" size={24} color={colors.primary[500]} />
                </View>
                <View style={styles.backupInfo}>
                  <Text style={[styles.backupName, { color: colors.text.primary }]}>
                    {item.name}
                  </Text>
                  <Text style={[styles.backupMeta, { color: colors.text.secondary }]}>
                    {formatDate(item.modifiedTime)} • {formatFileSize(parseInt(item.size || '0'))}
                  </Text>
                </View>
                <View style={styles.backupActions}>
                  <TouchableOpacity
                    onPress={() => restoreBackup(item.id, item.name)}
                    style={[styles.iconButton, { backgroundColor: colors.primary[100] }]}
                  >
                    <Ionicons name="download" size={18} color={colors.primary[500]} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => deleteBackup(item.id, item.name)}
                    style={[styles.iconButton, { backgroundColor: 'rgba(255, 59, 48, 0.1)' }]}
                  >
                    <Ionicons name="trash" size={18} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  features: {
    marginBottom: 24,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  featureText: {
    fontSize: 15,
    fontWeight: '500',
  },
  signInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  signInText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  connectedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  connectedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  connectedText: {
    fontSize: 15,
    fontWeight: '600',
  },
  signOutButton: {
    padding: 8,
  },
  signOutText: {
    fontSize: 14,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 10,
    gap: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  backupsList: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 13,
    marginTop: 4,
  },
  listContent: {
    gap: 8,
  },
  backupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    gap: 12,
  },
  backupIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(66, 133, 244, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backupInfo: {
    flex: 1,
  },
  backupName: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 4,
  },
  backupMeta: {
    fontSize: 12,
  },
  backupActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
