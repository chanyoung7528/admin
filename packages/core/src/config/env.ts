import { z } from 'zod';

const rawEnv = {
  mode: import.meta.env.MODE,
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  apiTimeout: import.meta.env.VITE_API_TIMEOUT || '30000',
  apiAcceptLanguage: import.meta.env.VITE_API_ACCEPT_LANGUAGE || 'ko-KR',
  featureDebug: import.meta.env.VITE_FEATURE_DEBUG || 'false',
};

const envSchema = z.object({
  mode: z.enum(['development', 'production', 'test', 'production.dev']),
  apiBaseUrl: z.string().min(1),
  apiTimeout: z.coerce.number().int().min(0, { message: 'VITE_API_TIMEOUT은 0 이상의 숫자여야 합니다.' }),
  apiAcceptLanguage: z.string().min(2),
  featureDebug: z.coerce.boolean(),
});

// API Base URL Prefix 결정 로직
function getApiBaseUrl(mode: string, apiBaseUrl: string | undefined): string {
  const proxyPrefix = import.meta.env.VITE_API_PROXY_PREFIX || '/api';

  if (mode === 'development' && apiBaseUrl?.startsWith('http')) {
    return proxyPrefix;
  }

  return apiBaseUrl || proxyPrefix;
}

const parsed = envSchema.safeParse(rawEnv);

if (!parsed.success) {
  console.error('[환경변수 검증 실패]', parsed.error.flatten().fieldErrors);
  throw new Error('환경변수가 올바르지 않습니다.');
}

const baseEnv = parsed.data;

export const env = {
  mode: baseEnv.mode,
  isDebug: baseEnv.featureDebug,
  apiBaseUrl: getApiBaseUrl(baseEnv.mode, import.meta.env.VITE_API_BASE_URL),
  apiTimeout: baseEnv.apiTimeout,
  apiAcceptLanguage: baseEnv.apiAcceptLanguage,
};
