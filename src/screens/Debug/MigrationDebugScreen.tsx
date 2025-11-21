import React, { useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import migrateTransactionCategories from '../../services/transactionCategoryMigration';

export default function MigrationDebugScreen() {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const runDry = async () => {
    setRunning(true);
    setError(null);
    setResult(null);
    try {
      const res = await migrateTransactionCategories('default-user', { dryRun: true });
      setResult(res);
    } catch (err: any) {
      setError(err?.message || String(err));
    } finally {
      setRunning(false);
    }
  };

  const apply = async () => {
    setRunning(true);
    setError(null);
    try {
      const res = await migrateTransactionCategories('default-user', { dryRun: false });
      setResult(res);
    } catch (err: any) {
      setError(err?.message || String(err));
    } finally {
      setRunning(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Migration: Normaliser les catégories de transactions</Text>
      <Text style={styles.info}>Cette page est destinée uniquement au développement. Elle prévisualise et applique une migration qui remplace les valeurs legacy de `transaction.category` par les IDs de catégories canoniques si une correspondance est trouvée.</Text>

      <View style={styles.buttons}>
        <Button title={running ? 'Traitement...' : 'Exécuter dry-run (prévisualisation)'} onPress={runDry} disabled={running} />
      </View>

      <View style={styles.buttons}>
        <Button title={running ? 'Traitement...' : 'Appliquer la migration'} onPress={apply} color="#D9534F" disabled={running} />
      </View>

      {error && (
        <Text style={styles.error}>Erreur: {error}</Text>
      )}

      {result && (
        <View style={styles.result}>
          <Text style={styles.resultTitle}>Résultat</Text>
          <Text>Updates prévues: {result.updated}</Text>
          <Text>Valeurs non appariées: {result.unmatched?.length || 0}</Text>

          <Text style={styles.sectionTitle}>Aperçu des modifications</Text>
          {result.updatesPreview && result.updatesPreview.length === 0 && (
            <Text>Aucune modification nécessaire.</Text>
          )}
          {result.updatesPreview && result.updatesPreview.length > 0 && (
            result.updatesPreview.map((u: any, idx: number) => (
              <View key={idx} style={styles.updateRow}>
                <Text style={styles.updateFrom}>{u.from}</Text>
                <Text style={styles.updateArrow}>→</Text>
                <Text style={styles.updateTo}>{u.to}</Text>
              </View>
            ))
          )}

          {result.unmatched && result.unmatched.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Valeurs non appariées</Text>
              {result.unmatched.map((v: any, i: number) => (
                <Text key={i} style={styles.unmatchedItem}>{v}</Text>
              ))}
            </>
          )}

        </View>
      )}

      <View style={{ height: 80 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  info: {
    marginBottom: 12,
    color: '#333'
  },
  buttons: {
    marginVertical: 8,
  },
  result: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#F8FAFF',
    borderRadius: 8,
  },
  resultTitle: {
    fontWeight: '700',
    marginBottom: 8,
  },
  sectionTitle: {
    marginTop: 12,
    fontWeight: '700',
  },
  updateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  updateFrom: { color: '#333', width: '40%' },
  updateArrow: { color: '#666', width: '10%', textAlign: 'center' },
  updateTo: { color: '#0B6EF6', width: '40%' },
  unmatchedItem: { color: '#8B0000', marginTop: 4 },
  error: { color: '#8B0000', marginTop: 12 }
});
