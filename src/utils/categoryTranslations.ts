/**
 * Traductions des noms de catégories
 * Map les noms français stockés en base vers les clés de traduction
 */

export const categoryNameTranslations: { [key: string]: string } = {
  // Revenus
  '💼 Salaire': 'cat_salary',
  '📈 Revenus secondaires': 'cat_secondary_income',
  'Salaire net': 'cat_net_salary',
  'Primes / heures sup': 'cat_bonus',
  'Freelance': 'cat_freelance',
  'Commerce / ventes': 'cat_commerce',
  'Commissions': 'cat_commissions',
  
  // Logement
  '🏠 Logement & Charges': 'cat_housing',
  'Loyer / Crédit maison': 'cat_rent',
  'Électricité': 'cat_electricity',
  'Eau': 'cat_water',
  'Wifi / Internet': 'cat_internet',
  'Syndic': 'cat_syndic',
  
  // Nourriture
  '🛒 Nourriture & Courses (T9edya)': 'cat_food',
  'Épicerie': 'cat_groceries',
  'Légumes / fruits': 'cat_vegetables',
  'Viande / poisson': 'cat_meat',
  'Produits ménagers': 'cat_cleaning_products',
  
  // Transport
  '🚗 Transport & Voiture': 'cat_transport',
  'Carburant': 'cat_fuel',
  'Entretien': 'cat_maintenance',
  'Assurance': 'cat_insurance',
  'Lavage': 'cat_wash',
  'Parking': 'cat_parking',
  
  // Santé
  '💊 Santé': 'cat_health',
  'Pharmacie': 'cat_pharmacy',
  'Analyse / consultation': 'cat_consultation',
  'Assurance maladie': 'cat_health_insurance',
  
  // Enfant
  '👶 Enfant': 'cat_child',
  'Nourriture': 'cat_child_food',
  'Hygiène': 'cat_hygiene',
  'École / crèche': 'cat_school',
  'Loisirs': 'cat_leisure',
  
  // Abonnements
  '📱 Abonnements': 'cat_subscriptions',
  'Téléphone': 'cat_phone',
  'Applications': 'cat_apps',
  'Streaming': 'cat_streaming',
  
  // Personnel
  '👤 Dépenses personnelles': 'cat_personal',
  'Vêtements': 'cat_clothes',
  'Coiffure': 'cat_haircut',
  'Parfums': 'cat_perfume',
  'Sorties': 'cat_outings',
  
  // Maison
  '🏡 Maison': 'cat_house',
  'Cuisine / accessoires': 'cat_kitchen',
  'Décoration': 'cat_decoration',
  'Outils / bricolage': 'cat_tools',
  
  // Divers
  '🎁 Divers & imprévus': 'cat_misc',
  'Cadeaux': 'cat_gifts',
  'Aides familiales': 'cat_family_help',
  'Imprévus': 'cat_unexpected',
  
  // Catégories spéciales (système)
  'dette': 'cat_debt',
  'épargne': 'cat_savings',
  'remboursement épargne': 'cat_savings_refund',
  'transfert': 'cat_transfer',
  'charge_annuelle': 'cat_annual_charge',
};

/**
 * Traduit un nom de catégorie
 * @param categoryName - Nom de la catégorie en base de données (français)
 * @param translations - Objet de traductions de useLanguage
 * @returns Nom traduit ou nom original si pas de traduction
 */
export function translateCategoryName(categoryName: string, translations: any): string {
  // Enlever les emojis pour la recherche
  const cleanName = categoryName.trim();
  
  // Chercher la clé de traduction
  const translationKey = categoryNameTranslations[cleanName];
  
  if (translationKey && translations[translationKey]) {
    return translations[translationKey];
  }
  
  // Retourner le nom original si pas de traduction
  return categoryName;
}
