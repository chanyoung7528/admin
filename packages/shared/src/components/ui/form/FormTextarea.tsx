import { Label } from '@shared/components/ui/label';
import { Textarea } from '@shared/components/ui/textarea';
import { cn } from '@shared/lib/utils';
import type { Control, FieldValues, Path } from 'react-hook-form';
import { useController } from 'react-hook-form';

interface ControlledTextareaProps<T extends FieldValues = FieldValues> {
  name: string;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  description?: string;
  rows?: number;
  maxLength?: number;
  onChange?: (value: string) => void;
  onBlur?: (value: string) => void;
  onFocus?: (value: string) => void;
}

export function ControlledTextarea<T extends FieldValues = FieldValues>({
  name,
  control,
  label,
  placeholder,
  required = false,
  disabled = false,
  className,
  description,
  rows = 4,
  maxLength,
  onChange: onChangeProp,
  onBlur: onBlurProp,
  onFocus: onFocusProp,
}: ControlledTextareaProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name: name as Path<T>,
    control,
    rules: {
      required: required ? `${label || name}은(는) 필수입니다.` : false,
      maxLength: maxLength
        ? {
            value: maxLength,
            message: `최대 ${maxLength}자까지 입력 가능합니다.`,
          }
        : undefined,
    },
  });

  const currentLength = field.value?.length || 0;

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor={name} className="text-sm font-medium">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}

      <div className="relative">
        <Textarea
          id={name}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          className={cn('w-full resize-none', error && 'border-destructive focus:border-destructive', maxLength && 'pr-20')}
          {...field}
          onChange={e => {
            field.onChange(e);
            onChangeProp?.(e.target.value);
          }}
          onBlur={e => {
            field.onBlur();
            onBlurProp?.(e.target.value);
          }}
          onFocus={e => {
            onFocusProp?.(e.target.value);
          }}
        />

        {maxLength && (
          <div className="text-muted-foreground absolute right-2 bottom-2 text-xs">
            {currentLength}/{maxLength}
          </div>
        )}
      </div>

      {description && !error && <p className="text-muted-foreground text-sm">{description}</p>}

      {error && <p className="text-destructive text-sm">{error.message}</p>}
    </div>
  );
}
