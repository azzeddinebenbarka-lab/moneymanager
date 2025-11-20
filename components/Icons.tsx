// src/design/Components/Icons.tsx
import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useDesignSystem } from '../../context/ThemeContext';

export type IconVariant = 'filled' | 'outlined' | 'dual';
export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface IconProps {
  variant?: IconVariant;
  size?: IconSize;
  color?: string;
  style?: ViewStyle;
}

export interface IconWrapperProps extends IconProps {
  children: React.ReactNode;
}

export const IconWrapper: React.FC<IconWrapperProps> = ({
  variant = 'filled',
  size = 'md',
  color,
  style,
  children,
}) => {
  const { colors } = useDesignSystem();

  const iconColor = color || colors.primary[500];

  const sizeStyles: Record<IconSize, ViewStyle> = {
    xs: { width: 12, height: 12 },
    sm: { width: 16, height: 16 },
    md: { width: 20, height: 20 },
    lg: { width: 24, height: 24 },
    xl: { width: 32, height: 32 },
  };

  return (
    <View style={[styles.iconBase, sizeStyles[size], style]}>
      {React.isValidElement(children)
        ? React.cloneElement(children as React.ReactElement<any>, {
            color: iconColor,
            size: sizeStyles[size].width,
          })
        : children}
    </View>
  );
};

// Icônes financières communes
export const MoneyIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}>💰</IconWrapper>
);

export const IncomeIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}>📥</IconWrapper>
);

export const ExpenseIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}>📤</IconWrapper>
);

export const SavingsIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}>🎯</IconWrapper>
);

export const DebtIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}>🏦</IconWrapper>
);

export const InvestmentIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}>📈</IconWrapper>
);

export const BudgetIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}>📊</IconWrapper>
);

export const AnalyticsIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}>🔍</IconWrapper>
);

export const CalendarIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}>📅</IconWrapper>
);

export const AlertIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}>⚠️</IconWrapper>
);

export const SuccessIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}>✅</IconWrapper>
);

export const ErrorIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}>❌</IconWrapper>
);

// Indicateur de statut
export type StatusVariant = 'success' | 'warning' | 'error' | 'info';

interface StatusIndicatorProps {
  variant: StatusVariant;
  size?: IconSize;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  variant,
  size = 'sm',
}) => {
  const { colors } = useDesignSystem();

  const variantStyles: Record<StatusVariant, ViewStyle> = {
    success: { backgroundColor: colors.semantic.success },
    warning: { backgroundColor: colors.semantic.warning },
    error: { backgroundColor: colors.semantic.error },
    info: { backgroundColor: colors.semantic.info },
  };

  const sizeStyles: Record<IconSize, ViewStyle> = {
    xs: { width: 6, height: 6 },
    sm: { width: 8, height: 8 },
    md: { width: 10, height: 10 },
    lg: { width: 12, height: 12 },
    xl: { width: 16, height: 16 },
  };

  return (
    <View
      style={[
        styles.statusIndicator,
        variantStyles[variant],
        sizeStyles[size],
      ]}
    />
  );
};

// Badge avec icône
interface IconBadgeProps {
  icon: React.ReactNode;
  count?: number;
  variant?: StatusVariant;
  maxCount?: number;
}

export const IconBadge: React.FC<IconBadgeProps> = ({
  icon,
  count,
  variant = 'info',
  maxCount = 99,
}) => {
  const { colors } = useDesignSystem();

  const showBadge = count !== undefined && count > 0;
  const displayCount = count && count > maxCount ? `${maxCount}+` : count?.toString();

  return (
    <View style={styles.iconBadgeContainer}>
      {icon}
      {showBadge && (
        <View
          style={[
            styles.badge,
            {
              backgroundColor: colors.semantic[variant],
            },
          ]}
        >
          <Text style={styles.badgeText}>{displayCount}</Text>
        </View>
      )}
    </View>
  );
};

// Avatar avec icône
interface IconAvatarProps {
  icon: React.ReactNode;
  size?: IconSize;
  variant?: 'filled' | 'outlined';
  color?: string;
}

export const IconAvatar: React.FC<IconAvatarProps> = ({
  icon,
  size = 'md',
  variant = 'filled',
  color,
}) => {
  const { colors } = useDesignSystem();

  const sizeStyles: Record<IconSize, ViewStyle> = {
    xs: { width: 24, height: 24 },
    sm: { width: 32, height: 32 },
    md: { width: 40, height: 40 },
    lg: { width: 48, height: 48 },
    xl: { width: 56, height: 56 },
  };

  const variantStyles: Record<'filled' | 'outlined', ViewStyle> = {
    filled: {
      backgroundColor: color || colors.primary[500],
    },
    outlined: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: color || colors.primary[500],
    },
  };

  return (
    <View style={[styles.avatar, sizeStyles[size], variantStyles[variant]]}>
      <IconWrapper size={size} color={variant === 'filled' ? colors.text.inverse : color}>
        {icon}
      </IconWrapper>
    </View>
  );
};

const styles = StyleSheet.create({
  iconBase: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusIndicator: {
    borderRadius: 9999,
  },
  iconBadgeContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
  },
  avatar: {
    borderRadius: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default IconWrapper;