// Script de diagnostic pour les dettes avec paiement automatique
import { getDatabase } from '../src/services/database/sqlite';

export async function checkDebtsAutoPay() {
  try {
    const db = await getDatabase();
    const today = new Date().toISOString().split('T')[0];
    
    console.log('='.repeat(60));
    console.log('🔍 DIAGNOSTIC DES DETTES AVEC PAIEMENT AUTOMATIQUE');
    console.log('='.repeat(60));
    console.log(`📅 Date actuelle: ${today}\n`);
    
    // 1. Toutes les dettes actives
    const allDebts = await db.getAllAsync<any>(`
      SELECT 
        id, name, current_amount, due_date, status, 
        auto_pay, payment_account_id, monthly_payment
      FROM debts 
      WHERE status = 'active'
      ORDER BY due_date ASC
    `);
    
    console.log(`📊 Total des dettes actives: ${allDebts.length}\n`);
    
    if (allDebts.length === 0) {
      console.log('ℹ️ Aucune dette active trouvée\n');
      return;
    }
    
    allDebts.forEach((debt, i) => {
      console.log(`${i + 1}. ${debt.name}`);
      console.log(`   💰 Montant restant: ${debt.current_amount} MAD`);
      console.log(`   📅 Date d'échéance: ${debt.due_date}`);
      console.log(`   💳 Mensualité: ${debt.monthly_payment || 'Non définie'} MAD`);
      console.log(`   🏦 Compte paiement: ${debt.payment_account_id || '❌ NON DÉFINI'}`);
      console.log(`   ⚡ Paiement auto: ${debt.auto_pay ? '✅ ACTIVÉ' : '❌ DÉSACTIVÉ'}`);
      
      // Analyser pourquoi elle n'est pas prélevée
      if (debt.due_date <= today) {
        if (!debt.auto_pay) {
          console.log(`   ⚠️ RAISON: Paiement automatique désactivé`);
        } else if (!debt.payment_account_id) {
          console.log(`   ⚠️ RAISON: Aucun compte de paiement défini`);
        } else if (!debt.monthly_payment || debt.monthly_payment <= 0) {
          console.log(`   ⚠️ RAISON: Mensualité non définie ou nulle`);
        } else {
          console.log(`   ✅ DEVRAIT être prélevée automatiquement !`);
        }
      } else {
        console.log(`   ℹ️ Date pas encore atteinte (échéance: ${debt.due_date})`);
      }
      console.log();
    });
    
    // 2. Dettes éligibles au prélèvement automatique
    console.log('-'.repeat(60));
    console.log('🎯 DETTES ÉLIGIBLES AU PRÉLÈVEMENT AUTOMATIQUE:\n');
    
    const eligibleDebts = await db.getAllAsync<any>(`
      SELECT 
        id, name, current_amount, due_date, monthly_payment,
        payment_account_id, auto_pay
      FROM debts 
      WHERE status = 'active'
        AND auto_pay = 1
        AND payment_account_id IS NOT NULL
        AND due_date <= ?
      ORDER BY due_date ASC
    `, [today]);
    
    if (eligibleDebts.length === 0) {
      console.log('❌ Aucune dette éligible trouvée\n');
      console.log('💡 Pour qu\'une dette soit prélevée automatiquement:');
      console.log('   1. Status = active');
      console.log('   2. auto_pay = 1');
      console.log('   3. payment_account_id défini');
      console.log('   4. due_date <= aujourd\'hui\n');
    } else {
      console.log(`✅ ${eligibleDebts.length} dette(s) éligible(s):\n`);
      eligibleDebts.forEach((debt, i) => {
        console.log(`${i + 1}. ${debt.name}`);
        console.log(`   💰 À payer: ${Math.min(debt.monthly_payment, debt.current_amount)} MAD`);
        console.log(`   📅 Échéance: ${debt.due_date}`);
        console.log(`   🏦 Compte: ${debt.payment_account_id}`);
        console.log();
      });
      
      // Vérifier les paiements déjà effectués ce mois
      console.log('-'.repeat(60));
      console.log('📝 VÉRIFICATION DES PAIEMENTS DU MOIS:\n');
      
      for (const debt of eligibleDebts) {
        const currentMonth = today.slice(0, 7);
        const payment = await db.getFirstAsync<any>(`
          SELECT id, payment_date, amount
          FROM debt_payments 
          WHERE debt_id = ? AND payment_month = ?
          ORDER BY payment_date DESC LIMIT 1
        `, [debt.id, currentMonth]);
        
        if (payment) {
          console.log(`${debt.name}: ✅ Déjà payée le ${payment.payment_date} (${payment.amount} MAD)`);
        } else {
          console.log(`${debt.name}: ❌ PAS ENCORE PAYÉE ce mois`);
        }
      }
    }
    
    console.log('\n' + '='.repeat(60));
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

// Pour exécuter:
// import { checkDebtsAutoPay } from './scripts/check-debts-autopay';
// await checkDebtsAutoPay();
