# DataTable 아키텍처 (@repo/shared)

## 구성 요소

```text
packages/shared/src/components/data-table/
├── data-table.tsx              # 메인 UI
├── toolbar.tsx                 # 검색/필터/리셋
├── faceted-filter.tsx          # 다중 선택 필터
├── pagination.tsx              # 페이지네이션
├── hooks/
│   ├── useDataTableState.ts    # TanStack Table 인스턴스 + 상태 관리
│   ├── useToolbarState.ts      # 툴바 입력/포커스/디바운스(300ms)
│   ├── usePaginationState.ts   # 페이지네이션 계산/핸들러
│   └── useFacetedFilterState.ts
├── useTableUrlState.ts         # URL ↔ 테이블 상태 동기화
└── useDataTableController.ts   # URL + 서버 페칭 + 디바운스(500ms)
```

---

## 데이터 흐름(원격 테이블)

1. **사용자 입력**
   - 검색/필터/정렬/페이지 변경

2. **TanStack Table 상태 변경**
   - `DataTable`은 controlled/uncontrolled 모두 지원
   - 컨트롤러 사용 시 `useDataTableController`가 내려주는 `tableProps`로 controlled 모드 동작

3. **URL(Search Params) 동기화**
   - `useTableUrlState`가 `page/pageSize/filter/sortBy/sortOrder` 및 커스텀 필터를 URL에 반영
   - 브라우저 히스토리(뒤로/앞으로)로 상태 복구

4. **서버 페칭 파라미터 생성**
   - `useDataTableController`가 URL 상태를 `apiParams`로 변환
   - 글로벌 검색어는 **디바운스(기본 500ms)** 후 반영

5. **도메인 쿼리 훅 호출**
   - `useQueryHook(apiParams)` → `{ data, total, isLoading, isError }`

6. **렌더링**
   - `DataTable`이 스켈레톤/데이터/빈 상태/페이지네이션 렌더링

---

## Debounce 이중 설계

- **툴바 입력 디바운스(300ms)**: 입력 UI가 끊기지 않도록 TanStack Table의 `globalFilter` 적용 지연
- **서버 페칭 디바운스(500ms)**: API 호출 폭증 방지, `apiParams` 반영 지연

> 입력(UI 즉시) → URL 반영(툴바 디바운스) → API 호출(컨트롤러 디바운스)

---

## 페이지 범위 보정

- `total` 기반으로 `pageCount` 계산
- 현재 페이지가 범위를 벗어나면 `ensurePageInRange`로 1페이지(또는 마지막 페이지)로 보정

---

## 참고

- 기본 사용법: [README.md](./README.md)
- 실제 예시: `apps/my-app/src/domains/settlement`
