// src/types/Category.ts - VERSION AVEC SOUS-CATÉGORIES
export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  icon: string;
  color: string;
  parentId?: string;
  level: number;
  sortOrder: number;
  isActive: boolean;
  budget: number;
  createdAt: string;
}

export interface CategoryStats {
  totalSpent: number;
  totalBudget: number;
  transactionCount: number;
  averageAmount: number;
  subcategoriesCount: number;
}

export interface CategoryTree {
  category: Category;
  subcategories: Category[];
}

export interface CreateCategoryData {
  name: string;
  type: 'income' | 'expense';
  icon: string;
  color: string;
  parentId?: string;
  level?: number;
  sortOrder?: number;
  budget?: number;
  isActive?: boolean;
}