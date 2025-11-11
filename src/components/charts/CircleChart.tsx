// src/components/charts/CircleChart.tsx - VERSION COMPLÈTEMENT CORRIGÉE
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { useCurrency } from '../../context/CurrencyContext';

interface CircleChartProps {
  income: number;
  expenses: number;
  balance: number;
  isDark: boolean;
  size?: number;
  strokeWidth?: number;
  showLegend?: boolean;
  showBalance?: boolean;
  animationDuration?: number;
}

export const CircleChart: React.FC<CircleChartProps> = ({
  income,
  expenses,
  balance,
  isDark,
  size = 140,
  strokeWidth = 16,
  showLegend = true,
  showBalance = true,
  animationDuration = 1000
}) => {
  const { formatAmount } = useCurrency();
  
  const incomeAnim = useRef(new Animated.Value(0)).current;
  const expensesAnim = useRef(new Animated.Value(0)).current;
  const balanceAnim = useRef(new Animated.Value(0)).current;

  const total = Math.max(income + Math.abs(expenses), 1);
  const incomePercentage = (income / total) * 100;
  const expensesPercentage = (Math.abs(expenses) / total) * 100;
  
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  const incomeStrokeDasharray = `${(incomePercentage / 100) * circumference} ${circumference}`;
  const expensesStrokeDasharray = `${(expensesPercentage / 100) * circumference} ${circumference}`;
  
  // Position de départ pour les dépenses (après les revenus)
  const expensesRotation = -90 + (incomePercentage * 360 / 100);

  useEffect(() => {
    // Animation séquentielle
    Animated.sequence([
      Animated.timing(incomeAnim, {
        toValue: 1,
        duration: animationDuration * 0.4,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(expensesAnim, {
        toValue: 1,
        duration: animationDuration * 0.4,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(balanceAnim, {
        toValue: 1,
        duration: animationDuration * 0.2,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      })
    ]).start();
  }, [income, expenses, balance]);

  const animatedIncomeDasharray = incomeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [`0 ${circumference}`, incomeStrokeDasharray],
  });

  const animatedExpensesDasharray = expensesAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [`0 ${circumference}`, expensesStrokeDasharray],
  });

  const animatedBalanceOpacity = balanceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View style={styles.container}>
      <View style={[styles.chartWrapper, { width: size, height: size }]}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Cercle de fond */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={isDark ? '#374151' : '#f1f5f9'}
            strokeWidth={strokeWidth}
            fill="none"
            opacity={0.5}
          />
          
          {/* Revenus - Section animée */}
          <G rotation={-90} origin={`${size / 2}, ${size / 2}`}>
            <AnimatedCircle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#10B981"
              strokeWidth={strokeWidth}
              strokeDasharray={animatedIncomeDasharray}
              strokeLinecap="round"
              fill="none"
              opacity={incomeAnim}
            />
          </G>
          
          {/* Dépenses - Section animée */}
          <G rotation={expensesRotation} origin={`${size / 2}, ${size / 2}`}>
            <AnimatedCircle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#EF4444"
              strokeWidth={strokeWidth}
              strokeDasharray={animatedExpensesDasharray}
              strokeLinecap="round"
              fill="none"
              opacity={expensesAnim}
            />
          </G>
        </Svg>
        
        {/* Texte au centre avec animation */}
        {showBalance && (
          <Animated.View 
            style={[
              styles.textContainer, 
              { 
                opacity: animatedBalanceOpacity,
                top: size / 2 - 25 
              }
            ]}
          >
            <Text style={[
              styles.balanceText,
              { 
                color: balance >= 0 ? '#10B981' : '#EF4444',
                fontSize: size * 0.14
              }
            ]}>
              {formatAmount(balance)}
            </Text>
            <Text style={[
              styles.labelText,
              { 
                color: isDark ? '#9ca3af' : '#6b7280',
                fontSize: size * 0.08
              }
            ]}>
              Solde
            </Text>
          </Animated.View>
        )}
      </View>
      
      {/* Légende améliorée */}
      {showLegend && (
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#10B981' }]} />
            <View style={styles.legendTextContainer}>
              <Text style={[
                styles.legendLabel,
                { color: isDark ? '#f3f4f6' : '#1f2937' }
              ]}>
                Revenus
              </Text>
              <Text style={[
                styles.legendAmount,
                { color: isDark ? '#d1d5db' : '#4b5563' }
              ]}>
                {formatAmount(income)}
              </Text>
            </View>
          </View>
          
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#EF4444' }]} />
            <View style={styles.legendTextContainer}>
              <Text style={[
                styles.legendLabel,
                { color: isDark ? '#f3f4f6' : '#1f2937' }
              ]}>
                Dépenses
              </Text>
              <Text style={[
                styles.legendAmount,
                { color: isDark ? '#d1d5db' : '#4b5563' }
              ]}>
                {formatAmount(expenses)}
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

// Composant Circle animé
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 8,
  },
  chartWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceText: {
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  labelText: {
    fontWeight: '500',
    textAlign: 'center',
  },
  legend: {
    marginTop: 20,
    width: '100%',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  legendTextContainer: {
    flex: 1,
  },
  legendLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  legendAmount: {
    fontSize: 13,
    fontWeight: '500',
  },
});

export default CircleChart;