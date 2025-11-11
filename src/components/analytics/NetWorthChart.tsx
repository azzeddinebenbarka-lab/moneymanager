// src/components/analytics/NetWorthChart.tsx
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

export interface NetWorthChartProps {
  data: Array<{
    date: string;
    netWorth: number;
    assets: number;
    liabilities: number;
  }>;
  isDark: boolean;
}

export const NetWorthChart: React.FC<NetWorthChartProps> = ({ data, isDark }) => {
  const screenWidth = Dimensions.get('window').width - 40;

  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={[styles.noDataText, isDark && styles.darkText]}>
          Aucune donnée disponible
        </Text>
      </View>
    );
  }

  const chartData = {
    labels: data.map(item => {
      const date = new Date(item.date);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    }),
    datasets: [
      {
        data: data.map(item => item.netWorth),
        color: () => isDark ? '#60A5FA' : '#2563EB',
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
    backgroundGradientFrom: isDark ? '#1E293B' : '#FFFFFF',
    backgroundGradientTo: isDark ? '#334155' : '#F8FAFC',
    decimalPlaces: 0,
    color: (opacity = 1) => isDark ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => isDark ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: isDark ? '#60A5FA' : '#2563EB',
    },
  };

  return (
    <View style={styles.container}>
      <LineChart
        data={chartData}
        width={screenWidth}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  noDataText: {
    textAlign: 'center',
    color: '#64748B',
    fontSize: 14,
    padding: 20,
  },
  darkText: {
    color: '#94A3B8',
  },
});