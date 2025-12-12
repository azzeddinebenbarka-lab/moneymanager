// App.tsx - VERSION SIMPLIFIÉE SANS CHARGES ISLAMIQUES
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Font from 'expo-font';
import * as NavigationBar from 'expo-navigation-bar';
import * as Updates from 'expo-updates';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AnimatedSplash from './src/components/SplashScreen';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { CurrencyProvider } from './src/context/CurrencyContext';
import { DatabaseProvider } from './src/context/DatabaseContext';
import { LanguageProvider } from './src/context/LanguageContext';
import { RefreshProvider } from './src/context/RefreshContext';
import { SecurityProvider } from './src/context/SecurityContext';
import { ThemeProvider } from './src/context/ThemeContext';
import ModernDrawerNavigator from './src/navigation/ModernDrawerNavigator';
import ForgotPasswordScreen from './src/screens/auth/ForgotPasswordScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import WelcomeScreen from './src/screens/auth/WelcomeScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';

// Hook pour l'initialisation des polices
const useAppInitialization = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [initializationError, setInitializationError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const initializeApp = async () => {
    try {
      console.log('🚀 Démarrage de l\'initialisation de l\'application...');
      setIsRetrying(false);
      
      // Étape 0: Configuration de la navigation bar Android
      if (Platform.OS === 'android') {
        try {
          // Masquer la barre de navigation système
          await NavigationBar.setVisibilityAsync('hidden');
          // Comportement sticky : réapparaît temporairement au swipe puis se cache
          await NavigationBar.setBehaviorAsync('overlay-swipe');
          // Rendre la barre transparente
          await NavigationBar.setBackgroundColorAsync('#00000000');
          console.log('✅ Barre de navigation système configurée');
        } catch (navError) {
          console.warn('⚠️ Impossible de configurer la barre de navigation:', navError);
        }
      }
      
      // Étape 1: Vérifier les mises à jour EAS (uniquement en production, pas en dev)
      if (!__DEV__) {
        try {
          console.log('🔄 Vérification des mises à jour OTA...');
          console.log('📱 Runtime actuel:', Updates.runtimeVersion);
          console.log('📱 UpdateID actuel:', Updates.updateId);
          console.log('📱 Channel:', Updates.channel);
          
          const update = await Updates.checkForUpdateAsync();
          console.log('📦 Résultat vérification:', update);
          
          if (update.isAvailable) {
            console.log('📥 Mise à jour disponible! Téléchargement...');
            console.log('🆕 Manifest:', update.manifest);
            await Updates.fetchUpdateAsync();
            console.log('✅ Mise à jour téléchargée! Redémarrage...');
            await Updates.reloadAsync();
            return; // Stoppe l'exécution car l'app va redémarrer
          } else {
            console.log('✅ Application à jour - aucune mise à jour disponible');
          }
        } catch (updateError) {
          console.error('❌ Erreur vérification mises à jour:', updateError);
          console.error('❌ Détails:', JSON.stringify(updateError, null, 2));
          // Continue l'initialisation même si la mise à jour échoue
        }
      } else {
        console.log('⚠️ Mode développement - Vérification OTA désactivée');
      }
      
      // Étape 1: Chargement des polices
      console.log('🔤 Chargement des polices Ionicons...');
      await Font.loadAsync({
        ...Ionicons.font,
      });
      console.log('✅ Polices Ionicons chargées avec succès');

      setFontsLoaded(true);
      setInitializationError(null);
      console.log('✅ Initialisation de l\'application terminée avec succès');

    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation de l\'application:', error);
      setInitializationError(
        error instanceof Error 
          ? `Erreur d'initialisation: ${error.message}`
          : 'Erreur d\'initialisation inconnue'
      );
      setFontsLoaded(false);
    }
  };

  const retry = useCallback(() => {
    setIsRetrying(true);
    setInitializationError(null);
    initializeApp();
  }, []);

  useEffect(() => {
    initializeApp();
  }, []);

  return {
    isInitialized: fontsLoaded && !initializationError,
    error: initializationError,
    isRetrying,
    retry
  };
};

// Écran d'erreur d'initialisation
const InitializationErrorScreen: React.FC<{
  error: string;
  onRetry: () => void;
  isRetrying: boolean;
}> = ({ error, onRetry, isRetrying }) => (
  <View style={styles.errorContainer}>
    <Text style={styles.errorTitle}>❌ Erreur d'initialisation</Text>
    <Text style={styles.errorMessage}>{error}</Text>
    <TouchableOpacity 
      style={[styles.retryButton, isRetrying && styles.retryButtonDisabled]}
      onPress={onRetry}
      disabled={isRetrying}
    >
      {isRetrying ? (
        <ActivityIndicator color="white" size="small" />
      ) : (
        <Text style={styles.retryButtonText}>🔄 Réessayer</Text>
      )}
    </TouchableOpacity>
  </View>
);

// Écran de chargement
const LoadingScreen: React.FC = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#007AFF" />
    <Text style={styles.loadingText}>Chargement de l'application...</Text>
    <Text style={styles.loadingSubtext}>Initialisation en cours</Text>
  </View>
);

// Stack principal pour l'authentification
const AuthStack = createStackNavigator();

const AuthStackNavigator: React.FC = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Onboarding" component={OnboardingScreen} />
    <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
    <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  </AuthStack.Navigator>
);

// Stack principal pour l'application - DRAWER contient BOTTOM TAB
const AppStack = createStackNavigator();

const AppStackNavigator: React.FC = () => (
  <AppStack.Navigator screenOptions={{ headerShown: false }}>
    <AppStack.Screen name="Main" component={ModernDrawerNavigator} />
  </AppStack.Navigator>
);

// Composant de navigation principal avec gestion de l'auth
const AppNavigator: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      {user ? <AppStackNavigator /> : <AuthStackNavigator />}
    </NavigationContainer>
  );
};

// Composant avec tous les providers
const AppWithProviders: React.FC = () => {
  // Maintenir la barre de navigation cachée
  useEffect(() => {
    if (Platform.OS === 'android') {
      const hideNavigationBar = async () => {
        try {
          await NavigationBar.setVisibilityAsync('hidden');
          await NavigationBar.setBehaviorAsync('overlay-swipe');
          await NavigationBar.setBackgroundColorAsync('#00000000');
        } catch (error) {
          console.warn('⚠️ Erreur configuration navigation bar:', error);
        }
      };

      hideNavigationBar();
      
      // Re-masquer la barre toutes les 2 secondes au cas où elle réapparaît
      const interval = setInterval(hideNavigationBar, 2000);
      
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <SafeAreaProvider>
      {Platform.OS === 'android' && (
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
      )}
      <ThemeProvider>
        <LanguageProvider>
          <CurrencyProvider>
            <SecurityProvider>
              <AuthProvider>
                <DatabaseProvider>
                  <RefreshProvider>
                    <AppNavigator />
                  </RefreshProvider>
                </DatabaseProvider>
              </AuthProvider>
            </SecurityProvider>
          </CurrencyProvider>
        </LanguageProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

// Composant principal App
const App: React.FC = () => {
  const { isInitialized, error, isRetrying, retry } = useAppInitialization();
  const [showSplash, setShowSplash] = React.useState(true);

  // Gestion des erreurs d'initialisation
  if (error) {
    return (
      <InitializationErrorScreen 
        error={error} 
        onRetry={retry} 
        isRetrying={isRetrying} 
      />
    );
  }

  // Attendre l'initialisation complète
  if (!isInitialized) {
    return <LoadingScreen />;
  }

  // Afficher le splash screen après l'initialisation
  if (showSplash) {
    return <AnimatedSplash onFinish={() => setShowSplash(false)} />;
  }

  // Application initialisée avec succès
  return <AppWithProviders />;
};

// Styles
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    gap: 16,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginTop: 16,
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 32,
    gap: 24,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#dc3545',
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  retryButtonDisabled: {
    backgroundColor: '#ccc',
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default App;