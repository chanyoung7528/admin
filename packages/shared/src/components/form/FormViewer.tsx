import { FormTable } from './FormTable';

type LabelPosition = 'top' | 'left';

interface ViewerField {
  label: string;
  value: string | number | React.ReactNode;
  span?: number;
  labelPosition?: LabelPosition;
  labelWidth?: string;
}

interface ViewerRow {
  fields: ViewerField[];
}

interface FormViewerProps {
  title?: string;
  rows: ViewerRow[];
  className?: string;
}

export function FormViewer({ title, rows, className }: FormViewerProps) {
  return (
    <FormTable title={title} className={className}>
      {rows.map((row, rowIndex) => (
        <FormTable.Row key={rowIndex}>
          {row.fields.map((field, fieldIndex) => (
            <FormTable.Cell key={fieldIndex} label={field.label} span={field.span} labelPosition={field.labelPosition} labelWidth={field.labelWidth}>
              {typeof field.value === 'string' || typeof field.value === 'number' ? <p className="text-sm">{field.value || '-'}</p> : field.value}
            </FormTable.Cell>
          ))}
        </FormTable.Row>
      ))}
    </FormTable>
  );
}

export type { FormViewerProps, LabelPosition, ViewerField, ViewerRow };
