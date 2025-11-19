/*
    author: 김찬영
    description: 공통 CKEDIOTR5

    1. Create : 사용하고자 하는 곳에서
    =>  const CKEditor = useMemo(() => dynamic(() => import('editor/CKEditor'), { ssr: false }), []) 정의
    => <CKEditor isEditorReady={isEditorReady} /> 컴포넌트화 시킴

    2. Custom : 아직정의되지않아서 커스텀은 추후예정, config에서 커스텀 예정
    3. File Upload : File s3 upload 기반으로 커스텀 하였음, 추후 url 던져서 사용하도록 수정할것
    4. Image Test Key

    */

// @ts-expect-error - CKEditor custom build
import { CKEditor as Editor } from '@ckeditor/ckeditor5-react';
// @ts-expect-error - CKEditor custom build
import ClassicEditor from 'ckeditor5-custom-build/build/ckeditor';
import './styles.css';

interface EditorProps {
  data?: string;
  onEditorChange: (data: string) => void;
  url?: string;
  tableName?: string;
  placeholder?: string;
}

interface EditorWithOnPlugins {
  plugins: {
    get: (arg0: string) => {
      on: any;
    };
  };
  model: any;
  conversion: any;
}

const CKEditor = ({ data, onEditorChange, tableName, placeholder }: EditorProps) => {
  function attrPlugin(editor: EditorWithOnPlugins) {
    // 이미지 업로드가 완료되었을 때의 event 를 감지

    editor.plugins.get('ImageUploadEditing').on('uploadComplete', (_evt: any, { data: { key }, imageElement }: any) => {
      editor.model.change((writer: any) => {
        writer.setAttribute('dataKey', key, imageElement);
      });

      editor.model.schema.extend('imageBlock', { allowAttributes: 'dataKey' });
      // 추가
      editor.model.schema.extend('imageInline', {
        allowAttributes: 'dataKey',
      });

      editor.conversion.for('upcast').attributeToAttribute({
        view: 'data-key',
        model: 'dataKey',
      });

      // ✅ imageInline 속성을 위한 추가
      editor.conversion.for('dataDowncast').attributeToAttribute({
        model: 'dataKey',
        view: 'data-key',
      });

      // ✅ imageInline 속성을 위한 추가
      editor.conversion.for('editingDowncast').add((dispatcher: any) => {
        dispatcher.on('attribute:dataKey:imageInline', (evt: any, data: any, { writer, consumable, mapper }: any) => {
          if (!consumable.consume(data.item, evt.name)) {
            return;
          }
          const imageContainer = mapper.toViewElement(data.item);
          const imageElement = imageContainer.getChild(0);
          if (data.attributeNewValue !== null) {
            writer.setAttribute('data-key', data.attributeNewValue, imageElement);
          } else {
            writer.removeAttribute('data-key', imageElement);
          }
        });
      });

      editor.conversion.for('downcast').add((dispatcher: any) => {
        dispatcher.on('attribute:dataKey:imageBlock', (evt: any, data: any, conversionApi: any) => {
          if (!conversionApi.consumable.consume(data.item, evt.name)) {
            return;
          }
          const viewWriter = conversionApi.writer;
          const figure = conversionApi.mapper.toViewElement(data.item);
          const img = figure.getChild(0);

          if (data.attributeNewValue !== null) {
            viewWriter.setAttribute('data-key', data.attributeNewValue, img);
          } else {
            viewWriter.removeAttribute('data-key', img);
          }
        });
      });
    });
  }

  const uploadAdapter = (loader: any) => {
    return {
      upload: async () => {
        const _file = await loader.file; // TODO: Use file for actual upload
        if (!tableName) {
          throw new Error('Table name is required');
        }
        const response: any = [{ key: 'test' }];
        if (!response) {
          throw new Error('No response from upload');
        }
        const { key } = response[0];
        // const { data: src } = await api.get(`/common/s3/prv/get-url?key=${key ?? ''}&expireSecondTime=${exTime}`)
        // @ts-expect-error - process env access
        const bucketName = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_S3_BUCKET_NAME) || 'default-bucket';
        const src = `https://${bucketName}.s3.ap-northeast-2.amazonaws.com/${key}`;
        return {
          default: src,
          key,
        };
      },
    };
  };

  function uploadPlugin(editor: any) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
      return uploadAdapter(loader);
    };
  }

  const EditorComponent = Editor as any;

  return (
    <div className="editor">
      <EditorComponent
        editor={ClassicEditor}
        data={data || ''}
        onChange={(event: any, editor: any) => {
          const data = editor?.getData();
          onEditorChange(data);
        }}
        config={{
          toolbar: {
            items: [
              'heading',
              '|',
              'bold',
              'italic',
              'link',
              'bulletedList',
              'numberedList',
              '|',
              'outdent',
              'indent',
              '|',
              'imageUpload',
              'blockQuote',
              'insertTable',
              'undo',
              'redo',
              'fontBackgroundColor',
              'fontColor',
              'fontFamily',
              'fontSize',
              'horizontalLine',
            ],
          },
          // fontFamily: {
          //   options: ['default', 'Arial', '궁서체', '바탕', '돋움'],
          //   supportAllValues: true,
          // },
          // fontSize: {
          //   options: [10, 12, 14, 'default', 16],
          // },
          extraPlugins: [uploadPlugin, attrPlugin],
          placeholder: placeholder,
        }}
      />
    </div>
  );
};

export default CKEditor;
