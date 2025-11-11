export interface SavingsGoal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  monthlyContribution: number;
  category: 'vacation' | 'emergency' | 'house' | 'car' | 'education' | 'retirement' | 'other';
  color: string;
  icon: string;
  isCompleted: boolean;
  createdAt: string;
  // ✅ AJOUTÉ : Compte d'épargne associé
  savingsAccountId?: string;
  // ✅ AJOUTÉ : Compte source des contributions
  contributionAccountId?: string;
}

export interface SavingsAccount {
  id: string;
  userId: string;
  name: string;
  balance: number;
  interestRate: number;
  type: 'savings' | 'investment' | 'retirement';
  color: string;
  createdAt: string;
}

export interface SavingsStats {
  totalSaved: number;
  totalGoals: number;
  completedGoals: number;
  monthlyContributions: number;
  progressPercentage: number;
  upcomingGoals: SavingsGoal[];
}

export interface SavingsContribution {
  id: string;
  goalId: string;
  amount: number;
  date: string;
  createdAt: string;
  // ✅ NOUVEAU : Compte source
  fromAccountId?: string;
}

export interface CreateSavingsGoalData {
  name: string;
  targetAmount: number;
  targetDate: string;
  monthlyContribution: number;
  category: SavingsGoal['category'];
  color: string;
  icon: string;
  // ✅ AJOUTÉ
  savingsAccountId?: string;
  contributionAccountId?: string;
}

export interface UpdateSavingsGoalData {
  name?: string;
  targetAmount?: number;
  currentAmount?: number;
  targetDate?: string;
  monthlyContribution?: number;
  category?: SavingsGoal['category'];
  color?: string;
  icon?: string;
  isCompleted?: boolean;
  savingsAccountId?: string;
  contributionAccountId?: string;
}