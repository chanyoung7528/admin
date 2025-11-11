# My Admin App

TanStack Router 기반의 관리자 대시보드 애플리케이션

## 프로젝트 구조

```
src/
├── domains/          # 비즈니스 로직 및 기능별 컴포넌트
│   ├── user/         # 사용자 관리 도메인
│   ├── site/         # Site(B2B 고객사) 관리 도메인
│   ├── billing/      # 결제/정산 도메인
│   ├── inquiry/      # 1:1 문의 도메인
│   ├── monitoring/   # 모니터링 도메인
│   ├── productBody/  # MY BODY 서비스 도메인
│   ├── productFood/  # MY FOOD 서비스 도메인
│   └── productMind/  # MY MIND 서비스 도메인
│
├── shared/           # 공통 모듈 (재사용 UI, 유틸)
│   ├── components/   # 공통 컴포넌트
│   ├── hooks/        # 공통 훅
│   ├── utils/        # 유틸리티 함수
│   └── types/        # 공통 타입
│
├── core/             # 핵심 인프라
│   ├── api/          # axios 인스턴스, API 클라이언트
│   ├── auth/         # 인증 컨텍스트, 로그인/로그아웃 로직
│   ├── router/       # 라우트 설정
│   └── stores/       # 전역 상태 관리
│
└── pages/            # TanStack Router 페이지
    ├── __root.tsx    # 루트 레이아웃
    ├── index.tsx     # 대시보드 (/)
    ├── login.tsx     # 로그인
    ├── user/         # 사용자 관리
    ├── inquiry/      # 1:1 문의
    ├── monitoring/   # 모니터링
    ├── report/       # 리포트
    ├── my-body/      # MY BODY
    ├── my-food/      # MY FOOD
    └── my-mind/      # MY MIND
```

## 주요 기능

### 메뉴 구조

- **대시보드** (`/`) - 사용자 인사이트 제공
- **사용자 관리**
  - 사용자 현황 (`/user/list`)
  - 메시지 발송 (`/user/message`)
- **1:1 문의/요청 관리** (`/inquiry`)
- **모니터링** (`/monitoring`) - 기기 작동 현황
- **리포트** (`/report`) - Site별 운영 현황
- **MY BODY**
  - 이용 현황 대시보드 (`/my-body/dashboard`)
  - 정산 관리 (`/my-body/settlement`)
- **MY FOOD**
  - 발주 관리 (`/my-food/order`)
  - 계산서 출력 (`/my-food/invoice`)
  - 이용 현황 대시보드 (`/my-food/dashboard`)
  - B2B 정산 관리 (`/my-food/settlement`)
- **MY MIND**
  - 콘텐츠 이용 내역 (`/my-mind/usage`)
  - 계산서 출력 (`/my-mind/invoice`)
  - 이용 현황 대시보드 (`/my-mind/dashboard`)
  - B2B 정산 관리 (`/my-mind/settlement`)

## 기술 스택

- **프레임워크**: React 19
- **라우터**: TanStack Router (파일 기반 라우팅)
- **상태 관리**:
  - TanStack Query (서버 상태)
  - Zustand (클라이언트 상태)
- **스타일링**: Tailwind CSS v4
- **UI 컴포넌트**: @repo/shared (공유 패키지)
- **빌드 도구**: Vite
- **타입체킹**: TypeScript

## 개발 시작

```bash
# 의존성 설치
pnpm install

# 개발 서버 시작
pnpm dev

# 빌드
pnpm build
```

## 환경 변수

`.env` 파일을 생성하고 다음 변수를 설정하세요:

```env
VITE_API_BASE_URL=https://api.example.com
```

## 개발 가이드

### 새로운 도메인 추가

1. `src/domains/` 에 새 폴더 생성
2. `components/`, `hooks/`, `services/` 폴더 생성
3. 각 폴더에 `index.ts` export 파일 생성

### 새로운 페이지 추가

1. `src/pages/` 에 TanStack Router 규칙에 따라 파일 생성
   - `user/list.tsx` → `/user/list` 경로
   - `user/index.tsx` → `/user` 경로
2. `createFileRoute()`를 사용하여 라우트 생성

### API 호출

```typescript
import { apiClient } from '@/core/api';

// GET 요청
const data = await apiClient.get('/users');

// POST 요청
const result = await apiClient.post('/users', { name: 'John' });
```

### TanStack Query 사용

```typescript
import { useQuery } from '@tanstack/react-query';

export function useUsersQuery() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const data = await apiClient.get('/users');
      return data;
    },
  });
}
```

## 폴더 구조 설계 원칙

### 도메인 주도 설계 (DDD)

각 비즈니스 도메인은 독립적으로 구성되어 있으며, 해당 도메인의 컴포넌트, 훅, 서비스를 포함합니다.

### 관심사의 분리

- `domains/`: 비즈니스 로직
- `shared/`: 재사용 가능한 공통 모듈
- `core/`: 애플리케이션 인프라
- `pages/`: 라우팅 및 페이지 조합

### 확장성

새로운 기능 추가 시 기존 코드에 영향을 최소화하도록 설계되었습니다.
