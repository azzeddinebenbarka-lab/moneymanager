// src/utils/emergencyAnnualChargesFix.ts - VERSION COMPLÈTEMENT CORRIGÉE
import { getDatabase } from '../services/database/sqlite';

export const emergencyAnnualChargesFix = async (): Promise<void> => {
  try {
    const db = await getDatabase();
    
    console.log('🛠️ [ANNUAL_CHARGES_FIX] Starting emergency fix for annual_charges table...');
    
    // Vérifier si la table existe
    const tableExists = await db.getFirstAsync(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='annual_charges'"
    );
    
    if (!tableExists) {
      console.log('🛠️ [ANNUAL_CHARGES_FIX] Table annual_charges does not exist, creating...');
      
      await db.execAsync(`
        CREATE TABLE annual_charges (
          id TEXT PRIMARY KEY NOT NULL,
          user_id TEXT NOT NULL,
          name TEXT NOT NULL,
          amount REAL NOT NULL DEFAULT 0,
          due_date TEXT NOT NULL,
          category TEXT NOT NULL,
          description TEXT,
          is_recurring INTEGER NOT NULL DEFAULT 0,
          is_active INTEGER NOT NULL DEFAULT 1,
          created_at TEXT NOT NULL,
          is_islamic INTEGER NOT NULL DEFAULT 0,
          islamic_holiday_id TEXT,
          arabic_name TEXT,
          type TEXT DEFAULT 'normal',
          is_paid INTEGER NOT NULL DEFAULT 0,
          paid_date TEXT,
          reminder_days INTEGER DEFAULT 7,
          account_id TEXT,
          auto_deduct INTEGER NOT NULL DEFAULT 0,
          payment_method TEXT,
          recurrence TEXT
        );
      `);
      
      console.log('✅ [ANNUAL_CHARGES_FIX] annual_charges table created successfully');
      return;
    }
    
    // Vérifier la structure de la table
    const tableInfo = await db.getAllAsync(`PRAGMA table_info(annual_charges)`) as any[];
    const existingColumns = tableInfo.map(col => col.name);
    
    console.log('📋 [ANNUAL_CHARGES_FIX] Existing columns:', existingColumns);
    
    // COLONNES REQUISES COMPLÈTES
    const requiredColumns = [
      { name: 'description', type: 'TEXT', defaultValue: null },
      { name: 'is_recurring', type: 'INTEGER', defaultValue: '0' },
      { name: 'is_active', type: 'INTEGER', defaultValue: '1' },
      { name: 'is_islamic', type: 'INTEGER', defaultValue: '0' },
      { name: 'islamic_holiday_id', type: 'TEXT', defaultValue: null },
      { name: 'arabic_name', type: 'TEXT', defaultValue: null },
      { name: 'type', type: 'TEXT', defaultValue: "'normal'" },
      { name: 'is_paid', type: 'INTEGER', defaultValue: '0' },
      { name: 'paid_date', type: 'TEXT', defaultValue: null },
      { name: 'reminder_days', type: 'INTEGER', defaultValue: '7' },
      { name: 'account_id', type: 'TEXT', defaultValue: null },
      { name: 'auto_deduct', type: 'INTEGER', defaultValue: '0' },
      { name: 'payment_method', type: 'TEXT', defaultValue: null },
      { name: 'recurrence', type: 'TEXT', defaultValue: null }
    ];
    
    let columnsAdded = 0;
    
    for (const requiredColumn of requiredColumns) {
      if (!existingColumns.includes(requiredColumn.name)) {
        console.log(`🛠️ [ANNUAL_CHARGES_FIX] Adding ${requiredColumn.name} column...`);
        
        try {
          let sql: string;
          if (requiredColumn.defaultValue !== null) {
            sql = `ALTER TABLE annual_charges ADD COLUMN ${requiredColumn.name} ${requiredColumn.type} DEFAULT ${requiredColumn.defaultValue}`;
          } else {
            sql = `ALTER TABLE annual_charges ADD COLUMN ${requiredColumn.name} ${requiredColumn.type}`;
          }
          
          await db.execAsync(sql);
          columnsAdded++;
          console.log(`✅ [ANNUAL_CHARGES_FIX] ${requiredColumn.name} column added successfully`);
        } catch (alterError: any) {
          if (alterError.message?.includes('duplicate column name') || alterError.message?.includes('already exists')) {
            console.log(`ℹ️ [ANNUAL_CHARGES_FIX] Column ${requiredColumn.name} already exists`);
          } else {
            console.warn(`⚠️ [ANNUAL_CHARGES_FIX] Could not add column ${requiredColumn.name}:`, alterError.message);
          }
        }
      } else {
        console.log(`✅ [ANNUAL_CHARGES_FIX] Column ${requiredColumn.name} already exists`);
      }
    }
    
    if (columnsAdded > 0) {
      console.log(`✅ [ANNUAL_CHARGES_FIX] Emergency fix completed: ${columnsAdded} columns added`);
    } else {
      console.log('✅ [ANNUAL_CHARGES_FIX] All required columns already exist');
    }
    
  } catch (error) {
    console.error('❌ [ANNUAL_CHARGES_FIX] Error during emergency fix:', error);
    throw error;
  }
};

export default emergencyAnnualChargesFix;