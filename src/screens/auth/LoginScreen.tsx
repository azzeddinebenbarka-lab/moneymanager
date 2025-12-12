// src/screens/auth/LoginScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const LoginScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const { login } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};
    
    // Validation email
    if (!email.trim()) {
      newErrors.email = t.emailRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = t.emailInvalid;
    }
    
    // Validation mot de passe
    if (!password) {
      newErrors.password = t.passwordRequired;
    } else if (password.length < 6) {
      newErrors.password = t.passwordMinLength;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    setErrors({});

    try {
      const result = await login(email.trim(), password);
      if (!result.success) {
        Alert.alert(t.error, result.error || t.loginError);
      }
    } catch (err: any) {
      Alert.alert(t.error, err?.message || t.error);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (navigation) {
      navigation.navigate('ForgotPassword');
    }
  };

  const goToRegister = () => {
    if (navigation) {
      navigation.navigate('Register');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Image 
              source={require('../../../assets/images/icon.png')} 
              style={styles.appIcon}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.appTitle}>MoneyMind</Text>
          <Text style={styles.subtitle}>{t.welcomeDescription}</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.formTitle}>
            {t.signIn}
          </Text>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t.email}</Text>
            <View style={[styles.inputWrapper, errors.email && styles.inputError]}>
              <Ionicons name="mail-outline" size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={t.email}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor="#bdbdbd"
                editable={!loading}
              />
            </View>
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t.password}</Text>
            <View style={[styles.inputWrapper, errors.password && styles.inputError]}>
              <Ionicons name="lock-closed-outline" size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) setErrors({ ...errors, password: undefined });
                }}
                secureTextEntry={!showPassword}
                placeholderTextColor="#bdbdbd"
                editable={!loading}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Ionicons 
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'} 
                  size={20} 
                  color="#6B7280" 
                />
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </View>

          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleSubmit} 
            activeOpacity={0.85}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.buttonText}>
                  {t.signIn}
                </Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.forgot} onPress={handleForgotPassword}>
            <Text style={styles.forgotText}>{t.forgotPassword}</Text>
          </TouchableOpacity>

          {/* Lien vers inscription */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>{t.noAccount}</Text>
            <TouchableOpacity onPress={goToRegister}>
              <Text style={styles.footerLink}>{t.createAccount}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f6f7fb' },
  container: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  centerLoader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 14, color: '#6B7280' },
  
  header: { alignItems: 'center', marginBottom: 32 },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  appIcon: {
    width: 60,
    height: 60,
  },
  appTitle: { fontSize: 28, fontWeight: '700', color: '#17233c' },
  subtitle: { fontSize: 13, color: '#6b7280', marginTop: 6 },

  form: { backgroundColor: '#fff', borderRadius: 16, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
  formTitle: { fontSize: 20, fontWeight: '700', color: '#17233C', marginBottom: 20, textAlign: 'center' },
  
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 13, color: '#374151', marginBottom: 8, fontWeight: '600' },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
  },
  inputError: { borderColor: '#EF4444' },
  inputIcon: { marginRight: 8 },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#17233C',
  },
  eyeIcon: { padding: 4 },
  errorText: { fontSize: 12, color: '#EF4444', marginTop: 4 },

  button: {
    marginTop: 8,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#6C63FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 3,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  forgot: { marginTop: 16, alignItems: 'center' },
  forgotText: { color: '#6C63FF', fontSize: 13, fontWeight: '600' },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
  },
  footerLink: {
    fontSize: 14,
    color: '#6C63FF',
    fontWeight: '600',
  },
});

export default LoginScreen;
