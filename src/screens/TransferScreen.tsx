// src/screens/TransferScreen.tsx - VERSION CORRIGÉE AVEC NAVIGATION ET MAD
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useCurrency } from '../context/CurrencyContext';
import { useTheme } from '../context/ThemeContext';
import { useAccounts } from '../hooks/useAccounts';
import { transferService } from '../services/transferService';
import { TransferData } from '../types';

const TransferScreen = ({ navigation, route }: any) => {
  const { theme } = useTheme();
  const { formatAmount } = useCurrency(); // ✅ CORRECTION : Utiliser le contexte devise
  const { accounts, refreshAccounts } = useAccounts();
  const [loading, setLoading] = useState(false);
  const isDark = theme === 'dark';

  // ✅ CORRECTION : Récupérer le compte source depuis les paramètres
  const initialFromAccountId = route.params?.fromAccountId || '';

  const [transferData, setTransferData] = useState<Omit<TransferData, 'amount'> & { amount: string }>({
    fromAccountId: initialFromAccountId, // ✅ Pré-remplir si fourni
    toAccountId: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleTransfer = async () => {
    if (!transferData.fromAccountId || !transferData.toAccountId) {
      Alert.alert('Erreur', 'Veuillez sélectionner les comptes source et destination');
      return;
    }

    if (!transferData.amount || parseFloat(transferData.amount) <= 0) {
      Alert.alert('Erreur', 'Veuillez saisir un montant valide');
      return;
    }

    const amount = parseFloat(transferData.amount);

    try {
      setLoading(true);

      // Convertir pour l'appel au service
      const transferPayload: TransferData = {
        ...transferData,
        amount: amount
      };

      console.log('🔄 [TransferScreen] Exécution du transfert:', transferPayload);

      // ✅ CORRECTION : Utiliser executeTransfer au lieu de createTransfer
      await transferService.executeTransfer(transferPayload);

      Alert.alert(
        '✅ Transfert réussi', 
        `Transfert de ${formatAmount(amount)} effectué avec succès`,
        [
          { 
            text: 'OK', 
            onPress: () => {
              // Rafraîchir les données et revenir
              refreshAccounts();
              navigation.goBack();
            }
          }
        ]
      );

    } catch (error: any) {
      console.error('❌ [TransferScreen] Erreur transfert:', error);
      Alert.alert('❌ Erreur', error.message || 'Erreur lors du transfert');
    } finally {
      setLoading(false);
    }
  };

  const fromAccount = accounts.find(acc => acc.id === transferData.fromAccountId);
  const toAccount = accounts.find(acc => acc.id === transferData.toAccountId);

  const amountValue = transferData.amount ? parseFloat(transferData.amount) : 0;
  
  const canTransfer = 
    transferData.fromAccountId && 
    transferData.toAccountId && 
    transferData.amount && 
    amountValue > 0 &&
    transferData.fromAccountId !== transferData.toAccountId &&
    fromAccount &&
    fromAccount.balance >= amountValue;

  // ✅ CORRECTION : Navigation sécurisée
  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
      {/* Header amélioré */}
      <View style={[styles.header, isDark && styles.darkHeader]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBack}
          disabled={loading}
        >
          <Ionicons name="arrow-back" size={24} color={isDark ? '#fff' : '#000'} />
        </TouchableOpacity>
        <Text style={[styles.title, isDark && styles.darkText]}>
          Transfert entre comptes
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Instructions */}
        <View style={[styles.infoCard, isDark && styles.darkCard]}>
          <Ionicons name="information-circle" size={24} color="#007AFF" />
          <View style={styles.infoText}>
            <Text style={[styles.infoTitle, isDark && styles.darkText]}>
              Transfert sécurisé
            </Text>
            <Text style={[styles.infoDescription, isDark && styles.darkSubtext]}>
              Transférez de l'argent entre vos comptes en toute sécurité
            </Text>
          </View>
        </View>

        {/* Compte source */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, isDark && styles.darkText]}>
            Depuis le compte
          </Text>
          {accounts.map((account) => (
            <TouchableOpacity
              key={account.id}
              style={[
                styles.accountButton,
                transferData.fromAccountId === account.id && styles.accountButtonSelected,
                isDark && styles.darkAccountButton,
              ]}
              onPress={() => setTransferData({ ...transferData, fromAccountId: account.id })}
              disabled={loading}
            >
              <View style={[styles.colorIndicator, { backgroundColor: account.color }]} />
              <View style={styles.accountInfo}>
                <Text style={[
                  styles.accountName,
                  transferData.fromAccountId === account.id && styles.accountNameSelected,
                  isDark && styles.darkText,
                ]}>
                  {account.name}
                </Text>
                <Text style={[styles.accountBalance, isDark && styles.darkSubtext]}>
                  Solde: {formatAmount(account.balance)}
                </Text>
              </View>
              {transferData.fromAccountId === account.id && (
                <Ionicons name="checkmark-circle" size={20} color="#34C759" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Flèche de transfert */}
        <View style={styles.arrowContainer}>
          <Ionicons name="arrow-down" size={24} color="#007AFF" />
        </View>

        {/* Compte destination */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, isDark && styles.darkText]}>
            Vers le compte
          </Text>
          {accounts
            .filter(account => account.id !== transferData.fromAccountId)
            .map((account) => (
              <TouchableOpacity
                key={account.id}
                style={[
                  styles.accountButton,
                  transferData.toAccountId === account.id && styles.accountButtonSelected,
                  isDark && styles.darkAccountButton,
                ]}
                onPress={() => setTransferData({ ...transferData, toAccountId: account.id })}
                disabled={loading}
              >
                <View style={[styles.colorIndicator, { backgroundColor: account.color }]} />
                <View style={styles.accountInfo}>
                  <Text style={[
                    styles.accountName,
                    transferData.toAccountId === account.id && styles.accountNameSelected,
                    isDark && styles.darkText,
                  ]}>
                    {account.name}
                  </Text>
                  <Text style={[styles.accountBalance, isDark && styles.darkSubtext]}>
                    Solde: {formatAmount(account.balance)}
                  </Text>
                </View>
                {transferData.toAccountId === account.id && (
                  <Ionicons name="checkmark-circle" size={20} color="#34C759" />
                )}
              </TouchableOpacity>
            ))}
        </View>

        {/* Montant */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, isDark && styles.darkText]}>Montant du transfert</Text>
          <View style={[styles.amountContainer, isDark && styles.darkInput]}>
            <TextInput
              style={[styles.amountInput, isDark && styles.darkText]}
              value={transferData.amount}
              onChangeText={(text) => setTransferData({ ...transferData, amount: text.replace(',', '.') })}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor={isDark ? '#666' : '#999'}
              editable={!loading}
            />
          </View>
          {fromAccount && transferData.amount && amountValue > fromAccount.balance && (
            <Text style={styles.errorText}>
              ❌ Solde insuffisant. Solde disponible: {formatAmount(fromAccount.balance)}
            </Text>
          )}
        </View>

        {/* Description */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, isDark && styles.darkText]}>
            Description (optionnelle)
          </Text>
          <TextInput
            style={[styles.input, isDark && styles.darkInput, isDark && styles.darkText]}
            value={transferData.description}
            onChangeText={(text) => setTransferData({ ...transferData, description: text })}
            placeholder="Ex: Transfert mensuel d'épargne"
            placeholderTextColor={isDark ? '#666' : '#999'}
            editable={!loading}
          />
        </View>

        {/* Date */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, isDark && styles.darkText]}>Date</Text>
          <TextInput
            style={[styles.input, isDark && styles.darkInput, isDark && styles.darkText]}
            value={transferData.date}
            onChangeText={(text) => setTransferData({ ...transferData, date: text })}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={isDark ? '#666' : '#999'}
            editable={!loading}
          />
        </View>

        {/* Résumé du transfert */}
        {fromAccount && toAccount && transferData.amount && amountValue > 0 && (
          <View style={[styles.summary, isDark && styles.darkSummary]}>
            <Text style={[styles.summaryTitle, isDark && styles.darkText]}>
              Récapitulatif du transfert
            </Text>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, isDark && styles.darkSubtext]}>De:</Text>
              <Text style={[styles.summaryValue, isDark && styles.darkText]}>
                {fromAccount.name}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, isDark && styles.darkSubtext]}>Vers:</Text>
              <Text style={[styles.summaryValue, isDark && styles.darkText]}>
                {toAccount.name}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, isDark && styles.darkSubtext]}>Montant:</Text>
              <Text style={[styles.summaryValue, isDark && styles.darkText]}>
                {formatAmount(amountValue)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, isDark && styles.darkSubtext]}>Nouveau solde source:</Text>
              <Text style={[styles.summaryValue, isDark && styles.darkText]}>
                {formatAmount(fromAccount.balance - amountValue)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, isDark && styles.darkSubtext]}>Nouveau solde destination:</Text>
              <Text style={[styles.summaryValue, isDark && styles.darkText]}>
                {formatAmount(toAccount.balance + amountValue)}
              </Text>
            </View>
          </View>
        )}

        {/* Bouton de transfert */}
        <TouchableOpacity
          style={[
            styles.transferButton,
            (!canTransfer || loading) && styles.transferButtonDisabled
          ]}
          onPress={handleTransfer}
          disabled={!canTransfer || loading}
        >
          {loading ? (
            <>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={styles.transferButtonText}>Transfert en cours...</Text>
            </>
          ) : (
            <>
              <Ionicons name="swap-horizontal" size={20} color="#fff" />
              <Text style={styles.transferButtonText}>Effectuer le transfert</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.spacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  darkContainer: {
    backgroundColor: '#1c1c1e',
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    paddingTop: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  darkHeader: {
    backgroundColor: '#2c2c2e',
    borderBottomColor: '#38383a',
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: 'center',
  },
  darkCard: {
    backgroundColor: 'rgba(10, 132, 255, 0.2)',
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  accountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  darkAccountButton: {
    backgroundColor: '#2c2c2e',
    borderColor: '#38383a',
  },
  accountButtonSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#e3f2fd',
  },
  colorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
  },
  accountNameSelected: {
    color: '#007AFF',
  },
  accountBalance: {
    fontSize: 14,
    color: '#666',
  },
  arrowContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  darkInput: {
    backgroundColor: '#2c2c2e',
    borderColor: '#38383a',
  },
  amountInput: {
    flex: 1,
    padding: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#000',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginTop: 8,
    fontWeight: '500',
  },
  summary: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 24,
  },
  darkSummary: {
    backgroundColor: '#2c2c2e',
    borderColor: '#38383a',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  transferButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    padding: 20,
    borderRadius: 12,
    gap: 12,
  },
  transferButtonDisabled: {
    backgroundColor: '#ccc',
  },
  transferButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  spacer: {
    height: 20,
  },
  darkText: {
    color: '#fff',
  },
  darkSubtext: {
    color: '#888',
  },
});

export default TransferScreen;