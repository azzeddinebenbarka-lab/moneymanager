// src/components/layout/ModernDrawerContent.tsx - VERSION COMPLÈTEMENT CORRIGÉE
import { Ionicons } from '@expo/vector-icons';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const ModernDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  // Structure COMPLÈTE avec tous les écrans fonctionnels
  const menuSections = [
    {
      title: 'TABLEAU DE BORD',
      items: [
        {
          label: 'Tableau de Bord',
          icon: 'speedometer' as const,
          screen: 'Dashboard',
        },
      ],
    },
    {
      title: 'GESTION DES TRANSACTIONS',
      items: [
        {
          label: 'Transactions',
          icon: 'swap-horizontal' as const,
          screen: 'Transactions',
        },
        {
          label: 'Transactions Récurrentes',
          icon: 'repeat' as const,
          screen: 'RecurringTransactions',
        },
        {
          label: 'Nouvelle Transaction',
          icon: 'add-circle' as const,
          screen: 'AddTransaction',
        },
        {
          label: 'Nouvelle Transaction Récurente',
          icon: 'add-circle' as const,
          screen: 'AddRecurringTransaction',
        },
      ],
    },
    {
      title: 'COMPTES ET BUDGETS',
      items: [
        {
          label: 'Comptes',
          icon: 'wallet' as const,
          screen: 'Accounts',
        },
        {
          label: 'Budgets',
          icon: 'pie-chart' as const,
          screen: 'Budgets',
        },
        {
          label: 'Catégories',
          icon: 'pricetags' as const,
          screen: 'Categories',
        },
        {
          label: 'Charges Annuelles',
          icon: 'calendar' as const,
          screen: 'AnnualCharges',
        },
      ],
    },
    {
      title: 'ÉPARGNE ET DETTES',
      items: [
        {
          label: 'Épargne & Objectifs',
          icon: 'trending-up' as const,
          screen: 'Savings',
        },
        {
          label: 'Gestion des Dettes',
          icon: 'trending-down' as const,
          screen: 'Debts',
        },
      ],
    },
    {
      title: 'ANALYTICS ET RAPPORTS',
      items: [
        {
          label: 'Analytics & Rapports',
          icon: 'bar-chart' as const,
          screen: 'AnalyticsDashboard', // ✅ CORRECTION : Utiliser le bon nom d'écran
        },
        {
          label: 'Vue par Mois',
          icon: 'calendar' as const,
          screen: 'MonthsOverview',
        },
        {
          label: 'Analyse par Catégorie',
          icon: 'pricetags' as const,
          screen: 'CategoryAnalysis',
        },
      ],
    },
    {
      title: 'ALERTES',
      items: [
        {
          label: 'Alertes & Notifications',
          icon: 'notifications' as const,
          screen: 'Alerts',
        },
      ],
    },
    {
      title: 'PARAMÈTRES',
      items: [
        {
          label: 'Paramètres',
          icon: 'settings' as const,
          screen: 'Settings',
        },
        {
          label: 'Devises', // ✅ MAINTENANT FONCTIONNEL
          icon: 'cash' as const,
          screen: 'CurrencySettings',
        },
        {
          label: 'Mon Profil',
          icon: 'person' as const,
          screen: 'Profile',
        },
      ],
    },
  ];

  // Fonction de navigation SÉCURISÉE et FONCTIONNELLE
  const handleNavigation = (screen: string) => {
    console.log(`🎯 Navigation vers: ${screen}`);
    
    try {
      // Vérifier si l'écran existe
      const routeExists = props.navigation.getState().routeNames.includes(screen);
      
      if (routeExists) {
        props.navigation.navigate(screen as any);
        console.log(`✅ Navigation réussie vers: ${screen}`);
      } else {
        console.warn(`⚠️ L'écran ${screen} n'existe pas dans la navigation`);
        console.log('📋 Routes disponibles:', props.navigation.getState().routeNames);
        // Navigation de secours vers Dashboard
        props.navigation.navigate('Dashboard' as any);
      }
    } catch (error) {
      console.error('❌ Erreur de navigation:', error);
      // Fallback garanti
      props.navigation.navigate('Dashboard' as any);
    }
  };

  // Détection de l'écran actif AMÉLIORÉE
  const isScreenActive = (screenName: string) => {
    try {
      const currentRoute = props.state.routes[props.state.index];
      
      // Vérifier les routes imbriquées dans les stacks
      if (currentRoute.state) {
        const nestedRoutes = currentRoute.state.routes;
        const currentNestedRoute = nestedRoutes[nestedRoutes.length - 1];
        return currentNestedRoute.name === screenName;
      }
      
      return currentRoute.name === screenName;
    } catch (error) {
      return false;
    }
  };

  return (
    <View style={[
      styles.container, 
      isDark && styles.darkContainer
    ]}>
      
      {/* HEADER PROFESSIONNEL */}
      <View style={[
        styles.header, 
        isDark && styles.darkHeader
      ]}>
        <View style={styles.avatar}>
          <Ionicons name="cash" size={36} color="#FFFFFF" />
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>MoneyManager</Text>
          <Text style={styles.userEmail}>Gestion Financière</Text>
        </View>
      </View>

      {/* MENU PRINCIPAL */}
      <ScrollView 
        style={styles.menuContainer}
        showsVerticalScrollIndicator={false}
      >
        {menuSections.map((section, sectionIndex) => (
          <View key={section.title} style={styles.section}>
            <Text style={[
              styles.sectionTitle,
              isDark && styles.darkSectionTitle
            ]}>
              {section.title}
            </Text>
            
            <View style={styles.sectionItems}>
              {section.items.map((item) => {
                const isActive = isScreenActive(item.screen);
                return (
                  <TouchableOpacity
                    key={item.screen}
                    style={[
                      styles.menuItem,
                      isActive && styles.activeMenuItem,
                      isDark && styles.darkMenuItem,
                    ]}
                    onPress={() => handleNavigation(item.screen)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.menuItemLeft}>
                      <View style={[
                        styles.iconWrapper,
                        isActive && styles.activeIconWrapper,
                        isDark && styles.darkIconWrapper
                      ]}>
                        <Ionicons 
                          name={item.icon} 
                          size={20} 
                          color={
                            isActive ? '#007AFF' : (isDark ? '#FFFFFF' : '#000000')
                          } 
                        />
                      </View>
                      <Text style={[
                        styles.menuItemText,
                        isDark && styles.darkMenuItemText,
                        isActive && styles.activeMenuText,
                      ]}>
                        {item.label}
                      </Text>
                    </View>
                    
                    {isActive && (
                      <View style={styles.activeIndicator}>
                        <Ionicons name="chevron-forward" size={16} color="#007AFF" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {sectionIndex < menuSections.length - 1 && (
              <View style={[
                styles.sectionSeparator,
                isDark && styles.darkSectionSeparator
              ]} />
            )}
          </View>
        ))}
      </ScrollView>

      {/* FOOTER */}
      <View style={[
        styles.footer,
        isDark && styles.darkFooter
      ]}>
        <TouchableOpacity 
          style={[
            styles.footerButton,
            isDark && styles.darkFooterButton
          ]}
          onPress={toggleTheme}
          activeOpacity={0.7}
        >
          <View style={[
            styles.themeIcon,
            isDark && styles.darkThemeIcon
          ]}>
            <Ionicons 
              name={isDark ? 'sunny' : 'moon'} 
              size={20} 
              color={isDark ? '#FFD60A' : '#007AFF'} 
            />
          </View>
          <Text style={[
            styles.footerButtonText,
            isDark && styles.darkFooterButtonText,
          ]}>
            {isDark ? 'Mode Clair' : 'Mode Sombre'}
          </Text>
        </TouchableOpacity>

        {/* Statistiques rapides */}
        <View style={[
          styles.statsContainer,
          isDark && styles.darkStatsContainer
        ]}>
          <View style={styles.statItem}>
            <Ionicons name="checkmark-done" size={16} color="#34C759" />
            <Text style={[
              styles.statText,
              isDark && styles.darkStatText
            ]}>Menu Fonctionnel</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  darkContainer: {
    backgroundColor: '#1C1C1E',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 24,
    paddingTop: 60,
    alignItems: 'center',
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  darkHeader: {
    backgroundColor: '#0A84FF',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 2,
  },
  versionText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    fontStyle: 'italic',
  },
  menuContainer: {
    flex: 1,
    paddingHorizontal: 8,
  },
  section: {
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#666666',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginLeft: 16,
    marginBottom: 8,
    marginTop: 20,
  },
  darkSectionTitle: {
    color: '#8E8E93',
  },
  sectionItems: {
    paddingHorizontal: 8,
  },
  sectionSeparator: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 16,
    marginVertical: 16,
  },
  darkSectionSeparator: {
    backgroundColor: '#38383A',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 4,
  },
  darkMenuItem: {
    // Style spécifique sombre
  },
  activeMenuItem: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activeIconWrapper: {
    backgroundColor: 'rgba(0, 122, 255, 0.2)',
  },
  darkIconWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    flex: 1,
  },
  darkMenuItemText: {
    color: '#FFFFFF',
  },
  activeMenuText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  activeIndicator: {
    padding: 4,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    backgroundColor: '#F8F8F8',
  },
  darkFooter: {
    borderTopColor: '#38383A',
    backgroundColor: '#2C2C2E',
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  darkFooterButton: {
    backgroundColor: '#3A3A3C',
  },
  themeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  darkThemeIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  footerButtonText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
    color: '#000000',
  },
  darkFooterButtonText: {
    color: '#FFFFFF',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  darkStatsContainer: {
    backgroundColor: '#3A3A3C',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 6,
    fontWeight: '500',
  },
  darkStatText: {
    color: '#8E8E93',
  },
});

export default ModernDrawerContent;