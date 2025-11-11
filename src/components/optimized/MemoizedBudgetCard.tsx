// components/optimized/MemoizedBudgetCard.tsx
import React from 'react';
import { Budget } from '../../types';
import BudgetCard from '../budget/BudgetCard';

interface MemoizedBudgetCardProps {
  budget: Budget;
  onPress: (budget: Budget) => void;
  onLongPress: (id: string) => void;
  onToggle: (id: string, isActive: boolean) => void;
}

const MemoizedBudgetCard: React.FC<MemoizedBudgetCardProps> = React.memo(
  ({ budget, onPress, onLongPress, onToggle }) => {
    return (
      <BudgetCard
        budget={budget}
        onPress={onPress}
        onLongPress={onLongPress}
        onToggle={onToggle}
      />
    );
  },
  (prevProps, nextProps) => {
    // Ré-rendu seulement si les props importantes changent
    return (
      prevProps.budget.id === nextProps.budget.id &&
      prevProps.budget.spent === nextProps.budget.spent &&
      prevProps.budget.isActive === nextProps.budget.isActive &&
      prevProps.onPress === nextProps.onPress &&
      prevProps.onLongPress === nextProps.onLongPress &&
      prevProps.onToggle === nextProps.onToggle
    );
  }
);

export default MemoizedBudgetCard;