// Composant de nettoyage des doublons de transactions récurrentes
import { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLanguage } from '../../context/LanguageContext';
import { getDatabase } from '../../services/database/sqlite';

export const CleanDuplicatesButton = () => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);

  const cleanDuplicates = async () => {
    setIsLoading(true);
    try {
      const db = await getDatabase();

      // Trouver tous les doublons
      const duplicates = await db.getAllAsync<any>(`
        SELECT 
          description,
          date,
          amount,
          parent_transaction_id,
          COUNT(*) as count,
          GROUP_CONCAT(id) as ids
        FROM transactions
        WHERE date >= '2025-12-01'
        AND user_id = 'default-user'
        AND parent_transaction_id IS NOT NULL
        GROUP BY description, date, amount, parent_transaction_id
        HAVING count > 1
      `);

      console.log(`📊 [CLEANUP] Trouvé ${duplicates.length} groupes de doublons`);

      let totalDeleted = 0;

      for (const dup of duplicates) {
        const ids = dup.ids.split(',');
        console.log(`🔍 [CLEANUP] ${dup.description}: ${dup.count} occurrences`);
        
        // Garder le premier, supprimer les autres
        const idsToDelete = ids.slice(1);
        
        for (const id of idsToDelete) {
          await db.runAsync('DELETE FROM transactions WHERE id = ?', [id]);
          console.log(`   ❌ [CLEANUP] Supprimé: ${id}`);
          totalDeleted++;
        }
      }

      console.log(`✅ [CLEANUP] Terminé: ${totalDeleted} doublons supprimés`);

      Alert.alert(
        'Nettoyage terminé',
        `${totalDeleted} transaction(s) en double ont été supprimées.`,
        [
          {
            text: t.ok,
            onPress: () => {
              // Recharger l'app pour voir les changements
              Alert.alert(
                'Recharger ?',
                'Rechargez l\'application pour voir les changements.',
                [
                  { text: 'Plus tard', style: 'cancel' },
                  { 
                    text: 'Recharger', 
                    onPress: () => {
                      // Forcer un rechargement
                      if (typeof window !== 'undefined') {
                        (window as any).location?.reload?.();
                      }
                    }
                  }
                ]
              );
            }
          }
        ]
      );

    } catch (error) {
      console.error('❌ [CLEANUP] Erreur:', error);
      Alert.alert('Erreur', 'Impossible de nettoyer les doublons');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={cleanDuplicates}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? '⏳ Nettoyage...' : '🧹 Nettoyer les doublons'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  button: {
    backgroundColor: '#FF6B6B',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#CCC',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
