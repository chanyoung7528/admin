type StorageType = 'localStorage' | 'sessionStorage';

/**
 * 브라우저 스토리지 래퍼 (localStorage, sessionStorage)
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API
 */
class BrowserStorage {
  private readonly type: StorageType;

  constructor(type: StorageType) {
    this.type = type;
  }

  private get storage(): Storage | null {
    try {
      if (typeof window !== 'undefined' && window[this.type]) {
        return window[this.type];
      }
    } catch (e) {
      console.error(`[Storage] ${this.type} access denied:`, e);
    }
    return null;
  }

  get<T = unknown>(key: string): T | null {
    if (!key) return null;

    const storage = this.storage;
    if (!storage) return null;

    try {
      const item = storage.getItem(key);
      if (item === null) return null;

      return JSON.parse(item) as T;
    } catch {
      const raw = storage.getItem(key);
      return raw as unknown as T;
    }
  }

  set<T = unknown>(key: string, value: T): boolean {
    if (!key) {
      throw new Error('[Storage] Key is required');
    }

    const storage = this.storage;
    if (!storage) return false;

    try {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      storage.setItem(key, stringValue);
      return true;
    } catch (error) {
      console.error(`[Storage] Failed to set '${key}' (quota exceeded?):`, error);
      return false;
    }
  }

  remove(key: string): void {
    if (!key) return;
    this.storage?.removeItem(key);
  }

  clear(): void {
    this.storage?.clear();
  }

  has(key: string): boolean {
    if (!key) return false;
    return this.storage?.getItem(key) !== null;
  }
}

export const localStore = new BrowserStorage('localStorage');
export const sessionStore = new BrowserStorage('sessionStorage');
