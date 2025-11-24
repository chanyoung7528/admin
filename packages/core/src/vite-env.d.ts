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
