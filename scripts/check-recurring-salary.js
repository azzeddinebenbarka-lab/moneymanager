// Script pour vérifier les transactions récurrentes du salaire
// Exécuter avec: node scripts/check-recurring-salary.js

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

console.log('🔍 Vérification des transactions "Weshore" (salaire)...\n');

// 1. Trouver la transaction récurrente parent
db.all(`
  SELECT * FROM transactions 
  WHERE description LIKE '%Weshore%' 
  AND is_recurring = 1
  ORDER BY date DESC
`, (err, rows) => {
  if (err) {
    console.error('❌ Erreur requête:', err);
    return;
  }

  console.log(`📋 Transaction(s) récurrente(s) "Weshore" trouvée(s): ${rows.length}\n`);
  
  if (rows.length === 0) {
    console.log('⚠️ Aucune transaction récurrente "Weshore" trouvée!');
    console.log('💡 Vous devez créer une transaction avec:');
    console.log('   - description: "Weshore" ou "Salaire"');
    console.log('   - amount: 8000');
    console.log('   - type: "income"');
    console.log('   - is_recurring: 1');
    console.log('   - recurrence_type: "monthly"');
    db.close();
    return;
  }

  rows.forEach((row, i) => {
    console.log(`Transaction Parent #${i + 1}:`);
    console.log(`  ID: ${row.id}`);
    console.log(`  Description: ${row.description}`);
    console.log(`  Montant: ${row.amount} MAD`);
    console.log(`  Type: ${row.type}`);
    console.log(`  Date: ${row.date}`);
    console.log(`  Récurrence: ${row.recurrence_type}`);
    console.log(`  Fin récurrence: ${row.recurrence_end_date || 'Aucune'}\n`);

    // 2. Trouver toutes les occurrences de cette transaction
    db.all(`
      SELECT date, amount, id, account_id 
      FROM transactions 
      WHERE parent_transaction_id = ? 
      OR (description LIKE '%Weshore%' AND date >= '2025-11-01')
      ORDER BY date DESC
      LIMIT 5
    `, [row.id], (err, occurrences) => {
      if (err) {
        console.error('❌ Erreur occurrences:', err);
        return;
      }

      console.log(`  📅 Occurrences récentes (${occurrences.length}):`);
      if (occurrences.length === 0) {
        console.log('    ℹ️ Aucune occurrence trouvée');
      } else {
        occurrences.forEach(occ => {
          const isDecember = occ.date.startsWith('2025-12');
          console.log(`    ${isDecember ? '🎯' : '📄'} ${occ.date}: ${occ.amount} MAD (${occ.id})`);
        });
      }
      console.log('\n');

      if (i === rows.length - 1) {
        db.close();
        console.log('\n✅ Vérification terminée');
      }
    });
  });
});
