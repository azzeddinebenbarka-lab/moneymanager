// src/design/DesignSystemDemo.tsx
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useDesignSystem } from '../context/ThemeContext';

/**
 * Composant de démonstration pour visualiser le Design System
 * Utile pour le développement et les tests
 */
export const DesignSystemDemo: React.FC = () => {
  const { colors, spacing, typography, borders } = useDesignSystem();

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background.primary }]}
      contentContainerStyle={styles.content}
    >
      {/* Couleurs primaires */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
          Couleurs Primaires
        </Text>
        <View style={styles.colorGrid}>
          {Object.entries(colors.primary).map(([key, value]) => (
            <View key={key} style={styles.colorItem}>
              <View 
                style={[
                  styles.colorBox, 
                  { backgroundColor: value, borderColor: colors.border.primary }
                ]} 
              />
              <Text style={[styles.colorLabel, { color: colors.text.secondary }]}>
                {key}
              </Text>
              <Text style={[styles.colorValue, { color: colors.text.tertiary }]}>
                {value}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Couleurs sémantiques */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
          Couleurs Sémantiques
        </Text>
        <View style={styles.semanticGrid}>
          {Object.entries(colors.semantic).map(([key, value]) => (
            <View 
              key={key}
              style={[
                styles.semanticItem,
                { backgroundColor: value }
              ]}
            >
              <Text style={styles.semanticText}>
                {key}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Couleurs fonctionnelles */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
          Couleurs Fonctionnelles
        </Text>
        <View style={styles.semanticGrid}>
          {Object.entries(colors.functional).map(([key, value]) => (
            <View 
              key={key}
              style={[
                styles.semanticItem,
                { backgroundColor: value }
              ]}
            >
              <Text style={styles.semanticText}>
                {key}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Typographie */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
          Typographie
        </Text>
        {Object.entries(typography.fontSize).map(([key, value]) => (
          <Text 
            key={key}
            style={[
              styles.typeSample,
              { 
                fontSize: value,
                color: colors.text.primary,
                marginBottom: spacing[2],
              }
            ]}
          >
            {key} - {value}px - Exemple de texte
          </Text>
        ))}
      </View>

      {/* Espacements */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
          Espacements
        </Text>
        {Object.entries(spacing).slice(0, 10).map(([key, value]) => (
          <View key={key} style={styles.spacingItem}>
            <View 
              style={[
                styles.spacingVisual,
                { 
                  width: value,
                  backgroundColor: colors.primary[500],
                }
              ]} 
            />
            <Text style={[styles.spacingLabel, { color: colors.text.secondary }]}>
              {key} - {value}px
            </Text>
          </View>
        ))}
      </View>

      {/* Bordures */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
          Rayons de Bordure
        </Text>
        {Object.entries(borders.radius).map(([key, value]) => (
          <View key={key} style={styles.borderItem}>
            <View 
              style={[
                styles.borderVisual,
                { 
                  borderRadius: value,
                  borderWidth: borders.width.medium,
                  borderColor: colors.primary[500],
                  backgroundColor: colors.primary[50],
                }
              ]} 
            />
            <Text style={[styles.borderLabel, { color: colors.text.secondary }]}>
              {key} - {value}px
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorItem: {
    alignItems: 'center',
    width: 80,
  },
  colorBox: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 4,
  },
  colorLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },
  colorValue: {
    fontSize: 10,
  },
  semanticGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  semanticItem: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  semanticText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  typeSample: {
    fontWeight: '400',
  },
  spacingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  spacingVisual: {
    height: 8,
    borderRadius: 4,
  },
  spacingLabel: {
    fontSize: 14,
  },
  borderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  borderVisual: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  borderLabel: {
    fontSize: 14,
  },
});

export default DesignSystemDemo;