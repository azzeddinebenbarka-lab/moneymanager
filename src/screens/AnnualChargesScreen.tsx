// src/screens/AnnualChargesScreen.tsx - VERSION DÉFINITIVE CORRIGÉE
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
import { useCurrency } from '../context/CurrencyContext';
import { useTheme } from '../context/ThemeContext';
import { useAnnualCharges } from '../hooks/useAnnualCharges';
import { useIslamicCharges } from '../hooks/useIslamicCharges';

const AnnualChargesScreen = ({ navigation }: any) => { 
  const { theme } = useTheme();
  const { formatAmount } = useCurrency();
  const { 
    annualCharges, 
    isLoading, 
    error, 
    updateAnnualCharge,
    deleteAnnualCharge,
    refreshAnnualCharges 
  } = useAnnualCharges();

  const { settings: islamicSettings } = useIslamicCharges();
  
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending' | 'upcoming' | 'overdue' | 'islamic'>('all');
  
  const isDark = theme === 'dark';

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshAnnualCharges();
    setRefreshing(false);
  };

  const handleAddCharge = () => {
    navigation.navigate('AddAnnualCharge');
  };

  const handleIslamicCharges = () => {
    if (islamicSettings.isEnabled) {
      navigation.navigate('IslamicCharges');
    } else {
      Alert.alert(
        'Charges Islamiques',
        'La fonctionnalité charges islamiques est désactivée. Activez-la dans les paramètres pour gérer les charges liées aux fêtes musulmanes.',
        [
          { text: 'Annuler', style: 'cancel' },
          { 
            text: 'Paramètres', 
            onPress: () => navigation.navigate('Settings')
          }
        ]
      );
    }
  };

  const handleEditCharge = (chargeId: string) => {
    navigation.navigate('EditAnnualCharge', { 
      chargeId: chargeId,
      mode: 'edit'
    });
  };

  const handleDeleteCharge = (charge: any) => {
    Alert.alert(
      'Supprimer la charge',
      `Êtes-vous sûr de vouloir supprimer "${charge.name}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Supprimer', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAnnualCharge(charge.id);
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de supprimer la charge');
            }
          }
        },
      ]
    );
  };

  const handleLongPressCharge = (charge: any) => {
    Alert.alert(
      charge.name,
      `Que voulez-vous faire avec cette charge ?\n\nMontant: ${formatAmount(charge.amount)}\nDate: ${formatDate(charge.dueDate)}`,
      [
        { 
          text: 'Modifier', 
          onPress: () => handleEditCharge(charge.id) 
        },
        { 
          text: 'Marquer comme ' + (charge.isPaid ? 'non payée' : 'payée'), 
          onPress: () => handleTogglePaid(charge)
        },
        { 
          text: 'Supprimer', 
          style: 'destructive',
          onPress: () => handleDeleteCharge(charge)
        },
        { text: 'Annuler', style: 'cancel' }
      ]
    );
  };

  const handleTogglePaid = async (charge: any) => {
    try {
      // ✅ CORRECTION : Utilisation correcte de isPaid
      await updateAnnualCharge(charge.id, { 
        isPaid: !charge.isPaid,
        paidDate: !charge.isPaid ? new Date() : undefined
      });
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de modifier le statut de paiement');
    }
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getDaysUntilDue = (dueDate: Date | string): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
    due.setHours(0, 0, 0, 0);
    const timeDiff = due.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const getChargeStatus = (charge: any) => {
    // ✅ CORRECTION : Utilisation correcte de isPaid
    if (charge.isPaid) return 'paid';
    
    const daysUntilDue = getDaysUntilDue(charge.dueDate);
    if (daysUntilDue < 0) return 'overdue';
    if (daysUntilDue <= 30) return 'upcoming';
    return 'pending';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return '#34C759';
      case 'overdue': return '#FF3B30';
      case 'upcoming': return '#FF9500';
      default: return '#007AFF';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Payée';
      case 'overdue': return 'En retard';
      case 'upcoming': return 'À venir';
      default: return 'En attente';
    }
  };

  // Statistiques calculées
  const stats = {
    totalCharges: annualCharges.length,
    pendingAmount: annualCharges
      // ✅ CORRECTION : Utilisation correcte de isPaid
      .filter(charge => !charge.isPaid)
      .reduce((total, charge) => total + charge.amount, 0),
    overdueCharges: annualCharges.filter(charge => {
      const daysUntilDue = getDaysUntilDue(charge.dueDate);
      // ✅ CORRECTION : Utilisation correcte de isPaid
      return !charge.isPaid && daysUntilDue < 0;
    }).length,
    // ✅ CORRECTION : Utilisation correcte de isPaid
    paidCharges: annualCharges.filter(charge => charge.isPaid).length,
    islamicCharges: annualCharges.filter(charge => charge.isIslamic).length,
    islamicAmount: annualCharges
      .filter(charge => charge.isIslamic)
      .reduce((total, charge) => total + charge.amount, 0)
  };

  // Filtrer les charges selon le filtre actif
  const filteredCharges = annualCharges.filter(charge => {
    if (filter === 'all') return true;
    // ✅ CORRECTION : Utilisation correcte de isPaid
    if (filter === 'paid') return charge.isPaid;
    if (filter === 'pending') return !charge.isPaid;
    if (filter === 'islamic') return charge.isIslamic;
    
    const status = getChargeStatus(charge);
    if (filter === 'upcoming') return status === 'upcoming';
    if (filter === 'overdue') return status === 'overdue';
    
    return true;
  });

  const renderChargeItem = ({ item }: { item: any }) => {
    const status = getChargeStatus(item);
    const daysUntilDue = getDaysUntilDue(item.dueDate);
    const statusColor = getStatusColor(status);

    return (
      <TouchableOpacity 
        style={[styles.chargeItem, isDark && styles.darkCard]}
        onPress={() => handleEditCharge(item.id)}
        onLongPress={() => handleLongPressCharge(item)}
        activeOpacity={0.7}
      >
        {/* Indicateur islamique */}
        {item.isIslamic && (
          <View style={styles.islamicBadge}>
            <Ionicons name="star" size={12} color="#FFD700" />
            <Text style={styles.islamicBadgeText}>Islamique</Text>
          </View>
        )}

        <View style={styles.chargeHeader}>
          <View style={styles.chargeInfo}>
            <Text style={[styles.chargeName, isDark && styles.darkText]}>
              {item.name}
            </Text>
            {/* Affichage nom arabe si disponible */}
            {item.arabicName && (
              <Text style={[styles.arabicName, isDark && styles.darkSubtext]}>
                {item.arabicName}
              </Text>
            )}
            <View style={styles.chargeMeta}>
              <Text style={[styles.chargeCategory, isDark && styles.darkSubtext]}>
                {item.category}
              </Text>
              <Text style={[styles.chargeDate, isDark && styles.darkSubtext]}>
                {formatDate(item.dueDate)}
              </Text>
            </View>
          </View>
          
          <TouchableOpacity
            style={[styles.statusButton, { backgroundColor: `${statusColor}20` }]}
            onPress={() => handleTogglePaid(item)}
          >
            <Text style={[styles.statusText, { color: statusColor }]}>
              {getStatusText(status)}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.chargeFooter}>
          <Text style={[styles.chargeAmount, isDark && styles.darkText]}>
            {formatAmount(item.amount)}
          </Text>
          
          {/* ✅ CORRECTION : Utilisation correcte de isPaid */}
          {!item.isPaid && (
            <View style={styles.daysContainer}>
              <Ionicons 
                name={daysUntilDue < 0 ? "warning" : "calendar"} 
                size={14} 
                color={statusColor} 
              />
              <Text style={[styles.daysText, { color: statusColor }]}>
                {daysUntilDue < 0 ? `${Math.abs(daysUntilDue)}j de retard` : 
                 daysUntilDue === 0 ? "Aujourd'hui" :
                 `${daysUntilDue}j`}
              </Text>
            </View>
          )}
        </View>

        {/* Indicateur de statut */}
        <View style={[styles.statusIndicator, { backgroundColor: statusColor }]} />
      </TouchableOpacity>
    );
  };

  if (isLoading && !refreshing) {
    return (
      <View style={[styles.container, isDark && styles.darkContainer, styles.center]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={[styles.loadingText, isDark && styles.darkText]}>
          Chargement des charges annuelles...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, isDark && styles.darkContainer, styles.center]}>
        <Ionicons name="alert-circle-outline" size={64} color="#FF3B30" />
        <Text style={[styles.errorText, isDark && styles.darkText]}>
          {error}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={refreshAnnualCharges}>
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
      {/* Header avec statistiques */}
      <View style={[styles.header, isDark && styles.darkHeader]}>
        <View style={styles.headerTop}>
          <Text style={[styles.title, isDark && styles.darkText]}>
            Charges Annuelles
          </Text>
          <View style={styles.headerActions}>
            {/* Bouton charges islamiques */}
            <TouchableOpacity 
              style={[styles.islamicButton, isDark && styles.darkIslamicButton]}
              onPress={handleIslamicCharges}
            >
              <Ionicons name="star" size={20} color="#FFD700" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.addButton, isDark && styles.darkAddButton]}
              onPress={handleAddCharge}
            >
              <Ionicons name="add" size={24} color="#007AFF" />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={[styles.subtitle, isDark && styles.darkSubtext]}>
          Gérez vos dépenses fixes annuelles
        </Text>

        {/* Statistiques rapides */}
        <View style={[styles.statsContainer, isDark && styles.darkStatsContainer]}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, isDark && styles.darkText]}>
              {stats.totalCharges}
            </Text>
            <Text style={[styles.statLabel, isDark && styles.darkSubtext]}>
              Total
            </Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: stats.pendingAmount > 0 ? '#FF9500' : '#34C759' }]}>
              {formatAmount(stats.pendingAmount)}
            </Text>
            <Text style={[styles.statLabel, isDark && styles.darkSubtext]}>
              En attente
            </Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: stats.overdueCharges > 0 ? '#FF3B30' : (isDark ? '#fff' : '#000') }]}>
              {stats.overdueCharges}
            </Text>
            <Text style={[styles.statLabel, isDark && styles.darkSubtext]}>
              En retard
            </Text>
          </View>

          {/* Statistique islamique */}
          {stats.islamicCharges > 0 && (
            <>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: '#FFD700' }]}>
                  {stats.islamicCharges}
                </Text>
                <Text style={[styles.statLabel, isDark && styles.darkSubtext]}>
                  Islamiques
                </Text>
              </View>
            </>
          )}
        </View>

        {/* Filtres rapides */}
        <View style={styles.filtersContainer}>
          {(['all', 'pending', 'upcoming', 'overdue', 'paid', 'islamic'] as const).map((filterType) => (
            <TouchableOpacity
              key={filterType}
              style={[
                styles.filterButton,
                filter === filterType && styles.filterButtonActive,
                isDark && styles.darkFilterButton,
                filterType === 'islamic' && styles.islamicFilterButton
              ]}
              onPress={() => setFilter(filterType)}
            >
              <Text style={[
                styles.filterText,
                filter === filterType && styles.filterTextActive,
                isDark && styles.darkText,
                filterType === 'islamic' && styles.islamicFilterText
              ]}>
                {filterType === 'all' && 'Toutes'}
                {filterType === 'pending' && 'En attente'}
                {filterType === 'upcoming' && 'À venir'}
                {filterType === 'overdue' && 'En retard'}
                {filterType === 'paid' && 'Payées'}
                {filterType === 'islamic' && '⭐ Islamiques'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Liste des charges */}
      <FlatList
        data={filteredCharges}
        renderItem={renderChargeItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshing={refreshing}
        onRefresh={onRefresh}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons 
              name="calendar-outline" 
              size={64} 
              color={isDark ? '#555' : '#ccc'} 
            />
            <Text style={[styles.emptyText, isDark && styles.darkSubtext]}>
              {filter === 'all' ? 'Aucune charge annuelle' : 
               filter === 'islamic' ? 'Aucune charge islamique' : 
               `Aucune charge ${filter}`}
            </Text>
            <Text style={[styles.emptySubtext, isDark && styles.darkSubtext]}>
              {filter === 'all' 
                ? 'Ajoutez vos premières charges annuelles' 
                : filter === 'islamic'
                ? 'Activez les charges islamiques dans les paramètres'
                : 'Aucune charge ne correspond à ce filtre'
              }
            </Text>
            {filter === 'all' && (
              <TouchableOpacity 
                style={styles.addEmptyButton}
                onPress={handleAddCharge}
              >
                <Text style={styles.addEmptyButtonText}>Ajouter une charge</Text>
              </TouchableOpacity>
            )}
            {filter === 'islamic' && !islamicSettings.isEnabled && (
              <TouchableOpacity 
                style={styles.islamicEmptyButton}
                onPress={() => navigation.navigate('Settings')}
              >
                <Text style={styles.islamicEmptyButtonText}>Activer les charges islamiques</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />

      {/* Bouton d'ajout flottant */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={handleAddCharge}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Bouton flottant pour charges islamiques */}
      {islamicSettings.isEnabled && (
        <TouchableOpacity 
          style={styles.islamicFab}
          onPress={handleIslamicCharges}
        >
          <Ionicons name="star" size={20} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
};

// Les styles restent exactement les mêmes
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
    padding: 20,
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  islamicButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  darkIslamicButton: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  darkAddButton: {
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
    marginBottom: 16,
  },
  darkStatsContainer: {
    backgroundColor: '#2c2c2e',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
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
  filtersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButton: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  darkFilterButton: {
    backgroundColor: '#2c2c2e',
    borderColor: '#38383a',
  },
  islamicFilterButton: {
    borderColor: 'rgba(255, 215, 0, 0.3)',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#000',
  },
  filterTextActive: {
    color: '#fff',
  },
  islamicFilterText: {
    color: '#B8860B',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  chargeItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  darkCard: {
    backgroundColor: '#2c2c2e',
  },
  islamicBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  islamicBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#B8860B',
    marginLeft: 4,
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
  arabicName: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  chargeMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chargeCategory: {
    fontSize: 14,
    color: '#666',
  },
  chargeDate: {
    fontSize: 14,
    color: '#666',
  },
  statusButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  chargeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chargeAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  daysContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  daysText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statusIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
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
  addEmptyButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addEmptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  islamicEmptyButton: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.5)',
  },
  islamicEmptyButtonText: {
    color: '#B8860B',
    fontSize: 16,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  islamicFab: {
    position: 'absolute',
    bottom: 100,
    right: 30,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  darkText: {
    color: '#fff',
  },
  darkSubtext: {
    color: '#888',
  },
});

export default AnnualChargesScreen;