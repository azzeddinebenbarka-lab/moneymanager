// src/screens/DebtsScreen.tsx - VERSION CORRIGÉE AVEC ÉCHÉANCES
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DebtForm from '../components/debts/DebtForm';
import { useTheme } from '../context/ThemeContext';
import { useDebts } from '../hooks/useDebts';
import { Debt } from '../types/Debt';

const DebtsScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const { debts, stats, createDebt, updateDebt, refreshDebts } = useDebts();
  const isDark = theme === 'dark';

  const [showDebtForm, setShowDebtForm] = useState(false);
  const [editingDebt, setEditingDebt] = useState<Debt | undefined>(undefined);
  const [filter, setFilter] = useState<'all' | 'active' | 'overdue' | 'paid' | 'future'>('all');

  // ✅ CORRECTION : Fonction de soumission unifiée
  const handleSubmitDebt = async (debtData: any) => {
    try {
      if (editingDebt) {
        await updateDebt(editingDebt.id, debtData);
      } else {
        await createDebt(debtData);
      }
      setShowDebtForm(false);
      setEditingDebt(undefined);
      await refreshDebts();
    } catch (error) {
      console.error('Erreur gestion dette:', error);
    }
  };

  // ✅ CORRECTION : Filtrage avec les nouveaux statuts
  const filteredDebts = debts.filter(debt => {
    switch (filter) {
      case 'active':
        return debt.status === 'active';
      case 'overdue':
        return debt.status === 'overdue';
      case 'paid':
        return debt.status === 'paid';
      case 'future':
        return debt.status === 'future';
      default:
        return true;
    }
  });

  // ✅ CORRECTION : Fonction pour obtenir le libellé du statut
  const getStatusLabel = (status: Debt['status']): string => {
    switch (status) {
      case 'active': return 'Active';
      case 'overdue': return 'En retard';
      case 'paid': return 'Payée';
      case 'future': return 'Future';
      default: return status;
    }
  };

  // ✅ CORRECTION : Fonction pour obtenir la couleur du statut
  const getStatusColor = (status: Debt['status']): string => {
    switch (status) {
      case 'active': return '#3B82F6';
      case 'overdue': return '#EF4444';
      case 'paid': return '#10B981';
      case 'future': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const renderDebtItem = ({ item }: { item: Debt }) => (
    <TouchableOpacity
      style={[styles.debtCard, isDark && styles.darkCard]}
      onPress={() => navigation.navigate('DebtDetail', { debtId: item.id })}
    >
      <View style={styles.debtHeader}>
        <View style={[styles.colorIndicator, { backgroundColor: item.color }]} />
        <View style={styles.debtInfo}>
          <Text style={[styles.debtName, isDark && styles.darkText]}>
            {item.name}
          </Text>
          <Text style={[styles.debtCreditor, isDark && styles.darkSubtext]}>
            {item.creditor}
          </Text>
        </View>
        <View style={styles.amountSection}>
          <Text style={[styles.debtAmount, isDark && styles.darkText]}>
            {item.currentAmount.toFixed(2)}€
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>
              {getStatusLabel(item.status)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { 
                width: `${Math.max(0, ((item.initialAmount - item.currentAmount) / item.initialAmount) * 100)}%`,
                backgroundColor: getStatusColor(item.status)
              }
            ]} 
          />
        </View>
        <Text style={[styles.progressText, isDark && styles.darkSubtext]}>
          {((item.currentAmount / item.initialAmount) * 100).toFixed(1)}% restant
        </Text>
      </View>

      <View style={styles.debtDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="calendar" size={14} color="#666" />
          <Text style={[styles.detailText, isDark && styles.darkSubtext]}>
            {new Date(item.dueDate).toLocaleDateString('fr-FR')}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="trending-up" size={14} color="#666" />
          <Text style={[styles.detailText, isDark && styles.darkSubtext]}>
            {item.interestRate}%
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="card" size={14} color="#666" />
          <Text style={[styles.detailText, isDark && styles.darkSubtext]}>
            {item.monthlyPayment.toFixed(2)}€/mois
          </Text>
        </View>
      </View>

      {/* ✅ NOUVEAU : Affichage de l'éligibilité au paiement */}
      {item.paymentEligibility && !item.paymentEligibility.isEligible && (
        <View style={styles.eligibilityWarning}>
          <Ionicons name="information-circle" size={14} color="#F59E0B" />
          <Text style={styles.eligibilityText}>
            {item.paymentEligibility.reason}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
      {/* Header */}
      <View style={[styles.header, isDark && styles.darkHeader]}>
        <View style={styles.headerContent}>
          <View>
            <Text style={[styles.title, isDark && styles.darkText]}>
              Dettes
            </Text>
            <Text style={[styles.subtitle, isDark && styles.darkSubtext]}>
  {stats.totalDebt} dettes - {stats.totalRemaining?.toFixed(2) || '0.00'}€ restant
</Text>
          </View>
          <TouchableOpacity 
            style={[styles.addButton, isDark && styles.darkAddButton]}
            onPress={() => {
              setEditingDebt(undefined);
              setShowDebtForm(true);
            }}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filtres */}
      <View style={styles.filters}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'all' && styles.filterButtonActive,
            isDark && styles.darkFilterButton
          ]}
          onPress={() => setFilter('all')}
        >
          <Text style={[
            styles.filterText,
            filter === 'all' && styles.filterTextActive,
            isDark && styles.darkText
          ]}>
            Toutes
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'active' && styles.filterButtonActive,
            isDark && styles.darkFilterButton
          ]}
          onPress={() => setFilter('active')}
        >
          <Text style={[
            styles.filterText,
            filter === 'active' && styles.filterTextActive,
            isDark && styles.darkText
          ]}>
            Actives
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'overdue' && styles.filterButtonActive,
            isDark && styles.darkFilterButton
          ]}
          onPress={() => setFilter('overdue')}
        >
          <Text style={[
            styles.filterText,
            filter === 'overdue' && styles.filterTextActive,
            isDark && styles.darkText
          ]}>
            En retard
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'future' && styles.filterButtonActive,
            isDark && styles.darkFilterButton
          ]}
          onPress={() => setFilter('future')}
        >
          <Text style={[
            styles.filterText,
            filter === 'future' && styles.filterTextActive,
            isDark && styles.darkText
          ]}>
            Futures
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'paid' && styles.filterButtonActive,
            isDark && styles.darkFilterButton
          ]}
          onPress={() => setFilter('paid')}
        >
          <Text style={[
            styles.filterText,
            filter === 'paid' && styles.filterTextActive,
            isDark && styles.darkText
          ]}>
            Payées
          </Text>
        </TouchableOpacity>
      </View>

      {/* Statistiques rapides */}
      <View style={[styles.statsCard, isDark && styles.darkCard]}>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, isDark && styles.darkText]}>
              {stats.totalDebt}
            </Text>
            <Text style={[styles.statLabel, isDark && styles.darkSubtext]}>
              Total dettes
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, isDark && styles.darkText]}>
              {stats.activeDebts}
            </Text>
            <Text style={[styles.statLabel, isDark && styles.darkSubtext]}>
              Actives
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, isDark && styles.darkText]}>
              {stats.overdueDebts}
            </Text>
            <Text style={[styles.statLabel, isDark && styles.darkSubtext]}>
              En retard
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, isDark && styles.darkText]}>
  {stats.totalRemaining?.toFixed(0) || '0'}€
</Text>
            <Text style={[styles.statLabel, isDark && styles.darkSubtext]}>
              Restant
            </Text>
          </View>
        </View>
      </View>

      {/* Liste des dettes */}
      {filteredDebts.length > 0 ? (
        <FlatList
          data={filteredDebts}
          renderItem={renderDebtItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="card-outline" size={64} color="#666" />
          <Text style={[styles.emptyText, isDark && styles.darkSubtext]}>
            Aucune dette {filter !== 'all' ? `"${filter}"` : ''} trouvée
          </Text>
          <TouchableOpacity 
            style={styles.emptyButton}
            onPress={() => {
              setEditingDebt(undefined);
              setShowDebtForm(true);
            }}
          >
            <Text style={styles.emptyButtonText}>
              Ajouter une dette
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Formulaire */}
      <DebtForm
        visible={showDebtForm}
        onClose={() => {
          setShowDebtForm(false);
          setEditingDebt(undefined);
        }}
        onSubmit={handleSubmitDebt}
        editingDebt={editingDebt}
      />
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
  header: {
    backgroundColor: '#fff',
    padding: 16,
    paddingTop: 60,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  darkHeader: {
    backgroundColor: '#2c2c2e',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  darkAddButton: {
    backgroundColor: '#0A84FF',
  },
  statsCard: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    textAlign: 'center',
  },
  filters: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  darkFilterButton: {
    backgroundColor: '#2c2c2e',
    borderColor: '#444',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
  },
  filterTextActive: {
    color: '#fff',
  },
  listContent: {
    padding: 16,
    gap: 12,
    paddingTop: 0,
  },
  debtCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  darkCard: {
    backgroundColor: '#2c2c2e',
  },
  debtHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  colorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  debtInfo: {
    flex: 1,
  },
  debtName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  debtCreditor: {
    fontSize: 12,
    color: '#666',
  },
  amountSection: {
    alignItems: 'flex-end',
  },
  debtAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
  progressSection: {
    marginBottom: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
  },
  debtDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#666',
  },
  eligibilityWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    padding: 8,
    backgroundColor: '#FEF3C7',
    borderRadius: 6,
    gap: 6,
  },
  eligibilityText: {
    fontSize: 11,
    color: '#92400E',
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  emptyButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  darkText: {
    color: '#fff',
  },
  darkSubtext: {
    color: '#888',
  },
});

export default DebtsScreen;