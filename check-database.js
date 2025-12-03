// Script pour vérifier le contenu de la base de données
const sqlite3 = require('sqlite3').verbose();

// Ouvrir la base de données (chemin à ajuster selon ton installation)
const db = new sqlite3.Database('./mylife.db', sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error('❌ Erreur ouverture DB:', err.message);
    return;
  }
  console.log('✅ Base de données ouverte');
});

// Vérifier les comptes
db.all("SELECT COUNT(*) as count FROM accounts WHERE user_id = 'default-user'", [], (err, rows) => {
  if (err) {
    console.error('❌ Erreur comptes:', err.message);
    return;
  }
  console.log('👛 Comptes:', rows[0].count);
});

// Vérifier les transactions
db.all("SELECT COUNT(*) as count FROM transactions WHERE user_id = 'default-user'", [], (err, rows) => {
  if (err) {
    console.error('❌ Erreur transactions:', err.message);
    return;
  }
  console.log('💰 Transactions:', rows[0].count);
});

// Vérifier les catégories
db.all("SELECT COUNT(*) as count FROM categories WHERE user_id = 'default-user'", [], (err, rows) => {
  if (err) {
    console.error('❌ Erreur catégories:', err.message);
    return;
  }
  console.log('📁 Catégories:', rows[0].count);
});

// Vérifier les charges annuelles
db.all("SELECT COUNT(*) as count FROM annual_charges WHERE user_id = 'default-user'", [], (err, rows) => {
  if (err) {
    console.error('❌ Erreur charges:', err.message);
    return;
  }
  console.log('📋 Charges annuelles:', rows[0].count);
  
  // Fermer la DB après la dernière requête
  db.close((err) => {
    if (err) {
      console.error('❌ Erreur fermeture:', err.message);
    } else {
      console.log('✅ Base fermée');
    }
  });
});
