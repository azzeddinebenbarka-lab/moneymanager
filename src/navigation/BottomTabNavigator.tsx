// src/navigation/BottomTabNavigator.tsx
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useRef, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

// Import des écrans
import DashboardScreen from '../screens/DashboardScreen';
import FinancialCalendarScreen from '../screens/FinancialCalendarScreen';
import SearchScreen from '../screens/SearchScreen';
import SettingsScreen from '../screens/SettingsScreen';

// Import des écrans d'ajout
import AddAnnualChargeScreen from '../screens/AddAnnualChargeScreen';
import AddTransactionScreen from '../screens/AddTransactionScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Composant Modal pour le menu d'ajout
const AddMenuModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  navigation: any;
}> = ({ visible, onClose, navigation }) => {
  const { isDark } = useTheme();

  const menuItems = [
    {
      title: 'Transaction',
      icon: 'swap-horizontal',
      iconType: 'ionicons',
      color: '#10b981',
      onPress: () => {
        onClose();
        navigation.navigate('AddTransaction');
      },
    },
    {
      title: 'Dette',
      icon: 'hand-coin',
      iconType: 'material',
      color: '#ef4444',
      onPress: () => {
        onClose();
        // Naviguer vers le drawer parent puis vers l'écran Debts
        const parent = navigation.getParent();
        if (parent) {
          parent.navigate('Debts', { screen: 'AddDebt' });
        }
      },
    },
    {
      title: 'Épargne',
      icon: 'piggy-bank',
      iconType: 'material',
      color: '#8b5cf6',
      onPress: () => {
        onClose();
        // Naviguer vers le drawer parent puis vers l'écran Savings
        const parent = navigation.getParent();
        if (parent) {
          parent.navigate('Savings', { screen: 'AddSavings' });
        }
      },
    },
    {
      title: 'Charge Annuelle',
      icon: 'calendar-check',
      iconType: 'material',
      color: '#f59e0b',
      onPress: () => {
        onClose();
        navigation.navigate('AddAnnualCharge');
      },
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={[styles.modalContent, isDark && styles.modalContentDark]}>
          <Text style={[styles.modalTitle, isDark && styles.modalTitleDark]}>
            Ajouter
          </Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, isDark && styles.menuItemDark]}
              onPress={item.onPress}
            >
              {item.iconType === 'ionicons' ? (
                <Ionicons name={item.icon as any} size={24} color={item.color} />
              ) : (
                <MaterialCommunityIcons name={item.icon as any} size={24} color={item.color} />
              )}
              <Text style={[styles.menuItemText, isDark && styles.menuItemTextDark]}>
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

// Composant personnalisé pour le bouton d'ajout
const AddButton: React.FC<{ onPress: () => void }> = ({ onPress }) => (
  <TouchableOpacity style={styles.addButton} onPress={onPress}>
    <Ionicons name="add" size={32} color="#fff" />
  </TouchableOpacity>
);

// Wrappers pour les stacks avec navigation
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Dashboard" component={DashboardScreen} />
    <Stack.Screen name="AddTransaction" component={AddTransactionScreen} />
    <Stack.Screen name="AddAnnualCharge" component={AddAnnualChargeScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
  </Stack.Navigator>
);

export default function BottomTabNavigator() {
  const { isDark } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const navigationRef = useRef<any>(null);

  return (
    <>
      <Tab.Navigator
        screenOptions={({ navigation: nav }) => {
          // Stocker la navigation pour le modal avec useRef au lieu de useState
          navigationRef.current = nav;
          
          return {
            headerShown: false,
            tabBarStyle: [
              styles.tabBar,
              isDark && styles.tabBarDark,
            ],
            tabBarActiveTintColor: '#0ea5e9',
            tabBarInactiveTintColor: isDark ? '#71717a' : '#94a3b8',
            tabBarLabelStyle: styles.tabBarLabel,
          };
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
            tabBarLabel: () => null,
          }}
        />

        <Tab.Screen
          name="Calendar"
          component={FinancialCalendarScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="calendar" size={size} color={color} />
            ),
            tabBarLabel: () => null,
          }}
        />

        <Tab.Screen
          name="Add"
          component={HomeStack}
          options={{
            tabBarIcon: () => <AddButton onPress={() => setModalVisible(true)} />,
            tabBarLabel: '',
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              setModalVisible(true);
            },
          }}
        />

        <Tab.Screen
          name="Search"
          component={SearchScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="search" size={size} color={color} />
            ),
            tabBarLabel: () => null,
          }}
        />

        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings-outline" size={size} color={color} />
            ),
            tabBarLabel: () => null,
          }}
        />
      </Tab.Navigator>

      {navigationRef.current && (
        <AddMenuModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          navigation={navigationRef.current}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabBarDark: {
    backgroundColor: '#1C1C1E',
    borderTopColor: '#2C2C2E',
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0ea5e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -20,
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    width: '85%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalContentDark: {
    backgroundColor: '#1C1C1E',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalTitleDark: {
    color: '#ffffff',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    marginBottom: 12,
  },
  menuItemDark: {
    backgroundColor: '#2C2C2E',
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginLeft: 16,
  },
  menuItemTextDark: {
    color: '#ffffff',
  },
});
