// /src/components/savings/SavingsStats.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SavingsStats as SavingsStatsType } from '../../types/Savings';

interface Props {
  stats: SavingsStatsType | null;
}

export const SavingsStats = ({ stats }: Props) => {
  if (!stats) {
    return null;
  }
 
  return (
    <View style={styles.container}>
      <View style={styles.mainStat}>
        <Text style={styles.totalSaved}>€{stats.totalSaved.toLocaleString()}</Text>
        <Text style={styles.totalLabel}>Total Épargné</Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill,
                { width: `${Math.min(stats.progressPercentage, 100)}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {stats.progressPercentage.toFixed(1)}% de l'objectif global
          </Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.totalGoals}</Text>
          <Text style={styles.statLabel}>Objectifs</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.completedGoals}</Text>
          <Text style={styles.statLabel}>Terminés</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>€{stats.monthlyContributions.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Mensuel</Text>
        </View>
      </View>

      {/* Objectifs à venir */}
      {stats.upcomingGoals.length > 0 && (
        <View style={styles.upcomingSection}>
          <Text style={styles.upcomingTitle}>Objectifs à venir</Text>
          {stats.upcomingGoals.slice(0, 2).map((goal) => (
            <View key={goal.id} style={styles.upcomingGoal}>
              <Text style={styles.upcomingGoalName}>{goal.name}</Text>
              <Text style={styles.upcomingGoalDate}>
                {new Date(goal.targetDate).toLocaleDateString('fr-FR', { 
                  day: 'numeric', 
                  month: 'short' 
                })}
              </Text>
            </View>
          ))}
        </View>
      )}
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
  mainStat: {
    alignItems: 'center',
    marginBottom: 20,
  },
  totalSaved: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 4,
  },
  totalLabel: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 12,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#e9ecef',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#6c757d',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  upcomingSection: {
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingTop: 16,
  },
  upcomingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  upcomingGoal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  upcomingGoalName: {
    fontSize: 14,
    color: '#495057',
    flex: 1,
  },
  upcomingGoalDate: {
    fontSize: 12,
    color: '#6c757d',
  },
});