// src/components/alerts/AlertList.tsx - VERSION COMPLÈTEMENT CORRIGÉE
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  Alert as RNAlert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Alert, AlertPriority, AlertStatus, AlertType } from '../../types/Alert';
import { SmartAlertCard } from './SmartAlertCard';

interface AlertListProps {
  alerts: Alert[];
  onAlertPress?: (alert: Alert) => void;
  onAlertDismiss?: (alertId: string) => void;
  onAlertAction?: (alert: Alert, actionId: string) => void;
  onMarkAllAsRead?: () => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  emptyMessage?: string;
  showFilters?: boolean;
  compact?: boolean;
  groupByPriority?: boolean; // ✅ AJOUTÉ POUR CORRIGER L'ERREUR
}

export const AlertList: React.FC<AlertListProps> = ({
  alerts,
  onAlertPress,
  onAlertDismiss,
  onAlertAction,
  onMarkAllAsRead,
  onRefresh,
  refreshing = false,
  emptyMessage = 'Aucune alerte pour le moment',
  showFilters = true,
  compact = false,
  groupByPriority = false, // ✅ AJOUTÉ AVEC VALEUR PAR DÉFAUT
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<AlertStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<AlertPriority | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<AlertType | 'all'>('all');
  const [readFilter, setReadFilter] = useState<boolean | 'all'>('all');

  // ✅ CORRIGÉ : Filtrer les alertes
  const filteredAlerts = useMemo(() => {
    let filtered = alerts.filter(alert => {
      // Filtre de recherche
      if (searchQuery && 
          !alert.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !alert.message.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !alert.category?.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Filtre de statut
      if (statusFilter !== 'all' && alert.status !== statusFilter) {
        return false;
      }

      // Filtre de priorité
      if (priorityFilter !== 'all' && alert.priority !== priorityFilter) {
        return false;
      }

      // Filtre de type
      if (typeFilter !== 'all' && alert.type !== typeFilter) {
        return false;
      }

      // Filtre de lecture - ✅ CORRECTION : utiliser 'read' au lieu de 'isRead'
      if (readFilter !== 'all' && alert.read !== readFilter) {
        return false;
      }

      return true;
    });

    // ✅ CORRIGÉ : Grouper par priorité si demandé
    if (groupByPriority) {
      const priorityOrder: AlertPriority[] = ['critical', 'high', 'medium', 'low'];
      filtered.sort((a, b) => {
        return priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority);
      });
    }

    return filtered;
  }, [alerts, searchQuery, statusFilter, priorityFilter, typeFilter, readFilter, groupByPriority]);

  // ✅ CORRIGÉ : Obtenir les statistiques des alertes filtrées
  const filteredStats = useMemo(() => {
    const total = filteredAlerts.length;
    const unread = filteredAlerts.filter(alert => !alert.read).length; // ✅ CORRECTION : 'read' au lieu de 'isRead'
    const byPriority = {
      low: filteredAlerts.filter(alert => alert.priority === 'low').length,
      medium: filteredAlerts.filter(alert => alert.priority === 'medium').length,
      high: filteredAlerts.filter(alert => alert.priority === 'high').length,
      critical: filteredAlerts.filter(alert => alert.priority === 'critical').length,
    };

    return { total, unread, byPriority };
  }, [filteredAlerts]);

  // ✅ CORRIGÉ : Gestionnaire de marquer tout comme lu
  const handleMarkAllAsRead = () => {
    if (filteredStats.unread === 0) return;

    RNAlert.alert(
      'Marquer tout comme lu',
      `Voulez-vous marquer ${filteredStats.unread} alerte(s) comme lue(s) ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Marquer comme lu',
          onPress: onMarkAllAsRead
        }
      ]
    );
  };

  // ✅ CORRIGÉ : Réinitialiser tous les filtres
  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setTypeFilter('all');
    setReadFilter('all');
  };

  // ✅ CORRIGÉ : Rendu d'un filtre
  const renderFilterButton = (
    label: string,
    value: any,
    currentValue: any,
    onPress: (value: any) => void,
    count?: number
  ) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        value === currentValue && styles.filterButtonActive,
        isDark && styles.darkFilterButton,
      ]}
      onPress={() => onPress(value)}
    >
      <Text
        style={[
          styles.filterButtonText,
          value === currentValue && styles.filterButtonTextActive,
          isDark && styles.darkText,
        ]}
      >
        {label} {count !== undefined && `(${count})`}
      </Text>
    </TouchableOpacity>
  );

  // ✅ CORRIGÉ : Rendu de l'en-tête avec filtres
  const renderHeader = () => {
    if (!showFilters) return null;

    return (
      <View style={[styles.header, isDark && styles.darkHeader]}>
        {/* Barre de recherche */}
        <View style={[styles.searchContainer, isDark && styles.darkSearchContainer]}>
          <Ionicons name="search" size={20} color={isDark ? '#888' : '#666'} />
          <TextInput
            style={[styles.searchInput, isDark && styles.darkSearchInput]}
            placeholder="Rechercher une alerte..."
            placeholderTextColor={isDark ? '#888' : '#999'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={isDark ? '#888' : '#666'} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Filtres rapides */}
        <View style={styles.quickFilters}>
          {renderFilterButton('Toutes', 'all', readFilter, setReadFilter, filteredStats.total)}
          {renderFilterButton('Non lues', false, readFilter, setReadFilter, filteredStats.unread)}
          {renderFilterButton('Lues', true, readFilter, setReadFilter)}
        </View>

        {/* Filtres par priorité */}
        <Text style={[styles.filterSectionTitle, isDark && styles.darkSubtext]}>
          Priorité
        </Text>
        <View style={styles.filterRow}>
          {renderFilterButton('Toutes', 'all', priorityFilter, setPriorityFilter)}
          {renderFilterButton('Faible', 'low', priorityFilter, setPriorityFilter, filteredStats.byPriority.low)}
          {renderFilterButton('Moyenne', 'medium', priorityFilter, setPriorityFilter, filteredStats.byPriority.medium)}
          {renderFilterButton('Élevée', 'high', priorityFilter, setPriorityFilter, filteredStats.byPriority.high)}
          {renderFilterButton('Critique', 'critical', priorityFilter, setPriorityFilter, filteredStats.byPriority.critical)}
        </View>

        {/* Actions globales */}
        <View style={styles.actionsRow}>
          <TouchableOpacity 
            style={[styles.actionButton, isDark && styles.darkActionButton]}
            onPress={resetFilters}
            disabled={
              searchQuery === '' &&
              statusFilter === 'all' &&
              priorityFilter === 'all' &&
              typeFilter === 'all' &&
              readFilter === 'all'
            }
          >
            <Ionicons name="refresh" size={16} color={isDark ? '#888' : '#666'} />
            <Text style={[styles.actionText, isDark && styles.darkSubtext]}>
              Réinitialiser
            </Text>
          </TouchableOpacity>

          {filteredStats.unread > 0 && onMarkAllAsRead && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.markReadButton]}
              onPress={handleMarkAllAsRead}
            >
              <Ionicons name="checkmark-done" size={16} color="#007AFF" />
              <Text style={styles.markReadText}>
                Tout marquer comme lu ({filteredStats.unread})
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  // ✅ CORRIGÉ : Rendu d'une alerte
  const renderAlertItem = ({ item }: { item: Alert }) => (
    <SmartAlertCard
      alert={item}
      onPress={onAlertPress}
      onDismiss={onAlertDismiss}
      onAction={onAlertAction}
      compact={compact}
    />
  );

  // ✅ CORRIGÉ : Rendu de l'état vide
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons 
        name="notifications-off-outline" 
        size={64} 
        color={isDark ? '#555' : '#ccc'} 
      />
      <Text style={[styles.emptyText, isDark && styles.darkSubtext]}>
        {emptyMessage}
      </Text>
      {alerts.length > 0 && filteredAlerts.length === 0 && (
        <TouchableOpacity 
          style={[styles.resetFiltersButton, isDark && styles.darkResetFiltersButton]}
          onPress={resetFilters}
        >
          <Text style={styles.resetFiltersText}>Réinitialiser les filtres</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
      {renderHeader()}
      
      <FlatList
        data={filteredAlerts}
        renderItem={renderAlertItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#007AFF']}
              tintColor={isDark ? '#fff' : '#007AFF'}
            />
          ) : undefined
        }
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={[
          styles.listContent,
          filteredAlerts.length === 0 && styles.emptyListContent
        ]}
      />
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
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  darkHeader: {
    backgroundColor: '#2c2c2e',
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  darkSearchContainer: {
    backgroundColor: '#38383a',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#000',
  },
  darkSearchInput: {
    color: '#fff',
  },
  quickFilters: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  filterSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  darkFilterButton: {
    backgroundColor: '#38383a',
    borderColor: '#444',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  darkActionButton: {
    backgroundColor: '#38383a',
    borderColor: '#444',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
    marginLeft: 4,
  },
  markReadButton: {
    backgroundColor: 'rgba(0,122,255,0.1)',
    borderColor: 'rgba(0,122,255,0.3)',
  },
  markReadText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#007AFF',
    marginLeft: 4,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 22,
  },
  resetFiltersButton: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#007AFF',
  },
  darkResetFiltersButton: {
    backgroundColor: '#007AFF',
  },
  resetFiltersText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  darkText: {
    color: '#fff',
  },
  darkSubtext: {
    color: '#888',
  },
});

export default AlertList;