import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../context/ThemeContext';
import { PatrimoineMetrics } from '../../../types/ProfessionalDashboard';

interface PatrimoineCardProps {
  data: PatrimoineMetrics;
  isDark: boolean;
}

export const PatrimoineCard: React.FC<PatrimoineCardProps> = ({ data, isDark }) => {
  const formatCurrency = (amount: number): string => {
    return `${amount >= 0 ? '' : '-'}€${Math.abs(amount).toLocaleString('fr-FR')}`;
  };

  const getPatrimoineColor = (patrimoine: number): string => {
    return patrimoine >= 0 ? '#10B981' : '#EF4444';
  };

  // Calcul des pourcentages pour le graphique
  const totalActifs = data.soldeComptesCourants + data.epargneLongTerme + data.fondsChargesAnnuelles;
  const pourcentageComptes = totalActifs > 0 ? (data.soldeComptesCourants / totalActifs) * 100 : 0;
  const pourcentageEpargne = totalActifs > 0 ? (data.epargneLongTerme / totalActifs) * 100 : 0;
  const pourcentageFonds = totalActifs > 0 ? (data.fondsChargesAnnuelles / totalActifs) * 100 : 0;

  return (
    <View style={[styles.card, isDark && styles.darkCard]}>
      {/* En-tête */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons name="trending-up" size={20} color="#6366F1" />
          <Text style={[styles.title, isDark && styles.darkText]}>
            Patrimoine Net
          </Text>
        </View>
        <View style={[
          styles.patrimoineBadge,
          { backgroundColor: `${getPatrimoineColor(data.patrimoineNetLiquide)}20` }
        ]}>
          <Text style={[
            styles.patrimoineValue,
            { color: getPatrimoineColor(data.patrimoineNetLiquide) }
          ]}>
            {formatCurrency(data.patrimoineNetLiquide)}
          </Text>
        </View>
      </View>

      {/* Graphique de répartition */}
      <View style={styles.chartSection}>
        <Text style={[styles.chartTitle, isDark && styles.darkText]}>
          Répartition des Actifs
        </Text>
        
        <View style={styles.chartBars}>
          {/* Comptes courants */}
          <View style={styles.chartBarContainer}>
            <View style={styles.chartBarLabels}>
              <Text style={[styles.chartBarLabel, isDark && styles.darkSubtext]}>
                Comptes courants
              </Text>
              <Text style={[styles.chartBarValue, isDark && styles.darkText]}>
                {formatCurrency(data.soldeComptesCourants)}
              </Text>
            </View>
            <View style={styles.chartBarBackground}>
              <View 
                style={[
                  styles.chartBarFill,
                  { 
                    width: `${pourcentageComptes}%`,
                    backgroundColor: '#3B82F6'
                  }
                ]} 
              />
            </View>
            <Text style={[styles.chartBarPercentage, isDark && styles.darkSubtext]}>
              {pourcentageComptes.toFixed(1)}%
            </Text>
          </View>

          {/* Épargne long terme */}
          <View style={styles.chartBarContainer}>
            <View style={styles.chartBarLabels}>
              <Text style={[styles.chartBarLabel, isDark && styles.darkSubtext]}>
                Épargne long terme
              </Text>
              <Text style={[styles.chartBarValue, isDark && styles.darkText]}>
                {formatCurrency(data.epargneLongTerme)}
              </Text>
            </View>
            <View style={styles.chartBarBackground}>
              <View 
                style={[
                  styles.chartBarFill,
                  { 
                    width: `${pourcentageEpargne}%`,
                    backgroundColor: '#10B981'
                  }
                ]} 
              />
            </View>
            <Text style={[styles.chartBarPercentage, isDark && styles.darkSubtext]}>
              {pourcentageEpargne.toFixed(1)}%
            </Text>
          </View>

          {/* Fonds charges annuelles */}
          <View style={styles.chartBarContainer}>
            <View style={styles.chartBarLabels}>
              <Text style={[styles.chartBarLabel, isDark && styles.darkSubtext]}>
                Fonds charges
              </Text>
              <Text style={[styles.chartBarValue, isDark && styles.darkText]}>
                {formatCurrency(data.fondsChargesAnnuelles)}
              </Text>
            </View>
            <View style={styles.chartBarBackground}>
              <View 
                style={[
                  styles.chartBarFill,
                  { 
                    width: `${pourcentageFonds}%`,
                    backgroundColor: '#8B5CF6'
                  }
                ]} 
              />
            </View>
            <Text style={[styles.chartBarPercentage, isDark && styles.darkSubtext]}>
              {pourcentageFonds.toFixed(1)}%
            </Text>
          </View>
        </View>
      </View>

      {/* Détails actifs/passifs */}
      <View style={styles.detailsGrid}>
        <View style={styles.detailColumn}>
          <Text style={[styles.detailTitle, isDark && styles.darkText]}>
            ACTIFS
          </Text>
          
          <View style={styles.detailItem}>
            <View style={[styles.dot, { backgroundColor: '#3B82F6' }]} />
            <Text style={[styles.detailLabel, isDark && styles.darkSubtext]}>
              Comptes courants
            </Text>
            <Text style={[styles.detailAmount, isDark && styles.darkText]}>
              {formatCurrency(data.soldeComptesCourants)}
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <View style={[styles.dot, { backgroundColor: '#10B981' }]} />
            <Text style={[styles.detailLabel, isDark && styles.darkSubtext]}>
              Épargne long terme
            </Text>
            <Text style={[styles.detailAmount, isDark && styles.darkText]}>
              {formatCurrency(data.epargneLongTerme)}
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <View style={[styles.dot, { backgroundColor: '#8B5CF6' }]} />
            <Text style={[styles.detailLabel, isDark && styles.darkSubtext]}>
              Fonds charges
            </Text>
            <Text style={[styles.detailAmount, isDark && styles.darkText]}>
              {formatCurrency(data.fondsChargesAnnuelles)}
            </Text>
          </View>

          <View style={[styles.detailTotal, { borderTopColor: '#10B981' }]}>
            <Text style={[styles.detailTotalLabel, isDark && styles.darkText]}>
              Total actifs
            </Text>
            <Text style={[styles.detailTotalAmount, { color: '#10B981' }]}>
              {formatCurrency(totalActifs)}
            </Text>
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.detailColumn}>
          <Text style={[styles.detailTitle, isDark && styles.darkText]}>
            PASSIFS
          </Text>
          
          <View style={styles.detailItem}>
            <View style={[styles.dot, { backgroundColor: '#EF4444' }]} />
            <Text style={[styles.detailLabel, isDark && styles.darkSubtext]}>
              Dettes totales
            </Text>
            <Text style={[styles.detailAmount, isDark && styles.darkText]}>
              {formatCurrency(data.totalDettes)}
            </Text>
          </View>

          <View style={[styles.detailTotal, { borderTopColor: '#EF4444' }]}>
            <Text style={[styles.detailTotalLabel, isDark && styles.darkText]}>
              Total passifs
            </Text>
            <Text style={[styles.detailTotalAmount, { color: '#EF4444' }]}>
              {formatCurrency(data.totalDettes)}
            </Text>
          </View>

          {/* Patrimoine net */}
          <View style={styles.netWorthSection}>
            <Text style={[styles.netWorthLabel, isDark && styles.darkText]}>
              PATRIMOINE NET
            </Text>
            <Text style={[
              styles.netWorthValue,
              { color: getPatrimoineColor(data.patrimoineNetLiquide) }
            ]}>
              {formatCurrency(data.patrimoineNetLiquide)}
            </Text>
          </View>
        </View>
      </View>

      {/* Indicateurs de liquidité */}
      <View style={styles.liquidityIndicators}>
        <View style={styles.liquidityItem}>
          <Ionicons name="water" size={16} color="#3B82F6" />
          <Text style={[styles.liquidityLabel, isDark && styles.darkSubtext]}>
            Actifs liquides:
          </Text>
          <Text style={[styles.liquidityValue, isDark && styles.darkText]}>
            {formatCurrency(data.actifsLiquides)}
          </Text>
        </View>
        
        <View style={styles.liquidityItem}>
          <Ionicons name="trending-up" size={16} color="#10B981" />
          <Text style={[styles.liquidityLabel, isDark && styles.darkSubtext]}>
            Actifs investis:
          </Text>
          <Text style={[styles.liquidityValue, isDark && styles.darkText]}>
            {formatCurrency(data.actifsInvestis)}
          </Text>
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
  patrimoineBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  patrimoineValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  chartSection: {
    marginBottom: 24,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  chartBars: {
    gap: 12,
  },
  chartBarContainer: {
    gap: 6,
  },
  chartBarLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chartBarLabel: {
    fontSize: 12,
    color: '#666',
  },
  chartBarValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
  chartBarBackground: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  chartBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  chartBarPercentage: {
    fontSize: 10,
    color: '#666',
    textAlign: 'right',
  },
  detailsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  detailColumn: {
    flex: 1,
  },
  detailTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  detailAmount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
  detailTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 2,
    marginTop: 8,
  },
  detailTotalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
  detailTotalAmount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  separator: {
    width: 1,
    backgroundColor: '#E5E7EB',
  },
  netWorthSection: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    alignItems: 'center',
  },
  netWorthLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  netWorthValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  liquidityIndicators: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
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
  darkText: {
    color: '#F9FAFB',
  },
  darkSubtext: {
    color: '#9CA3AF',
  },
});

export default PatrimoineCard;