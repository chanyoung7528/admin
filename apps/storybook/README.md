# Storybook UI Documentation

`@repo/shared`, `@repo/date-picker` 패키지의 컴포넌트를 실시간으로 문서화합니다.

## 🚀 명령어

```bash
pnpm dev        # localhost:6006
pnpm build      # storybook-static 생성
pnpm preview    # 빌드 미리보기
```

## 📚 포함된 스토리

- Avatar, Badge, Button, Input, Tabs
- Sidebar, BasicTable, DataTable
- DatePicker, DateRangePicker
- FormTable, FormViewer, ErrorBoundary 등

모든 스토리는 `CustomDocsPage`를 사용해 **설치 방법 / 구현 코드 / 유틸리티 / 예시** 탭을 제공합니다.

## 🧱 구성

```
.storybook/main.ts  # alias, dedupe, rollup manualChunks
.storybook/preview.ts
src/components/CustomDocsPage.tsx
src/stories/*.stories.tsx
```

`main.ts` 에서는 다음 alias 를 미리 등록합니다.

- `@repo/shared/*`
- `@repo/date-picker` + CSS
- `@shared/*` (shared 패키지 내부 alias 해소)

## 📝 새 스토리 추가

1. `src/stories/MyComponent.stories.tsx` 생성
2. `CustomDocsPage` 에 `componentName`, `description`, `implementationCode` 등을 채움
3. `Meta` 의 `title` 은 `UI Components/...` 혹은 `Data Display/...` 형태로 작성

```tsx
const meta = {
  title: 'UI Components/MyComponent',
  component: MyComponent,
  parameters: {
    docs: {
      page: () => <CustomDocsPage componentName="MyComponent" description="컴포넌트 설명" implementationCode={`export function MyComponent() { ... }`} />,
    },
  },
} satisfies Meta<typeof MyComponent>;
```

## 📦 Vercel 배포

- Root Directory: `apps/storybook`
- Install Command: `pnpm install`
- Build Command: `pnpm run build`
- Output Directory: `storybook-static`

환경 변수는 필요 없습니다.

## 🔗 참고

- [docs/STORYBOOK_SETUP.md](../../docs/STORYBOOK_SETUP.md)
- [Storybook 공식 문서](https://storybook.js.org/)
