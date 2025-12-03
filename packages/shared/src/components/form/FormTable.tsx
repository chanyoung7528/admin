import { cn } from '@shared/lib/utils';
import type { ReactNode } from 'react';

interface FormTableProps {
  children: ReactNode;
  className?: string;
  title?: string;
}

interface FormTableRowProps {
  children: ReactNode;
  cols?: number;
  className?: string;
}

interface FormTableCellProps {
  children: ReactNode;
  span?: number;
  className?: string;
  label?: string;
  required?: boolean;
  labelPosition?: 'top' | 'left';
  labelWidth?: string;
}

export function FormTable({ children, className, title }: FormTableProps) {
  return (
    <div className={cn('border-border overflow-hidden rounded-lg border', className)}>
      {title && (
        <div className="border-border border-b px-6 py-4">
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
      )}
      <table className="w-full table-fixed">
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function FormTableRow({ children, className }: FormTableRowProps) {
  return <tr className={cn('', className)}>{children}</tr>;
}

export function FormTableCell({ children, span = 1, className, label, required, labelPosition = 'top', labelWidth = '200px' }: FormTableCellProps) {
  if (labelPosition === 'left' && label) {
    return (
      <td colSpan={span} className={cn('px-6 py-5 align-top', className)}>
        <div className="flex gap-4">
          <div className="flex shrink-0 items-start gap-1" style={{ width: labelWidth }}>
            <span className="text-sm font-medium">{label}</span>
            {required && <span className="text-destructive text-xs">*</span>}
          </div>
          <div className="flex-1">{children}</div>
        </div>
      </td>
    );
  }

  return (
    <td colSpan={span} className={cn('px-6 py-5 align-top', className)}>
      {label && (
        <div className="mb-2 flex items-center gap-1">
          <span className="text-sm font-medium">{label}</span>
          {required && <span className="text-destructive text-xs">*</span>}
        </div>
      )}
      {children}
    </td>
  );
}

FormTable.Row = FormTableRow;
FormTable.Cell = FormTableCell;
