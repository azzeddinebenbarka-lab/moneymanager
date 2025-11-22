// src/screens/TransactionDetailScreen.tsx - VERSION MODERNISÉE
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useMemo } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useCurrency } from '../context/CurrencyContext';
import { useDesignSystem, useTheme } from '../context/ThemeContext';
import { useCategories } from '../hooks/useCategories';
import { useTransactions } from '../hooks/useTransactions';

type TransactionDetailScreenNavigationProp = any;
type TransactionDetailScreenRouteProp = RouteProp<{
  TransactionDetail: { transactionId: string };
}, 'TransactionDetail'>;

const TransactionDetailScreen = () => {
  const navigation = useNavigation<TransactionDetailScreenNavigationProp>();
  const route = useRoute<TransactionDetailScreenRouteProp>();
  const { colors } = useDesignSystem();
  const { theme } = useTheme();
  const { formatAmount } = useCurrency();
  const { transactions, deleteTransaction, refreshTransactions } = useTransactions();
  const { categories } = useCategories();
  const { transactionId } = route.params;
  const isDark = theme === 'dark';

  const transaction = useMemo(() => 
    transactions.find(t => t.id === transactionId),
    [transactions, transactionId]
  );

  // ✅ FONCTION POUR OBTENIR LE NOM ET LES DÉTAILS DE LA CATÉGORIE
  const getCategoryDetails = useCallback((categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return {
      name: category?.name || 'Non catégorisé',
      color: category?.color || '#666',
      icon: category?.icon || 'help-circle'
    };
  }, [categories]);

  const handleEditTransaction = useCallback(() => {
    if (!transaction) return;
    
    console.log('🎯 Navigation vers édition transaction:', transaction.id);
    navigation.navigate('EditTransaction', { 
      transactionId: transaction.id 
    });
  }, [navigation, transaction]);

  const handleDeleteTransaction = useCallback(() => {
    if (!transaction) return;

    Alert.alert(
      'Supprimer la transaction',
      `Êtes-vous sûr de vouloir supprimer cette transaction ?\n\n"${transaction.description || 'Sans description'}"\n${formatAmount(transaction.amount)}`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('🗑️ [TransactionDetailScreen] Suppression transaction...');
              
              await deleteTransaction(transaction.id);
              await refreshTransactions();
              
              console.log('✅ [TransactionDetailScreen] Transaction supprimée avec succès');
              navigation.goBack();
              
            } catch (error: any) {
              console.error('❌ [TransactionDetailScreen] Erreur suppression:', error);
              Alert.alert('Erreur', error.message || 'Impossible de supprimer la transaction');
            }
          },
        },
      ]
    );
  }, [transaction, deleteTransaction, navigation, refreshTransactions, formatAmount]);

  if (!transaction) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background.primary }, styles.center]}>
        <View style={styles.errorIconContainer}>
          <Ionicons name="alert-circle" size={80} color={colors.semantic.error} />
        </View>
        <Text style={[styles.errorText, { color: colors.text.primary }]}>
          Transaction non trouvée
        </Text>
        <Text style={[styles.errorSubtext, { color: colors.text.secondary }]}>
          La transaction que vous recherchez n'existe pas ou a été supprimée
        </Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color={colors.primary[500]} />
          <Text style={styles.backButtonText}>Retour à la liste</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const categoryDetails = getCategoryDetails(transaction.category);
  const isIncome = transaction.type === 'income';

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      {/* Header modernisé */}
      <View style={[styles.header, { backgroundColor: colors.background.card, borderBottomColor: colors.border.primary }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.title, { color: colors.text.primary }]}>
            Détails de la transaction
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={handleEditTransaction}
        >
          <Ionicons name="create-outline" size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Carte principale modernisée */}
        <View style={[styles.mainCard, { backgroundColor: colors.background.card }]}>
          <View style={styles.amountSection}>
            <Text style={[
              styles.amount,
              { color: isIncome ? colors.semantic.success : colors.semantic.error }
            ]}>
              {isIncome ? '+' : '-'}{formatAmount(Math.abs(transaction.amount))}
            </Text>
            <View style={[
              styles.typeBadge,
              { backgroundColor: isIncome ? colors.semantic.success + '20' : colors.semantic.error + '20' }
            ]}>
              <Ionicons 
                name={isIncome ? "trending-up" : "trending-down"} 
                size={16} 
                color={isIncome ? colors.semantic.success : colors.semantic.error} 
              />
              <Text style={[
                styles.typeText,
                { color: isIncome ? colors.semantic.success : colors.semantic.error }
              ]}>
                {isIncome ? 'Revenu' : 'Dépense'}
              </Text>
            </View>
          </View>

          <View style={styles.descriptionSection}>
            <Ionicons name="document-text" size={20} color={colors.text.secondary} />
            <Text style={[styles.description, { color: colors.text.primary }]}>
              {transaction.description || 'Aucune description'}
            </Text>
          </View>
        </View>

        {/* Informations détaillées */}
        <View style={[styles.detailsCard, { backgroundColor: colors.background.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Informations
          </Text>
          
          <View style={styles.detailsList}>
            {/* Catégorie */}
            <View style={styles.detailItem}>
              <View style={styles.detailLeft}>
                <View style={[styles.categoryIcon, { backgroundColor: categoryDetails.color + '20' }]}>
                  <Ionicons name={categoryDetails.icon as any} size={20} color={categoryDetails.color} />
                </View>
                <Text style={[styles.detailLabel, { color: colors.text.secondary }]}>
                  Catégorie
                </Text>
              </View>
              <View style={[styles.categoryBadge, { backgroundColor: categoryDetails.color + '20' }]}>
                <Text style={[styles.categoryText, { color: categoryDetails.color }]}>
                  {categoryDetails.name}
                </Text>
              </View>
            </View>

            {/* Date */}
            <View style={styles.detailItem}>
              <View style={styles.detailLeft}>
                <View style={[styles.detailIcon, { backgroundColor: '#E3F2FD' }]}>
                  <Ionicons name="calendar" size={20} color="#1976D2" />
                </View>
                <Text style={[styles.detailLabel, { color: colors.text.secondary }]}>
                  Date
                </Text>
              </View>
              <Text style={[styles.detailValue, { color: colors.text.primary }]}>
                {new Date(transaction.date).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Text>
            </View>

            {/* Heure */}
            <View style={styles.detailItem}>
              <View style={styles.detailLeft}>
                <View style={[styles.detailIcon, { backgroundColor: '#FFF3E0' }]}>
                  <Ionicons name="time" size={20} color="#F57C00" />
                </View>
                <Text style={[styles.detailLabel, { color: colors.text.secondary }]}>
                  Heure
                </Text>
              </View>
              <Text style={[styles.detailValue, { color: colors.text.primary }]}>
                {new Date(transaction.createdAt).toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
            </View>

            {/* Date de création */}
            <View style={styles.detailItem}>
              <View style={styles.detailLeft}>
                <View style={[styles.detailIcon, { backgroundColor: '#F3E5F5' }]}>
                  <Ionicons name="add-circle" size={20} color="#7B1FA2" />
                </View>
                <Text style={[styles.detailLabel, { color: colors.text.secondary }]}>
                  Créée le
                </Text>
              </View>
              <Text style={[styles.detailValue, { color: colors.text.primary }]}>
                {new Date(transaction.createdAt).toLocaleDateString('fr-FR')}
              </Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={[styles.actionsCard, { backgroundColor: colors.background.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Actions
          </Text>
          
          <View style={styles.actionsList}>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: '#E3F2FD' }]}
              onPress={handleEditTransaction}
            >
              <Ionicons name="create" size={20} color="#1976D2" />
              <Text style={[styles.actionText, { color: '#1976D2' }]}>
                Modifier la transaction
              </Text>
              <Ionicons name="chevron-forward" size={16} color="#1976D2" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: '#FFEBEE' }]}
              onPress={handleDeleteTransaction}
            >
              <Ionicons name="trash" size={20} color="#D32F2F" />
              <Text style={[styles.actionText, { color: '#D32F2F' }]}>
                Supprimer la transaction
              </Text>
              <Ionicons name="chevron-forward" size={16} color="#D32F2F" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
    padding: 20,
  },
  header: {
    padding: 16,
    paddingTop: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  editButton: {
    padding: 8,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  mainCard: {
    padding: 24,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  amountSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  amount: {
    fontSize: 42,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  typeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  descriptionSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    gap: 12,
  },
  description: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  detailsCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  detailsList: {
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionsCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionsList: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  errorIconContainer: {
    marginBottom: 16,
  },
  errorText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    marginBottom: 24,
    textAlign: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default TransactionDetailScreen;