import { Label } from '@shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/components/ui/select';
import { cn } from '@shared/lib/utils';
import type { Control, FieldValues, Path } from 'react-hook-form';
import { useController } from 'react-hook-form';

import { FormFieldError } from './FormError';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface FormSelectProps<T extends FieldValues = FieldValues> {
  name: Path<T>;
  control: Control<T>;
  options: SelectOption[];
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  description?: string;
  onValueChange?: (value: string) => void;
}

export function FormSelect<T extends FieldValues = FieldValues>({
  name,
  control,
  options,
  label,
  placeholder = '선택해주세요',
  required = false,
  disabled = false,
  className,
  description,
  onValueChange: onValueChangeProp,
}: FormSelectProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules: { required: required ? `${label || name}을(를) 선택해주세요.` : false },
  });

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor={name} className="text-sm font-medium">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}

      <Select
        disabled={disabled}
        value={field.value || ''}
        onValueChange={value => {
          field.onChange(value);
          onValueChangeProp?.(value);
        }}
      >
        <SelectTrigger className={cn('w-full', error && 'border-destructive focus:border-destructive')}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map(option => (
            <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {description && !error && <p className="text-muted-foreground text-sm">{description}</p>}

      <FormFieldError message={error?.message} />
    </div>
  );
}
