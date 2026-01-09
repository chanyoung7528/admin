interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_PROXY_PREFIX: string;
  readonly VITE_API_TIMEOUT: string;
  readonly VITE_API_ACCEPT_LANGUAGE: string;
  readonly VITE_FEATURE_DEBUG: string;
  readonly VITE_KAKAO_CLIENT_ID: string;
  readonly VITE_KAKAO_REDIRECT_URI: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
