import { Checkbox } from '@shared/components/ui/checkbox';
import { Label } from '@shared/components/ui/label';
import { cn } from '@shared/lib/utils';
import { type Control, type FieldValues, type Path, useController } from 'react-hook-form';

interface CheckboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface ControlledCheckboxGroupProps<T extends FieldValues = FieldValues> {
  name: string;
  control: Control<T>;
  options: CheckboxOption[];
  label?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  description?: string;
  minSelection?: number;
  maxSelection?: number;
  onValueChange?: (values: string[]) => void;
  layout?: 'vertical' | 'horizontal' | 'grid';
  gridCols?: 2 | 3 | 4 | 5 | 6;
}

export function ControlledCheckboxGroup<T extends FieldValues = FieldValues>({
  name,
  control,
  options,
  label,
  required = false,
  disabled = false,
  className,
  description,
  minSelection,
  maxSelection,
  onValueChange: onValueChangeProp,
  layout = 'vertical',
  gridCols = 3,
}: ControlledCheckboxGroupProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name: name as Path<T>,
    control,
    rules: {
      required: required ? `${label || name}에서 최소 1개를 선택해주세요.` : false,
      validate: (value: string[] = []) => {
        if (minSelection && value.length < minSelection) {
          return `최소 ${minSelection}개를 선택해주세요.`;
        }
        if (maxSelection && value.length > maxSelection) {
          return `최대 ${maxSelection}개까지 선택 가능합니다.`;
        }
        return true;
      },
    },
  });

  const selectedValues = field.value || [];

  const handleOptionChange = (optionValue: string, checked: boolean) => {
    let newValues: string[];

    if (checked) {
      newValues = [...selectedValues, optionValue];
    } else {
      newValues = selectedValues.filter((value: string) => value !== optionValue);
    }

    field.onChange(newValues);
    onValueChangeProp?.(newValues);
  };

  const getLayoutClassName = () => {
    if (layout === 'horizontal') {
      return 'flex flex-wrap gap-x-4 gap-y-2';
    }
    if (layout === 'grid') {
      const gridColsMap = {
        2: 'grid grid-cols-2 gap-x-4 gap-y-2',
        3: 'grid grid-cols-3 gap-x-4 gap-y-2',
        4: 'grid grid-cols-4 gap-x-4 gap-y-2',
        5: 'grid grid-cols-5 gap-x-4 gap-y-2',
        6: 'grid grid-cols-6 gap-x-4 gap-y-2',
      };
      return gridColsMap[gridCols];
    }
    return 'space-y-2';
  };

  return (
    <div className={cn('space-y-3', className)}>
      {label && (
        <Label className="text-sm font-medium">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
          {maxSelection && (
            <span className="text-muted-foreground ml-2 text-xs">
              ({selectedValues.length}/{maxSelection})
            </span>
          )}
        </Label>
      )}

      <div className={getLayoutClassName()}>
        {options.map(option => {
          const optionValue = option?.value ?? '';
          const isChecked = (selectedValues as string[]).includes(optionValue);
          const isDisabled = disabled || option.disabled || (maxSelection !== undefined && !isChecked && (selectedValues as string[]).length >= maxSelection);

          return (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={`${name}-${option.value}`}
                checked={isChecked}
                onCheckedChange={checked => handleOptionChange(option.value, !!checked)}
                disabled={isDisabled || false}
                className={cn(error && 'border-destructive')}
              />

              <Label htmlFor={`${name}-${option.value}`} className={cn('cursor-pointer text-sm', isDisabled && 'cursor-not-allowed opacity-50')}>
                {option.label}
              </Label>
            </div>
          );
        })}
      </div>

      {description && !error && <p className="text-muted-foreground text-sm">{description}</p>}

      {error && <p className="text-destructive text-sm">{error.message}</p>}
    </div>
  );
}
