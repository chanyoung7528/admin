/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MODE: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_TIMEOUT: string;
  readonly VITE_API_ACCEPT_LANGUAGE: string;
  readonly VITE_FEATURE_DEBUG: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module 'cookie-store' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const cookieStore: any;
}
