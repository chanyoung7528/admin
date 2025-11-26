# DataTable 검색 디바운스 적용

## 문제 상황

테이블 검색 입력 시마다 API가 즉시 호출되어 사용성이 좋지 않았습니다.

## 해결 방법

`lodash-es`의 `debounce`를 사용하여 검색어 입력 후 500ms 대기 후 API 호출하도록 개선했습니다.

## 적용 내용

### 1. lodash-es 설치

```bash
pnpm add lodash-es
pnpm add -D @types/lodash-es
```

### 2. useDataTableController에 디바운스 로직 추가

```typescript
import debounce from 'lodash-es/debounce';

// 검색어를 위한 로컬 상태 (즉시 UI 업데이트용)
const [debouncedGlobalFilter, setDebouncedGlobalFilter] = useState(globalFilter);
const [isSearching, setIsSearching] = useState(false);

// 디바운스된 업데이트 함수 (500ms 대기)
const debouncedUpdate = useRef(
  debounce((value: string | undefined) => {
    setDebouncedGlobalFilter(value);
    setIsSearching(false);
  }, searchDebounceMs)
).current;

// globalFilter 변경 시 디바운스 적용
useEffect(() => {
  if (globalFilter !== debouncedGlobalFilter) {
    setIsSearching(true);
    debouncedUpdate(globalFilter);
  }

  return () => {
    debouncedUpdate.cancel();
  };
}, [globalFilter, debouncedGlobalFilter, debouncedUpdate]);
```

### 3. 검색 중 로딩 상태 표시

```typescript
// 검색 중이거나 API 로딩 중일 때 로딩 표시
const effectiveIsLoading = isLoading || isSearching;
```

## 동작 방식

1. **사용자 입력**: 검색창에 텍스트 입력
2. **즉시 UI 반영**: globalFilter 상태가 즉시 업데이트되어 입력이 끊기지 않음
3. **디바운스 대기**: 500ms 동안 추가 입력이 없으면 API 호출
4. **로딩 표시**: 디바운스 중에는 `isSearching=true`로 로딩 표시
5. **API 호출**: debouncedGlobalFilter로 실제 API 호출

## 커스터마이징

디바운스 시간을 변경하려면 `searchDebounceMs` 옵션을 사용하세요:

```typescript
export function useSettlementTable({ service }) {
  return useDataTableController({
    // ... 기타 설정
    searchDebounceMs: 300, // 300ms로 변경 (기본값: 500ms)
  });
}
```

## 효과

- ✅ 불필요한 API 호출 감소 (타이핑할 때마다 → 입력 완료 후)
- ✅ 서버 부하 감소
- ✅ 네트워크 트래픽 절감
- ✅ 사용자 경험 개선 (입력이 끊기지 않음)
- ✅ 검색 중 시각적 피드백 제공
