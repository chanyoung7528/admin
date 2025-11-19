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

## Vercel 배포

Vercel 배포 시 자동으로 CKEditor 빌드가 실행됩니다:

1. `pnpm install` 실행 → `postinstall` 스크립트가 CKEditor 빌드
2. Storybook 빌드 시 `ckeditor5-custom-build`를 Vite 최적화에서 제외
3. 빌드 파일 (~7.3MB)은 gitignore되어 있어 배포 시 자동 생성됨
