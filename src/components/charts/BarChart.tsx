import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { BarChart as RNBarChart } from 'react-native-chart-kit';
import { useTheme } from '../../context/ThemeContext';
import { ChartData } from '../../types/Report';

interface BarChartProps {
  data: ChartData;
  title?: string;
  height?: number;
}

const BarChart: React.FC<BarChartProps> = ({ 
  data, 
  title, 
  height = 220 
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (!data || data.datasets.length === 0 || data.datasets[0].data.length === 0) {
    return (
      <View style={[styles.container, isDark && styles.darkContainer]}>
        {title && <Text style={[styles.title, isDark && styles.darkText]}>{title}</Text>}
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, isDark && styles.darkSubtext]}>
            Aucune donnée disponible
          </Text>
        </View>
      </View>
    );
  }

  const chartConfig = {
    backgroundGradientFrom: isDark ? '#2c2c2e' : '#fff',
    backgroundGradientTo: isDark ? '#2c2c2e' : '#fff',
    color: (opacity = 1) => isDark ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
  };

  // Correction : adapter les données au format attendu par react-native-chart-kit
  const chartData = {
    labels: data.labels,
    datasets: [{
      data: data.datasets[0].data,
      colors: data.datasets[0].colors?.map(color => () => color) || [],
    }],
  };

  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
      {title && <Text style={[styles.title, isDark && styles.darkText]}>{title}</Text>}
      
      <RNBarChart
        data={chartData}
        width={Dimensions.get('window').width - 40}
        height={height}
        yAxisLabel="€"
        yAxisSuffix=""
        chartConfig={chartConfig}
        style={styles.chart}
        showValuesOnTopOfBars
        withCustomBarColorFromData
        flatColor
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  darkContainer: {
    backgroundColor: '#2c2c2e',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
    textAlign: 'center',
  },
  darkText: {
    color: '#fff',
  },
  darkSubtext: {
    color: '#888',
  },
  chart: {
    borderRadius: 8,
  },
  emptyState: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default BarChart;