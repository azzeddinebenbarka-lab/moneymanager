import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CashFlowMetrics } from '../../../types/ProfessionalDashboard';

interface CashFlowCardProps {
  data: CashFlowMetrics;
  isDark: boolean;
}

export const CashFlowCard: React.FC<CashFlowCardProps> = ({ data, isDark }) => {
  const formatCurrency = (amount: number): string => {
    return `${amount >= 0 ? '' : '-'}€${Math.abs(amount).toLocaleString('fr-FR')}`;
  };

  const getCashFlowColor = (cashFlow: number): string => {
    return cashFlow >= 0 ? '#10B981' : '#EF4444';
  };

  const getCashFlowIcon = (cashFlow: number): keyof typeof Ionicons.glyphMap => {
    return cashFlow >= 0 ? 'trending-up' : 'trending-down';
  };

  return (
    <View style={[styles.card, isDark && styles.darkCard]}>
      {/* En-tête */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons name="cash" size={20} color="#6366F1" />
          <Text style={[styles.title, isDark && styles.darkText]}>
            Cash Flow Mensuel
          </Text>
        </View>
        <View style={[
          styles.cashFlowBadge,
          { backgroundColor: `${getCashFlowColor(data.cashFlowNet)}20` }
        ]}>
          <Ionicons 
            name={getCashFlowIcon(data.cashFlowNet)} 
            size={16} 
            color={getCashFlowColor(data.cashFlowNet)} 
          />
          <Text style={[
            styles.cashFlowText,
            { color: getCashFlowColor(data.cashFlowNet) }
          ]}>
            {formatCurrency(data.cashFlowNet)}
          </Text>
        </View>
      </View>

      {/* Détails des flux */}
      <View style={styles.flowDetails}>
        {/* Revenus */}
        <View style={styles.flowItem}>
          <View style={styles.flowLeft}>
            <View style={[styles.iconContainer, { backgroundColor: '#10B98120' }]}>
              <Ionicons name="arrow-down" size={16} color="#10B981" />
            </View>
            <View>
              <Text style={[styles.flowLabel, isDark && styles.darkText]}>
                Revenus
              </Text>
              <Text style={[styles.flowDescription, isDark && styles.darkSubtext]}>
                Salaires, revenus divers
              </Text>
            </View>
          </View>
          <Text style={[styles.flowAmount, { color: '#10B981' }]}>
            +{formatCurrency(data.revenus)}
          </Text>
        </View>

        {/* Dépenses courantes */}
        <View style={styles.flowItem}>
          <View style={styles.flowLeft}>
            <View style={[styles.iconContainer, { backgroundColor: '#EF444420' }]}>
              <Ionicons name="cart" size={16} color="#EF4444" />
            </View>
            <View>
              <Text style={[styles.flowLabel, isDark && styles.darkText]}>
                Dépenses courantes
              </Text>
              <Text style={[styles.flowDescription, isDark && styles.darkSubtext]}>
                Alimentation, transport, loisirs
              </Text>
            </View>
          </View>
          <Text style={[styles.flowAmount, { color: '#EF4444' }]}>
            -{formatCurrency(data.depensesCourantes)}
          </Text>
        </View>

        {/* Charges fixes */}
        <View style={styles.flowItem}>
          <View style={styles.flowLeft}>
            <View style={[styles.iconContainer, { backgroundColor: '#F59E0B20' }]}>
              <Ionicons name="home" size={16} color="#F59E0B" />
            </View>
            <View>
              <Text style={[styles.flowLabel, isDark && styles.darkText]}>
                Charges fixes
              </Text>
              <Text style={[styles.flowDescription, isDark && styles.darkSubtext]}>
                Loyer, abonnements, assurances
              </Text>
            </View>
          </View>
          <Text style={[styles.flowAmount, { color: '#F59E0B' }]}>
            -{formatCurrency(data.chargesFixes)}
          </Text>
        </View>

        {/* Paiements dettes */}
        <View style={styles.flowItem}>
          <View style={styles.flowLeft}>
            <View style={[styles.iconContainer, { backgroundColor: '#8B5CF620' }]}>
              <Ionicons name="card" size={16} color="#8B5CF6" />
            </View>
            <View>
              <Text style={[styles.flowLabel, isDark && styles.darkText]}>
                Paiements dettes
              </Text>
              <Text style={[styles.flowDescription, isDark && styles.darkSubtext]}>
                Crédits, emprunts
              </Text>
            </View>
          </View>
          <Text style={[styles.flowAmount, { color: '#8B5CF6' }]}>
            -{formatCurrency(data.paiementsDettes)}
          </Text>
        </View>

        {/* Épargne programmée */}
        <View style={styles.flowItem}>
          <View style={styles.flowLeft}>
            <View style={[styles.iconContainer, { backgroundColor: '#06B6D420' }]}>
              <Ionicons name="trending-up" size={16} color="#06B6D4" />
            </View>
            <View>
              <Text style={[styles.flowLabel, isDark && styles.darkText]}>
                Épargne programmée
              </Text>
              <Text style={[styles.flowDescription, isDark && styles.darkSubtext]}>
                Objectifs, investissements
              </Text>
            </View>
          </View>
          <Text style={[styles.flowAmount, { color: '#06B6D4' }]}>
            -{formatCurrency(data.epargneProgrammee)}
          </Text>
        </View>
      </View>

      {/* Barre de progression visuelle */}
      <View style={styles.progressSection}>
        <View style={styles.progressLabels}>
          <Text style={[styles.progressLabel, isDark && styles.darkSubtext]}>
            Total entrées: {formatCurrency(data.revenus)}
          </Text>
          <Text style={[styles.progressLabel, isDark && styles.darkSubtext]}>
            Total sorties: {formatCurrency(data.depensesCourantes + data.chargesFixes + data.paiementsDettes + data.epargneProgrammee)}
          </Text>
        </View>
        
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressIncome,
              { width: `${Math.min(100, (data.revenus / (data.revenus || 1)) * 100)}%` }
            ]} 
          />
          <View 
            style={[
              styles.progressExpenses,
              { 
                width: `${Math.min(100, ((data.depensesCourantes + data.chargesFixes + data.paiementsDettes + data.epargneProgrammee) / (data.revenus || 1)) * 100)}%` 
              }
            ]} 
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  darkCard: {
    backgroundColor: '#1F2937',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  cashFlowBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  cashFlowText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  flowDetails: {
    gap: 16,
  },
  flowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flowLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  flowDescription: {
    fontSize: 12,
    color: '#666',
  },
  flowAmount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressSection: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    color: '#666',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  progressIncome: {
    height: '100%',
    backgroundColor: '#10B981',
  },
  progressExpenses: {
    height: '100%',
    backgroundColor: '#EF4444',
  },
  darkText: {
    color: '#F9FAFB',
  },
  darkSubtext: {
    color: '#9CA3AF',
  },
});

export default CashFlowCard;