// src/hooks/useCategories.ts - VERSION CORRIGÉE
import { useCallback, useEffect, useState } from 'react';
import categoryService from '../services/categoryService';
import { Category, CreateCategoryData } from '../types';

interface UseCategoriesReturn {
  categories: Category[];
  loading: boolean;
  error: string | null;
  createCategory: (categoryData: CreateCategoryData) => Promise<string>;
  updateCategory: (id: string, categoryData: Partial<Omit<Category, 'id' | 'createdAt'>>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  getCategoriesByType: (type: 'expense' | 'income') => Promise<Category[]>;
  getCategoryById: (id: string) => Promise<Category | null>;
  initializeDefaultCategories: () => Promise<void>;
  refreshCategories: () => Promise<void>;
  getMainCategories: () => Promise<Category[]>;
  getSubcategories: (parentId: string) => Promise<Category[]>;
  getCategoryTree: () => Promise<Array<{ category: Category; subcategories: Category[] }>>;
  createMultipleCategories: (categoriesData: CreateCategoryData[]) => Promise<{ success: boolean; created: number; errors: string[] }>;
  // ✅ NOUVEAU : Forcer la réinitialisation
  forceResetCategories: () => Promise<void>;
  // ✅ NOUVEAU : Diagnostic
  diagnoseCategories: () => Promise<any>;
}

export const useCategories = (userId: string = 'default-user'): UseCategoriesReturn => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 [useCategories] Chargement des catégories...');
      
      const allCategories = await categoryService.getAllCategories(userId);
      console.log(`✅ [useCategories] ${allCategories.length} catégories chargées`);
      
      setCategories(allCategories);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      console.error('❌ [useCategories] Error loading categories:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // ✅ NOUVEAU : Forcer la réinitialisation
  const forceResetCategories = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      setLoading(true);
      
      const { categoryResetService } = await import('../services/categoryResetService');
      await categoryResetService.forceResetCategories(userId);
      
      await loadCategories();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId, loadCategories]);

  // ✅ NOUVEAU : Diagnostic
  const diagnoseCategories = useCallback(async (): Promise<any> => {
    try {
      const { categoryResetService } = await import('../services/categoryResetService');
      return await categoryResetService.diagnoseCategories(userId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      console.error('❌ [useCategories] Error diagnosing categories:', err);
      throw err;
    }
  }, [userId]);

  const createCategory = useCallback(async (categoryData: CreateCategoryData): Promise<string> => {
    try {
      setError(null);
      const id = await categoryService.createCategory(categoryData, userId);
      await loadCategories();
      return id;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      throw err;
    }
  }, [userId, loadCategories]);

  const updateCategory = useCallback(async (id: string, categoryData: Partial<Omit<Category, 'id' | 'createdAt'>>): Promise<void> => {
    try {
      setError(null);
      await categoryService.updateCategory(id, categoryData, userId);
      await loadCategories();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      throw err;
    }
  }, [userId, loadCategories]);

  const deleteCategory = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null);
      await categoryService.deleteCategory(id, userId);
      await loadCategories();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      throw err;
    }
  }, [userId, loadCategories]);

  const getCategoriesByType = useCallback(async (type: 'expense' | 'income'): Promise<Category[]> => {
    try {
      return await categoryService.getCategoriesByType(type, userId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      console.error('❌ [useCategories] Error getting categories by type:', err);
      throw err;
    }
  }, [userId]);

  const getCategoryById = useCallback(async (id: string): Promise<Category | null> => {
    try {
      return await categoryService.getCategoryById(id, userId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      console.error('❌ [useCategories] Error getting category by id:', err);
      throw err;
    }
  }, [userId]);

  const initializeDefaultCategories = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      await categoryService.initializeDefaultCategories(userId);
      await loadCategories();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      throw err;
    }
  }, [userId, loadCategories]);

  const refreshCategories = useCallback(async (): Promise<void> => {
    await loadCategories();
  }, [loadCategories]);

  const getMainCategories = useCallback(async (): Promise<Category[]> => {
    try {
      return await categoryService.getMainCategories(userId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      console.error('❌ [useCategories] Error getting main categories:', err);
      throw err;
    }
  }, [userId]);

  const getSubcategories = useCallback(async (parentId: string): Promise<Category[]> => {
    try {
      return await categoryService.getSubcategories(parentId, userId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      console.error('❌ [useCategories] Error getting subcategories:', err);
      throw err;
    }
  }, [userId]);

  const getCategoryTree = useCallback(async (): Promise<Array<{ category: Category; subcategories: Category[] }>> => {
    try {
      return await categoryService.getCategoryTree(userId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      console.error('❌ [useCategories] Error getting category tree:', err);
      throw err;
    }
  }, [userId]);

  const createMultipleCategories = useCallback(async (categoriesData: CreateCategoryData[]): Promise<{ success: boolean; created: number; errors: string[] }> => {
    try {
      setError(null);
      const result = await categoryService.createMultipleCategories(categoriesData, userId);
      await loadCategories();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      throw err;
    }
  }, [userId, loadCategories]);

  return {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoriesByType,
    getCategoryById,
    initializeDefaultCategories,
    refreshCategories,
    getMainCategories,
    getSubcategories,
    getCategoryTree,
    createMultipleCategories,
    // ✅ NOUVEAU
    forceResetCategories,
    diagnoseCategories,
  };
};

export default useCategories;