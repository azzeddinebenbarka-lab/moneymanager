// src/components/ui/CategoryPickerDropdown.tsx
// Composant réutilisable de sélection de catégorie avec recherche

import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useLanguage } from '../../context/LanguageContext';
import { useDesignSystem } from '../../context/ThemeContext';
import { Category } from '../../types';

interface CategoryPickerDropdownProps {
  categories: Category[];
  selectedCategoryId?: string;
  onSelect: (category: Category) => void;
  placeholder?: string;
  label?: string;
  type?: 'expense' | 'income' | 'all';
  showSubcategories?: boolean;
}

export const CategoryPickerDropdown: React.FC<CategoryPickerDropdownProps> = ({
  categories,
  selectedCategoryId,
  onSelect,
  placeholder,
  label,
  type = 'all',
  showSubcategories = true,
}) => {
  const { colors } = useDesignSystem();
  const { t } = useLanguage();
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Valeurs par défaut avec traduction
  const displayPlaceholder = placeholder || t.selectCategory;
  const displayLabel = label || t.category;

  // Fonction pour traduire les noms de catégories depuis la DB (français) vers la langue actuelle
  const getCategoryTranslatedName = (categoryName: string): string => {
    // Mapping des noms français de la DB vers les clés de traduction
    const categoryMapping: Record<string, keyof typeof t> = {
      // Revenus
      'Salaire': 'cat_salary',
      '💼 Salaire': 'cat_salary',
      'Revenus secondaires': 'cat_secondary_income',
      '📈 Revenus secondaires': 'cat_secondary_income',
      'Salaire net': 'cat_net_salary',
      'Prime': 'cat_bonus',
      'Primes / heures sup': 'cat_bonus',
      'Freelance': 'cat_freelance',
      'Commerce': 'cat_commerce',
      'Commerce / ventes': 'cat_commerce',
      'Commissions': 'cat_commissions',
      'Business': 'cat_business',
      'Investissement': 'cat_investment',
      'Autres revenus': 'cat_other_income',
      
      // Logement
      'Logement': 'cat_housing',
      '🏠 Logement & Charges': 'cat_housing',
      'Loyer': 'cat_rent',
      'Loyer / Crédit maison': 'cat_rent',
      'Électricité': 'cat_electricity',
      'Eau': 'cat_water',
      'Internet': 'cat_internet',
      'Wifi / Internet': 'cat_internet',
      'Syndic': 'cat_syndic',
      
      // Nourriture / Alimentation
      'Nourriture': 'cat_food',
      'Alimentation': 'cat_food',
      '🛒 Nourriture & Courses (T9edya)': 'cat_food',
      'Courses': 'cat_groceries',
      'Épicerie': 'cat_groceries',
      'Légumes': 'cat_vegetables',
      'Légumes / fruits': 'cat_vegetables',
      'Viande': 'cat_meat',
      'Viande / poisson': 'cat_meat',
      'Produits d\'entretien': 'cat_cleaning_products',
      'Produits ménagers': 'cat_cleaning_products',
      
      // Transport
      'Transport': 'cat_transport',
      '🚗 Transport & Voiture': 'cat_transport',
      'Carburant': 'cat_fuel',
      'Entretien': 'cat_maintenance',
      'Assurance': 'cat_insurance',
      'Lavage': 'cat_wash',
      'Parking': 'cat_parking',
      
      // Santé
      'Santé': 'cat_health',
      '💊 Santé': 'cat_health',
      'Pharmacie': 'cat_pharmacy',
      'Consultation': 'cat_consultation',
      'Analyse / consultation': 'cat_consultation',
      'Assurance santé': 'cat_health_insurance',
      'Assurance maladie': 'cat_health_insurance',
      
      // Enfant
      'Enfant': 'cat_child',
      '👶 Enfant': 'cat_child',
      'Alimentation bébé': 'cat_child_food',
      'Hygiène': 'cat_hygiene',
      'École': 'cat_school',
      'École / crèche': 'cat_school',
      'Loisirs': 'cat_leisure',
      
      // Abonnements
      'Abonnements': 'cat_subscriptions',
      '📱 Abonnements': 'cat_subscriptions',
      'Téléphone': 'cat_phone',
      'Applications': 'cat_apps',
      'Streaming': 'cat_streaming',
      
      // Personnel
      'Personnel': 'cat_personal',
      '👤 Dépenses personnelles': 'cat_personal',
      'Vêtements': 'cat_clothes',
      'Coiffure': 'cat_haircut',
      'Parfums': 'cat_perfume',
      
      // Shopping
      'Shopping': 'cat_shopping',
      'Électronique': 'cat_electronics',
      'Maison': 'cat_home',
      'Cadeaux': 'cat_gifts',
      
      // Divertissement / Loisirs
      'Divertissement': 'cat_entertainment',
      'Loisirs': 'cat_entertainment',
      'Restaurants': 'cat_restaurants',
      'Café': 'cat_cafe',
      'Cinéma': 'cat_cinema',
      'Sorties': 'cat_outings',
      
      // Finances
      'Finances': 'cat_finances',
      'Épargne': 'cat_savings',
      'Investissements': 'cat_investments',
      'Prêts': 'cat_loans',
      'Frais bancaires': 'cat_bank_fees',
      
      // Maison
      '🏡 Maison': 'cat_house',
      'Cuisine / accessoires': 'cat_kitchen',
      'Décoration': 'cat_decoration',
      'Outils / bricolage': 'cat_tools',
      
      // Éducation
      'Éducation': 'cat_education',
      
      // Factures
      'Factures': 'cat_bills',
      
      // Autres / Divers
      'Autre': 'cat_other',
      'Autres': 'cat_other',
      'Divers': 'cat_miscellaneous',
      '🎁 Divers & imprévus': 'cat_misc',
      'Imprévus': 'cat_unexpected',
      'Imprévu': 'cat_unexpected',
      'Aides familiales': 'cat_family_help',
    };

    const translationKey = categoryMapping[categoryName];
    if (translationKey && t[translationKey]) {
      return t[translationKey] as string;
    }
    
    // Si pas de traduction trouvée, retourner le nom original
    return categoryName;
  };

  // Fonction pour normaliser le texte (supprimer les emojis et espaces inutiles)
  const normalizeText = (text: string): string => {
    return text
      .replace(/[\u{1F600}-\u{1F64F}]/gu, '') // Emojis emoticons
      .replace(/[\u{1F300}-\u{1F5FF}]/gu, '') // Symboles & pictogrammes
      .replace(/[\u{1F680}-\u{1F6FF}]/gu, '') // Transport & map
      .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, '') // Drapeaux
      .replace(/[\u{2600}-\u{26FF}]/gu, '')   // Symboles divers
      .replace(/[\u{2700}-\u{27BF}]/gu, '')   // Dingbats
      .trim()
      .toLowerCase();
  };

  // Filtrer les catégories par type
  const filteredCategories = useMemo(() => {
    let filtered = categories;
    
    if (type !== 'all') {
      filtered = filtered.filter(cat => cat.type === type);
    }
    
    if (searchQuery.trim()) {
      const query = normalizeText(searchQuery);
      filtered = filtered.filter(cat => {
        const translatedName = normalizeText(getCategoryTranslatedName(cat.name));
        const originalName = normalizeText(cat.name);
        
        // Rechercher dans le nom traduit ET le nom original
        return translatedName.includes(query) || originalName.includes(query);
      });
    }
    
    return filtered;
  }, [categories, type, searchQuery]);

  // Organiser les catégories en arbre (principales + sous-catégories)
  const categoryTree = useMemo(() => {
    const mainCategories = filteredCategories.filter(cat => !cat.parentId);
    
    return mainCategories.map(main => ({
      ...main,
      subcategories: showSubcategories
        ? filteredCategories.filter(cat => cat.parentId === main.id)
        : [],
    }));
  }, [filteredCategories, showSubcategories]);

  const selectedCategory = categories.find(cat => cat.id === selectedCategoryId);

  const handleSelect = (category: Category) => {
    onSelect(category);
    setModalVisible(false);
    setSearchQuery('');
  };

  const renderCategoryItem = ({ item }: { item: Category & { subcategories?: Category[] } }) => (
    <View>
      <TouchableOpacity
        style={[
          styles.categoryItem,
          { backgroundColor: colors.background.secondary },
          selectedCategoryId === item.id && {
            backgroundColor: colors.primary[100],
            borderColor: colors.primary[500],
            borderWidth: 2,
          },
        ]}
        onPress={() => handleSelect(item)}
      >
        <View style={styles.categoryItemLeft}>
          <View
            style={[
              styles.colorIndicator,
              { backgroundColor: item.color || colors.primary[500] },
            ]}
          />
          <Text
            style={[
              styles.categoryItemText,
              { color: colors.text.primary },
              selectedCategoryId === item.id && { fontWeight: '600' },
            ]}
          >
            {getCategoryTranslatedName(item.name)}
          </Text>
        </View>
        {selectedCategoryId === item.id && (
          <Ionicons name="checkmark-circle" size={20} color={colors.primary[500]} />
        )}
      </TouchableOpacity>

      {/* Sous-catégories */}
      {item.subcategories && item.subcategories.length > 0 && (
        <View style={styles.subcategoriesContainer}>
          {item.subcategories.map(sub => (
            <TouchableOpacity
              key={sub.id}
              style={[
                styles.subcategoryItem,
                { backgroundColor: colors.background.card },
                selectedCategoryId === sub.id && {
                  backgroundColor: colors.primary[50],
                  borderColor: colors.primary[500],
                  borderWidth: 1,
                },
              ]}
              onPress={() => handleSelect(sub)}
            >
              <View style={styles.categoryItemLeft}>
                <View style={styles.subcategoryIndicator} />
                <Text
                  style={[
                    styles.subcategoryItemText,
                    { color: colors.text.secondary },
                    selectedCategoryId === sub.id && { 
                      color: colors.text.primary,
                      fontWeight: '600'
                    },
                  ]}
                >
                  {getCategoryTranslatedName(sub.name)}
                </Text>
              </View>
              {selectedCategoryId === sub.id && (
                <Ionicons name="checkmark-circle" size={18} color={colors.primary[500]} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {displayLabel && (
        <Text style={[styles.label, { color: colors.text.primary }]}>{displayLabel}</Text>
      )}
      
      <TouchableOpacity
        style={[
          styles.pickerButton,
          { 
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.primary,
          },
        ]}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.pickerButtonContent}>
          {selectedCategory && (
            <View
              style={[
                styles.selectedColorIndicator,
                { backgroundColor: selectedCategory.color || colors.primary[500] },
              ]}
            />
          )}
          <Text
            style={[
              styles.pickerButtonText,
              { color: selectedCategory ? colors.text.primary : colors.text.secondary },
            ]}
          >
            {selectedCategory ? getCategoryTranslatedName(selectedCategory.name) : displayPlaceholder}
          </Text>
        </View>
        <Ionicons name="chevron-down" size={20} color={colors.text.secondary} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => {
          setModalVisible(false);
          setSearchQuery('');
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background.primary }]}>
            {/* Header */}
            <View style={[styles.modalHeader, { borderBottomColor: colors.border.primary }]}>
              <Text style={[styles.modalTitle, { color: colors.text.primary }]}>
                {displayLabel}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setSearchQuery('');
                }}
              >
                <Ionicons name="close" size={24} color={colors.text.secondary} />
              </TouchableOpacity>
            </View>

            {/* Barre de recherche */}
            <View style={[styles.searchContainer, { backgroundColor: colors.background.secondary }]}>
              <Ionicons name="search" size={20} color={colors.text.secondary} />
              <TextInput
                style={[styles.searchInput, { color: colors.text.primary }]}
                placeholder={t.searchCategory}
                placeholderTextColor={colors.text.tertiary}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={20} color={colors.text.secondary} />
                </TouchableOpacity>
              )}
            </View>

            {/* Liste des catégories */}
            <FlatList
              data={categoryTree}
              keyExtractor={item => item.id}
              renderItem={renderCategoryItem}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Ionicons name="search" size={48} color={colors.text.disabled} />
                  <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
                    {t.noCategoryFound}
                  </Text>
                </View>
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  pickerButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectedColorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  pickerButtonText: {
    fontSize: 16,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingBottom: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  categoryItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  colorIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 12,
  },
  categoryItemText: {
    fontSize: 16,
    flex: 1,
  },
  subcategoriesContainer: {
    paddingLeft: 32,
    marginBottom: 8,
  },
  subcategoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  subcategoryIndicator: {
    width: 2,
    height: 12,
    backgroundColor: '#ccc',
    marginRight: 12,
  },
  subcategoryItemText: {
    fontSize: 14,
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 12,
  },
});
