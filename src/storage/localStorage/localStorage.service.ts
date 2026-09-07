import { ILocalStorageService } from './localStorage.types';

export const localStorageService: ILocalStorageService = {
  getItem<T>(key: string, fallback: T): T {
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return fallback;
      }
      return JSON.parse(item) as T;
    } catch {
      return fallback;
    }
  },

  setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage quota or browser restriction fallback
    }
  },

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      // Storage error handling
    }
  },

  clear(): void {
    try {
      localStorage.clear();
    } catch {
      // Storage error handling
    }
  },
};
