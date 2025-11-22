// src/screens/HealthDetailScreen.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLanguage } from '../context/LanguageContext';

export const HealthDetailScreen = () => {
  const { t } = useLanguage();

  return (
    <View style={styles.container}>
      <Text>Health Detail Screen - À implémenter</Text>
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