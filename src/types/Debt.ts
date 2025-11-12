// src/types/Debt.ts - VERSION COMPLÈTEMENT CORRIGÉE
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
  dueDate: string;
  dueMonth: string;
  status: 'active' | 'overdue' | 'paid' | 'future';
  category: string;
  color: string;
  notes?: string;
  createdAt: string;
  nextDueDate?: string;
  type: DebtType;
  autoPay: boolean;
  paymentAccountId?: string;
  paymentEligibility: PaymentEligibility;
}

export interface CreateDebtData {
  name: string;
  creditor: string;
  initialAmount: number;
  interestRate: number;
  monthlyPayment: number;
  startDate: string;
  dueDate: string;
  type: DebtType;
  category: string;
  color: string;
  notes?: string;
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
  type?: DebtType;
  autoPay?: boolean;
  paymentAccountId?: string;
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
  paymentMonth: string;
}

export interface PaymentEligibility {
  isEligible: boolean;
  reason: string;
  nextEligibleDate?: string;
  dueMonth: string;
  isCurrentMonth: boolean;
  isPastDue: boolean;
  isFutureDue: boolean;
}

export type DebtType = 'personal' | 'mortgage' | 'car' | 'education' | 'credit_card' | 'medical' | 'business' | 'other';

export const DEBT_TYPES: { value: DebtType; label: string }[] = [
  { value: 'personal', label: 'Prêt personnel' },
  { value: 'mortgage', label: 'Hypothèque' },
  { value: 'car', label: 'Voiture' },
  { value: 'education', label: 'Éducation' },
  { value: 'credit_card', label: 'Carte de crédit' },
  { value: 'medical', label: 'Médical' },
  { value: 'business', label: 'Professionnel' },
  { value: 'other', label: 'Autre' }
];

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