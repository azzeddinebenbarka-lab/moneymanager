// Script de diagnostic pour la dette Salon
const SQLite = require('expo-sqlite');

async function checkSalonDebt() {
  try {
    const db = await SQLite.openDatabaseAsync('mylife.db');
    
    console.log('='.repeat(60));
    console.log('🔍 DIAGNOSTIC DETTE SALON');
    console.log('='.repeat(60));
    
    // Récupérer la dette Salon
    const salon = await db.getFirstAsync(`
      SELECT * FROM debts WHERE name LIKE '%Salon%' ORDER BY created_at DESC LIMIT 1
    `);
    
    if (!salon) {
      console.log('❌ Aucune dette "Salon" trouvée\n');
      return;
    }
    
    console.log('\n📋 INFORMATIONS DE LA DETTE:');
    console.log('─'.repeat(60));
    console.log('Nom:', salon.name);
    console.log('ID:', salon.id);
    console.log('Montant actuel:', salon.current_amount, 'MAD');
    console.log('Mensualité:', salon.monthly_payment, 'MAD');
    console.log('\n📅 DATES:');
    console.log('Créée le:', salon.created_at);
    console.log('Date début:', salon.start_date);
    console.log('Date échéance:', salon.due_date);
    console.log('Mois échéance:', salon.due_month);
    console.log('\n⚙️ CONFIGURATION AUTO-PAY:');
    console.log('Paiement auto:', salon.auto_pay ? '✅ ACTIVÉ' : '❌ DÉSACTIVÉ');
    console.log('Compte paiement:', salon.payment_account_id || '❌ NON DÉFINI');
    console.log('Jour du mois:', salon.payment_day);
    console.log('Démarrer mois prochain:', salon.start_payment_next_month ? '✅ OUI' : '❌ NON');
    console.log('Status:', salon.status);
    
    // Vérifier les conditions d'éligibilité
    console.log('\n🎯 ÉLIGIBILITÉ AU PRÉLÈVEMENT:');
    console.log('─'.repeat(60));
    
    const today = new Date().toISOString().split('T')[0];
    const currentMonth = today.slice(0, 7);
    const createdMonth = salon.created_at.slice(0, 7);
    const dueMonth = salon.due_month || salon.due_date.slice(0, 7);
    const dueDate = new Date(salon.due_date);
    const now = new Date();
    
    console.log('Date actuelle:', today);
    console.log('Mois actuel:', currentMonth);
    console.log('Mois de création:', createdMonth);
    console.log('Mois d\'échéance:', dueMonth);
    
    console.log('\n✅ VÉRIFICATIONS:');
    console.log('1. Status != paid:', salon.status !== 'paid' ? '✅ OUI' : '❌ NON');
    console.log('2. auto_pay = 1:', salon.auto_pay === 1 ? '✅ OUI' : '❌ NON');
    console.log('3. payment_account_id défini:', salon.payment_account_id ? '✅ OUI' : '❌ NON');
    console.log('4. current_amount > 0:', salon.current_amount > 0 ? '✅ OUI' : '❌ NON');
    
    if (salon.start_payment_next_month) {
      console.log('\n🔍 LOGIQUE "MOIS PROCHAIN":');
      console.log('   Mois de création:', createdMonth);
      console.log('   Mois actuel:', currentMonth);
      console.log('   Créée ce mois?:', createdMonth === currentMonth ? '❌ OUI → SKIP' : '✅ NON → OK');
      
      if (createdMonth !== currentMonth) {
        console.log('   Date échéance:', salon.due_date);
        console.log('   Date échue?:', dueDate <= now ? '✅ OUI → OK' : '❌ NON → SKIP');
      }
    } else {
      console.log('\n🔍 LOGIQUE "DÈS QUE POSSIBLE":');
      console.log('   Mois échéance:', dueMonth);
      console.log('   Mois actuel:', currentMonth);
      console.log('   Mois correspond?:', dueMonth === currentMonth ? '✅ OUI' : '❌ NON');
      console.log('   Date échue?:', dueDate <= now ? '✅ OUI' : '❌ NON');
    }
    
    // Vérifier les paiements déjà effectués
    const payments = await db.getAllAsync(`
      SELECT * FROM debt_payments 
      WHERE debt_id = ? 
      ORDER BY payment_date DESC
    `, [salon.id]);
    
    console.log('\n💳 HISTORIQUE DES PAIEMENTS:');
    console.log('─'.repeat(60));
    console.log('Nombre de paiements:', payments.length);
    
    if (payments.length > 0) {
      console.log('\nDerniers paiements:');
      payments.slice(0, 3).forEach((p, i) => {
        console.log(`  ${i + 1}. ${p.payment_date} - ${p.amount} MAD (mois: ${p.payment_month})`);
      });
      
      const lastPaymentMonth = payments[0].payment_month || payments[0].payment_date.slice(0, 7);
      console.log('\n   Déjà payé ce mois?:', lastPaymentMonth === currentMonth ? '❌ OUI → SKIP' : '✅ NON → OK');
    } else {
      console.log('Aucun paiement effectué ✅');
    }
    
    // CONCLUSION
    console.log('\n' + '='.repeat(60));
    console.log('🎯 CONCLUSION:');
    console.log('='.repeat(60));
    
    const eligible = 
      salon.status !== 'paid' &&
      salon.auto_pay === 1 &&
      salon.payment_account_id &&
      salon.current_amount > 0;
    
    if (!eligible) {
      console.log('❌ Dette NON ÉLIGIBLE - Conditions de base non remplies');
    } else {
      if (salon.start_payment_next_month) {
        if (createdMonth === currentMonth) {
          console.log('❌ Dette ÉLIGIBLE mais IGNORÉE car créée ce mois (start_payment_next_month=true)');
        } else if (dueDate > now) {
          console.log('❌ Dette ÉLIGIBLE mais IGNORÉE car date d\'échéance pas encore atteinte');
        } else {
          console.log('✅ Dette DEVRAIT ÊTRE PRÉLEVÉE !');
        }
      } else {
        const canPayThisMonth = (dueMonth === currentMonth);
        const isPastDue = (dueDate <= now);
        
        if (canPayThisMonth || isPastDue) {
          console.log('✅ Dette DEVRAIT ÊTRE PRÉLEVÉE !');
        } else {
          console.log('❌ Dette ÉLIGIBLE mais pas encore dans son mois d\'échéance');
        }
      }
    }
    
    console.log('='.repeat(60) + '\n');
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

// Exécuter
checkSalonDebt().catch(console.error);
