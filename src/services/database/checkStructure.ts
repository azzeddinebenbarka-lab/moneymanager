// src/services/database/checkStructure.ts
import { getDatabase } from './sqlite';

interface TableColumn {
  cid: number;
  name: string;
  type: string;
  notnull: number;
  dflt_value: string | null;
  pk: number;
}

export const checkTableStructure = async (tableName: string): Promise<TableColumn[]> => {
  try {
    const db = await getDatabase(); 
    
    console.log(`🔍 [STRUCTURE] Checking structure of table: ${tableName}`);
    
    const structure = await db.getAllAsync(`PRAGMA table_info(${tableName})`) as TableColumn[];
    console.log(`📋 [STRUCTURE] ${tableName} structure:`, structure.map(col => ({
      name: col.name,
      type: col.type,
      notnull: col.notnull,
      pk: col.pk
    })));
    
    return structure;
  } catch (error) {
    console.error(`❌ [STRUCTURE] Error checking table ${tableName}:`, error);
    throw error;
  }
};

export const checkAllStructures = async (): Promise<void> => {
  try {
    console.log('🔄 [STRUCTURE] Checking all table structures...');
    
    const tables = ['accounts', 'categories', 'transactions', 'budgets', 'alerts', 'recurring_transactions'];
    
    for (const table of tables) {
      await checkTableStructure(table);
    }
    
    console.log('✅ [STRUCTURE] All table structures checked successfully');
  } catch (error) {
    console.error('❌ [STRUCTURE] Error checking structures:', error);
    throw error;
  }
};

export const verifyTableStructure = async (tableName: string, requiredColumns: string[]): Promise<boolean> => {
  try {
    console.log(`🔍 [STRUCTURE] Verifying ${tableName} table...`);
    
    const structure = await checkTableStructure(tableName);
    const existingColumns = structure.map(col => col.name);
    
    console.log('📊 [STRUCTURE] Required columns:', requiredColumns);
    console.log('📊 [STRUCTURE] Existing columns:', existingColumns);
    
    const missingColumns = requiredColumns.filter(col => !existingColumns.includes(col));
    
    if (missingColumns.length > 0) {
      console.error(`❌ [STRUCTURE] Missing columns in ${tableName} table:`, missingColumns);
      return false;
    }
    
    console.log(`✅ [STRUCTURE] ${tableName} table has all required columns`);
    return true;
  } catch (error) {
    console.error(`❌ [STRUCTURE] Error verifying ${tableName} table:`, error);
    return false;
  }
};

export const verifyAccountsTable = async (): Promise<boolean> => {
  return await verifyTableStructure('accounts', [
    'id', 'name', 'type', 'balance', 'currency', 'color', 'created_at'
  ]);
};

export const verifyCategoriesTable = async (): Promise<boolean> => {
  return await verifyTableStructure('categories', [
    'id', 'name', 'type', 'icon', 'color', 'created_at'
  ]);
};

export const verifyTransactionsTable = async (): Promise<boolean> => {
  return await verifyTableStructure('transactions', [
    'id', 'amount', 'type', 'category', 'account_id', 'description', 'date', 'created_at'
  ]);
};

export const verifyBudgetsTable = async (): Promise<boolean> => {
  return await verifyTableStructure('budgets', [
    'id', 'name', 'category', 'amount', 'spent', 'period', 'start_date', 'end_date', 'is_active', 'created_at'
  ]);
};

export const repairTableIfNeeded = async (tableName: string): Promise<void> => {
  try {
    console.log(`🛠️ [STRUCTURE] Checking if ${tableName} needs repair...`);
    
    let needsRepair = false;
    
    if (tableName === 'accounts') {
      needsRepair = !(await verifyAccountsTable());
    } else if (tableName === 'categories') {
      needsRepair = !(await verifyCategoriesTable());
    } else if (tableName === 'transactions') {
      needsRepair = !(await verifyTransactionsTable());
    } else if (tableName === 'budgets') {
      needsRepair = !(await verifyBudgetsTable());
    }
    
    if (needsRepair) {
      console.log(`🔧 [STRUCTURE] ${tableName} needs repair`);
      // La réparation sera gérée par repairDatabase.ts
    } else {
      console.log(`✅ [STRUCTURE] ${tableName} table structure is correct`);
    }
  } catch (error) {
    console.error(`❌ [STRUCTURE] Error repairing table ${tableName}:`, error);
    throw error;
  }
};

export const checkDatabaseIntegrity = async (): Promise<boolean> => {
  try {
    const db = await getDatabase();
    
    console.log('🔍 [STRUCTURE] Checking database integrity...');
    
    const integrityResult = await db.getFirstAsync('PRAGMA integrity_check');
    const integrityCheck = integrityResult as { integrity_check: string };
    
    console.log('📊 [STRUCTURE] Integrity check result:', integrityCheck);
    
    const isOk = integrityCheck.integrity_check === 'ok';
    
    if (isOk) {
      console.log('✅ [STRUCTURE] Database integrity: OK');
    } else {
      console.error('❌ [STRUCTURE] Database integrity: FAILED');
    }
    
    return isOk;
  } catch (error) {
    console.error('❌ [STRUCTURE] Error checking database integrity:', error);
    return false;
  }
};

export const getTableRowCounts = async (): Promise<Record<string, number>> => {
  try {
    const db = await getDatabase();
    
    console.log('🔍 [STRUCTURE] Getting table row counts...');
    
    const tables = ['accounts', 'categories', 'transactions', 'budgets', 'alerts', 'recurring_transactions'];
    const counts: Record<string, number> = {};
    
    for (const table of tables) {
      try {
        const result = await db.getFirstAsync(`SELECT COUNT(*) as count FROM ${table}`) as { count: number };
        counts[table] = result.count;
        console.log(`📊 [STRUCTURE] ${table}: ${result.count} rows`);
      } catch (error) {
        console.warn(`⚠️ [STRUCTURE] Could not count rows for ${table}:`, error);
        counts[table] = 0;
      }
    }
    
    return counts;
  } catch (error) {
    console.error('❌ [STRUCTURE] Error getting row counts:', error);
    return {};
  }
};

// Fonction principale pour diagnostiquer tous les problèmes
export const fullDatabaseDiagnostic = async (): Promise<{
  integrity: boolean;
  structures: Record<string, boolean>;
  rowCounts: Record<string, number>;
}> => {
  try {
    console.log('🩺 [STRUCTURE] Starting full database diagnostic...');
    
    // 1. Vérifier l'intégrité
    const integrity = await checkDatabaseIntegrity();
    
    // 2. Vérifier toutes les structures
    const structures = {
      accounts: await verifyAccountsTable(),
      categories: await verifyCategoriesTable(),
      transactions: await verifyTransactionsTable(),
      budgets: await verifyBudgetsTable(),
      alerts: await verifyTableStructure('alerts', ['id', 'type', 'title', 'message', 'priority', 'is_read', 'data', 'action_url', 'created_at']),
      recurring_transactions: await verifyTableStructure('recurring_transactions', ['id', 'description', 'amount', 'type', 'category', 'account_id', 'frequency', 'start_date', 'end_date', 'last_processed', 'is_active', 'created_at'])
    };
    
    // 3. Compter les lignes
    const rowCounts = await getTableRowCounts();
    
    console.log('🎉 [STRUCTURE] Full diagnostic completed');
    
    return {
      integrity,
      structures,
      rowCounts
    };
  } catch (error) {
    console.error('❌ [STRUCTURE] Error during full diagnostic:', error);
    throw error;
  }
};

// Exporter les types pour une utilisation externe
export type { TableColumn };
