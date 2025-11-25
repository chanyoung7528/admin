interface CookieStore {
  get(name: string): Promise<{ name: string; value: string } | undefined>;
  get(options: { name: string; url?: string }): Promise<{ name: string; value: string } | undefined>;
  getAll(name?: string): Promise<{ name: string; value: string }[]>;
  getAll(options?: { name: string; url?: string }): Promise<{ name: string; value: string }[]>;
  set(name: string, value: string): Promise<void>;
  set(options: { name: string; value: string; expires?: number | Date; domain?: string; path?: string; sameSite?: 'strict' | 'lax' | 'none' }): Promise<void>;
  delete(name: string): Promise<void>;
  delete(options: { name: string; path?: string; domain?: string }): Promise<void>;
  addEventListener(type: 'change', listener: (event: CookieChangeEvent) => void): void;
  removeEventListener(type: 'change', listener: (event: CookieChangeEvent) => void): void;
}

interface CookieChangeEvent extends Event {
  changed: { name: string; value: string }[];
  deleted: { name: string; value: string }[];
}

interface Window {
  cookieStore: CookieStore;
}
