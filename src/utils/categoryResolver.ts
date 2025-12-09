import { Category } from '../types';
import { translateCategoryName } from './categoryTranslations';

export interface ResolvedCategory {
  parent?: string | null;
  child: string;
  matchedId?: string | null;
}

// Resolve a category value that may be an id, a name, or a legacy keyword.
// Returns an object with optional parent name and child name to allow "Parent › Child" rendering.
// If translations are provided, category names will be translated
export function resolveCategoryLabel(
  value: string | undefined | null, 
  categories: Category[] = [],
  translations?: any
): ResolvedCategory {
  if (!value) return { child: translations ? translations.other || 'Autre' : 'Autre' };

  const all = categories || [];
  const trimmed = String(value).trim();
  const lower = trimmed.toLowerCase();

  // 1) Try exact id match
  const byId = all.find((c) => c.id === trimmed);
  if (byId) {
    const translatedName = translations ? translateCategoryName(byId.name, translations) : byId.name;
    if (byId.parentId) {
      const parent = all.find((p) => p.id === byId.parentId);
      const translatedParent = parent && translations ? translateCategoryName(parent.name, translations) : parent?.name;
      return { parent: translatedParent || null, child: translatedName, matchedId: byId.id };
    }
    return { child: translatedName, matchedId: byId.id };
  }

  // 2) Try exact name match (case-insensitive)
  const byName = all.find((c) => (c.name || '').toLowerCase() === lower);
  if (byName) {
    const translatedName = translations ? translateCategoryName(byName.name, translations) : byName.name;
    if (byName.parentId) {
      const parent = all.find((p) => p.id === byName.parentId);
      const translatedParent = parent && translations ? translateCategoryName(parent.name, translations) : parent?.name;
      return { parent: translatedParent || null, child: translatedName, matchedId: byName.id };
    }
    return { child: translatedName, matchedId: byName.id };
  }

  // 3) Try partial match: category name contains value or vice-versa
  const partial = all.find((c) => {
    const name = (c.name || '').toLowerCase();
    return name.includes(lower) || lower.includes(name);
  });
  if (partial) {
    const translatedName = translations ? translateCategoryName(partial.name, translations) : partial.name;
    if (partial.parentId) {
      const parent = all.find((p) => p.id === partial.parentId);
      const translatedParent = parent && translations ? translateCategoryName(parent.name, translations) : parent?.name;
      return { parent: translatedParent || null, child: translatedName, matchedId: partial.id };
    }
    return { child: translatedName, matchedId: partial.id };
  }

  // 4) Fallback: use the raw value as a label
  // If value looks like an internal id (e.g. cat_main_housing), try a readable transformation
  if (lower.startsWith('cat_') || lower.includes('_')) {
    const heuristic = trimmed
      .replace(/^cat_(main_|sub_)?/i, '')
      .split(/[_\-\s]+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    // small mapping for common tokens to French-friendly labels
    const tokenMap: Record<string, string> = {
      housing: 'Logement',
      food: 'Nourriture',
      transport: 'Transport',
      health: 'Santé',
      savings: 'Épargne',
      salary: 'Salaire',
      finances: 'Finances',
      other: 'Autres',
      primary: 'Principal',
      secondary: 'Secondaire'
    };

    // try to replace last word if it matches tokenMap
    const parts = heuristic.split(' ');
    const last = parts[parts.length - 1].toLowerCase();
    if (tokenMap[last]) {
      parts[parts.length - 1] = tokenMap[last];
    }

    return { child: parts.join(' '), matchedId: null };
  }

  return { child: trimmed, matchedId: null };
}

// Try to find a matching category id for a given value (id, name, partial match)
export function findMatchingCategoryId(value: string | undefined | null, categories: Category[] = []): string | null {
  if (!value) return null;
  const all = categories || [];
  const trimmed = String(value).trim();
  const lower = trimmed.toLowerCase();

  const byId = all.find((c) => c.id === trimmed);
  if (byId) return byId.id;

  const byName = all.find((c) => (c.name || '').toLowerCase() === lower);
  if (byName) return byName.id;

  const partial = all.find((c) => {
    const name = (c.name || '').toLowerCase();
    return name.includes(lower) || lower.includes(name);
  });
  if (partial) return partial.id;

  return null;
}

export default resolveCategoryLabel;
