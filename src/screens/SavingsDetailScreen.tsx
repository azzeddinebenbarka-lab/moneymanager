// src/screens/SavingsDetailScreen.tsx - VERSION CORRIGÉE
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
import { AddContributionModal } from '../components/savings/AddContributionModal';
import { ContributionHistory } from '../components/savings/ContributionHistory';
import { SavingsGoalDetail } from '../components/savings/SavingsGoalDetail';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useSavings } from '../hooks/useSavings';
import { SavingsGoal } from '../types/Savings';

interface SavingsDetailScreenProps {
  navigation: any;
  route: any;
}

const SavingsDetailScreen: React.FC<SavingsDetailScreenProps> = ({ navigation, route }) => {
  const { goalId } = route.params;
  const { t } = useLanguage();
  const { theme } = useTheme();
  const { getGoalById, addContribution, getContributionHistory, deleteGoal } = useSavings();
  
  const [goal, setGoal] = useState<SavingsGoal | null>(null);
  const [contributions, setContributions] = useState<any[]>([]);
  const [showContributionModal, setShowContributionModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const isDark = theme === 'dark';

  useEffect(() => {
    loadGoalData();
  }, [goalId]);

  const loadGoalData = async () => {
    try {
      setLoading(true);
      const goalData = await getGoalById(goalId);
      setGoal(goalData);
      
      if (goalData) {
        const contributionData = await getContributionHistory(goalId);
        setContributions(contributionData);
      }
    } catch (error) {
      console.error('Error loading goal data:', error);
      Alert.alert(t.error, t.cannotLoadGoal);
    } finally {
      setLoading(false);
    }
  };

  // ✅ CORRECTION : La fonction onSubmit doit retourner Promise<{ success: boolean; message?: string }>
  const handleAddContribution = async (amount: number, fromAccountId?: string): Promise<{ success: boolean; message?: string }> => {
    try {
      await addContribution(goalId, amount, fromAccountId);
      setShowContributionModal(false);
      await loadGoalData(); // Recharger les données
      
      return {
        success: true,
        message: `${t.contribution} ${amount.toFixed(2)}€ ${t.contributionAdded}`
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t.cannotAddContribution;
      
      return {
        success: false,
        message: errorMessage
      };
    }
  };

  const handleDeleteGoal = () => {
    if (!goal) return;
    
    Alert.alert(
      t.deleteSavingsGoal,
      `${t.deleteSavingsGoalConfirm} "${goal.name}" ? ${t.deleteConfirmMessage}`,
      [
        { text: t.cancel, style: 'cancel' },
        { 
          text: t.delete, 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteGoal(goalId);
              navigation.goBack();
              Alert.alert(t.success, t.goalDeletedSuccess);
            } catch (error) {
              Alert.alert(t.error, t.cannotDeleteGoal);
            }
          }
        }
      ]
    );
  };

  const handleEditGoal = () => {
    if (!goal) return;
    navigation.navigate('EditSavingsGoal', { goalId: goal.id });
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, isDark && styles.darkContainer]}>
        <View style={styles.center}>
          <Text style={[styles.loadingText, isDark && styles.darkText]}>
            {t.loading}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!goal) {
    return (
      <SafeAreaView style={[styles.container, isDark && styles.darkContainer]}>
        <View style={styles.center}>
          <Text style={[styles.errorText, isDark && styles.darkText]}>
            {t.goalNotFound}
          </Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonLabel}>{t.back}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <View style={[styles.container, isDark && styles.darkContainer]}>
        {/* Header */}
        <View style={[styles.header, isDark && styles.darkHeader]}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={isDark ? '#fff' : '#000'} />
          </TouchableOpacity>
          <Text style={[styles.title, isDark && styles.darkText]}>
            {t.goalDetails}
          </Text>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.headerActionButton}
              onPress={handleEditGoal}
            >
              <Ionicons name="create-outline" size={20} color={isDark ? '#fff' : '#007AFF'} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerActionButton}
              onPress={handleDeleteGoal}
            >
              <Ionicons name="trash-outline" size={20} color={isDark ? '#fff' : '#FF3B30'} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.content}>
          {/* Détails de l'objectif */}
          <SavingsGoalDetail 
            goal={goal}
            onAddContribution={() => setShowContributionModal(true)}
          />

          {/* Historique des contributions */}
          <ContributionHistory 
            contributions={contributions}
            goal={goal}
          />

          {/* Actions rapides */}
          <View style={[styles.quickActions, isDark && styles.darkCard]}>
            <Text style={[styles.sectionTitle, isDark && styles.darkText]}>
              {t.quickActions}
            </Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: goal.color }]}
                onPress={() => setShowContributionModal(true)}
              >
                <Ionicons name="add-circle" size={20} color="#fff" />
                <Text style={styles.actionButtonText}>{t.addAction}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: '#34C759' }]}
                onPress={handleEditGoal}
              >
                <Ionicons name="create" size={20} color="#fff" />
                <Text style={styles.actionButtonText}>{t.modifyAction}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Modal d'ajout de contribution */}
        <AddContributionModal
          visible={showContributionModal}
          onClose={() => setShowContributionModal(false)}
          onSubmit={handleAddContribution}
          goal={goal}
        />
      </View>
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 18,
    color: '#000',
    marginBottom: 20,
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    paddingTop: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  darkHeader: {
    backgroundColor: '#2c2c2e',
    borderBottomColor: '#38383a',
  },
  backButton: {
    padding: 4,
  },
  backButtonLabel: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
    textAlign: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerActionButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  quickActions: {
    backgroundColor: '#fff',
    padding: 16,
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  darkCard: {
    backgroundColor: '#2c2c2e',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  darkText: {
    color: '#fff',
  },
});

export default SavingsDetailScreen;