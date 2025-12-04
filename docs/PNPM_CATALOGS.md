# PNPM Catalogs 가이드

## 개요

이 프로젝트는 PNPM Catalogs를 사용하여 모노레포 전체의 의존성 버전을 중앙 관리합니다. 이를 통해 버전 불일치 문제를 방지하고, 라이브러리 업데이트를 쉽게 관리할 수 있습니다.

## 카탈로그 구조

모든 버전은 `pnpm-workspace.yaml`의 `catalog` 섹션에서 관리됩니다.

### 주요 버전 정보

#### React 생태계

- React: `^19.2.0`
- React DOM: `^19.2.0`
- @types/react: `^19.2.7`
- @types/react-dom: `^19.2.3`

#### TanStack 생태계

- @tanstack/react-router: `^1.139.10` (zod 4.x와 호환)
- @tanstack/react-query: `^5.90.11`
- @tanstack/react-table: `^8.21.3`

#### Form & Validation

- react-hook-form: `^7.66.1`
- @hookform/resolvers: `^5.2.2`
- zod: `^4.1.13`

#### Build Tools

- vite: `^7.2.4`
- typescript: `~5.9.3`

## 사용법

### 새로운 의존성 추가하기

1. **카탈로그에 버전 추가**

`pnpm-workspace.yaml`에 새 패키지를 추가합니다:

```yaml
catalog:
  new-package: ^1.0.0
```

2. **프로젝트에서 사용**

각 프로젝트의 `package.json`에서 `catalog:` 프로토콜을 사용합니다:

```json
{
  "dependencies": {
    "new-package": "catalog:"
  }
}
```

### 버전 업데이트하기

1. `pnpm-workspace.yaml`에서 원하는 패키지의 버전을 업데이트합니다
2. 루트 디렉토리에서 `pnpm install`을 실행합니다

```bash
pnpm install
```

모든 프로젝트가 자동으로 새 버전을 사용하게 됩니다.

### 특정 프로젝트에서 다른 버전 사용하기

특별한 경우 특정 프로젝트에서만 다른 버전이 필요하다면, 직접 버전을 명시할 수 있습니다:

```json
{
  "dependencies": {
    "some-package": "^2.0.0" // catalog: 대신 직접 버전 지정
  }
}
```

## 장점

### 1. 중앙화된 버전 관리

- 한 곳에서 모든 의존성 버전 관리
- 업데이트 시 한 번만 수정하면 전체 프로젝트에 반영

### 2. 버전 불일치 방지

- TanStack Router + Zod 같은 라이브러리 간 호환성 문제 해결
- peerDependencies 불일치 경고 방지

### 3. 유지보수성 향상

- 새로운 개발자가 프로젝트 이해하기 쉬움
- 의존성 업데이트 시 영향 범위 파악 용이

### 4. 일관성 보장

- 모든 프로젝트가 동일한 stable 버전 사용
- 빌드 환경 재현성 향상

## 주의사항

### 1. 호환성 확인

버전 업데이트 시 반드시 호환성을 확인하세요:

- TanStack Router는 Zod 4.x와 호환됩니다
- React 19는 모든 Radix UI 컴포넌트와 호환됩니다

### 2. Breaking Changes

major 버전 업데이트 시:

1. 변경사항(CHANGELOG) 확인
2. 테스트 실행
3. 단계적 업데이트 고려

### 3. Workspace 프로토콜

내부 패키지는 여전히 `workspace:*`를 사용합니다:

```json
{
  "dependencies": {
    "@repo/shared": "workspace:*" // 내부 패키지
  }
}
```

## 명령어

### 의존성 설치

```bash
pnpm install
```

### 특정 프로젝트에 의존성 추가

```bash
pnpm --filter my-app add new-package
```

카탈로그에 있는 패키지라면 자동으로 `catalog:` 프로토콜이 적용됩니다.

### 모든 의존성 업데이트 확인

```bash
pnpm outdated
```

### 카탈로그 검증

```bash
pnpm install --frozen-lockfile
```

## 문제 해결

### "Cannot find version in catalog" 오류

- `pnpm-workspace.yaml`의 `catalog` 섹션에 패키지가 정의되어 있는지 확인
- 패키지 이름 철자 확인

### 버전 충돌

1. `node_modules` 삭제
2. `pnpm-lock.yaml` 삭제
3. `pnpm install` 재실행

```bash
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

## 참고 자료

- [PNPM Catalogs 공식 문서](https://pnpm.io/catalogs)
- [TanStack Router 호환성](https://tanstack.com/router/latest)
- [Zod 마이그레이션 가이드](https://zod.dev/)
