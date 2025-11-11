import { useEffect, useState } from 'react';
import { initDatabase, getDatabase } from '../services/database/sqlite';

export const useDatabase = () => {
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    const initializeDB = async () => {
      try {
        await initDatabase();
        setDbInitialized(true);
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    };

    initializeDB();
  }, []);

  return {
    dbInitialized,
    getDatabase: () => getDatabase(),
  };
};
