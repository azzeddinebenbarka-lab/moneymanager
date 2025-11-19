// src/components/TestCategories.tsx - VERSION COMPLÈTE
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Button, Alert } from 'react-native';
import { useCategories } from '../hooks/useCategories';

export const TestCategories: React.FC = () => {
  const { 
    categories, 
    loading, 
    error, 
    initializeDefaultCategories, 
    refreshCategories,
    forceResetCategories,
    diagnoseCategories
  } = useCategories();
  
  const [diagnostic, setDiagnostic] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    runDiagnostic();
  }, []);

  const runDiagnostic = async () => {
    try {
      const result = await diagnoseCategories();
      setDiagnostic(result);
    } catch (err) {
      console.error('Error running diagnostic:', err);
    }
  };

  const handleInitialize = async () => {
    try {
      setActionLoading(true);
      await initializeDefaultCategories();
      await refreshCategories();
      await runDiagnostic();
      Alert.alert('Succès', 'Catégories initialisées avec succès');
    } catch (err) {
      Alert.alert('Erreur', 'Erreur lors de l\'initialisation');
      console.error('Error initializing categories:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleForceReset = async () => {
    Alert.alert(
      'Confirmation',
      'Êtes-vous sûr de vouloir réinitialiser toutes les catégories ? Cette action est irréversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Réinitialiser', 
          style: 'destructive',
          onPress: async () => {
            try {
              setActionLoading(true);
              await forceResetCategories();
              await runDiagnostic();
              Alert.alert('Succès', 'Catégories réinitialisées avec succès');
            } catch (err) {
              Alert.alert('Erreur', 'Erreur lors de la réinitialisation');
              console.error('Error resetting categories:', err);
            } finally {
              setActionLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleRefresh = async () => {
    try {
      setActionLoading(true);
      await refreshCategories();
      await runDiagnostic();
    } catch (err) {
      console.error('Error refreshing:', err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading && categories.length === 0) {
    return (
      <View style={{ padding: 20 }}>
        <Text>Chargement des catégories...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
        🔧 Test des Catégories
      </Text>

      {error && (
        <Text style={{ color: 'red', marginBottom: 10 }}>❌ Erreur: {error}</Text>
      )}

      <View style={{ marginBottom: 20 }}>
        <Button 
          title={actionLoading ? "Traitement..." : "Initialiser les Catégories"} 
          onPress={handleInitialize} 
          disabled={actionLoading}
        />
        <View style={{ marginTop: 10 }} />
        <Button 
          title={actionLoading ? "Traitement..." : "FORCE RESET (DANGER)"} 
          onPress={handleForceReset} 
          disabled={actionLoading}
          color="red"
        />
        <View style={{ marginTop: 10 }} />
        <Button 
          title={actionLoading ? "Traitement..." : "Rafraîchir et Diagnostiquer"} 
          onPress={handleRefresh} 
          disabled={actionLoading}
        />
      </View>

      {diagnostic && (
        <View style={{ marginBottom: 20, padding: 10, backgroundColor: '#f0f0f0' }}>
          <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>📊 Diagnostic:</Text>
          <Text>• Total catégories: {diagnostic.totalCategories}</Text>
          <Text>• Structure: {diagnostic.tableStructure?.length} colonnes</Text>
          
          {diagnostic.levelCounts && diagnostic.levelCounts.map((item: any) => (
            <Text key={item.level}>
              • Niveau {item.level}: {item.count} catégories
            </Text>
          ))}
          
          {diagnostic.typeCounts && diagnostic.typeCounts.map((item: any) => (
            <Text key={item.type}>
              • Type {item.type}: {item.count} catégories
            </Text>
          ))}

          <Text style={{ fontWeight: 'bold', marginTop: 10 }}>Échantillons:</Text>
          {diagnostic.sampleCategories && diagnostic.sampleCategories.slice(0, 5).map((cat: any) => (
            <Text key={cat.id} style={{ fontSize: 12 }}>
              - {cat.name} ({cat.type}) - Niv.{cat.level} {cat.parent_id ? `Parent:${cat.parent_id}` : ''}
            </Text>
          ))}
        </View>
      )}

      <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>
        📋 Catégories Chargées ({categories.length}):
      </Text>

      {categories.map((category) => (
        <View key={category.id} style={{ 
          marginBottom: 8, 
          padding: 10, 
          backgroundColor: category.level === 0 ? '#e3f2fd' : '#f5f5f5',
          borderLeftWidth: 4,
          borderLeftColor: category.level === 0 ? '#2196f3' : '#757575'
        }}>
          <Text style={{ fontWeight: category.level === 0 ? 'bold' : 'normal' }}>
            {category.level === 0 ? '🏠 ' : '  └── '}
            {category.name} ({category.type})
            {category.parentId && ` - Sous-catégorie`}
          </Text>
          <Text style={{ fontSize: 12, color: '#666' }}>
            ID: {category.id} | Niveau: {category.level} | Ordre: {category.sortOrder}
          </Text>
        </View>
      ))}

      {categories.length === 0 && (
        <Text style={{ color: '#666', fontStyle: 'italic', textAlign: 'center', marginTop: 20 }}>
          Aucune catégorie trouvée.{"\n"}
          Cliquez sur "Initialiser les Catégories" pour créer les catégories complètes.
        </Text>
      )}
    </ScrollView>
  );
};

export default TestCategories;