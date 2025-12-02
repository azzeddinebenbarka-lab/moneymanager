/**
 * Service de nettoyage des doublons de transactions récurrentes
 */

import { getDatabase } from './database/sqlite';

export const cleanupService = {
  /**
   * Supprimer les doublons de transactions récurrentes
   * Garde la première occurrence de chaque groupe de doublons
   */
  async cleanDuplicateRecurringTransactions(): Promise<{ deleted: number; errors: string[] }> {
    const db = await getDatabase();
    const errors: string[] = [];
    let deleted = 0;

    try {
      console.log('🧹 [cleanupService] Recherche de doublons...');

      // Trouver tous les doublons (même description, date, montant, parentId)
      const duplicates = await db.getAllAsync<{
        description: string;
        date: string;
        amount: number;
        parent_transaction_id: string;
        count: number;
        ids: string;
      }>(`
        SELECT 
          description,
          date,
          amount,
          parent_transaction_id,
          COUNT(*) as count,
          GROUP_CONCAT(id) as ids
        FROM transactions
        WHERE user_id = 'default-user'
        AND parent_transaction_id IS NOT NULL
        AND is_recurring = 0
        GROUP BY description, date, amount, parent_transaction_id
        HAVING count > 1
        ORDER BY date, description
      `);

      console.log(`📊 [cleanupService] Trouvé ${duplicates.length} groupes de doublons`);

      for (const dup of duplicates) {
        try {
          const ids = dup.ids.split(',');
          console.log(`🔍 [cleanupService] ${dup.description} (${dup.date}): ${dup.count} occurrences`);
          
          // Garder le premier ID, supprimer les autres
          const idsToDelete = ids.slice(1);
          
          for (const id of idsToDelete) {
            // Récupérer le montant et l'account_id avant de supprimer
            const tx = await db.getFirstAsync<{ amount: number; account_id: string }>(
              'SELECT amount, account_id FROM transactions WHERE id = ?',
              [id]
            );

            if (tx) {
              // Supprimer la transaction
              await db.runAsync('DELETE FROM transactions WHERE id = ?', [id]);
              
              // Corriger le solde du compte (soustraire le montant dupliqué)
              await db.runAsync(
                'UPDATE accounts SET balance = balance - ? WHERE id = ?',
                [tx.amount, tx.account_id]
              );

              console.log(`   ❌ [cleanupService] Supprimé: ${id}`);
              deleted++;
            }
          }
          
          console.log(`   ✅ [cleanupService] Gardé: ${ids[0]}`);
        } catch (error) {
          const errorMsg = `Erreur sur ${dup.description}: ${error}`;
          console.error(`❌ [cleanupService] ${errorMsg}`);
          errors.push(errorMsg);
        }
      }

      console.log(`✅ [cleanupService] Terminé: ${deleted} doublons supprimés`);
      return { deleted, errors };

    } catch (error) {
      console.error('❌ [cleanupService] Erreur globale:', error);
      errors.push(`Erreur globale: ${error}`);
      return { deleted, errors };
    }
  }
};
