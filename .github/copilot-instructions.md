<!-- .github/copilot-instructions.md - Guidance for AI coding agents -->

# Copilot / AI agent instructions for Mylife

Short, actionable guidance to help an AI be productive in this repo.

1. Big picture
- **Type & platform:** React Native (Expo) TypeScript app located at the repository root (`App.tsx`, `expo-env.d.ts`). Use Expo tooling (`expo`, `eas`) for most workflows.
- **Structure:** UI + small design system in `components/` and `design/`. App logic lives under `src/` split as `context/`, `hooks/`, `services/`, `navigation/`, `screens/` and `utils/`.
- **Data & persistence:** Primary persistence is an embedded SQLite DB managed in `src/services/database/` and wrapped by `src/context/DatabaseContext.tsx`. Many services call `getDatabase()` and use `runAsync` / `execAsync` patterns.

2. Developer workflows (concrete commands)
- Start Metro (dev server): `npm run start` (alias of `expo start`). README also uses `npx expo start --tunnel --clear` for tunneling.
- Run on Android: `npm run android`. iOS: `npm run ios`. Web: `npm run web`.
- EAS updates: `eas update --branch main --message "mise à jour de l'app"` (present in README).
- Clean + reinstall (POSIX): `npm run clean`. Windows helper: `npm run clean:win`.
- Preinstall hook: `npx expo install --check` is run via `preinstall` in `package.json`.

3. Key conventions and patterns (do not invent behavior)
- Hooks: all custom hooks live in `src/hooks/` and follow the `useX` naming (e.g., `useCurrencyInitialization.ts`). Prefer returning simple objects with `isLoading`/`reinitialize` style.
- Contexts: `src/context/*` expose both a `Provider` component and a `useX` hook (e.g., `CurrencyProvider` + `useCurrency`, `DatabaseProvider` + `useDatabase`). When you add a context, follow this pairing and throw if the hook is used outside its provider.
- Services: stateless modules under `src/services/` that expose async functions or objects (e.g., `currencyMigrationService`). DB-affecting services typically call the shared `getDatabase()` and use explicit transactions (`BEGIN/COMMIT/ROLLBACK`) as in `currencyMigrationService.ts`.
- Currency-first design: the app enforces MAD as the base currency in many places. Look at `src/context/CurrencyContext.tsx`, `src/hooks/useCurrencyInitialization.ts`, and `src/services/currencyMigrationService.ts` for examples — changes to currency flow often require updates in all three places.
- Logging & comments: code uses concise console logs with emojis and French comments. Preserve the logging style for consistency when adding debug output.

4. Integration and cross-component patterns
- Sync across contexts: currency changes are synchronized across a multi-currency layer (`useMultiCurrency`) and persistent storage (AsyncStorage / secure storage). Use exported sync functions rather than direct state mutation.
- Emergency fixes & retries: `DatabaseContext` runs emergency fixes (e.g., `emergencyAnnualChargesFix`) and retries initialization up to a few times. When touching DB initialization, follow its retry and repair pattern instead of replacing it.
- Storage: user/device storage uses `@react-native-async-storage/async-storage` and a `secureStorage` wrapper under `src/services/storage/` for some keys — prefer the wrappers.

5. Files to reference when making cross-cutting changes
- `src/context/DatabaseContext.tsx` — DB initialization, repair, retry flow
- `src/context/CurrencyContext.tsx` — currency defaults, formatting, convertAmount logic
- `src/hooks/useCurrencyInitialization.ts` — orchestration for currency migration and sync
- `src/services/currencyMigrationService.ts` — example SQL-based migration with transactions
- `package.json` & `README.md` — canonical local dev commands and EAS update notes

6. Suggested prompts & guardrails for PRs
- When generating code that mutates DB schema or data: include a safe migration function modeled on `currencyMigrationService.migrateAllDataToMAD`, use transactions, and add logging. Add tests/manual verification steps in the PR description.
- For UI changes: follow the pattern in `components/` and `design/` (no global CSS — use the existing design tokens in `design/`).
- For performance-sensitive changes (lists/charts): follow existing memoization patterns and prefer small, focused changes.

7. Missing / unclear areas to ask the maintainer about
- Intended CI/test setup (there are component tests under `components/__tests__` but no test script in `package.json`). Ask whether to add Jest configuration.
- Any mobile signing/EAS build config details beyond the EAS update command in README.

If anything above is unclear or you want a different level of detail (for example, example PR templates or automated migration helpers), tell me which part to expand and I will iterate.
