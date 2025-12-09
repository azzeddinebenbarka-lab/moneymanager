// src/screens/BudgetsScreen.tsx - VERSION CORRIGÉE
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BudgetCard from '../components/budget/BudgetCard';
import BudgetForm from '../components/budget/BudgetForm';
import { AppHeader } from '../components/layout/AppHeader';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useBudgets } from '../hooks/useBudgets';
import { Budget } from '../types';

interface BudgetsScreenProps {
  navigation: any;
}

const BudgetsScreen: React.FC<BudgetsScreenProps> = ({ navigation }) => {
  const { formatAmount } = useCurrency();
  const { t } = useLanguage();
  const { theme } = useTheme();
  const { 
    budgets, 
    loading, 
    error, 
    stats, 
    createBudget, 
    deleteBudget, 
    toggleBudget, 
    refreshBudgets 
  } = useBudgets();
  
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const isDark = theme === 'dark';

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshBudgets();
    setRefreshing(false);
  };

  const handleCreateBudget = async (budgetData: Omit<Budget, 'id' | 'createdAt' | 'spent'>) => {
    try {
      await createBudget(budgetData);
      setShowBudgetForm(false);
    } catch (error) {
      Alert.alert(t.error, 'Impossible de créer le budget');
    }
  };

  const handleDeleteBudget = (id: string) => {
    const budget = budgets.find(b => b.id === id);
    if (!budget) return;
    
    Alert.alert(
      t.delete + ' ' + t.myBudget,
      t.confirmDelete,
      [
        { text: t.cancel, style: 'cancel' },
        { 
          text: t.delete, 
          style: 'destructive',
          onPress: () => deleteBudget(id)
        },
      ]
    );
  };

  const handleToggleBudget = (id: string, isActive: boolean) => {
    toggleBudget(id, isActive);
  };

  const handleBudgetPress = (budget: Budget) => {
    navigation.navigate('EditBudget', { budgetId: budget.id });
  };

  // États de chargement et d'erreur
  if (loading && !refreshing) {
    return (
      <SafeAreaView style={[styles.container, isDark && styles.darkContainer, styles.center]} edges={['top', 'left', 'right']}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={[styles.loadingText, isDark && styles.darkText]}>
          {t.loadingBudgets}
        </Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, isDark && styles.darkContainer, styles.center]} edges={['top', 'left', 'right']}>
        <Ionicons name="alert-circle-outline" size={64} color="#FF3B30" />
        <Text style={[styles.errorText, isDark && styles.darkText]}>
          {error}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={refreshBudgets}>
          <Text style={styles.retryButtonText}>{t.retry}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const activeBudgets = budgets.filter(budget => budget.isActive);
  const inactiveBudgets = budgets.filter(budget => !budget.isActive);

  return (
    <SafeAreaView style={[styles.container, isDark && styles.darkContainer]} edges={['top', 'left', 'right']}>
      <AppHeader 
        title={t.myBudgets} 
        rightComponent={
          <TouchableOpacity onPress={() => setShowBudgetForm(true)}>
            <Ionicons name="add" size={24} color="#007AFF" />
          </TouchableOpacity>
        }
      />
      {/* Header avec statistiques */}
      <View style={[styles.header, isDark && styles.darkHeader]}>
        <View style={styles.headerTop}>
          {/* Title moved to AppHeader */}
        </View>

        <Text style={[styles.subtitle, isDark && styles.darkSubtext]}>
          {t.manageLimits}
        </Text>

        {/* Statistiques rapides */}
        <View style={[styles.statsContainer, isDark && styles.darkStatsContainer]}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, isDark && styles.darkText]}>
              {stats.totalBudgets}
            </Text>
            <Text style={[styles.statLabel, isDark && styles.darkSubtext]}>
              {t.total}
            </Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: stats.activeBudgets > 0 ? '#34C759' : isDark ? '#fff' : '#000' }]}>
              {stats.activeBudgets}
            </Text>
            <Text style={[styles.statLabel, isDark && styles.darkSubtext]}>
              {t.active}
            </Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: stats.averageUsage > 80 ? '#FF9500' : isDark ? '#fff' : '#000' }]}>
              {Math.round(stats.averageUsage)}%
            </Text>
            <Text style={[styles.statLabel, isDark && styles.darkSubtext]}>
              {t.usage}
            </Text>
          </View>
        </View>
      </View>

      <FlatList
        data={[]}
        renderItem={null}
        refreshing={refreshing}
        onRefresh={onRefresh}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {/* Budgets actifs */}
            {activeBudgets.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={[styles.sectionTitle, isDark && styles.darkText]}>
                    {t.activeBudgets} ({activeBudgets.length})
                  </Text>
                </View>

                {activeBudgets.map((budget) => (
                  <BudgetCard
                    key={budget.id}
                    budget={budget}
                    onPress={() => handleBudgetPress(budget)}
                    onLongPress={() => handleDeleteBudget(budget.id)}
                    onToggle={handleToggleBudget}
                  />
                ))}
              </View>
            )}

            {/* Budgets inactifs */}
            {inactiveBudgets.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={[styles.sectionTitle, isDark && styles.darkText]}>
                    {t.inactiveBudgets} ({inactiveBudgets.length})
                  </Text>
                </View>

                {inactiveBudgets.map((budget) => (
                  <BudgetCard
                    key={budget.id}
                    budget={budget}
                    onPress={() => handleBudgetPress(budget)}
                    onLongPress={() => handleDeleteBudget(budget.id)}
                    onToggle={handleToggleBudget}
                  />
                ))}
              </View>
            )}
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons 
              name="pie-chart-outline" 
              size={64} 
              color={isDark ? '#555' : '#ccc'} 
            />
            <Text style={[styles.emptyText, isDark && styles.darkSubtext]}>
              {t.noBudgets}
            </Text>
            <Text style={[styles.emptySubtext, isDark && styles.darkSubtext]}>
              {t.createFirstBudget}
            </Text>
            <TouchableOpacity 
              style={styles.createButton}
              onPress={() => setShowBudgetForm(true)}
            >
              <Text style={styles.createButtonText}>{t.createBudget}</Text>
            </TouchableOpacity>
          </View>
        }
        ListFooterComponent={<View style={styles.spacer} />}
      />

      {/* Formulaire de création de budget */}
      <BudgetForm
        visible={showBudgetForm}
        onClose={() => setShowBudgetForm(false)}
        onSubmit={handleCreateBudget}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  darkContainer: {
    backgroundColor: '#1c1c1e',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  darkHeader: {
    backgroundColor: '#2c2c2e',
    borderBottomColor: '#38383a',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  darkHeaderButton: {
    backgroundColor: '#2c2c2e',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
  },
  darkStatsContainer: {
    backgroundColor: '#2c2c2e',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#e0e0e0',
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 0,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  spacer: {
    height: 100,
  },
  darkText: {
    color: '#fff',
  },
  darkSubtext: {
    color: '#888',
  },
});

export default BudgetsScreen;