// /src/components/debts/DebtStats.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DebtStats as DebtStatsType } from '../../types/Debt';

interface Props {
  stats: DebtStatsType;
}

export const DebtStats = ({ stats }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>€{stats.totalDebt.toLocaleString()}</Text>
        <Text style={styles.statLabel}>Dette Totale</Text>
      </View>
      
      <View style={styles.statItem}>
        <Text style={styles.statValue}>€{stats.monthlyPayment.toLocaleString()}</Text>
        <Text style={styles.statLabel}>Mensualité</Text>
      </View>
      
      <View style={styles.statItem}>
        <Text style={[styles.statValue, styles.debtFreeDate]}>
          {new Date(stats.debtFreeDate).toLocaleDateString('fr-FR', { 
            month: 'short', 
            year: 'numeric' 
          })}
        </Text>
        <Text style={styles.statLabel}>Fin prévue</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2c3e50',
  },
  debtFreeDate: {
    color: '#e74c3c',
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 4,
  },
});