// src/screens/FinancialCalendarScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import {
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import { useDesignSystem } from '../context/ThemeContext';
import { useAnnualCharges } from '../hooks/useAnnualCharges';
import { useCategories } from '../hooks/useCategories';
import { useDebts } from '../hooks/useDebts';
import { useSavings } from '../hooks/useSavings';
import { useTransactions } from '../hooks/useTransactions';
import resolveCategoryLabel from '../utils/categoryResolver';


export const FinancialCalendarScreen = ({ navigation }: any) => {
  const { t } = useLanguage();
  const { colors } = useDesignSystem();
  const { formatAmount, currency } = useCurrency();
  const { transactions, refreshTransactions } = useTransactions();
  const { charges, refreshAnnualCharges } = useAnnualCharges();
  const { debts, refreshDebts } = useDebts();
  const { goals } = useSavings();
  const { categories } = useCategories();
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  // 🔍 DIAGNOSTIC : Afficher les transactions de novembre ET décembre
  useEffect(() => {
    if (transactions.length > 0) {
      // NOVEMBRE
      const novTransactions = transactions.filter(t => {
        const date = new Date(t.date);
        return date.getMonth() === 10 && date.getFullYear() === 2025; // novembre = mois 10
      });
      
      console.log('🗓️ [FinancialCalendar] Transactions de NOVEMBRE 2025:', {
        total: transactions.length,
        novembre: novTransactions.length,
        dates: [...new Set(novTransactions.map(t => t.date.split('T')[0]))].sort()
      });
      
      // Grouper novembre par date
      const byDateNov = novTransactions.reduce((acc: any, t) => {
        const dateKey = t.date.split('T')[0];
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push({ 
          desc: t.description, 
          amount: t.amount, 
          recurring: t.isRecurring,
          parentId: t.parentTransactionId 
        });
        return acc;
      }, {});
      
      console.log('📅 [FinancialCalendar] Novembre groupé par date:', byDateNov);

      // DÉCEMBRE
      const decTransactions = transactions.filter(t => {
        const date = new Date(t.date);
        return date.getMonth() === 11 && date.getFullYear() === 2025; // décembre = mois 11
      });
      
      console.log('🗓️ [FinancialCalendar] Transactions de DÉCEMBRE 2025:', {
        total: transactions.length,
        decembre: decTransactions.length,
        dates: [...new Set(decTransactions.map(t => t.date.split('T')[0]))].sort()
      });
      
      // Grouper décembre par date avec détails
      const byDateDec = decTransactions.reduce((acc: any, t) => {
        const dateKey = t.date.split('T')[0];
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push({ 
          desc: t.description, 
          amount: t.amount, 
          recurring: t.isRecurring,
          parentId: t.parentTransactionId,
          id: t.id
        });
        return acc;
      }, {});
      
      console.log('📅 [FinancialCalendar] Décembre groupé par date:', byDateDec);
      
      // Détail du 2 décembre si présent
      if (byDateDec['2025-12-02']) {
        console.log('🔍 [FinancialCalendar] DÉTAIL 2 DÉCEMBRE:', byDateDec['2025-12-02']);
      }
    }
  }, [transactions]);

  // Pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refreshTransactions(),
        refreshAnnualCharges(),
        refreshDebts()
      ]);
    } catch (error) {
      console.error('Error refreshing calendar:', error);
    }
    setRefreshing(false);
  };

  // Obtenir le premier et dernier jour du mois
  const getMonthDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    return { daysInMonth, startDayOfWeek, year, month };
  };

  // ✅ FONCTION UTILITAIRE : Formater date sans problème de timezone
  const formatDateLocal = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // ❌ SUPPRIMÉ : getRecurringTransactionsForMonth
  // Les transactions récurrentes sont automatiquement créées dans la DB par transactionRecurrenceService
  // au démarrage de l'app, donc elles apparaissent déjà dans la liste `transactions`
  // Pas besoin de générer des occurrences virtuelles ici (causait des doublons)

  // Calculer les montants par jour
  const getDayData = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const date = new Date(year, month, day);
    const dateStr = formatDateLocal(date); // ✅ CORRECTION : Utiliser le format local

    let income = 0;
    let expenses = 0;

    // ✅ LOGIQUE INTELLIGENTE : Afficher occurrences OU templates (pas les deux)
    // Pour chaque transaction template, vérifier si une occurrence existe déjà pour ce jour
    const templateIds = new Set<string>();
    
    // 1. D'abord, collecter les IDs des templates qui ont déjà une occurrence ce jour
    transactions.forEach(t => {
      const tDateStr = formatDateLocal(new Date(t.date));
      if (tDateStr === dateStr && !t.isRecurring && t.parentTransactionId) {
        // C'est une occurrence, noter son template parent
        templateIds.add(t.parentTransactionId);
      }
    });

    // 2. Ensuite, afficher les transactions
    transactions.forEach(t => {
      const tDateStr = formatDateLocal(new Date(t.date));
      if (tDateStr === dateStr) {
        // Si c'est un template ET qu'une occurrence existe déjà, l'ignorer
        if (t.isRecurring && templateIds.has(t.id)) {
          return; // Skip ce template, son occurrence sera affichée
        }
        
        // Sinon afficher (que ce soit template ou occurrence ou transaction normale)
        if (t.type === 'income') {
          income += t.amount;
        } else if (t.type === 'expense') {
          expenses += Math.abs(t.amount);
        }
      }
    });

    // 🔮 APERÇU FUTUR : Afficher les templates récurrents dans les mois futurs pour planification
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const viewingMonthStart = new Date(year, month, 1);
    
    if (viewingMonthStart > currentMonthStart) {
      // On regarde un mois futur, afficher les templates comme aperçu
      transactions.forEach(t => {
        if (t.isRecurring && t.recurrenceType === 'monthly') {
          // Vérifier si ce template devrait apparaître ce jour
          const templateDate = new Date(t.date);
          const templateDay = templateDate.getDate();
          
          if (templateDay === day) {
            // Ce template récurrent tombe ce jour dans le mois futur
            if (t.type === 'income') {
              income += t.amount;
            } else if (t.type === 'expense') {
              expenses += Math.abs(t.amount);
            }
          }
        }
      });
    }

    // ❌ SUPPRIMÉ : Les occurrences récurrentes virtuelles (double comptage)
    // Les transactions récurrentes sont déjà créées dans la DB par transactionRecurrenceService
    // Donc elles sont déjà dans la liste `transactions` ci-dessus

    // Charges annuelles
    charges.forEach(c => {
      const cDateStr = formatDateLocal(new Date(c.dueDate)); // ✅ CORRECTION : Format local
      if (cDateStr === dateStr && !c.isPaid) {
        expenses += c.amount;
      }
    });

    // Dettes (échéances)
    debts.forEach(d => {
      if (d.nextDueDate) {
        const dDateStr = formatDateLocal(new Date(d.nextDueDate)); // ✅ CORRECTION : Format local
        if (dDateStr === dateStr && d.status === 'active') {
          // Prendre le minimum entre la mensualité et le montant restant
          const paymentAmount = Math.min(d.monthlyPayment || 0, d.currentAmount);
          expenses += paymentAmount;
        }
      }
    });

    const netAmount = income - expenses;
    return { income, expenses, netAmount };
  };

  // Naviguer entre les mois
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(currentMonth.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentMonth(newDate);
  };

  // Fonction pour obtenir le nom complet de la catégorie (parent + sous-catégorie)
  const getCategoryName = (categoryId: string, subCategoryId?: string) => {
    const resolved = resolveCategoryLabel(subCategoryId || categoryId, categories);
    if (resolved.parent) {
      return `${resolved.parent} > ${resolved.child}`;
    }
    return resolved.child;
  };

  // Obtenir toutes les opérations du jour sélectionné (transactions + récurrentes + charges + dettes)
  const selectedDayTransactions = useMemo(() => {
    const dateStr = formatDateLocal(selectedDate); // ✅ CORRECTION : Format local
    const items: any[] = [];

    // ✅ LOGIQUE INTELLIGENTE : Afficher occurrences OU templates (pas les deux)
    const templateIds = new Set<string>();
    
    // 1. D'abord, identifier les templates qui ont déjà une occurrence ce jour
    transactions.forEach(t => {
      const tDateStr = formatDateLocal(new Date(t.date));
      if (tDateStr === dateStr && !t.isRecurring && t.parentTransactionId) {
        templateIds.add(t.parentTransactionId);
      }
    });

    // 2. Ensuite, ajouter les transactions
    transactions.forEach(t => {
      const tDateStr = formatDateLocal(new Date(t.date));
      if (tDateStr === dateStr) {
        // Si c'est un template ET qu'une occurrence existe déjà, l'ignorer
        if (t.isRecurring && templateIds.has(t.id)) {
          return; // Skip ce template
        }
        
        // Sinon afficher (template, occurrence ou transaction normale)
        items.push({
          id: t.id,
          type: t.type,
          description: t.description,
          amount: t.amount,
          category: getCategoryName(t.category, t.subCategory),
          date: t.date,
          icon: 'wallet',
          source: 'transaction',
          isRecurring: t.isRecurring, // Garder l'info pour savoir si c'est un template
          isPreview: false // Transaction réelle
        });
      }
    });

    // 🔮 APERÇU FUTUR : Afficher les templates récurrents dans les mois futurs pour planification
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const selectedMonthStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    
    if (selectedMonthStart > currentMonthStart) {
      // On regarde un mois futur, afficher les templates comme aperçu
      const selectedDay = selectedDate.getDate();
      
      transactions.forEach(t => {
        if (t.isRecurring && t.recurrenceType === 'monthly') {
          // Vérifier si ce template devrait apparaître ce jour
          const templateDate = new Date(t.date);
          const templateDay = templateDate.getDate();
          
          if (templateDay === selectedDay) {
            // Ce template récurrent tombe ce jour dans le mois futur
            items.push({
              id: `preview_${t.id}`,
              type: t.type,
              description: t.description,
              amount: t.amount,
              category: getCategoryName(t.category, t.subCategory),
              date: dateStr,
              icon: 'time-outline',
              source: 'transaction',
              isRecurring: true,
              isPreview: true // Marqueur pour affichage différent
            });
          }
        }
      });
    }

    // ❌ SUPPRIMÉ : Transactions récurrentes virtuelles (causaient doublons)
    // Les occurrences sont déjà dans la liste `transactions` ci-dessus

    // 2. Charges annuelles
    charges.forEach(c => {
      const cDateStr = formatDateLocal(new Date(c.dueDate)); // ✅ CORRECTION : Format local
      if (cDateStr === dateStr && !c.isPaid) {
        items.push({
          id: c.id,
          type: 'expense',
          description: c.name,
          amount: c.amount,
          category: c.category ? getCategoryName(c.category) : 'Charges Annuelles',
          date: c.dueDate,
          icon: 'calendar',
          source: 'charge'
        });
      }
    });

    // 3. Échéances de dettes
    debts.forEach(d => {
      if (d.nextDueDate) {
        const dDateStr = formatDateLocal(new Date(d.nextDueDate)); // ✅ CORRECTION : Format local
        if (dDateStr === dateStr && d.status === 'active') {
          // Prendre le minimum entre la mensualité et le montant restant
          const paymentAmount = Math.min(d.monthlyPayment || 0, d.currentAmount);
          items.push({
            id: d.id,
            type: 'expense',
            description: `${d.name} (Reste: ${formatAmount(d.currentAmount)})`,
            amount: paymentAmount,
            category: d.category ? getCategoryName(d.category) : 'Remboursement Dette',
            date: d.nextDueDate,
            icon: 'trending-down',
            source: 'debt'
          });
        }
      }
    });

    // Trier par date/heure
    return items.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [transactions, charges, debts, selectedDate, categories]);

  // 🔍 DIAGNOSTIC : Log quand selectedDayTransactions change
  useEffect(() => {
    const dateStr = formatDateLocal(selectedDate);
    console.log('📅 [FinancialCalendar] selectedDayTransactions updated:', {
      date: dateStr,
      count: selectedDayTransactions.length,
      items: selectedDayTransactions.map(i => ({ desc: i.description, amount: i.amount, source: i.source }))
    });
  }, [selectedDayTransactions, selectedDate]);

  // ✅ NOUVEAU : Calculer les statistiques du mois affiché (SEULEMENT les transactions réelles)
  const monthStats = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    let totalIncome = 0;
    let totalExpenses = 0;

    // ✅ Compter UNIQUEMENT les transactions réelles du mois (comme dans TransactionsScreen)
    // Ne PAS compter les charges annuelles ou dettes (ce sont des prévisions, pas des transactions réalisées)
    transactions.forEach(t => {
      const tDate = new Date(t.date);
      if (tDate.getFullYear() === year && tDate.getMonth() === month) {
        if (t.type === 'income') {
          totalIncome += t.amount;
        } else if (t.type === 'expense') {
          totalExpenses += Math.abs(t.amount);
        }
      }
    });

    const balance = totalIncome - totalExpenses;

    return {
      income: totalIncome,
      expenses: totalExpenses,
      balance
    };
  }, [currentMonth, transactions]);

  const { daysInMonth, startDayOfWeek, year, month } = getMonthDays();
  const today = new Date();
  const isToday = (day: number) => {
    return today.getDate() === day && 
           today.getMonth() === month && 
           today.getFullYear() === year;
  };

  const isSelectedDay = (day: number) => {
    return selectedDate.getDate() === day && 
           selectedDate.getMonth() === month && 
           selectedDate.getFullYear() === year;
  };

  const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
                      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  const dayNames = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background.card }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
          Calendrier des Dépenses
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary[500] || '#007AFF'}
          />
        }
      >
        {/* Section Statistiques du mois */}
        <View style={[styles.statsCard, { backgroundColor: colors.background.card }]}>
          <Text style={[styles.statsTitle, { color: colors.text.secondary }]}>
            Solde du mois
          </Text>
          <Text style={[
            styles.statsBalance, 
            { color: monthStats.balance >= 0 ? '#34C759' : '#FF3B30' }
          ]}>
            {formatAmount(monthStats.balance)}
          </Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: '#34C75915' }]}>
                <Ionicons name="arrow-down" size={20} color="#34C759" />
              </View>
              <View style={styles.statInfo}>
                <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Revenus</Text>
                <Text style={[styles.statValue, { color: colors.text.primary }]}>
                  {formatAmount(monthStats.income)}
                </Text>
              </View>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: '#FF3B3015' }]}>
                <Ionicons name="arrow-up" size={20} color="#FF3B30" />
              </View>
              <View style={styles.statInfo}>
                <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Dépenses</Text>
                <Text style={[styles.statValue, { color: colors.text.primary }]}>
                  {formatAmount(monthStats.expenses)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Calendrier */}
        <View style={[styles.calendarCard, { backgroundColor: colors.background.card }]}>
          {/* Mois et navigation */}
          <View style={styles.monthHeader}>
            <Text style={[styles.monthTitle, { color: colors.text.primary }]}>
              {monthNames[month]} {year}
            </Text>
            <View style={styles.monthNavigation}>
              <TouchableOpacity 
                onPress={() => navigateMonth('prev')}
                style={[styles.navButton, { backgroundColor: colors.background.secondary }]}
              >
                <Ionicons name="chevron-back" size={20} color={colors.text.primary} />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => navigateMonth('next')}
                style={[styles.navButton, { backgroundColor: colors.background.secondary }]}
              >
                <Ionicons name="chevron-forward" size={20} color={colors.text.primary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Jours de la semaine */}
          <View style={styles.weekDaysRow}>
            {dayNames.map((day, index) => (
              <View key={index} style={styles.weekDayCell}>
                <Text style={[styles.weekDayText, { color: colors.text.secondary }]}>
                  {day}
                </Text>
              </View>
            ))}
          </View>

          {/* Grille du calendrier */}
          <View style={styles.calendarGrid}>
            {/* Cellules vides avant le premier jour */}
            {Array.from({ length: startDayOfWeek === 0 ? 6 : startDayOfWeek - 1 }).map((_, i) => (
              <View key={`empty-${i}`} style={styles.dayCell} />
            ))}

            {/* Jours du mois */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayData = getDayData(day);
              const hasData = dayData.netAmount !== 0;

              return (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayCell,
                    isSelectedDay(day) && { backgroundColor: colors.primary[500] },
                  ]}
                  onPress={() => setSelectedDate(new Date(year, month, day))}
                >
                  <Text style={[
                    styles.dayNumber,
                    { color: colors.text.primary },
                    isToday(day) && styles.todayText,
                    isSelectedDay(day) && { color: '#fff' },
                  ]}>
                    {day}
                  </Text>
                  {hasData && (
                    <Text style={[
                      styles.dayAmount,
                      dayData.netAmount < 0 ? { color: '#FF3B30' } : { color: '#34C759' },
                      isSelectedDay(day) && { color: '#fff' },
                    ]}>
                      {dayData.netAmount > 0 ? '+' : ''}{Math.round(dayData.netAmount)}
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Transactions du jour sélectionné */}
        <View style={styles.transactionsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Transactions du {selectedDate.getDate()} {monthNames[selectedDate.getMonth()].toLowerCase()}
          </Text>

          {selectedDayTransactions.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: colors.background.card }]}>
              <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
                Aucune transaction ce jour
              </Text>
            </View>
          ) : (
            selectedDayTransactions.map(item => (
              <View 
                key={`${item.source}-${item.id}`} 
                style={[
                  styles.transactionCard, 
                  { backgroundColor: colors.background.card },
                  item.isPreview && { opacity: 0.6, borderLeftWidth: 3, borderLeftColor: colors.primary[500] }
                ]}
              >
                <View style={styles.transactionIcon}>
                  <Ionicons 
                    name={item.icon as any} 
                    size={24} 
                    color={item.type === 'expense' ? '#FF3B30' : '#34C759'} 
                  />
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={[styles.transactionTitle, { color: colors.text.primary }]}>
                    {item.description}
                    {item.isPreview && <Text style={{ fontSize: 12, color: colors.primary[500] }}> 🔮 Prévu</Text>}
                  </Text>
                  <Text style={[styles.transactionSubtitle, { color: colors.text.secondary }]}>
                    {item.category} • {new Date(item.date).toLocaleTimeString('fr-FR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </Text>
                </View>
                <Text style={[
                  styles.transactionAmount,
                  { color: item.type === 'expense' ? '#FF3B30' : '#34C759' }
                ]}>
                  {formatAmount(item.amount)}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  statsCard: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 8,
  },
  statsBalance: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  statInfo: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: 44,
    backgroundColor: '#E5E5EA',
    marginHorizontal: 16,
  },
  calendarCard: {
    margin: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  monthNavigation: {
    flexDirection: 'row',
    gap: 8,
  },
  navButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekDaysRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  weekDayCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: '600',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  todayText: {
    fontWeight: 'bold',
  },
  dayAmount: {
    fontSize: 11,
    fontWeight: '600',
  },
  transactionsSection: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  emptyCard: {
    padding: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 2,
  },
  transactionSubtitle: {
    fontSize: 13,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FinancialCalendarScreen;