import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { PieChart as RNPieChart } from 'react-native-chart-kit';
import { useTheme } from '../../context/ThemeContext';
import { PieChartData } from '../../types/Report';

interface PieChartProps {
  data: PieChartData[];
  title?: string;
  height?: number;
}

const PieChart: React.FC<PieChartProps> = ({ 
  data, 
  title, 
  height = 220 
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (!data || data.length === 0) {
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

  const chartData = data.map((item, index) => ({
    name: item.name,
    population: item.amount,
    color: item.color,
    legendFontColor: isDark ? '#fff' : '#000',
    legendFontSize: 12,
  }));

  const chartConfig = {
    color: (opacity = 1) => isDark ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
    backgroundGradientFrom: isDark ? '#2c2c2e' : '#fff',
    backgroundGradientTo: isDark ? '#2c2c2e' : '#fff',
  };

  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
      {title && <Text style={[styles.title, isDark && styles.darkText]}>{title}</Text>}
      
      <RNPieChart
        data={chartData}
        width={Dimensions.get('window').width - 40}
        height={height}
        chartConfig={chartConfig}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
        style={styles.chart}
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

export default PieChart;