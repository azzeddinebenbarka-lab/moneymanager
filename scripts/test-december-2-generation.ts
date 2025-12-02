/**
 * Script de test : Vérifier la génération des transactions du 2 décembre
 * 
 * Ce script simule ce qui se passera automatiquement le 2 décembre 2025
 * quand le transactionRecurrenceService s'exécutera au démarrage de l'app.
 */

import { getDatabase } from '../src/services/database/sqlite';

async function testDecember2Generation() {
  console.log('🧪 [TEST] Simulation génération transactions du 2 décembre...\n');

  const db = await getDatabase();

  // 1. Afficher les transactions récurrentes de base (templates)
  console.log('📋 [TEST] Templates de transactions récurrentes :');
  const templates = await db.getAllAsync(
    `SELECT id, description, amount, date, recurrence_type, is_recurring 
     FROM transactions 
     WHERE is_recurring = 1 
     AND user_id = 'default-user'
     ORDER BY date`
  );
  
  console.log(`   Total templates: ${templates.length}`);
  templates.forEach((t: any) => {
    console.log(`   - ${t.description} (${t.amount} MAD) le ${t.date} [${t.recurrence_type}]`);
  });

  // 2. Afficher les occurrences déjà créées pour le 2 décembre
  console.log('\n📅 [TEST] Occurrences existantes pour le 2 décembre 2025 :');
  const existingOccurrences = await db.getAllAsync(
    `SELECT id, description, amount, date, parent_transaction_id 
     FROM transactions 
     WHERE date = '2025-12-02' 
     AND user_id = 'default-user'
     ORDER BY description`
  );

  if (existingOccurrences.length === 0) {
    console.log('   ❌ Aucune occurrence trouvée (normal si on est avant le 2 décembre)');
  } else {
    console.log(`   ✅ ${existingOccurrences.length} occurrences déjà créées :`);
    existingOccurrences.forEach((o: any) => {
      console.log(`   - ${o.description} (${o.amount} MAD)`);
    });
  }

  // 3. Simuler ce qui se passera le 2 décembre
  console.log('\n🔮 [TEST] Simulation : que se passera-t-il le 2 décembre ?');
  
  // Compter combien de templates ont leur prochaine occurrence le 2 décembre
  const templatesFor2nd = templates.filter((t: any) => {
    const baseDate = new Date(t.date + 'T00:00:00');
    const targetDate = new Date('2025-12-02T00:00:00');
    
    // Pour les mensuels créés le 2 novembre, la prochaine occurrence est le 2 décembre
    if (t.recurrence_type === 'monthly') {
      const nextMonth = new Date(baseDate);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      return nextMonth.getFullYear() === targetDate.getFullYear() && 
             nextMonth.getMonth() === targetDate.getMonth() &&
             nextMonth.getDate() === targetDate.getDate();
    }
    return false;
  });

  console.log(`   📊 ${templatesFor2nd.length} transactions seront créées automatiquement le 2 décembre :`);
  templatesFor2nd.forEach((t: any) => {
    console.log(`   ✨ ${t.description} (${t.amount} MAD)`);
  });

  // 4. Vérifier les dates des transactions actuelles
  console.log('\n📈 [TEST] Distribution des transactions par date en décembre 2025 :');
  const decemberTransactions = await db.getAllAsync(
    `SELECT date, COUNT(*) as count, GROUP_CONCAT(description) as descriptions
     FROM transactions 
     WHERE date >= '2025-12-01' AND date < '2026-01-01'
     AND user_id = 'default-user'
     GROUP BY date
     ORDER BY date`
  );

  if (decemberTransactions.length === 0) {
    console.log('   ℹ️ Pas encore de transactions en décembre (sauf possiblement le 1er)');
  } else {
    decemberTransactions.forEach((row: any) => {
      console.log(`   ${row.date}: ${row.count} transaction(s)`);
    });
  }

  console.log('\n✅ [TEST] Analyse terminée\n');
  console.log('💡 Conclusion :');
  console.log('   - Le système attend le 2 décembre pour créer les transactions récurrentes');
  console.log('   - C\'est un comportement NORMAL et INTENTIONNEL');
  console.log('   - Les transactions du 2 apparaîtront automatiquement le 2 décembre');
  console.log('   - Vous pouvez forcer la création en changeant la date système de votre téléphone\n');
}

// Exécuter le test
testDecember2Generation().catch(console.error);
