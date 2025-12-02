// Script TypeScript pour supprimer les paiements en double
// À exécuter depuis l'app React Native

import { getDatabase } from '../src/services/database/sqlite';

export async function fixDuplicateDebtPayments() {
  try {
    const db = await getDatabase();
    
    console.log('🔍 Recherche des paiements en double...\n');
    
    // Trouver toutes les transactions de paiement de dette "Salon"
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
      console.log('✅ Aucun doublon détecté');
      return { deleted: 0, refunded: 0 };
    }

    // Grouper par date
    const groups: { [key: string]: any[] } = {};
    transactions.forEach(tx => {
      if (!groups[tx.date]) {
        groups[tx.date] = [];
      }
      groups[tx.date].push(tx);
    });

    const duplicates = Object.entries(groups).filter(([_, txs]) => txs.length > 1);

    if (duplicates.length === 0) {
      console.log('✅ Aucun doublon par date détecté');
      return { deleted: 0, refunded: 0 };
    }

    console.log(`⚠️ ${duplicates.length} groupe(s) de doublons trouvé(s)\n`);

    let totalDeleted = 0;
    let totalRefunded = 0;

    await db.execAsync('BEGIN TRANSACTION');

    try {
      for (const [date, txs] of duplicates) {
        // Garder la première (plus ancienne), supprimer les autres
        const sorted = txs.sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        
        const toKeep = sorted[0];
        const toDelete = sorted.slice(1);

        console.log(`📅 Date ${date}:`);
        console.log(`   ✅ Conservé: ${toKeep.id}`);

        for (const tx of toDelete) {
          console.log(`   ❌ Suppression: ${tx.id} (${tx.amount} MAD)`);
          
          // Supprimer la transaction
          await db.runAsync('DELETE FROM transactions WHERE id = ?', [tx.id]);
          
          // Rembourser le compte
          const refundAmount = Math.abs(tx.amount);
          await db.runAsync(`
            UPDATE accounts 
            SET balance = balance + ? 
            WHERE id = ?
          `, [refundAmount, tx.account_id]);
          
          totalDeleted++;
          totalRefunded += refundAmount;
          
          console.log(`   💰 Remboursé: +${refundAmount} MAD au compte ${tx.account_id}`);
        }
        console.log();
      }

      await db.execAsync('COMMIT');
      
      console.log(`\n✅ Nettoyage terminé:`);
      console.log(`   - ${totalDeleted} transaction(s) supprimée(s)`);
      console.log(`   - ${totalRefunded.toFixed(2)} MAD remboursé(s)\n`);

      return { 
        deleted: totalDeleted, 
        refunded: totalRefunded,
        success: true 
      };

    } catch (error) {
      await db.execAsync('ROLLBACK');
      console.error('❌ Erreur lors du nettoyage:', error);
      throw error;
    }

  } catch (error) {
    console.error('❌ Erreur:', error);
    return { 
      deleted: 0, 
      refunded: 0, 
      success: false, 
      error: error instanceof Error ? error.message : 'Erreur inconnue' 
    };
  }
}

// Pour l'exécuter, importez cette fonction et appelez-la :
// import { fixDuplicateDebtPayments } from './scripts/fix-duplicate-payments';
// await fixDuplicateDebtPayments();
