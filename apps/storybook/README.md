# Storybook UI Documentation

이 프로젝트는 shared 패키지의 UI 컴포넌트를 문서화한 Storybook입니다.

## 🚀 시작하기

### 개발 서버 실행

```bash
pnpm dev
```

http://localhost:6006에서 Storybook을 확인할 수 있습니다.

### 빌드

```bash
pnpm build
```

정적 Storybook 사이트가 `storybook-static` 디렉토리에 생성됩니다.

### 프리뷰

```bash
pnpm preview
```

빌드된 Storybook을 로컬에서 미리 볼 수 있습니다.

## 📚 문서화된 컴포넌트

- **Button**: 다양한 스타일과 크기의 버튼
- **Tabs**: 탭 네비게이션 컴포넌트
- **Badge**: 상태 표시 배지
- **Input**: 텍스트 입력 필드
- **Avatar**: 사용자 아바타
- 그 외 더 많은 컴포넌트...

## 🎨 커스텀 문서 페이지

각 컴포넌트는 `CustomDocsPage`를 사용하여 다음 정보를 제공합니다:

1. **컴포넌트 설명**: 개요 및 실시간 테스트
2. **설치방법**: PNPM(모노레포) 기준 설치 명령어
3. **완벽한 구현코드**: TypeScript 전체 코드
4. **유틸리티 함수**: 필요한 유틸리티 함수
5. **모든 예시**: 다양한 사용 사례

## 📦 Vercel 배포

이 Storybook은 Vercel에 배포되도록 설정되어 있습니다.

### 배포 방법

1. Vercel에 프로젝트 연결
2. Root Directory를 `apps/storybook`으로 설정
3. Build Command: `pnpm build`
4. Output Directory: `storybook-static`
5. Install Command: `pnpm install`

### 환경 변수

현재 환경 변수가 필요하지 않습니다.

## 🛠️ 기술 스택

- **React 19**: UI 라이브러리
- **Storybook 8**: 컴포넌트 문서화 도구
- **TypeScript**: 타입 안정성
- **Tailwind CSS**: 스타일링
- **Vite**: 빌드 도구

## 📝 새 스토리 추가하기

1. `src/stories/` 디렉토리에 새 `.stories.tsx` 파일 생성
2. `CustomDocsPage`를 사용하여 문서 구성
3. 다양한 변형(variants) 예시 추가

예시:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { MyComponent } from '@repo/shared/components/ui/my-component';
import { CustomDocsPage } from '../components/CustomDocsPage';

const meta = {
  title: 'UI Components/MyComponent',
  component: MyComponent,
  parameters: {
    docs: {
      page: () => (
        <CustomDocsPage
          componentName="MyComponent"
          description="컴포넌트 설명"
          installationDeps={['dependency1', 'dependency2']}
          implementationCode={`// 구현 코드`}
        />
      ),
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MyComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // props
  },
};
```

## 🔗 관련 링크

- [Storybook 공식 문서](https://storybook.js.org/)
- [Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
