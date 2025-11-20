// src/design/Components/Cards.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useDesignSystem } from '../../context/ThemeContext';
import { getTextStyle } from '../Typography';
import { shadows } from '../Colors';

export type CardVariant = 'elevated' | 'outlined' | 'filled';

export interface CardProps {
  variant?: CardVariant;
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  variant = 'elevated',
  children,
  onPress,
  style,
  padding = 'md',
}) => {
  const { colors, spacing } = useDesignSystem();

  const getCardStyles = (): ViewStyle[] => {
    const baseStyle: ViewStyle = {
      borderRadius: 12,
      overflow: 'hidden' as const,
    };

    const paddingStyles: Record<NonNullable<CardProps['padding']>, ViewStyle> = {
      none: { padding: 0 },
      sm: { padding: spacing[3] },
      md: { padding: spacing[4] },
      lg: { padding: spacing[6] },
    };

    const variantStyles: Record<CardVariant, ViewStyle> = {
      elevated: {
        backgroundColor: colors.background.card,
        ...shadows.md,
      },
      outlined: {
        backgroundColor: colors.background.card,
        borderWidth: 1,
        borderColor: colors.border.primary,
      },
      filled: {
        backgroundColor: colors.background.secondary,
      },
    };

    return [baseStyle, paddingStyles[padding], variantStyles[variant], style];
  };

  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container 
      style={getCardStyles()} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      {children}
    </Container>
  );
};

// En-tête de carte
interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  style?: ViewStyle;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  action,
  style,
}) => {
  const { spacing } = useDesignSystem();

  return (
    <View style={[styles.header, { marginBottom: spacing[4] }, style]}>
      <View style={styles.headerContent}>
        <Text style={getTextStyle('h4')}>{title}</Text>
        {subtitle && (
          <Text style={[getTextStyle('bodySmall'), styles.subtitle]}>
            {subtitle}
          </Text>
        )}
      </View>
      {action && <View style={styles.headerAction}>{action}</View>}
    </View>
  );
};

// Contenu de carte
interface CardContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const CardContent: React.FC<CardContentProps> = ({ children, style }) => {
  return <View style={style}>{children}</View>;
};

// Pied de carte
interface CardFooterProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, style }) => {
  const { spacing } = useDesignSystem();

  return (
    <View style={[styles.footer, { marginTop: spacing[4] }, style]}>
      {children}
    </View>
  );
};

// Carte avec statistiques
interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  variant?: CardVariant;
  onPress?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon,
  variant = 'elevated',
  onPress,
}) => {
  const { colors, spacing } = useDesignSystem();

  return (
    <Card variant={variant} onPress={onPress} padding="lg">
      <View style={styles.statCard}>
        <View style={styles.statHeader}>
          <View style={styles.statText}>
            <Text style={[getTextStyle('bodySmall'), styles.statTitle]}>
              {title}
            </Text>
            <Text style={[getTextStyle('h3'), styles.statValue]}>
              {value}
            </Text>
            {subtitle && (
              <Text style={[getTextStyle('bodyXSmall'), styles.statSubtitle]}>
                {subtitle}
              </Text>
            )}
          </View>
          {icon && (
            <View style={styles.statIcon}>
              {icon}
            </View>
          )}
        </View>
        
        {trend && (
          <View style={styles.trendContainer}>
            <View
              style={[
                styles.trendBadge,
                {
                  backgroundColor: trend.isPositive 
                    ? `${colors.semantic.success}20` 
                    : `${colors.semantic.error}20`,
                },
              ]}
            >
              <Text
                style={[
                  getTextStyle('caption'),
                  styles.trendText,
                  {
                    color: trend.isPositive 
                      ? colors.semantic.success 
                      : colors.semantic.error,
                  },
                ]}
              >
                {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value).toFixed(1)}%
              </Text>
            </View>
          </View>
        )}
      </View>
    </Card>
  );
};

// Carte de transaction
interface TransactionCardProps {
  title: string;
  amount: string;
  subtitle: string;
  category: string;
  type: 'income' | 'expense';
  date: string;
  onPress?: () => void;
  isRecurring?: boolean;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({
  title,
  amount,
  subtitle,
  category,
  type,
  date,
  onPress,
  isRecurring = false,
}) => {
  const { colors } = useDesignSystem();

  const amountColor = type === 'income' ? colors.functional.income : colors.functional.expense;

  return (
    <Card variant="outlined" onPress={onPress} padding="md">
      <View style={styles.transactionCard}>
        <View style={styles.transactionMain}>
          <View style={styles.transactionInfo}>
            <Text style={getTextStyle('body')} numberOfLines={1}>
              {title}
            </Text>
            <Text style={[getTextStyle('bodySmall'), styles.transactionSubtitle]}>
              {subtitle}
            </Text>
            <View style={styles.transactionMeta}>
              <Text style={[getTextStyle('caption'), styles.transactionCategory]}>
                {category}
              </Text>
              {isRecurring && (
                <View style={styles.recurringBadge}>
                  <Text style={[getTextStyle('caption'), styles.recurringText]}>
                    🔄 Récurrent
                  </Text>
                </View>
              )}
            </View>
          </View>
          
          <View style={styles.transactionAmount}>
            <Text style={[getTextStyle('body'), { color: amountColor }]}>
              {amount}
            </Text>
            <Text style={[getTextStyle('caption'), styles.transactionDate]}>
              {date}
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerContent: {
    flex: 1,
  },
  subtitle: {
    marginTop: 4,
    opacity: 0.7,
  },
  headerAction: {
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  statCard: {
    gap: 8,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  statText: {
    flex: 1,
  },
  statTitle: {
    opacity: 0.7,
    marginBottom: 4,
  },
  statValue: {
    marginBottom: 2,
  },
  statSubtitle: {
    opacity: 0.6,
  },
  statIcon: {
    marginLeft: 8,
  },
  trendContainer: {
    flexDirection: 'row',
  },
  trendBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  trendText: {
    fontWeight: '600',
  },
  transactionCard: {
    width: '100%',
  },
  transactionMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  transactionInfo: {
    flex: 1,
    marginRight: 12,
  },
  transactionSubtitle: {
    opacity: 0.7,
    marginTop: 2,
  },
  transactionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 8,
  },
  transactionCategory: {
    opacity: 0.6,
  },
  recurringBadge: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  recurringText: {
    color: '#8b5cf6',
    fontSize: 10,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  transactionDate: {
    opacity: 0.6,
    marginTop: 2,
  },
});

export default Card;