/**
 * Service de migration automatique des catégories
 * Remplace les anciennes catégories par la nouvelle structure au démarrage
 * Vérifie l'existence des catégories dans la BD plutôt qu'un flag
 */

import { getDatabase } from './database/sqlite';

// Helper pour créer une catégorie
const createCategoryRecord = (
  id: string,
  name: string,
  type: 'income' | 'expense',
  color: string,
  icon: string,
  level: number,
  sortOrder: number,
  parentId?: string
) => ({
  id,
  name,
  type,
  color,
  icon,
  parentId: parentId || null,
  level,
  sortOrder,
  isActive: 1,
  createdAt: new Date().toISOString()
});

// ✅ NOUVELLE STRUCTURE COMPLÈTE
const newCategories = [
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

/**
 * Migre automatiquement vers les nouvelles catégories
 * Vérifie d'abord si des catégories existent déjà
 * @param force - Si true, réinstalle même si des catégories existent
 */
export async function autoMigrateCategories(force: boolean = false): Promise<void> {
  try {
    const db = await getDatabase();
    
    // Vérifier si des catégories existent déjà (sauf si forcée)
    if (!force) {
      const result = await db.getFirstAsync<{ count: number }>(
        'SELECT COUNT(*) as count FROM categories WHERE user_id = ?',
        ['default-user']
      );
      
      if (result && result.count > 0) {
        console.log(`✅ [CategoryMigration] ${result.count} catégories déjà installées - aucune migration nécessaire`);
        return;
      }
      
      console.log('⚠️  [CategoryMigration] Aucune catégorie trouvée - installation automatique...');
    }

    console.log('🔄 [CategoryMigration] DÉBUT DE LA MIGRATION DÉFINITIVE DES CATÉGORIES' + (force ? ' (FORCÉE)' : ''));
    
    // 1️⃣ Supprimer TOUTES les catégories existantes
    console.log('🗑️  [CategoryMigration] Suppression de toutes les catégories existantes...');
    await db.runAsync('DELETE FROM categories');
    
    // 2️⃣ Réinitialiser l'auto-increment
    try {
      await db.runAsync('DELETE FROM sqlite_sequence WHERE name="categories"');
      console.log('🧹 [CategoryMigration] Auto-increment réinitialisé');
    } catch (e) {
      console.log('ℹ️  [CategoryMigration] Auto-increment reset non nécessaire');
    }
    
    // 3️⃣ Insérer les nouvelles catégories
    console.log(`📝 [CategoryMigration] Insertion de ${newCategories.length} nouvelles catégories...`);
    
    for (const category of newCategories) {
      await db.runAsync(
        `INSERT OR IGNORE INTO categories (
          id, name, type, color, icon, parent_id, level, sort_order, is_active, created_at, user_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          category.id,
          category.name,
          category.type,
          category.color,
          category.icon,
          category.parentId,
          category.level,
          category.sortOrder,
          category.isActive,
          category.createdAt,
          'default-user'
        ]
      );
    }
    
    // 4️⃣ Vérification
    const result = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM categories'
    );
    
    console.log(`✅ [CategoryMigration] ${result?.count} catégories insérées`);
    console.log('✅ [CategoryMigration] STRUCTURE DÉFINITIVE:');
    console.log('   - Revenus: 2 catégories principales + 5 sous-catégories');
    console.log('   - Dépenses: 9 catégories principales + 34 sous-catégories');
    console.log('   - TOTAL: 11 principales + 39 sous-catégories = 50 catégories');
    console.log('🗑️  [CategoryMigration] Anciennes catégories DÉFINITIVEMENT SUPPRIMÉES de la BD');
    console.log('✅ [CategoryMigration] Migration terminée avec succès');
    
  } catch (error) {
    console.error('❌ [CategoryMigration] Erreur lors de la migration:', error);
    // Ne pas bloquer l'app en cas d'erreur
  }
}

/**
 * Force la migration (pour les tests ou réinitialisation manuelle)
 * Supprime toutes les catégories et les réinstalle
 */
export async function forceMigrateCategories(): Promise<void> {
  console.log('🔄 [CategoryMigration] FORÇAGE de la migration - réinstallation complète');
  // Passer force=true pour forcer la réinstallation
  await autoMigrateCategories(true);
}

/**
 * Vérifie si des catégories existent dans la base de données
 */
export async function isMigrationCompleted(): Promise<boolean> {
  try {
    const db = await getDatabase();
    const result = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM categories WHERE user_id = ?',
      ['default-user']
    );
    return (result?.count ?? 0) > 0;
  } catch (error) {
    console.error('❌ [CategoryMigration] Erreur vérification catégories:', error);
    return false;
  }
}
