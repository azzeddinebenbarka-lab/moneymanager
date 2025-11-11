// src/screens/AlertsScreen.tsx - VERSION CORRIGÉE SANS NESTED SCROLLVIEW
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { AlertBanner } from '../components/alerts/AlertBanner';
import { AlertList } from '../components/alerts/AlertList';
import { useTheme } from '../context/ThemeContext';
import { useSmartAlerts } from '../hooks/useSmartAlerts';
import { Alert } from '../types/Alert';

type FilterType = 'all' | 'critical' | 'high' | 'medium' | 'low' | 'unread';

export const AlertsScreen = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigation = useNavigation();
  const {
    alerts,
    scheduledAlerts,
    loading,
    error,
    unreadCount,
    markAsRead,
    markAllAsRead,
    dismissAlert,
    refreshAlerts,
  } = useSmartAlerts();

  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [refreshing, setRefreshing] = useState(false);

  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshAlerts();
    setRefreshing(false);
  }, [refreshAlerts]);

  // Fonctions de filtrage
  const getAlertsByPriority = useCallback((priority: string) => {
    return alerts.filter(alert => alert.priority === priority);
  }, [alerts]);

  const filteredAlerts = React.useMemo(() => {
    switch (activeFilter) {
      case 'all':
        return alerts;
      case 'unread':
        return alerts.filter(alert => !alert.read);
      case 'critical':
        return getAlertsByPriority('critical');
      case 'high':
        return getAlertsByPriority('high');
      case 'medium':
        return getAlertsByPriority('medium');
      case 'low':
        return getAlertsByPriority('low');
      default:
        return alerts;
    }
  }, [alerts, activeFilter, getAlertsByPriority]);

  const getAlertCounts = useCallback(() => {
    return {
      critical: getAlertsByPriority('critical').length,
      high: getAlertsByPriority('high').length,
      medium: getAlertsByPriority('medium').length,
      low: getAlertsByPriority('low').length,
      total: alerts.length
    };
  }, [getAlertsByPriority, alerts]);

  const mostUrgentAlert = React.useMemo(() => {
    const unreadAlerts = alerts.filter(alert => !alert.read);
    if (unreadAlerts.length === 0) return null;
    
    const critical = unreadAlerts.filter(alert => alert.priority === 'critical');
    if (critical.length > 0) return critical[0];
    
    const high = unreadAlerts.filter(alert => alert.priority === 'high');
    if (high.length > 0) return high[0];
    
    const medium = unreadAlerts.filter(alert => alert.priority === 'medium');
    if (medium.length > 0) return medium[0];
    
    return unreadAlerts[0];
  }, [alerts]);

  const handleAlertPress = (alert: Alert) => {
    if (!alert.read) {
      markAsRead(alert.id);
    }

    if (alert.actionUrl) {
      try {
        navigation.navigate(alert.actionUrl as never);
      } catch (error) {
        console.warn('Navigation error:', error);
      }
    }
  };

  const handleAlertDismiss = (alertId: string) => {
    dismissAlert(alertId);
  };

  const handleBannerDismiss = (alertId: string) => {
    markAsRead(alertId);
  };

  const alertCounts = getAlertCounts();

  // Composant de badge de priorité
  const PriorityBadge = ({ priority, count }: { priority: string; count: number }) => {
    const getPriorityColor = () => {
      switch (priority) {
        case 'critical': return '#FF3B30';
        case 'high': return '#FF9500';
        case 'medium': return '#FFCC00';
        case 'low': return '#34C759';
        default: return '#8E8E93';
      }
    };

    const getPriorityLabel = () => {
      switch (priority) {
        case 'critical': return 'Critique';
        case 'high': return 'Élevée';
        case 'medium': return 'Moyenne';
        case 'low': return 'Basse';
        default: return 'Autre';
      }
    };

    return (
      <View style={styles.priorityBadge}>
        <View style={[styles.priorityDot, { backgroundColor: getPriorityColor() }]} />
        <Text style={styles.priorityLabel}>{getPriorityLabel()}</Text>
        <Text style={styles.priorityCount}>{count}</Text>
      </View>
    );
  };

  // Composant de filtre moderne
  const ModernFilterButton = ({ filter, label, count }: { filter: FilterType; label: string; count?: number }) => (
    <TouchableOpacity
      style={[
        styles.modernFilterButton,
        activeFilter === filter && [
          styles.modernFilterButtonActive,
          { 
            backgroundColor: isDark ? '#007AFF' : '#007AFF',
            borderColor: isDark ? '#007AFF' : '#007AFF'
          }
        ]
      ]}
      onPress={() => setActiveFilter(filter)}
    >
      <Text style={[
        styles.modernFilterButtonText,
        activeFilter === filter && styles.modernFilterButtonTextActive,
        isDark && styles.darkText
      ]}>
        {label}
      </Text>
      {count !== undefined && count > 0 && (
        <View style={[
          styles.filterBadge,
          activeFilter === filter && styles.filterBadgeActive
        ]}>
          <Text style={[
            styles.filterBadgeText,
            activeFilter === filter && styles.filterBadgeTextActive
          ]}>
            {count}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  // ✅ CORRECTION : Header séparé pour éviter le nested ScrollView
  const renderHeader = () => (
    <Animated.View 
      style={[
        styles.modernHeader,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <View style={styles.headerTop}>
        <View>
          <Text style={[styles.modernHeaderTitle, isDark && styles.darkText]}>
            Alertes
          </Text>
          <Text style={[styles.modernHeaderSubtitle, isDark && styles.darkSubtext]}>
            {unreadCount > 0 
              ? `${unreadCount} alerte${unreadCount > 1 ? 's' : ''} non lue${unreadCount > 1 ? 's' : ''}`
              : 'Tout est sous contrôle 👌'
            }
          </Text>
        </View>
        
        {unreadCount > 0 && (
          <TouchableOpacity 
            style={[styles.markAllButton, isDark && styles.darkMarkAllButton]}
            onPress={markAllAsRead}
          >
            <Text style={styles.markAllButtonText}>Tout lire</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Statistiques sous forme de badges */}
      <View style={styles.priorityContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.priorityContent}
        >
          <PriorityBadge priority="critical" count={alertCounts.critical} />
          <PriorityBadge priority="high" count={alertCounts.high} />
          <PriorityBadge priority="medium" count={alertCounts.medium} />
          <PriorityBadge priority="low" count={alertCounts.low} />
        </ScrollView>
      </View>
    </Animated.View>
  );

  // ✅ CORRECTION : Filtres séparés
  const renderFilters = () => (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }]
      }}
    >
      <View style={styles.modernFiltersContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.modernFiltersContent}
        >
          <ModernFilterButton filter="all" label="Toutes" count={alerts.length} />
          <ModernFilterButton filter="unread" label="Non lues" count={unreadCount} />
          <ModernFilterButton filter="critical" label="Critique" count={alertCounts.critical} />
          <ModernFilterButton filter="high" label="Élevée" count={alertCounts.high} />
          <ModernFilterButton filter="medium" label="Moyenne" count={alertCounts.medium} />
          <ModernFilterButton filter="low" label="Basse" count={alertCounts.low} />
        </ScrollView>
      </View>
    </Animated.View>
  );

  if (error) {
    return (
      <View style={[styles.container, isDark && styles.darkContainer]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, isDark && styles.darkText]}>
            {error}
          </Text>
          <TouchableOpacity 
            style={[styles.retryButton, isDark && styles.darkRetryButton]}
            onPress={refreshAlerts}
          >
            <Text style={styles.retryButtonText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
      {/* Bannière d'alerte urgente avec animation */}
      {mostUrgentAlert && (
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }}
        >
          <AlertBanner
            alerts={[mostUrgentAlert]}
            onAlertPress={handleAlertPress}
          />
        </Animated.View>
      )}

      {/* ✅ CORRECTION : Structure sans nested ScrollView */}
      {renderHeader()}
      {renderFilters()}

      {/* ✅ CORRECTION : AlertList gère son propre scrolling */}
      <View style={styles.alertsContainer}>
        <AlertList
          alerts={filteredAlerts}
          onAlertPress={handleAlertPress}
          onAlertDismiss={handleAlertDismiss}
          onMarkAllAsRead={markAllAsRead}
          onRefresh={refreshAlerts}
          refreshing={refreshing}
          emptyMessage={
            activeFilter === 'all' 
              ? "🎉 Aucune alerte pour le moment\nVos finances sont en parfaite santé !"
              : `📭 Aucune alerte ${activeFilter} pour le moment.`
          }
          groupByPriority={true}
          showFilters={false} // ✅ Les filtres sont maintenant dans l'en-tête
        />
      </View>
    </View>
  );
};

// AJOUTER L'IMPORT MANQUANT
import { ScrollView } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  darkContainer: {
    backgroundColor: '#000000',
  },
  modernHeader: {
    padding: 24,
    paddingBottom: 16,
    backgroundColor: 'transparent',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  modernHeaderTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#000',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  modernHeaderSubtitle: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  markAllButton: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.2)',
  },
  darkMarkAllButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  markAllButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  priorityContainer: {
    marginBottom: 8,
  },
  priorityContent: {
    paddingRight: 24,
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    marginRight: 12,
    minWidth: 100,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  priorityLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginRight: 6,
  },
  priorityCount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
  },
  modernFiltersContainer: {
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  modernFiltersContent: {
    paddingHorizontal: 16,
  },
  modernFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  modernFilterButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  modernFilterButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
  },
  modernFilterButtonTextActive: {
    color: '#fff',
  },
  filterBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 6,
    minWidth: 20,
    alignItems: 'center',
  },
  filterBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  filterBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000',
  },
  filterBadgeTextActive: {
    color: '#fff',
  },
  alertsContainer: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '500',
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  darkRetryButton: {
    shadowColor: '#007AFF',
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  darkText: {
    color: '#fff',
  },
  darkSubtext: {
    color: '#888',
  },
});

export default AlertsScreen;