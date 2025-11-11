// src/components/SafeAreaView.tsx - VERSION COMPLÈTEMENT CORRIGÉE
import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SafeAreaViewProps extends ViewProps {
  children: React.ReactNode;
  /**
   * Désactive le padding safe area
   */
  disableSafeArea?: boolean;
  /**
   * Désactive uniquement le padding top
   */
  disableTop?: boolean;
  /**
   * Désactive uniquement le padding bottom
   */
  disableBottom?: boolean;
  /**
   * Désactive uniquement le padding left/right
   */
  disableSides?: boolean;
}

/**
 * Composant SafeAreaView moderne utilisant react-native-safe-area-context
 * Remplace l'ancien SafeAreaView déprécié de React Native
 */
export const SafeAreaView: React.FC<SafeAreaViewProps> = ({ 
  children, 
  style,
  disableSafeArea = false,
  disableTop = false,
  disableBottom = false,
  disableSides = false,
  ...props 
}) => {
  const insets = useSafeAreaInsets();

  // Si safe area est désactivé, retourner un View normal
  if (disableSafeArea) {
    return (
      <View style={[styles.container, style]} {...props}>
        {children}
      </View>
    );
  }

  const paddingStyles = {
    paddingTop: disableTop ? 0 : insets.top,
    paddingBottom: disableBottom ? 0 : insets.bottom,
    paddingLeft: disableSides ? 0 : insets.left,
    paddingRight: disableSides ? 0 : insets.right,
  };

  return (
    <View
      style={[
        styles.container,
        paddingStyles,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SafeAreaView;