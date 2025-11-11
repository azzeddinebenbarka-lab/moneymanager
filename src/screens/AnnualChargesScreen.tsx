// src/screens/AnnualChargesScreen.tsx - VERSION COMPLÈTEMENT CORRIGÉE ET AMÉLIORÉE
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
import { useTheme } from '../context/ThemeContext';
import { useAnnualCharges } from '../hooks/useAnnualCharges';

// ✅ CORRECTION : Interface locale pour éviter les conflits de types
interface LocalAnnualCharge {
  id: string;
  name: string;
  amount: number;
  category: string;
  dueDate: string;
  isPaid: boolean;
  createdAt: string;
  userId?: string;
  notes?: string;
  paymentMethod?: string;
  recurrence?: 'yearly' | 'monthly' | 'quarterly';
}

const AnnualChargesScreen = ({ navigation }: any) => { 
  const { theme } = useTheme();
  const { 
    charges, 
    loading, 
    error, 
    updateAnnualCharge,
    deleteAnnualCharge,
    togglePaidStatus, 
    refreshAnnualCharges 
  } = useAnnualCharges();
  
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending' | 'upcoming' | 'overdue'>('all');
  
  const isDark = theme === 'dark';

  // ✅ CORRECTION : Conversion des charges vers le type local
  const localCharges: LocalAnnualCharge[] = charges.map(charge => ({
    ...charge,
    userId: charge.userId || 'default-user-id' // Valeur par défaut
  }));

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshAnnualCharges();
    setRefreshing(false);
  };

  const handleAddCharge = () => {
    navigation.navigate('AddAnnualCharge');
  };

 const handleEditCharge = (chargeId: string) => {
  // ✅ SOLUTION : Utiliser AddAnnualCharge avec un paramètre d'édition
  navigation.navigate('EditAnnualCharge', { 
    chargeId: chargeId,
    mode: 'edit'
  });
};
  const handleDeleteCharge = (charge: LocalAnnualCharge) => {
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

  // ✅ AMÉLIORATION : Menu d'actions au clic long
  const handleLongPressCharge = (charge: LocalAnnualCharge) => {
    Alert.alert(
      charge.name,
      `Que voulez-vous faire avec cette charge ?\n\nMontant: ${formatCurrency(charge.amount)}\nDate: ${formatDate(charge.dueDate)}`,
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

  const handleTogglePaid = async (charge: LocalAnnualCharge) => {
    try {
      await togglePaidStatus(charge.id, !charge.isPaid);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de modifier le statut de paiement');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getDaysUntilDue = (dueDate: string): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Ignorer l'heure pour la comparaison
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    const timeDiff = due.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const getChargeStatus = (charge: LocalAnnualCharge) => {
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

  // ✅ CORRECTION : Statistiques calculées localement
  const stats = {
    totalCharges: localCharges.length,
    pendingAmount: localCharges
      .filter(charge => !charge.isPaid)
      .reduce((total, charge) => total + charge.amount, 0),
    overdueCharges: localCharges.filter(charge => {
      const daysUntilDue = getDaysUntilDue(charge.dueDate);
      return !charge.isPaid && daysUntilDue < 0;
    }),
    paidCharges: localCharges.filter(charge => charge.isPaid).length
  };

  // Filtrer les charges selon le filtre actif
  const filteredCharges = localCharges.filter(charge => {
    if (filter === 'all') return true;
    if (filter === 'paid') return charge.isPaid;
    if (filter === 'pending') return !charge.isPaid;
    
    const status = getChargeStatus(charge);
    if (filter === 'upcoming') return status === 'upcoming';
    if (filter === 'overdue') return status === 'overdue';
    
    return true;
  });

  const renderChargeItem = ({ item }: { item: LocalAnnualCharge }) => {
    const status = getChargeStatus(item);
    const daysUntilDue = getDaysUntilDue(item.dueDate);
    const statusColor = getStatusColor(status);

    return (
      <TouchableOpacity 
        style={[styles.chargeItem, isDark && styles.darkCard]}
        onPress={() => handleEditCharge(item.id)} // ✅ CLIC SIMPLE = ÉDITION
        onLongPress={() => handleLongPressCharge(item)} // ✅ CLIC LONG = MENU D'ACTIONS
        activeOpacity={0.7}
      >
        <View style={styles.chargeHeader}>
          <View style={styles.chargeInfo}>
            <Text style={[styles.chargeName, isDark && styles.darkText]}>
              {item.name}
            </Text>
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
            {formatCurrency(item.amount)}
          </Text>
          
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

  if (loading && !refreshing) {
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
          <TouchableOpacity 
            style={[styles.addButton, isDark && styles.darkAddButton]}
            onPress={handleAddCharge}
          >
            <Ionicons name="add" size={24} color="#007AFF" />
          </TouchableOpacity>
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
              {formatCurrency(stats.pendingAmount)}
            </Text>
            <Text style={[styles.statLabel, isDark && styles.darkSubtext]}>
              En attente
            </Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: stats.overdueCharges.length > 0 ? '#FF3B30' : (isDark ? '#fff' : '#000') }]}>
              {stats.overdueCharges.length}
            </Text>
            <Text style={[styles.statLabel, isDark && styles.darkSubtext]}>
              En retard
            </Text>
          </View>
        </View>

        {/* Filtres rapides */}
        <View style={styles.filtersContainer}>
          {(['all', 'pending', 'upcoming', 'overdue', 'paid'] as const).map((filterType) => (
            <TouchableOpacity
              key={filterType}
              style={[
                styles.filterButton,
                filter === filterType && styles.filterButtonActive,
                isDark && styles.darkFilterButton
              ]}
              onPress={() => setFilter(filterType)}
            >
              <Text style={[
                styles.filterText,
                filter === filterType && styles.filterTextActive,
                isDark && styles.darkText
              ]}>
                {filterType === 'all' && 'Toutes'}
                {filterType === 'pending' && 'En attente'}
                {filterType === 'upcoming' && 'À venir'}
                {filterType === 'overdue' && 'En retard'}
                {filterType === 'paid' && 'Payées'}
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
              {filter === 'all' ? 'Aucune charge annuelle' : `Aucune charge ${filter}`}
            </Text>
            <Text style={[styles.emptySubtext, isDark && styles.darkSubtext]}>
              {filter === 'all' 
                ? 'Ajoutez vos premières charges annuelles' 
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
    </View>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
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
  darkText: {
    color: '#fff',
  },
  darkSubtext: {
    color: '#888',
  },
});

export default AnnualChargesScreen;