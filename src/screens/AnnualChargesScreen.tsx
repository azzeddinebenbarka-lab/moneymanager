// src/screens/AnnualChargesScreen.tsx - VERSION COMPLÈTEMENT CORRIGÉE
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Alert,
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

  const isDark = theme === 'dark';

  // ✅ CORRECTION 1 : Exclusion des charges islamiques
  const normalCharges = charges.filter(charge => !charge.isIslamic);

  // ✅ CORRECTION 2 : Générer les années de 2020 à 2030
  const currentYear = new Date().getFullYear();
  const availableYears = Array.from(
    { length: 11 }, 
    (_, i) => currentYear - 5 + i
  ).filter(year => year >= 2020 && year <= 2030).sort((a, b) => b - a);

  // ✅ CORRECTION : Filtrer les charges par année et exclure les islamiques
  const filteredCharges = normalCharges.filter(charge => 
    new Date(charge.dueDate).getFullYear() === selectedYear
  );

  useEffect(() => {
    loadStats();
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
      'Supprimer la charge',
      `Êtes-vous sûr de vouloir supprimer "${chargeName}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAnnualCharge(chargeId);
              Alert.alert('Succès', 'Charge supprimée avec succès');
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de supprimer la charge');
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
        Alert.alert('Impossible de payer', validation.reason || 'Cette charge ne peut pas être payée pour le moment');
        return;
      }

      Alert.alert(
        'Payer la charge',
        `Voulez-vous payer "${chargeName}" ?`,
        [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Payer',
            onPress: async () => {
              try {
                await payCharge(chargeId);
                Alert.alert('Succès', 'Charge payée avec succès');
              } catch (error: any) {
                Alert.alert('Erreur', error.message || 'Impossible de payer la charge');
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error checking payment:', error);
      Alert.alert('Erreur', 'Impossible de vérifier le paiement');
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

  return (
    <SafeAreaView>
      <View style={[styles.container, isDark && styles.darkContainer]}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, isDark && styles.darkText]}>
              Charges Annuelles
            </Text>
            <Text style={[styles.subtitle, isDark && styles.darkSubtext]}>
              Gestion de vos charges récurrentes normales
            </Text>
            <Text style={[styles.infoText, isDark && styles.darkSubtext]}>
              ✅ Les charges islamiques sont gérées séparément
            </Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={[styles.iconButton, isDark && styles.darkIconButton]}
              onPress={handleRefresh}
              disabled={refreshing}
            >
              <Ionicons 
                name="refresh" 
                size={20} 
                color={isDark ? "#fff" : "#007AFF"} 
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.iconButton, styles.primaryButton]}
              onPress={() => navigation.navigate('AddAnnualCharge')}
            >
              <Ionicons name="add" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ✅ CORRECTION : Filtre par année avec toutes les années disponibles */}
        <View style={[styles.yearFilter, isDark && styles.darkYearFilter]}>
          <Text style={[styles.yearFilterLabel, isDark && styles.darkSubtext]}>
            Année: {selectedYear}
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

        {/* Cartes de statistiques */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, isDark && styles.darkStatCard]}>
            <Ionicons name="document-text" size={24} color="#007AFF" />
            <Text style={[styles.statNumber, isDark && styles.darkText]}>
              {filteredCharges.length}
            </Text>
            <Text style={[styles.statLabel, isDark && styles.darkSubtext]}>
              Charges Normales
            </Text>
          </View>

          <View style={[styles.statCard, isDark && styles.darkStatCard]}>
            <Ionicons name="cash" size={24} color="#10B981" />
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
            <Ionicons name="timer" size={24} color="#F59E0B" />
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

        {/* ✅ CORRECTION : Indicateur de séparation */}
        <View style={[styles.separator, isDark && styles.darkSeparator]}>
          <View style={[styles.separatorLine, isDark && styles.darkSeparatorLine]} />
          <Text style={[styles.separatorText, isDark && styles.darkSubtext]}>
            Charges Normales - {selectedYear}
          </Text>
          <View style={[styles.separatorLine, isDark && styles.darkSeparatorLine]} />
        </View>

        {/* Liste des charges */}
        <ScrollView style={styles.chargesList} showsVerticalScrollIndicator={false}>
          {filteredCharges.map((charge) => (
            <View
              key={charge.id}
              style={[styles.chargeCard, isDark && styles.darkChargeCard]}
            >
              <View style={styles.chargeContent}>
                <View style={styles.chargeHeader}>
                  <View style={styles.chargeInfo}>
                    <Text style={[styles.chargeName, isDark && styles.darkText]}>
                      {charge.name}
                    </Text>
                    <Text style={[styles.chargeCategory, isDark && styles.darkSubtext]}>
                      {charge.category}
                    </Text>
                  </View>
                  <Text style={[styles.chargeAmount, isDark && styles.darkText]}>
                    {formatAmount(charge.amount)}
                  </Text>
                </View>

                <View style={styles.chargeDetails}>
                  <View style={styles.detailRow}>
                    <Ionicons name="calendar" size={14} color={isDark ? "#888" : "#666"} />
                    <Text style={[styles.detailText, isDark && styles.darkSubtext]}>
                      {new Date(charge.dueDate).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </Text>
                  </View>
                  
                  {charge.accountId && (
                    <View style={styles.detailRow}>
                      <Ionicons name="card" size={14} color={isDark ? "#888" : "#666"} />
                      <Text style={[styles.detailText, isDark && styles.darkSubtext]}>
                        Compte associé {charge.autoDeduct && '(Auto)'}
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.chargeFooter}>
                  <View style={styles.statusContainer}>
                    <Ionicons 
                      name={getStatusIcon(charge)} 
                      size={16} 
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
                        style={[styles.actionButton, { backgroundColor: getStatusColor(charge) }]}
                        onPress={() => handlePayCharge(charge.id, charge.name)}
                      >
                        <Ionicons name="card" size={16} color="#fff" />
                        <Text style={styles.actionButtonText}>Payer</Text>
                      </TouchableOpacity>
                    )}
                    
                    <TouchableOpacity
                      style={[styles.actionButton, styles.editButton, isDark && styles.darkEditButton]}
                      onPress={() => navigation.navigate('EditAnnualCharge', { chargeId: charge.id })}
                    >
                      <Ionicons name="create-outline" size={16} color={isDark ? "#fff" : "#666"} />
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[styles.actionButton, styles.deleteButton]}
                      onPress={() => handleDeleteCharge(charge.id, charge.name)}
                    >
                      <Ionicons name="trash-outline" size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        {filteredCharges.length === 0 && !loading && (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={64} color={isDark ? "#444" : "#ccc"} />
            <Text style={[styles.emptyTitle, isDark && styles.darkText]}>
              Aucune charge normale
            </Text>
            <Text style={[styles.emptyDescription, isDark && styles.darkSubtext]}>
              {availableYears.length > 0 
                ? `Aucune charge normale pour ${selectedYear}`
                : 'Commencez par ajouter votre première charge annuelle normale'
              }
            </Text>
            <Text style={[styles.emptyHint, isDark && styles.darkSubtext]}>
              💡 Les charges islamiques sont gérées dans l'écran dédié
            </Text>
            <TouchableOpacity 
              style={[styles.primaryButton, styles.addButton]}
              onPress={() => navigation.navigate('AddAnnualCharge')}
            >
              <Ionicons name="add" size={20} color="#fff" />
              <Text style={styles.addButtonText}>Nouvelle charge normale</Text>
            </TouchableOpacity>
          </View>
        )}

        {loading && (
          <View style={styles.loadingState}>
            <Ionicons name="refresh" size={24} color="#007AFF" />
            <Text style={[styles.loadingText, isDark && styles.darkSubtext]}>
              Chargement...
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  darkContainer: {
    backgroundColor: '#1c1c1e',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  darkIconButton: {
    backgroundColor: '#2c2c2e',
    borderColor: '#444',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  yearFilter: {
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  darkYearFilter: {
    backgroundColor: '#2c2c2e',
    borderColor: '#444',
  },
  yearFilterLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  yearsScroll: {
    flexGrow: 0,
  },
  yearButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    marginRight: 8,
  },
  darkYearButton: {
    backgroundColor: '#38383a',
    borderColor: '#555',
  },
  yearButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  yearText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  yearTextSelected: {
    color: '#fff',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  darkStatCard: {
    backgroundColor: '#2c2c2e',
    borderColor: '#444',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  darkSeparator: {
    // Pas de changement spécifique pour le dark mode
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e5e5',
  },
  darkSeparatorLine: {
    backgroundColor: '#444',
  },
  separatorText: {
    paddingHorizontal: 12,
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  chargesList: {
    flex: 1,
  },
  chargeCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    overflow: 'hidden',
  },
  darkChargeCard: {
    backgroundColor: '#2c2c2e',
    borderColor: '#444',
  },
  chargeContent: {
    padding: 16,
  },
  chargeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  chargeInfo: {
    flex: 1,
  },
  chargeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  chargeCategory: {
    fontSize: 14,
    color: '#666',
  },
  chargeAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  chargeDetails: {
    gap: 6,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: '#666',
  },
  chargeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  editButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  darkEditButton: {
    backgroundColor: '#38383a',
    borderColor: '#555',
  },
  deleteButton: {
    backgroundColor: 'transparent',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 20,
  },
  emptyHint: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    fontStyle: 'italic',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
    marginTop: 12,
  },
  darkText: {
    color: '#fff',
  },
  darkSubtext: {
    color: '#888',
  },
});

export default AnnualChargesScreen;