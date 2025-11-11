// src/screens/MonthsOverviewScreen.tsx - VERSION CORRIGÉE SANS ERREURS TYPESCRIPT
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import MonthCard from '../components/analytics/MonthCard';
import { SafeAreaView } from '../components/SafeAreaView';
import { useCurrency } from '../context/CurrencyContext';
import { useTheme } from '../context/ThemeContext';
import { useMonthlyData } from '../hooks/useMonthlyData';

// Types pour la navigation
type RootStackParamList = {
  MonthsOverview: undefined;
  MonthDetail: { year: number; month: number };
};

type MonthsOverviewScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MonthsOverview'>;

const MonthsOverviewScreen: React.FC = () => {
  const navigation = useNavigation<MonthsOverviewScreenNavigationProp>();
  const { theme } = useTheme();
  const { formatAmount } = useCurrency();
  const { getMonthlyOverview, getAvailableYears } = useMonthlyData();
  const isDark = theme === 'dark';
  
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const availableYears = getAvailableYears;
  const monthlyData = useMemo(() => {
    return getMonthlyOverview(selectedYear);
  }, [getMonthlyOverview, selectedYear]);

  // Calcul des totaux annuels
  const yearlyTotals = useMemo(() => {
    return monthlyData.reduce((acc, month) => ({
      totalIncome: acc.totalIncome + month.income,
      totalExpenses: acc.totalExpenses + month.expenses,
      totalNetFlow: acc.totalNetFlow + month.netFlow,
      totalTransactions: acc.totalTransactions + month.transactionCount
    }), {
      totalIncome: 0,
      totalExpenses: 0,
      totalNetFlow: 0,
      totalTransactions: 0
    });
  }, [monthlyData]);

  const handleMonthPress = (year: number, month: number) => {
    navigation.navigate('MonthDetail', { year, month });
  };

  const YearSelector = () => (
    <View style={styles.yearSelector}>
      <Text style={[styles.yearSelectorLabel, isDark && styles.darkSubtext]}>
        Année:
      </Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.yearButtonsContainer}
      >
        {availableYears.map(year => (
          <TouchableOpacity
            key={year}
            style={[
              styles.yearButton,
              selectedYear === year && styles.yearButtonActive,
              isDark && styles.darkYearButton
            ]}
            onPress={() => setSelectedYear(year)}
          >
            <Text style={[
              styles.yearButtonText,
              selectedYear === year && styles.yearButtonTextActive,
              isDark && styles.darkYearButtonText
            ]}>
              {year}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const YearlySummary = () => (
    <View style={[styles.yearlySummary, isDark && styles.darkCard]}>
      <Text style={[styles.yearlySummaryTitle, isDark && styles.darkText]}>
        Résumé {selectedYear}
      </Text>
      
      <View style={styles.yearlyStats}>
        <View style={styles.yearlyStat}>
          <Text style={[styles.yearlyStatValue, { color: '#10B981' }]}>
            {formatAmount(yearlyTotals.totalIncome)}
          </Text>
          <Text style={[styles.yearlyStatLabel, isDark && styles.darkSubtext]}>
            Revenus totaux
          </Text>
        </View>
        
        <View style={styles.yearlyStat}>
          <Text style={[styles.yearlyStatValue, { color: '#EF4444' }]}>
            {formatAmount(yearlyTotals.totalExpenses)}
          </Text>
          <Text style={[styles.yearlyStatLabel, isDark && styles.darkSubtext]}>
            Dépenses totales
          </Text>
        </View>
        
        <View style={styles.yearlyStat}>
          <Text style={[
            styles.yearlyStatValue,
            { color: yearlyTotals.totalNetFlow >= 0 ? '#10B981' : '#EF4444' }
          ]}>
            {formatAmount(yearlyTotals.totalNetFlow)}
          </Text>
          <Text style={[styles.yearlyStatLabel, isDark && styles.darkSubtext]}>
            Solde annuel
          </Text>
        </View>
        
        <View style={styles.yearlyStat}>
          <Text style={[styles.yearlyStatValue, isDark && styles.darkText]}>
            {yearlyTotals.totalTransactions}
          </Text>
          <Text style={[styles.yearlyStatLabel, isDark && styles.darkSubtext]}>
            Transactions
          </Text>
        </View>
      </View>
    </View>
  );

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={[styles.emptyEmoji, isDark && styles.darkSubtext]}>📊</Text>
      <Text style={[styles.emptyTitle, isDark && styles.darkText]}>
        Aucune donnée pour {selectedYear}
      </Text>
      <Text style={[styles.emptyDescription, isDark && styles.darkSubtext]}>
        Les transactions de {selectedYear} apparaîtront ici
      </Text>
    </View>
  );

  return (
    <SafeAreaView>
      <View style={[styles.container, isDark && styles.darkContainer]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, isDark && styles.darkText]}>
            Vue par Mois
          </Text>
          <Text style={[styles.subtitle, isDark && styles.darkSubtext]}>
            Analyse mensuelle de vos finances
          </Text>
        </View>

        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Sélecteur d'année */}
          <YearSelector />

          {/* Résumé annuel */}
          {monthlyData.length > 0 && <YearlySummary />}

          {/* Liste des mois */}
          {monthlyData.length > 0 ? (
            <View style={styles.monthsList}>
              <Text style={[styles.sectionTitle, isDark && styles.darkText]}>
                Mois de {selectedYear}
              </Text>
              
              <FlatList
                data={monthlyData}
                renderItem={({ item }) => (
                  <MonthCard
                    year={item.year}
                    month={item.month}
                    income={item.income}
                    expenses={item.expenses}
                    netFlow={item.netFlow}
                    transactionCount={item.transactionCount}
                    onPress={handleMonthPress}
                    isCurrentMonth={item.year === currentYear && item.month === currentMonth}
                  />
                )}
                keyExtractor={(item) => `${item.year}-${item.month}`}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
              />
            </View>
          ) : (
            <EmptyState />
          )}

          <View style={styles.spacer} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  darkContainer: {
    backgroundColor: '#0F172A',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  yearSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  yearSelectorLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginRight: 12,
  },
  yearButtonsContainer: {
    flexGrow: 1,
    gap: 8,
  },
  yearButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    minWidth: 70,
    alignItems: 'center',
  },
  darkYearButton: {
    backgroundColor: '#334155',
  },
  yearButtonActive: {
    backgroundColor: '#007AFF',
  },
  yearButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  darkYearButtonText: {
    color: '#94A3B8',
  },
  yearButtonTextActive: {
    color: '#FFFFFF',
  },
  yearlySummary: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  darkCard: {
    backgroundColor: '#1E293B',
  },
  yearlySummaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
    textAlign: 'center',
  },
  yearlyStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  yearlyStat: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 8,
  },
  yearlyStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  yearlyStatLabel: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  monthsList: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    marginTop: 40,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  spacer: {
    height: 20,
  },
  darkText: {
    color: '#F1F5F9',
  },
  darkSubtext: {
    color: '#94A3B8',
  },
});

export default MonthsOverviewScreen;