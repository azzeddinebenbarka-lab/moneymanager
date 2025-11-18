// src/screens/MonthDetailScreen.tsx - VERSION COMPLÈTEMENT CORRIGÉE
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from '../components/SafeAreaView';
import { useCurrency } from '../context/CurrencyContext';
import { useTheme } from '../context/ThemeContext';
import { useMonthlyData } from '../hooks/useMonthlyData';
import { useTransactions } from '../hooks/useTransactions';

const { width } = Dimensions.get('window');

// Types pour la navigation
type RootStackParamList = {
  MonthDetail: { year: number; month: number };
  MonthsOverview: undefined;
  TransactionDetail: { transactionId: string };
};

type MonthDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MonthDetail'>;
type MonthDetailScreenRouteProp = RouteProp<RootStackParamList, 'MonthDetail'>;

const MonthDetailScreen: React.FC = () => {
  const navigation = useNavigation<MonthDetailScreenNavigationProp>();
  const route = useRoute<MonthDetailScreenRouteProp>();
  const { theme } = useTheme();
  const { formatAmount } = useCurrency();
  const { getMonthlyData } = useMonthlyData();
  const { transactions, deleteTransaction, loading: transactionsLoading } = useTransactions();

  const { year, month } = route.params;
  const isDark = theme === 'dark';

  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [monthData, setMonthData] = useState<any>(null);
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);

  // Animations
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;

  // ✅ CORRECTION : Charger les données du mois
  const loadMonthData = useCallback(async () => {
    try {
      console.log(`🔍 Chargement données ${month}/${year}...`);
      
      // Obtenir les données du mois
      const data = getMonthlyData(year, month);
      setMonthData(data);

      // Filtrer les transactions selon le filtre sélectionné
      let filtered = data.transactions || [];
      
      if (selectedFilter === 'income') {
        filtered = filtered.filter((t: any) => t.type === 'income');
      } else if (selectedFilter === 'expense') {
        filtered = filtered.filter((t: any) => t.type === 'expense');
      }

      // Trier par date (plus récent en premier)
      filtered.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setFilteredTransactions(filtered);

      // Animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        })
      ]).start();

    } catch (error) {
      console.error('❌ Erreur chargement données:', error);
      Alert.alert('Erreur', 'Impossible de charger les données du mois');
    }
  }, [year, month, selectedFilter, getMonthlyData, fadeAnim, slideAnim]);

  // ✅ CORRECTION : Recharger quand le filtre change
  useEffect(() => {
    loadMonthData();
  }, [loadMonthData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadMonthData();
    setRefreshing(false);
  };

  const handleFilterChange = (filter: 'all' | 'income' | 'expense') => {
    setSelectedFilter(filter);
  };

  const handleTransactionPress = (transactionId: string) => {
    navigation.navigate('TransactionDetail', { transactionId });
  };

  const handleDeleteTransaction = (transactionId: string, description: string) => {
    Alert.alert(
      'Supprimer la transaction',
      `Êtes-vous sûr de vouloir supprimer "${description}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTransaction(transactionId);
              await loadMonthData(); // Recharger les données
              Alert.alert('Succès', 'Transaction supprimée avec succès');
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de supprimer la transaction');
            }
          },
        },
      ]
    );
  };

  const handleBack = () => {
    navigation.goBack();
  };

  // Format du nom du mois
  const monthName = useMemo(() => {
    return new Date(year, month).toLocaleDateString('fr-FR', { 
      month: 'long',
      year: 'numeric'
    });
  }, [year, month]);

  // Header moderne
  const ModernHeader = () => (
    <View style={[styles.header, isDark && styles.darkHeader]}>
      <View style={styles.headerBackground}>
        <View style={[styles.headerGradient, isDark && styles.darkHeaderGradient]} />
      </View>
      
      <View style={styles.headerContent}>
        <View style={styles.headerTop}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBack}
          >
            <Ionicons name="arrow-back" size={24} color={isDark ? "#fff" : "#000"} />
          </TouchableOpacity>
          
          <View style={styles.headerTitleContainer}>
            <Text style={[styles.headerTitle, isDark && styles.darkTitle]}>
              Détail du Mois
            </Text>
            <Text style={[styles.headerSubtitle, isDark && styles.darkSubtitle]}>
              {monthName}
            </Text>
          </View>

          <View style={styles.headerStats}>
            <View style={styles.miniStat}>
              <Ionicons name="receipt" size={14} color="#007AFF" />
              <Text style={[styles.miniStatText, isDark && styles.darkSubtext]}>
                {monthData?.transactionCount || 0} transactions
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  // Cartes de statistiques principales
  const StatsCards = () => (
    <Animated.View 
      style={[
        styles.statsContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <View style={styles.statsRow}>
        {/* Revenus */}
        <View style={[styles.statCard, isDark && styles.darkCard]}>
          <View style={[styles.statIcon, { backgroundColor: '#E8F5E8' }]}>
            <Ionicons name="arrow-down" size={20} color="#10B981" />
          </View>
          <View style={styles.statContent}>
            <Text style={[styles.statValue, isDark && styles.darkText]}>
              {formatAmount(monthData?.income || 0)}
            </Text>
            <Text style={[styles.statLabel, isDark && styles.darkSubtext]}>
              Revenus
            </Text>
          </View>
        </View>

        {/* Dépenses */}
        <View style={[styles.statCard, isDark && styles.darkCard]}>
          <View style={[styles.statIcon, { backgroundColor: '#FFE5E5' }]}>
            <Ionicons name="arrow-up" size={20} color="#EF4444" />
          </View>
          <View style={styles.statContent}>
            <Text style={[styles.statValue, isDark && styles.darkText]}>
              {formatAmount(monthData?.expenses || 0)}
            </Text>
            <Text style={[styles.statLabel, isDark && styles.darkSubtext]}>
              Dépenses
            </Text>
          </View>
        </View>
      </View>

      {/* Solde net */}
      <View style={[styles.netFlowCard, isDark && styles.darkCard]}>
        <View style={styles.netFlowHeader}>
          <Ionicons 
            name={monthData?.netFlow >= 0 ? "trending-up" : "trending-down"} 
            size={24} 
            color={monthData?.netFlow >= 0 ? '#10B981' : '#EF4444'} 
          />
          <Text style={[styles.netFlowLabel, isDark && styles.darkSubtext]}>
            Solde du Mois
          </Text>
        </View>
        <Text style={[
          styles.netFlowValue,
          { color: monthData?.netFlow >= 0 ? '#10B981' : '#EF4444' }
        ]}>
          {formatAmount(monthData?.netFlow || 0)}
        </Text>
        <Text style={[styles.savingsRate, isDark && styles.darkSubtext]}>
          Taux d'épargne: {monthData?.savingsRate?.toFixed(1) || 0}%
        </Text>
      </View>
    </Animated.View>
  );

  // Filtres de transactions
  const TransactionFilters = () => (
    <Animated.View 
      style={[
        styles.filtersContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <Text style={[styles.filtersLabel, isDark && styles.darkSubtext]}>
        Filtrer les transactions
      </Text>
      <View style={styles.filtersRow}>
        {[
          { key: 'all', label: 'Toutes', icon: 'list' },
          { key: 'income', label: 'Revenus', icon: 'arrow-down' },
          { key: 'expense', label: 'Dépenses', icon: 'arrow-up' },
        ].map(filter => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterButton,
              selectedFilter === filter.key && styles.filterButtonActive,
              isDark && styles.darkFilterButton
            ]}
            onPress={() => handleFilterChange(filter.key as any)}
          >
            <Ionicons 
              name={filter.icon as any} 
              size={16} 
              color={selectedFilter === filter.key ? '#fff' : (isDark ? '#94A3B8' : '#64748B')} 
            />
            <Text style={[
              styles.filterText,
              selectedFilter === filter.key && styles.filterTextActive,
              isDark && styles.darkText
            ]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );

  // Analyse par catégorie
  const CategoryAnalysis = () => {
    if (!monthData?.categoryBreakdown?.length) return null;

    return (
      <Animated.View 
        style={[
          styles.categorySection,
          isDark && styles.darkCard,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, isDark && styles.darkTitle]}>
            Analyse par Catégorie
          </Text>
          <Text style={[styles.sectionSubtitle, isDark && styles.darkSubtext]}>
            Dépenses détaillées
          </Text>
        </View>

        <View style={styles.categoriesList}>
          {monthData.categoryBreakdown.slice(0, 5).map((category: any, index: number) => (
            <View key={category.category} style={styles.categoryItem}>
              <View style={styles.categoryInfo}>
                <View style={[styles.categoryColor, { backgroundColor: getCategoryColor(index) }]} />
                <View style={styles.categoryDetails}>
                  <Text style={[styles.categoryName, isDark && styles.darkText]}>
                    {category.category}
                  </Text>
                  <Text style={[styles.categoryPercentage, isDark && styles.darkSubtext]}>
                    {category.percentage.toFixed(1)}%
                  </Text>
                </View>
              </View>
              <Text style={[styles.categoryAmount, isDark && styles.darkText]}>
                {formatAmount(category.amount)}
              </Text>
            </View>
          ))}
        </View>
      </Animated.View>
    );
  };

  // Liste des transactions
  const TransactionsList = () => {
    if (filteredTransactions.length === 0) {
      return (
        <Animated.View 
          style={[
            styles.emptyState,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Ionicons 
            name="receipt-outline" 
            size={64} 
            color={isDark ? '#4B5563' : '#9CA3AF'} 
          />
          <Text style={[styles.emptyTitle, isDark && styles.darkTitle]}>
            Aucune transaction
          </Text>
          <Text style={[styles.emptyDescription, isDark && styles.darkSubtext]}>
            {selectedFilter === 'all' 
              ? `Aucune transaction pour ${monthName}`
              : `Aucune transaction ${selectedFilter === 'income' ? 'de revenu' : 'de dépense'} pour ${monthName}`
            }
          </Text>
        </Animated.View>
      );
    }

    return (
      <Animated.View 
        style={[
          styles.transactionsSection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, isDark && styles.darkTitle]}>
            Transactions ({filteredTransactions.length})
          </Text>
          <Text style={[styles.sectionSubtitle, isDark && styles.darkSubtext]}>
            {selectedFilter === 'all' ? 'Toutes les transactions' : 
             selectedFilter === 'income' ? 'Revenus seulement' : 'Dépenses seulement'}
          </Text>
        </View>

        <FlatList
          data={filteredTransactions}
          renderItem={({ item }) => (
            <TransactionCard 
              transaction={item}
              onPress={handleTransactionPress}
              onDelete={handleDeleteTransaction}
              isDark={isDark}
            />
          )}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.transactionsList}
        />
      </Animated.View>
    );
  };

  // Carte de transaction
  const TransactionCard = ({ transaction, onPress, onDelete, isDark }: any) => (
    <TouchableOpacity
      style={[styles.transactionCard, isDark && styles.darkCard]}
      onPress={() => onPress(transaction.id)}
    >
      <View style={styles.transactionHeader}>
        <View style={styles.transactionInfo}>
          <View style={[
            styles.transactionIcon,
            { backgroundColor: transaction.type === 'income' ? '#E8F5E8' : '#FFE5E5' }
          ]}>
            <Ionicons 
              name={transaction.type === 'income' ? 'arrow-down' : 'arrow-up'} 
              size={16} 
              color={transaction.type === 'income' ? '#10B981' : '#EF4444'} 
            />
          </View>
          <View style={styles.transactionDetails}>
            <Text style={[styles.transactionDescription, isDark && styles.darkText]}>
              {transaction.description || 'Sans description'}
            </Text>
            <Text style={[styles.transactionCategory, isDark && styles.darkSubtext]}>
              {transaction.category} • {new Date(transaction.date).toLocaleDateString('fr-FR')}
            </Text>
          </View>
        </View>
        
        <View style={styles.transactionAmountContainer}>
          <Text style={[
            styles.transactionAmount,
            { color: transaction.type === 'income' ? '#10B981' : '#EF4444' },
            isDark && styles.darkText
          ]}>
            {transaction.type === 'income' ? '+' : '-'}{formatAmount(Math.abs(transaction.amount))}
          </Text>
        </View>
      </View>

      <View style={styles.transactionActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => onPress(transaction.id)}
        >
          <Ionicons name="create-outline" size={14} color="#007AFF" />
          <Text style={styles.actionButtonText}>Modifier</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => onDelete(transaction.id, transaction.description)}
        >
          <Ionicons name="trash-outline" size={14} color="#EF4444" />
          <Text style={styles.actionButtonText}>Supprimer</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  // Couleurs pour les catégories
  const getCategoryColor = (index: number) => {
    const colors = ['#007AFF', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
    return colors[index % colors.length];
  };

  if (transactionsLoading && !monthData) {
    return (
      <SafeAreaView>
        <View style={[styles.container, isDark && styles.darkContainer, styles.center]}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={[styles.loadingText, isDark && styles.darkText]}>
            Chargement des données...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <View style={[styles.container, isDark && styles.darkContainer]}>
        <ModernHeader />
        
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#007AFF']}
              tintColor={isDark ? '#007AFF' : '#007AFF'}
            />
          }
          contentContainerStyle={styles.scrollContent}
        >
          <StatsCards />
          <TransactionFilters />
          <CategoryAnalysis />
          <TransactionsList />
          
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
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Header
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  darkHeader: {
    backgroundColor: 'transparent',
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  headerGradient: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    opacity: 0.95,
  },
  darkHeaderGradient: {
    backgroundColor: '#1E293B',
    opacity: 0.95,
  },
  headerContent: {
    paddingHorizontal: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#64748B',
  },
  headerStats: {
    alignItems: 'flex-end',
  },
  miniStat: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  miniStatText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  
  // Contenu principal
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  
  // Cartes de statistiques
  statsContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  darkCard: {
    backgroundColor: '#1E293B',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  netFlowCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  netFlowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  netFlowLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  netFlowValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  savingsRate: {
    fontSize: 12,
    color: '#64748B',
  },
  
  // Filtres
  filtersContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  filtersLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  filtersRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  darkFilterButton: {
    backgroundColor: 'transparent',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  
  // Analyse par catégorie
  categorySection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  categoriesList: {
    gap: 12,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  categoryDetails: {
    flex: 1,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 2,
  },
  categoryPercentage: {
    fontSize: 12,
    color: '#64748B',
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  
  // Transactions
  transactionsSection: {
    paddingHorizontal: 24,
  },
  transactionsList: {
    gap: 12,
  },
  transactionCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  transactionInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  transactionIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 4,
  },
  transactionCategory: {
    fontSize: 12,
    color: '#64748B',
  },
  transactionAmountContainer: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionActions: {
    flexDirection: 'row',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  editButton: {
    backgroundColor: '#EFF6FF',
  },
  deleteButton: {
    backgroundColor: '#FEF2F2',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  
  // État vide
  emptyState: {
    alignItems: 'center',
    padding: 48,
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  
  // Divers
  spacer: {
    height: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  darkTitle: {
    color: '#F1F5F9',
  },
  darkSubtitle: {
    color: '#94A3B8',
  },
  darkText: {
    color: '#F1F5F9',
  },
  darkSubtext: {
    color: '#94A3B8',
  },
});

export default MonthDetailScreen;