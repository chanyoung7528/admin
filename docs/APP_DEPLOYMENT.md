## 🚀 my-app Vercel 배포 가이드

### 1. 프로젝트 설정

- **Root Directory**: `apps/my-app`
- **Install Command**: `pnpm install`
- **Build Command**: `cd ../.. && pnpm run build:my-app`
- **Output Directory**: `dist`
- **Dev Command**: `pnpm run dev`
- **Framework Preset**: `Other` (Vite)

`apps/my-app/vercel.json` 에 동일한 설정이 이미 정의되어 있으므로, Vercel 대시보드에서 “Use root configuration” 옵션을 선택하면 됩니다.

### 2. .vercelignore

`apps/my-app/.vercelignore` 는 Storybook, node_modules, 테스트 아티팩트 등을 제외합니다.

```
../storybook/**
node_modules
dist
*.tsbuildinfo
*.local
.env.*
.vscode
.idea
coverage
*.test.tsx?
*.spec.tsx?
```

Storybook은 별도 프로젝트(`apps/storybook`)로 배포하므로 my-app 빌드에는 포함되지 않습니다.

### 3. 환경 변수

`packages/core/src/config/env.ts` 가 아래 키를 사용합니다.

| 키                         | 예시                      | 비고                 |
| -------------------------- | ------------------------- | -------------------- |
| `VITE_API_BASE_URL`        | `https://api.example.com` | 상대 경로 허용       |
| `VITE_API_TIMEOUT`         | `30000`                   | ms 단위              |
| `VITE_API_ACCEPT_LANGUAGE` | `ko-KR`                   | 다국어 필요 시 변경  |
| `VITE_FEATURE_DEBUG`       | `false`                   | DevTools 노출 플래그 |

Vercel 프로젝트 → Settings → Environment Variables 에 동일하게 등록합니다.

### 4. 배포 플로우

1. `pnpm install`
2. `cd ../.. && pnpm run build:my-app`
3. 산출물 `apps/my-app/dist` 업로드
4. `rewrites`: SPA 라우팅을 위해 `[{ "source": "/(.*)", "destination": "/" }]` 자동 적용

루트(`vercel.json`)에는 `pnpm build` 만 정의되어 있으므로, monorepo 루트에서 직접 배포할 경우 turbo 파이프라인 전체가 실행됩니다. my-app 단일 배포라면 앱 폴더에 파일이 있는지 확인하세요.

### 5. 사전 체크리스트

- [ ] `pnpm run build:my-app` 로컬 성공
- [ ] `apps/my-app/dist/index.html` 정상 여부 확인
- [ ] `.env.production` 혹은 Vercel Secrets 설정
- [ ] `apps/my-app/.vercelignore` 최신화
- [ ] Storybook 관련 변경이 아니라면 my-app 경로만 수정되었는지 확인

### 6. 트러블슈팅

| 증상                                       | 해결                                                                         |
| ------------------------------------------ | ---------------------------------------------------------------------------- |
| 루트가 잘못되어 “No Output Directory” 에러 | Vercel 프로젝트 Root Directory 를 `apps/my-app` 으로 재설정                  |
| Storybook 빌드가 포함되어 시간 증가        | `.vercelignore` 확인, 필요 시 `node_modules/.cache/storybook` 도 제외        |
| API 401 반복                               | `setupApiClient()` 가 `src/main.tsx` 에서 호출되는지 확인, 환경 변수 값 점검 |
| fetch 500 / alert 발생                     | `configureAuth` 의 `onError` 로 전달된 에러. 서버 헬스 상태 확인             |

### 7. 멀티 앱 전략

- my-app 과 Storybook 은 각각 별도 Vercel 프로젝트를 두고, 동일한 Git 저장소를 선택한 뒤 Root Directory 만 다르게 설정합니다.
- 모노레포 전체 빌드가 필요하면 루트 `vercel.json` (`buildCommand: pnpm install && pnpm build`) 을 사용합니다.

### 8. 운영 팁

- 배포 전에 `pnpm run preview --filter my-app...` 으로 Vite 미리보기 실행 후 Lighthouse를 측정합니다.
- `docs/BUNDLE_ANALYSIS.md` 의 번들 사이즈 가이드를 따라 stats.html 을 함께 확인하면 배포 후 성능 회귀를 줄일 수 있습니다.
