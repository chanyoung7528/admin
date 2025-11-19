# @repo/editor

CKEditor 5 커스텀 빌드 패키지입니다.

## 설치

```bash
pnpm install
```

설치 시 자동으로 CKEditor5 커스텀 빌드가 실행됩니다.

## 사용법

```tsx
import { CKEditor } from '@repo/editor';

function MyComponent() {
  const [content, setContent] = useState('');

  return <CKEditor data={content} onEditorChange={setContent} placeholder="내용을 입력하세요..." />;
}
```

## 빌드

CKEditor5 커스텀 빌드를 수동으로 실행하려면:

```bash
cd packages/editor
pnpm build
```

## 참고사항

- CKEditor5 빌드 파일은 git에 커밋되지 않으며, 설치 시 자동으로 생성됩니다.
- 빌드 시간이 약 5-10초 소요됩니다.
