// src/screens/auth/LoginScreen.tsx
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';

const LoginScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const { login, register, isRegistered, user } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [registered, setRegistered] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const r = await isRegistered();
      setRegistered(r);
    })();
  }, []);

  const handleSubmit = async () => {
    if (!username || !password) return Alert.alert('Erreur', 'Veuillez remplir tous les champs');

    if (registered) {
      const ok = await login(username, password);
      if (!ok) Alert.alert('Erreur', 'Identifiants invalides');
    } else {
      try {
        await register(username, password);
        Alert.alert('Succès', 'Compte créé et connecté');
      } catch (err) {
        Alert.alert('Erreur', err.message || 'Impossible de créer le compte');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}>{registered ? 'Connexion' : 'Créer un compte'}</Text>
        <TextInput style={styles.input} placeholder="Nom d'utilisateur" value={username} onChangeText={setUsername} autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Mot de passe" value={password} onChangeText={setPassword} secureTextEntry />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>{registered ? 'Se connecter' : "S'inscrire"}</Text>
        </TouchableOpacity>

        {registered && (
          <TouchableOpacity style={styles.link} onPress={() => setRegistered(false)}>
            <Text style={styles.linkText}>Créer un nouveau compte</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', backgroundColor: '#f8f9fa' },
  box: { margin: 20, padding: 20, borderRadius: 12, backgroundColor: '#fff', elevation: 3 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#e0e0e0', padding: 12, borderRadius: 8, marginBottom: 12 },
  button: { backgroundColor: '#007AFF', padding: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600' },
  link: { marginTop: 12, alignItems: 'center' },
  linkText: { color: '#007AFF' },
});

export default LoginScreen;
