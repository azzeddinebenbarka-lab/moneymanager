import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../context/ThemeContext';
import { useProfessionalDashboard } from '../../../hooks/useProfessionalDashboard';
import { FinancialHealthIndicators } from '../../../types/ProfessionalDashboard';

interface ProfessionalSummaryProps {
  onPress?: () => void;
  compact?: boolean;
}

export const ProfessionalSummary: React.FC<ProfessionalSummaryProps> = ({ 
  onPress, 
  compact = false 
}) => {
  const { theme } = useTheme();
  const { data, loading, error } = useProfessionalDashboard();
  
  const isDark = theme === 'dark';

  if (loading) {
    return (
      <View style={[styles.card, isDark && styles.darkCard]}>
        <Text style={[styles.loadingText, isDark && styles.darkText]}>
          Analyse professionnelle en cours...
        </Text>
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={[styles.card, isDark && styles.darkCard]}>
        <View style={styles.errorContainer}>
          <Ionicons name="warning" size={24} color="#EF4444" />
          <Text style={[styles.errorText, isDark && styles.darkText]}>
            {error || 'Données indisponibles'}
          </Text>
        </View>
      </View>
    );
  }

  const { cashFlow, patrimoine, indicateurs, periode } = data;

  const getHealthColor = (sante: FinancialHealthIndicators['santeFinanciere']): string => {
    switch (sante) {
      case 'EXCELLENT': return '#10B981';
      case 'BON': return '#3B82F6';
      case 'ATTENTION': return '#F59E0B';
      case 'CRITIQUE': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const healthColor = getHealthColor(indicateurs.santeFinanciere);

  const CardContent = () => (
    <View style={styles.content}>
      {/* En-tête avec période et santé */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, isDark && styles.darkText]}>
            Analyse Professionnelle
          </Text>
          <Text style={[styles.subtitle, isDark && styles.darkSubtext]}>
            {periode.libelle}
          </Text>
        </View>
        
        <View style={[styles.healthBadge, { backgroundColor: `${healthColor}20` }]}>
          <View style={[styles.healthDot, { backgroundColor: healthColor }]} />
          <Text style={[styles.healthText, { color: healthColor }]}>
            {indicateurs.santeFinanciere}
          </Text>
        </View>
      </View>

      {/* Métriques principales */}
      <View style={styles.metricsGrid}>
        <View style={styles.metricItem}>
          <Text style={[styles.metricValue, isDark && styles.darkText]}>
            €{cashFlow.cashFlowNet.toLocaleString('fr-FR')}
          </Text>
          <Text style={[styles.metricLabel, isDark && styles.darkSubtext]}>
            Cash Flow
          </Text>
          <View style={[
            styles.trendIndicator,
            { backgroundColor: cashFlow.cashFlowNet >= 0 ? '#10B98120' : '#EF444420' }
          ]}>
            <Ionicons 
              name={cashFlow.cashFlowNet >= 0 ? 'trending-up' : 'trending-down'} 
              size={12} 
              color={cashFlow.cashFlowNet >= 0 ? '#10B981' : '#EF4444'} 
            />
            <Text style={[
              styles.trendText,
              { color: cashFlow.cashFlowNet >= 0 ? '#10B981' : '#EF4444' }
            ]}>
              {cashFlow.cashFlowNet >= 0 ? 'Excédent' : 'Déficit'}
            </Text>
          </View>
        </View>

        <View style={styles.metricItem}>
          <Text style={[styles.metricValue, isDark && styles.darkText]}>
            €{patrimoine.patrimoineNetLiquide.toLocaleString('fr-FR')}
          </Text>
          <Text style={[styles.metricLabel, isDark && styles.darkSubtext]}>
            Patrimoine Net
          </Text>
        </View>

        <View style={styles.metricItem}>
          <Text style={[styles.metricValue, isDark && styles.darkText]}>
            {indicateurs.tauxEpargne.toFixed(1)}%
          </Text>
          <Text style={[styles.metricLabel, isDark && styles.darkSubtext]}>
            Taux Épargne
          </Text>
        </View>

        <View style={styles.metricItem}>
          <Text style={[styles.metricValue, isDark && styles.darkText]}>
            {indicateurs.scoreGlobal}/100
          </Text>
          <Text style={[styles.metricLabel, isDark && styles.darkSubtext]}>
            Score Santé
          </Text>
        </View>
      </View>

      {!compact && (
        <>
          {/* Indicateurs de liquidité */}
          <View style={styles.liquiditySection}>
            <View style={styles.liquidityItem}>
              <Ionicons name="water" size={16} color="#3B82F6" />
              <Text style={[styles.liquidityLabel, isDark && styles.darkSubtext]}>
                Liquidité:
              </Text>
              <Text style={[styles.liquidityValue, isDark && styles.darkText]}>
                {indicateurs.liquiditeImmediate.toFixed(1)} mois
              </Text>
            </View>
            
            <View style={styles.liquidityItem}>
              <Ionicons name="shield-checkmark" size={16} color="#10B981" />
              <Text style={[styles.liquidityLabel, isDark && styles.darkSubtext]}>
                Couverture:
              </Text>
              <Text style={[styles.liquidityValue, isDark && styles.darkText]}>
                {indicateurs.couvertureChargesMois.toFixed(1)} mois
              </Text>
            </View>
          </View>

          {/* Recommandation principale */}
          {indicateurs.recommandations.length > 0 && (
            <View style={styles.recommendation}>
              <Ionicons name="bulb-outline" size={16} color="#F59E0B" />
              <Text style={[styles.recommendationText, isDark && styles.darkText]}>
                {indicateurs.recommandations[0]}
              </Text>
            </View>
          )}
        </>
      )}

      {/* Indicateur de clic */}
      {onPress && (
        <View style={styles.footer}>
          <Text style={[styles.viewDetails, isDark && styles.darkSubtext]}>
            Voir l'analyse détaillée →
          </Text>
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity 
        style={[styles.card, isDark && styles.darkCard]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <CardContent />
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.card, isDark && styles.darkCard]}>
      <CardContent />
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
  content: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  healthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  healthDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  healthText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  metricItem: {
    flex: 1,
    minWidth: '45%',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  trendIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 4,
    alignSelf: 'flex-start',
  },
  trendText: {
    fontSize: 10,
    fontWeight: '600',
  },
  liquiditySection: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  liquidityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liquidityLabel: {
    fontSize: 12,
    color: '#666',
  },
  liquidityValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
  recommendation: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 12,
    backgroundColor: '#FFFBEB',
    borderRadius: 8,
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 12,
    color: '#000',
    flex: 1,
    lineHeight: 16,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
    alignItems: 'center',
  },
  viewDetails: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    padding: 20,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
  },
  errorText: {
    fontSize: 14,
    color: '#000',
    flex: 1,
  },
  darkText: {
    color: '#F9FAFB',
  },
  darkSubtext: {
    color: '#9CA3AF',
  },
});

export default ProfessionalSummary;