// src/navigation/DebtStackNavigator.tsx - VERSION CORRIGÉE
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import AddDebtScreen from '../screens/AddDebtScreen';
import DebtAnalyticsScreen from '../screens/DebtAnalyticsScreen';
import DebtCalculatorScreen from '../screens/DebtCalculatorScreen';
import DebtDetailScreen from '../screens/DebtDetailScreen';
import DebtsScreen from '../screens/DebtsScreen';
import EditDebtScreen from '../screens/EditDebtScreen'; // AJOUTER CET IMPORT

export type DebtStackParamList = {
  DebtsList: undefined;
  AddDebt: undefined;
  DebtDetail: { debtId: string };
  DebtAnalytics: undefined;
  DebtCalculator: undefined;
  EditDebt: { debtId: string }; // AJOUTER CETTE ROUTE
};

const Stack = createStackNavigator<DebtStackParamList>();

const DebtStackNavigator: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#FF6B6B',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        cardStyle: {
          backgroundColor: '#f8f9fa'
        }
      }}
    >
      <Stack.Screen 
        name="DebtsList" 
        component={DebtsScreen}
        options={{ 
          title: t.myDebts,
        }}
      />
      <Stack.Screen 
        name="AddDebt" 
        component={AddDebtScreen}
        options={{ 
          title: t.newDebt,
        }}
      />
      <Stack.Screen 
        name="DebtDetail" 
        component={DebtDetailScreen}
        options={({ route }) => ({ 
          title: t.debtDetails,
        })}
      />
      <Stack.Screen 
        name="EditDebt" 
        component={EditDebtScreen}
        options={{ 
          title: t.modifyDebt,
        }}
      />
      <Stack.Screen 
        name="DebtAnalytics" 
        component={DebtAnalyticsScreen}
        options={{ 
          title: t.debtAnalytics,
        }}
      />
      <Stack.Screen 
        name="DebtCalculator" 
        component={DebtCalculatorScreen}
        options={{ 
          title: t.debtCalculator,
        }}
      />
    </Stack.Navigator>
  );
};

export default DebtStackNavigator;