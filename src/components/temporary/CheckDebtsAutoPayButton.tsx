import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getDatabase } from '../../services/database/sqlite';

export const CheckDebtsAutoPayButton: React.FC = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [results, setResults] = useState<string>('');

  const checkDebtsAutoPay = async () => {
    setIsChecking(true);
    setResults('');
    
    try {
      const db = await getDatabase();
      const today = new Date().toISOString().split('T')[0];
      const currentMonth = today.slice(0, 7);
      
      let output = '🔍 DIAGNOSTIC DES DETTES AVEC PAIEMENT AUTOMATIQUE\n\n';
      output += `📅 Date actuelle: ${today}\n`;
      output += `📅 Mois actuel: ${currentMonth}\n\n`;
      
      // 1. Toutes les dettes actives
      const allDebts = await db.getAllAsync<any>(`
        SELECT 
          id, name, current_amount, due_date, due_month, status, 
          auto_pay, payment_account_id, monthly_payment, payment_day,
          start_payment_next_month, created_at
        FROM debts 
        WHERE status != 'paid'
        ORDER BY due_date ASC
      `);
      
      output += `📊 Total des dettes actives: ${allDebts.length}\n\n`;
      
      if (allDebts.length === 0) {
        output += 'ℹ️ Aucune dette active trouvée\n';
        setResults(output);
        setIsChecking(false);
        return;
      }
      
      allDebts.forEach((debt, i) => {
        const createdMonth = debt.created_at.slice(0, 7);
        const dueMonth = debt.due_month || debt.due_date.slice(0, 7);
        const dueDate = new Date(debt.due_date);
        const now = new Date();
        
        output += `${i + 1}. ${debt.name}\n`;
        output += `   💰 Montant: ${debt.current_amount} MAD\n`;
        output += `   📅 Créée: ${debt.created_at.split('T')[0]} (${createdMonth})\n`;
        output += `   📅 Échéance: ${debt.due_date} (${dueMonth})\n`;
        output += `   💳 Mensualité: ${debt.monthly_payment || 'Non définie'} MAD\n`;
        output += `   📆 Jour paiement: ${debt.payment_day || 'Non défini'}\n`;
        output += `   🏦 Compte: ${debt.payment_account_id || '❌ NON DÉFINI'}\n`;
        output += `   ⚡ Auto: ${debt.auto_pay ? '✅ OUI' : '❌ NON'}\n`;
        output += `   🔄 Mois prochain: ${debt.start_payment_next_month ? '✅ OUI' : '❌ NON'}\n`;
        output += `   📊 Status: ${debt.status}\n`;
        
        // Analyser pourquoi elle n'est pas prélevée
        output += '\n   🔍 ANALYSE:\n';
        
        if (!debt.auto_pay) {
          output += `   ❌ Auto-pay désactivé\n`;
        } else if (!debt.payment_account_id) {
          output += `   ❌ Pas de compte de paiement\n`;
        } else if (!debt.monthly_payment || debt.monthly_payment <= 0) {
          output += `   ❌ Mensualité invalide\n`;
        } else {
          // Vérifier la logique selon start_payment_next_month
          if (debt.start_payment_next_month) {
            output += `   📋 Logique "Mois prochain":\n`;
            if (createdMonth === currentMonth) {
              output += `   ❌ Créée ce mois → SKIP jusqu'au mois prochain\n`;
            } else if (dueDate > now) {
              output += `   ❌ Date d'échéance pas atteinte (${debt.due_date})\n`;
            } else {
              output += `   ✅ DEVRAIT être prélevée !\n`;
            }
          } else {
            output += `   📋 Logique "Dès que possible":\n`;
            const canPayThisMonth = (dueMonth === currentMonth);
            const isPastDue = (dueDate <= now);
            
            if (canPayThisMonth) {
              output += `   ✅ Mois correspond (${dueMonth} = ${currentMonth})\n`;
            } else if (isPastDue) {
              output += `   ✅ Date échue (${debt.due_date})\n`;
            } else {
              output += `   ❌ Mois pas encore atteint (${dueMonth} > ${currentMonth})\n`;
            }
            
            if (canPayThisMonth || isPastDue) {
              output += `   ✅ DEVRAIT être prélevée !\n`;
            }
          }
        }
        output += '\n';
      });
      
      // 2. Dettes éligibles
      output += '━━━━━━━━━━━━━━━━━━━━━━\n';
      output += '🎯 ÉLIGIBLES AU PRÉLÈVEMENT:\n\n';
      
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
        output += '❌ Aucune dette éligible\n\n';
        output += '💡 Conditions requises:\n';
        output += '   1. Status = active\n';
        output += '   2. auto_pay = 1\n';
        output += '   3. payment_account_id défini\n';
        output += '   4. due_date <= aujourd\'hui\n\n';
      } else {
        output += `✅ ${eligibleDebts.length} dette(s) éligible(s):\n\n`;
        eligibleDebts.forEach((debt, i) => {
          output += `${i + 1}. ${debt.name}\n`;
          output += `   💰 À payer: ${Math.min(debt.monthly_payment, debt.current_amount)} MAD\n`;
          output += `   📅 Échéance: ${debt.due_date}\n`;
          output += `   🏦 Compte: ${debt.payment_account_id}\n`;
          output += '\n';
        });
        
        // Vérifier les paiements déjà effectués
        output += '━━━━━━━━━━━━━━━━━━━━━━\n';
        output += '📝 PAIEMENTS DU MOIS:\n\n';
        
        for (const debt of eligibleDebts) {
          const currentMonth = today.slice(0, 7);
          const payment = await db.getFirstAsync<any>(`
            SELECT id, payment_date, amount
            FROM debt_payments 
            WHERE debt_id = ? AND payment_month = ?
            ORDER BY payment_date DESC LIMIT 1
          `, [debt.id, currentMonth]);
          
          if (payment) {
            output += `${debt.name}: ✅ Payée le ${payment.payment_date}\n`;
          } else {
            output += `${debt.name}: ❌ PAS ENCORE PAYÉE\n`;
          }
        }
      }
      
      setResults(output);
      console.log(output);
      
    } catch (error) {
      console.error('❌ Erreur:', error);
      Alert.alert('Erreur', `Impossible de vérifier les dettes: ${error}`);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.button, isChecking && styles.buttonDisabled]}
        onPress={checkDebtsAutoPay}
        disabled={isChecking}
      >
        <Text style={styles.buttonText}>
          {isChecking ? '🔄 Vérification...' : '🔍 Diagnostic Dettes Auto'}
        </Text>
      </TouchableOpacity>
      
      {results ? (
        <ScrollView style={styles.resultsContainer}>
          <Text style={styles.resultsText}>{results}</Text>
        </ScrollView>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsContainer: {
    marginTop: 16,
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    maxHeight: 400,
  },
  resultsText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#333',
  },
});
