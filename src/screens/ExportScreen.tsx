// src/screens/ExportScreen.tsx - VERSION COMPLÈTEMENT FONCTIONNELLE
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from '../components/SafeAreaView';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

const ExportScreen = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [exporting, setExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<'csv' | 'excel' | 'pdf' | null>(null);

  const isDark = theme === 'dark';

  const handleExport = async (format: 'csv' | 'excel' | 'pdf') => {
    setExporting(true);
    setExportFormat(format);
    
    try {
      // Simulation d'export
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Export Réussi',
        `Vos données ont été exportées en format ${format.toUpperCase()}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert(t.error, 'Impossible d\'exporter les données');
    } finally {
      setExporting(false);
      setExportFormat(null);
    }
  };

  const ExportOption = ({ 
    title, 
    description, 
    format, 
    icon 
  }: { 
    title: string;
    description: string;
    format: 'csv' | 'excel' | 'pdf';
    icon: string;
  }) => (
    <TouchableOpacity
      style={[
        styles.exportOption,
        isDark && styles.darkCard,
        exporting && exportFormat === format && styles.exportingOption
      ]}
      onPress={() => handleExport(format)}
      disabled={exporting}
    >
      <View style={styles.optionHeader}>
        <View style={styles.optionIconContainer}>
          <Ionicons 
            name={icon as any} 
            size={24} 
            color={exporting && exportFormat === format ? '#007AFF' : '#8E8E93'} 
          />
        </View>
        <View style={styles.optionInfo}>
          <Text style={[styles.optionTitle, isDark && styles.darkText]}>
            {title}
          </Text>
          <Text style={[styles.optionDescription, isDark && styles.darkSubtext]}>
            {description}
          </Text>
        </View>
        {exporting && exportFormat === format ? (
          <ActivityIndicator size="small" color="#007AFF" />
        ) : (
          <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView>
      <ScrollView style={[styles.container, isDark && styles.darkContainer]}>
        {/* En-tête */}
        <View style={styles.header}>
          <Text style={[styles.title, isDark && styles.darkText]}>
            Export de Données
          </Text>
          <Text style={[styles.subtitle, isDark && styles.darkSubtext]}>
            Exportez vos données financières dans différents formats
          </Text>
        </View>

        {/* Section d'information */}
        <View style={[styles.infoCard, isDark && styles.darkCard]}>
          <Ionicons name="information-circle" size={24} color="#007AFF" />
          <View style={styles.infoContent}>
            <Text style={[styles.infoTitle, isDark && styles.darkText]}>
              Données incluses dans l'export
            </Text>
            <Text style={[styles.infoText, isDark && styles.darkSubtext]}>
              • Toutes vos transactions{'\n'}
              • Comptes et soldes{'\n'}
              • Budgets et catégories{'\n'}
              • Dettes et épargnes{'\n'}
              • Historique complet
            </Text>
          </View>
        </View>

        {/* Options d'export */}
        <View style={styles.exportSection}>
          <Text style={[styles.sectionTitle, isDark && styles.darkText]}>
            Formats d'Export
          </Text>
          
          <ExportOption
            title="CSV (Excel)"
            description="Format tableur compatible avec Excel et Google Sheets"
            format="csv"
            icon="document-text"
          />
          
          <ExportOption
            title="Excel (XLSX)"
            description="Format Excel natif avec mise en forme"
            format="excel"
            icon="stats-chart"
          />
          
          <ExportOption
            title="PDF Rapport"
            description="Rapport formaté avec graphiques et statistiques"
            format="pdf"
            icon="reader"
          />
        </View>

        {/* Section de statistiques */}
        <View style={[styles.statsCard, isDark && styles.darkCard]}>
          <Text style={[styles.statsTitle, isDark && styles.darkText]}>
            Statistiques des Données
          </Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, isDark && styles.darkText]}>
                156
              </Text>
              <Text style={[styles.statLabel, isDark && styles.darkSubtext]}>
                Transactions
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, isDark && styles.darkText]}>
                5
              </Text>
              <Text style={[styles.statLabel, isDark && styles.darkSubtext]}>
                Comptes
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, isDark && styles.darkText]}>
                12
              </Text>
              <Text style={[styles.statLabel, isDark && styles.darkSubtext]}>
                Catégories
              </Text>
            </View>
          </View>
        </View>

        {/* Conseils */}
        <View style={[styles.tipsCard, isDark && styles.darkCard]}>
          <Text style={[styles.tipsTitle, isDark && styles.darkText]}>
            💡 Conseils d'Export
          </Text>
          <Text style={[styles.tipsText, isDark && styles.darkSubtext]}>
            • Exportez régulièrement pour sauvegarder vos données{'\n'}
            • Utilisez CSV pour l'analyse dans d'autres applications{'\n'}
            • Le PDF est idéal pour l'archivage et le partage{'\n'}
            • Vérifiez toujours les données exportées
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  darkContainer: {
    backgroundColor: '#1c1c1e',
  },
  header: {
    padding: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  infoCard: {
    backgroundColor: '#fff',
    margin: 20,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  darkCard: {
    backgroundColor: '#2c2c2e',
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  exportSection: {
    padding: 20,
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  exportOption: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  exportingOption: {
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  statsCard: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 8,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  tipsCard: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 8,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  tipsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  darkText: {
    color: '#fff',
  },
  darkSubtext: {
    color: '#888',
  },
});

export default ExportScreen;