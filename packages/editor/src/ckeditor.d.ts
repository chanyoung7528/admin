declare module 'ckeditor5-custom-build/build/ckeditor' {
  const ClassicEditor: any;
  export default ClassicEditor;
}

declare module '@ckeditor/ckeditor5-react' {
  import { Component } from 'react';

  export interface CKEditorProps {
    editor: any;
    data?: string;
    config?: any;
    onChange?: (event: any, editor: any) => void;
    onReady?: (editor: any) => void;
    onBlur?: (event: any, editor: any) => void;
    onFocus?: (event: any, editor: any) => void;
    disabled?: boolean;
  }

  export class CKEditor extends Component<CKEditorProps> {}
}
