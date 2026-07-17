/**
 * Safe Storage utility that wraps localStorage in try-catch blocks to prevent SecurityError
 * crashes in iframe previews or restricted environments (e.g., when third-party storage is blocked).
 */

const isStorageAvailable = (): boolean => {
  try {
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

const storageAvailable = isStorageAvailable();

// Simple in-memory fallback for environments with blocked local storage
const memoryStore: Record<string, string> = {};

export const safeStorage = {
  getItem(key: string): string | null {
    if (storageAvailable) {
      try {
        return window.localStorage.getItem(key);
      } catch (e) {
        console.warn(`[SafeStorage] failed to read key "${key}" from localStorage:`, e);
      }
    }
    return memoryStore[key] !== undefined ? memoryStore[key] : null;
  },

  setItem(key: string, value: string): void {
    if (storageAvailable) {
      try {
        window.localStorage.setItem(key, value);
        return;
      } catch (e) {
        console.warn(`[SafeStorage] failed to write key "${key}" to localStorage:`, e);
      }
    }
    memoryStore[key] = value;
  },

  removeItem(key: string): void {
    if (storageAvailable) {
      try {
        window.localStorage.removeItem(key);
        return;
      } catch (e) {
        console.warn(`[SafeStorage] failed to remove key "${key}" from localStorage:`, e);
      }
    }
    delete memoryStore[key];
  },

  clear(): void {
    if (storageAvailable) {
      try {
        window.localStorage.clear();
        return;
      } catch (e) {
        console.warn('[SafeStorage] failed to clear localStorage:', e);
      }
    }
    for (const key in memoryStore) {
      delete memoryStore[key];
    }
  }
};
