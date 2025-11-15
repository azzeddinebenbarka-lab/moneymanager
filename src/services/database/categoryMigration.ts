// src/services/database/categoryMigration.ts - VERSION CORRIGÉE
import { getDatabase } from './sqlite';

export const migrateCategoriesWithSubcategories = async (): Promise<void> => {
  const db = await getDatabase();
  
  try {
    console.log('🔄 Migration des catégories avec sous-catégories...');

    // 1. Ajouter les colonnes aux catégories
    try {
      await db.execAsync(`
        ALTER TABLE categories ADD COLUMN parent_id TEXT;
      `);
      console.log('✅ Colonne parent_id ajoutée');
    } catch (error: any) {
      if (!error.message?.includes('duplicate column name')) {
        throw error;
      }
    }

    try {
      await db.execAsync(`
        ALTER TABLE categories ADD COLUMN is_sub_category INTEGER DEFAULT 0;
      `);
      console.log('✅ Colonne is_sub_category ajoutée');
    } catch (error: any) {
      if (!error.message?.includes('duplicate column name')) {
        throw error;
      }
    }

    try {
      await db.execAsync(`
        ALTER TABLE categories ADD COLUMN budget REAL;
      `);
      console.log('✅ Colonne budget ajoutée');
    } catch (error: any) {
      if (!error.message?.includes('duplicate column name')) {
        throw error;
      }
    }

    try {
      await db.execAsync(`
        ALTER TABLE categories ADD COLUMN is_active INTEGER DEFAULT 1;
      `);
      console.log('✅ Colonne is_active ajoutée');
    } catch (error: any) {
      if (!error.message?.includes('duplicate column name')) {
        throw error;
      }
    }

    // 2. Recréer les catégories avec sous-catégories si nécessaire
    await recreateCategoriesWithSubcategories();

    console.log('✅ Migration des sous-catégories terminée');

  } catch (error) {
    console.error('❌ Erreur migration sous-catégories:', error);
    throw error;
  }
};

const recreateCategoriesWithSubcategories = async (): Promise<void> => {
  const db = await getDatabase();
  
  try {
    // Vérifier si des catégories existent déjà
    const existingCategories = await db.getAllAsync('SELECT COUNT(*) as count FROM categories') as any[];
    const hasExistingCategories = existingCategories[0]?.count > 0;

    if (hasExistingCategories) {
      console.log('ℹ️ Catégories existantes détectées, conservation des données...');
      return;
    }

    console.log('📦 Création des catégories et sous-catégories par défaut...');

    const userId = 'default-user';
    const now = new Date().toISOString();

    // Catégories principales (parent)
    const mainCategories = [
      // DÉPENSES
      { id: 'cat_housing', name: 'Logement', type: 'expense', color: '#45B7D1', icon: 'home' },
      { id: 'cat_food', name: 'Alimentation', type: 'expense', color: '#FF6B6B', icon: 'restaurant' },
      { id: 'cat_transport', name: 'Transport', type: 'expense', color: '#4ECDC4', icon: 'car' },
      { id: 'cat_health', name: 'Santé', type: 'expense', color: '#FFEAA7', icon: 'medical' },
      { id: 'cat_entertainment', name: 'Loisirs', type: 'expense', color: '#96CEB4', icon: 'game-controller' },
      { id: 'cat_shopping', name: 'Shopping', type: 'expense', color: '#DDA0DD', icon: 'cart' },
      { id: 'cat_education', name: 'Éducation', type: 'expense', color: '#98D8C8', icon: 'school' },
      { id: 'cat_travel', name: 'Voyages', type: 'expense', color: '#F7DC6F', icon: 'airplane' },
      
      // REVENUS
      { id: 'cat_income_main', name: 'Revenus Principaux', type: 'income', color: '#52C41A', icon: 'cash' },
      { id: 'cat_income_secondary', name: 'Revenus Secondaires', type: 'income', color: '#FAAD14', icon: 'trending-up' },
      { id: 'cat_income_other', name: 'Autres Revenus', type: 'income', color: '#722ED1', icon: 'gift' },
    ];

    // Sous-catégories
    const subcategories = [
      // LOGEMENT
      { id: 'sub_rent', name: 'Loyer', type: 'expense', color: '#45B7D1', icon: 'home', parentId: 'cat_housing' },
      { id: 'sub_mortgage', name: 'Prêt Immobilier', type: 'expense', color: '#45B7D1', icon: 'business', parentId: 'cat_housing' },
      { id: 'sub_utilities', name: 'Factures', type: 'expense', color: '#45B7D1', icon: 'flash', parentId: 'cat_housing' },
      { id: 'sub_maintenance', name: 'Entretien', type: 'expense', color: '#45B7D1', icon: 'build', parentId: 'cat_housing' },

      // ALIMENTATION
      { id: 'sub_groceries', name: 'Épicerie', type: 'expense', color: '#FF6B6B', icon: 'basket', parentId: 'cat_food' },
      { id: 'sub_restaurant', name: 'Restaurant', type: 'expense', color: '#FF6B6B', icon: 'restaurant', parentId: 'cat_food' },
      { id: 'sub_delivery', name: 'Livraison', type: 'expense', color: '#FF6B6B', icon: 'fast-food', parentId: 'cat_food' },

      // TRANSPORT
      { id: 'sub_fuel', name: 'Carburant', type: 'expense', color: '#4ECDC4', icon: 'flash', parentId: 'cat_transport' },
      { id: 'sub_public_transport', name: 'Transport Public', type: 'expense', color: '#4ECDC4', icon: 'bus', parentId: 'cat_transport' },
      { id: 'sub_taxi', name: 'Taxi/VTC', type: 'expense', color: '#4ECDC4', icon: 'car', parentId: 'cat_transport' },
      { id: 'sub_maintenance_car', name: 'Entretien Voiture', type: 'expense', color: '#4ECDC4', icon: 'construct', parentId: 'cat_transport' },

      // SANTÉ
      { id: 'sub_doctor', name: 'Médecin', type: 'expense', color: '#FFEAA7', icon: 'medical', parentId: 'cat_health' },
      { id: 'sub_pharmacy', name: 'Pharmacie', type: 'expense', color: '#FFEAA7', icon: 'medical', parentId: 'cat_health' },
      { id: 'sub_insurance', name: 'Assurance Santé', type: 'expense', color: '#FFEAA7', icon: 'shield', parentId: 'cat_health' },

      // LOISIRS
      { id: 'sub_cinema', name: 'Cinéma', type: 'expense', color: '#96CEB4', icon: 'film', parentId: 'cat_entertainment' },
      { id: 'sub_sports', name: 'Sports', type: 'expense', color: '#96CEB4', icon: 'basketball', parentId: 'cat_entertainment' },
      { id: 'sub_hobbies', name: 'Loisirs Créatifs', type: 'expense', color: '#96CEB4', icon: 'brush', parentId: 'cat_entertainment' },

      // REVENUS PRINCIPAUX
      { id: 'sub_salary', name: 'Salaire', type: 'income', color: '#52C41A', icon: 'cash', parentId: 'cat_income_main' },
      { id: 'sub_business', name: 'Revenus Business', type: 'income', color: '#52C41A', icon: 'business', parentId: 'cat_income_main' },

      // REVENUS SECONDAIRES
      { id: 'sub_freelance', name: 'Freelance', type: 'income', color: '#FAAD14', icon: 'laptop', parentId: 'cat_income_secondary' },
      { id: 'sub_investments', name: 'Investissements', type: 'income', color: '#FAAD14', icon: 'trending-up', parentId: 'cat_income_secondary' },

      // AUTRES REVENUS
      { id: 'sub_gifts', name: 'Cadeaux', type: 'income', color: '#722ED1', icon: 'gift', parentId: 'cat_income_other' },
      { id: 'sub_refunds', name: 'Remboursements', type: 'income', color: '#722ED1', icon: 'arrow-undo', parentId: 'cat_income_other' },
    ];

    // Insérer les catégories principales
    for (const category of mainCategories) {
      await db.runAsync(
        `INSERT INTO categories (id, user_id, name, type, color, icon, parent_id, is_sub_category, budget, is_active, created_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          category.id,
          userId,
          category.name,
          category.type,
          category.color,
          category.icon,
          null, // parent_id
          0,    // is_sub_category
          null, // budget
          1,    // is_active
          now
        ]
      );
    }

    // Insérer les sous-catégories
    for (const subcategory of subcategories) {
      await db.runAsync(
        `INSERT INTO categories (id, user_id, name, type, color, icon, parent_id, is_sub_category, budget, is_active, created_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          subcategory.id,
          userId,
          subcategory.name,
          subcategory.type,
          subcategory.color,
          subcategory.icon,
          subcategory.parentId,
          1,    // is_sub_category
          null, // budget
          1,    // is_active
          now
        ]
      );
    }

    console.log(`✅ ${mainCategories.length} catégories principales et ${subcategories.length} sous-catégories créées`);

  } catch (error) {
    console.error('❌ Erreur création catégories:', error);
    throw error;
  }
};

export default migrateCategoriesWithSubcategories;