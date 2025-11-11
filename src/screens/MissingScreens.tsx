// src/screens/MissingScreens.tsx - TOUS LES ÉCRANS MANQUANTS
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from '../components/SafeAreaView';

// Composant générique pour tous les écrans manquants
const GenericScreen = ({ route, navigation }: any) => {
  const title = route?.params?.title || "Écran en développement";
  const description = route?.params?.description || "Cette fonctionnalité est en cours de développement";

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Retour</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#000',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    color: '#666',
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

// Exports individuels pour chaque écran manquant
export const CategoryAnalysisScreen = (props: any) => (
  <GenericScreen {...props} route={{ 
    params: { 
      title: "Analyse par Catégorie",
      description: "Analyse détaillée de vos dépenses et revenus par catégorie"
    } 
  }} />
);

export const HealthDetailScreen = (props: any) => (
  <GenericScreen {...props} route={{ 
    params: { 
      title: "Santé Financière",
      description: "Vue d'ensemble de votre santé financière et recommandations"
    } 
  }} />
);

export const ProfileScreen = (props: any) => (
  <GenericScreen {...props} route={{ 
    params: { 
      title: "Profil Utilisateur",
      description: "Gérez vos informations personnelles et préférences"
    } 
  }} />
);

export const CurrencySettingsScreen = (props: any) => (
  <GenericScreen {...props} route={{ 
    params: { 
      title: "Paramètres de Devise",
      description: "Configurez votre devise principale et les taux de change"
    } 
  }} />
);

export const CategoriesScreen = (props: any) => (
  <GenericScreen {...props} route={{ 
    params: { 
      title: "Gestion des Catégories",
      description: "Créez et modifiez vos catégories de dépenses et revenus"
    } 
  }} />
);

export const DebtAnalyticsScreen = (props: any) => (
  <GenericScreen {...props} route={{ 
    params: { 
      title: "Analyses des Dettes",
      description: "Analyse détaillée de vos dettes et plan de remboursement"
    } 
  }} />
);

export const DebtCalculatorScreen = (props: any) => (
  <GenericScreen {...props} route={{ 
    params: { 
      title: "Calculateur de Dette",
      description: "Simulez différents scénarios de remboursement"
    } 
  }} />
);

export const MonthlyTrendsScreen = (props: any) => (
  <GenericScreen {...props} route={{ 
    params: { 
      title: "Tendances Mensuelles",
      description: "Évolution de vos finances sur plusieurs mois"
    } 
  }} />
);

export const NetWorthScreen = (props: any) => (
  <GenericScreen {...props} route={{ 
    params: { 
      title: "Patrimoine Net",
      description: "Suivi de votre patrimoine et évolution dans le temps"
    } 
  }} />
);

export const ReportsScreen = (props: any) => (
  <GenericScreen {...props} route={{ 
    params: { 
      title: "Rapports et Analyses",
      description: "Rapports détaillés et analyses de vos finances"
    } 
  }} />
);

export const ExportScreen = (props: any) => (
  <GenericScreen {...props} route={{ 
    params: { 
      title: "Export de Données",
      description: "Exportez vos données financières dans différents formats"
    } 
  }} />
);

export const BackupScreen = (props: any) => (
  <GenericScreen {...props} route={{ 
    params: { 
      title: "Sauvegarde et Restauration",
      description: "Sauvegardez et restaurez vos données financières"
    } 
  }} />
);

export const PremiumScreen = (props: any) => (
  <GenericScreen {...props} route={{ 
    params: { 
      title: "Fonctionnalités Premium",
      description: "Découvrez les fonctionnalités avancées de MoneyManager"
    } 
  }} />
);

export const AuthScreen = (props: any) => (
  <GenericScreen {...props} route={{ 
    params: { 
      title: "Sécurité et Authentification",
      description: "Paramètres de sécurité et authentification"
    } 
  }} />
);

export const AnnualChargesScreen = (props: any) => (
  <GenericScreen {...props} route={{ 
    params: { 
      title: "Charges Annuelles",
      description: "Gestion de vos charges et frais annuels"
    } 
  }} />
);

export const AddAnnualChargeScreen = (props: any) => (
  <GenericScreen {...props} route={{ 
    params: { 
      title: "Nouvelle Charge Annuelle",
      description: "Ajoutez une nouvelle charge annuelle à suivre"
    } 
  }} />
);

export const RecurringTransactionsScreen = (props: any) => (
  <GenericScreen {...props} route={{ 
    params: { 
      title: "Transactions Récurrentes",
      description: "Gestion de vos transactions automatiques et récurrentes"
    } 
  }} />
);

export const AddRecurringTransactionScreen = (props: any) => (
  <GenericScreen {...props} route={{ 
    params: { 
      title: "Nouvelle Transaction Récurrente",
      description: "Créez une nouvelle transaction automatique"
    } 
  }} />
);

export const EditRecurringTransactionScreen = (props: any) => (
  <GenericScreen {...props} route={{ 
    params: { 
      title: "Modifier Transaction Récurrente",
      description: "Modifiez une transaction récurrente existante"
    } 
  }} />
);

export const BudgetReportsScreen = (props: any) => (
  <GenericScreen {...props} route={{ 
    params: { 
      title: "Rapports Budget",
      description: "Rapports détaillés sur l'utilisation de vos budgets"
    } 
  }} />
);

export default GenericScreen;