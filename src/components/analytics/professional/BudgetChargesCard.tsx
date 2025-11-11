import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../context/ThemeContext';
import { BudgetChargesMetrics } from '../../../types/ProfessionalDashboard';

interface BudgetChargesCardProps {
  data: BudgetChargesMetrics;
  isDark: boolean;
}

export const BudgetChargesCard: React.FC<BudgetChargesCardProps> = ({ data, isDark }) => {
  const formatCurrency = (amount: number): string => {
    return `€${Math.abs(amount).toLocaleString('fr-FR')}`;
  };

  const getCouvertureColor = (mois: number): string => {
    if (mois >= 6) return '#10B981';
    if (mois >= 3) return '#F59E0B';
    return '#EF4444';
  };

  const getCouvertureIcon = (mois: number): keyof typeof Ionicons.glyphMap => {
    if (mois >= 6) return 'shield-checkmark';
    if (mois >= 3) return 'shield-half';
    return 'shield';
  };

  return (
    <View style={[styles.card, isDark && styles.darkCard]}>
      {/* En-tête */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons name="calendar" size={20} color="#6366F1" />
          <Text style={[styles.title, isDark && styles.darkText]}>
            Budget Charges Annuelles
          </Text>
        </View>
        <View style={[
          styles.couvertureBadge,
          { backgroundColor: `${getCouvertureColor(data.moisCouverts)}20` }
        ]}>
          <Ionicons 
            name={getCouvertureIcon(data.moisCouverts)} 
            size={16} 
            color={getCouvertureColor(data.moisCouverts)} 
          />
          <Text style={[
            styles.couvertureText,
            { color: getCouvertureColor(data.moisCouverts) }
          ]}>
            {data.moisCouverts.toFixed(1)} mois
          </Text>
        </View>
      </View>

      {/* État du fonds */}
      <View style={styles.fundsSection}>
        <View style={styles.fundItem}>
          <View style={styles.fundInfo}>
            <Ionicons name="wallet" size={20} color="#3B82F6" />
            <View>
              <Text style={[styles.fundLabel, isDark && styles.darkText]}>
                Fonds disponible
              </Text>
              <Text style={[styles.fundDescription, isDark && styles.darkSubtext]}>
                Total épargné pour les charges
              </Text>
            </View>
          </View>
          <Text style={[styles.fundAmount, isDark && styles.darkText]}>
            {formatCurrency(data.fondsDisponible)}
          </Text>
        </View>

        <View style={styles.fundItem}>
          <View style={styles.fundInfo}>
            <Ionicons name="cash" size={20} color="#EF4444" />
            <View>
              <Text style={[styles.fundLabel, isDark && styles.darkText]}>
                Charges ce mois
              </Text>
              <Text style={[styles.fundDescription, isDark && styles.darkSubtext]}>
                Échéances du mois courant
              </Text>
            </View>
          </View>
          <Text style={[styles.fundAmount, { color: '#EF4444' }]}>
            -{formatCurrency(data.chargesMoisCourant)}
          </Text>
        </View>

        <View style={styles.fundItem}>
          <View style={styles.fundInfo}>
            <Ionicons name="trending-up" size={20} color="#10B981" />
            <View>
              <Text style={[styles.fundLabel, isDark && styles.darkText]}>
                Solde après charges
              </Text>
              <Text style={[styles.fundDescription, isDark && styles.darkSubtext]}>
                Fonds restant ce mois
              </Text>
            </View>
          </View>
          <Text style={[styles.fundAmount, { color: '#10B981' }]}>
            {formatCurrency(data.soldeApresCharges)}
          </Text>
        </View>
      </View>

      {/* Objectif d'épargne mensuel */}
      <View style={styles.savingsGoal}>
        <View style={styles.savingsHeader}>
          <Text style={[styles.savingsTitle, isDark && styles.darkText]}>
            Épargne mensuelle recommandée
          </Text>
          <Text style={[styles.savingsAmount, isDark && styles.darkText]}>
            {formatCurrency(data.epargneMensuelleRequise)}
          </Text>
        </View>
        <Text style={[styles.savingsDescription, isDark && styles.darkSubtext]}>
          Montant à épargner chaque mois pour couvrir toutes vos charges annuelles
        </Text>
      </View>

      {/* Jauge de couverture */}
      <View style={styles.coverageGauge}>
        <View style={styles.gaugeHeader}>
          <Text style={[styles.gaugeTitle, isDark && styles.darkText]}>
            Niveau de couverture
          </Text>
          <Text style={[
            styles.gaugeValue,
            { color: getCouvertureColor(data.moisCouverts) }
          ]}>
            {data.moisCouverts.toFixed(1)} mois
          </Text>
        </View>
        
        <View style={styles.gaugeContainer}>
          <View style={styles.gaugeBackground}>
            <View 
              style={[
                styles.gaugeFill,
                { 
                  width: `${Math.min(100, (data.moisCouverts / 12) * 100)}%`,
                  backgroundColor: getCouvertureColor(data.moisCouverts)
                }
              ]} 
            />
          </View>
          
          <View style={styles.gaugeMarkers}>
            <View style={styles.gaugeMarker}>
              <View style={[styles.markerDot, { backgroundColor: '#EF4444' }]} />
              <Text style={[styles.markerLabel, isDark && styles.darkSubtext]}>0</Text>
            </View>
            <View style={styles.gaugeMarker}>
              <View style={[styles.markerDot, { backgroundColor: '#F59E0B' }]} />
              <Text style={[styles.markerLabel, isDark && styles.darkSubtext]}>3</Text>
            </View>
            <View style={styles.gaugeMarker}>
              <View style={[styles.markerDot, { backgroundColor: '#10B981' }]} />
              <Text style={[styles.markerLabel, isDark && styles.darkSubtext]}>6</Text>
            </View>
            <View style={styles.gaugeMarker}>
              <View style={[styles.markerDot, { backgroundColor: '#10B981' }]} />
              <Text style={[styles.markerLabel, isDark && styles.darkSubtext]}>12</Text>
            </View>
          </View>
        </View>

        <View style={styles.gaugeStatus}>
          {data.moisCouverts < 3 && (
            <Text style={[styles.statusText, { color: '#EF4444' }]}>
              ⚠️ Couverture insuffisante
            </Text>
          )}
          {data.moisCouverts >= 3 && data.moisCouverts < 6 && (
            <Text style={[styles.statusText, { color: '#F59E0B' }]}>
              ⚠️ Couverture minimale
            </Text>
          )}
          {data.moisCouverts >= 6 && (
            <Text style={[styles.statusText, { color: '#10B981' }]}>
              ✅ Bonne couverture
            </Text>
          )}
        </View>
      </View>

      {/* Prochaine charge à venir */}
      {data.prochaineCharge && (
        <View style={styles.nextCharge}>
          <View style={styles.nextChargeHeader}>
            <Ionicons name="alert-circle" size={20} color="#F59E0B" />
            <Text style={[styles.nextChargeTitle, isDark && styles.darkText]}>
              Prochaine échéance
            </Text>
          </View>
          
          <View style={styles.nextChargeDetails}>
            <View>
              <Text style={[styles.chargeName, isDark && styles.darkText]}>
                {data.prochaineCharge.nom}
              </Text>
              <Text style={[styles.chargeDate, isDark && styles.darkSubtext]}>
                {new Date(data.prochaineCharge.date).toLocaleDateString('fr-FR')}
              </Text>
            </View>
            
            <View style={styles.chargeRight}>
              <Text style={[styles.chargeAmount, isDark && styles.darkText]}>
                {formatCurrency(data.prochaineCharge.montant)}
              </Text>
              <View style={[
                styles.daysBadge,
                { 
                  backgroundColor: data.prochaineCharge.joursRestants <= 7 ? '#EF444420' : '#F59E0B20' 
                }
              ]}>
                <Text style={[
                  styles.daysText,
                  { color: data.prochaineCharge.joursRestants <= 7 ? '#EF4444' : '#F59E0B' }
                ]}>
                  {data.prochaineCharge.joursRestants}j
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Recommandations */}
      <View style={styles.recommendations}>
        <Text style={[styles.recommendationsTitle, isDark && styles.darkText]}>
          Recommandations
        </Text>
        
        {data.moisCouverts < 3 && (
          <View style={styles.recommendationItem}>
            <Ionicons name="warning" size={16} color="#EF4444" />
            <Text style={[styles.recommendationText, isDark && styles.darkText]}>
              Augmentez votre épargne mensuelle pour atteindre au moins 3 mois de couverture
            </Text>
          </View>
        )}
        
        {data.epargneMensuelleRequise > data.fondsDisponible / 12 && (
          <View style={styles.recommendationItem}>
            <Ionicons name="calculator" size={16} color="#F59E0B" />
            <Text style={[styles.recommendationText, isDark && styles.darkText]}>
              Votre épargne actuelle ne couvre pas les charges prévues
            </Text>
          </View>
        )}
        
        {data.moisCouverts >= 6 && (
          <View style={styles.recommendationItem}>
            <Ionicons name="checkmark-circle" size={16} color="#10B981" />
            <Text style={[styles.recommendationText, isDark && styles.darkText]}>
              Excellente gestion de votre fonds de charges annuelles
            </Text>
          </View>
        )}
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
  couvertureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  couvertureText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  fundsSection: {
    gap: 16,
    marginBottom: 20,
  },
  fundItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fundInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  fundLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  fundDescription: {
    fontSize: 12,
    color: '#666',
  },
  fundAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  savingsGoal: {
    backgroundColor: '#F0FDF4',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  savingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  savingsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  savingsAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10B981',
  },
  savingsDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  coverageGauge: {
    marginBottom: 20,
  },
  gaugeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  gaugeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  gaugeValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  gaugeContainer: {
    marginBottom: 8,
  },
  gaugeBackground: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    marginBottom: 12,
    overflow: 'hidden',
  },
  gaugeFill: {
    height: '100%',
    borderRadius: 4,
  },
  gaugeMarkers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gaugeMarker: {
    alignItems: 'center',
  },
  markerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginBottom: 4,
  },
  markerLabel: {
    fontSize: 10,
    color: '#666',
  },
  gaugeStatus: {
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  nextCharge: {
    backgroundColor: '#FFFBEB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  nextChargeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  nextChargeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  nextChargeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chargeName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  chargeDate: {
    fontSize: 12,
    color: '#666',
  },
  chargeRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  chargeAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  daysBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  daysText: {
    fontSize: 10,
    fontWeight: '600',
  },
  recommendations: {
    gap: 8,
  },
  recommendationsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  recommendationText: {
    fontSize: 12,
    color: '#000',
    flex: 1,
    lineHeight: 16,
  },
  darkText: {
    color: '#F9FAFB',
  },
  darkSubtext: {
    color: '#9CA3AF',
  },
});

export default BudgetChargesCard;