// components/ui/SearchBar.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  value, 
  onChangeText, 
  placeholder = "Rechercher..." 
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
      <Ionicons name="search" size={20} color={isDark ? '#888' : '#666'} />
      <TextInput
        style={[styles.input, isDark && styles.darkInput]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={isDark ? '#666' : '#999'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  darkContainer: {
    backgroundColor: '#2c2c2e',
    borderColor: '#38383a',
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#000',
    padding: 0,
  },
  darkInput: {
    color: '#fff',
  },
});

export default SearchBar;