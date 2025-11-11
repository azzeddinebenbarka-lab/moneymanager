// src/components/alerts/AlertBanner.tsx - VERSION CORRIGÉE
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Alert, AlertPriority } from '../../types/Alert';

const { width } = Dimensions.get('window');

interface AlertBannerProps {
  alerts: Alert[]; // ✅ CORRIGÉ : 'alerts' au lieu de 'alert'
  onAlertPress?: (alert: Alert) => void;
  maxAlerts?: number;
  autoDismiss?: boolean;
  dismissTime?: number;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  alerts,
  onAlertPress,
  maxAlerts = 3,
  autoDismiss = true,
  dismissTime = 5000,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [visibleAlerts, setVisibleAlerts] = useState<Alert[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(width))[0];

  const criticalAlerts = alerts
    .filter(alert => 
      (alert.priority === 'critical' || alert.priority === 'high') && 
      !alert.read // ✅ CORRIGÉ
    )
    .slice(0, maxAlerts);

  useEffect(() => {
    if (criticalAlerts.length > 0 && JSON.stringify(criticalAlerts) !== JSON.stringify(visibleAlerts)) {
      setVisibleAlerts(criticalAlerts);
      setCurrentIndex(0);
      showBanner();
    } else if (criticalAlerts.length === 0 && visibleAlerts.length > 0) {
      hideBanner();
    }
  }, [criticalAlerts]);

  const showBanner = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    if (autoDismiss && visibleAlerts.length > 0) {
      setTimeout(() => {
        handleNext();
      }, dismissTime);
    }
  };

  const hideBanner = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setVisibleAlerts([]);
      setCurrentIndex(0);
    });
  };

  const handleNext = () => {
    if (currentIndex < visibleAlerts.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      hideBanner();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const getPriorityColor = (priority: AlertPriority): string => {
    const colors: Record<AlertPriority, string> = {
      low: '#10B981',
      medium: '#F59E0B',
      high: '#EF4444',
      critical: '#DC2626'
    };
    return colors[priority];
  };

  const getPriorityIcon = (priority: AlertPriority): string => {
    const icons: Record<AlertPriority, string> = {
      low: 'information-circle',
      medium: 'warning',
      high: 'alert-circle',
      critical: 'flash'
    };
    return icons[priority];
  };

  if (visibleAlerts.length === 0 || currentIndex >= visibleAlerts.length) {
    return null;
  }

  const currentAlert = visibleAlerts[currentIndex];
  const priorityColor = getPriorityColor(currentAlert.priority);
  const priorityIcon = getPriorityIcon(currentAlert.priority);

  return (
    <Animated.View
      style={[
        styles.container,
        isDark && styles.darkContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateX: slideAnim }],
          borderLeftColor: priorityColor,
        },
      ]}
    >
      {visibleAlerts.length > 1 && (
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {currentIndex + 1}/{visibleAlerts.length}
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.content}
        onPress={() => onAlertPress?.(currentAlert)}
        activeOpacity={0.7}
      >
        <View style={styles.alertHeader}>
          <View style={[styles.iconContainer, { backgroundColor: priorityColor + '20' }]}>
            <Ionicons name={priorityIcon as any} size={20} color={priorityColor} />
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.title, isDark && styles.darkText]} numberOfLines={1}>
              {currentAlert.title}
            </Text>
            <Text style={[styles.message, isDark && styles.darkSubtext]} numberOfLines={2}>
              {currentAlert.message}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.controls}>
        {visibleAlerts.length > 1 && (
          <>
            <TouchableOpacity
              style={[styles.controlButton, currentIndex === 0 && styles.controlButtonDisabled]}
              onPress={handlePrevious}
              disabled={currentIndex === 0}
            >
              <Ionicons
                name="chevron-back"
                size={16}
                color={currentIndex === 0 ? (isDark ? '#555' : '#ccc') : (isDark ? '#fff' : '#000')}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.controlButton}
              onPress={handleNext}
            >
              <Ionicons
                name="chevron-forward"
                size={16}
                color={isDark ? '#fff' : '#000'}
              />
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity
          style={styles.closeButton}
          onPress={hideBanner}
        >
          <Ionicons
            name="close"
            size={16}
            color={isDark ? '#fff' : '#000'}
          />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderLeftWidth: 4,
    zIndex: 1000,
    flexDirection: 'row',
    alignItems: 'center',
  },
  darkContainer: {
    backgroundColor: '#2c2c2e',
  },
  progressContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  progressText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#666',
  },
  content: {
    flex: 1,
    marginRight: 8,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  message: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButton: {
    padding: 4,
    marginLeft: 4,
  },
  controlButtonDisabled: {
    opacity: 0.3,
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
  },
  darkText: {
    color: '#fff',
  },
  darkSubtext: {
    color: '#888',
  },
});

export default AlertBanner;