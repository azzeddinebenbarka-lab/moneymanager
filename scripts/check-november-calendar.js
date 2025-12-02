/**
 * Script de vérification : Transactions de novembre dans le calendrier
 * 
 * Vérifie si les transactions récurrentes créées en novembre apparaissent
 * correctement dans le calendrier.
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🔍 Vérification des transactions de NOVEMBRE 2025 dans le calendrier\n');

try {
  // Chemin vers la base de données SQLite (dans l'émulateur/appareil)
  // Note: Ce script nécessite adb et l'app en cours d'exécution
  
  console.log('📱 Tentative de récupération des données depuis l\'appareil...\n');
  
  // Commande pour extraire les transactions de novembre depuis la DB SQLite
  const query = `
    SELECT 
      date,
      description,
      amount,
      type,
      is_recurring,
      parent_transaction_id,
      recurrence_type
    FROM transactions 
    WHERE date >= '2025-11-01' AND date < '2025-12-01'
    AND user_id = 'default-user'
    ORDER BY date, description;
  `;
  
  console.log('📊 Requête SQL :');
  console.log(query);
  console.log('\n⚠️ Pour exécuter cette requête :');
  console.log('1. Ouvrir l\'app sur votre téléphone/émulateur');
  console.log('2. Aller dans les paramètres > Développeur > Afficher la base de données');
  console.log('3. Ou utiliser adb + sqlite3 pour inspecter la DB\n');
  
  console.log('📋 Ce que nous cherchons :');
  console.log('- Transactions récurrentes créées en novembre (is_recurring = 1)');
  console.log('- Occurrences créées automatiquement (parent_transaction_id != null)');
  console.log('- Distribution par date dans novembre\n');
  
  console.log('💡 Questions à vérifier :');
  console.log('1. Combien de transactions template récurrentes avez-vous créées en novembre ?');
  console.log('2. Quelles sont leurs dates de base (le jour du mois) ?');
  console.log('3. Est-ce que ces dates correspondent à ce que vous voyez dans le calendrier ?\n');
  
  console.log('🔧 Pour déboguer davantage :');
  console.log('- Ouvrez le calendrier sur novembre 2025');
  console.log('- Notez quelles dates ont des transactions');
  console.log('- Comparez avec les dates de vos templates récurrentes');
  console.log('- Si une date manque, vérifiez si le template existe et si son occurrence a été créée\n');

} catch (error) {
  console.error('❌ Erreur :', error.message);
}

console.log('✅ Vérification terminée\n');
console.log('📝 Prochaine étape : Partagez ce que vous voyez dans le calendrier de novembre');
console.log('   et je pourrai comparer avec ce qui devrait être affiché.\n');
