// src/screens/SearchScreen.tsx - VERSION MODERNE
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from '../components/SafeAreaView';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import { useDesignSystem } from '../context/ThemeContext';
import { useAnnualCharges } from '../hooks/useAnnualCharges';
import useCategories from '../hooks/useCategories';
import { useTransactions } from '../hooks/useTransactions';

type SearchFilter = 'all' | 'transactions' | 'charges' | 'categories';

const SearchScreen: React.FC = () => {
  const { t, language } = useLanguage();
  const { colors } = useDesignSystem();
  const { formatAmount } = useCurrency();
  const navigation = useNavigation();
  const { transactions } = useTransactions();
  const { charges } = useAnnualCharges();
  const { categories } = useCategories();

  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<SearchFilter>('all');

  // Normaliser le texte (supprimer emojis)
  const normalizeText = (text: string): string => {
    return text
      .replace(/[\u{1F600}-\u{1F64F}]/gu, '')
      .replace(/[\u{1F300}-\u{1F5FF}]/gu, '')
      .replace(/[\u{1F680}-\u{1F6FF}]/gu, '')
      .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, '')
      .replace(/[\u{2600}-\u{26FF}]/gu, '')
      .replace(/[\u{2700}-\u{27BF}]/gu, '')
      .trim().toLowerCase();
  };

  // Traduire catégorie (mapping complet)
  const getCategoryTranslatedName = (catName: string): string => {
    const map: Record<string, keyof typeof t> = {
      // Revenus
      'Salaire': 'cat_salary', '💼 Salaire': 'cat_salary',
      'Revenus secondaires': 'cat_secondary_income', '📈 Revenus secondaires': 'cat_secondary_income',
      'Salaire net': 'cat_net_salary', 'Prime': 'cat_bonus', 'Primes / heures sup': 'cat_bonus',
      'Freelance': 'cat_freelance', 'Commerce': 'cat_commerce', 'Commerce / ventes': 'cat_commerce',
      'Commissions': 'cat_commissions', 'Business': 'cat_business', 'Investissement': 'cat_investment',
      'Autres revenus': 'cat_other_income',
      // Logement
      'Logement': 'cat_housing', '🏠 Logement & Charges': 'cat_housing',
      'Loyer': 'cat_rent', 'Loyer / Crédit maison': 'cat_rent',
      'Électricité': 'cat_electricity', 'Eau': 'cat_water',
      'Internet': 'cat_internet', 'Wifi / Internet': 'cat_internet', 'Syndic': 'cat_syndic',
      // Nourriture
      'Nourriture': 'cat_food', 'Alimentation': 'cat_food', '🛒 Nourriture & Courses (T9edya)': 'cat_food',
      'Courses': 'cat_groceries', 'Épicerie': 'cat_groceries',
      'Légumes': 'cat_vegetables', 'Légumes / fruits': 'cat_vegetables',
      'Viande': 'cat_meat', 'Viande / poisson': 'cat_meat',
      'Produits d\'entretien': 'cat_cleaning_products', 'Produits ménagers': 'cat_cleaning_products',
      // Transport
      'Transport': 'cat_transport', '🚗 Transport & Voiture': 'cat_transport',
      'Carburant': 'cat_fuel', 'Entretien': 'cat_maintenance', 'Assurance': 'cat_insurance',
      'Lavage': 'cat_wash', 'Parking': 'cat_parking',
      // Santé
      'Santé': 'cat_health', '💊 Santé': 'cat_health', 'Pharmacie': 'cat_pharmacy',
      'Consultation': 'cat_consultation', 'Analyse / consultation': 'cat_consultation',
      'Assurance santé': 'cat_health_insurance', 'Assurance maladie': 'cat_health_insurance',
      // Enfant
      'Enfant': 'cat_child', '👶 Enfant': 'cat_child',
      'Alimentation bébé': 'cat_child_food', 'Hygiène': 'cat_hygiene',
      'École': 'cat_school', 'École / crèche': 'cat_school',
      // Abonnements
      'Abonnements': 'cat_subscriptions', '📱 Abonnements': 'cat_subscriptions',
      'Téléphone': 'cat_phone', 'Applications': 'cat_apps', 'Streaming': 'cat_streaming',
      // Personnel
      'Personnel': 'cat_personal', '👤 Dépenses personnelles': 'cat_personal',
      'Vêtements': 'cat_clothes', 'Coiffure': 'cat_haircut', 'Parfums': 'cat_perfume',
      // Shopping
      'Shopping': 'cat_shopping', 'Électronique': 'cat_electronics',
      'Maison': 'cat_home', 'Cadeaux': 'cat_gifts',
      // Loisirs
      'Loisirs': 'cat_leisure', 'Divertissement': 'cat_entertainment',
      'Restaurants': 'cat_restaurants', 'Café': 'cat_cafe',
      'Cinéma': 'cat_cinema', 'Sorties': 'cat_outings',
      // Finances
      'Finances': 'cat_finances', 'Épargne': 'cat_savings',
      'Investissements': 'cat_investments', 'Prêts': 'cat_loans',
      'Frais bancaires': 'cat_bank_fees',
      // Maison
      '🏡 Maison': 'cat_house', 'Cuisine / accessoires': 'cat_kitchen',
      'Décoration': 'cat_decoration', 'Outils / bricolage': 'cat_tools',
      // Éducation
      'Éducation': 'cat_education',
      // Factures
      'Factures': 'cat_bills',
      // Autres
      'Autre': 'cat_other', 'Autres': 'cat_other', 'Famille': 'cat_family',
      'Divers': 'cat_miscellaneous', '🎁 Divers & imprévus': 'cat_misc',
      'Imprévus': 'cat_unexpected', 'Imprévu': 'cat_unexpected',
      'Aides familiales': 'cat_family_help',
    };
    const normalized = catName.replace(/[\u{1F600}-\u{1F6FF}\s]/gu, '').trim();
    const key = map[catName] || map[normalized];
    return key ? t[key] : catName;
  };

  // Recherche dans les transactions
  const filteredTransactions = useMemo(() => {
    const q = normalizeText(query);
    if (!q) return [];
    return transactions.filter(tn => {
      const desc = normalizeText(tn.description || '');
      const cat = normalizeText(tn.category || '');
      const catTrans = normalizeText(getCategoryTranslatedName(tn.category || ''));
      const amt = normalizeText(String(tn.amount || ''));
      const date = normalizeText(new Date(tn.date).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'fr-FR'));
      return desc.includes(q) || cat.includes(q) || catTrans.includes(q) || amt.includes(q) || date.includes(q);
    });
  }, [query, transactions, language]);

  // Recherche dans les charges annuelles
  const filteredCharges = useMemo(() => {
    const q = normalizeText(query);
    if (!q) return [];
    return charges.filter(charge => {
      const name = normalizeText(charge.name || '');
      const cat = normalizeText(charge.category || '');
      const catTrans = normalizeText(getCategoryTranslatedName(charge.category || ''));
      const amt = normalizeText(String(charge.amount || ''));
      return name.includes(q) || cat.includes(q) || catTrans.includes(q) || amt.includes(q);
    });
  }, [query, charges]);

  // Recherche dans les catégories
  const filteredCategories = useMemo(() => {
    const q = normalizeText(query);
    if (!q) return [];
    return categories.filter(cat => {
      const name = normalizeText(cat.name || '');
      const nameTrans = normalizeText(getCategoryTranslatedName(cat.name || ''));
      const type = normalizeText(cat.type || '');
      return name.includes(q) || nameTrans.includes(q) || type.includes(q);
    });
  }, [query, categories]);

  // Résultats filtrés selon le filtre actif
  const displayResults = useMemo(() => {
    switch (activeFilter) {
      case 'transactions':
        return filteredTransactions.map(t => ({ ...t, resultType: 'transaction' as const }));
      case 'charges':
        return filteredCharges.map(c => ({ ...c, resultType: 'charge' as const }));
      case 'categories':
        return filteredCategories.map(c => ({ ...c, resultType: 'category' as const }));
      default:
        return [
          ...filteredTransactions.map(t => ({ ...t, resultType: 'transaction' as const })),
          ...filteredCharges.map(c => ({ ...c, resultType: 'charge' as const })),
          ...filteredCategories.map(c => ({ ...c, resultType: 'category' as const })),
        ];
    }
  }, [activeFilter, filteredTransactions, filteredCharges, filteredCategories]);

  const handleResultPress = (item: any) => {
    if (item.resultType === 'transaction') {
      (navigation as any).navigate('TransactionDetail', { transactionId: item.id });
    } else if (item.resultType === 'charge') {
      (navigation as any).navigate('EditAnnualCharge', { chargeId: item.id });
    } else if (item.resultType === 'category') {
      // Naviguer vers les transactions de cette catégorie
      (navigation as any).navigate('Transactions', { categoryFilter: item.id });
    }
  };

  const getResultIcon = (resultType: string) => {
    switch (resultType) {
      case 'transaction':
        return 'swap-horizontal';
      case 'charge':
        return 'calendar';
      case 'category':
        return 'pricetags';
      default:
        return 'search';
    }
  };

  const getResultColor = (resultType: string) => {
    switch (resultType) {
      case 'transaction':
        return colors.primary[500];
      case 'charge':
        return '#FF6B35';
      case 'category':
        return '#8B5CF6';
      default:
        return colors.text.tertiary;
    }
  };

  const filters: { key: SearchFilter; label: string; icon: string }[] = [
    { key: 'all', label: t.all || 'Tout', icon: 'apps' },
    { key: 'transactions', label: t.transactions || 'Transactions', icon: 'swap-horizontal' },
    { key: 'charges', label: t.annualCharges || 'Charges', icon: 'calendar' },
    { key: 'categories', label: t.categories || 'Catégories', icon: 'pricetags' },
  ];

  const renderResult = ({ item }: { item: any }) => {
    const resultColor = getResultColor(item.resultType);
    const resultIcon = getResultIcon(item.resultType);

    return (
      <TouchableOpacity 
        style={[styles.resultItem, { backgroundColor: colors.background.card }]}
        onPress={() => handleResultPress(item)}
        activeOpacity={0.7}
      >
        <View style={[styles.resultIcon, { backgroundColor: resultColor + '20' }]}>
          <Ionicons name={resultIcon as any} size={20} color={resultColor} />
        </View>
        <View style={styles.resultContent}>
          <Text style={[styles.resultTitle, { color: colors.text.primary }]} numberOfLines={1}>
            {item.resultType === 'category' 
              ? getCategoryTranslatedName(item.name) || item.description || t.noName || 'Sans nom'
              : item.name || item.description || t.noName || 'Sans nom'
            }
          </Text>
          <Text style={[styles.resultSubtitle, { color: colors.text.secondary }]} numberOfLines={1}>
            {item.resultType === 'transaction' 
              ? `${getCategoryTranslatedName(item.category)} • ${new Date(item.date).toLocaleDateString(language === 'ar' ? 'ar-SA' : language === 'en' ? 'en-US' : 'fr-FR')}`
              : item.resultType === 'charge'
              ? `${getCategoryTranslatedName(item.category)} • ${t.dueDate}: ${new Date(item.dueDate).toLocaleDateString(language === 'ar' ? 'ar-SA' : language === 'en' ? 'en-US' : 'fr-FR')}`
              : `${t.category} ${item.type === 'expense' ? t.expense : t.income}`
            }
          </Text>
        </View>
        {(item.amount || item.amount === 0) && (
          <Text style={[styles.resultAmount, { 
            color: item.type === 'expense' || item.resultType === 'charge' 
              ? colors.semantic.error 
              : colors.semantic.success 
          }]}>
            {formatAmount(item.amount)}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView>
      <View style={[styles.container, { backgroundColor: colors.background.primary }]}> 
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text.primary }]}>{t.search || 'Recherche'}</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={[styles.searchBox, { 
            backgroundColor: colors.background.card,
            borderColor: query ? colors.primary[500] : colors.border.primary,
            borderWidth: query ? 2 : 1,
          }]}> 
            <Ionicons name="search" size={22} color={query ? colors.primary[500] : colors.text.tertiary} />
            <TextInput
              placeholder={t.searchPlaceholder || 'Rechercher transactions, charges, catégories...'}
              placeholderTextColor={colors.text.tertiary}
              style={[styles.input, { color: colors.text.primary }]}
              value={query}
              onChangeText={setQuery}
              autoFocus
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')}>
                <Ionicons name="close-circle" size={20} color={colors.text.tertiary} />
              </TouchableOpacity>
            )}
          </View>

          {/* Filters */}
          {query.length > 0 && (
            <View style={styles.filtersContainer}>
              {filters.map((filter) => (
                <TouchableOpacity
                  key={filter.key}
                  style={[
                    styles.filterChip,
                    { 
                      backgroundColor: activeFilter === filter.key 
                        ? colors.primary[500] 
                        : colors.background.secondary 
                    }
                  ]}
                  onPress={() => setActiveFilter(filter.key)}
                >
                  <Ionicons 
                    name={filter.icon as any} 
                    size={16} 
                    color={activeFilter === filter.key ? '#FFF' : colors.text.secondary} 
                  />
                  <Text style={[
                    styles.filterText,
                    { color: activeFilter === filter.key ? '#FFF' : colors.text.secondary }
                  ]}>
                    {filter.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Results or Empty State */}
        <View style={styles.body}>
          {!query ? (
            <View style={styles.emptyState}>
              <View style={[styles.emptyIcon, { backgroundColor: colors.background.card }]}>
                <Ionicons name="search" size={56} color={colors.text.disabled} />
              </View>
              <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>
                {t.smartSearch || 'Recherche intelligente'}
              </Text>
              <Text style={[styles.emptySubtitle, { color: colors.text.secondary }]}>
                {t.searchHint || 'Trouvez rapidement vos transactions, charges annuelles et catégories'}
              </Text>
              
              {/* Quick Actions */}
              <View style={styles.quickActions}>
                <TouchableOpacity 
                  style={[styles.quickAction, { backgroundColor: colors.background.card }]}
                  onPress={() => setQuery('Alimentation')}
                >
                  <Ionicons name="fast-food" size={24} color={colors.primary[500]} />
                  <Text style={[styles.quickActionText, { color: colors.text.primary }]}>
                    {t.cat_food || 'Alimentation'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.quickAction, { backgroundColor: colors.background.card }]}
                  onPress={() => setQuery(t.cat_salary || 'Salaire')}
                >
                  <Ionicons name="cash" size={24} color="#00B894" />
                  <Text style={[styles.quickActionText, { color: colors.text.primary }]}>
                    {t.cat_salary || 'Salaire'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : displayResults.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={[styles.emptyIcon, { backgroundColor: colors.background.card }]}>
                <Ionicons name="search-outline" size={56} color={colors.text.disabled} />
              </View>
              <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>
                {t.noResults || 'Aucun résultat'}
              </Text>
              <Text style={[styles.emptySubtitle, { color: colors.text.secondary }]}>
                {t.tryDifferentSearch || 'Essayez avec d\'autres mots-clés'}
              </Text>
            </View>
          ) : (
            <>
              <Text style={[styles.resultsCount, { color: colors.text.secondary }]}>
                {displayResults.length} {displayResults.length === 1 ? (t.result || 'résultat') : (t.results || 'résultats')}
              </Text>
              <FlatList
                data={displayResults}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                renderItem={renderResult}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.resultsList}
              />
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  header: { 
    paddingHorizontal: 20, 
    paddingVertical: 16,
  },
  title: { 
    fontSize: 28, 
    fontWeight: '700',
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  searchBox: { 
    height: 56, 
    borderRadius: 16, 
    paddingHorizontal: 16, 
    alignItems: 'center', 
    flexDirection: 'row', 
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  input: { 
    flex: 1, 
    fontSize: 16,
    fontWeight: '500',
  },
  filtersContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    flexWrap: 'wrap',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  body: { 
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
  },
  quickAction: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    minWidth: 120,
  },
  quickActionText: {
    fontSize: 13,
    fontWeight: '600',
  },
  resultsCount: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  resultsList: {
    paddingBottom: 20,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  resultIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  resultContent: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  resultSubtitle: {
    fontSize: 13,
  },
  resultAmount: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
});

export default SearchScreen;
