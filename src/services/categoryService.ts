import { Category, CreateCategoryData } from '../types';
import { getDatabase } from './database/sqlite';

export interface DatabaseCategory extends Category {
  user_id: string;
  parent_id?: string;
  is_active: number;
  level: number;
  sort_order: number;
}

// Helper pour créer une catégorie avec tous les champs requis
const createCategoryRecord = (
  id: string,
  name: string, 
  type: 'income' | 'expense',
  color: string,
  icon: string,
  level: number,
  sortOrder: number,
  parentId?: string
): Category => ({
  id,
  name,
  type,
  color,
  icon,
  parentId,
  level,
  sortOrder,
  isActive: true,
  createdAt: new Date().toISOString()
});

// ✅ LES 50 NOUVELLES CATÉGORIES DÉFINITIVES (celles que tu as demandées)
const allCategories: Category[] = [
  // ==============================
  // 1. REVENUS (Catégories principales)
  // ==============================
  createCategoryRecord('cat_income_salary', '💼 Salaire', 'income', '#52C41A', 'briefcase', 0, 1),
  createCategoryRecord('cat_income_secondary', '📈 Revenus secondaires', 'income', '#52C41A', 'trending-up', 0, 2),

  // Sous-catégories Salaire
  createCategoryRecord('cat_income_salary_net', 'Salaire net', 'income', '#52C41A', 'cash', 1, 3, 'cat_income_salary'),
  createCategoryRecord('cat_income_salary_bonus', 'Primes / heures sup', 'income', '#52C41A', 'trophy', 1, 4, 'cat_income_salary'),

  // Sous-catégories Revenus secondaires
  createCategoryRecord('cat_income_freelance', 'Freelance', 'income', '#52C41A', 'laptop', 1, 5, 'cat_income_secondary'),
  createCategoryRecord('cat_income_commerce', 'Commerce / ventes', 'income', '#52C41A', 'storefront', 1, 6, 'cat_income_secondary'),
  createCategoryRecord('cat_income_commissions', 'Commissions', 'income', '#52C41A', 'trending-up', 1, 7, 'cat_income_secondary'),

  // ==============================
  // 2. DÉPENSES MENSUELLES (Catégories principales)
  // ==============================
  createCategoryRecord('cat_expense_housing', '🏠 Logement & Charges', 'expense', '#45B7D1', 'home', 0, 8),
  createCategoryRecord('cat_expense_food', '🛒 Nourriture & Courses (T9edya)', 'expense', '#FFA940', 'cart', 0, 9),
  createCategoryRecord('cat_expense_transport', '🚗 Transport & Voiture', 'expense', '#FA8C16', 'car', 0, 10),
  createCategoryRecord('cat_expense_health', '💊 Santé', 'expense', '#FF4D4F', 'medical', 0, 11),
  createCategoryRecord('cat_expense_child', '👶 Enfant', 'expense', '#FF85C0', 'happy', 0, 12),
  createCategoryRecord('cat_expense_subscriptions', '📱 Abonnements', 'expense', '#722ED1', 'phone-portrait', 0, 13),
  createCategoryRecord('cat_expense_personal', '👤 Dépenses personnelles', 'expense', '#13C2C2', 'person', 0, 14),
  createCategoryRecord('cat_expense_house', '🏡 Maison', 'expense', '#96CEB4', 'hammer', 0, 15),
  createCategoryRecord('cat_expense_misc', '🎁 Divers & imprévus', 'expense', '#95A5A6', 'gift', 0, 16),

  // Sous-catégories Logement & Charges
  createCategoryRecord('cat_expense_housing_rent', 'Loyer / Crédit maison', 'expense', '#45B7D1', 'home', 1, 17, 'cat_expense_housing'),
  createCategoryRecord('cat_expense_housing_electricity', 'Électricité', 'expense', '#45B7D1', 'flash', 1, 18, 'cat_expense_housing'),
  createCategoryRecord('cat_expense_housing_water', 'Eau', 'expense', '#45B7D1', 'water', 1, 19, 'cat_expense_housing'),
  createCategoryRecord('cat_expense_housing_internet', 'Wifi / Internet', 'expense', '#45B7D1', 'wifi', 1, 20, 'cat_expense_housing'),
  createCategoryRecord('cat_expense_housing_syndic', 'Syndic', 'expense', '#45B7D1', 'document', 1, 21, 'cat_expense_housing'),

  // Sous-catégories Nourriture & Courses
  createCategoryRecord('cat_expense_food_groceries', 'Épicerie', 'expense', '#FFA940', 'basket', 1, 22, 'cat_expense_food'),
  createCategoryRecord('cat_expense_food_vegetables', 'Légumes / fruits', 'expense', '#FFA940', 'nutrition', 1, 23, 'cat_expense_food'),
  createCategoryRecord('cat_expense_food_meat', 'Viande / poisson', 'expense', '#FFA940', 'fish', 1, 24, 'cat_expense_food'),
  createCategoryRecord('cat_expense_food_cleaning', 'Produits ménagers', 'expense', '#FFA940', 'sparkles', 1, 25, 'cat_expense_food'),

  // Sous-catégories Transport & Voiture
  createCategoryRecord('cat_expense_transport_fuel', 'Carburant', 'expense', '#FA8C16', 'speedometer', 1, 26, 'cat_expense_transport'),
  createCategoryRecord('cat_expense_transport_maintenance', 'Entretien', 'expense', '#FA8C16', 'build', 1, 27, 'cat_expense_transport'),
  createCategoryRecord('cat_expense_transport_insurance', 'Assurance', 'expense', '#FA8C16', 'shield', 1, 28, 'cat_expense_transport'),
  createCategoryRecord('cat_expense_transport_wash', 'Lavage', 'expense', '#FA8C16', 'water', 1, 29, 'cat_expense_transport'),
  createCategoryRecord('cat_expense_transport_parking', 'Parking', 'expense', '#FA8C16', 'car-sport', 1, 30, 'cat_expense_transport'),

  // Sous-catégories Santé
  createCategoryRecord('cat_expense_health_pharmacy', 'Pharmacie', 'expense', '#FF4D4F', 'medkit', 1, 31, 'cat_expense_health'),
  createCategoryRecord('cat_expense_health_consultation', 'Analyse / consultation', 'expense', '#FF4D4F', 'medical', 1, 32, 'cat_expense_health'),
  createCategoryRecord('cat_expense_health_insurance', 'Assurance maladie', 'expense', '#FF4D4F', 'shield', 1, 33, 'cat_expense_health'),

  // Sous-catégories Enfant
  createCategoryRecord('cat_expense_child_food', 'Nourriture', 'expense', '#FF85C0', 'restaurant', 1, 34, 'cat_expense_child'),
  createCategoryRecord('cat_expense_child_hygiene', 'Hygiène', 'expense', '#FF85C0', 'sparkles', 1, 35, 'cat_expense_child'),
  createCategoryRecord('cat_expense_child_school', 'École / crèche', 'expense', '#FF85C0', 'school', 1, 36, 'cat_expense_child'),
  createCategoryRecord('cat_expense_child_leisure', 'Loisirs', 'expense', '#FF85C0', 'game-controller', 1, 37, 'cat_expense_child'),

  // Sous-catégories Abonnements
  createCategoryRecord('cat_expense_subscriptions_phone', 'Téléphone', 'expense', '#722ED1', 'call', 1, 38, 'cat_expense_subscriptions'),
  createCategoryRecord('cat_expense_subscriptions_apps', 'Applications', 'expense', '#722ED1', 'apps', 1, 39, 'cat_expense_subscriptions'),
  createCategoryRecord('cat_expense_subscriptions_streaming', 'Streaming', 'expense', '#722ED1', 'tv', 1, 40, 'cat_expense_subscriptions'),

  // Sous-catégories Dépenses personnelles
  createCategoryRecord('cat_expense_personal_clothes', 'Vêtements', 'expense', '#13C2C2', 'shirt', 1, 41, 'cat_expense_personal'),
  createCategoryRecord('cat_expense_personal_haircut', 'Coiffure', 'expense', '#13C2C2', 'cut', 1, 42, 'cat_expense_personal'),
  createCategoryRecord('cat_expense_personal_perfume', 'Parfums', 'expense', '#13C2C2', 'sparkles', 1, 43, 'cat_expense_personal'),
  createCategoryRecord('cat_expense_personal_outings', 'Sorties', 'expense', '#13C2C2', 'walk', 1, 44, 'cat_expense_personal'),

  // Sous-catégories Maison
  createCategoryRecord('cat_expense_house_kitchen', 'Cuisine / accessoires', 'expense', '#96CEB4', 'restaurant', 1, 45, 'cat_expense_house'),
  createCategoryRecord('cat_expense_house_decoration', 'Décoration', 'expense', '#96CEB4', 'flower', 1, 46, 'cat_expense_house'),
  createCategoryRecord('cat_expense_house_tools', 'Outils / bricolage', 'expense', '#96CEB4', 'construct', 1, 47, 'cat_expense_house'),

  // Sous-catégories Divers & imprévus
  createCategoryRecord('cat_expense_misc_gifts', 'Cadeaux', 'expense', '#95A5A6', 'gift', 1, 48, 'cat_expense_misc'),
  createCategoryRecord('cat_expense_misc_family_help', 'Aides familiales', 'expense', '#95A5A6', 'people', 1, 49, 'cat_expense_misc'),
  createCategoryRecord('cat_expense_misc_unexpected', 'Imprévus', 'expense', '#95A5A6', 'warning', 1, 50, 'cat_expense_misc'),
];

// 🔄 SERVICE DE GESTION DES CATÉGORIES
export const categoryService = {
  // ✅ INITIALISATION AUTORITAIRE : FORCE VOS 20 CATÉGORIES COMME STRUCTURE PAR DÉFAUT
  async smartInitializeCategories(userId: string = 'default-user'): Promise<void> {
    try {
      console.log('👑 [categoryService] Initialisation des catégories (non destructive)...');
      const db = await getDatabase();

      // Vérifier toutes les catégories existantes
      const existingCategories = await db.getAllAsync(`
        SELECT id, name, type FROM categories WHERE user_id = ?
      `, [userId]) as { id: string, name: string, type: string }[];

      const categoryCount = existingCategories.length;

      if (categoryCount === 0) {
        console.log('🔄 [categoryService] Base de données vide - Installation des 20 catégories...');
        await this.installNewCategories(userId);
        return;
      }

      // Vérifier si la structure est EXACTEMENT celle attendue
      const expectedCategoryIds = allCategories.map(cat => cat.id);
      const existingCategoryIds = existingCategories.map(cat => cat.id);
      
      const hasAllNewCategories = expectedCategoryIds.every(id => existingCategoryIds.includes(id));
      const hasOnlyNewCategories = existingCategoryIds.every(id => expectedCategoryIds.includes(id));
      const hasExactCount = categoryCount === allCategories.length;

      if (hasAllNewCategories && hasOnlyNewCategories && hasExactCount) {
        console.log(`✅ [categoryService] Structure parfaite détectée: ${categoryCount} catégories correctes`);
        return;
      }

      // Non destructif: on ajoute seulement les catégories manquantes, on ne supprime rien
      const missingIds = expectedCategoryIds.filter(id => !existingCategoryIds.includes(id));
      if (missingIds.length === 0) {
        console.log('ℹ️ [categoryService] Aucune catégorie manquante. Conservation des catégories personnalisées.');
        return;
      }

      console.log(`🛠️ [categoryService] Ajout des catégories manquantes: ${missingIds.length}`);
      await db.runAsync('BEGIN TRANSACTION');
      try {
        for (const id of missingIds) {
          const cat = allCategories.find(c => c.id === id);
          if (!cat) continue;
          await db.runAsync(`
            INSERT OR IGNORE INTO categories (
              id, user_id, name, type, color, icon, parent_id, level, sort_order, is_active
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, [
            cat.id,
            userId,
            cat.name,
            cat.type,
            cat.color,
            cat.icon,
            cat.parentId || null,
            cat.level,
            cat.sortOrder,
            1
          ]);
        }
        await db.runAsync('COMMIT');
        console.log('✅ [categoryService] Catégories manquantes ajoutées sans supprimer les personnalisées');
      } catch (insertErr) {
        await db.runAsync('ROLLBACK');
        throw insertErr;
      }
      
    } catch (error) {
      console.error('❌ [categoryService] Error in smart initialization:', error);
      // Non destructif: ne pas réinitialiser automatiquement en cas d'erreur
      console.log('ℹ️ [categoryService] Initialisation non destructive: aucune suppression effectuée');
    }
  },

  // ✅ INSTALLATION PROPRE DES NOUVELLES CATÉGORIES
  async installNewCategories(userId: string = 'default-user'): Promise<void> {
    try {
      const db = await getDatabase();
      await db.runAsync('BEGIN TRANSACTION');

      // Insérer toutes les nouvelles catégories
      for (const category of allCategories) {
        await db.runAsync(`
          INSERT OR IGNORE INTO categories (
            id, user_id, name, type, color, icon, parent_id, level, sort_order, is_active
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          category.id,
          userId,
          category.name,
          category.type,
          category.color,
          category.icon,
          category.parentId || null,
          category.level,
          category.sortOrder,
          1
        ]);
      }

      await db.runAsync('COMMIT');
      
      console.log(`✅ [categoryService] NOUVELLES catégories installées: ${allCategories.length} catégories`);
      console.log(`✅ [categoryService] Structure: 11 catégories principales + 39 sous-catégories`);
      
    } catch (error) {
      const db = await getDatabase();
      await db.runAsync('ROLLBACK');
      console.error('❌ [categoryService] Error installing new categories:', error);
      throw error;
    }
  },

  // ✅ MÉTHODE D'INITIALISATION DES CATÉGORIES PAR DÉFAUT (LEGACY)
  async initializeDefaultCategories(userId: string = 'default-user'): Promise<void> {
    // Rediriger vers la nouvelle méthode intelligente
    await this.smartInitializeCategories(userId);
  },



  // ✅ MÉTHODE POUR FORCER LA RÉINITIALISATION COMPLÈTE DES CATÉGORIES
  async forceReinitializeAllCategories(userId: string = 'default-user'): Promise<void> {
    try {
      console.log('🔄 [categoryService] FORCING complete categories reinitialization...');
      console.log('🗑️ [categoryService] SUPPRESSION TOTALE de toutes les anciennes catégories...');
      const db = await getDatabase();

      await db.runAsync('BEGIN TRANSACTION');

      // SUPPRESSION COMPLÈTE : Supprimer TOUTES les catégories de TOUS les utilisateurs
      await db.runAsync('DELETE FROM categories');
      console.log('🗑️ [categoryService] TOUTES les anciennes catégories supprimées');

      // NETTOYAGE COMPLET : Reset de l'auto-increment si SQLite le permet
      try {
        await db.runAsync('DELETE FROM sqlite_sequence WHERE name = "categories"');
        console.log('🧹 [categoryService] Compteur auto-increment réinitialisé');
      } catch (resetError) {
        console.log('ℹ️ [categoryService] Reset auto-increment non nécessaire');
      }

      // INSTALLATION DES NOUVELLES CATÉGORIES : Seulement les 20 catégories + sous-catégories
      console.log(`🔄 [categoryService] Installation des ${allCategories.length} nouvelles catégories...`);
      
      for (const category of allCategories) {
        await db.runAsync(`
          INSERT OR IGNORE INTO categories (
            id, user_id, name, type, color, icon, parent_id, level, sort_order, is_active
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          category.id,
          userId,
          category.name,
          category.type,
          category.color,
          category.icon,
          category.parentId || null,
          category.level,
          category.sortOrder,
          1
        ]);
      }

      await db.runAsync('COMMIT');
      
      console.log(`✅ [categoryService] RÉINITIALISATION COMPLÈTE TERMINÉE!`);
      console.log(`✅ [categoryService] ${allCategories.length} nouvelles catégories installées`);
      console.log(`✅ [categoryService] Structure: 11 catégories principales + 39 sous-catégories`);
      
    } catch (error) {
      const db = await getDatabase();
      await db.runAsync('ROLLBACK');
      console.error('❌ [categoryService] Error in forced reinitialization:', error);
      throw error;
    }
  },

  // ✅ RÉCUPÉRER TOUTES LES CATÉGORIES
  async getAllCategories(userId: string = 'default-user'): Promise<Category[]> {
    try {
      console.log('🔍 [categoryService] Fetching all categories...');
      const db = await getDatabase();
      
      const categories = await db.getAllAsync(`
        SELECT id, name, type, color, icon, parent_id, level, sort_order, is_active
        FROM categories 
        WHERE user_id = ? AND is_active = 1
        ORDER BY sort_order ASC
      `, [userId]) as DatabaseCategory[];

      const result = categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        type: cat.type as 'income' | 'expense',
        color: cat.color,
        icon: cat.icon,
        parentId: cat.parent_id,
        level: cat.level,
        sortOrder: cat.sort_order,
        isActive: cat.is_active === 1,
        createdAt: new Date().toISOString()
      }));

      console.log(`✅ [categoryService] Found ${result.length} categories`);
      return result;
      
    } catch (error) {
      console.error('❌ [categoryService] Error fetching categories:', error);
      return [];
    }
  },

  // ✅ CONSTRUIRE L'ARBRE DES CATÉGORIES
  async getCategoryTree(userId: string = 'default-user'): Promise<Array<{ category: Category; subcategories: Category[] }>> {
    try {
      const allCategories = await this.getAllCategories(userId);
      
      // Filtrer les catégories principales (level 0)
      const mainCategories = allCategories.filter(cat => cat.level === 0);
      
      // Construire l'arbre avec les sous-catégories
      const tree = mainCategories.map(category => ({
        category,
        subcategories: allCategories.filter(cat => cat.parentId === category.id)
      }));
      
      console.log(`🌳 [categoryService] Category tree built: ${mainCategories.length} main categories`);
      return tree;
      
    } catch (error) {
      console.error('❌ [categoryService] Error building category tree:', error);
      return [];
    }
  },

  // ✅ RÉCUPÉRER LES SOUS-CATÉGORIES D'UNE CATÉGORIE
  async getSubcategories(parentId: string, userId: string = 'default-user'): Promise<Category[]> {
    try {
      const db = await getDatabase();
      
      const subcategories = await db.getAllAsync(`
        SELECT id, name, type, color, icon, parent_id, level, sort_order, is_active
        FROM categories 
        WHERE user_id = ? AND parent_id = ? AND is_active = 1
        ORDER BY sort_order ASC
      `, [userId, parentId]) as DatabaseCategory[];

      return subcategories.map(cat => ({
        id: cat.id,
        name: cat.name,
        type: cat.type as 'income' | 'expense',
        color: cat.color,
        icon: cat.icon,
        parentId: cat.parent_id,
        level: cat.level,
        sortOrder: cat.sort_order,
        isActive: cat.is_active === 1,
        createdAt: new Date().toISOString()
      }));
      
    } catch (error) {
      console.error('❌ [categoryService] Error fetching subcategories:', error);
      return [];
    }
  },

  // ✅ CRÉER UNE NOUVELLE CATÉGORIE
  async createCategory(category: CreateCategoryData, userId: string = 'default-user'): Promise<string> {
    try {
      const db = await getDatabase();
      const categoryId = `cat_${Date.now()}`;
      
      await db.runAsync(`
        INSERT INTO categories (
          id, user_id, name, type, color, icon, parent_id, level, sort_order, is_active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        categoryId,
        userId,
        category.name,
        category.type,
        category.color,
        category.icon,
        category.parentId || null,
        category.level || 0,
        category.sortOrder || 0,
        // Par défaut on active la catégorie si non spécifié
        (category.isActive ?? true) ? 1 : 0
      ]);

      console.log(`✅ [categoryService] Category created: ${category.name}`);
      
      return categoryId;
      
    } catch (error) {
      console.error('❌ [categoryService] Error creating category:', error);
      throw error;
    }
  },

  // ✅ METTRE À JOUR UNE CATÉGORIE
  async updateCategory(categoryId: string, updates: Partial<Category>, userId: string = 'default-user'): Promise<void> {
    try {
      const db = await getDatabase();
      
      const setClauses = [];
      const values = [];
      
      if (updates.name !== undefined) {
        setClauses.push('name = ?');
        values.push(updates.name);
      }
      if (updates.color !== undefined) {
        setClauses.push('color = ?');
        values.push(updates.color);
      }
      if (updates.icon !== undefined) {
        setClauses.push('icon = ?');
        values.push(updates.icon);
      }
      
      values.push(userId, categoryId);
      
      await db.runAsync(`
        UPDATE categories 
        SET ${setClauses.join(', ')}
        WHERE user_id = ? AND id = ?
      `, values);

      console.log(`✅ [categoryService] Category updated: ${categoryId}`);
      
    } catch (error) {
      console.error('❌ [categoryService] Error updating category:', error);
      throw error;
    }
  },

  // ✅ SUPPRIMER UNE CATÉGORIE
  async deleteCategory(categoryId: string, userId: string = 'default-user'): Promise<void> {
    try {
      const db = await getDatabase();
      
      await db.runAsync(`
        UPDATE categories 
        SET is_active = 0
        WHERE user_id = ? AND id = ?
      `, [userId, categoryId]);

      console.log(`✅ [categoryService] Category deleted: ${categoryId}`);
      
    } catch (error) {
      console.error('❌ [categoryService] Error deleting category:', error);
      throw error;
    }
  },

  // ✅ RÉCUPÉRER LES CATÉGORIES PAR TYPE
  async getCategoriesByType(type: 'income' | 'expense', userId: string = 'default-user'): Promise<Category[]> {
    try {
      const db = await getDatabase();
      
      const categories = await db.getAllAsync(`
        SELECT id, name, type, color, icon, parent_id, level, sort_order, is_active
        FROM categories 
        WHERE user_id = ? AND type = ? AND is_active = 1
        ORDER BY sort_order ASC
      `, [userId, type]) as DatabaseCategory[];

      return categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        type: cat.type as 'income' | 'expense',
        color: cat.color,
        icon: cat.icon,
        parentId: cat.parent_id,
        level: cat.level,
        sortOrder: cat.sort_order,
        isActive: cat.is_active === 1,
        createdAt: new Date().toISOString()
      }));
      
    } catch (error) {
      console.error('❌ [categoryService] Error fetching categories by type:', error);
      return [];
    }
  },

  // ✅ RÉCUPÉRER UNE CATÉGORIE PAR ID
  async getCategoryById(id: string, userId: string = 'default-user'): Promise<Category | null> {
    try {
      const db = await getDatabase();
      
      const category = await db.getFirstAsync(`
        SELECT id, name, type, color, icon, parent_id, level, sort_order, is_active
        FROM categories 
        WHERE user_id = ? AND id = ? AND is_active = 1
      `, [userId, id]) as DatabaseCategory | null;

      if (!category) return null;

      return {
        id: category.id,
        name: category.name,
        type: category.type as 'income' | 'expense',
        color: category.color,
        icon: category.icon,
        parentId: category.parent_id,
        level: category.level,
        sortOrder: category.sort_order,
        isActive: category.is_active === 1,
        createdAt: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('❌ [categoryService] Error fetching category by id:', error);
      return null;
    }
  },

  // ✅ RÉCUPÉRER LES CATÉGORIES PRINCIPALES
  async getMainCategories(userId: string = 'default-user'): Promise<Category[]> {
    try {
      const db = await getDatabase();
      
      const categories = await db.getAllAsync(`
        SELECT id, name, type, color, icon, parent_id, level, sort_order, is_active
        FROM categories 
        WHERE user_id = ? AND level = 0 AND is_active = 1
        ORDER BY sort_order ASC
      `, [userId]) as DatabaseCategory[];

      return categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        type: cat.type as 'income' | 'expense',
        color: cat.color,
        icon: cat.icon,
        parentId: cat.parent_id,
        level: cat.level,
        sortOrder: cat.sort_order,
        isActive: cat.is_active === 1,
        createdAt: new Date().toISOString()
      }));
      
    } catch (error) {
      console.error('❌ [categoryService] Error fetching main categories:', error);
      return [];
    }
  },

  // ✅ CRÉER PLUSIEURS CATÉGORIES
  async createMultipleCategories(categoriesData: CreateCategoryData[], userId: string = 'default-user'): Promise<{ success: boolean; created: number; errors: string[] }> {
    const result = { success: false, created: 0, errors: [] as string[] };
    
    try {
      const db = await getDatabase();
      
      await db.runAsync('BEGIN TRANSACTION');
      
      for (const categoryData of categoriesData) {
        try {
          const categoryId = `cat_${Date.now()}_${result.created}`;
          
          await db.runAsync(`
            INSERT INTO categories (
              id, user_id, name, type, color, icon, parent_id, level, sort_order, is_active
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, [
            categoryId,
            userId,
            categoryData.name,
            categoryData.type,
            categoryData.color,
            categoryData.icon,
            categoryData.parentId || null,
            categoryData.level || 0,
            categoryData.sortOrder || 0,
            // Par défaut on active la catégorie si non spécifié
            (categoryData.isActive ?? true) ? 1 : 0
          ]);
          
          result.created++;
        } catch (error) {
          result.errors.push(`Error creating ${categoryData.name}: ${error}`);
        }
      }
      
      await db.runAsync('COMMIT');
      result.success = result.errors.length === 0;
      
      console.log(`✅ [categoryService] Created ${result.created} categories`);
      
    } catch (error) {
      const db = await getDatabase();
      await db.runAsync('ROLLBACK');
      result.errors.push(`Transaction error: ${error}`);
      console.error('❌ [categoryService] Error creating multiple categories:', error);
    }
    
    return result;
  }
};

export default categoryService;