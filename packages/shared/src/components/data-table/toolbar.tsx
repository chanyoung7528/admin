import { Button } from '@shared/ui/button';
import { Input } from '@shared/ui/input';
import { type Table } from '@tanstack/react-table';
import { CrossIcon } from 'lucide-react';
import { DataTableFacetedFilter } from './faceted-filter';
import { useToolbarState } from './hooks';

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
  const {
    inputRef,
    inputValue,
    filterSelectedValues,
    isFiltered: calculatedIsFiltered,
    setFilterSelectedValues,
    handleSearchChange,
    handleInputFocus,
    handleReset,
  } = useToolbarState({
    table,
    searchKey,
    searchDebounceMs,
    instanceId,
    filters,
  });

  const isFiltered = propIsFiltered ?? calculatedIsFiltered;

  return (
    <div className="toolbar-container flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        <Input
          ref={inputRef}
          placeholder={searchPlaceholder}
          value={inputValue}
          onChange={handleSearchChange}
          onFocus={handleInputFocus}
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
