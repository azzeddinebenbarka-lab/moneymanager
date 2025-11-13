// src/components/islamic/IslamicChargeCard.tsx - VERSION CORRIGÉE
import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useCurrency } from '../../context/CurrencyContext';
import { useTheme } from '../../context/ThemeContext';
import { IslamicCharge } from '../../types/IslamicCharge';

interface IslamicChargeCardProps {
  charge: IslamicCharge;
  onUpdateAmount: (chargeId: string, newAmount: number) => void;
  onMarkAsPaid: (chargeId: string) => void;
}

export const IslamicChargeCard: React.FC<IslamicChargeCardProps> = ({
  charge,
  onUpdateAmount,
  onMarkAsPaid
}) => {
  const { formatAmount } = useCurrency();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editAmount, setEditAmount] = useState(charge.amount.toString());

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'obligatory': return '#EF4444';
      case 'recommended': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'obligatory': return 'Obligatoire';
      case 'recommended': return 'Recommandé';
      default: return 'Personnalisé';
    }
  };

  const handleEditAmount = () => {
    const newAmount = parseFloat(editAmount);
    if (isNaN(newAmount) || newAmount < 0) {
      Alert.alert('Erreur', 'Veuillez saisir un montant valide');
      return;
    }

    onUpdateAmount(charge.id, newAmount);
    setEditModalVisible(false);
    Alert.alert('Succès', 'Montant modifié avec succès');
  };

  const handleAmountChange = (value: string) => {
    let cleanedValue = value.replace(/[^\d,.]/g, '');
    cleanedValue = cleanedValue.replace(',', '.');
    const parts = cleanedValue.split('.');
    if (parts.length > 2) {
      cleanedValue = parts[0] + '.' + parts.slice(1).join('');
    }
    setEditAmount(cleanedValue);
  };

  return (
    <>
      <View style={[styles.card, isDark && styles.darkCard]}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={[styles.name, isDark && styles.darkText]}>
              {charge.name}
            </Text>
            <Text style={[styles.arabicName, isDark && styles.darkSubtext]}>
              {charge.arabicName}
            </Text>
          </View>
          <View style={[
            styles.typeBadge,
            { backgroundColor: `${getTypeColor(charge.type)}20` }
          ]}>
            <Text style={[styles.typeText, { color: getTypeColor(charge.type) }]}>
              {getTypeText(charge.type)}
            </Text>
          </View>
        </View>

        <Text style={[styles.description, isDark && styles.darkSubtext]}>
          {charge.description}
        </Text>

        <View style={styles.details}>
          <View style={styles.dateContainer}>
            <Text style={[styles.dateLabel, isDark && styles.darkSubtext]}>
              Date calculée:
            </Text>
            <Text style={[styles.date, isDark && styles.darkText]}>
              {charge.calculatedDate.toLocaleDateString('fr-FR')}
            </Text>
          </View>
          <Text style={[styles.amount, isDark && styles.darkText]}>
            {formatAmount(charge.amount)}
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity 
            style={[
              styles.actionButton, 
              styles.payButton,
              charge.isPaid && styles.disabledButton
            ]}
            onPress={() => onMarkAsPaid(charge.id)}
            disabled={charge.isPaid}
          >
            <Text style={styles.actionText}>
              {charge.isPaid ? '✅ Payé' : '💰 Payer'}
            </Text>
          </TouchableOpacity>
          
          {!charge.isPaid && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.editButton]}
              onPress={() => setEditModalVisible(true)}
            >
              <Text style={styles.actionText}>✏️ Modifier</Text>
            </TouchableOpacity>
          )}
        </View>

        {charge.isPaid && charge.paidDate && (
          <Text style={[styles.paidDate, isDark && styles.darkSubtext]}>
            Payé le {charge.paidDate.toLocaleDateString('fr-FR')}
          </Text>
        )}
      </View>

      {/* Modal de modification du montant */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDark && styles.darkModalContent]}>
            <Text style={[styles.modalTitle, isDark && styles.darkText]}>
              Modifier le montant
            </Text>
            
            <Text style={[styles.chargeName, isDark && styles.darkText]}>
              {charge.name}
            </Text>
            
            <View style={styles.amountInputContainer}>
              <Text style={[styles.amountLabel, isDark && styles.darkText]}>
                Nouveau montant:
              </Text>
              <TextInput
                style={[styles.amountInput, isDark && styles.darkInput]}
                value={editAmount}
                onChangeText={handleAmountChange}
                placeholder="0.00"
                placeholderTextColor={isDark ? "#888" : "#999"}
                keyboardType="decimal-pad"
                autoFocus={true}
              />
              {editAmount && (
                <Text style={[styles.previewAmount, isDark && styles.darkSubtext]}>
                  {formatAmount(parseFloat(editAmount) || 0)}
                </Text>
              )}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleEditAmount}
              >
                <Text style={styles.saveButtonText}>Enregistrer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  darkCard: {
    backgroundColor: '#2c2c2e',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 2,
  },
  arabicName: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'System',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 8,
  },
  typeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 18,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateContainer: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  date: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  payButton: {
    backgroundColor: '#10B981',
  },
  editButton: {
    backgroundColor: '#3B82F6',
  },
  disabledButton: {
    backgroundColor: '#6B7280',
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  paidDate: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  // Styles pour le modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  darkModalContent: {
    backgroundColor: '#2c2c2e',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  chargeName: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  amountInputContainer: {
    marginBottom: 24,
  },
  amountLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  amountInput: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
  },
  darkInput: {
    backgroundColor: '#3a3a3c',
    borderColor: '#555',
    color: '#fff',
  },
  previewAmount: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#6B7280',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  darkText: {
    color: '#fff',
  },
  darkSubtext: {
    color: '#888',
  },
});

export default IslamicChargeCard;