// Script de nettoyage : Supprimer les transactions en double du 2 décembre

import { getDatabase } from '../src/services/database/database';

async function cleanDuplicateTransactions() {
  console.log('🧹 [CLEANUP] Suppression des doublons du 2 décembre...\n');

  const db = await getDatabase();

  try {
    // 1. Trouver tous les doublons (même description, même date, même montant, même parentId)
    const duplicates = await db.getAllAsync<any>(`
      SELECT 
        description,
        date,
        amount,
        parent_transaction_id,
        COUNT(*) as count,
        GROUP_CONCAT(id) as ids
      FROM transactions
      WHERE date = '2025-12-02'
      AND user_id = 'default-user'
      AND parent_transaction_id IS NOT NULL
      GROUP BY description, date, amount, parent_transaction_id
      HAVING count > 1
    `);

    console.log(`📊 Trouvé ${duplicates.length} groupes de doublons\n`);

    let totalDeleted = 0;

    for (const dup of duplicates) {
      const ids = dup.ids.split(',');
      console.log(`🔍 ${dup.description}: ${dup.count} occurrences`);
      console.log(`   IDs: ${ids.join(', ')}`);
      
      // Garder le premier, supprimer les autres
      const idsToDelete = ids.slice(1);
      
      for (const id of idsToDelete) {
        await db.runAsync('DELETE FROM transactions WHERE id = ?', [id]);
        console.log(`   ❌ Supprimé: ${id}`);
        totalDeleted++;
      }
      
      console.log(`   ✅ Gardé: ${ids[0]}\n`);
    }

    console.log(`\n✅ Nettoyage terminé: ${totalDeleted} transactions supprimées\n`);

    // 2. Vérifier le résultat
    const remaining = await db.getAllAsync<any>(`
      SELECT description, COUNT(*) as count
      FROM transactions
      WHERE date = '2025-12-02'
      AND user_id = 'default-user'
      GROUP BY description
      ORDER BY description
    `);

    console.log('📋 Transactions restantes pour le 2 décembre:');
    remaining.forEach((r) => {
      console.log(`   ${r.description}: ${r.count} occurrence(s)`);
    });

  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
  }
}

cleanDuplicateTransactions();
