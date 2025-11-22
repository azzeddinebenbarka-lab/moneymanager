// screens/AuthScreen.tsx
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import { useDesignSystem, useTheme } from '../context/ThemeContext';

// Version temporaire - à connecter avec AuthContext plus tard 
const AuthScreen = () => {
  const { t } = useLanguage();
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isSettingUp, setIsSettingUp] = useState(false);
  const { theme } = useTheme();
  const { colors } = useDesignSystem();
  const isDark = theme === 'dark';

  const handlePinSubmit = () => {
    if (isSettingUp) {
      // Mode configuration
      if (pin.length !== 4) {
        Alert.alert('Erreur', 'Le PIN doit contenir 4 chiffres');
        return;
      }
      if (pin !== confirmPin) {
        Alert.alert('Erreur', 'Les PIN ne correspondent pas');
        setConfirmPin('');
        return;
      }
      // Stocker le PIN (version temporaire)
      localStorage.setItem('user_pin', pin);
      Alert.alert('Succès', 'PIN configuré avec succès');
      setPin('');
      setConfirmPin('');
      setIsSettingUp(false);
    } else {
      // Mode connexion
      if (pin.length !== 4) {
        Alert.alert('Erreur', 'Le PIN doit contenir 4 chiffres');
        return;
      }
      const storedPin = localStorage.getItem('user_pin');
      if (pin === storedPin) {
        Alert.alert('Succès', 'Connexion réussie');
        // Navigation vers l'app principale
      } else {
        Alert.alert('Erreur', 'PIN incorrect');
        setPin('');
      }
    }
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: colors.background.primary }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text.primary }]}>
          {isSettingUp ? 'Configurer votre PIN' : 'Money Manager'}
        </Text>
        
        <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
          {isSettingUp 
            ? 'Choisissez un code PIN à 4 chiffres' 
            : 'Entrez votre code PIN'
          }
        </Text>

        <View style={styles.pinContainer}>
          <TextInput
            style={[styles.pinInput, { backgroundColor: colors.background.secondary, color: colors.text.primary }]}
            value={pin}
            onChangeText={setPin}
            keyboardType="number-pad"
            secureTextEntry
            maxLength={4}
            placeholder="****"
            placeholderTextColor={colors.text.disabled}
            textAlign="center"
          />
        </View>

        {isSettingUp && (
          <View style={styles.pinContainer}>
            <TextInput
              style={[styles.pinInput, { backgroundColor: colors.background.secondary, color: colors.text.primary }]}
              value={confirmPin}
              onChangeText={setConfirmPin}
              keyboardType="number-pad"
              secureTextEntry
              maxLength={4}
              placeholder="Confirmer le PIN"
              placeholderTextColor={colors.text.disabled}
              textAlign="center"
            />
          </View>
        )}

        <TouchableOpacity 
          style={[
            styles.button, 
            (pin.length !== 4 || (isSettingUp && confirmPin.length !== 4)) && styles.buttonDisabled
          ]} 
          onPress={handlePinSubmit}
          disabled={pin.length !== 4 || (isSettingUp && confirmPin.length !== 4)}
        >
          <Text style={styles.buttonText}>
            {isSettingUp ? 'Configurer' : 'Se connecter'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => setIsSettingUp(!isSettingUp)} 
          style={styles.switchButton}
        >
          <Text style={[styles.switchText, { color: colors.text.primary }]}>
            {isSettingUp ? 'Retour à la connexion' : 'Première connexion ?'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
    textAlign: 'center',
  },
  pinContainer: {
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  pinInput: {
    width: 200,
    height: 50,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 12,
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
    width: '100%',
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
  switchButton: {
    marginTop: 20,
    padding: 10,
  },
  switchText: {
    color: '#007AFF',
    fontSize: 14,
  },
});

export default AuthScreen;