// src/screens/CategoriesScreen.tsx - VERSION CORRIGÉE SANS TEMPLATES
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
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
import { Category } from '../types';

// ✅ DÉFINITION DES TYPES LOCAUX
interface CategoryFormData {
  name: string;
  type: 'expense' | 'income';
  color: string;
  icon: string;
}

interface DatabaseCategory {
  id: string;
  user_id: string;
  name: string;
  type: string;
  color: string;
  icon: string;
  created_at: string;
}

const CategoriesScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { theme } = useTheme();
  const { categories, loading, error, createCategory, updateCategory, deleteCategory, refreshCategories } = useCategories();
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const isDark = theme === 'dark';

  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    type: 'expense',
    color: '#007AFF',
    icon: 'ellipsis-horizontal',
  });

  // ✅ CORRECTION: Tableaux de couleurs et icônes avec types appropriés
  const categoryColors: string[] = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#778899',
    '#50C878', '#FFD700', '#9370DB', '#20B2AA', '#007AFF', '#FF9500', '#5856D6'
  ];

  const categoryIcons: string[] = [
    'restaurant', 'car', 'home', 'game-controller', 'medical', 'cart', 'ellipsis-horizontal',
    'cash', 'gift', 'trending-up', 'add-circle', 'airplane', 'book', 'cafe'
  ];

  // ✅ CORRECTION: Fonction de rafraîchissement typée
  const onRefresh = async (): Promise<void> => {
    setRefreshing(true);
    await refreshCategories();
    setRefreshing(false);
  };

  const openAddModal = (): void => {
    setEditingCategory(null);
    setFormData({
      name: '',
      type: 'expense',
      color: '#007AFF',
      icon: 'ellipsis-horizontal',
    });
    setModalVisible(true);
  };

  const openEditModal = (category: Category): void => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      type: category.type,
      color: category.color,
      icon: category.icon,
    });
    setModalVisible(true);
  };

  const closeModal = (): void => {
    setModalVisible(false);
    setEditingCategory(null);
  };

  const handleSubmit = async (): Promise<void> => {
    if (!formData.name.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir un nom pour la catégorie');
      return;
    }

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
        Alert.alert('Succès', 'Catégorie modifiée avec succès');
      } else {
        await createCategory(formData);
        Alert.alert('Succès', 'Catégorie créée avec succès');
      }
      closeModal();
    } catch (error) {
      Alert.alert('Erreur', error instanceof Error ? error.message : 'Une erreur est survenue');
    }
  };

  const handleDelete = (category: Category): void => {
    Alert.alert(
      'Supprimer la catégorie',
      `Êtes-vous sûr de vouloir supprimer "${category.name}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Supprimer', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCategory(category.id);
              Alert.alert('Succès', 'Catégorie supprimée avec succès');
            } catch (error) {
              Alert.alert('Erreur', error instanceof Error ? error.message : 'Impossible de supprimer la catégorie');
            }
          }
        },
      ]
    );
  };

  // ✅ CORRECTION: Fonction de rendu correctement typée - SUPPRIMER JSX.Element
  const renderCategoryItem = ({ item }: { item: Category }) => (
    <TouchableOpacity 
      style={[styles.categoryItem, isDark && styles.darkCard]}
      onPress={() => openEditModal(item)}
      onLongPress={() => handleDelete(item)}
    >
      <View style={styles.categoryInfo}>
        <View style={[styles.colorIndicator, { backgroundColor: item.color }]} />
        <Ionicons name={item.icon as any} size={20} color={isDark ? '#fff' : '#000'} />
        <Text style={[styles.categoryName, isDark && styles.darkText]}>
          {item.name}
        </Text>
      </View>
      <View style={[
        styles.typeBadge,
        { backgroundColor: item.type === 'income' ? '#34C759' : '#FF3B30' }
      ]}>
        <Text style={styles.typeBadgeText}>
          {item.type === 'income' ? 'Revenu' : 'Dépense'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // ✅ CORRECTION: Filtrage des catégories avec types
  const expenseCategories = categories.filter((cat: Category) => cat.type === 'expense');
  const incomeCategories = categories.filter((cat: Category) => cat.type === 'income');

  // ✅ CORRECTION: État de chargement
  if (loading && !refreshing) {
    return (
      <View style={[styles.container, isDark && styles.darkContainer, styles.center]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={[styles.loadingText, isDark && styles.darkText]}>
          Chargement des catégories...
        </Text>
      </View>
    );
  }

  // ✅ CORRECTION: État d'erreur
  if (error) {
    return (
      <View style={[styles.container, isDark && styles.darkContainer, styles.center]}>
        <Ionicons name="alert-circle-outline" size={64} color="#FF3B30" />
        <Text style={[styles.errorText, isDark && styles.darkText]}>
          {error}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={refreshCategories}>
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView>
      <View style={[styles.container, isDark && styles.darkContainer]}>
        <View style={[styles.header, isDark && styles.darkHeader]}>
          <Text style={[styles.title, isDark && styles.darkText]}>
            Catégories
          </Text>
          <Text style={[styles.subtitle, isDark && styles.darkSubtext]}>
            Gérez vos catégories de transactions
          </Text>
        </View>

        {/* ✅ CORRECTION: FlatList avec ListHeaderComponent correctement typé */}
        <FlatList
          data={[]}
          renderItem={null as any}
          refreshing={refreshing}
          onRefresh={onRefresh}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, isDark && styles.darkText]}>
                  Dépenses ({expenseCategories.length})
                </Text>
                {expenseCategories.map((category: Category) => (
                  <View key={category.id}>
                    {renderCategoryItem({ item: category })}
                  </View>
                ))}
                {expenseCategories.length === 0 && (
                  <Text style={[styles.emptyText, isDark && styles.darkSubtext]}>
                    Aucune catégorie de dépense
                  </Text>
                )}
              </View>

              <View style={styles.section}>
                <Text style={[styles.sectionTitle, isDark && styles.darkText]}>
                  Revenus ({incomeCategories.length})
                </Text>
                {incomeCategories.map((category: Category) => (
                  <View key={category.id}>
                    {renderCategoryItem({ item: category })}
                  </View>
                ))}
                {incomeCategories.length === 0 && (
                  <Text style={[styles.emptyText, isDark && styles.darkSubtext]}>
                    Aucune catégorie de revenu
                  </Text>
                )}
              </View>

              {/* ✅ BOUTON POUR L'AJOUT MULTIPLE */}
              <TouchableOpacity 
                style={[styles.multipleButton, isDark && styles.darkMultipleButton]}
                onPress={() => navigation.navigate('AddMultipleCategories')}
              >
                <Ionicons name="layers" size={20} color="#007AFF" />
                <Text style={styles.multipleButtonText}>
                  Ajouter plusieurs catégories
                </Text>
              </TouchableOpacity>
            </>
          }
          ListFooterComponent={<View style={styles.spacer} />}
        />

        <TouchableOpacity 
          style={styles.fab}
          onPress={openAddModal}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>

        {/* ✅ CORRECTION: Modal avec types corrects */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          onRequestClose={closeModal}
        >
          <View style={[styles.modalContainer, isDark && styles.darkContainer]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, isDark && styles.darkText]}>
                {editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
              </Text>
              <TouchableOpacity onPress={closeModal}>
                <Ionicons name="close" size={24} color={isDark ? '#fff' : '#000'} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, isDark && styles.darkText]}>Nom</Text>
                <TextInput
                  style={[styles.input, isDark && styles.darkInput]}
                  value={formData.name}
                  onChangeText={(text: string) => setFormData({ ...formData, name: text })}
                  placeholder="Nom de la catégorie"
                  placeholderTextColor={isDark ? '#666' : '#999'}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, isDark && styles.darkText]}>Type</Text>
                <View style={styles.typeContainer}>
                  <TouchableOpacity
                    style={[
                      styles.typeButton,
                      formData.type === 'expense' && styles.typeButtonSelected,
                    ]}
                    onPress={() => setFormData({ ...formData, type: 'expense' })}
                  >
                    <Text style={[
                      styles.typeButtonText,
                      formData.type === 'expense' && styles.typeButtonTextSelected,
                    ]}>
                      Dépense
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.typeButton,
                      formData.type === 'income' && styles.typeButtonSelected,
                    ]}
                    onPress={() => setFormData({ ...formData, type: 'income' })}
                  >
                    <Text style={[
                      styles.typeButtonText,
                      formData.type === 'income' && styles.typeButtonTextSelected,
                    ]}>
                      Revenu
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, isDark && styles.darkText]}>Couleur</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.colorsContainer}>
                    {categoryColors.map((color: string) => (
                      <TouchableOpacity
                        key={color}
                        style={[
                          styles.colorButton,
                          { backgroundColor: color },
                          formData.color === color && styles.colorButtonSelected,
                        ]}
                        onPress={() => setFormData({ ...formData, color })}
                      >
                        {formData.color === color && (
                          <Ionicons name="checkmark" size={16} color="#fff" />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, isDark && styles.darkText]}>Icône</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.iconsContainer}>
                    {categoryIcons.map((icon: string) => (
                      <TouchableOpacity
                        key={icon}
                        style={[
                          styles.iconButton,
                          isDark && styles.darkIconButton,
                          formData.icon === icon && styles.iconButtonSelected,
                        ]}
                        onPress={() => setFormData({ ...formData, icon })}
                      >
                        <Ionicons 
                          name={icon as any} 
                          size={20} 
                          color={formData.icon === icon ? '#007AFF' : (isDark ? '#fff' : '#000')} 
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, isDark && styles.darkText]}>Aperçu</Text>
                <View style={[styles.preview, isDark && styles.darkCard]}>
                  <View style={[styles.colorIndicator, { backgroundColor: formData.color }]} />
                  <Ionicons name={formData.icon as any} size={20} color={isDark ? '#fff' : '#000'} />
                  <Text style={[styles.previewText, isDark && styles.darkText]}>
                    {formData.name || 'Nom de la catégorie'}
                  </Text>
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.cancelButton, isDark && styles.darkCancelButton]}
                onPress={closeModal}
              >
                <Text style={[styles.cancelButtonText, isDark && styles.darkText]}>
                  Annuler
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.submitButton, !formData.name && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={!formData.name}
              >
                <Text style={styles.submitButtonText}>
                  {editingCategory ? 'Modifier' : 'Créer'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

// ✅ CORRECTION: Styles avec toutes les propriétés nécessaires
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  darkContainer: {
    backgroundColor: '#1c1c1e',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  darkHeader: {
    backgroundColor: '#2c2c2e',
    borderBottomColor: '#38383a',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  section: {
    padding: 16,
    paddingBottom: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  darkCard: {
    backgroundColor: '#2c2c2e',
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  colorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginLeft: 12,
    flex: 1,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
    marginVertical: 20,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  spacer: {
    height: 100,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  inputGroup: {
    marginBottom: 24,
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
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#000',
  },
  darkInput: {
    backgroundColor: '#2c2c2e',
    borderColor: '#38383a',
    color: '#fff',
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  typeButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  typeButtonTextSelected: {
    color: '#fff',
  },
  colorsContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 8,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorButtonSelected: {
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  iconsContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 8,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  darkIconButton: {
    backgroundColor: '#2c2c2e',
  },
  iconButtonSelected: {
    backgroundColor: '#e3f2fd',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  preview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  previewText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginLeft: 12,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  darkCancelButton: {
    backgroundColor: '#2c2c2e',
    borderColor: '#38383a',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  submitButton: {
    flex: 2,
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // ✅ STYLES POUR LE BOUTON MULTIPLE
  multipleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF15',
    padding: 16,
    borderRadius: 12,
    margin: 16,
    marginTop: 8,
    gap: 12,
    justifyContent: 'center',
  },
  darkMultipleButton: {
    backgroundColor: '#007AFF20',
  },
  multipleButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  darkText: {
    color: '#fff',
  },
  darkSubtext: {
    color: '#888',
  },
});

export default CategoriesScreen; 