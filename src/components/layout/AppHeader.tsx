// src/components/layout/AppHeader.tsx
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface AppHeaderProps {
  title: string;
  showBackButton?: boolean;
  rightComponent?: React.ReactNode;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ 
  title, 
  showBackButton = false,
  rightComponent 
}) => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const isDark = theme === 'dark';

  const handleBurgerPress = () => {
    (navigation as any).openDrawer();
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={[
      styles.header, 
      { 
        backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
        borderBottomColor: isDark ? '#2C2C2E' : '#E5E5EA'
      }
    ]}>
      {/* Bouton gauche (Burger ou Back) */}
      <TouchableOpacity
        onPress={showBackButton ? handleBackPress : handleBurgerPress}
        style={styles.iconButton}
        activeOpacity={0.7}
      >
        <Ionicons
          name={showBackButton ? 'arrow-back' : 'menu'}
          size={24}
          color={isDark ? '#FFFFFF' : '#000000'}
        />
      </TouchableOpacity>

      {/* Titre */}
      <Text style={[
        styles.title,
        { color: isDark ? '#FFFFFF' : '#000000' }
      ]}>
        {title}
      </Text>

      {/* Composant droit ou espace vide */}
      <View style={styles.rightContainer}>
        {rightComponent || <View style={styles.iconButton} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  rightContainer: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
