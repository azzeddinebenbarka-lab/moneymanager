import { useCallback, useState } from 'react';
import { ExportOptions, ExportResult, exportService } from '../services/exportService';

export const useExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [lastExport, setLastExport] = useState<ExportResult | null>(null);

  /**
   * Fonction principale d'export
   */
  const exportData = useCallback(async (options: ExportOptions): Promise<ExportResult> => {
    setIsExporting(true);
    setExportProgress(0);
    
    try {
      // Simulation de progression
      const progressInterval = setInterval(() => {
        setExportProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const result = await exportService.exportData(options);
      
      clearInterval(progressInterval);
      setExportProgress(100);
      setLastExport(result);

      // Reset progression après 2 secondes
      setTimeout(() => {
        setExportProgress(0);
        setIsExporting(false);
      }, 2000);

      return result;
    } catch (error) {
      setIsExporting(false);
      setExportProgress(0);
      throw error;
    }
  }, []);

  /**
   * Export rapide des transactions
   */
  const exportTransactions = useCallback(async (
    startDate?: string, 
    endDate?: string, 
    format: 'csv' | 'json' = 'csv'
  ) => {
    return exportData({
      format,
      dataTypes: ['transactions'],
      dateRange: startDate && endDate ? { startDate, endDate } : undefined
    });
  }, [exportData]);

  /**
   * Export complet
   */
  const exportFullBackup = useCallback(async (format: 'csv' | 'json' = 'json') => {
    return exportData({
      format,
      dataTypes: ['transactions', 'accounts', 'budgets', 'categories']
    });
  }, [exportData]);

  /**
   * Réinitialiser l'état d'export
   */
  const resetExport = useCallback(() => {
    setLastExport(null);
    setExportProgress(0);
  }, []);

  return {
    // États
    isExporting,
    exportProgress,
    lastExport,
    
    // Actions
    exportData,
    exportTransactions,
    exportFullBackup,
    resetExport
  };
};