# 빠른 시작 가이드

5분 안에 프로젝트를 시작하는 방법을 설명합니다.

## 1단계: 설치 (1분)

```bash
# 저장소 클론
git clone <repository-url>
cd admin

# 의존성 설치
pnpm install
```

## 2단계: 환경 설정 (1분)

```bash
# 환경변수 파일 복사
cp apps/my-app/.env.development.example apps/my-app/.env.development

# 환경변수 수정
# apps/my-app/.env.development
VITE_API_BASE_URL=https://your-api-server.com
```

## 3단계: 실행 (1분)

```bash
# 대시보드 실행
pnpm dev:my-app

# 또는 스토리북 실행
pnpm dev:storybook
```

브라우저에서 확인:

- 대시보드: http://localhost:3000
- 스토리북: http://localhost:6006

## 4단계: 첫 페이지 만들기 (2분)

### 1. 도메인 생성

```bash
mkdir -p apps/my-app/src/domains/product/{components,hooks,services,types}
```

### 2. 타입 정의

```tsx
// apps/my-app/src/domains/product/types/product.ts
export interface Product {
  id: number;
  name: string;
  price: number;
}
```

### 3. API 서비스

```tsx
// apps/my-app/src/domains/product/services/productService.ts
import { api } from '@repo/core/api';

export async function getProducts() {
  const { data } = await api.get('/products');
  return data;
}
```

### 4. 훅 생성

```tsx
// apps/my-app/src/domains/product/hooks/useProducts.ts
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../services';

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });
}
```

### 5. 컴포넌트 생성

```tsx
// apps/my-app/src/domains/product/components/ProductList.tsx
import { useProducts } from '../hooks';

export function ProductList() {
  const { data: products, isLoading } = useProducts();

  if (isLoading) return <div>로딩 중...</div>;

  return (
    <div>
      <h2>제품 목록</h2>
      {products?.map(product => (
        <div key={product.id}>
          {product.name} - {product.price}원
        </div>
      ))}
    </div>
  );
}
```

### 6. 페이지 생성

```tsx
// apps/my-app/src/pages/_authenticated/product/index.tsx
import { createFileRoute } from '@tanstack/react-router';
import { ProductList } from '@/domains/product/components/ProductList';

export const Route = createFileRoute('/_authenticated/product/')({
  component: ProductPage,
});

function ProductPage() {
  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">제품 관리</h1>
      <ProductList />
    </div>
  );
}
```

### 7. 확인

브라우저에서 http://localhost:3000/product 접속!

## 다음 단계

### 테이블 추가

```bash
# 컬럼 정의
# domains/product/columns/productColumns.tsx

# 테이블 컨트롤러 훅
# domains/product/hooks/useProductTable.ts

# 컴포넌트에서 사용
<DataTable {...tableProps} />
```

📖 **상세 가이드**: [테이블 개발 가이드](TABLE_GUIDE.md)

### 폼 추가

```bash
# Zod 스키마 정의
# domains/product/schemas/productSchema.ts

# 폼 컴포넌트
# domains/product/components/ProductForm.tsx

# 페이지에서 사용
<ProductForm onSubmit={handleSubmit} />
```

📖 **상세 가이드**: [폼 개발 가이드](FORM_GUIDE.md)

### 생성/수정/삭제 추가

```bash
# Mutation 훅 생성
# domains/product/hooks/useProductMutations.ts

export function useCreateProduct() {
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
```

📖 **상세 가이드**: [API 통합 가이드](API_INTEGRATION.md)

## 주요 명령어

```bash
# 개발
pnpm dev:my-app              # 대시보드 개발 서버
pnpm dev:storybook           # 스토리북 개발 서버

# 빌드
pnpm build:my-app            # 대시보드 빌드
pnpm build:storybook         # 스토리북 빌드

# 코드 품질
pnpm lint                    # 린트 검사
pnpm lint:fix                # 린트 자동 수정
pnpm format                  # 코드 포맷팅
pnpm type-check              # 타입 체크

# 정리
pnpm clean                   # 전체 정리
pnpm clean:cache             # 캐시만 정리
```

## 폴더 구조 요약

```
apps/my-app/src/
├── domains/              # 비즈니스 도메인
│   └── [domain]/
│       ├── components/   # UI 컴포넌트
│       ├── hooks/        # 커스텀 훅
│       ├── services/     # API 호출
│       ├── schemas/      # Zod 스키마
│       ├── types/        # 타입 정의
│       └── columns/      # 테이블 컬럼
└── pages/                # 라우트 (파일 기반)
    ├── _authenticated/   # 인증 필요
    └── _public/          # 공개
```

## 개발 패턴 요약

**API 통합**: 서비스 → 훅 → 컴포넌트

**테이블**: 컬럼 정의 → 컨트롤러 훅 → DataTable

**폼**: Zod 스키마 → React Hook Form → FormTable

**상태 관리**: 서버 상태(TanStack Query) + 클라이언트 상태(Zustand)

## 문제 해결

### 환경변수가 인식 안 됨

```bash
# 개발 서버 재시작 필요
pnpm dev:my-app
```

### API 요청이 CORS 에러

```bash
# vite.config.ts에서 프록시 설정 확인
# .env.development에서 VITE_API_PROXY_PREFIX 설정
```

### 타입 에러

```bash
# 타입 체크로 확인
pnpm type-check

# routeTree 재생성
rm apps/my-app/src/routeTree.gen.ts
pnpm dev:my-app
```

## 도움말

### 전체 가이드

- [README](../README.md) - 프로젝트 개요
- [패키지 가이드](PACKAGES_GUIDE.md) - 패키지별 사용법
- [도메인 구조](DOMAIN_STRUCTURE.md) - 도메인 설계
- [API 통합](API_INTEGRATION.md) - API 연동
- [테이블 개발](TABLE_GUIDE.md) - 테이블 구현
- [폼 개발](FORM_GUIDE.md) - 폼 구현
- [라우팅](ROUTING_GUIDE.md) - 라우팅 설정

### 외부 문서

- [TanStack Router](https://tanstack.com/router/latest)
- [TanStack Query](https://tanstack.com/query/latest)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)

## 다음은?

1. ✅ 기본 페이지 생성 완료
2. 📖 [테이블 개발 가이드](TABLE_GUIDE.md) - 테이블 추가
3. 📖 [폼 개발 가이드](FORM_GUIDE.md) - 생성/수정 폼 추가
4. 📖 [API 통합 가이드](API_INTEGRATION.md) - CRUD 완성

프로젝트 구조와 패턴에 익숙해지면 빠르게 개발할 수 있습니다!
