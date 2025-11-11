# my-app Vercel 배포 가이드

이 문서는 my-app을 Vercel에 배포하는 방법을 설명합니다.

## 🚀 Vercel 배포 설정

### 1. Vercel 프로젝트 생성

1. [Vercel Dashboard](https://vercel.com/dashboard)에 접속
2. "Add New" → "Project" 클릭
3. GitHub 저장소 연결

### 2. 프로젝트 설정

#### Framework Preset

- **Framework**: Vite

#### Build & Development Settings

```
Root Directory: apps/my-app
```

**Build Command:**

```bash
cd ../.. && pnpm run build:my-app
```

**Output Directory:**

```
dist
```

**Install Command:**

```bash
pnpm install
```

**Development Command:**

```bash
pnpm run dev
```

### 3. 환경 변수

필요한 환경 변수가 있다면 Settings → Environment Variables에서 추가하세요.

예시:

```
VITE_API_URL=https://api.example.com
VITE_APP_ENV=production
```

### 4. 배포

설정 완료 후 "Deploy" 버튼을 클릭하면 자동으로 배포됩니다.

## 📋 중요 사항

### Storybook 제외

- **Storybook은 별도의 Vercel 프로젝트로 배포됩니다**
- my-app 배포 시 storybook은 빌드되지 않습니다
- `.vercelignore` 파일로 storybook 디렉토리가 제외됩니다

### Monorepo 설정

현재 프로젝트는 Turborepo를 사용하는 monorepo입니다:

- 루트에서 `pnpm run build:my-app` 실행 시 my-app만 빌드
- 루트에서 `pnpm run build:storybook` 실행 시 storybook만 빌드
- 루트에서 `pnpm run build` 실행 시 모든 앱 빌드

## 🔄 자동 배포

### main 브랜치

- `main` 브랜치에 push하면 프로덕션 환경에 자동 배포됩니다.
- 도메인: `your-app.vercel.app`

### Pull Request

- PR 생성 시 미리보기 환경이 자동으로 생성됩니다.
- 각 PR마다 고유한 URL이 할당됩니다.

### Ignore Build 설정

`vercel.json`의 `ignoreCommand`로 변경사항이 없으면 배포를 스킵합니다:

```json
{
  "ignoreCommand": "git diff --quiet HEAD^ HEAD ./apps/my-app"
}
```

이는 다음과 같이 작동합니다:

- `apps/my-app/` 내에 변경사항이 있으면 배포
- `apps/storybook/`만 변경되면 배포 스킵

## 🌐 커스텀 도메인 설정

1. Vercel Dashboard → 프로젝트 선택
2. Settings → Domains
3. 커스텀 도메인 추가
4. DNS 설정 업데이트

예시:

- `app.yourdomain.com`
- `admin.yourdomain.com`

## ⚡ 성능 최적화

### 빌드 최적화

- Turbo Cache로 빌드 시간 단축
- my-app만 빌드하여 배포 시간 단축
- 의존성 캐싱으로 설치 시간 최소화

### 번들 최적화

현재 적용된 최적화:

- ✅ 코드 스플리팅 (React, TanStack, vendor 분리)
- ✅ 개발 도구 동적 import (DevTools 제외)
- ✅ 라우트 기반 lazy loading
- ✅ Tree shaking

자세한 내용은 `BUNDLE_OPTIMIZATION.md` 참조

## 🐛 트러블슈팅

### 빌드 실패

**문제**: Turbo 필터 오류

```bash
# 해결: 올바른 패키지 이름 확인
cd ../.. && pnpm run build:my-app
```

**문제**: 의존성 설치 실패

```bash
# 해결: pnpm-lock.yaml 업데이트
pnpm install
git add pnpm-lock.yaml
git commit -m "Update lock file"
```

### 경로 문제

**문제**: 루트 디렉토리 오류

```bash
# Vercel 설정에서 Root Directory 확인
Root Directory: apps/my-app
```

**문제**: 빌드 명령어 오류

```bash
# Build Command에서 상대 경로 확인
cd ../.. && pnpm run build:my-app
```

## 📊 배포 상태 확인

### 배포 로그

1. Vercel Dashboard → 프로젝트 선택
2. Deployments 탭
3. 최신 배포 클릭
4. Build Logs 확인

### 빌드 시간

- Turbo Cache 적중 시: ~10초
- 전체 빌드: ~30-60초

## 📝 체크리스트

배포 전 확인사항:

- [ ] `pnpm run build:my-app` 로컬 빌드 성공
- [ ] `dist` 디렉토리 생성 확인
- [ ] 환경 변수 설정 완료
- [ ] Git에 모든 변경사항 커밋
- [ ] Vercel 프로젝트 설정 완료
- [ ] `.vercelignore`로 storybook 제외 확인

## 🎉 완료!

배포가 완료되면 다음 URL에서 확인할 수 있습니다:

- 프로덕션: `https://your-app.vercel.app`
- 미리보기: PR별 고유 URL

## 별도 프로젝트

- **my-app**: 메인 애플리케이션 (현재 프로젝트)
- **storybook**: UI 문서 (별도 Vercel 프로젝트)

Storybook 배포는 `apps/storybook/DEPLOYMENT.md` 참조

## 추가 리소스

- [Vercel Documentation](https://vercel.com/docs)
- [Turborepo with Vercel](https://vercel.com/docs/concepts/monorepos/turborepo)
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)
