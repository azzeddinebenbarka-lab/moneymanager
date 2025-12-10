// src/components/modals/TransactionDetailModal.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useLanguage } from '../../context/LanguageContext';
import { useDesignSystem } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');

interface TransactionDetailModalProps {
  visible: boolean;
  onClose: () => void;
  transaction: {
    amount: number;
    category: string;
    date: string;
    description?: string;
  } | null;
  categoryLabel: string;
  categoryIcon: string;
  formatAmount: (amount: number) => string;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  visible,
  onClose,
  transaction,
  categoryLabel,
  categoryIcon,
  formatAmount
}) => {
  const { colors, spacing } = useDesignSystem();
  const { t } = useLanguage();

  // Ne rien rendre si pas de transaction ou modal non visible
  if (!visible || !transaction) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { backgroundColor: colors.background?.card || '#FFFFFF' }]}>
          {/* Header avec icône */}
          <View style={[styles.header, { backgroundColor: colors.primary?.[500] || '#3B82F6' }]}>
            <View style={styles.iconContainer}>
              <Ionicons name={categoryIcon as any} size={32} color="#FFFFFF" />
            </View>
            <Text style={styles.headerTitle}>{categoryLabel}</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Contenu */}
          <View style={[styles.content, { padding: spacing?.lg || 20 }]}>
            {/* Badge info */}
            <View style={[styles.infoBadge, { backgroundColor: colors.warning?.[100] || '#FEF3C7' }]}>
              <Ionicons name="information-circle" size={20} color={colors.warning?.[700] || '#92400E'} />
              <Text style={[styles.infoText, { color: colors.warning?.[700] || '#92400E' }]}>
                {t.automaticSystemTransaction}
              </Text>
            </View>

            {/* Montant */}
            <View style={styles.section}>
              <View style={[styles.amountContainer, { backgroundColor: colors.background?.secondary || '#F3F4F6' }]}>
                <Text style={[styles.amountLabel, { color: colors.text?.secondary || '#6B7280' }]}>
                  {t.amount}
                </Text>
                <Text style={[styles.amountValue, { color: colors.error?.[500] || '#EF4444' }]}>
                  {formatAmount(transaction.amount)}
                </Text>
              </View>
            </View>

            {/* Détails */}
            <View style={styles.detailsContainer}>
              {/* Catégorie */}
              <View style={styles.detailRow}>
                <View style={styles.detailIconWrapper}>
                  <Ionicons name="pricetag" size={20} color={colors.text?.secondary || '#6B7280'} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={[styles.detailLabel, { color: colors.text?.secondary || '#6B7280' }]}>
                    {t.category}
                  </Text>
                  <Text style={[styles.detailValue, { color: colors.text?.primary || '#111827' }]}>
                    {categoryLabel}
                  </Text>
                </View>
              </View>

              {/* Date */}
              <View style={styles.detailRow}>
                <View style={styles.detailIconWrapper}>
                  <Ionicons name="calendar" size={20} color={colors.text?.secondary || '#6B7280'} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={[styles.detailLabel, { color: colors.text?.secondary || '#6B7280' }]}>
                    {t.date}
                  </Text>
                  <Text style={[styles.detailValue, { color: colors.text?.primary || '#111827' }]}>
                    {new Date(transaction.date).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Text>
                </View>
              </View>

              {/* Description */}
              {transaction.description && (
                <View style={styles.detailRow}>
                  <View style={styles.detailIconWrapper}>
                    <Ionicons name="document-text" size={20} color={colors.text?.secondary || '#6B7280'} />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={[styles.detailLabel, { color: colors.text?.secondary || '#6B7280' }]}>
                      {t.description}
                    </Text>
                    <Text style={[styles.detailValue, { color: colors.text?.primary || '#111827' }]}>
                      {transaction.description}
                    </Text>
                  </View>
                </View>
              )}
            </View>

            {/* Note explicative */}
            <View style={[styles.noteContainer, { 
              backgroundColor: colors.background?.secondary || '#F3F4F6', 
              borderLeftColor: colors.primary?.[500] || '#3B82F6' 
            }]}>
              <Text style={[styles.noteText, { color: colors.text?.secondary || '#6B7280' }]}>
                💡 Cette transaction a été créée automatiquement. Pour la modifier, rendez-vous dans la section correspondante.
              </Text>
            </View>
          </View>

          {/* Footer */}
          <View style={[styles.footer, { borderTopColor: colors.border?.primary || '#E5E7EB' }]}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary?.[500] || '#3B82F6' }]}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>Compris</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: width - 40,
    maxWidth: 400,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    position: 'relative',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingVertical: 20,
  },
  infoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  section: {
    marginBottom: 20,
  },
  amountContainer: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  amountValue: {
    fontSize: 32,
    fontWeight: '700',
  },
  detailsContainer: {
    gap: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  detailIconWrapper: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailContent: {
    flex: 1,
    justifyContent: 'center',
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
  },
  noteContainer: {
    marginTop: 20,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
  },
  noteText: {
    fontSize: 13,
    lineHeight: 18,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
  button: {
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
