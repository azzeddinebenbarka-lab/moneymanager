// src/screens/ImportScreen.tsx - VERSION ULTRA SIMPLE
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useLanguage } from '../context/LanguageContext';

const ImportScreen = () => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);

  const handleImport = () => {
    setIsLoading(true);
    
    // Simuler un import
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        '✅ Import Réussi', 
        'Vos données ont été importées avec succès!'
      );
    }, 2000);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📥 Importation</Text>
        <Text style={styles.subtitle}>
          Importez vos données depuis MySQL
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Données importables</Text>
        <Text style={styles.cardItem}>• Comptes bancaires</Text>
        <Text style={styles.cardItem}>• Catégories</Text>
        <Text style={styles.cardItem}>• Transactions</Text>
        <Text style={styles.cardItem}>• Dettes</Text>
        <Text style={styles.cardItem}>• Charges annuelles</Text>
      </View>

      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleImport}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Import en cours...' : '🚀 Démarrer l\'import'}
        </Text>
      </TouchableOpacity>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Instructions</Text>
        <Text style={styles.infoText}>
          1. Exportez votre base MySQL{'\n'}
          2. Lancez l'importation{'\n'}
          3. Vérifiez les résultats
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1a1a1a',
  },
  cardItem: {
    fontSize: 16,
    color: '#444',
    marginBottom: 6,
  },
  button: {
    backgroundColor: '#007AFF',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoCard: {
    backgroundColor: '#e3f2fd',
    margin: 20,
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#0D47A1',
  },
  infoText: {
    fontSize: 14,
    color: '#0D47A1',
    lineHeight: 20,
  },
});

export default ImportScreen;
console.log('🔍 [DEBUG] ImportScreen:', ImportScreen);
console.log('🔍 [DEBUG] Tous les écrans chargés');