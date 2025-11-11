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
import { useTheme } from '../context/ThemeContext';

// Version temporaire - à connecter avec AuthContext plus tard 
const AuthScreen = () => {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isSettingUp, setIsSettingUp] = useState(false);
  const { theme } = useTheme();
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
      style={[styles.container, isDark && styles.darkContainer]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Text style={[styles.title, isDark && styles.darkText]}>
          {isSettingUp ? 'Configurer votre PIN' : 'Money Manager'}
        </Text>
        
        <Text style={[styles.subtitle, isDark && styles.darkText]}>
          {isSettingUp 
            ? 'Choisissez un code PIN à 4 chiffres' 
            : 'Entrez votre code PIN'
          }
        </Text>

        <View style={styles.pinContainer}>
          <TextInput
            style={[styles.pinInput, isDark && styles.darkInput]}
            value={pin}
            onChangeText={setPin}
            keyboardType="number-pad"
            secureTextEntry
            maxLength={4}
            placeholder="****"
            placeholderTextColor={isDark ? '#666' : '#999'}
            textAlign="center"
          />
        </View>

        {isSettingUp && (
          <View style={styles.pinContainer}>
            <TextInput
              style={[styles.pinInput, isDark && styles.darkInput]}
              value={confirmPin}
              onChangeText={setConfirmPin}
              keyboardType="number-pad"
              secureTextEntry
              maxLength={4}
              placeholder="Confirmer le PIN"
              placeholderTextColor={isDark ? '#666' : '#999'}
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
          <Text style={[styles.switchText, isDark && styles.darkText]}>
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
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#1c1c1e',
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
    color: '#000',
    marginBottom: 16,
  },
  darkText: {
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
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
    color: '#000',
    backgroundColor: '#f8f9fa',
  },
  darkInput: {
    backgroundColor: '#2c2c2e',
    borderColor: '#0A84FF',
    color: '#fff',
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