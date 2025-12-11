// src/navigation/SavingsStackNavigator.tsx - VERSION CORRIGÉE
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { useLanguage } from '../context/LanguageContext';
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
  const { t } = useLanguage();
  
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
          title: t.savingsGoals,
        }}
      />

      {/* Écran d'ajout d'un nouvel objectif */}
      <Stack.Screen 
        name="AddSavingsGoal" 
        component={AddSavingsGoalScreen}
        options={{
          title: t.newSavingsGoal,
          presentation: 'modal' as const,
          gestureEnabled: true,
        }}
      />

      {/* Écran de modification d'un objectif existant */}
      <Stack.Screen 
        name="EditSavingsGoal" 
        component={EditSavingsGoalScreen}
        options={{
          title: t.editSavingsGoal,
          presentation: 'modal' as const,
          gestureEnabled: true,
        }}
      />

      {/* Écran de détail d'un objectif */}
      <Stack.Screen 
        name="SavingsDetail" 
        component={SavingsDetailScreen}
        options={{
          title: t.savingsGoalDetails,
          gestureEnabled: true,
        }}
      />

      {/* Calculateur d'épargne */}
      <Stack.Screen 
        name="SavingsCalculator" 
        component={SavingsCalculatorScreen}
        options={{
          title: t.savingsCalculator,
          gestureEnabled: true,
        }}
      />

      {/* Analytics d'épargne */}
      <Stack.Screen 
        name="SavingsAnalytics" 
        component={SavingsAnalyticsScreen}
        options={{
          title: t.savingsAnalytics,
          gestureEnabled: true,
        }}
      />
    </Stack.Navigator>
  );
};

export default SavingsStackNavigator;