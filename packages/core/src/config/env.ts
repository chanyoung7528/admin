import { z } from 'zod';

const rawEnv = {
  mode: import.meta.env.MODE,
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  apiTimeout: import.meta.env.VITE_API_TIMEOUT || '30000',
  apiAcceptLanguage: import.meta.env.VITE_API_ACCEPT_LANGUAGE || 'ko-KR',
  featureDebug: import.meta.env.VITE_FEATURE_DEBUG || 'false',
};

const envSchema = z.object({
  mode: z.enum(['development', 'production', 'test', 'dev', 'prd']),
  apiBaseUrl: z
    .string()
    .min(1)
    .refine(value => value.startsWith('http') || value.startsWith('/'), 'VITE_API_BASE_URL은 절대경로 또는 상대경로여야 합니다.'),
  apiTimeout: z.coerce.number().int().min(0, { message: 'VITE_API_TIMEOUT은 0 이상의 숫자여야 합니다.' }),
  apiAcceptLanguage: z.string().min(2),
  featureDebug: z.coerce.boolean(),
});

const parsed = envSchema.safeParse(rawEnv);

if (!parsed.success) {
  console.error(parsed.error.flatten().fieldErrors);
  throw new Error('환경변수가 올바르지 않습니다.');
}

const baseEnv = parsed.data;

export const env = {
  mode: baseEnv.mode,
  isDebug: baseEnv.featureDebug,
  apiBaseUrl: baseEnv.apiBaseUrl,
  apiTimeout: baseEnv.apiTimeout,
  apiAcceptLanguage: baseEnv.apiAcceptLanguage,
};
