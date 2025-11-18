# 📚 TypeScript Alias 가이드

이 프로젝트는 monorepo 구조로 구성되어 있으며, 명확한 alias 규칙을 통해 모듈 간 충돌을 방지하고 코드의 가독성을 향상시킵니다.

## 🎯 기본 원칙

### 1. **각 패키지는 고유한 alias prefix를 사용합니다**

- `my-app`: `@/*` (앱 내부 경로)
- `shared`: `@shared/*` (공유 패키지 내부 경로)
- shared 가져오기: `@repo/shared/*` (다른 패키지에서 shared 사용 시)

### 2. **충돌 방지**

- `my-app` 내부에서 `@/` 사용 시, 항상 my-app의 `src` 폴더를 가리킴
- `shared` 내부에서 `@shared/` 사용 시, 항상 shared의 `src` 폴더를 가리킴
- 빌드 시 alias 충돌이 발생하지 않음

---

## 📂 my-app (apps/my-app)

### Alias 규칙

#### ✅ my-app 내부 파일 참조

```typescript
// my-app/src 폴더 내의 파일들 참조
import { MyComponent } from '@/components/MyComponent';
import { useMyHook } from '@/hooks/useMyHook';
import { myUtil } from '@/utils/myUtil';
import { MyDomain } from '@/domains/MyDomain';
import { MyPage } from '@/pages/MyPage';
```

#### ✅ shared 패키지 가져오기

```typescript
// shared 패키지의 UI 컴포넌트
import { Button, Input, Dialog } from '@repo/shared/components/ui';

// shared 패키지의 레이아웃
import { Layout, Header } from '@repo/shared/components/layouts';

// shared 패키지의 context
import { ThemeProvider, DirectionProvider } from '@repo/shared/components/context';

// shared 패키지의 유틸리티
import { cn } from '@repo/shared/lib/utils';
import { formatDate } from '@repo/shared/lib/date';

// shared 패키지의 hooks
import { useIsMobile } from '@repo/shared/hooks/useIsMobile';

// shared 패키지의 stores
import { useAuthStore } from '@repo/shared/stores/useAuthStore';

// shared 패키지의 assets
import { IconCustom } from '@repo/shared/assets/custom';
```

### 설정 파일

#### `tsconfig.json`

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      // my-app 자체 alias
      "@/*": ["./src/*"],
      "@domains/*": ["./src/domains/*"],
      "@pages/*": ["./src/pages/*"],
      "@components/*": ["./src/components/*"],
      "@hooks/*": ["./src/hooks/*"],
      "@utils/*": ["./src/utils/*"],

      // shared 패키지 가져오기
      "@repo/shared/components/ui": ["../../packages/shared/src/components/ui"],
      "@repo/shared/components/context": ["../../packages/shared/src/components/context"],
      "@repo/shared/components/layouts": ["../../packages/shared/src/components/layouts"],
      "@repo/shared/components/*": ["../../packages/shared/src/components/*"],
      "@repo/shared/lib/*": ["../../packages/shared/src/lib/*"],
      "@repo/shared/hooks/*": ["../../packages/shared/src/hooks/*"],
      "@repo/shared/stores/*": ["../../packages/shared/src/stores/*"],
      "@repo/shared/assets/*": ["../../packages/shared/src/assets/*"],
      "@repo/shared/*": ["../../packages/shared/src/*"],

      // shared 내부 alias (빌드시 resolve용)
      "@shared/*": ["../../packages/shared/src/*"],
      "@shared/ui/*": ["../../packages/shared/src/components/ui/*"],
      "@shared/components/*": ["../../packages/shared/src/components/*"],
      "@shared/lib/*": ["../../packages/shared/src/lib/*"],
      "@shared/hooks/*": ["../../packages/shared/src/hooks/*"],
      "@shared/stores/*": ["../../packages/shared/src/stores/*"],
      "@shared/assets/*": ["../../packages/shared/src/assets/*"]
    }
  }
}
```

#### `vite.config.ts`

```typescript
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      // shared 패키지 가져오기
      '@repo/shared/components/ui': path.resolve(__dirname, '../../packages/shared/src/components/ui'),
      '@repo/shared/components/context': path.resolve(__dirname, '../../packages/shared/src/components/context'),
      '@repo/shared/components/layouts': path.resolve(__dirname, '../../packages/shared/src/components/layouts'),
      '@repo/shared/components': path.resolve(__dirname, '../../packages/shared/src/components'),
      '@repo/shared/lib': path.resolve(__dirname, '../../packages/shared/src/lib'),
      '@repo/shared/hooks': path.resolve(__dirname, '../../packages/shared/src/hooks'),
      '@repo/shared/stores': path.resolve(__dirname, '../../packages/shared/src/stores'),
      '@repo/shared/assets': path.resolve(__dirname, '../../packages/shared/src/assets'),
      '@repo/shared': path.resolve(__dirname, '../../packages/shared/src'),

      // shared 내부 alias (빌드시 resolve용)
      '@shared/ui': path.resolve(__dirname, '../../packages/shared/src/components/ui'),
      '@shared/components': path.resolve(__dirname, '../../packages/shared/src/components'),
      '@shared/lib': path.resolve(__dirname, '../../packages/shared/src/lib'),
      '@shared/hooks': path.resolve(__dirname, '../../packages/shared/src/hooks'),
      '@shared/stores': path.resolve(__dirname, '../../packages/shared/src/stores'),
      '@shared/assets': path.resolve(__dirname, '../../packages/shared/src/assets'),
      '@shared': path.resolve(__dirname, '../../packages/shared/src'),

      // my-app 자체 alias
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

---

## 📦 shared (packages/shared)

### Alias 규칙

#### ✅ shared 패키지 내부 파일 참조

```typescript
// UI 컴포넌트
import { Button } from '@shared/ui/button';
import { Input } from '@shared/ui/input';
import { Dialog } from '@shared/ui/dialog';

// 일반 컴포넌트
import { Header } from '@shared/components/layouts/Header';
import { Layout } from '@shared/components/layouts/Layout';

// Context
import { ThemeProvider } from '@shared/components/context/ThemeProvider';
import { useTheme } from '@shared/components/context/ThemeProvider';

// 유틸리티
import { cn } from '@shared/lib/utils';
import { formatDate } from '@shared/lib/date';

// Hooks
import { useIsMobile } from '@shared/hooks/useIsMobile';

// Stores
import { useAuthStore } from '@shared/stores/useAuthStore';

// Assets
import { IconCustom } from '@shared/assets/custom';
```

### 설정 파일

#### `tsconfig.json`

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@shared/*": ["./src/*"],
      "@shared/ui/*": ["./src/components/ui/*"],
      "@shared/components/*": ["./src/components/*"],
      "@shared/lib/*": ["./src/lib/*"],
      "@shared/hooks/*": ["./src/hooks/*"],
      "@shared/stores/*": ["./src/stores/*"],
      "@shared/assets/*": ["./src/assets/*"]
    }
  }
}
```

#### `vite.config.ts`

```typescript
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      '@shared/ui': path.resolve(__dirname, './src/components/ui'),
      '@shared/components': path.resolve(__dirname, './src/components'),
      '@shared/lib': path.resolve(__dirname, './src/lib'),
      '@shared/hooks': path.resolve(__dirname, './src/hooks'),
      '@shared/stores': path.resolve(__dirname, './src/stores'),
      '@shared/assets': path.resolve(__dirname, './src/assets'),
      '@shared': path.resolve(__dirname, './src'),
    },
  },
});
```

#### `package.json` exports

```json
{
  "exports": {
    "./globals.css": "./src/styles/globals.css",
    "./lib/*": "./src/lib/*.ts",
    "./utils/*": "./src/lib/utils/*.ts",
    "./components/ui": "./src/components/ui/index.ts",
    "./components/layouts": "./src/components/layouts/index.ts",
    "./components/context": "./src/components/context/index.ts",
    "./components/*": "./src/components/*",
    "./hooks/*": "./src/hooks/*.ts",
    "./stores/*": "./src/stores/*.ts",
    "./types/*": "./src/types/*.ts"
  }
}
```

---

## 📖 storybook (apps/storybook)

### Alias 규칙

#### ✅ shared 패키지 가져오기

```typescript
// shared 패키지의 UI 컴포넌트
import { Button, Input, Dialog } from '@repo/shared/components/ui';

// shared 패키지의 스타일
import '@repo/shared/globals.css';

// storybook 자체 파일
import { CustomDocsPage } from '@/components/CustomDocsPage';
```

### 설정 파일

#### `tsconfig.json`

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      // storybook 자체 alias
      "@/*": ["./src/*"],

      // shared 패키지 가져오기 (구체적인 것부터)
      "@repo/shared/components/ui": ["../../packages/shared/src/components/ui"],
      "@repo/shared/components/context": ["../../packages/shared/src/components/context"],
      "@repo/shared/components/layouts": ["../../packages/shared/src/components/layouts"],
      "@repo/shared/components/*": ["../../packages/shared/src/components/*"],
      "@repo/shared/lib/*": ["../../packages/shared/src/lib/*"],
      "@repo/shared/hooks/*": ["../../packages/shared/src/hooks/*"],
      "@repo/shared/stores/*": ["../../packages/shared/src/stores/*"],
      "@repo/shared/assets/*": ["../../packages/shared/src/assets/*"],
      "@repo/shared/*": ["../../packages/shared/src/*"],

      // shared 패키지 내부에서 사용하는 alias (빌드시 resolve용)
      "@shared/*": ["../../packages/shared/src/*"],
      "@shared/ui/*": ["../../packages/shared/src/components/ui/*"],
      "@shared/components/*": ["../../packages/shared/src/components/*"],
      "@shared/lib/*": ["../../packages/shared/src/lib/*"],
      "@shared/hooks/*": ["../../packages/shared/src/hooks/*"],
      "@shared/stores/*": ["../../packages/shared/src/stores/*"],
      "@shared/assets/*": ["../../packages/shared/src/assets/*"]
    }
  }
}
```

#### `.storybook/main.ts`

```typescript
import { resolve } from 'path';

const config: StorybookConfig = {
  viteFinal: async config => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,

      // CSS 파일 절대 경로
      '@repo/shared/globals.css': resolve(__dirname, '../../../packages/shared/src/styles/globals.css'),

      // shared 패키지 가져오기
      '@repo/shared/components/ui': resolve(__dirname, '../../../packages/shared/src/components/ui'),
      '@repo/shared/components/context': resolve(__dirname, '../../../packages/shared/src/components/context'),
      '@repo/shared/components/layouts': resolve(__dirname, '../../../packages/shared/src/components/layouts'),
      '@repo/shared/components': resolve(__dirname, '../../../packages/shared/src/components'),
      '@repo/shared/lib': resolve(__dirname, '../../../packages/shared/src/lib'),
      '@repo/shared/hooks': resolve(__dirname, '../../../packages/shared/src/hooks'),
      '@repo/shared/stores': resolve(__dirname, '../../../packages/shared/src/stores'),
      '@repo/shared/assets': resolve(__dirname, '../../../packages/shared/src/assets'),
      '@repo/shared': resolve(__dirname, '../../../packages/shared/src'),

      // shared 내부 alias (빌드시 resolve용)
      '@shared/ui': resolve(__dirname, '../../../packages/shared/src/components/ui'),
      '@shared/components': resolve(__dirname, '../../../packages/shared/src/components'),
      '@shared/lib': resolve(__dirname, '../../../packages/shared/src/lib'),
      '@shared/hooks': resolve(__dirname, '../../../packages/shared/src/hooks'),
      '@shared/stores': resolve(__dirname, '../../../packages/shared/src/stores'),
      '@shared/assets': resolve(__dirname, '../../../packages/shared/src/assets'),
      '@shared': resolve(__dirname, '../../../packages/shared/src'),
    };

    // React 중복 방지 (중요!)
    config.resolve.dedupe = ['react', 'react-dom'];

    // 빌드 최적화 설정 (청크 분리)
    config.build = config.build || {};
    config.build.rollupOptions = config.build.rollupOptions || {};
    config.build.rollupOptions.output = {
      ...config.build.rollupOptions.output,
      manualChunks: id => {
        // React 및 React DOM을 별도 청크로 분리
        if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
          return 'react-vendor';
        }

        // Radix UI 컴포넌트를 별도 청크로 분리
        if (id.includes('node_modules/@radix-ui/')) {
          return 'radix-vendor';
        }

        // Lucide 아이콘을 별도 청크로 분리
        if (id.includes('node_modules/lucide-react/')) {
          return 'lucide-vendor';
        }

        // Storybook 관련 패키지
        if (id.includes('node_modules/@storybook/')) {
          return 'storybook-vendor';
        }

        // 기타 큰 node_modules 패키지
        if (id.includes('node_modules/')) {
          return 'vendor';
        }
      },
    };

    // 청크 크기 경고 임계값 증가 (Storybook은 일반적으로 크므로)
    config.build.chunkSizeWarningLimit = 3000;

    return config;
  },
};
```

#### `.storybook/preview.ts`

```typescript
import type { Preview } from '@storybook/react';
import '@repo/shared/globals.css'; // ✅ 절대 경로 사용

const preview: Preview = {
  // ...
};
```

---

## 🔍 주요 차이점 요약

| 위치          | 자신의 파일 참조 | shared 패키지 참조 |
| ------------- | ---------------- | ------------------ |
| **my-app**    | `@/*`            | `@repo/shared/*`   |
| **storybook** | `@/*`            | `@repo/shared/*`   |
| **shared**    | `@shared/*`      | N/A (자기 자신)    |

---

## ⚠️ 주의사항

### ❌ 하지 말아야 할 것

#### 1. my-app에서 shared의 내부 alias 직접 사용

```typescript
// ❌ 잘못된 사용
import { Button } from '@shared/ui/button'; // my-app에서는 사용 불가

// ✅ 올바른 사용
import { Button } from '@repo/shared/components/ui';
```

#### 2. shared에서 @repo/shared 사용

```typescript
// ❌ 잘못된 사용 (shared 내부에서)
import { cn } from '@repo/shared/lib/utils';

// ✅ 올바른 사용
import { cn } from '@shared/lib/utils';
```

#### 3. 상대 경로 대신 alias 사용

```typescript
// ❌ 권장하지 않음
import { Button } from '../../components/ui/button';

// ✅ 권장
import { Button } from '@shared/ui/button'; // shared 내부
import { Button } from '@repo/shared/components/ui'; // my-app
```

---

## 🎨 CSS 가져오기

### shared 패키지의 globals.css

모든 앱에서 shared 패키지의 global CSS를 절대 경로로 가져올 수 있습니다:

#### my-app

```typescript
// apps/my-app/src/index.css
@import '@repo/shared/globals.css';  // ✅ 절대 경로
```

#### storybook

```typescript
// apps/storybook/.storybook/preview.ts
import '@repo/shared/globals.css'; // ✅ 절대 경로
```

**주의**: CSS 파일의 절대 경로는 각 앱의 `vite.config.ts`나 `.storybook/main.ts`에서 alias를 설정해야 합니다.

---

## 🚀 빌드 및 개발 서버

### 개발 서버 실행

```bash
# my-app 개발 서버
pnpm run dev:my-app

# storybook 개발 서버
pnpm run dev:storybook
```

### 빌드

```bash
# my-app 빌드
pnpm run build:my-app

# storybook 빌드
pnpm run build:storybook

# 전체 빌드
pnpm run build
```

### Storybook 빌드 최적화

Storybook 빌드 시 청크가 효과적으로 분리됩니다:

```
✅ lucide-vendor:      19.38 kB (Lucide 아이콘)
✅ radix-vendor:       43.29 kB (Radix UI 컴포넌트)
✅ vendor:            109.66 kB (기타 라이브러리)
✅ react-vendor:      191.04 kB (React & React DOM)
✅ storybook-vendor: 2,355.35 kB (Storybook 런타임)
```

**참고**: `storybook-vendor`가 크지만 이는 정상입니다. Storybook은 개발/문서화 도구이므로 프로덕션 번들에는 포함되지 않습니다.

### React 중복 방지

Storybook 배포 시 `Cannot read properties of undefined (reading 'useLayoutEffect')` 에러를 방지하기 위해 **React dedupe 설정**이 필수입니다:

```typescript
// .storybook/main.ts
config.resolve.dedupe = ['react', 'react-dom'];
```

이 설정은 여러 청크에서 React가 중복으로 로드되는 것을 방지합니다.

---

## 🔧 문제 해결

### 빌드 시 alias를 찾을 수 없는 경우

1. **TypeScript 설정 확인**
   - `tsconfig.json`의 `paths` 설정이 올바른지 확인
   - 더 구체적인 경로가 먼저 나열되어 있는지 확인

2. **Vite 설정 확인**
   - `vite.config.ts`의 `resolve.alias` 설정 확인
   - 경로가 `path.resolve()`로 절대 경로로 변환되는지 확인

3. **package.json exports 확인 (shared 패키지)**
   - 필요한 경로가 `exports`에 명시되어 있는지 확인

4. **개발 서버 재시작**
   - alias 설정 변경 후 개발 서버를 재시작해야 합니다
   ```bash
   pkill -f "vite" && pnpm run dev:my-app
   ```

### 타입 오류가 발생하는 경우

```bash
# TypeScript 캐시 삭제
rm -rf apps/my-app/node_modules/.tmp
rm -rf packages/shared/node_modules/.tmp

# node_modules 재설치
pnpm install

# 다시 빌드
pnpm run build:my-app
```

### Storybook 배포 시 React 에러

**에러**: `Cannot read properties of undefined (reading 'useLayoutEffect')`

**원인**: React 모듈이 여러 청크에서 중복으로 로드됨

**해결**:

```typescript
// apps/storybook/.storybook/main.ts
config.resolve.dedupe = ['react', 'react-dom'];
```

이 설정은 Vite가 React와 React DOM을 단일 인스턴스로 유지하도록 합니다.

---

## 📖 추가 리소스

- [TypeScript Module Resolution](https://www.typescriptlang.org/docs/handbook/module-resolution.html)
- [Vite Resolve Alias](https://vitejs.dev/config/shared-options.html#resolve-alias)
- [Node.js Package Exports](https://nodejs.org/api/packages.html#exports)

---

## ✅ 체크리스트

새로운 alias를 추가할 때:

- [ ] `tsconfig.json`에 path 추가
- [ ] `vite.config.ts`에 alias 추가
- [ ] `package.json`의 exports 추가 (shared 패키지인 경우)
- [ ] 기존 파일들의 import 경로 업데이트
- [ ] 개발 서버 재시작 및 테스트
- [ ] 빌드 테스트

---

_마지막 업데이트: 2025-11-13_
