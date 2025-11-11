// src/components/analytics/AnalyticsCard.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface AnalyticsCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onPress?: () => void;
  icon?: string;
  color?: string;
}

export const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  onPress,
  icon,
  color = '#007AFF'
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const CardContent = () => (
    <View style={styles.cardContent}>
      <View style={styles.cardHeader}>
        <Text style={[styles.title, isDark && styles.darkText]}>{title}</Text>
        {icon && (
          <Ionicons 
            name={icon as any} 
            size={20} 
            color={color}
          />
        )}
      </View>
      
      <Text style={[styles.value, isDark && styles.darkText]}>{value}</Text>
      
      {(subtitle || trend) && (
        <View style={styles.footer}>
          {subtitle && (
            <Text style={[styles.subtitle, isDark && styles.darkSubtext]}>
              {subtitle}
            </Text>
          )}
          {trend && (
            <View style={styles.trend}>
              <Ionicons 
                name={trend.isPositive ? "trending-up" : "trending-down"} 
                size={14} 
                color={trend.isPositive ? '#10B981' : '#EF4444'} 
              />
              <Text style={[
                styles.trendText,
                { color: trend.isPositive ? '#10B981' : '#EF4444' }
              ]}>
                {Math.abs(trend.value)}%
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity 
        style={[styles.card, isDark && styles.darkCard]}
        onPress={onPress}
      >
        <CardContent />
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.card, isDark && styles.darkCard]}>
      <CardContent />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    minWidth: '48%',
    flex: 1,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  darkCard: {
    backgroundColor: '#1E293B',
  },
  cardContent: {
    gap: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    flex: 1,
    marginRight: 8,
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: '#94A3B8',
    flex: 1,
  },
  trend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '500',
  },
  darkText: {
    color: '#F1F5F9',
  },
  darkSubtext: {
    color: '#94A3B8',
  },
});

export default AnalyticsCard;