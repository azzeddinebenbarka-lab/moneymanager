import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from '../components/SafeAreaView';
import { AddContributionModal } from '../components/savings/AddContributionModal';
import { DeleteGoalModal } from '../components/savings/DeleteGoalModal';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useAccounts } from '../hooks/useAccounts';
import { useSavings } from '../hooks/useSavings';
import { savingsService } from '../services/savingsService';
import { SavingsGoal } from '../types/Savings';

interface SavingsScreenProps {
  navigation: any;
}

const SavingsScreen: React.FC<SavingsScreenProps> = ({ navigation }) => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const { 
    goals, 
    loading, 
    stats, 
    refreshGoals, 
    deleteGoal, 
    markGoalAsCompleted, 
    addContribution
  } = useSavings();
  
  const { accounts, refreshAccounts } = useAccounts();
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [initialLoad, setInitialLoad] = useState<boolean>(true);
  
  // ✅ ÉTATS POUR LES MODALES
  const [contributionModalVisible, setContributionModalVisible] = useState<boolean>(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  const isDark = theme === 'dark';

  // ✅ CORRECTION : CHARGEMENT INITIAL SIMPLIFIÉ
  useEffect(() => {
    const initializeData = async () => {
      if (!initialLoad) return;
      
      try {
        console.log('🔍 [SavingsScreen] Initial data loading...');
        
        // Attendre que les comptes soient chargés
        if (accounts.length === 0) {
          console.log('⏳ Waiting for accounts...');
          return;
        }

        // Vérifier rapidement la base de données
        const diagnosis = await savingsService.diagnoseDatabase();
        console.log('📊 Database status:', {
          hasGoals: diagnosis.goalsCount > 0,
          goalsCount: diagnosis.goalsCount
        });

        // Si pas d'objectifs mais un compte épargne avec argent, créer un objectif
        const savingsAccount = accounts.find(acc => acc.type === 'savings');
        if (diagnosis.goalsCount === 0 && savingsAccount && savingsAccount.balance > 0) {
          console.log('💰 Creating initial goal from existing savings...');
          
          const goalData = {
            name: 'Épargne Principale',
            targetAmount: Math.max(10000, savingsAccount.balance * 2),
            currentAmount: savingsAccount.balance,
            targetDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            monthlyContribution: 200,
            category: 'other' as const,
            color: '#34C759',
            icon: '💰',
            savingsAccountId: savingsAccount.id
          };
          
          await savingsService.createSavingsGoal(goalData);
          console.log('✅ Initial goal created');
        }

        setInitialLoad(false);
        
      } catch (error) {
        console.error('❌ Initialization error:', error);
        setInitialLoad(false); // Toujours marquer comme chargé pour éviter le blocage
      }
    };

    initializeData();
  }, [initialLoad, accounts.length]);

  // ✅ RAFRAÎCHISSEMENT SIMPLIFIÉ
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([refreshGoals(), refreshAccounts()]);
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refreshGoals, refreshAccounts]);

  // ✅ GESTION DES CONTRIBUTIONS - VERSION STABLE
const handleSubmitContribution = async (amount: number, fromAccountId?: string): Promise<{ success: boolean; message?: string }> => {
  if (!selectedGoal) {
    return { success: false, message: 'Aucun objectif sélectionné' };
  }

  if (actionLoading) {
    return { success: false, message: 'Traitement déjà en cours' };
  }

  setActionLoading(true);
  
  try {
    console.log('💰 [SavingsScreen] Starting contribution process...');

    // ✅ APPEL DIRECT - LAISSEZ addContribution GÉRER TOUT
    await addContribution(selectedGoal.id, amount, fromAccountId);
    
    // Si on arrive ici, c'est que tout a réussi
    console.log('✅ [SavingsScreen] Contribution completed successfully');
    
    return { 
      success: true, 
      message: `Contribution de ${amount.toFixed(2)}€ ajoutée avec succès !` 
    };
    
  } catch (error: any) {
    console.error('❌ [SavingsScreen] Contribution failed:', error);
    
    // ✅ PROPAGER L'ERREUR EXACTE
    throw error; // ⚠️ IMPORTANT : NE PAS RETOURNER, MAIS THROW
    
  } finally {
    setActionLoading(false);
  }
};

  // ✅ ACTIONS SUR LES OBJECTIFS
  const handleAddContribution = (goal: SavingsGoal) => {
    setSelectedGoal(goal);
    setContributionModalVisible(true);
  };

  const handleDeleteGoal = (goal: SavingsGoal) => {
    setSelectedGoal(goal);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = async (withRefund: boolean) => {
    if (!selectedGoal) return;

    setActionLoading(true);
    try {
      await deleteGoal(selectedGoal.id, withRefund);
      await refreshAccounts();
      
      Alert.alert(
        'Succès',
        withRefund ? 
          `Objectif supprimé et ${selectedGoal.currentAmount}€ remboursés !` :
          'Objectif supprimé avec succès',
        [{ text: 'OK' }]
      );

      setDeleteModalVisible(false);
      setSelectedGoal(null);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression';
      Alert.alert(t.error, errorMessage, [{ text: 'OK' }]);
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkAsCompleted = async (goal: SavingsGoal) => {
    setActionLoading(true);
    try {
      await markGoalAsCompleted(goal.id);
      Alert.alert(t.success, 'Objectif marqué comme terminé !', [{ text: 'OK' }]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      Alert.alert(t.error, errorMessage, [{ text: 'OK' }]);
    } finally {
      setActionLoading(false);
    }
  };

  // ✅ NAVIGATION
  const handleEditGoal = (goal: SavingsGoal) => {
    navigation.navigate('EditSavingsGoal', { goalId: goal.id });
  };

  const handlePressGoal = (goal: SavingsGoal) => {
    navigation.navigate('SavingsDetail', { goalId: goal.id });
  };

  // ✅ FORMATAGE
  const formatCurrency = (amount: number): string => {
    return `${amount.toFixed(2)}€`;
  };

  const filteredGoals = goals.filter(goal =>
    goal.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ✅ RENDU DES ITEMS
  const renderGoalItem = ({ item }: { item: SavingsGoal }) => {
    const progress = item.targetAmount > 0 ? (item.currentAmount / item.targetAmount) * 100 : 0;
    const isCompleted = item.isCompleted || progress >= 100;

    return (
      <TouchableOpacity
        style={[styles.goalItem, isDark && styles.darkCard]}
        onPress={() => handlePressGoal(item)}
      >
        <View style={styles.goalHeader}>
          <View style={styles.goalLeft}>
            <View style={[styles.goalIcon, { backgroundColor: item.color || '#007AFF' }]}>
              <Text style={styles.goalIconText}>{item.icon || '💰'}</Text>
            </View>
            <View style={styles.goalInfo}>
              <Text style={[styles.goalName, isDark && styles.darkText]}>
                {item.name}
              </Text>
              <Text style={[styles.goalTarget, isDark && styles.darkSubtext]}>
                Objectif: {formatCurrency(item.targetAmount)}
              </Text>
            </View>
          </View>
          
          <View style={styles.actionsContainer}>
            {!isCompleted && (
              <>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleAddContribution(item)}
                >
                  <Ionicons name="add-circle-outline" size={20} color="#007AFF" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleMarkAsCompleted(item)}
                >
                  <Ionicons name="checkmark-circle" size={20} color="#34C759" />
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleEditGoal(item)}
            >
              <Ionicons name="create-outline" size={20} color="#FF9500" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleDeleteGoal(item)}
            >
              <Ionicons name="trash-outline" size={20} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill,
                { 
                  width: `${Math.min(progress, 100)}%`, 
                  backgroundColor: item.color || '#007AFF' 
                }
              ]} 
            />
          </View>
          {isCompleted && (
            <View style={styles.completedBadge}>
              <Ionicons name="checkmark" size={12} color="#fff" />
              <Text style={styles.completedText}>Terminé</Text>
            </View>
          )}
        </View>

        <View style={styles.goalDetails}>
          <View style={styles.detailItem}>
            <Text style={[styles.detailLabel, isDark && styles.darkSubtext]}>
              Épargne actuelle
            </Text>
            <Text style={[styles.detailValue, isDark && styles.darkText]}>
              {formatCurrency(item.currentAmount)}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={[styles.detailLabel, isDark && styles.darkSubtext]}>
              Progression
            </Text>
            <Text style={[styles.detailValue, isDark && styles.darkText]}>
              {progress.toFixed(1)}%
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={[styles.detailLabel, isDark && styles.darkSubtext]}>
              Mensualité
            </Text>
            <Text style={[styles.detailValue, isDark && styles.darkText]}>
              {formatCurrency(item.monthlyContribution || 0)}
            </Text>
          </View>
        </View>

        {item.savingsAccountId && (
          <View style={styles.savingsAccountInfo}>
            <Ionicons name="checkmark-done" size={14} color="#34C759" />
            <Text style={[styles.savingsAccountText, isDark && styles.darkSubtext]}>
              Compte épargne lié
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // ✅ ÉTAT VIDE
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons 
        name="trending-up-outline" 
        size={64} 
        color={isDark ? '#555' : '#ccc'} 
      />
      <Text style={[styles.emptyTitle, isDark && styles.darkText]}>
        {loading ? 'Chargement...' : 'Aucun objectif d\'épargne'}
      </Text>
      <Text style={[styles.emptyDescription, isDark && styles.darkSubtext]}>
        {loading ? 'Récupération de vos objectifs...' : 'Créez votre premier objectif pour commencer à épargner.'}
      </Text>
      {!loading && (
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('AddSavingsGoal')}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Créer un objectif</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // ✅ ÉCRAN DE CHARGEMENT
  if (loading && goals.length === 0) {
    return (
      <SafeAreaView style={[styles.container, styles.center, isDark && styles.darkContainer]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={[styles.loadingText, isDark && styles.darkText]}>
          Chargement des objectifs...
        </Text>
      </SafeAreaView>
    );
  }

  // ✅ RENDU PRINCIPAL
  return (
    <SafeAreaView style={[styles.container, isDark && styles.darkContainer]}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => navigation.openDrawer()}
          >
            <Ionicons name="menu" size={24} color={isDark ? "#fff" : "#000"} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, isDark && styles.darkText]}>
            Mes Objectifs
          </Text>
          <TouchableOpacity 
            style={styles.addButtonHeader}
            onPress={() => navigation.navigate('AddSavingsGoal')}
          >
            <Ionicons name="add" size={24} color={isDark ? "#fff" : "#000"} />
          </TouchableOpacity>
        </View>

        <View style={[styles.searchContainer, isDark && styles.darkSearchContainer]}>
          <Ionicons name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, isDark && styles.darkInput]}
            placeholder={t.search + '...'}
            placeholderTextColor="#8E8E93"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#8E8E93" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {goals.length > 0 && stats && (
        <View style={[styles.statsCard, isDark && styles.darkCard]}>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, isDark && styles.darkSubtext]}>
              Total épargné
            </Text>
            <Text style={[styles.statValue, isDark && styles.darkText]}>
              {formatCurrency(stats.totalSaved || 0)}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, isDark && styles.darkSubtext]}>
              Objectifs
            </Text>
            <Text style={[styles.statValue, isDark && styles.darkText]}>
              {stats.totalGoals || 0}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, isDark && styles.darkSubtext]}>
              Terminés
            </Text>
            <Text style={[styles.statValue, isDark && styles.darkText]}>
              {stats.completedGoals || 0}
            </Text>
          </View>
        </View>
      )}

      <FlatList
        data={filteredGoals}
        renderItem={renderGoalItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          filteredGoals.length === 0 && styles.emptyListContent
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={renderEmptyState}
      />

      {/* MODALES */}
      {selectedGoal && (
        <>
          <AddContributionModal
            visible={contributionModalVisible}
            onClose={() => {
              setContributionModalVisible(false);
              setSelectedGoal(null);
            }}
            onSubmit={handleSubmitContribution}
            goal={selectedGoal}
          />

          <DeleteGoalModal
            visible={deleteModalVisible}
            onClose={() => {
              setDeleteModalVisible(false);
              setSelectedGoal(null);
            }}
            onConfirm={handleConfirmDelete}
            goal={selectedGoal}
            loading={actionLoading}
          />
        </>
      )}

      {actionLoading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingOverlayText}>Traitement en cours...</Text>
          </View>
        </View>
      )}
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
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  menuButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  addButtonHeader: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  darkSearchContainer: {
    backgroundColor: '#2c2c2e',
    borderColor: '#444',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000',
  },
  darkInput: {
    color: '#fff',
  },
  statsCard: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  darkCard: {
    backgroundColor: '#2c2c2e',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  listContent: {
    padding: 20,
    paddingTop: 0,
    flexGrow: 1,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  goalItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  goalLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  goalIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  goalIconText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  goalInfo: {
    flex: 1,
  },
  goalName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  goalTarget: {
    fontSize: 14,
    color: '#666',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#e9ecef',
    borderRadius: 3,
    overflow: 'hidden',
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#34C759',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  completedText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  goalDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  savingsAccountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    gap: 4,
  },
  savingsAccountText: {
    fontSize: 10,
    color: '#2E7D32',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  loadingBox: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 200,
  },
  loadingOverlayText: {
    marginTop: 12,
    fontSize: 14,
    color: '#2c3e50',
    textAlign: 'center',
  },
  darkText: {
    color: '#fff',
  },
  darkSubtext: {
    color: '#888',
  },
});

export default SavingsScreen;