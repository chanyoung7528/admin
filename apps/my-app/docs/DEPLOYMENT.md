# my-app Vercel 배포 가이드

이 문서는 `apps/my-app`을 Vercel에 배포하는 방법을 설명합니다.

---

## 1. Vercel 프로젝트 기본 설정

### Root Directory

- `apps/my-app`

### SPA 라우팅(rewrite)

`apps/my-app/vercel.json`에 SPA rewrite가 포함되어 있습니다.

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## 2. Build/Install/Dev Command (모노레포 기준)

`apps/my-app/vercel.json` 기준(현 코드):

- **Install Command**: `pnpm install --frozen-lockfile`
- **Build Command**: `cd ../.. && pnpm install --frozen-lockfile && pnpm run build:my-app`
- **Dev Command**: `pnpm run dev`
- **Output Directory**: `dist`

> Vercel UI에서 명령을 직접 지정하는 경우에도 위 설정과 동일하게 맞추는 것을 권장합니다.

---

## 3. 환경 변수

`@repo/core/config(env)`에서 아래 값을 사용합니다.

- `VITE_API_BASE_URL` (필수)
- `VITE_API_PROXY_PREFIX` (선택, 기본 `/api`)
- `VITE_API_TIMEOUT` (선택, 기본 `30000`)
- `VITE_API_ACCEPT_LANGUAGE` (선택, 기본 `ko-KR`)
- `VITE_FEATURE_DEBUG` (선택, 기본 `false`)

Vercel: Settings → Environment Variables에 동일 키로 등록합니다.

예시(프로덕션):

```text
VITE_API_BASE_URL=https://api.example.com
VITE_API_TIMEOUT=30000
VITE_API_ACCEPT_LANGUAGE=ko-KR
VITE_FEATURE_DEBUG=false
```

---

## 4. Storybook 분리

- Storybook은 `apps/storybook`으로 **별도 프로젝트**로 운영합니다.
- `apps/my-app/.vercelignore`에서 storybook 디렉토리가 제외됩니다.

---

## 5. 배포 전 로컬 체크

```bash
# 빌드
pnpm build:my-app

# (선택) 프리뷰
pnpm --filter my-app preview
```

---

## 참고

- [Vercel - Monorepos](https://vercel.com/docs/monorepos)
- [Vite - Static Deploy](https://vite.dev/guide/static-deploy.html)
