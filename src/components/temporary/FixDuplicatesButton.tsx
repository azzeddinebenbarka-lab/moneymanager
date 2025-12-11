// Composant temporaire pour nettoyer les doublons
// À ajouter temporairement dans TransactionsScreen.tsx

import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { getDatabase } from '../../services/database/sqlite';

async function fixDuplicateDebtPayments() {
  try {
    const db = await getDatabase();
    
    console.log('🔍 Recherche des paiements en double...\n');
    
    const transactions = await db.getAllAsync<any>(`
      SELECT id, description, amount, date, account_id, created_at
      FROM transactions 
      WHERE description LIKE '%Salon%' 
      AND description LIKE '%Paiement dette%'
      AND category = 'dette'
      ORDER BY created_at ASC
    `);

    console.log(`📋 ${transactions.length} transaction(s) "Salon" trouvée(s)\n`);

    if (transactions.length <= 1) {
      return { deleted: 0, refunded: 0, success: true };
    }

    const groups: { [key: string]: any[] } = {};
    transactions.forEach(tx => {
      if (!groups[tx.date]) groups[tx.date] = [];
      groups[tx.date].push(tx);
    });

    const duplicates = Object.entries(groups).filter(([_, txs]) => txs.length > 1);
    if (duplicates.length === 0) {
      return { deleted: 0, refunded: 0, success: true };
    }

    let totalDeleted = 0;
    let totalRefunded = 0;

    await db.execAsync('BEGIN TRANSACTION');

    try {
      for (const [date, txs] of duplicates) {
        const sorted = txs.sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        
        const toDelete = sorted.slice(1);

        for (const tx of toDelete) {
          await db.runAsync('DELETE FROM transactions WHERE id = ?', [tx.id]);
          const refundAmount = Math.abs(tx.amount);
          await db.runAsync(`UPDATE accounts SET balance = balance + ? WHERE id = ?`, 
            [refundAmount, tx.account_id]);
          
          totalDeleted++;
          totalRefunded += refundAmount;
        }
      }

      await db.execAsync('COMMIT');
      return { deleted: totalDeleted, refunded: totalRefunded, success: true };
    } catch (error) {
      await db.execAsync('ROLLBACK');
      throw error;
    }
  } catch (error) {
    return { deleted: 0, refunded: 0, success: false, error: String(error) };
  }
}

export const FixDuplicatesButton: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [loading, setLoading] = useState(false);

  const handleFix = async () => {
    Alert.alert(
      'Nettoyer les doublons',
      'Voulez-vous supprimer les transactions en double et rembourser les comptes ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Nettoyer',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              const result = await fixDuplicateDebtPayments();
              
              if (result.success) {
                Alert.alert(
                  '✅ Nettoyage terminé',
                  `${result.deleted} transaction(s) supprimée(s)\n${result.refunded.toFixed(2)} MAD remboursé(s)`,
                  [
                    { 
                      text: t.ok, 
                      onPress: () => {
                        if (onComplete) onComplete();
                      }
                    }
                  ]
                );
              } else {
                Alert.alert('❌ Erreur', result.error || 'Échec du nettoyage');
              }
            } catch (error) {
              Alert.alert('❌ Erreur', error instanceof Error ? error.message : 'Erreur inconnue');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  return (
    <TouchableOpacity
      style={styles.fixButton}
      onPress={handleFix}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color="#fff" size="small" />
      ) : (
        <Text style={styles.fixButtonText}>🧹 Nettoyer Doublons</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fixButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    margin: 12,
    alignItems: 'center',
  },
  fixButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
