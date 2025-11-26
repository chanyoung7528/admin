import { Button } from '@shared/ui/button';
import { Input } from '@shared/ui/input';
import { type Table } from '@tanstack/react-table';
import debounce from 'lodash-es/debounce';
import { CrossIcon } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { DataTableFacetedFilter } from './faceted-filter';

type FocusCacheEntry = {
  shouldKeepFocus: boolean;
  localValue: string;
};

const toolbarFocusCache = new Map<string, FocusCacheEntry>();

type DataTableToolbarProps<TData> = {
  table: Table<TData>;
  searchPlaceholder?: string;
  searchKey?: string;
  filters?: {
    columnId: string;
    title: string;
    options: {
      label: string;
      value: string;
      icon?: React.ComponentType<{ className?: string }>;
    }[];
  }[];
  searchDebounceMs?: number;
  instanceId?: string;
  isFiltered?: boolean;
};

export function DataTableToolbar<TData>({
  table,
  searchPlaceholder = 'Filter...',
  searchKey,
  filters = [],
  searchDebounceMs = 300,
  instanceId = 'data-table',
  isFiltered: propIsFiltered,
}: DataTableToolbarProps<TData>) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const focusCacheKey = `${instanceId}-${searchKey ?? 'global'}`;
  const cachedFocusState = toolbarFocusCache.get(focusCacheKey);

  const initialValue = useMemo(() => {
    if (searchKey) {
      return (table.getColumn(searchKey)?.getFilterValue() as string) ?? '';
    }
    return table.getState().globalFilter ?? '';
  }, [searchKey, table]);

  const [localSearchValue, setLocalSearchValue] = useState<string>(cachedFocusState?.localValue ?? initialValue);
  const [shouldKeepFocus, setShouldKeepFocus] = useState<boolean>(cachedFocusState?.shouldKeepFocus ?? false);

  // 각 필터의 selectedValues를 관리하는 state (columnId를 key로 사용)
  const [filterSelectedValues, setFilterSelectedValues] = useState<Map<string, Set<string>>>(() => {
    const initialMap = new Map<string, Set<string>>();
    filters.forEach(filter => {
      const column = table.getColumn(filter.columnId);
      const filterValue = column?.getFilterValue() as string[] | undefined;
      initialMap.set(filter.columnId, new Set(filterValue ?? []));
    });
    return initialMap;
  });

  const tableSearchValue = searchKey ? ((table.getColumn(searchKey)?.getFilterValue() as string) ?? '') : (table.getState().globalFilter ?? '');
  const inputValue = shouldKeepFocus ? localSearchValue : tableSearchValue;

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

  useEffect(() => {
    return () => {
      debouncedApplySearch.cancel();
    };
  }, [debouncedApplySearch]);

  useEffect(() => {
    if (shouldKeepFocus && inputRef.current && document.activeElement !== inputRef.current) {
      inputRef.current.focus();
      const length = inputRef.current.value.length;
      inputRef.current.setSelectionRange(length, length);
    }
  }, [shouldKeepFocus, localSearchValue]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setLocalSearchValue(value); // 즉시 UI 업데이트
    debouncedApplySearch(value);
  };

  const handleInputFocus = () => {
    setShouldKeepFocus(true);
    setLocalSearchValue(tableSearchValue);
  };

  const handleInputBlur = () => {
    setShouldKeepFocus(false);
  };

  const handleReset = () => {
    setLocalSearchValue(''); // 그 다음 로컬 값 초기화

    // 4. 검색 필터를 즉시 빈 문자열로 설정 (디바운스 없이 즉시 적용)
    if (searchKey) {
      table.getColumn(searchKey)?.setFilterValue('');
    } else {
      table.setGlobalFilter('');
    }

    // 5. 모든 faceted 필터의 selectedValues를 빈 Set으로 초기화
    const newFilterSelectedValues = new Map<string, Set<string>>();
    filters.forEach(filter => {
      newFilterSelectedValues.set(filter.columnId, new Set());
      const column = table.getColumn(filter.columnId);
      column?.setFilterValue(undefined);
    });
    setFilterSelectedValues(newFilterSelectedValues);

    // 6. 테이블 전체 필터 초기화 (안전장치)
    table.resetColumnFilters();
  };

  // 테이블 상태에서 필터 여부를 직접 계산 (매 렌더마다 최신 값 반영)
  // prop으로 전달받은 값이 있으면 그것을 사용 (React 상태 동기화 보장)
  const tableState = table.getState();
  const isFiltered = propIsFiltered ?? (tableState.columnFilters.length > 0 || !!tableState.globalFilter);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        <Input
          ref={inputRef}
          placeholder={searchPlaceholder}
          value={inputValue}
          onChange={handleSearchChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        <div className="flex gap-x-2">
          {filters.map(filter => {
            const column = table.getColumn(filter.columnId);
            if (!column) return null;

            const selectedValues = filterSelectedValues.get(filter.columnId) ?? new Set<string>();

            const handleSelectedValuesChange = (newValues: Set<string>) => {
              setFilterSelectedValues(prev => {
                const newMap = new Map(prev);
                newMap.set(filter.columnId, newValues);
                return newMap;
              });
            };

            return (
              <DataTableFacetedFilter
                key={filter.columnId}
                column={column}
                title={filter.title}
                options={filter.options}
                selectedValues={selectedValues}
                onSelectedValuesChange={handleSelectedValuesChange}
              />
            );
          })}
        </div>
        {isFiltered && (
          <Button variant="ghost" onClick={handleReset} className="h-8 px-2 lg:px-3">
            Reset
            <CrossIcon className="ms-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
