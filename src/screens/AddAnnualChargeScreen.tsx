// src/screens/AddAnnualChargeScreen.tsx - VERSION CORRIGÉE
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from '../components/SafeAreaView';
import { useCurrency } from '../context/CurrencyContext';
import { useTheme } from '../context/ThemeContext';
import { useAnnualCharges } from '../hooks/useAnnualCharges';
import { ANNUAL_CHARGE_CATEGORIES } from '../types/AnnualCharge';

export const AddAnnualChargeScreen: React.FC = () => {
  const { addAnnualCharge } = useAnnualCharges(); // CORRIGÉ: addAnnualCharge au lieu de createCharge
  const { formatAmount } = useCurrency();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    dueDate: new Date(), // CORRIGÉ: Date au lieu de string
    category: 'other',
    description: '',
    isRecurring: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.amount) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Erreur', 'Le montant doit être un nombre positif');
      return;
    }

    try {
      setIsSubmitting(true);
      
      await addAnnualCharge({
        name: formData.name.trim(),
        amount: amount,
        dueDate: formData.dueDate, // CORRIGÉ: déjà un Date
        category: formData.category,
        description: formData.description.trim(),
        isRecurring: formData.isRecurring
      });

      Alert.alert('Succès', 'Charge annuelle ajoutée avec succès', [
        { text: 'OK', onPress: () => resetForm() }
      ]);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'ajouter la charge annuelle');
      console.error('Error adding annual charge:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      amount: '',
      dueDate: new Date(),
      category: 'other',
      description: '',
      isRecurring: true
    });
  };

  return (
    <SafeAreaView>
      <ScrollView style={[styles.container, isDark && styles.darkContainer]}>
        <Text style={[styles.title, isDark && styles.darkText]}>
          Nouvelle Charge Annuelle
        </Text>

        {/* Formulaire */}
        <View style={styles.form}>
          {/* Nom */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, isDark && styles.darkText]}>Nom *</Text>
            <TextInput
              style={[styles.input, isDark && styles.darkInput]}
              value={formData.name}
              onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
              placeholder="Nom de la charge"
              placeholderTextColor={isDark ? '#888' : '#999'}
            />
          </View>

          {/* Montant */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, isDark && styles.darkText]}>Montant *</Text>
            <TextInput
              style={[styles.input, isDark && styles.darkInput]}
              value={formData.amount}
              onChangeText={(text) => setFormData(prev => ({ ...prev, amount: text }))}
              placeholder="0.00"
              placeholderTextColor={isDark ? '#888' : '#999'}
              keyboardType="decimal-pad"
            />
            <Text style={[styles.currencyHint, isDark && styles.darkSubtext]}>
              {formData.amount ? formatAmount(parseFloat(formData.amount) || 0) : ''}
            </Text>
          </View>

          {/* Catégorie */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, isDark && styles.darkText]}>Catégorie</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
              <View style={styles.categoriesContainer}>
                {ANNUAL_CHARGE_CATEGORIES.map((category) => (
                  <TouchableOpacity
                    key={category.value}
                    style={[
                      styles.categoryButton,
                      formData.category === category.value && styles.categoryButtonSelected,
                      isDark && styles.darkCategoryButton
                    ]}
                    onPress={() => setFormData(prev => ({ ...prev, category: category.value }))}
                  >
                    <Text style={styles.categoryIcon}>{category.icon}</Text>
                    <Text style={[
                      styles.categoryText,
                      formData.category === category.value && styles.categoryTextSelected,
                      isDark && styles.darkCategoryText
                    ]}>
                      {category.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Description */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, isDark && styles.darkText]}>Description</Text>
            <TextInput
              style={[styles.textArea, isDark && styles.darkInput]}
              value={formData.description}
              onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
              placeholder="Description optionnelle"
              placeholderTextColor={isDark ? '#888' : '#999'}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Récurrence */}
          <View style={styles.inputGroup}>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setFormData(prev => ({ ...prev, isRecurring: !prev.isRecurring }))}
            >
              <View style={[
                styles.checkbox,
                formData.isRecurring && styles.checkboxSelected,
                isDark && styles.darkCheckbox
              ]}>
                {formData.isRecurring && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={[styles.checkboxLabel, isDark && styles.darkText]}>
                Charge récurrente (annuelle)
              </Text>
            </TouchableOpacity>
          </View>

          {/* Bouton de soumission */}
          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'Ajout en cours...' : 'Ajouter la Charge'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  darkContainer: {
    backgroundColor: '#1c1c1e',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 24,
    textAlign: 'center',
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#000',
  },
  darkInput: {
    backgroundColor: '#2c2c2e',
    borderColor: '#444',
    color: '#fff',
  },
  textArea: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#000',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  currencyHint: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  categoriesScroll: {
    marginHorizontal: -16,
  },
  categoriesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  darkCategoryButton: {
    backgroundColor: '#2c2c2e',
    borderColor: '#444',
  },
  categoryButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  categoryIcon: {
    fontSize: 16,
  },
  categoryText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  darkCategoryText: {
    color: '#fff',
  },
  categoryTextSelected: {
    color: '#fff',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkCheckbox: {
    borderColor: '#0A84FF',
  },
  checkboxSelected: {
    backgroundColor: '#007AFF',
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#000',
    flex: 1,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  darkText: {
    color: '#fff',
  },
  darkSubtext: {
    color: '#888',
  },
});

export default AddAnnualChargeScreen;