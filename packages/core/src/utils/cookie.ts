/**
 * CookieStore API 타입 정의
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Cookie_Store_API
 */
export type CookieSameSite = 'strict' | 'lax' | 'none';

export interface CookieListItem {
  name: string;
  value: string;
  domain?: string | null;
  path?: string;
  expires?: number | null;
  secure?: boolean;
  sameSite?: CookieSameSite;
}

export interface CookieStoreGetOptions {
  name: string;
  url?: string;
}

export interface CookieSetOptions {
  expires?: number | Date | null;
  domain?: string | null;
  path?: string;
  sameSite?: CookieSameSite;
  secure?: boolean;
}

interface CookieInit extends CookieSetOptions {
  name: string;
  value: string;
}

export interface CookieStoreDeleteOptions {
  name: string;
  domain?: string | null;
  path?: string;
}

interface CookieStore {
  get(name: string): Promise<CookieListItem | undefined | null>;
  get(options: CookieStoreGetOptions): Promise<CookieListItem | undefined | null>;
  getAll(name?: string): Promise<CookieListItem[]>;
  getAll(options?: CookieStoreGetOptions): Promise<CookieListItem[]>;
  set(name: string, value: string): Promise<void>;
  set(options: CookieInit): Promise<void>;
  delete(name: string): Promise<void>;
  delete(options: CookieStoreDeleteOptions): Promise<void>;
}

/**
 * 쿠키 관리 유틸리티
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Cookie_Store_API
 */
class CookieManager {
  private get store(): CookieStore {
    if (typeof window !== 'undefined' && 'cookieStore' in window) {
      return window.cookieStore as unknown as CookieStore;
    }
    // Polyfill은 동적으로 import하거나 fallback 로직 사용
    throw new Error('CookieStore API is not available');
  }

  async get(name: string): Promise<string | null> {
    if (!name) return null;

    try {
      const item = await this.store.get(name);
      return item?.value ?? null;
    } catch (error) {
      console.warn(`[Cookie] Failed to get '${name}':`, error);
      return null;
    }
  }

  async set(name: string, value: string, options: CookieSetOptions = {}): Promise<void> {
    if (!name) {
      throw new Error('[Cookie] Cookie name is required');
    }

    try {
      const cookieInit: CookieInit = {
        name,
        value,
        path: options.path ?? '/',
        ...options,
        expires: options.expires instanceof Date ? options.expires.getTime() : options.expires,
      };

      await this.store.set(cookieInit);
    } catch (error) {
      console.warn(`[Cookie] Failed to set '${name}':`, error);
      throw error;
    }
  }

  async remove(name: string, options: Pick<CookieStoreDeleteOptions, 'path' | 'domain'> = {}): Promise<void> {
    if (!name) return;

    try {
      await this.store.delete({ name, ...options });
    } catch (error) {
      console.warn(`[Cookie] Failed to remove '${name}':`, error);
    }
  }

  async getAll(): Promise<CookieListItem[]> {
    try {
      return await this.store.getAll();
    } catch (error) {
      console.warn('[Cookie] Failed to get all cookies:', error);
      return [];
    }
  }
}

export const cookie = new CookieManager();
