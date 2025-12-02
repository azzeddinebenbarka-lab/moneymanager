// Script pour supprimer les paiements de dettes en double
// Exécuter avec: node scripts/fix-duplicate-debt-payments.js

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Chemin vers la base de données (ajustez si nécessaire)
const dbPath = path.join(__dirname, '..', 'assets', 'database.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erreur connexion DB:', err);
    return;
  }
  console.log('✅ Connecté à la base de données\n');
});

console.log('🔍 Recherche des paiements en double pour "Salon"...\n');

// 1. Trouver toutes les transactions de paiement de dette "Salon"
db.all(`
  SELECT id, description, amount, date, account_id, created_at
  FROM transactions 
  WHERE description LIKE '%Salon%' 
  AND description LIKE '%Paiement dette%'
  AND category = 'dette'
  ORDER BY created_at DESC
`, (err, transactions) => {
  if (err) {
    console.error('❌ Erreur requête:', err);
    db.close();
    return;
  }

  console.log(`📋 ${transactions.length} transaction(s) de paiement "Salon" trouvée(s):\n`);
  
  transactions.forEach((tx, i) => {
    const createdDate = new Date(tx.created_at);
    console.log(`${i + 1}. ID: ${tx.id}`);
    console.log(`   Montant: ${tx.amount} MAD`);
    console.log(`   Date: ${tx.date}`);
    console.log(`   Créé: ${createdDate.toISOString()}`);
    console.log(`   Compte: ${tx.account_id}\n`);
  });

  if (transactions.length <= 1) {
    console.log('✅ Aucun doublon trouvé');
    db.close();
    return;
  }

  // Grouper par date pour identifier les doublons
  const groups = {};
  transactions.forEach(tx => {
    const key = tx.date;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(tx);
  });

  const duplicates = Object.entries(groups).filter(([date, txs]) => txs.length > 1);

  if (duplicates.length === 0) {
    console.log('✅ Aucun doublon trouvé');
    db.close();
    return;
  }

  console.log(`⚠️ ${duplicates.length} groupe(s) de doublons trouvé(s):\n`);

  let totalToDelete = 0;
  const transactionsToDelete = [];

  duplicates.forEach(([date, txs]) => {
    console.log(`📅 Date ${date}: ${txs.length} transactions`);
    
    // Garder la plus ancienne (première créée), supprimer les autres
    const sorted = txs.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    const toKeep = sorted[0];
    const toDelete = sorted.slice(1);
    
    console.log(`   ✅ À garder: ${toKeep.id} (créé: ${toKeep.created_at})`);
    toDelete.forEach(tx => {
      console.log(`   ❌ À supprimer: ${tx.id} (créé: ${tx.created_at})`);
      transactionsToDelete.push(tx);
      totalToDelete++;
    });
    console.log();
  });

  if (totalToDelete === 0) {
    console.log('✅ Aucune transaction à supprimer');
    db.close();
    return;
  }

  console.log(`\n🗑️ ${totalToDelete} transaction(s) en double à supprimer\n`);

  // Suppression automatique des doublons
  db.serialize(() => {
    db.run('BEGIN TRANSACTION', (err) => {
      if (err) {
        console.error('❌ Erreur BEGIN:', err);
        db.close();
        return;
      }

      let deleted = 0;
      let totalRefund = 0;
      const accountsToRefund = {};

      transactionsToDelete.forEach((tx) => {
        db.run('DELETE FROM transactions WHERE id = ?', [tx.id], (err) => {
          if (err) {
            console.error(`❌ Erreur suppression ${tx.id}:`, err);
            db.run('ROLLBACK');
            db.close();
            return;
          }
          
          deleted++;
          const refundAmount = Math.abs(tx.amount);
          totalRefund += refundAmount;
          
          // Accumuler les remboursements par compte
          if (!accountsToRefund[tx.account_id]) {
            accountsToRefund[tx.account_id] = 0;
          }
          accountsToRefund[tx.account_id] += refundAmount;
          
          console.log(`✅ Supprimé: ${tx.id} (${tx.amount} MAD du ${tx.date})`);
          
          // Quand toutes les suppressions sont terminées
          if (deleted === transactionsToDelete.length) {
            // Rembourser les comptes
            const accountIds = Object.keys(accountsToRefund);
            let refunded = 0;
            
            accountIds.forEach(accountId => {
              const refundAmount = accountsToRefund[accountId];
              
              db.run(`
                UPDATE accounts 
                SET balance = balance + ? 
                WHERE id = ?
              `, [refundAmount, accountId], (err) => {
                if (err) {
                  console.error(`❌ Erreur remboursement compte ${accountId}:`, err);
                  db.run('ROLLBACK');
                  db.close();
                  return;
                }
                
                refunded++;
                console.log(`💰 Compte ${accountId} remboursé: +${refundAmount.toFixed(2)} MAD`);
                
                if (refunded === accountIds.length) {
                  db.run('COMMIT', (err) => {
                    if (err) {
                      console.error('❌ Erreur COMMIT:', err);
                      db.run('ROLLBACK');
                    } else {
                      console.log(`\n✅ Nettoyage terminé avec succès:`);
                      console.log(`   - ${deleted} transaction(s) supprimée(s)`);
                      console.log(`   - ${totalRefund.toFixed(2)} MAD remboursé(s)`);
                    }
                    db.close();
                  });
                }
              });
            });
          }
        });
      });
    });
  });
});
