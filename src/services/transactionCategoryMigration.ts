import { findMatchingCategoryId } from '../utils/categoryResolver';
import categoryService from './categoryService';
import { getDatabase } from './database/sqlite';

// Migration helper: normalize transaction.category values to canonical category IDs
export async function migrateTransactionCategories(
  userId: string = 'default-user',
  options?: { dryRun?: boolean }
) {
  const db = await getDatabase();
  const dryRun = options?.dryRun === true;

  console.log('🔄 Starting transaction category migration...', dryRun ? '(dry-run)' : '(apply)');

  // 1) load all distinct category values used in transactions
  const rows: Array<{ category: string | null }> = await db.getAllAsync(
    `SELECT DISTINCT category FROM transactions WHERE user_id = ?`,
    [userId]
  );

  const distinctValues = rows.map(r => r.category).filter(v => v !== null) as string[];

  console.log(`🔍 Found ${distinctValues.length} distinct transaction.category values`);

  // 2) load categories
  const categories = await categoryService.getAllCategories(userId);

  const updates: { from: string; to: string }[] = [];
  const unmatched: string[] = [];

  for (const val of distinctValues) {
    const candidateId = findMatchingCategoryId(val, categories);
    if (candidateId) {
      if (candidateId !== val) {
        updates.push({ from: val, to: candidateId });
      }
    } else {
      unmatched.push(val);
    }
  }

  console.log(`✅ Will update ${updates.length} distinct category values. ${unmatched.length} unmatched.`);

  // 3) apply updates inside a transaction if not dry run
  if (updates.length > 0 && !dryRun) {
    try {
      await db.execAsync('BEGIN TRANSACTION');
      for (const u of updates) {
        console.log(`🔁 Updating transactions: '${u.from}' -> '${u.to}'`);
        await db.runAsync(
          `UPDATE transactions SET category = ? WHERE category = ? AND user_id = ?`,
          [u.to, u.from, userId]
        );
      }
      await db.execAsync('COMMIT');
      console.log('✅ Migration applied successfully');
    } catch (err) {
      console.error('❌ Migration failed, rolling back', err);
      try { await db.execAsync('ROLLBACK'); } catch (e) { /* ignore */ }
      throw err;
    }
  }

  // 4) report unmatched values so the maintainer can decide mapping
  if (unmatched.length > 0) {
    console.warn('⚠️ The following category values could not be matched to existing categories:');
    unmatched.forEach(v => console.warn(` - ${v}`));
  }

  return {
    updated: updates.length,
    unmatched,
    updatesPreview: updates
  };
}

export default migrateTransactionCategories;
