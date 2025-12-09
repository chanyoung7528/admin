# @repo/editor

CKEditor 5 커스텀 빌드(React 래퍼)를 제공하는 패키지입니다. 설치 시 postinstall이 CKEditor를 자동 빌드합니다.

## 빠른 시작

```tsx
import { useState } from 'react';
import { CKEditor } from '@repo/editor';

export function EditorExample() {
  const [content, setContent] = useState('');

  return <CKEditor data={content} onEditorChange={setContent} placeholder="내용을 입력하세요..." />;
}
```

## 사용 포인트

- **postinstall 빌드**: `pnpm install` 후 별도 작업 없이 빌드 완료.
- **수동 빌드**: `pnpm --filter @repo/editor build`
- **출력물 관리**: CKEditor 번들은 git에 포함되지 않으며 빌드 시 생성됩니다.
- **번들 최적화**: Vite 설정에서 `ckeditor5-custom-build`는 이미 최적화 제외 처리되어 있습니다.
