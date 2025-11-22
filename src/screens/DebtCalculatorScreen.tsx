// src/screens/DebtCalculatorScreen.tsx - VERSION COMPLÈTE AVEC EXPORT PAR DÉFAUT
import { useNavigation } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Header } from '../components/ui/Header';
import { useLanguage } from '../context/LanguageContext';
import { calculateAmortizationSchedule, calculateDebtFreeDate } from '../utils/debtCalculator';

const DebtCalculatorScreen = () => {
  const { t } = useLanguage();
  const navigation = useNavigation();
  
  const [formData, setFormData] = useState({
    debtAmount: '',
    interestRate: '',
    monthlyPayment: '',
    extraPayment: '0',
  });
 
  const results = useMemo(() => {
    if (!formData.debtAmount || !formData.interestRate || !formData.monthlyPayment) {
      return null;
    }

    const amount = parseFloat(formData.debtAmount);
    const interestRate = parseFloat(formData.interestRate);
    const monthlyPayment = parseFloat(formData.monthlyPayment);
    const extraPayment = parseFloat(formData.extraPayment);

    if (amount <= 0 || interestRate < 0 || monthlyPayment <= 0) {
      return null;
    }

    const totalMonthlyPayment = monthlyPayment + extraPayment;
    
    try {
      const schedule = calculateAmortizationSchedule(
        amount,
        interestRate,
        totalMonthlyPayment
      );

      const debtFreeDate = calculateDebtFreeDate(schedule);
      const totalInterest = schedule.reduce((sum, payment) => sum + payment.interest, 0);
      const totalPaid = amount + totalInterest;

      return {
        schedule,
        debtFreeDate,
        totalInterest,
        totalPaid,
        months: schedule.length,
      };
    } catch (error) {
      console.error('Error calculating schedule:', error);
      return null;
    }
  }, [formData]);

  const updateFormData = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value.replace(',', '.') }));
  };

  const applyToNewDebt = () => {
    if (!results) return;

    (navigation as any).navigate('AddDebt', {
      prefill: {
        initialAmount: formData.debtAmount,
        interestRate: formData.interestRate,
        monthlyPayment: formData.monthlyPayment,
      }
    });
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Calculateur de Dettes"
        onBack={() => navigation.goBack()}
      />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Paramètres de la Dette</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Montant de la dette</Text>
            <View style={styles.amountInput}>
              <Text style={styles.currencySymbol}>€</Text>
              <TextInput
                style={styles.input}
                value={formData.debtAmount}
                onChangeText={(value) => updateFormData('debtAmount', value)}
                keyboardType="decimal-pad"
                placeholder="0.00"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Taux d'intérêt annuel (%)</Text>
            <View style={styles.amountInput}>
              <TextInput
                style={styles.input}
                value={formData.interestRate}
                onChangeText={(value) => updateFormData('interestRate', value)}
                keyboardType="decimal-pad"
                placeholder="5.0"
              />
              <Text style={styles.percentSymbol}>%</Text>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Paiement mensuel</Text>
            <View style={styles.amountInput}>
              <Text style={styles.currencySymbol}>€</Text>
              <TextInput
                style={styles.input}
                value={formData.monthlyPayment}
                onChangeText={(value) => updateFormData('monthlyPayment', value)}
                keyboardType="decimal-pad"
                placeholder="0.00"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Paiement supplémentaire (optionnel)</Text>
            <View style={styles.amountInput}>
              <Text style={styles.currencySymbol}>€</Text>
              <TextInput
                style={styles.input}
                value={formData.extraPayment}
                onChangeText={(value) => updateFormData('extraPayment', value)}
                keyboardType="decimal-pad"
                placeholder="0.00"
              />
            </View>
          </View>
        </View>

        {results && (
          <View style={styles.resultsSection}>
            <Text style={styles.sectionTitle}>Résultats du Calcul</Text>
            
            <View style={styles.resultsGrid}>
              <View style={styles.resultCard}>
                <Text style={styles.resultValue}>{results.months}</Text>
                <Text style={styles.resultLabel}>Mois</Text>
              </View>
              
              <View style={styles.resultCard}>
                <Text style={styles.resultValue}>€{results.totalInterest.toFixed(2)}</Text>
                <Text style={styles.resultLabel}>Intérêts totaux</Text>
              </View>
              
              <View style={styles.resultCard}>
                <Text style={styles.resultValue}>€{results.totalPaid.toFixed(2)}</Text>
                <Text style={styles.resultLabel}>Total payé</Text>
              </View>
              
              <View style={styles.resultCard}>
                <Text style={styles.resultValue}>
                  {new Date(results.debtFreeDate).toLocaleDateString('fr-FR')}
                </Text>
                <Text style={styles.resultLabel}>Libération</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.applyButton} onPress={applyToNewDebt}>
              <Text style={styles.applyButtonText}>Appliquer à une nouvelle dette</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  formSection: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
  },
  amountInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7f8c8d',
    marginRight: 8,
  },
  percentSymbol: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7f8c8d',
    marginLeft: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2c3e50',
  },
  resultsSection: {
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
  resultsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
    marginBottom: 16,
  },
  resultCard: {
    width: '50%',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  resultValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3498db',
    textAlign: 'center',
    marginBottom: 4,
  },
  resultLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  applyButton: {
    backgroundColor: '#3498db',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

// ✅ CORRECTION : Export par défaut ajouté
export default DebtCalculatorScreen;