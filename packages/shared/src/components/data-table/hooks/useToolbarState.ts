import { type Table } from '@tanstack/react-table';
import debounce from 'lodash-es/debounce';
import { useEffect, useMemo, useRef, useState } from 'react';

type FocusCacheEntry = {
  shouldKeepFocus: boolean;
  localValue: string;
};

const toolbarFocusCache = new Map<string, FocusCacheEntry>();

interface UseToolbarStateProps<TData = unknown> {
  table: Table<TData>;
  searchKey?: string;
  searchDebounceMs?: number;
  instanceId?: string;
  filters?: {
    columnId: string;
    title: string;
    options: {
      label: string;
      value: string;
      icon?: React.ComponentType<{ className?: string }>;
    }[];
  }[];
}

export function useToolbarState<TData = unknown>({
  table,
  searchKey,
  searchDebounceMs = 300,
  instanceId = 'data-table',
  filters = [],
}: UseToolbarStateProps<TData>) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const focusCacheKey = `${instanceId}-${searchKey ?? 'global'}`;
  const cachedFocusState = toolbarFocusCache.get(focusCacheKey);

  // 초기값 계산
  const initialValue = useMemo(() => {
    if (searchKey) {
      return (table.getColumn(searchKey)?.getFilterValue() as string) ?? '';
    }
    return table.getState().globalFilter ?? '';
  }, [searchKey, table]);

  // 상태 관리
  const [localSearchValue, setLocalSearchValue] = useState<string>(cachedFocusState?.localValue ?? initialValue);
  const [shouldKeepFocus, setShouldKeepFocus] = useState<boolean>(cachedFocusState?.shouldKeepFocus ?? false);
  const [isResetting, setIsResetting] = useState<boolean>(false);

  // 각 필터의 selectedValues를 관리하는 state
  const [filterSelectedValues, setFilterSelectedValues] = useState<Map<string, Set<string>>>(() => {
    const initialMap = new Map<string, Set<string>>();
    filters.forEach(filter => {
      const column = table.getColumn(filter.columnId);
      const filterValue = column?.getFilterValue() as string[] | undefined;
      initialMap.set(filter.columnId, new Set(filterValue ?? []));
    });
    return initialMap;
  });

  // 테이블의 현재 검색값
  const tableSearchValue = searchKey ? ((table.getColumn(searchKey)?.getFilterValue() as string) ?? '') : (table.getState().globalFilter ?? '');

  // 입력창에 표시할 값 결정
  const inputValue = isResetting || shouldKeepFocus ? localSearchValue : tableSearchValue;

  // 디바운스된 검색 적용 함수
  const debouncedApplySearch = useMemo(
    () =>
      debounce((value: string) => {
        if (searchKey) {
          table.getColumn(searchKey)?.setFilterValue(value);
        } else {
          table.setGlobalFilter(value);
        }
      }, searchDebounceMs),
    [searchKey, searchDebounceMs, table]
  );

  // 클린업
  useEffect(() => {
    return () => {
      debouncedApplySearch.cancel();
    };
  }, [debouncedApplySearch]);

  // 포커스 유지 효과
  useEffect(() => {
    if (shouldKeepFocus && inputRef.current && document.activeElement !== inputRef.current) {
      inputRef.current.focus();
      const length = inputRef.current.value.length;
      inputRef.current.setSelectionRange(length, length);
    }
  }, [shouldKeepFocus, localSearchValue]);

  // 핸들러들
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setLocalSearchValue(value);
    debouncedApplySearch(value);
  };

  const handleInputFocus = () => {
    setShouldKeepFocus(true);
  };

  const handleInputBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const relatedTarget = event.relatedTarget as HTMLElement;

    if (relatedTarget && event.currentTarget.closest('.toolbar-container')?.contains(relatedTarget)) {
      return;
    }

    setShouldKeepFocus(false);
  };

  const handleReset = () => {
    setIsResetting(true);
    setShouldKeepFocus(true);

    debouncedApplySearch.cancel();
    setLocalSearchValue('');
    debouncedApplySearch('');

    const newFilterSelectedValues = new Map<string, Set<string>>();
    filters.forEach(filter => {
      newFilterSelectedValues.set(filter.columnId, new Set());
      const column = table.getColumn(filter.columnId);
      column?.setFilterValue(undefined);
    });
    setFilterSelectedValues(newFilterSelectedValues);

    table.resetColumnFilters();

    if (inputRef.current) {
      inputRef.current.focus();
    }

    setTimeout(() => {
      setIsResetting(false);
    }, 100);
  };

  // 필터 적용 여부 계산
  const tableState = table.getState();
  const isFiltered = tableState.columnFilters.length > 0 || !!tableState.globalFilter;

  return {
    inputRef,
    inputValue,
    filterSelectedValues,
    isFiltered,
    setFilterSelectedValues,
    handleSearchChange,
    handleInputFocus,
    handleInputBlur,
    handleReset,
  };
}
