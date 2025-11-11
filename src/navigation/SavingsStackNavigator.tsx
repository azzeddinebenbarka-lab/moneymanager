// src/navigation/SavingsStackNavigator.tsx - VERSION CORRIGÉE
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import AddSavingsGoalScreen from '../screens/AddSavingsGoalScreen';
import SavingsAnalyticsScreen from '../screens/SavingsAnalyticsScreen';
import SavingsCalculatorScreen from '../screens/SavingsCalculatorScreen';
import SavingsDetailScreen from '../screens/SavingsDetailScreen';
import SavingsScreen from '../screens/SavingsScreen';

// Import conditionnel pour éviter l'erreur
let EditSavingsGoalScreen: React.ComponentType<any>;

try {
  EditSavingsGoalScreen = require('../screens/EditSavingsGoalScreen').default;
} catch {
  // Composant de secours si le fichier n'existe pas
  EditSavingsGoalScreen = () => null;
}

// Définition des types pour la navigation
export type SavingsStackParamList = {
  Savings: undefined;
  AddSavingsGoal: undefined;
  EditSavingsGoal: { goalId: string };
  SavingsDetail: { goalId: string };
  SavingsCalculator: undefined;
  SavingsAnalytics: undefined;
};

const Stack = createStackNavigator<SavingsStackParamList>();

export const SavingsStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#f8f9fa' },
        gestureEnabled: true,
      }}
    >
      {/* Écran principal - Liste des objectifs d'épargne */}
      <Stack.Screen 
        name="Savings" 
        component={SavingsScreen}
        options={{
          title: 'Mes Objectifs',
        }}
      />

      {/* Écran d'ajout d'un nouvel objectif */}
      <Stack.Screen 
        name="AddSavingsGoal" 
        component={AddSavingsGoalScreen}
        options={{
          title: 'Nouvel Objectif',
          presentation: 'modal' as const,
          gestureEnabled: true,
        }}
      />

      {/* Écran de modification d'un objectif existant */}
      <Stack.Screen 
        name="EditSavingsGoal" 
        component={EditSavingsGoalScreen}
        options={{
          title: 'Modifier l\'Objectif',
          presentation: 'modal' as const,
          gestureEnabled: true,
        }}
      />

      {/* Écran de détail d'un objectif */}
      <Stack.Screen 
        name="SavingsDetail" 
        component={SavingsDetailScreen}
        options={{
          title: 'Détails de l\'Objectif',
          gestureEnabled: true,
        }}
      />

      {/* Calculateur d'épargne */}
      <Stack.Screen 
        name="SavingsCalculator" 
        component={SavingsCalculatorScreen}
        options={{
          title: 'Calculateur d\'Épargne',
          gestureEnabled: true,
        }}
      />

      {/* Analytics d'épargne */}
      <Stack.Screen 
        name="SavingsAnalytics" 
        component={SavingsAnalyticsScreen}
        options={{
          title: 'Analyses d\'Épargne',
          gestureEnabled: true,
        }}
      />
    </Stack.Navigator>
  );
};

export default SavingsStackNavigator;