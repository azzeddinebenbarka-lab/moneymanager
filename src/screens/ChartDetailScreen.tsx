// src/screens/ChartDetailScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLanguage } from '../context/LanguageContext';

export const ChartDetailScreen = () => {
  const { t } = useLanguage();

  return (
    <View style={styles.container}>
      <Text>Chart Detail Screen - À implémenter</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});