// /src/components/debts/AmortizationSchedule.tsx
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLanguage } from '../../context/LanguageContext';
import { Debt } from '../../types/Debt';

interface PaymentSchedule {
  month: number;
  date: string;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

interface Props {
  schedule: PaymentSchedule[];
  debt: Debt;
}

export const AmortizationSchedule = ({ schedule, debt }: Props) => {
  const { t } = useLanguage();
  const [showAll, setShowAll] = useState(false);
  
  const displayedSchedule = showAll ? schedule : schedule.slice(0, 6);
  const totalInterest = schedule.reduce((sum, payment) => sum + payment.interest, 0);

  if (schedule.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t.amortizationPlan}</Text>
        <View style={styles.summary}>
          <Text style={styles.summaryText}>
            {t.totalInterests}: <Text style={styles.summaryValue}>€{totalInterest.toFixed(2)}</Text>
          </Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          {/* En-tête du tableau */}
          <View style={styles.tableHeader}>
            <Text style={[styles.headerCell, styles.monthCell]}>{t.month}</Text>
            <Text style={[styles.headerCell, styles.dateCell]}>{t.date}</Text>
            <Text style={[styles.headerCell, styles.amountCell]}>{t.monthlyPaymentColumn}</Text>
            <Text style={[styles.headerCell, styles.amountCell]}>{t.capital}</Text>
            <Text style={[styles.headerCell, styles.amountCell]}>{t.interests}</Text>
            <Text style={[styles.headerCell, styles.amountCell]}>{t.remainingDue}</Text>
          </View>

          {/* Lignes du tableau */}
          {displayedSchedule.map((payment, index) => (
            <View 
              key={payment.month} 
              style={[
                styles.tableRow,
                index % 2 === 0 && styles.evenRow
              ]}
            >
              <Text style={[styles.cell, styles.monthCell]}>{payment.month}</Text>
              <Text style={[styles.cell, styles.dateCell]}>
                {new Date(payment.date).toLocaleDateString('fr-FR', { 
                  month: 'short', 
                  year: 'numeric' 
                })}
              </Text>
              <Text style={[styles.cell, styles.amountCell]}>€{payment.payment.toFixed(2)}</Text>
              <Text style={[styles.cell, styles.amountCell]}>€{payment.principal.toFixed(2)}</Text>
              <Text style={[styles.cell, styles.amountCell, styles.interestCell]}>
                €{payment.interest.toFixed(2)}
              </Text>
              <Text style={[styles.cell, styles.amountCell]}>
                €{payment.remainingBalance.toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bouton voir plus/moins */}
      {schedule.length > 6 && (
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setShowAll(!showAll)}
        >
          <Text style={styles.toggleButtonText}>
            {showAll ? t.seeLess : `${t.seeMore} ${schedule.length - 6} ${t.monthsCount}`}
          </Text>
        </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
  },
  summary: {
    backgroundColor: '#e8f4fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  summaryText: {
    fontSize: 12,
    color: '#2c3e50',
  },
  summaryValue: {
    fontWeight: '700',
    color: '#e74c3c',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  headerCell: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 12,
    fontWeight: '700',
    color: '#495057',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  evenRow: {
    backgroundColor: '#fafbfc',
  },
  cell: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontSize: 12,
    color: '#2c3e50',
    textAlign: 'center',
  },
  monthCell: {
    width: 50,
  },
  dateCell: {
    width: 80,
  },
  amountCell: {
    width: 90,
  },
  interestCell: {
    color: '#e74c3c',
    fontWeight: '600',
  },
  toggleButton: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  toggleButtonText: {
    color: '#3498db',
    fontSize: 14,
    fontWeight: '600',
  },
});