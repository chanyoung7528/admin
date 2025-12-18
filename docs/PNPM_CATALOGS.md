# PNPM Catalogs 가이드

## 개요

이 프로젝트는 **PNPM Catalogs**로 모노레포 전역 의존성 버전을 중앙에서 관리합니다.

- **단일 소스 오브 트루스**: `pnpm-workspace.yaml`의 `catalog:` 섹션
- **패키지 선언 방식**: 각 패키지의 `package.json`에서 버전을 `"catalog:"`로 지정

## 현재 catalog(요약)

정확한 값은 항상 `pnpm-workspace.yaml`을 기준으로 합니다. (아래는 현재 코드 기준 요약)

- **React**: `react ^19.2.1`, `react-dom ^19.2.1`
- **TanStack**: `@tanstack/react-router ^1.139.14`, `@tanstack/react-query ^5.90.11`, `@tanstack/react-table ^8.21.3`
- **Form/Validation**: `react-hook-form ^7.68.0`, `@hookform/resolvers ^5.2.2`, `zod ^4.1.13`
- **Build**: `vite ^7.2.6`, `typescript ~5.9.3`

## 사용법

### 새로운 의존성 추가(권장 플로우)

Catalog로 관리하려는 의존성이라면 아래 순서로 추가합니다.

1. `pnpm-workspace.yaml`에 버전 추가

```yaml
catalog:
  new-package: ^1.0.0
```

2. 대상 패키지의 `package.json`에 `"catalog:"`로 선언

```json
{
  "dependencies": {
    "new-package": "catalog:"
  }
}
```

3. 루트에서 설치

```bash
pnpm install
```

### 내부 워크스페이스 패키지 추가

내부 패키지는 `workspace:*`를 사용합니다.

```json
{
  "dependencies": {
    "@repo/shared": "workspace:*"
  }
}
```

### 버전 업데이트

1. `pnpm-workspace.yaml`의 `catalog:` 버전을 수정
2. `pnpm install` 실행

```bash
pnpm install
```

### 특정 패키지만 예외 버전 사용

정말 필요한 경우에만, 해당 패키지의 `package.json`에 직접 버전을 고정합니다.

```json
{
  "dependencies": {
    "some-package": "^2.0.0"
  }
}
```

## 자주 쓰는 명령어

```bash
# 의존성 설치
pnpm install

# 업데이트 확인
pnpm outdated

# CI/재현성 검증
pnpm install --frozen-lockfile
```

## 문제 해결

### "Cannot find version in catalog"

- `pnpm-workspace.yaml`의 `catalog:`에 패키지가 존재하는지 확인
- 패키지 이름 오타 확인

### 버전 충돌/의존성 꼬임

1. 캐시/빌드 산출물 정리 후 재설치

```bash
pnpm clean
pnpm install
```

2. (최후 수단) lockfile 재생성

```bash
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

## 참고

- [PNPM Catalogs](https://pnpm.io/catalogs)
