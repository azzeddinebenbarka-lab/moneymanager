// src/screens/CategoryAnalysisScreen.tsx - VERSION CORRIGÉE POUR LES ICÔNES
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ColorValue,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from '../components/SafeAreaView';
import { useCurrency } from '../context/CurrencyContext';
import { useTheme } from '../context/ThemeContext';
import { useCategories } from '../hooks/useCategories';
import { useTransactions } from '../hooks/useTransactions';

const CategoryAnalysisScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { formatAmount } = useCurrency();
  const { transactions, loading: transactionsLoading } = useTransactions();
  const { categories } = useCategories();
  
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | 'all'>('all');
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | 'all'>('all');
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [monthTotals, setMonthTotals] = useState<{ income: number; expenses: number; balance: number }>({ income: 0, expenses: 0, balance: 0 });
  const [filteredTransactionsForDisplay, setFilteredTransactionsForDisplay] = useState<any[]>([]);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const isDark = theme === 'dark';

  // ✅ CORRECTION : Définir les couleurs avec le bon type
  const headerGradientColors: readonly [ColorValue, ColorValue] = isDark 
    ? ['#1E293B', '#334155'] as const 
    : ['#F3F8FF', '#FFFFFF'] as const;

  const incomeGradientColors: readonly [ColorValue, ColorValue] = ['#E6FFFA', '#FFFFFF'] as const;
  const expenseGradientColors: readonly [ColorValue, ColorValue] = ['#FFF1F2', '#FFFFFF'] as const;
  const balanceGradientColors: readonly [ColorValue, ColorValue] = ['#F8FAFF', '#FFFFFF'] as const;

  // Fonction pour obtenir les couleurs de gradient basées sur le type de transaction
  const getTransactionGradientColors = (type: string): readonly [ColorValue, ColorValue] => {
    return type === 'income' ? incomeGradientColors : expenseGradientColors;
  };

  const getCategoryNameById = useCallback((categoryId: string) => {
    if (!categoryId) return 'Non catégorisé';
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || 'Catégorie inconnue';
  }, [categories]);

  const getCategoryColorById = useCallback((categoryId: string) => {
    if (!categoryId) return '#666666';
    const category = categories.find(cat => cat.id === categoryId);
    return category?.color || '#666666';
  }, [categories]);

  const getCategoryIconById = useCallback((categoryId: string) => {
    if (!categoryId) return 'help-circle-outline';
    const category = categories.find(cat => cat.id === categoryId);
    return category?.icon || 'help-circle-outline';
  }, [categories]);

  // ✅ CORRECTION : Fonction pour obtenir l'icône Ionicons avec typage sécurisé
  const getIoniconsIcon = (iconName: string): keyof typeof Ionicons.glyphMap => {
    // Définition d'un mapping sécurisé avec seulement les icônes valides
    const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
      // Icônes de base
      'home': 'home-outline',
      'restaurant': 'restaurant-outline',
      'car': 'car-outline',
      'medical': 'medical-outline',
      'cart': 'cart-outline',
      'game-controller': 'game-controller-outline',
      'airplane': 'airplane-outline',
      'cash': 'cash-outline',
      'trending-up': 'trending-up-outline',
      'gift': 'gift-outline',
      'trophy': 'trophy-outline',
      'wifi': 'wifi-outline',
      'phone': 'call-outline', // ✅ CORRECTION : 'phone-outline' n'existe pas, utiliser 'call-outline'
      'water': 'water-outline',
      'flash': 'flash-outline',
      'shirt': 'shirt-outline',
      'cut': 'cut-outline',
      'book': 'book-outline',
      'musical-notes': 'musical-notes-outline',
      'basketball': 'basketball-outline',
      'film': 'film-outline',
      'wine': 'wine-outline',
      'cafe': 'cafe-outline',
      'bus': 'bus-outline',
      'train': 'train-outline',
      'bicycle': 'bicycle-outline',
      'bed': 'bed-outline',
      'paw': 'paw-outline',
      'heart': 'heart-outline',
      'briefcase': 'briefcase-outline',
      'construct': 'construct-outline',
      'leaf': 'leaf-outline',
      'flower': 'flower-outline',
      'rocket': 'rocket-outline',
      'star': 'star-outline',
      'school': 'school-outline',
      'business': 'business-outline',
      'card': 'card-outline',
      'person': 'person-outline',
      'people': 'people-outline',
      'document': 'document-outline',
      'shield': 'shield-outline',
      'barbell': 'barbell-outline',
      'fitness': 'fitness-outline',
      'eye': 'eye-outline',
      'flask': 'flask-outline',
      'location': 'location-outline',
      'pricetag': 'pricetag-outline',
      'desktop': 'desktop-outline',
      'laptop': 'laptop-outline',
      'tv': 'tv-outline',
      'diamond': 'diamond-outline',
      'sparkles': 'sparkles-outline',
      'build': 'build-outline',
      'nutrition': 'nutrition-outline',
      'cube': 'cube-outline',
      'fast-food': 'fast-food-outline',
      'basket': 'basket-outline',
      'car-sport': 'car-sport-outline',
      'map': 'map-outline',
      'play-circle': 'play-circle-outline',
      'pencil': 'pencil-outline',
      'call': 'call-outline',
      'flame': 'flame-outline',
      'warning': 'warning-outline',
      'ellipsis-horizontal': 'ellipsis-horizontal-outline',
      
      // Fallback par défaut
      'help-circle-outline': 'help-circle-outline'
    };

    // ✅ CORRECTION : Retourner une icône valide ou le fallback
    const validIcon = iconMap[iconName];
    if (validIcon && validIcon in Ionicons.glyphMap) {
      return validIcon;
    }
    
    // Fallback sécurisé
    return 'help-circle-outline';
  };

  useEffect(() => {
    setLoading(true);
    try {
      const year = currentYear;
      const month = currentMonth;

      const monthTx = (transactions || []).filter(t => {
        if (!t?.date) return false;
        const d = new Date(t.date);
        return d.getFullYear() === year && d.getMonth() + 1 === month;
      });

      const incomeTotal = monthTx.filter(t => t.type === 'income').reduce((s, t) => s + Math.abs(t.amount || 0), 0);
      const expensesTotal = monthTx.filter(t => t.type === 'expense').reduce((s, t) => s + Math.abs(t.amount || 0), 0);

      const categoryTotals: Record<string, { amount: number; count: number; color: string; name: string }> = {};

      const filteredForList = monthTx.filter(tx => {
        if (selectedCategoryId && selectedCategoryId !== 'all') {
          const txCat = (categories || []).find(c => c.id === tx.category || c.name === tx.category);
          if (!txCat) return false;
          if (selectedSubcategoryId && selectedSubcategoryId !== 'all') {
            return txCat.id === selectedSubcategoryId;
          }
          return txCat.id === selectedCategoryId || txCat.parentId === selectedCategoryId;
        }
        return true;
      });

      filteredForList.forEach(tx => {
        const amount = Math.abs(tx.amount || 0);
        const catId = tx.category || 'uncategorized';
        if (!categoryTotals[catId]) {
          categoryTotals[catId] = { amount: 0, count: 0, color: getCategoryColorById(catId), name: getCategoryNameById(catId) };
        }
        categoryTotals[catId].amount += amount;
        categoryTotals[catId].count += 1;
      });

      const chartData = Object.entries(categoryTotals).map(([id, v]) => ({ id, name: v.name, amount: v.amount, count: v.count, color: v.color })).sort((a, b) => b.amount - a.amount);

      setCategoryData(chartData);
      setLoading(false);
      setMonthTotals({ income: incomeTotal, expenses: expensesTotal, balance: incomeTotal - expensesTotal });
      setFilteredTransactionsForDisplay(filteredForList);
    } catch (err) {
      console.error('❌ Error computing category analysis', err);
      setLoading(false);
    }
  }, [transactions, categories, selectedCategoryId, selectedSubcategoryId, currentYear, currentMonth, getCategoryColorById, getCategoryNameById]);

  const handleCategoryPress = (categoryId: string, categoryName: string) => {
    try {
      (navigation as any).navigate('Transactions', {
        filters: {
          category: categoryId,
          categoryName: categoryName,
          year: currentYear,
          month: currentMonth
        }
      });
    } catch (error) {
      console.warn('Navigation vers Transactions non disponible');
      (navigation as any).navigate('Transactions');
    }
  };

  if (loading || transactionsLoading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={[styles.loadingText, isDark && styles.darkText]}>
          Analyse des catégories...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <View style={[styles.container, isDark && styles.darkContainer]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={isDark ? "#fff" : "#000"} />
          </TouchableOpacity>
          <Text style={[styles.title, isDark && styles.darkText]}>
            Analyse par Catégorie
          </Text>
          <View style={styles.headerRight} />
        </View>

        <LinearGradient 
          colors={headerGradientColors} 
          style={styles.headerGradientWrapper}
        >
          <View style={styles.filtersModernHeader}>
            <Text style={[styles.headerModernTitle, isDark && styles.darkText]}>Catégories du mois</Text>
          </View>

          {/* Catégories (chips) */}
          <View style={styles.chipsRowContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
              <TouchableOpacity
                style={[styles.chip, selectedCategoryId === 'all' && styles.chipActive]}
                onPress={() => { setSelectedCategoryId('all'); setSelectedSubcategoryId('all'); }}
              >
                <Text style={[styles.chipText, selectedCategoryId === 'all' && styles.chipTextActive]}>Toutes</Text>
              </TouchableOpacity>
              {(categories || []).filter(c => c.level === 0).map((cat: any) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.chip, selectedCategoryId === cat.id && styles.chipActive]}
                  onPress={() => { setSelectedCategoryId(cat.id); setSelectedSubcategoryId('all'); }}
                >
                  <Text style={[styles.chipText, selectedCategoryId === cat.id && styles.chipTextActive]}>{cat.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Sous-catégories si une catégorie est sélectionnée */}
          {selectedCategoryId !== 'all' && (
            <View style={styles.chipsRowContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
                <TouchableOpacity
                  style={[styles.chip, selectedSubcategoryId === 'all' && styles.chipActive]}
                  onPress={() => setSelectedSubcategoryId('all')}
                >
                  <Text style={[styles.chipText, selectedSubcategoryId === 'all' && styles.chipTextActive]}>Toutes sous-catégories</Text>
                </TouchableOpacity>
                {(categories || []).filter(c => c.parentId === selectedCategoryId).map((sub: any) => (
                  <TouchableOpacity
                    key={sub.id}
                    style={[styles.chip, selectedSubcategoryId === sub.id && styles.chipActive]}
                    onPress={() => setSelectedSubcategoryId(sub.id)}
                  >
                    <Text style={[styles.chipText, selectedSubcategoryId === sub.id && styles.chipTextActive]}>{sub.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </LinearGradient>

        {/* Résumé */}
        <View style={styles.summary}>
          <Text style={[styles.summarySubtitle, isDark && styles.darkSubtext]}>
            {categoryData.length} catégories • {categoryData.reduce((sum, cat) => sum + cat.count, 0)} transactions
          </Text>
        </View>

        {/* Totaux du mois */}
        <View style={styles.totalsCardsRow}>
          <LinearGradient 
            colors={incomeGradientColors} 
            style={[styles.totalCard, styles.totalCardLeft]}
          > 
            <Text style={[styles.totalCardLabel, isDark && styles.darkSubtext]}>Revenus</Text>
            <Text style={[styles.totalCardValue, { color: '#047857' }]}>{formatAmount(monthTotals.income)}</Text>
          </LinearGradient>

          <LinearGradient 
            colors={expenseGradientColors} 
            style={styles.totalCard}
          >
            <Text style={[styles.totalCardLabel, isDark && styles.darkSubtext]}>Dépenses</Text>
            <Text style={[styles.totalCardValue, { color: '#B91C1C' }]}>{formatAmount(monthTotals.expenses)}</Text>
          </LinearGradient>

          <LinearGradient 
            colors={balanceGradientColors} 
            style={[styles.totalCard, styles.totalCardRight]}
          >
            <Text style={[styles.totalCardLabel, isDark && styles.darkSubtext]}>Solde</Text>
            <Text style={[styles.totalCardValue, { color: monthTotals.balance >= 0 ? '#059669' : '#DC2626' }]}>
              {formatAmount(monthTotals.balance)}
            </Text>
          </LinearGradient>
        </View>

        {/* Transactions avec icônes fonctionnelles */}
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.transactionsSection}>
            <Text style={[styles.sectionTitle, isDark && styles.darkText]}>
              Transactions ({filteredTransactionsForDisplay.length})
            </Text>
            
            {(filteredTransactionsForDisplay || []).map((tx: any) => {
              const amountColor = tx.type === 'income' ? '#059669' : '#DC2626';
              const gradientColors = getTransactionGradientColors(tx.type);
              const categoryColor = getCategoryColorById(tx.category || 'uncategorized');
              const categoryIcon = getCategoryIconById(tx.category || 'uncategorized');
              const ioniconsIcon = getIoniconsIcon(categoryIcon);
              
              return (
                <TouchableOpacity 
                  key={tx.id || tx._id || Math.random()} 
                  style={styles.txCard} 
                  onPress={() => {}}
                >
                  <LinearGradient 
                    colors={gradientColors} 
                    style={[styles.txCardInner, styles.txCardShadow]}
                  >
                    <View style={styles.txLeft}>
                      {/* ✅ CORRECTION : Icône Ionicons fonctionnelle */}
                      <View style={[styles.txIconContainer, { backgroundColor: categoryColor + '20' }]}>
                        <Ionicons 
                          name={ioniconsIcon} 
                          size={20} 
                          color={categoryColor}
                        />
                      </View>
                      <View style={styles.txInfo}>
                        <Text style={[styles.txTitle, isDark && styles.darkText]} numberOfLines={1}>
                          {tx.description || getCategoryNameById(tx.category || '') || 'Transaction'}
                        </Text>
                        <Text style={[styles.txDate, isDark && styles.darkSubtext]}>
                          {tx.date ? new Date(tx.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) : ''}
                          {' • '}
                          {getCategoryNameById(tx.category || '')}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.txAmountContainer}>
                      <Ionicons 
                        name={tx.type === 'income' ? 'arrow-down' : 'arrow-up'} 
                        size={16} 
                        color={amountColor}
                        style={styles.txAmountIcon}
                      />
                      <Text style={[styles.txAmount, { color: amountColor }]}>
                        {tx.type === 'income' ? '+' : '-'}{formatAmount(Math.abs(tx.amount || 0))}
                      </Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              );
            })}
            
            {(!filteredTransactionsForDisplay || filteredTransactionsForDisplay.length === 0) && (
              <View style={styles.emptyTransactions}>
                <Ionicons name="receipt-outline" size={48} color={isDark ? '#666' : '#999'} />
                <Text style={[styles.emptySubtext, isDark && styles.darkSubtext]}>
                  Aucune transaction pour ces filtres
                </Text>
              </View>
            )}
            
            <View style={styles.spacer} />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

// Les styles restent exactement les mêmes...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  darkContainer: {
    backgroundColor: '#1c1c1e',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: 'transparent',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    flex: 1,
  },
  headerRight: {
    width: 40,
  },
  summary: {
    padding: 10,
    paddingTop: 0,
    alignItems: 'center',
  },
  summarySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  spacer: {
    height: 20,
  },
  darkText: {
    color: '#fff',
  },
  darkSubtext: {
    color: '#888',
  },
  headerGradientWrapper: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2FF'
  },
  filtersModernHeader: {
    paddingVertical: 8,
  },
  headerModernTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A'
  },
  chipsRowContainer: {
    marginTop: 12,
  },
  chipsRow: {
    paddingVertical: 6,
    paddingRight: 12,
    alignItems: 'center'
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: '#007AFF'
  },
  chipText: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '600'
  },
  chipTextActive: {
    color: '#FFFFFF'
  },
  transactionsSection: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  txCard: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  txCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    borderWidth: 0,
    borderColor: 'transparent'
  },
  txCardShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  txLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  txIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txInfo: {
    flex: 1,
  },
  txTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A'
  },
  txDate: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  txAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  txAmountIcon: {
    marginRight: 4,
  },
  txAmount: {
    fontSize: 15,
    fontWeight: '700',
    minWidth: 80,
    textAlign: 'right'
  },
  emptyTransactions: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  totalsCardsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  totalCard: {
    flex: 0,
    width: 110,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.04)'
  },
  totalCardLeft: {
    marginLeft: 0
  },
  totalCardRight: {
    marginRight: 0
  },
  totalCardLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 6,
    fontWeight: '600'
  },
  totalCardValue: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center'
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default CategoryAnalysisScreen;