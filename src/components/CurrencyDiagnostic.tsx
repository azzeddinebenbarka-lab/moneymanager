// src/components/CurrencyDiagnostic.tsx - NOUVEAU COMPOSANT
import React from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import { useCurrencyInitialization } from '../hooks/useCurrencyInitialization';
import { useMultiCurrency } from '../hooks/useMultiCurrency';

export const CurrencyDiagnostic: React.FC = () => {
  const { t } = useLanguage();
  const { 
    isInitializing, 
    needsMigration, 
    currentCurrency, 
    forceMADMigration,
    reinitialize 
  } = useCurrencyInitialization();
  
  const { currency: contextCurrency } = useCurrency();
  const { baseCurrency, isSyncedWithContext } = useMultiCurrency();

  const runDiagnostic = () => {
    Alert.alert(
      'Diagnostic Devises',
      `Contexte: ${contextCurrency.code}
MultiCurrency: ${baseCurrency}
Synchronisé: ${isSyncedWithContext ? 'OUI' : 'NON'}
Migration nécessaire: ${needsMigration ? 'OUI' : 'NON'}`,
      [{ text: t.ok }]
    );
  };

  const forceMAD = () => {
    Alert.alert(
      'Forcer MAD',
      'Êtes-vous sûr de vouloir forcer MAD comme devise principale pour toutes les données?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Forcer MAD', 
          style: 'destructive',
          onPress: forceMADMigration
        }
      ]
    );
  };

  if (isInitializing) {
    return (
      <View style={{ padding: 16, backgroundColor: '#FFF3CD', borderRadius: 8, margin: 16 }}>
        <Text style={{ color: '#856404', textAlign: 'center' }}>
          🔄 Initialisation du système de devises...
        </Text>
      </View>
    );
  }

  return (
    <View style={{ padding: 16, backgroundColor: '#f8f9fa', borderRadius: 8, margin: 16 }}>
      <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Diagnostic Devises</Text>
      
      <View style={{ marginBottom: 8 }}>
        <Text>Devise actuelle: {currentCurrency.code} ({currentCurrency.symbol})</Text>
        <Text>Synchronisé: {isSyncedWithContext ? '✅' : '❌'}</Text>
        <Text>Migration nécessaire: {needsMigration ? '⚠️ OUI' : '✅ NON'}</Text>
      </View>

      <View style={{ flexDirection: 'row', gap: 8 }}>
        <TouchableOpacity 
          style={{ 
            backgroundColor: '#007AFF', 
            padding: 8, 
            borderRadius: 4,
            flex: 1 
          }}
          onPress={runDiagnostic}
        >
          <Text style={{ color: 'white', textAlign: 'center', fontSize: 12 }}>Diagnostic</Text>
        </TouchableOpacity>
        
        {needsMigration && (
          <TouchableOpacity 
            style={{ 
              backgroundColor: '#DC3545', 
              padding: 8, 
              borderRadius: 4,
              flex: 1 
            }}
            onPress={forceMAD}
          >
            <Text style={{ color: 'white', textAlign: 'center', fontSize: 12 }}>Forcer MAD</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={{ 
            backgroundColor: '#28A745', 
            padding: 8, 
            borderRadius: 4,
            flex: 1 
          }}
          onPress={reinitialize}
        >
          <Text style={{ color: 'white', textAlign: 'center', fontSize: 12 }}>Réinitialiser</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};