// src/components/charts/ChartFilters.tsx - NOUVEAU COMPOSANT COMPLET
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useCategories } from '../../hooks/useCategories';
import { translateCategoryName } from '../../utils/categoryTranslations';

export interface ChartFilter {
  period: 'day' | 'week' | 'month' | 'year' | 'custom';
  year?: number;
  month?: number;
  category?: string;
  type?: 'all' | 'income' | 'expense';
  dateRange?: {
    start: Date;
    end: Date;
  };
}

interface ChartFiltersProps {
  filters: ChartFilter;
  onFiltersChange: (filters: ChartFilter) => void;
  availableYears?: number[];
  showCategoryFilter?: boolean;
  showTypeFilter?: boolean;
  showDateRangeFilter?: boolean;
}

export const ChartFilters: React.FC<ChartFiltersProps> = ({
  filters,
  onFiltersChange,
  availableYears = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i),
  showCategoryFilter = true,
  showTypeFilter = true,
  showDateRangeFilter = false,
}) => {
  const { theme } = useTheme();
  const { categories } = useCategories();
  const { t } = useLanguage();
  const isDark = theme === 'dark';
  
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showYearModal, setShowYearModal] = useState(false);
  const [showMonthModal, setShowMonthModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const periods = [
    { value: 'week' as const, label: '7j', icon: 'calendar-outline' },
    { value: 'month' as const, label: '30j', icon: 'calendar' },
    { value: 'year' as const, label: '1an', icon: 'business' },
    { value: 'custom' as const, label: 'Perso', icon: 'options' },
  ];

  const types = [
    { value: 'all' as const, label: 'Tous', icon: 'list' },
    { value: 'income' as const, label: 'Revenus', icon: 'trending-up', color: '#10B981' },
    { value: 'expense' as const, label: 'Dépenses', icon: 'trending-down', color: '#EF4444' },
  ];

  const months = [
    { value: 1, label: 'Janvier', short: 'Jan' },
    { value: 2, label: 'Février', short: 'Fév' },
    { value: 3, label: 'Mars', short: 'Mar' },
    { value: 4, label: 'Avril', short: 'Avr' },
    { value: 5, label: 'Mai', short: 'Mai' },
    { value: 6, label: 'Juin', short: 'Jun' },
    { value: 7, label: 'Juillet', short: 'Jul' },
    { value: 8, label: 'Août', short: 'Aoû' },
    { value: 9, label: 'Septembre', short: 'Sep' },
    { value: 10, label: 'Octobre', short: 'Oct' },
    { value: 11, label: 'Novembre', short: 'Nov' },
    { value: 12, label: 'Décembre', short: 'Déc' },
  ];

  const handlePeriodChange = (period: ChartFilter['period']) => {
    const newFilters: ChartFilter = { ...filters, period };
    
    if (period !== 'custom') {
      // Réinitialiser les filtres personnalisés pour les périodes prédéfinies
      delete newFilters.year;
      delete newFilters.month;
      delete newFilters.dateRange;
    }
    
    onFiltersChange(newFilters);
  };

  const handleYearChange = (year: number) => {
    onFiltersChange({ 
      ...filters, 
      year,
      period: 'custom'
    });
    setShowYearModal(false);
  };

  const handleMonthChange = (month: number) => {
    onFiltersChange({ 
      ...filters, 
      month,
      period: 'custom'
    });
    setShowMonthModal(false);
  };

  const handleCategoryChange = (category: string) => {
    onFiltersChange({ 
      ...filters, 
      category: category === filters.category ? undefined : category
    });
    setShowCategoryModal(false);
  };

  const handleTypeChange = (type: ChartFilter['type']) => {
    onFiltersChange({ ...filters, type });
  };

  const clearFilters = () => {
    onFiltersChange({ period: 'month' });
  };

  const getSelectedCategoryName = () => {
    if (!filters.category) return 'Toutes catégories';
    return categories.find(cat => cat.id === filters.category)?.name || filters.category;
  };

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const FilterButton = ({ 
    label, 
    value, 
    onPress, 
    isActive,
    icon,
    color
  }: {
    label: string;
    value: string;
    onPress: () => void;
    isActive: boolean;
    icon?: string;
    color?: string;
  }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        isActive && styles.filterButtonActive,
        isDark && styles.darkFilterButton,
        isActive && isDark && styles.darkFilterButtonActive,
        color && isActive && { backgroundColor: color + '20', borderColor: color },
      ]}
      onPress={onPress}
    >
      {icon && (
        <Ionicons 
          name={icon as any} 
          size={16} 
          color={isActive ? (color || '#007AFF') : (isDark ? '#888' : '#666')} 
        />
      )}
      <Text
        style={[
          styles.filterButtonText,
          isActive && styles.filterButtonTextActive,
          isDark && styles.darkText,
          isActive && color && { color },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const ModalOverlay = ({ visible, onClose, children, title }: any) => (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, isDark && styles.darkModalContent]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, isDark && styles.darkText]}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={isDark ? '#fff' : '#000'} />
            </TouchableOpacity>
          </View>
          {children}
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
      {/* Filtres de période */}
      <View style={styles.filterSection}>
        <Text style={[styles.sectionLabel, isDark && styles.darkSubtext]}>Période</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersRow}>
          {periods.map(period => (
            <FilterButton
              key={period.value}
              label={period.label}
              value={period.value}
              icon={period.icon}
              isActive={filters.period === period.value}
              onPress={() => handlePeriodChange(period.value)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Filtres année/mois pour période personnalisée */}
      {filters.period === 'custom' && (
        <View style={styles.customFilters}>
          <View style={styles.filterSection}>
            <Text style={[styles.sectionLabel, isDark && styles.darkSubtext]}>Année</Text>
            <TouchableOpacity
              style={[styles.selectButton, isDark && styles.darkSelectButton]}
              onPress={() => setShowYearModal(true)}
            >
              <Text style={[styles.selectButtonText, isDark && styles.darkText]}>
                {filters.year || new Date().getFullYear()}
              </Text>
              <Ionicons name="chevron-down" size={16} color={isDark ? '#888' : '#666'} />
            </TouchableOpacity>
          </View>

          <View style={styles.filterSection}>
            <Text style={[styles.sectionLabel, isDark && styles.darkSubtext]}>Mois</Text>
            <TouchableOpacity
              style={[styles.selectButton, isDark && styles.darkSelectButton]}
              onPress={() => setShowMonthModal(true)}
            >
              <Text style={[styles.selectButtonText, isDark && styles.darkText]}>
                {filters.month ? months.find(m => m.value === filters.month)?.short : 'Tous'}
              </Text>
              <Ionicons name="chevron-down" size={16} color={isDark ? '#888' : '#666'} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Filtres type et catégorie */}
      <View style={styles.advancedFilters}>
        {showTypeFilter && (
          <View style={styles.filterSection}>
            <Text style={[styles.sectionLabel, isDark && styles.darkSubtext]}>Type</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersRow}>
              {types.map(type => (
                <FilterButton
                  key={type.value}
                  label={type.label}
                  value={type.value}
                  icon={type.icon}
                  color={type.color}
                  isActive={filters.type === type.value}
                  onPress={() => handleTypeChange(type.value)}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {showCategoryFilter && (
          <View style={styles.filterSection}>
            <Text style={[styles.sectionLabel, isDark && styles.darkSubtext]}>Catégorie</Text>
            <TouchableOpacity
              style={[styles.selectButton, isDark && styles.darkSelectButton]}
              onPress={() => setShowCategoryModal(true)}
            >
              <Text 
                style={[styles.selectButtonText, isDark && styles.darkText]}
                numberOfLines={1}
              >
                {getSelectedCategoryName()}
              </Text>
              <Ionicons name="chevron-down" size={16} color={isDark ? '#888' : '#666'} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Bouton réinitialiser */}
      {(filters.category || filters.type !== 'all' || filters.period === 'custom') && (
        <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
          <Ionicons name="refresh" size={16} color="#007AFF" />
          <Text style={styles.clearButtonText}>Réinitialiser</Text>
        </TouchableOpacity>
      )}

      {/* Modals */}
      <ModalOverlay
        visible={showYearModal}
        onClose={() => setShowYearModal(false)}
        title="Sélectionner l'année"
      >
        <ScrollView style={styles.modalList}>
          {availableYears.map(year => (
            <TouchableOpacity
              key={year}
              style={[
                styles.modalItem,
                filters.year === year && styles.modalItemActive,
                isDark && styles.darkModalItem,
              ]}
              onPress={() => handleYearChange(year)}
            >
              <Text style={[
                styles.modalItemText,
                filters.year === year && styles.modalItemTextActive,
                isDark && styles.darkText,
              ]}>
                {year}
              </Text>
              {filters.year === year && (
                <Ionicons name="checkmark" size={20} color="#007AFF" />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ModalOverlay>

      <ModalOverlay
        visible={showMonthModal}
        onClose={() => setShowMonthModal(false)}
        title="Sélectionner le mois"
      >
        <ScrollView style={styles.modalList}>
          <TouchableOpacity
            style={[
              styles.modalItem,
              !filters.month && styles.modalItemActive,
              isDark && styles.darkModalItem,
            ]}
            onPress={() => handleMonthChange(undefined!)}
          >
            <Text style={[
              styles.modalItemText,
              !filters.month && styles.modalItemTextActive,
              isDark && styles.darkText,
            ]}>
              Tous les mois
            </Text>
            {!filters.month && (
              <Ionicons name="checkmark" size={20} color="#007AFF" />
            )}
          </TouchableOpacity>
          {months.map(month => (
            <TouchableOpacity
              key={month.value}
              style={[
                styles.modalItem,
                filters.month === month.value && styles.modalItemActive,
                isDark && styles.darkModalItem,
              ]}
              onPress={() => handleMonthChange(month.value)}
            >
              <Text style={[
                styles.modalItemText,
                filters.month === month.value && styles.modalItemTextActive,
                isDark && styles.darkText,
              ]}>
                {month.label}
              </Text>
              {filters.month === month.value && (
                <Ionicons name="checkmark" size={20} color="#007AFF" />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ModalOverlay>

      <ModalOverlay
        visible={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        title="Sélectionner une catégorie"
      >
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={isDark ? '#888' : '#666'} />
          <TextInput
            style={[styles.searchInput, isDark && styles.darkSearchInput]}
            placeholder="Rechercher une catégorie..."
            placeholderTextColor={isDark ? '#888' : '#999'}
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>
        <ScrollView style={styles.modalList}>
          <TouchableOpacity
            style={[
              styles.modalItem,
              !filters.category && styles.modalItemActive,
              isDark && styles.darkModalItem,
            ]}
            onPress={() => handleCategoryChange('')}
          >
            <View style={[styles.categoryColor, { backgroundColor: 'transparent' }]} />
            <Text style={[
              styles.modalItemText,
              !filters.category && styles.modalItemTextActive,
              isDark && styles.darkText,
            ]}>
              Toutes les catégories
            </Text>
            {!filters.category && (
              <Ionicons name="checkmark" size={20} color="#007AFF" />
            )}
          </TouchableOpacity>
          {filteredCategories.map(category => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.modalItem,
                filters.category === category.id && styles.modalItemActive,
                isDark && styles.darkModalItem,
              ]}
              onPress={() => handleCategoryChange(category.id)}
            >
              <View style={[styles.categoryColor, { backgroundColor: category.color }]} />
              <Text style={[
                styles.modalItemText,
                filters.category === category.id && styles.modalItemTextActive,
                isDark && styles.darkText,
              ]}>
                {translateCategoryName(category.name, t)}
              </Text>
              {filters.category === category.id && (
                <Ionicons name="checkmark" size={20} color="#007AFF" />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ModalOverlay>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  darkContainer: {
    backgroundColor: '#2c2c2e',
  },
  filterSection: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  filtersRow: {
    flexGrow: 0,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginRight: 8,
    minHeight: 36,
  },
  darkFilterButton: {
    backgroundColor: '#38383a',
    borderColor: '#444',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF20',
    borderColor: '#007AFF',
  },
  darkFilterButtonActive: {
    backgroundColor: '#007AFF40',
    borderColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginLeft: 4,
  },
  filterButtonTextActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  customFilters: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  advancedFilters: {
    gap: 12,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  darkSelectButton: {
    backgroundColor: '#38383a',
    borderColor: '#444',
  },
  selectButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    flex: 1,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
    marginTop: 8,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#007AFF',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  darkModalContent: {
    backgroundColor: '#2c2c2e',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  darkModalHeader: {
    borderBottomColor: '#38383a',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  closeButton: {
    padding: 4,
  },
  modalList: {
    maxHeight: 400,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  darkModalItem: {
    borderBottomColor: '#38383a',
  },
  modalItemActive: {
    backgroundColor: '#007AFF10',
  },
  modalItemText: {
    fontSize: 16,
    color: '#000',
    flex: 1,
  },
  modalItemTextActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  darkSearchContainer: {
    borderBottomColor: '#38383a',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#000',
  },
  darkSearchInput: {
    color: '#fff',
  },
  categoryColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  darkText: {
    color: '#fff',
  },
  darkSubtext: {
    color: '#888',
  },
});

export default ChartFilters;