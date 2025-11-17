// src/screens/AnnualChargesScreen.tsx - DESIGN MODERNE ET PROFESSIONNEL
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from '../components/SafeAreaView';
import { useCurrency } from '../context/CurrencyContext';
import { useTheme } from '../context/ThemeContext';
import { useAnnualCharges } from '../hooks/useAnnualCharges';

const AnnualChargesScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const { formatAmount } = useCurrency();
  const { 
    charges,
    loading,
    getStats,
    deleteAnnualCharge,
    refreshAnnualCharges,
    payCharge,
    canPayCharge
  } = useAnnualCharges();

  const [stats, setStats] = useState({
    totalCharges: 0,
    totalAmount: 0,
    paidAmount: 0,
    pendingAmount: 0
  });

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [refreshing, setRefreshing] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  const isDark = theme === 'dark';

  // ✅ CORRECTION : Exclusion des charges islamiques
  const normalCharges = charges.filter(charge => !charge.isIslamic);

  // ✅ CORRECTION : Générer les années 2025-2023 (ordre décroissant)
  const availableYears = [2027, 2026, 2025];

  // ✅ CORRECTION : Filtrer les charges par année et exclure les islamiques
  const filteredCharges = normalCharges.filter(charge => 
    new Date(charge.dueDate).getFullYear() === selectedYear
  );

  useEffect(() => {
    loadStats();
    // Animation d'entrée
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [charges]);

  const loadStats = async () => {
    try {
      const statsData = await getStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleDeleteCharge = (chargeId: string, chargeName: string) => {
    Alert.alert(
      '🗑️ Supprimer la charge',
      `Êtes-vous sûr de vouloir supprimer "${chargeName}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAnnualCharge(chargeId);
              Alert.alert('✅ Succès', 'Charge supprimée avec succès');
            } catch (error) {
              Alert.alert('❌ Erreur', 'Impossible de supprimer la charge');
            }
          },
        },
      ]
    );
  };

  const handlePayCharge = async (chargeId: string, chargeName: string) => {
    try {
      const validation = await canPayCharge(chargeId);
      if (!validation.canPay) {
        Alert.alert('⏳ Impossible de payer', validation.reason || 'Cette charge ne peut pas être payée pour le moment');
        return;
      }

      Alert.alert(
        '💰 Payer la charge',
        `Voulez-vous payer "${chargeName}" ?`,
        [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Payer',
            onPress: async () => {
              try {
                await payCharge(chargeId);
                Alert.alert('✅ Succès', 'Charge payée avec succès');
              } catch (error: any) {
                Alert.alert('❌ Erreur', error.message || 'Impossible de payer la charge');
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error checking payment:', error);
      Alert.alert('❌ Erreur', 'Impossible de vérifier le paiement');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshAnnualCharges();
    setRefreshing(false);
  };

  const getStatusColor = (charge: any) => {
    if (charge.isPaid) return '#10B981';
    
    const dueDate = new Date(charge.dueDate);
    const today = new Date();
    
    if (dueDate < today) return '#EF4444';
    
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const dueMonth = dueDate.getMonth();
    const dueYear = dueDate.getFullYear();
    
    if (dueYear === currentYear && dueMonth === currentMonth) {
      return '#3B82F6';
    }
    
    return '#F59E0B';
  };

  const getStatusText = (charge: any) => {
    if (charge.isPaid) return 'Payé';
    
    const dueDate = new Date(charge.dueDate);
    const today = new Date();
    
    if (dueDate < today) return 'En retard';
    
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const dueMonth = dueDate.getMonth();
    const dueYear = dueDate.getFullYear();
    
    if (dueYear === currentYear && dueMonth === currentMonth) {
      return 'Ce mois';
    }
    
    return 'À venir';
  };

  const getStatusIcon = (charge: any) => {
    if (charge.isPaid) return 'checkmark-circle';
    
    const dueDate = new Date(charge.dueDate);
    const today = new Date();
    
    if (dueDate < today) return 'alert-circle';
    
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const dueMonth = dueDate.getMonth();
    const dueYear = dueDate.getFullYear();
    
    if (dueYear === currentYear && dueMonth === currentMonth) {
      return 'calendar';
    }
    
    return 'time';
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      'taxes': '🏛️',
      'insurance': '🛡️',
      'subscriptions': '📱',
      'maintenance': '🔧',
      'education': '🎓',
      'health': '🏥',
      'gifts': '🎁',
      'vacation': '🏖️',
      'other': '📦'
    };
    return icons[category] || '📋';
  };

  return (
    <SafeAreaView>
      <Animated.View style={[styles.container, isDark && styles.darkContainer, { opacity: fadeAnim }]}>
        
        {/* ✅ HEADER MODERNE AVEC ICONE AJOUT EN HAUT */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={[styles.logoContainer, { backgroundColor: isDark ? '#2C2C2E' : '#F0F5FF' }]}>
              <Ionicons name="calendar" size={24} color="#007AFF" />
            </View>
            <View>
              <Text style={[styles.title, isDark && styles.darkText]}>
                Charges Annuelles
              </Text>
              <Text style={[styles.subtitle, isDark && styles.darkSubtext]}>
                Gestion des charges récurrentes
              </Text>
            </View>
          </View>
          
          {/* ✅ ICONE AJOUT EN HAUT À DROITE */}
          <TouchableOpacity 
            style={[styles.addButton, isDark && styles.darkAddButton]}
            onPress={() => navigation.navigate('AddAnnualCharge')}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* ✅ FILTRE ANNÉES MODERNE - 2025, 2024, 2023 */}
        <View style={[styles.yearFilterContainer, isDark && styles.darkYearFilterContainer]}>
          <Text style={[styles.yearFilterLabel, isDark && styles.darkSubtext]}>
            Sélectionnez l'année
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.yearsScroll}>
            {availableYears.map(year => (
              <TouchableOpacity
                key={year}
                style={[
                  styles.yearButton,
                  selectedYear === year && styles.yearButtonSelected,
                  isDark && styles.darkYearButton
                ]}
                onPress={() => setSelectedYear(year)}
              >
                <Ionicons 
                  name="calendar-outline" 
                  size={16} 
                  color={selectedYear === year ? '#fff' : (isDark ? '#888' : '#666')} 
                />
                <Text style={[
                  styles.yearText,
                  selectedYear === year && styles.yearTextSelected,
                  isDark && styles.darkText
                ]}>
                  {year}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ✅ STATISTIQUES MODERNES EN GRID */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, isDark && styles.darkStatCard]}>
            <View style={[styles.statIconContainer, { backgroundColor: isDark ? '#1E3A8A' : '#DBEAFE' }]}>
              <Ionicons name="document-text" size={20} color="#3B82F6" />
            </View>
            <Text style={[styles.statNumber, isDark && styles.darkText]}>
              {filteredCharges.length}
            </Text>
            <Text style={[styles.statLabel, isDark && styles.darkSubtext]}>
              Charges
            </Text>
          </View>

          <View style={[styles.statCard, isDark && styles.darkStatCard]}>
            <View style={[styles.statIconContainer, { backgroundColor: isDark ? '#065F46' : '#D1FAE5' }]}>
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
            </View>
            <Text style={[styles.statNumber, isDark && styles.darkText]}>
              {formatAmount(
                filteredCharges
                  .filter(charge => charge.isPaid)
                  .reduce((sum, charge) => sum + charge.amount, 0)
              )}
            </Text>
            <Text style={[styles.statLabel, isDark && styles.darkSubtext]}>
              Payé
            </Text>
          </View>

          <View style={[styles.statCard, isDark && styles.darkStatCard]}>
            <View style={[styles.statIconContainer, { backgroundColor: isDark ? '#92400E' : '#FEF3C7' }]}>
              <Ionicons name="timer" size={20} color="#F59E0B" />
            </View>
            <Text style={[styles.statNumber, isDark && styles.darkText]}>
              {formatAmount(
                filteredCharges
                  .filter(charge => !charge.isPaid)
                  .reduce((sum, charge) => sum + charge.amount, 0)
              )}
            </Text>
            <Text style={[styles.statLabel, isDark && styles.darkSubtext]}>
              En attente
            </Text>
          </View>
        </View>

        {/* ✅ SECTION CHARGES AVEC BOUTON AJOUT */}
        <View style={styles.chargesHeader}>
          <View>
            <Text style={[styles.chargesTitle, isDark && styles.darkText]}>
              Charges {selectedYear}
            </Text>
            <Text style={[styles.chargesSubtitle, isDark && styles.darkSubtext]}>
              {filteredCharges.length} charge(s) normale(s)
            </Text>
          </View>
          <TouchableOpacity 
            style={[styles.refreshButton, isDark && styles.darkRefreshButton]}
            onPress={handleRefresh}
            disabled={refreshing}
          >
            <Ionicons 
              name="refresh" 
              size={18} 
              color={isDark ? "#fff" : "#007AFF"} 
            />
          </TouchableOpacity>
        </View>

        {/* ✅ LISTE DES CHARGES AVEC DESIGN MODERNE */}
        <ScrollView style={styles.chargesList} showsVerticalScrollIndicator={false}>
          {filteredCharges.map((charge, index) => (
            <Animated.View
              key={charge.id}
              style={[
                styles.chargeCard,
                isDark && styles.darkChargeCard,
                {
                  transform: [{
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50 * (index + 1), 0],
                    })
                  }]
                }
              ]}
            >
              {/* En-tête de la carte */}
              <View style={styles.chargeHeader}>
                <View style={styles.chargeMainInfo}>
                  <View style={styles.categoryIcon}>
                    <Text style={styles.categoryIconText}>
                      {getCategoryIcon(charge.category)}
                    </Text>
                  </View>
                  <View style={styles.chargeTextInfo}>
                    <Text style={[styles.chargeName, isDark && styles.darkText]}>
                      {charge.name}
                    </Text>
                    <Text style={[styles.chargeCategory, isDark && styles.darkSubtext]}>
                      {charge.category}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.chargeAmount, isDark && styles.darkText]}>
                  {formatAmount(charge.amount)}
                </Text>
              </View>

              {/* Détails de la charge */}
              <View style={styles.chargeDetails}>
                <View style={styles.detailItem}>
                  <Ionicons name="calendar-outline" size={14} color={isDark ? "#888" : "#666"} />
                  <Text style={[styles.detailText, isDark && styles.darkSubtext]}>
                    {new Date(charge.dueDate).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </Text>
                </View>
                
                {charge.accountId && (
                  <View style={styles.detailItem}>
                    <Ionicons name="card-outline" size={14} color={isDark ? "#888" : "#666"} />
                    <Text style={[styles.detailText, isDark && styles.darkSubtext]}>
                      {charge.autoDeduct ? 'Prélèvement auto' : 'Compte associé'}
                    </Text>
                  </View>
                )}
              </View>

              {/* Footer avec statut et actions */}
              <View style={styles.chargeFooter}>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(charge) + '20' }
                ]}>
                  <Ionicons 
                    name={getStatusIcon(charge)} 
                    size={14} 
                    color={getStatusColor(charge)} 
                  />
                  <Text style={[
                    styles.statusText,
                    { color: getStatusColor(charge) }
                  ]}>
                    {getStatusText(charge)}
                  </Text>
                </View>

                <View style={styles.actions}>
                  {!charge.isPaid && (
                    <TouchableOpacity
                      style={[styles.payButton, { backgroundColor: getStatusColor(charge) }]}
                      onPress={() => handlePayCharge(charge.id, charge.name)}
                    >
                      <Ionicons name="card" size={14} color="#fff" />
                      <Text style={styles.payButtonText}>Payer</Text>
                    </TouchableOpacity>
                  )}
                  
                  <TouchableOpacity
                    style={[styles.iconButton, isDark && styles.darkIconButton]}
                    onPress={() => navigation.navigate('EditAnnualCharge', { chargeId: charge.id })}
                  >
                    <Ionicons name="create-outline" size={16} color={isDark ? "#fff" : "#666"} />
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.iconButton, isDark && styles.darkIconButton]}
                    onPress={() => handleDeleteCharge(charge.id, charge.name)}
                  >
                    <Ionicons name="trash-outline" size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          ))}
        </ScrollView>

        {/* ✅ ÉTAT VIDE AVEC DESIGN MODERNE */}
        {filteredCharges.length === 0 && !loading && (
          <View style={styles.emptyState}>
            <View style={[styles.emptyIcon, { backgroundColor: isDark ? '#2C2C2E' : '#F8FAFC' }]}>
              <Ionicons name="document-text-outline" size={48} color={isDark ? "#555" : "#CBD5E1"} />
            </View>
            <Text style={[styles.emptyTitle, isDark && styles.darkText]}>
              Aucune charge normale
            </Text>
            <Text style={[styles.emptyDescription, isDark && styles.darkSubtext]}>
              {`Aucune charge normale pour ${selectedYear}`}
            </Text>
            <Text style={[styles.emptyHint, isDark && styles.darkSubtext]}>
              💡 Les charges islamiques sont gérées séparément
            </Text>
            <TouchableOpacity 
              style={[styles.primaryButton, styles.addFirstButton]}
              onPress={() => navigation.navigate('AddAnnualCharge')}
            >
              <Ionicons name="add" size={20} color="#fff" />
              <Text style={styles.addFirstButtonText}>Ajouter une charge</Text>
            </TouchableOpacity>
          </View>
        )}

        {loading && (
          <View style={styles.loadingState}>
            <Ionicons name="refresh" size={24} color="#007AFF" />
            <Text style={[styles.loadingText, isDark && styles.darkSubtext]}>
              Chargement des charges...
            </Text>
          </View>
        )}
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  darkContainer: {
    backgroundColor: '#000000',
  },
  
  // ✅ HEADER MODERNE
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F5FF',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  darkAddButton: {
    backgroundColor: '#0A84FF',
  },

  // ✅ FILTRE ANNÉES
  yearFilterContainer: {
    marginBottom: 24,
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  darkYearFilterContainer: {
    backgroundColor: '#1C1C1E',
    borderColor: '#2C2C2E',
  },
  yearFilterLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  yearsScroll: {
    flexGrow: 0,
  },
  yearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  darkYearButton: {
    backgroundColor: '#2C2C2E',
    borderColor: '#3C3C3E',
  },
  yearButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  yearText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  yearTextSelected: {
    color: '#FFFFFF',
  },

  // ✅ STATISTIQUES
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  darkStatCard: {
    backgroundColor: '#1C1C1E',
    borderColor: '#2C2C2E',
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },

  // ✅ SECTION CHARGES
  chargesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chargesTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  chargesSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  refreshButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  darkRefreshButton: {
    backgroundColor: '#2C2C2E',
    borderColor: '#3C3C3E',
  },

  // ✅ LISTE DES CHARGES
  chargesList: {
    flex: 1,
  },
  chargeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  darkChargeCard: {
    backgroundColor: '#1C1C1E',
    borderColor: '#2C2C2E',
  },
  chargeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  chargeMainInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    flex: 1,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryIconText: {
    fontSize: 16,
  },
  chargeTextInfo: {
    flex: 1,
  },
  chargeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  chargeCategory: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  chargeAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  chargeDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  chargeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  payButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  darkIconButton: {
    backgroundColor: '#2C2C2E',
    borderColor: '#3C3C3E',
  },

  // ✅ ÉTAT VIDE
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 20,
  },
  emptyHint: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    fontStyle: 'italic',
  },
  addFirstButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#007AFF',
  },
  addFirstButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  // ✅ CHARGEMENT
  loadingState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 12,
    fontWeight: '500',
  },

  // ✅ BOUTON PRIMAIRE
  primaryButton: {
    backgroundColor: '#007AFF',
  },

  // ✅ TEXTES DARK MODE
  darkText: {
    color: '#FFFFFF',
  },
  darkSubtext: {
    color: '#8E8E93',
  },
});

export default AnnualChargesScreen;