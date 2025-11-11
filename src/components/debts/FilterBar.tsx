// /src/components/debts/FilterBar.tsx
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  currentFilter: 'all' | 'active' | 'paid' | 'overdue';
  onFilterChange: (filter: 'all' | 'active' | 'paid' | 'overdue') => void;
}

const filters = [
  { key: 'all' as const, label: 'Toutes' },
  { key: 'active' as const, label: 'Actives' },
  { key: 'overdue' as const, label: 'Retard' },
  { key: 'paid' as const, label: 'Payées' },
];

export const FilterBar = ({ currentFilter, onFilterChange }: Props) => {
  return (
    <View style={styles.container}>
      {filters.map((filter) => (
        <TouchableOpacity
          key={filter.key}
          style={[
            styles.filterButton,
            currentFilter === filter.key && styles.activeFilter
          ]}
          onPress={() => onFilterChange(filter.key)}
        >
          <Text style={[
            styles.filterText,
            currentFilter === filter.key && styles.activeFilterText
          ]}>
            {filter.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#f8f9fa',
  },
  activeFilter: {
    backgroundColor: '#3498db',
  },
  filterText: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#fff',
  },
});