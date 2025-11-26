import { type Column } from '@tanstack/react-table';

interface UseFacetedFilterStateProps<TData, TValue> {
  column?: Column<TData, TValue>;
  selectedValues: Set<string>;
  onSelectedValuesChange: (values: Set<string>) => void;
}

export function useFacetedFilterState<TData, TValue>({ column, selectedValues, onSelectedValuesChange }: UseFacetedFilterStateProps<TData, TValue>) {
  const facets = column?.getFacetedUniqueValues();

  const handleOptionSelect = (optionValue: string) => {
    const isSelected = selectedValues.has(optionValue);
    const newSelectedValues = new Set(selectedValues);

    if (isSelected) {
      newSelectedValues.delete(optionValue);
    } else {
      newSelectedValues.add(optionValue);
    }

    onSelectedValuesChange(newSelectedValues);

    const filterValues = Array.from(newSelectedValues);
    column?.setFilterValue(filterValues.length ? filterValues : undefined);
  };

  const handleClearFilters = () => {
    onSelectedValuesChange(new Set());
    column?.setFilterValue(undefined);
  };

  return {
    facets,
    handleOptionSelect,
    handleClearFilters,
  };
}
