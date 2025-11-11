// src/hooks/useCategories.ts - VERSION CORRIGÉE
import { useCallback, useEffect, useState } from 'react';
import categoryService from '../services/categoryService';
import { Category } from '../types';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const categoriesData = await categoryService.getAllCategories();
      setCategories(categoriesData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(`Erreur lors du chargement des catégories: ${errorMessage}`);
      console.error('Error loading categories:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCategory = useCallback(async (categoryData: Omit<Category, 'id' | 'createdAt'>) => {
    try {
      setError(null);
      await categoryService.createCategory(categoryData);
      await loadCategories(); // Recharger après création
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(`Erreur lors de la création de la catégorie: ${errorMessage}`);
      console.error('Error creating category:', err);
      throw err;
    }
  }, [loadCategories]);

  const updateCategory = useCallback(async (id: string, categoryData: Omit<Category, 'id' | 'createdAt'>) => {
    try {
      setError(null);
      await categoryService.updateCategory(id, categoryData);
      await loadCategories(); // Recharger après mise à jour
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(`Erreur lors de la mise à jour de la catégorie: ${errorMessage}`);
      console.error('Error updating category:', err);
      throw err;
    }
  }, [loadCategories]);

  const deleteCategory = useCallback(async (id: string) => {
    try {
      setError(null);
      await categoryService.deleteCategory(id);
      await loadCategories(); // Recharger après suppression
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(`Erreur lors de la suppression de la catégorie: ${errorMessage}`);
      console.error('Error deleting category:', err);
      throw err;
    }
  }, [loadCategories]);

  const getCategoryById = useCallback(async (id: string): Promise<Category | null> => {
    try {
      setError(null);
      return await categoryService.getCategoryById(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(`Erreur lors de la récupération de la catégorie: ${errorMessage}`);
      console.error('Error getting category by id:', err);
      return null;
    }
  }, []);

  const getCategoriesByType = useCallback(async (type: 'expense' | 'income'): Promise<Category[]> => {
    try {
      setError(null);
      return await categoryService.getCategoriesByType(type);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(`Erreur lors de la récupération des catégories: ${errorMessage}`);
      console.error('Error getting categories by type:', err);
      return [];
    }
  }, []);

  const initializeDefaultCategories = useCallback(async () => {
    try {
      setError(null);
      await categoryService.initializeDefaultCategories();
      await loadCategories(); // Recharger après initialisation
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(`Erreur lors de l'initialisation des catégories: ${errorMessage}`);
      console.error('Error initializing default categories:', err);
      throw err;
    }
  }, [loadCategories]);

  const searchCategories = useCallback(async (searchTerm: string): Promise<Category[]> => {
    try {
      setError(null);
      return await categoryService.searchCategories(searchTerm);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(`Erreur lors de la recherche des catégories: ${errorMessage}`);
      console.error('Error searching categories:', err);
      return [];
    }
  }, []);

  const getCategoryStats = useCallback(async () => {
    try {
      setError(null);
      return await categoryService.getCategoryStats();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(`Erreur lors de la récupération des statistiques: ${errorMessage}`);
      console.error('Error getting category stats:', err);
      throw err;
    }
  }, []);

  const isCategoryUsed = useCallback(async (categoryId: string): Promise<boolean> => {
    try {
      setError(null);
      return await categoryService.isCategoryUsed(categoryId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(`Erreur lors de la vérification de la catégorie: ${errorMessage}`);
      console.error('Error checking if category is used:', err);
      return false;
    }
  }, []);

  // Charger les catégories au démarrage
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return {
    // État
    categories,
    loading,
    error,
    
    // Actions CRUD
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
    
    // Recherche et filtres
    getCategoriesByType,
    searchCategories,
    
    // Utilitaires
    initializeDefaultCategories,
    getCategoryStats,
    isCategoryUsed,
    
    // Rafraîchissement
    refreshCategories: loadCategories,
  };
};