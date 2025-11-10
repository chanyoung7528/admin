# Storybook Vercel 배포 가이드

이 문서는 Storybook을 Vercel에 배포하는 방법을 설명합니다.

## 🚀 Vercel 배포 설정

### 1. Vercel 프로젝트 생성

1. [Vercel Dashboard](https://vercel.com/dashboard)에 접속
2. "Add New" → "Project" 클릭
3. GitHub 저장소 연결

### 2. 프로젝트 설정

#### Framework Preset

- **Framework**: Other (Vite가 자동 감지되지 않으므로)

#### Build & Development Settings

```
Root Directory: apps/storybook
```

**Build Command:**

```bash
pnpm run build
```

**Output Directory:**

```
storybook-static
```

**Install Command:**

```bash
pnpm install
```

**Development Command (선택사항):**

```bash
pnpm run dev
```

### 3. 환경 변수

현재 Storybook은 환경 변수가 필요하지 않습니다.

필요한 경우:

- Settings → Environment Variables에서 추가

### 4. 배포

설정 완료 후 "Deploy" 버튼을 클릭하면 자동으로 배포됩니다.

## 📋 vercel.json 설정

프로젝트에는 이미 `vercel.json` 파일이 포함되어 있습니다:

```json
{
  "buildCommand": "pnpm run build",
  "outputDirectory": "storybook-static",
  "installCommand": "pnpm install",
  "framework": null,
  "devCommand": "pnpm run dev"
}
```

## 🔄 자동 배포

### main 브랜치

- `main` 브랜치에 push하면 프로덕션 환경에 자동 배포됩니다.
- 도메인: `your-project.vercel.app`

### Pull Request

- PR 생성 시 미리보기 환경이 자동으로 생성됩니다.
- 각 PR마다 고유한 URL이 할당됩니다.

## 🌐 커스텀 도메인 설정

1. Vercel Dashboard → 프로젝트 선택
2. Settings → Domains
3. 커스텀 도메인 추가
4. DNS 설정 업데이트

예시:

- `storybook.yourdomain.com`
- `ui-docs.yourdomain.com`

## ⚡ 성능 최적화

### Edge Network

Vercel의 글로벌 Edge Network를 통해 자동으로 최적화됩니다:

- 전 세계 CDN 배포
- 자동 캐싱
- HTTPS 지원
- HTTP/2 & HTTP/3

### 빌드 캐싱

- Turbo Cache 활성화로 빌드 시간 단축
- 의존성 캐싱으로 설치 시간 최소화

## 🐛 트러블슈팅

### 빌드 실패

**문제**: 의존성 설치 실패

```bash
# 해결: pnpm-lock.yaml이 최신인지 확인
pnpm install
git add pnpm-lock.yaml
git commit -m "Update lock file"
```

**문제**: Build Command 오류

```bash
# Vercel 설정에서 Root Directory가 올바른지 확인
Root Directory: apps/storybook
```

### 경로 문제

**문제**: 정적 파일 404 오류

```bash
# Output Directory 확인
Output Directory: storybook-static
```

### Monorepo 관련

**문제**: Workspace 의존성 해결 실패

```bash
# Install Command에서 루트 디렉토리부터 설치하도록 설정
pnpm install
```

## 📊 배포 상태 확인

### 배포 로그

1. Vercel Dashboard → 프로젝트 선택
2. Deployments 탭
3. 최신 배포 클릭
4. Build Logs 확인

### 성능 모니터링

- Analytics 탭에서 트래픽 및 성능 지표 확인
- Speed Insights로 Core Web Vitals 모니터링

## 🔐 접근 제한 (선택사항)

### Vercel Authentication

프로덕션 환경에 접근 제한이 필요한 경우:

1. Settings → Deployment Protection
2. "Vercel Authentication" 활성화
3. 팀원 초대

### Password Protection

1. Settings → Deployment Protection
2. "Password Protection" 활성화
3. 비밀번호 설정

## 📝 체크리스트

배포 전 확인사항:

- [ ] `pnpm install` 정상 실행
- [ ] `pnpm run build` 로컬 빌드 성공
- [ ] `storybook-static` 디렉토리 생성 확인
- [ ] 모든 스토리가 정상 작동하는지 확인
- [ ] Git에 모든 변경사항 커밋
- [ ] Vercel 프로젝트 설정 완료

## 🎉 완료!

배포가 완료되면 다음 URL에서 확인할 수 있습니다:

- 프로덕션: `https://your-project.vercel.app`
- 미리보기: PR별 고유 URL

## 추가 리소스

- [Vercel Documentation](https://vercel.com/docs)
- [Storybook Deployment](https://storybook.js.org/docs/react/sharing/publish-storybook)
- [Monorepo with Vercel](https://vercel.com/docs/concepts/monorepos)
