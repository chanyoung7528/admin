# PNPM Catalogs 마이그레이션 완료

## 변경 사항

### ✅ 완료된 작업

1. **pnpm-workspace.yaml에 catalog 추가**
   - React 19.2.0 (stable)
   - TanStack Router 1.139.10 + Zod 4.1.13 (호환 버전)
   - 모든 주요 라이브러리를 stable 버전으로 구성

2. **모든 package.json 업데이트**
   - ✅ 루트 package.json
   - ✅ apps/my-app/package.json
   - ✅ apps/storybook/package.json
   - ✅ packages/shared/package.json
   - ✅ packages/core/package.json
   - ✅ packages/date-picker/package.json
   - ✅ packages/editor/package.json

### 🎯 주요 개선사항

#### 버전 호환성 해결

- **TanStack Router**: ^1.139.10 → Zod 4.x와 완벽 호환
- **React**: ^19.2.0 (stable, beta 버전 제거)
- **Zod**: ^4.1.13 (모든 프로젝트 통일)

#### 중앙 관리

모든 의존성이 `pnpm-workspace.yaml`에서 관리되어:

- 한 곳에서 버전 업데이트 가능
- 프로젝트 간 버전 불일치 방지
- 라이브러리 간 호환성 보장

## 다음 단계

### 1. 의존성 재설치 (필수)

```bash
# 기존 의존성 제거
rm -rf node_modules apps/*/node_modules packages/*/node_modules
rm pnpm-lock.yaml

# 새로운 catalog 기반으로 설치
pnpm install
```

### 2. 빌드 테스트

```bash
# 타입 체크
pnpm type-check

# 빌드
pnpm build

# 개발 서버 실행
pnpm dev:my-app
```

### 3. 검증

```bash
# 의존성 트리 확인
pnpm list --depth 1

# 특정 패키지 버전 확인
pnpm why zod
pnpm why @tanstack/react-router
```

## 사용 예시

### 새 의존성 추가

```bash
# 1. pnpm-workspace.yaml에 추가
catalog:
  new-package: ^1.0.0

# 2. 프로젝트에서 사용
cd apps/my-app
pnpm add new-package
# → 자동으로 "new-package": "catalog:"로 추가됨
```

### 버전 업데이트

```bash
# pnpm-workspace.yaml에서 버전만 변경
catalog:
  react: ^19.3.0  # 버전 업데이트

# 재설치
pnpm install
# → 모든 프로젝트가 자동으로 새 버전 사용
```

## 해결된 문제들

### ❌ Before: 버전 관리 문제

```json
// my-app/package.json
"zod": "^4.1.13"

// storybook/package.json
"zod": "^4.1.12"  // ⚠️ 버전 불일치

// core/package.json
"zod": "^4.1.12"  // ⚠️ 버전 불일치
```

### ✅ After: 중앙 관리

```yaml
# pnpm-workspace.yaml
catalog:
  zod: ^4.1.13 # 한 곳에서 관리
```

```json
// 모든 package.json
"zod": "catalog:"  // ✅ 항상 동일한 버전
```

## 주의사항

1. **workspace 프로토콜 유지**
   - 내부 패키지는 계속 `workspace:*` 사용
   - `@repo/shared`, `@repo/core` 등

2. **peerDependencies**
   - `catalog:` 프로토콜 사용 가능
   - React, React DOM 등에 적용됨

3. **호환성 테스트**
   - 의존성 재설치 후 반드시 빌드 테스트
   - E2E 테스트 실행 권장

## 문서

자세한 사용법은 `docs/PNPM_CATALOGS.md`를 참고하세요.
