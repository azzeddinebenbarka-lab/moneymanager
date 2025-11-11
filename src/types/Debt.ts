// src/types/Debt.ts - VERSION COMPLÈTE AVEC SYSTÈME D'ÉCHÉANCES STRICTES
export interface Debt {
  id: string;
  userId: string;
  name: string;
  creditor: string;
  initialAmount: number;
  currentAmount: number;
  interestRate: number;
  monthlyPayment: number;
  startDate: string;
  dueDate: string; // Date d'échéance complète
  nextPaymentDate?: string;
  dueMonth: string; // Format "YYYY-MM" pour filtrage par mois
  status: 'active' | 'paid' | 'overdue' | 'future';
  category: string;
  color: string;
  notes?: string;
  createdAt: string;
  nextDueDate?: string;
  
  // ✅ NOUVEAUX CHAMPS POUR LA PHASE 2 - SYSTÈME D'ÉCHÉANCES
  type: 'personal' | 'mortgage' | 'car' | 'student' | 'credit_card' | 'other';
  autoPay: boolean;
  paymentAccountId?: string;
  
  // ✅ SYSTÈME D'ÉLIGIBILITÉ STRICTE
  paymentEligibility: {
    isEligible: boolean;
    reason?: string;
    nextEligibleDate?: string;
    dueMonth: string; // Mois d'échéance "YYYY-MM"
    isCurrentMonth: boolean; // Si c'est le mois d'échéance actuel
    isPastDue: boolean; // Si la date est passée
    isFutureDue: boolean; // Si c'est une dette future
  };
  
  // ✅ INFORMATIONS DE CALCUL
  remainingMonths?: number;
  totalInterest?: number;
  debtFreeDate?: string;
}

export interface DebtPayment {
  id: string;
  debtId: string;
  amount: number;
  paymentDate: string;
  paymentStatus: 'completed' | 'pending' | 'failed';
  createdAt: string;
  fromAccountId?: string;
  principal: number;
  interest: number;
  remainingBalance: number;
  paymentMonth: string; // "YYYY-MM" du paiement
}

export interface CreateDebtData {
  name: string;
  creditor: string;
  initialAmount: number;
  interestRate: number;
  monthlyPayment: number;
  startDate: string;
  dueDate: string;
  category: string;
  color: string;
  notes?: string;
  type: Debt['type'];
  autoPay?: boolean;
  paymentAccountId?: string;
}

export interface UpdateDebtData {
  name?: string;
  creditor?: string;
  initialAmount?: number;
  currentAmount?: number;
  interestRate?: number;
  monthlyPayment?: number;
  startDate?: string;
  dueDate?: string;
  dueMonth?: string;
  status?: Debt['status'];
  category?: string;
  color?: string;
  notes?: string;
  type?: Debt['type'];
  autoPay?: boolean;
  paymentAccountId?: string;
}

export interface DebtStats {
  totalDebt: number;
  monthlyPayment: number;
  paidDebts: number;
  activeDebts: number;
  overdueDebts: number;
  futureDebts: number;
  totalInterest: number;
  totalRemaining: number;
  totalPaid: number;
  interestPaid: number;
  debtFreeDate: string;
  progressPercentage: number;
  dueThisMonth: number;
  totalDueThisMonth: number;
  upcomingDebts: Debt[];
}

// ✅ INTERFACE POUR L'ÉLIGIBILITÉ AU PAIEMENT
export interface PaymentEligibility {
  isEligible: boolean;
  reason?: string;
  nextEligibleDate?: string;
  dueMonth: string;
  isCurrentMonth: boolean;
  isPastDue: boolean;
  isFutureDue: boolean;
}

// ✅ TYPES DE DETTE
export const DEBT_TYPES = [
  { value: 'personal', label: 'Prêt Personnel', icon: 'person' },
  { value: 'mortgage', label: 'Hypothèque', icon: 'home' },
  { value: 'car', label: 'Prêt Voiture', icon: 'car' },
  { value: 'student', label: 'Prêt Étudiant', icon: 'school' },
  { value: 'credit_card', label: 'Carte de Crédit', icon: 'card' },
  { value: 'other', label: 'Autre', icon: 'receipt' },
] as const;

export type DebtType = typeof DEBT_TYPES[number]['value'];

// ✅ CATÉGORIES DE DETTE
export const DEBT_CATEGORIES = [
  'Prêt personnel',
  'Hypothèque', 
  'Voiture',
  'Éducation',
  'Carte de crédit',
  'Médical',
  'Familial',
  'Autre'
] as const;

// ✅ STATUTS DE DETTE AVEC DESCRIPTIONS
export const DEBT_STATUSES = {
  active: { label: 'Active', color: '#3B82F6', description: 'Dette en cours de remboursement' },
  overdue: { label: 'En retard', color: '#EF4444', description: 'Dette non payée à la date d\'échéance' },
  paid: { label: 'Payée', color: '#10B981', description: 'Dette entièrement remboursée' },
  future: { label: 'Future', color: '#F59E0B', description: 'Dette dont l\'échéance est dans le futur' },
} as const;

// ✅ RÈGLES D'ÉCHÉANCE POUR LA PHASE 2
export const DEBT_ELIGIBILITY_RULES = {
  // Dette ancienne : Ne sera PAS traitée avant son mois d'échéance
  PAST_DUE: 'Période de paiement expirée. Cette dette est en retard et nécessite une régularisation manuelle.',
  
  // Dette du mois en cours : Sera traitée normalement
  CURRENT_MONTH: 'Paiement autorisé pendant le mois d\'échéance',
  
  // Dette future : Attend son mois d'échéance
  FUTURE: 'Paiement disponible seulement pendant le mois d\'échéance',
  
  // Paiement manuel : Impossible si hors période
  MANUAL_PAYMENT_DISABLED: 'Paiement manuel non autorisé hors période d\'échéance',
} as const;