import { useNavigation } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useLanguage } from '../context/LanguageContext';

// Types pour les calculs d'épargne
interface SavingsSimulation {
  finalAmount: number;
  totalContributions: number;
  totalInterest: number;
}

interface SavingsProjection {
  month: number;
  total: number;
  interest: number;
}

interface SavingsScenario {
  scenario: string;
  monthlyContribution: number;
}

interface LumpSumImpact {
  difference: number;
}

// Fonctions de calcul d'épargne
const calculateMonthlySavingsNeeded = (
  targetAmount: number, 
  initialAmount: number, 
  annualInterestRate: number, 
  years: number
): number => {
  const monthlyRate = annualInterestRate / 100 / 12;
  const months = years * 12;
  
  if (monthlyRate === 0) {
    return (targetAmount - initialAmount) / months;
  }
  
  const futureValueFactor = Math.pow(1 + monthlyRate, months);
  return (targetAmount - initialAmount * futureValueFactor) * monthlyRate / (futureValueFactor - 1);
};

const simulateSavings = (
  initialAmount: number,
  monthlyContribution: number,
  annualInterestRate: number,
  years: number
): SavingsSimulation => {
  const monthlyRate = annualInterestRate / 100 / 12;
  const months = years * 12;
  let total = initialAmount;
  let totalInterest = 0;

  for (let i = 0; i < months; i++) {
    const monthlyInterest = total * monthlyRate;
    totalInterest += monthlyInterest;
    total += monthlyInterest + monthlyContribution;
  }

  return {
    finalAmount: total,
    totalContributions: initialAmount + (monthlyContribution * months),
    totalInterest: totalInterest
  };
};

const calculateSavingsProjection = (
  initialAmount: number,
  monthlyContribution: number,
  annualInterestRate: number,
  months: number
): SavingsProjection[] => {
  const monthlyRate = annualInterestRate / 100 / 12;
  let total = initialAmount;
  const projection: SavingsProjection[] = [];

  for (let month = 1; month <= months; month++) {
    const monthlyInterest = total * monthlyRate;
    total += monthlyInterest + monthlyContribution;
    
    projection.push({
      month,
      total,
      interest: monthlyInterest
    });
  }

  return projection;
};

const compareSavingsScenarios = (
  initialAmount: number,
  targetAmount: number,
  years: number
): SavingsScenario[] => {
  const scenarios = [
    { label: 'Conservative', rate: 2 },
    { label: 'Modéré', rate: 4 },
    { label: 'Dynamique', rate: 6 }
  ];

  return scenarios.map(scenario => ({
    scenario: scenario.label,
    monthlyContribution: calculateMonthlySavingsNeeded(
      targetAmount,
      initialAmount,
      scenario.rate,
      years
    )
  }));
};

const calculateLumpSumImpact = (
  initialAmount: number,
  monthlyContribution: number,
  annualInterestRate: number,
  lumpSum: number,
  years: number
): LumpSumImpact => {
  const withLumpSum = simulateSavings(
    initialAmount + lumpSum,
    monthlyContribution,
    annualInterestRate,
    years
  );
  
  const withoutLumpSum = simulateSavings(
    initialAmount,
    monthlyContribution,
    annualInterestRate,
    years
  );

  return {
    difference: withLumpSum.finalAmount - withoutLumpSum.finalAmount
  };
};

export const SavingsCalculatorScreen = () => {
  const { t } = useLanguage();
  const navigation = useNavigation();
  
  const [formData, setFormData] = useState({
    initialAmount: '',
    monthlyContribution: '',
    annualInterestRate: '2',
    years: '5',
    targetAmount: '',
  });

  const [showProjection, setShowProjection] = useState(false);

  // Calculs
  const simulation = useMemo(() => {
    if (!formData.initialAmount || !formData.monthlyContribution || !formData.annualInterestRate || !formData.years) {
      return null;
    }

    const initialAmount = parseFloat(formData.initialAmount) || 0;
    const monthlyContribution = parseFloat(formData.monthlyContribution) || 0;
    const annualInterestRate = parseFloat(formData.annualInterestRate) || 0;
    const years = parseFloat(formData.years) || 0;

    if (initialAmount < 0 || monthlyContribution < 0 || annualInterestRate < 0 || years <= 0) {
      return null;
    }

    return simulateSavings(initialAmount, monthlyContribution, annualInterestRate, years);
  }, [formData]);

  const monthlyNeeded = useMemo(() => {
    if (!formData.targetAmount || !formData.annualInterestRate || !formData.years) {
      return null;
    }

    const targetAmount = parseFloat(formData.targetAmount) || 0;
    const annualInterestRate = parseFloat(formData.annualInterestRate) || 0;
    const years = parseFloat(formData.years) || 0;

    if (targetAmount <= 0 || annualInterestRate < 0 || years <= 0) {
      return null;
    }

    return calculateMonthlySavingsNeeded(targetAmount, 0, annualInterestRate, years);
  }, [formData]);

  const projection = useMemo(() => {
    if (!simulation) return [];

    const initialAmount = parseFloat(formData.initialAmount) || 0;
    const monthlyContribution = parseFloat(formData.monthlyContribution) || 0;
    const annualInterestRate = parseFloat(formData.annualInterestRate) || 0;

    return calculateSavingsProjection(initialAmount, monthlyContribution, annualInterestRate, 60); // 5 ans
  }, [simulation, formData]);

  const scenarios = useMemo(() => {
    if (!formData.targetAmount || !formData.years) return [];

    const targetAmount = parseFloat(formData.targetAmount) || 0;
    const years = parseFloat(formData.years) || 0;

    return compareSavingsScenarios(0, targetAmount, years);
  }, [formData]);

  const lumpSumImpact = useMemo(() => {
    if (!simulation) return null;

    const initialAmount = parseFloat(formData.initialAmount) || 0;
    const monthlyContribution = parseFloat(formData.monthlyContribution) || 0;
    const annualInterestRate = parseFloat(formData.annualInterestRate) || 0;
    const years = parseFloat(formData.years) || 0;

    return calculateLumpSumImpact(initialAmount, monthlyContribution, annualInterestRate, 1000, years);
  }, [simulation, formData]);

  const updateFormData = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value.replace(',', '.') }));
  };

  const applyToNewGoal = () => {
    if (!monthlyNeeded) return;

    // Correction de l'erreur de navigation
    (navigation as any).navigate('AddSavingsGoal', {
      prefill: {
        monthlyContribution: monthlyNeeded.toString(),
        targetAmount: formData.targetAmount,
      }
    });
  };

  return (
    <View style={styles.container}>
      {/* Header personnalisé */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Calculateur d'Épargne</Text>
        <View style={styles.headerSpacer} />
      </View>
      
      <ScrollView style={styles.scrollView}>
        {/* Calculateur de projection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Projection d'Épargne</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Montant initial</Text>
            <View style={styles.amountInput}>
              <Text style={styles.currencySymbol}>€</Text>
              <TextInput
                style={styles.input}
                value={formData.initialAmount}
                onChangeText={(value) => updateFormData('initialAmount', value)}
                placeholder="0.00"
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contribution mensuelle</Text>
            <View style={styles.amountInput}>
              <Text style={styles.currencySymbol}>€</Text>
              <TextInput
                style={styles.input}
                value={formData.monthlyContribution}
                onChangeText={(value) => updateFormData('monthlyContribution', value)}
                placeholder="0.00"
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Taux d'intérêt annuel (%)</Text>
            <View style={styles.amountInput}>
              <TextInput
                style={styles.input}
                value={formData.annualInterestRate}
                onChangeText={(value) => updateFormData('annualInterestRate', value)}
                placeholder="2.0"
                keyboardType="decimal-pad"
              />
              <Text style={styles.percentSymbol}>%</Text>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Durée (années)</Text>
            <TextInput
              style={styles.input}
              value={formData.years}
              onChangeText={(value) => updateFormData('years', value)}
              placeholder="5"
              keyboardType="numeric"
            />
          </View>

          {simulation && (
            <View style={styles.resultsCard}>
              <Text style={styles.resultsTitle}>Résultats après {formData.years} ans</Text>
              
              <View style={styles.resultsGrid}>
                <View style={styles.resultItem}>
                  <Text style={styles.resultValue}>€{simulation.finalAmount.toFixed(0)}</Text>
                  <Text style={styles.resultLabel}>Montant final</Text>
                </View>
                
                <View style={styles.resultItem}>
                  <Text style={styles.resultValue}>€{simulation.totalContributions.toFixed(0)}</Text>
                  <Text style={styles.resultLabel}>Total versé</Text>
                </View>
                
                <View style={styles.resultItem}>
                  <Text style={styles.resultValue}>€{simulation.totalInterest.toFixed(0)}</Text>
                  <Text style={styles.resultLabel}>Intérêts gagnés</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.toggleButton}
                onPress={() => setShowProjection(!showProjection)}
              >
                <Text style={styles.toggleButtonText}>
                  {showProjection ? 'Masquer' : 'Voir'} la projection détaillée
                </Text>
              </TouchableOpacity>

              {showProjection && projection.length > 0 && (
                <View style={styles.projectionSection}>
                  <Text style={styles.projectionTitle}>Projection sur 5 ans</Text>
                  
                  <View style={styles.projectionHeader}>
                    <Text style={styles.projectionHeaderCell}>Année</Text>
                    <Text style={styles.projectionHeaderCell}>Total</Text>
                    <Text style={styles.projectionHeaderCell}>Intérêts</Text>
                  </View>

                  {projection.filter((_: SavingsProjection, index: number) => index % 12 === 11).map((item: SavingsProjection) => (
                    <View key={item.month} style={styles.projectionRow}>
                      <Text style={styles.projectionCell}>Année {Math.ceil(item.month / 12)}</Text>
                      <Text style={styles.projectionCell}>€{item.total.toFixed(0)}</Text>
                      <Text style={styles.projectionCell}>€{item.interest.toFixed(0)}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}
        </View>

        {/* Calculateur d'objectif */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Calculateur d'Objectif</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Montant cible</Text>
            <View style={styles.amountInput}>
              <Text style={styles.currencySymbol}>€</Text>
              <TextInput
                style={styles.input}
                value={formData.targetAmount}
                onChangeText={(value) => updateFormData('targetAmount', value)}
                placeholder="0.00"
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          {monthlyNeeded !== null && (
            <View style={styles.resultsCard}>
              <Text style={styles.resultsTitle}>Pour atteindre €{formData.targetAmount} en {formData.years} ans</Text>
              
              <View style={styles.monthlyNeeded}>
                <Text style={styles.monthlyNeededAmount}>€{monthlyNeeded.toFixed(2)}</Text>
                <Text style={styles.monthlyNeededLabel}>par mois</Text>
              </View>

              <TouchableOpacity
                style={styles.applyButton}
                onPress={applyToNewGoal}
              >
                <Text style={styles.applyButtonText}>Créer un objectif avec ce montant</Text>
              </TouchableOpacity>

              {/* Comparaison de scénarios */}
              {scenarios.length > 0 && (
                <View style={styles.scenariosSection}>
                  <Text style={styles.scenariosTitle}>Comparaison des scénarios</Text>
                  
                  {scenarios.map((scenario: SavingsScenario, index: number) => (
                    <View key={index} style={styles.scenarioItem}>
                      <Text style={styles.scenarioName}>{scenario.scenario}</Text>
                      <Text style={styles.scenarioAmount}>€{scenario.monthlyContribution.toFixed(2)}/mois</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}
        </View>

        {/* Impact d'un versement ponctuel */}
        {lumpSumImpact && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Impact d'un versement ponctuel</Text>
            
            <View style={styles.resultsCard}>
              <Text style={styles.lumpSumText}>
                Un versement ponctuel de <Text style={styles.highlight}>€1,000</Text> aujourd'hui vous rapporterait:
              </Text>
              
              <View style={styles.lumpSumImpact}>
                <Text style={styles.lumpSumAmount}>+ €{lumpSumImpact.difference.toFixed(0)}</Text>
                <Text style={styles.lumpSumLabel}>dans {formData.years} ans</Text>
              </View>
            </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 18,
    color: '#007AFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  section: {
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
  resultsCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 16,
    textAlign: 'center',
  },
  resultsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  resultItem: {
    alignItems: 'center',
  },
  resultValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 4,
  },
  resultLabel: {
    fontSize: 12,
    color: '#6c757d',
  },
  toggleButton: {
    paddingVertical: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  toggleButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  projectionSection: {
    marginTop: 16,
  },
  projectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },
  projectionHeader: {
    flexDirection: 'row',
    backgroundColor: '#e9ecef',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  projectionHeaderCell: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#495057',
    textAlign: 'center',
  },
  projectionRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  projectionCell: {
    flex: 1,
    fontSize: 12,
    color: '#2c3e50',
    textAlign: 'center',
  },
  monthlyNeeded: {
    alignItems: 'center',
    marginBottom: 16,
  },
  monthlyNeededAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#28a745',
    marginBottom: 4,
  },
  monthlyNeededLabel: {
    fontSize: 14,
    color: '#6c757d',
  },
  applyButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  scenariosSection: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingTop: 16,
  },
  scenariosTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },
  scenarioItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  scenarioName: {
    fontSize: 14,
    color: '#495057',
  },
  scenarioAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  lumpSumText: {
    fontSize: 14,
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 20,
  },
  highlight: {
    fontWeight: '700',
    color: '#007AFF',
  },
  lumpSumImpact: {
    alignItems: 'center',
  },
  lumpSumAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#28a745',
    marginBottom: 4,
  },
  lumpSumLabel: {
    fontSize: 14,
    color: '#6c757d',
  },
});

export default SavingsCalculatorScreen;