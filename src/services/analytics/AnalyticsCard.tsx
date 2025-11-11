// src/components/analytics/AnalyticsCard.tsx - VERSION AVEC PLUS D'OPTIONS
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useCurrency } from '../../context/CurrencyContext';
import { useTheme } from '../../context/ThemeContext';

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  onPress?: () => void;
  icon?: string;
  color?: string;
  size?: 'small' | 'medium' | 'large';
  type?: 'default' | 'highlight' | 'muted';
}

export const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  onPress,
  icon,
  color,
  size = 'medium',
  type = 'default'
}) => {
  const { theme } = useTheme();
  const { formatAmount } = useCurrency();
  const isDark = theme === 'dark';

  // Déterminer la couleur en fonction du type et de la tendance
  const getCardColor = () => {
    if (color) return color;
    if (type === 'highlight') return '#007AFF';
    if (type === 'muted') return isDark ? '#38383a' : '#f8f9fa';
    return isDark ? '#1C1C1E' : '#FFFFFF';
  };

  const getTextColor = () => {
    if (type === 'highlight') return '#FFFFFF';
    return isDark ? '#FFFFFF' : '#000000';
  };

  const getSubtextColor = () => {
    if (type === 'highlight') return 'rgba(255,255,255,0.8)';
    return isDark ? '#8E8E93' : '#666666';
  };

  const getTrendColor = () => {
    if (trend) {
      return trend.isPositive ? '#34C759' : '#FF3B30';
    }
    return getSubtextColor();
  };

  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      return formatAmount(val);
    }
    return val;
  };

  const styles = StyleSheet.create({
    card: {
      backgroundColor: getCardColor(),
      borderRadius: 12,
      padding: size === 'small' ? 12 : size === 'large' ? 20 : 16,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.1 : 0.05,
      shadowRadius: 8,
      elevation: type === 'highlight' ? 4 : 2,
      borderWidth: type === 'muted' ? 1 : 0,
      borderColor: isDark ? '#38383a' : '#e0e0e0',
    },
    cardPressable: {
      backgroundColor: getCardColor(),
      borderRadius: 12,
      padding: size === 'small' ? 12 : size === 'large' ? 20 : 16,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.1 : 0.05,
      shadowRadius: 8,
      elevation: type === 'highlight' ? 4 : 2,
      borderWidth: type === 'muted' ? 1 : 0,
      borderColor: isDark ? '#38383a' : '#e0e0e0',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    title: {
      fontSize: size === 'small' ? 12 : 14,
      color: getSubtextColor(),
      fontWeight: '500',
      flex: 1,
    },
    value: {
      fontSize: size === 'small' ? 16 : size === 'large' ? 24 : 20,
      fontWeight: 'bold',
      color: getTextColor(),
      marginBottom: 4,
    },
    subtitle: {
      fontSize: size === 'small' ? 10 : 12,
      color: getSubtextColor(),
      marginBottom: trend ? 4 : 0,
    },
    trend: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 4,
    },
    trendText: {
      fontSize: size === 'small' ? 10 : 12,
      fontWeight: '500',
      marginLeft: 4,
      color: getTrendColor(),
    },
    iconContainer: {
      width: size === 'small' ? 24 : 32,
      height: size === 'small' ? 24 : 32,
      borderRadius: size === 'small' ? 12 : 16,
      backgroundColor: type === 'highlight' ? 'rgba(255,255,255,0.2)' : 'rgba(0,122,255,0.1)',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 8,
    },
  });

  const CardContent = () => (
    <>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          {icon && (
            <View style={styles.iconContainer}>
              <Text style={{ fontSize: size === 'small' ? 12 : 16 }}>{icon}</Text>
            </View>
          )}
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
        </View>
        {trend && (
          <Text style={[styles.trendText, { marginLeft: 0 }]}>
            {trend.isPositive ? '↗' : '↘'}
          </Text>
        )}
      </View>
      
      <Text style={styles.value}>{formatValue(value)}</Text>
      
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      
      {trend && (
        <View style={styles.trend}>
          <Text style={styles.trendText}>
            {trend.label || `${trend.isPositive ? '+' : ''}${Math.abs(trend.value).toFixed(1)}%`}
          </Text>
        </View>
      )}
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity 
        style={styles.cardPressable} 
        onPress={onPress}
        activeOpacity={0.7}
      >
        <CardContent />
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.card}>
      <CardContent />
    </View>
  );
};

export default AnalyticsCard;