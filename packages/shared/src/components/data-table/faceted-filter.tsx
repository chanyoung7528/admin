import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@shared/components/ui/command';
import { cn } from '@shared/lib/utils';
import { Badge } from '@shared/ui/badge';
import { Button } from '@shared/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@shared/ui/popover';
import { Separator } from '@shared/ui/separator';
import { type Column } from '@tanstack/react-table';
import { CheckIcon, PlusCircleIcon } from 'lucide-react';
import { useState } from 'react';

type DataTableFacetedFilterProps<TData, TValue> = {
  column?: Column<TData, TValue>;
  title?: string;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
};

export function DataTableFacetedFilter<TData, TValue>({ column, title, options }: DataTableFacetedFilterProps<TData, TValue>) {
  const facets = column?.getFacetedUniqueValues();
  const filterValue = column?.getFilterValue() as string[] | undefined;

  // 컴포넌트가 key로 강제 리마운트되므로 항상 최신 filterValue로 초기화됨
  const [selectedValues, setSelectedValues] = useState<Set<string>>(() => new Set(filterValue));

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircleIcon className="size-4" />
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter(option => selectedValues.has(option.value))
                    .map(option => (
                      <Badge variant="secondary" key={option.value} className="rounded-sm px-1 font-normal">
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map(option => {
                const isSelected = selectedValues.has(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      const newSelectedValues = new Set(selectedValues);

                      if (isSelected) {
                        newSelectedValues.delete(option.value);
                      } else {
                        newSelectedValues.add(option.value);
                      }

                      // 로컬 state 먼저 업데이트 (즉각적인 UI 반응)
                      setSelectedValues(newSelectedValues);

                      // column 필터 업데이트
                      const filterValues = Array.from(newSelectedValues);
                      const newFilterValue = filterValues.length ? filterValues : undefined;

                      column?.setFilterValue(newFilterValue);
                    }}
                  >
                    <div
                      className={cn(
                        'border-primary flex size-4 items-center justify-center rounded-sm border',
                        isSelected ? 'bg-primary text-primary-foreground' : 'opacity-50 [&_svg]:invisible'
                      )}
                    >
                      <CheckIcon className={cn('text-background h-4 w-4')} />
                    </div>
                    {option.icon && <option.icon className="text-muted-foreground size-4" />}
                    <span>{option.label}</span>
                    {facets?.get(option.value) && (
                      <span className="ms-auto flex h-4 w-4 items-center justify-center font-mono text-xs">{facets.get(option.value)}</span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      setSelectedValues(new Set());
                      column?.setFilterValue(undefined);
                    }}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
