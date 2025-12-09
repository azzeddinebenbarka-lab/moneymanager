// src/components/modals/ChangePasswordModal.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useLanguage } from '../../context/LanguageContext';

interface ChangePasswordModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  isDark?: boolean;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ 
  visible, 
  onClose, 
  onSubmit,
  isDark = false 
}) => {
  const { t } = useLanguage();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<{ current?: string; new?: string; confirm?: string }>({});

  const resetForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setErrors({});
    setShowCurrent(false);
    setShowNew(false);
    setShowConfirm(false);
  };

  const validateForm = (): boolean => {
    const newErrors: any = {};

    if (!currentPassword) newErrors.current = t.currentPasswordRequired;
    if (!newPassword) newErrors.new = t.newPasswordRequired;
    else if (newPassword.length < 6) newErrors.new = t.atLeast6Chars;
    if (!confirmPassword) newErrors.confirm = t.confirmationRequired;
    else if (newPassword !== confirmPassword) newErrors.confirm = t.passwordsDoNotMatch;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await onSubmit(currentPassword, newPassword);
      if (result.success) {
        Alert.alert(t.success, t.passwordChangedSuccess);
        resetForm();
        onClose();
      } else {
        Alert.alert(t.error, result.error || t.cannotChangePassword);
      }
    } catch (error: any) {
      Alert.alert(t.error, error?.message || t.errorOccurred);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modal, isDark && styles.darkModal]}>
          <View style={styles.header}>
            <Text style={[styles.title, isDark && styles.darkText]}>{t.changePassword}</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={isDark ? '#fff' : '#17233C'} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            {/* Current Password */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, isDark && styles.darkSubtext]}>{t.currentPasswordLabel}</Text>
              <View style={[styles.inputWrapper, errors.current && styles.inputError]}>
                <Ionicons name="lock-closed-outline" size={20} color="#6B7280" style={styles.icon} />
                <TextInput
                  style={[styles.input, isDark && styles.darkText]}
                  placeholder="••••••••"
                  value={currentPassword}
                  onChangeText={(text) => {
                    setCurrentPassword(text);
                    if (errors.current) setErrors({ ...errors, current: undefined });
                  }}
                  secureTextEntry={!showCurrent}
                  placeholderTextColor="#bdbdbd"
                  editable={!loading}
                />
                <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)}>
                  <Ionicons name={showCurrent ? 'eye-outline' : 'eye-off-outline'} size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>
              {errors.current && <Text style={styles.errorText}>{errors.current}</Text>}
            </View>

            {/* New Password */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, isDark && styles.darkSubtext]}>{t.newPasswordLabel}</Text>
              <View style={[styles.inputWrapper, errors.new && styles.inputError]}>
                <Ionicons name="key-outline" size={20} color="#6B7280" style={styles.icon} />
                <TextInput
                  style={[styles.input, isDark && styles.darkText]}
                  placeholder={t.atLeast6Chars}
                  value={newPassword}
                  onChangeText={(text) => {
                    setNewPassword(text);
                    if (errors.new) setErrors({ ...errors, new: undefined });
                  }}
                  secureTextEntry={!showNew}
                  placeholderTextColor="#bdbdbd"
                  editable={!loading}
                />
                <TouchableOpacity onPress={() => setShowNew(!showNew)}>
                  <Ionicons name={showNew ? 'eye-outline' : 'eye-off-outline'} size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>
              {errors.new && <Text style={styles.errorText}>{errors.new}</Text>}
            </View>

            {/* Confirm Password */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, isDark && styles.darkSubtext]}>{t.confirmPasswordLabel}</Text>
              <View style={[styles.inputWrapper, errors.confirm && styles.inputError]}>
                <Ionicons name="checkmark-circle-outline" size={20} color="#6B7280" style={styles.icon} />
                <TextInput
                  style={[styles.input, isDark && styles.darkText]}
                  placeholder={t.repeatPassword}
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (errors.confirm) setErrors({ ...errors, confirm: undefined });
                  }}
                  secureTextEntry={!showConfirm}
                  placeholderTextColor="#bdbdbd"
                  editable={!loading}
                />
                <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                  <Ionicons name={showConfirm ? 'eye-outline' : 'eye-off-outline'} size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>
              {errors.confirm && <Text style={styles.errorText}>{errors.confirm}</Text>}
            </View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleClose}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>{t.cancel}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.submitButton, loading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.submitButtonText}>{t.confirm}</Text>
              )}
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
  modal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  darkModal: {
    backgroundColor: '#1E1E1E',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#17233C',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    color: '#374151',
    marginBottom: 8,
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#17233C',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  cancelButtonText: {
    color: '#6B7280',
    fontSize: 15,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#6C63FF',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  darkText: {
    color: '#F9FAFB',
  },
  darkSubtext: {
    color: '#9CA3AF',
  },
});
