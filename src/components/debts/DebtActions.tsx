// /src/components/debts/DebtActions.tsx
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Debt } from '../../types/Debt';

interface Props {
  debt: Debt;
  onMarkAsPaid: () => void;
  onDelete: () => void;
}

export const DebtActions = ({ debt, onMarkAsPaid, onDelete }: Props) => {
  if (debt.status === 'paid') {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={onDelete}
        >
          <Text style={styles.deleteButtonText}>Supprimer la dette</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, styles.paidButton]}
        onPress={onMarkAsPaid}
      >
        <Text style={styles.paidButtonText}>Marquer comme payée</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.button, styles.deleteButton]}
        onPress={onDelete}
      >
        <Text style={styles.deleteButtonText}>Supprimer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paidButton: {
    backgroundColor: '#28a745',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  paidButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});