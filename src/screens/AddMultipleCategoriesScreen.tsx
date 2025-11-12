// src/screens/AddMultipleCategoriesScreen.tsx - VERSION CORRIGÉE ET OPTIMISÉE
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from '../components/SafeAreaView';
import { useTheme } from '../context/ThemeContext';
import { useCategories } from '../hooks/useCategories';

interface CategoryTemplate {
  name: string;
  type: 'expense' | 'income';
  icon: string;
  color: string;
}

const AddMultipleCategoriesScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { theme } = useTheme();
  const { createMultipleCategories } = useCategories(); // ✅ CORRECTION: Utilisation de la méthode multiple
  const isDark = theme === 'dark';

  const [customCategories, setCustomCategories] = useState<CategoryTemplate[]>([
    { name: '', type: 'expense', icon: 'receipt', color: '#007AFF' }
  ]);
  const [loading, setLoading] = useState(false);

  // Catégories prédéfinies pour inspiration
  const predefinedTemplates: CategoryTemplate[] = [
    // Dépenses
    { name: 'Loyer', type: 'expense', icon: 'home', color: '#EF4444' },
    { name: 'Épicerie', type: 'expense', icon: 'cart', color: '#10B981' },
    { name: 'Transport', type: 'expense', icon: 'car', color: '#3B82F6' },
    { name: 'Santé', type: 'expense', icon: 'medical', color: '#8B5CF6' },
    { name: 'Loisirs', type: 'expense', icon: 'game-controller', color: '#F59E0B' },
    { name: 'Restaurant', type: 'expense', icon: 'restaurant', color: '#EC4899' },
    { name: 'Shopping', type: 'expense', icon: 'bag', color: '#06B6D4' },
    { name: 'Abonnements', type: 'expense', icon: 'card', color: '#84CC16' },
    { name: 'Électricité', type: 'expense', icon: 'flash', color: '#FFD700' },
    { name: 'Eau', type: 'expense', icon: 'water', color: '#00BFFF' },
    { name: 'Internet', type: 'expense', icon: 'wifi', color: '#9370DB' },
    { name: 'Téléphone', type: 'expense', icon: 'phone', color: '#32CD32' },
    
    // Revenus
    { name: 'Salaire', type: 'income', icon: 'cash', color: '#10B981' },
    { name: 'Freelance', type: 'income', icon: 'laptop', color: '#3B82F6' },
    { name: 'Investissements', type: 'income', icon: 'trending-up', color: '#F59E0B' },
    { name: 'Cadeaux', type: 'income', icon: 'gift', color: '#EC4899' },
    { name: 'Prime', type: 'income', icon: 'trophy', color: '#FF6B6B' },
    { name: 'Location', type: 'income', icon: 'business', color: '#4ECDC4' },
    { name: 'Dividendes', type: 'income', icon: 'bar-chart', color: '#45B7D1' },
  ];

  const iconOptions = [
    'cart', 'home', 'car', 'medical', 'restaurant', 'cafe', 'airplane', 
    'game-controller', 'book', 'school', 'shirt', 'gift', 'heart', 'star',
    'phone', 'wifi', 'tv', 'musical-notes', 'basketball', 'fitness',
    'bed', 'cut', 'color-palette', 'construct', 'hammer', 'flash',
    'water', 'train', 'bus', 'bicycle', 'walk', 'bed', 'pizza',
    'beer', 'wine', 'cafe', 'ice-cream', 'fast-food', 'nutrition'
  ];

  const colorOptions = [
    '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899',
    '#06B6D4', '#84CC16', '#EAB308', '#DC2626', '#EA580C', '#16A34A',
    '#2563EB', '#7C3AED', '#DB2777', '#0891B2', '#65A30D', '#CA8A04',
    '#991B1B', '#9A3412', '#3F6212', '#0F766E', '#1D4ED8', '#5B21B6'
  ];

  const addCategoryField = () => {
    setCustomCategories(prev => [
      ...prev,
      { name: '', type: 'expense', icon: 'receipt', color: '#007AFF' }
    ]);
  };

  const removeCategoryField = (index: number) => {
    if (customCategories.length > 1) {
      setCustomCategories(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateCategoryField = (index: number, field: keyof CategoryTemplate, value: string) => {
    setCustomCategories(prev => prev.map((cat, i) => 
      i === index ? { ...cat, [field]: value } : cat
    ));
  };

  const useTemplate = (template: CategoryTemplate) => {
    setCustomCategories(prev => [...prev, { ...template }]);
  };

  const handleCreateCategories = async () => {
    const validCategories = customCategories.filter(cat => 
      cat.name.trim() && cat.icon && cat.color
    );

    if (validCategories.length === 0) {
      Alert.alert('Erreur', 'Veuillez remplir au moins une catégorie valide');
      return;
    }

    setLoading(true);
    try {
      // ✅ CORRECTION: Utilisation de la méthode createMultipleCategories
      const result = await createMultipleCategories(validCategories);
      
      if (result.success) {
        Alert.alert(
          'Succès',
          `${result.created} catégorie(s) créée(s) avec succès`,
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } else {
        Alert.alert(
          'Avertissement',
          `${result.created} catégorie(s) créée(s) avec ${result.errors.length} erreur(s)`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Erreur création catégories:', error);
      Alert.alert('Erreur', 'Impossible de créer les catégories');
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setCustomCategories([{ name: '', type: 'expense', icon: 'receipt', color: '#007AFF' }]);
  };

  const filledCategoriesCount = customCategories.filter(cat => 
    cat.name.trim() && cat.icon && cat.color
  ).length;

  const totalCategoriesCount = customCategories.length;

  return (
    <SafeAreaView>
      <ScrollView 
        style={[styles.container, isDark && styles.darkContainer]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={true}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={isDark ? "#fff" : "#000"} />
          </TouchableOpacity>
          <Text style={[styles.title, isDark && styles.darkText]}>
            Ajout Multiple
          </Text>
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={clearAll}
            disabled={loading}
          >
            <Text style={styles.clearButtonText}>Tout effacer</Text>
          </TouchableOpacity>
        </View>

        {/* Compteur et statistiques */}
        <View style={[styles.statsCard, isDark && styles.darkCard]}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, isDark && styles.darkText]}>
              {filledCategoriesCount}
            </Text>
            <Text style={[styles.statLabel, isDark && styles.darkSubtext]}>
              Prêtes à créer
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, isDark && styles.darkText]}>
              {totalCategoriesCount}
            </Text>
            <Text style={[styles.statLabel, isDark && styles.darkSubtext]}>
              Total champs
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, isDark && styles.darkText]}>
              {totalCategoriesCount - filledCategoriesCount}
            </Text>
            <Text style={[styles.statLabel, isDark && styles.darkSubtext]}>
              Incomplets
            </Text>
          </View>
        </View>

        {/* Templates prédéfinis */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && styles.darkText]}>
            Templates Prédéfinis
          </Text>
          <Text style={[styles.sectionSubtitle, isDark && styles.darkSubtext]}>
            Cliquez pour ajouter rapidement
          </Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={true}
            contentContainerStyle={styles.templatesContainer}
          >
            {predefinedTemplates.map((template, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.templateCard, isDark && styles.darkCard]}
                onPress={() => useTemplate(template)}
              >
                <View style={[styles.templateIcon, { backgroundColor: template.color }]}>
                  <Ionicons name={template.icon as any} size={20} color="#fff" />
                </View>
                <Text style={[styles.templateName, isDark && styles.darkText]}>
                  {template.name}
                </Text>
                <View style={[
                  styles.typeBadge,
                  { backgroundColor: template.type === 'income' ? '#10B98120' : '#EF444420' }
                ]}>
                  <Text style={[
                    styles.typeBadgeText,
                    { color: template.type === 'income' ? '#10B981' : '#EF4444' }
                  ]}>
                    {template.type === 'income' ? 'Revenu' : 'Dépense'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Formulaire catégories personnalisées */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, isDark && styles.darkText]}>
              Vos Catégories Personnalisées
            </Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={addCategoryField}
              disabled={loading}
            >
              <Ionicons name="add" size={20} color="#007AFF" />
              <Text style={styles.addButtonText}>Nouveau</Text>
            </TouchableOpacity>
          </View>

          {customCategories.map((category, index) => (
            <View key={index} style={[styles.categoryCard, isDark && styles.darkCard]}>
              <View style={styles.cardHeader}>
                <View style={styles.cardTitle}>
                  <Text style={[styles.cardNumber, isDark && styles.darkSubtext]}>
                    Catégorie #{index + 1}
                  </Text>
                  {category.name && (
                    <Text style={[styles.cardPreview, isDark && styles.darkText]}>
                      {category.name}
                    </Text>
                  )}
                </View>
                {customCategories.length > 1 && (
                  <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={() => removeCategoryField(index)}
                    disabled={loading}
                  >
                    <Ionicons name="close-circle" size={24} color="#EF4444" />
                  </TouchableOpacity>
                )}
              </View>

              {/* Nom de la catégorie */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, isDark && styles.darkText]}>
                  Nom de la catégorie *
                </Text>
                <TextInput
                  style={[styles.input, isDark && styles.darkInput]}
                  value={category.name}
                  onChangeText={(text) => updateCategoryField(index, 'name', text)}
                  placeholder="Ex: Loyer, Épicerie, Salaire..."
                  placeholderTextColor={isDark ? "#888" : "#999"}
                />
              </View>

              {/* Type */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, isDark && styles.darkText]}>
                  Type *
                </Text>
                <View style={styles.typeContainer}>
                  <TouchableOpacity
                    style={[
                      styles.typeButton,
                      category.type === 'expense' && styles.typeButtonSelected,
                      isDark && styles.darkTypeButton,
                    ]}
                    onPress={() => updateCategoryField(index, 'type', 'expense')}
                  >
                    <Ionicons 
                      name="arrow-up" 
                      size={16} 
                      color={category.type === 'expense' ? '#fff' : '#EF4444'} 
                    />
                    <Text style={[
                      styles.typeButtonText,
                      category.type === 'expense' && styles.typeButtonTextSelected,
                    ]}>
                      Dépense
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.typeButton,
                      category.type === 'income' && styles.typeButtonSelected,
                      isDark && styles.darkTypeButton,
                    ]}
                    onPress={() => updateCategoryField(index, 'type', 'income')}
                  >
                    <Ionicons 
                      name="arrow-down" 
                      size={16} 
                      color={category.type === 'income' ? '#fff' : '#10B981'} 
                    />
                    <Text style={[
                      styles.typeButtonText,
                      category.type === 'income' && styles.typeButtonTextSelected,
                    ]}>
                      Revenu
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Icône */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, isDark && styles.darkText]}>
                  Icône *
                </Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={true}
                  contentContainerStyle={styles.iconsContainer}
                >
                  {iconOptions.map((icon) => (
                    <TouchableOpacity
                      key={icon}
                      style={[
                        styles.iconButton,
                        category.icon === icon && styles.iconButtonSelected,
                        isDark && styles.darkIconButton,
                      ]}
                      onPress={() => updateCategoryField(index, 'icon', icon)}
                    >
                      <Ionicons 
                        name={icon as any} 
                        size={20} 
                        color={category.icon === icon ? '#fff' : (isDark ? '#fff' : '#666')} 
                      />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Couleur */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, isDark && styles.darkText]}>
                  Couleur *
                </Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={true}
                  contentContainerStyle={styles.colorsScrollContainer}
                >
                  <View style={styles.colorsContainer}>
                    {colorOptions.map((color) => (
                      <TouchableOpacity
                        key={color}
                        style={[
                          styles.colorButton,
                          { backgroundColor: color },
                          category.color === color && styles.colorButtonSelected
                        ]}
                        onPress={() => updateCategoryField(index, 'color', color)}
                      >
                        {category.color === color && (
                          <Ionicons name="checkmark" size={16} color="#fff" />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>

              {/* Aperçu */}
              {category.name && (
                <View style={[styles.previewContainer, isDark && styles.darkPreview]}>
                  <Text style={[styles.previewLabel, isDark && styles.darkSubtext]}>
                    Aperçu:
                  </Text>
                  <View style={styles.previewContent}>
                    <View style={[styles.previewIcon, { backgroundColor: category.color }]}>
                      <Ionicons name={category.icon as any} size={16} color="#fff" />
                    </View>
                    <Text style={[styles.previewText, isDark && styles.darkText]}>
                      {category.name}
                    </Text>
                    <View style={[
                      styles.previewType,
                      { backgroundColor: category.type === 'income' ? '#10B98120' : '#EF444420' }
                    ]}>
                      <Text style={[
                        styles.previewTypeText,
                        { color: category.type === 'income' ? '#10B981' : '#EF4444' }
                      ]}>
                        {category.type === 'income' ? 'Revenu' : 'Dépense'}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Bouton de création */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[styles.cancelButton, isDark && styles.darkCancelButton]}
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Annuler</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.createButton, 
              (loading || filledCategoriesCount === 0) && styles.createButtonDisabled
            ]}
            onPress={handleCreateCategories}
            disabled={loading || filledCategoriesCount === 0}
          >
            <Ionicons name="layers" size={20} color="#fff" />
            <Text style={styles.createButtonText}>
              {loading ? 'Création...' : `Créer ${filledCategoriesCount} catégorie(s)`}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.spacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  darkContainer: {
    backgroundColor: '#1c1c1e',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    flex: 1,
  },
  clearButton: {
    padding: 8,
  },
  clearButtonText: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '500',
  },
  statsCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  darkCard: {
    backgroundColor: '#2c2c2e',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  templatesContainer: {
    paddingRight: 16,
    gap: 12,
  },
  templateCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  templateIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  templateName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    marginBottom: 6,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF15',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  addButtonText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  categoryCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cardTitle: {
    flex: 1,
  },
  cardNumber: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    marginBottom: 4,
  },
  cardPreview: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  removeButton: {
    padding: 4,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#000',
  },
  darkInput: {
    backgroundColor: '#38383a',
    borderColor: '#444',
    color: '#fff',
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    gap: 8,
  },
  darkTypeButton: {
    backgroundColor: '#38383a',
    borderColor: '#444',
  },
  typeButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  typeButtonTextSelected: {
    color: '#fff',
  },
  iconsContainer: {
    gap: 8,
    paddingRight: 16,
  },
  iconButton: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  darkIconButton: {
    backgroundColor: '#38383a',
    borderColor: '#444',
  },
  iconButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  colorsScrollContainer: {
    paddingRight: 16,
  },
  colorsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  colorButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorButtonSelected: {
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  previewContainer: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  darkPreview: {
    backgroundColor: '#38383a',
  },
  previewLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    marginBottom: 8,
  },
  previewContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  previewIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    flex: 1,
  },
  previewType: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  previewTypeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  darkCancelButton: {
    backgroundColor: '#38383a',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  createButton: {
    flex: 2,
    backgroundColor: '#007AFF',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  createButtonDisabled: {
    backgroundColor: '#ccc',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  spacer: {
    height: 40,
  },
  darkText: {
    color: '#fff',
  },
  darkSubtext: {
    color: '#888',
  },
});

export default AddMultipleCategoriesScreen;