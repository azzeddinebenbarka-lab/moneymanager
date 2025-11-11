// ===== TYPES POUR LE DASHBOARD PROFESSIONNEL =====

export interface CashFlowMetrics {
  revenus: number;
  depensesCourantes: number;
  chargesFixes: number;
  paiementsDettes: number;
  epargneProgrammee: number;
  cashFlowNet: number;
  dateCalcul: string;
}

export interface PatrimoineMetrics {
  soldeComptesCourants: number;
  epargneLongTerme: number;
  fondsChargesAnnuelles: number;
  totalDettes: number;
  patrimoineNetLiquide: number;
  actifsLiquides: number;
  actifsInvestis: number;
  dateCalcul: string;
}

export interface BudgetChargesMetrics {
  fondsDisponible: number;
  chargesMoisCourant: number;
  soldeApresCharges: number;
  epargneMensuelleRequise: number;
  moisCouverts: number;
  prochaineCharge?: {
    nom: string;
    montant: number;
    date: string;
    joursRestants: number;
  };
}

export interface FinancialHealthIndicators {
  tauxEpargne: number;
  ratioDettesRevenus: number;
  couvertureChargesMois: number;
  liquiditeImmediate: number;
  santeFinanciere: 'EXCELLENT' | 'BON' | 'ATTENTION' | 'CRITIQUE';
  scoreGlobal: number;
  recommandations: string[];
}

export interface ProfessionalDashboardData {
  cashFlow: CashFlowMetrics;
  patrimoine: PatrimoineMetrics;
  budgetCharges: BudgetChargesMetrics;
  indicateurs: FinancialHealthIndicators;
  periode: {
    annee: number;
    mois: number;
    libelle: string;
  };
}

// Types pour les calculs intermédiaires
export interface CalculDonneesBrutes {
  transactions: any[];
  comptes: any[];
  dettes: any[];
  objectifsEpargne: any[];
  chargesAnnuelles: any[];
  budgets: any[];
}

// Types pour les filtres professionnels
export interface ProfessionalFilters {
  annee: number;
  mois: number;
  compteId?: string;
  inclurePrevisions: boolean;
  modeCalcul: 'conservateur' | 'realiste' | 'optimiste';
}