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

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';

const logo = require('../../../assets/images/interfaces/login.PNG');

const LoginScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const { login, register, isRegistered } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registered, setRegistered] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const r = await isRegistered();
      setRegistered(r);
    })();
  }, []);

  const handleSubmit = async () => {
    if (!email || !password) return Alert.alert('Erreur', 'Veuillez remplir tous les champs');

    if (registered) {
      const ok = await login(email.trim(), password);
      if (!ok) Alert.alert('Erreur', 'Email ou mot de passe invalide');
    } else {
      try {
        await register(email.trim(), password);
        Alert.alert('Succès', 'Compte créé et connecté');
      } catch (err: any) {
        Alert.alert('Erreur', err?.message || 'Impossible de créer le compte');
      }
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.logoWrap}>
            <Image source={logo} style={styles.logo} resizeMode="contain" />
          </View>
          <Text style={styles.appTitle}>Mon Budget</Text>
          <Text style={styles.subtitle}>Gérez vos finances intelligemment</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="votre@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#bdbdbd"
          />

          <Text style={[styles.label, { marginTop: 8 }]}>Mot de passe</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#bdbdbd"
          />

          <TouchableOpacity style={styles.button} onPress={handleSubmit} activeOpacity={0.85}>
            <Text style={styles.buttonText}>Se connecter</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.forgot} onPress={() => Alert.alert('Réinitialisation', "Fonctionnalité 'Mot de passe oublié' à implémenter") }>
            <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f6f7fb' },
  container: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  header: { alignItems: 'center', marginBottom: 24 },
  logoWrap: { width: 72, height: 72, borderRadius: 16, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', elevation: 3 },
  logo: { width: 44, height: 44 },
  appTitle: { fontSize: 28, fontWeight: '700', color: '#17233c', marginTop: 12 },
  subtitle: { fontSize: 13, color: '#6b7280', marginTop: 6 },

  form: { backgroundColor: 'transparent', marginTop: 8 },
  label: { fontSize: 13, color: '#374151', marginBottom: 6 },
  input: {
    height: 52,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#eceef6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },

  button: {
    marginTop: 18,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#6C63FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 3,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  forgot: { marginTop: 14, alignItems: 'center' },
  forgotText: { color: '#6b7280', fontSize: 13 },
});

export default LoginScreen;
