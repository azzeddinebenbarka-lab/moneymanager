// /src/components/savings/ContributionHistory.tsx
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useCurrency } from '../../context/CurrencyContext';
import { useLanguage } from '../../context/LanguageContext';
import { SavingsContribution, SavingsGoal } from '../../types/Savings';

interface Props {
  contributions: SavingsContribution[];
  goal: SavingsGoal;
}

export const ContributionHistory = ({ contributions, goal }: Props) => {
  const { formatAmount } = useCurrency();
  const { t } = useLanguage();

  if (contributions.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{t.contributionHistory}</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>💸</Text>
          <Text style={styles.emptyText}>{t.noContribution || 'Aucune contribution pour le moment'}</Text>
          <Text style={styles.emptySubtext}>
            {t.addFirstContribution || 'Commencez par ajouter votre première contribution'}
          </Text>
        </View>
      </View>
    );
  }

  // Grouper les contributions par mois
  const groupedContributions = contributions.reduce((groups, contribution) => {
    const date = new Date(contribution.date);
    const monthYear = date.toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'long' 
    });
    
    if (!groups[monthYear]) {
      groups[monthYear] = [];
    }
    
    groups[monthYear].push(contribution);
    return groups;
  }, {} as Record<string, SavingsContribution[]>);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t.contributionHistory}</Text>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {Object.entries(groupedContributions).map(([monthYear, monthContributions]) => {
          const totalMonth = monthContributions.reduce((sum, contrib) => sum + contrib.amount, 0);
          
          return (
            <View key={monthYear} style={styles.monthGroup}>
              <View style={styles.monthHeader}>
                <Text style={styles.monthTitle}>{monthYear}</Text>
                <Text style={styles.monthTotal}>{formatAmount(totalMonth)}</Text>
              </View>
              
              {monthContributions.map((contribution) => (
                <View key={contribution.id} style={styles.contributionItem}>
                  <View style={styles.contributionLeft}>
                    <Text style={styles.contributionDate}>
                      {new Date(contribution.date).toLocaleDateString('fr-FR', { 
                        day: 'numeric'
                      })}
                    </Text>
                    <Text style={styles.contributionDay}>
                      {new Date(contribution.date).toLocaleDateString('fr-FR', { 
                        weekday: 'short' 
                      })}
                    </Text>
                  </View>
                  
                  <View style={styles.contributionCenter}>
                    <Text style={styles.contributionLabel}>{t.contribution}</Text>
                    <Text style={styles.contributionTime}>
                      {t.addedOn || 'Ajoutée le'} {new Date(contribution.createdAt).toLocaleDateString('fr-FR')}
                    </Text>
                  </View>
                  
                  <View style={styles.contributionRight}>
                    <Text style={styles.contributionAmount}>
                      +{formatAmount(contribution.amount)}
                    </Text>
                    <Text style={styles.contributionProgress}>
                      {((contribution.amount / goal.targetAmount) * 100).toFixed(1)}%
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          );
        })}
      </ScrollView>

      {/* Résumé */}
      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>{t.totalContributed || 'Total contribué'}</Text>
          <Text style={styles.summaryValue}>
            {formatAmount(goal.currentAmount)}
          </Text>
        </View>
        
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>{t.numberOfContributions || 'Nombre de contributions'}</Text>
          <Text style={styles.summaryValue}>{contributions.length}</Text>
        </View>
        
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>{t.averagePerContribution || 'Moyenne par contribution'}</Text>
          <Text style={styles.summaryValue}>
            {formatAmount(goal.currentAmount / Math.max(contributions.length, 1))}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 16,
  },
  scrollView: {
    maxHeight: 400,
  },
  monthGroup: {
    marginBottom: 20,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    marginBottom: 8,
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  monthTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: '#28a745',
  },
  contributionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  contributionLeft: {
    alignItems: 'center',
    marginRight: 12,
    minWidth: 40,
  },
  contributionDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  contributionDay: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 2,
  },
  contributionCenter: {
    flex: 1,
  },
  contributionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: 2,
  },
  contributionTime: {
    fontSize: 12,
    color: '#6c757d',
  },
  contributionRight: {
    alignItems: 'flex-end',
  },
  contributionAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#28a745',
    marginBottom: 2,
  },
  contributionProgress: {
    fontSize: 12,
    color: '#6c757d',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#adb5bd',
    textAlign: 'center',
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingTop: 16,
    marginTop: 16,
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 4,
    textAlign: 'center',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    textAlign: 'center',
  },
});