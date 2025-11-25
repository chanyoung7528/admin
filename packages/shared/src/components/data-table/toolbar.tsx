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
};

export function DataTableToolbar<TData>({
  table,
  searchPlaceholder = 'Filter...',
  searchKey,
  filters = [],
  searchDebounceMs = 300,
  instanceId = 'data-table',
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0 || table.getState().globalFilter;

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
  const tableSearchValue = searchKey ? ((table.getColumn(searchKey)?.getFilterValue() as string) ?? '') : (table.getState().globalFilter ?? '');
  const inputValue = shouldKeepFocus ? localSearchValue : tableSearchValue;

  useEffect(() => {
    toolbarFocusCache.set(focusCacheKey, { shouldKeepFocus, localValue: localSearchValue });
  }, [focusCacheKey, shouldKeepFocus, localSearchValue]);

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
    debouncedApplySearch.cancel();
    table.resetColumnFilters();
    if (searchKey) {
      table.getColumn(searchKey)?.setFilterValue('');
    } else {
      table.setGlobalFilter('');
    }
    setLocalSearchValue(''); // 로컬 상태도 초기화
    if (inputRef.current) {
      inputRef.current.focus();
      setShouldKeepFocus(true);
      setLocalSearchValue('');
    }
  };

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

            return <DataTableFacetedFilter key={filter.columnId} column={column} title={filter.title} options={filter.options} />;
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
