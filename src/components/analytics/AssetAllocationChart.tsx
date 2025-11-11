// src/components/analytics/AssetAllocationChart.tsx
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

export interface AssetAllocationChartProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
    percentage: number;
  }>;
  isDark: boolean;
}

export const AssetAllocationChart: React.FC<AssetAllocationChartProps> = ({ data, isDark }) => {
  const screenWidth = Dimensions.get('window').width - 80;

  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={[styles.noDataText, isDark && styles.darkText]}>
          Aucune donnée disponible
        </Text>
      </View>
    );
  }

  const chartData = data.map(item => ({
    name: item.name,
    population: item.value,
    color: item.color,
    legendFontColor: isDark ? '#F1F5F9' : '#1E293B',
    legendFontSize: 12,
  }));

  const chartConfig = {
    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
    backgroundGradientFrom: isDark ? '#1E293B' : '#FFFFFF',
    backgroundGradientTo: isDark ? '#334155' : '#F8FAFC',
    color: (opacity = 1) => isDark ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
  };

  return (
    <View style={styles.container}>
      <PieChart
        data={chartData}
        width={screenWidth}
        height={200}
        chartConfig={chartConfig}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
      
      {/* Légende détaillée */}
      <View style={styles.legend}>
        {data.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.colorDot, { backgroundColor: item.color }]} />
            <Text style={[styles.legendText, isDark && styles.darkText]}>
              {item.name}: {item.percentage.toFixed(1)}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  legend: {
    marginTop: 16,
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#1E293B',
    flex: 1,
  },
  darkText: {
    color: '#F1F5F9',
  },
  noDataText: {
    textAlign: 'center',
    color: '#64748B',
    fontSize: 14,
    padding: 20,
  },
});