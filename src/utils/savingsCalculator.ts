// /src/utils/savingsCalculator.ts
export interface SavingsProjection {
  month: number;
  date: string;
  contribution: number;
  interest: number;
  total: number;
  principal: number;
}

export interface SavingsSimulation {
  initialAmount: number;
  monthlyContribution: number;
  annualInterestRate: number;
  years: number;
  totalContributions: number;
  totalInterest: number;
  finalAmount: number;
}

/**
 * Calcule la projection d'épargne avec intérêts composés
 */
export const calculateSavingsProjection = (
  initialAmount: number,
  monthlyContribution: number,
  annualInterestRate: number,
  months: number = 60
): SavingsProjection[] => {
  const projection: SavingsProjection[] = [];
  const monthlyRate = annualInterestRate / 100 / 12;
  let total = initialAmount;
  let totalContributions = initialAmount;

  for (let month = 1; month <= months; month++) {
    const interest = total * monthlyRate;
    total += interest + monthlyContribution;
    totalContributions += monthlyContribution;

    const date = new Date();
    date.setMonth(date.getMonth() + month);

    projection.push({
      month,
      date: date.toISOString().split('T')[0],
      contribution: monthlyContribution,
      interest,
      total,
      principal: totalContributions,
    });

    // Arrêter si on atteint un montant déraisonnable (sécurité)
    if (total > 1000000000) break;
  }

  return projection;
};

/**
 * Simule un scénario d'épargne complet
 */
export const simulateSavings = (
  initialAmount: number,
  monthlyContribution: number,
  annualInterestRate: number,
  years: number
): SavingsSimulation => {
  const months = years * 12;
  const monthlyRate = annualInterestRate / 100 / 12;
  
  let total = initialAmount;
  let totalInterest = 0;

  for (let month = 1; month <= months; month++) {
    const interest = total * monthlyRate;
    total += interest + monthlyContribution;
    totalInterest += interest;
  }

  const totalContributions = initialAmount + (monthlyContribution * months);

  return {
    initialAmount,
    monthlyContribution,
    annualInterestRate,
    years,
    totalContributions,
    totalInterest,
    finalAmount: total,
  };
};

/**
 * Calcule le montant mensuel nécessaire pour atteindre un objectif
 */
export const calculateMonthlySavingsNeeded = (
  targetAmount: number,
  currentAmount: number,
  annualInterestRate: number,
  years: number
): number => {
  if (years <= 0) return targetAmount - currentAmount;
  
  const months = years * 12;
  const monthlyRate = annualInterestRate / 100 / 12;
  
  if (monthlyRate === 0) {
    return (targetAmount - currentAmount) / months;
  }

  const futureValueFactor = Math.pow(1 + monthlyRate, months);
  const monthlyPayment = (targetAmount - currentAmount * futureValueFactor) / 
                        ((futureValueFactor - 1) / monthlyRate);

  return Math.max(0, monthlyPayment);
};

/**
 * Calcule le temps nécessaire pour atteindre un objectif
 */
export const calculateTimeToGoal = (
  targetAmount: number,
  currentAmount: number,
  monthlyContribution: number,
  annualInterestRate: number
): { years: number; months: number; date: string } => {
  if (monthlyContribution <= 0) {
    return { years: 999, months: 999, date: new Date().toISOString().split('T')[0] };
  }

  const monthlyRate = annualInterestRate / 100 / 12;
  let balance = currentAmount;
  let months = 0;

  while (balance < targetAmount && months < 1200) { // Max 100 ans
    const interest = balance * monthlyRate;
    balance += interest + monthlyContribution;
    months++;
  }

  const achievementDate = new Date();
  achievementDate.setMonth(achievementDate.getMonth() + months);

  return {
    years: Math.floor(months / 12),
    months: months % 12,
    date: achievementDate.toISOString().split('T')[0],
  };
};

/**
 * Compare différents scénarios d'épargne
 */
export const compareSavingsScenarios = (
  initialAmount: number,
  targetAmount: number,
  years: number
): Array<{
  scenario: string;
  monthlyContribution: number;
  finalAmount: number;
  totalContributions: number;
  totalInterest: number;
}> => {
  const scenarios = [];

  // Scénario 1: Pas d'intérêts
  const noInterest = calculateMonthlySavingsNeeded(targetAmount, initialAmount, 0, years);
  const sim1 = simulateSavings(initialAmount, noInterest, 0, years);
  scenarios.push({
    scenario: 'Sans intérêts',
    monthlyContribution: noInterest,
    finalAmount: sim1.finalAmount,
    totalContributions: sim1.totalContributions,
    totalInterest: sim1.totalInterest,
  });

  // Scénario 2: Intérêts faibles (1%)
  const lowInterest = calculateMonthlySavingsNeeded(targetAmount, initialAmount, 1, years);
  const sim2 = simulateSavings(initialAmount, lowInterest, 1, years);
  scenarios.push({
    scenario: 'Intérêts faibles (1%)',
    monthlyContribution: lowInterest,
    finalAmount: sim2.finalAmount,
    totalContributions: sim2.totalContributions,
    totalInterest: sim2.totalInterest,
  });

  // Scénario 3: Intérêts moyens (3%)
  const mediumInterest = calculateMonthlySavingsNeeded(targetAmount, initialAmount, 3, years);
  const sim3 = simulateSavings(initialAmount, mediumInterest, 3, years);
  scenarios.push({
    scenario: 'Intérêts moyens (3%)',
    monthlyContribution: mediumInterest,
    finalAmount: sim3.finalAmount,
    totalContributions: sim3.totalContributions,
    totalInterest: sim3.totalInterest,
  });

  // Scénario 4: Intérêts élevés (5%)
  const highInterest = calculateMonthlySavingsNeeded(targetAmount, initialAmount, 5, years);
  const sim4 = simulateSavings(initialAmount, highInterest, 5, years);
  scenarios.push({
    scenario: 'Intérêts élevés (5%)',
    monthlyContribution: highInterest,
    finalAmount: sim4.finalAmount,
    totalContributions: sim4.totalContributions,
    totalInterest: sim4.totalInterest,
  });

  return scenarios.map(scenario => ({
    ...scenario,
    monthlyContribution: Math.round(scenario.monthlyContribution * 100) / 100,
    finalAmount: Math.round(scenario.finalAmount * 100) / 100,
    totalContributions: Math.round(scenario.totalContributions * 100) / 100,
    totalInterest: Math.round(scenario.totalInterest * 100) / 100,
  }));
};

/**
 * Calcule l'impact d'une contribution ponctuelle
 */
export const calculateLumpSumImpact = (
  currentAmount: number,
  monthlyContribution: number,
  annualInterestRate: number,
  lumpSumAmount: number,
  years: number
): { withLumpSum: number; withoutLumpSum: number; difference: number } => {
  const withLumpSum = simulateSavings(currentAmount + lumpSumAmount, monthlyContribution, annualInterestRate, years);
  const withoutLumpSum = simulateSavings(currentAmount, monthlyContribution, annualInterestRate, years);

  return {
    withLumpSum: withLumpSum.finalAmount,
    withoutLumpSum: withoutLumpSum.finalAmount,
    difference: withLumpSum.finalAmount - withoutLumpSum.finalAmount,
  };
};