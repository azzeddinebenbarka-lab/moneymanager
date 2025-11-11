// components/budget/BudgetAlert.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Alert } from '../../types';

interface BudgetAlertProps {
  alert: Alert;
  onPress: (alert: Alert) => void;
  onDismiss: (alertId: string) => void;
}

const BudgetAlert: React.FC<BudgetAlertProps> = ({ alert, onPress, onDismiss }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return '#FF3B30';
      case 'high': return '#FF9500';
      case 'medium': return '#FFCC00';
      case 'low': return '#34C759';
      default: return '#007AFF';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'budget_exceeded': return 'alert-circle';
      case 'budget_warning': return 'warning';
      case 'low_balance': return 'trending-down';
      case 'negative_balance': return 'card';
      default: return 'notifications';
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.alertCard,
        isDark && styles.darkAlertCard,
        !alert.isRead && styles.unreadAlert,
        { borderLeftColor: getPriorityColor(alert.priority) }
      ]}
      onPress={() => onPress(alert)}
    >
      <View style={styles.alertHeader}>
        <View style={styles.alertTitleContainer}>
          <Ionicons 
            name={getAlertIcon(alert.type) as any} 
            size={20} 
            color={getPriorityColor(alert.priority)} 
          />
          <Text style={[styles.alertTitle, isDark && styles.darkText]}>
            {alert.title}
          </Text>
        </View>
        
        <TouchableOpacity
          style={styles.dismissButton}
          onPress={() => onDismiss(alert.id)}
        >
          <Ionicons name="close" size={16} color={isDark ? '#888' : '#666'} />
        </TouchableOpacity>
      </View>

      <Text style={[styles.alertMessage, isDark && styles.darkSubtext]}>
        {alert.message}
      </Text>

      <View style={styles.alertFooter}>
        <View style={[
          styles.priorityBadge,
          { backgroundColor: getPriorityColor(alert.priority) + '20' }
        ]}>
          <Text style={[styles.priorityText, { color: getPriorityColor(alert.priority) }]}>
            {alert.priority === 'critical' ? 'Critique' :
             alert.priority === 'high' ? 'Élevée' :
             alert.priority === 'medium' ? 'Moyenne' : 'Basse'}
          </Text>
        </View>
        
        <Text style={[styles.alertDate, isDark && styles.darkSubtext]}>
          {new Date(alert.createdAt).toLocaleDateString('fr-FR')}
        </Text>
      </View>

      {!alert.isRead && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  alertCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
    position: 'relative',
  },
  darkAlertCard: {
    backgroundColor: '#2c2c2e',
  },
  unreadAlert: {
    borderLeftWidth: 6,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  alertTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    flex: 1,
  },
  dismissButton: {
    padding: 4,
  },
  alertMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  alertFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '500',
  },
  alertDate: {
    fontSize: 12,
    color: '#999',
  },
  unreadDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007AFF',
  },
  darkText: {
    color: '#fff',
  },
  darkSubtext: {
    color: '#888',
  },
});

export default BudgetAlert;