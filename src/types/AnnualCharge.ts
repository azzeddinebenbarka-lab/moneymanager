export interface AnnualCharge {
  id: string;
  userId: string;
  name: string;
  amount: number;
  category: string;
  dueDate: string;
  isPaid: boolean;
  createdAt: string;
  notes?: string;
  paymentMethod?: string;
  recurrence?: 'yearly' | 'monthly' | 'quarterly';
  reminderDays?: number;
  // ✅ AJOUTÉ : Compte pour le paiement
  accountId?: string;
  // ✅ AJOUTÉ : Prélèvement automatique
  autoDeduct?: boolean;
}

export interface AnnualChargeStats {
  totalCharges: number;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  upcomingCharges: AnnualCharge[];
  overdueCharges: AnnualCharge[];
}

export interface CreateAnnualChargeData {
  name: string;
  amount: number;
  dueDate: string;
  category: string;
  reminderDays?: number;
  // ✅ AJOUTÉ
  accountId?: string;
  autoDeduct?: boolean;
  notes?: string;
  paymentMethod?: string;
  recurrence?: 'yearly' | 'monthly' | 'quarterly';
}

export interface UpdateAnnualChargeData {
  name?: string;
  amount?: number;
  dueDate?: string;
  category?: string;
  isPaid?: boolean;
  reminderDays?: number;
  // ✅ AJOUTÉ
  accountId?: string;
  autoDeduct?: boolean;
  notes?: string;
  paymentMethod?: string;
  recurrence?: 'yearly' | 'monthly' | 'quarterly';
}