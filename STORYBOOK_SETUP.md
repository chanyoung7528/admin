# Storybook 설정 완료 ✅

Storybook이 성공적으로 설정되었습니다!

## 📁 생성된 파일 구조

```
apps/storybook/
├── .storybook/
│   ├── main.ts                 # Storybook 메인 설정
│   ├── preview.ts              # 미리보기 설정 (Tailwind CSS 포함)
│   └── preview-head.html       # 커스텀 head 태그
├── src/
│   ├── components/
│   │   └── CustomDocsPage.tsx  # 커스텀 문서 페이지 컴포넌트
│   └── stories/
│       ├── Button.stories.tsx  # Button 컴포넌트 문서
│       ├── Tabs.stories.tsx    # Tabs 컴포넌트 문서
│       ├── Badge.stories.tsx   # Badge 컴포넌트 문서
│       ├── Input.stories.tsx   # Input 컴포넌트 문서
│       └── Avatar.stories.tsx  # Avatar 컴포넌트 문서
├── package.json
├── tsconfig.json
├── vercel.json                 # Vercel 배포 설정
├── .gitignore
├── README.md                   # 프로젝트 개요
└── DEPLOYMENT.md               # 배포 가이드

```

## 🎨 CustomDocsPage 기능

각 컴포넌트는 다음 탭으로 구성된 문서를 제공합니다:

### 1. 📖 컴포넌트 설명
- 컴포넌트 개요 및 설명
- 실시간 대화형 테스트
- Controls를 통한 props 조작

### 2. 📦 설치방법
- NPM/PNPM 설치 명령어
- 필요한 의존성 목록
- 코드 복사 기능

### 3. ⚙️ 완벽한 구현코드
- TypeScript 전체 소스코드
- 코드 복사 기능
- 구문 강조

### 4. 🔧 유틸리티 함수
- `cn` 유틸리티 함수
- Tailwind CSS 클래스 병합
- 코드 복사 기능

### 5. 📚 모든 예시
- 다양한 사용 사례
- 변형(variants) 예시
- Show code 기능

## 🚀 사용 방법

### 개발 서버 시작

```bash
cd apps/storybook
pnpm dev
```

→ http://localhost:6006

### 프로덕션 빌드

```bash
cd apps/storybook
pnpm build
```

→ `storybook-static/` 디렉토리에 생성

### 빌드 미리보기

```bash
cd apps/storybook
pnpm preview
```

## 📝 새 컴포넌트 스토리 추가하기

### 1. 스토리 파일 생성

`apps/storybook/src/stories/YourComponent.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { YourComponent } from '@repo/shared/components/ui/your-component';
import { CustomDocsPage } from '../components/CustomDocsPage';

const meta = {
  title: 'UI Components/YourComponent',
  component: YourComponent,
  parameters: {
    layout: 'centered',
    docs: {
      page: () => (
        <CustomDocsPage
          componentName="YourComponent"
          description="컴포넌트 설명을 작성하세요"
          installationDeps={['dependency1', 'dependency2']}
          implementationCode={`// 구현 코드를 여기에 붙여넣으세요
export function YourComponent() {
  return <div>Hello</div>;
}`}
          utilityCode={`// 선택사항: 커스텀 유틸리티 코드`}
        />
      ),
    },
  },
  tags: ['autodocs'],
  argTypes: {
    // props 타입 정의
  },
} satisfies Meta<typeof YourComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 예시
export const Default: Story = {
  args: {
    // 기본 props
  },
};

// 추가 변형들
export const Variant1: Story = {
  render: () => <YourComponent variant="primary" />,
};
```

### 2. 다양한 예시 추가

각 스토리는 다음과 같은 예시를 포함하는 것이 좋습니다:

- **Default**: 기본 사용 사례
- **Variants**: 모든 변형 보여주기
- **Sizes**: 다양한 크기
- **States**: 상태 (비활성화, 로딩 등)
- **WithIcon**: 아이콘과 함께
- **Examples**: 실제 사용 사례

## 🌐 Vercel 배포

### 빠른 배포

1. Vercel Dashboard에서 프로젝트 생성
2. 설정:
   - **Root Directory**: `apps/storybook`
   - **Build Command**: `pnpm run build`
   - **Output Directory**: `storybook-static`
   - **Install Command**: `pnpm install`

자세한 내용은 `DEPLOYMENT.md` 참조

### 배포 URL

- **프로덕션**: `https://your-project.vercel.app`
- **PR 미리보기**: 각 PR마다 자동 생성

## 📚 문서화된 컴포넌트

현재 문서화된 컴포넌트:

- ✅ **Button** - 버튼 컴포넌트 (6개 variant, 3개 size)
- ✅ **Tabs** - 탭 네비게이션 (default, underline variant)
- ✅ **Badge** - 상태 배지 (4개 variant)
- ✅ **Input** - 텍스트 입력 (다양한 type)
- ✅ **Avatar** - 사용자 아바타 (이미지/fallback)

### 추가 예정

shared/src/components/ui/에서 추가로 문서화할 컴포넌트:

- [ ] AlertDialog
- [ ] Collapsible
- [ ] DropdownMenu
- [ ] Separator
- [ ] Sheet
- [ ] Skeleton
- [ ] Tooltip
- [ ] Sidebar

## 🎯 CustomDocsPage 특징

### 1. 탭 네비게이션
- 깔끔한 탭 인터페이스
- 아이콘과 함께 표시
- Underline variant 사용

### 2. 코드 블록
- 복사 버튼 포함
- 복사 완료 피드백
- 구문 강조

### 3. 반응형 디자인
- 모바일 친화적
- 다크 모드 지원
- 스크롤 투 탑 버튼

### 4. 애니메이션
- 부드러운 전환 효과
- fadeIn, slideDown 애니메이션
- 탭 전환 시 콘텐츠 보존

## 🔧 커스터마이징

### CustomDocsPage 수정

`apps/storybook/src/components/CustomDocsPage.tsx` 파일을 수정하여:

- 새로운 섹션 추가
- 스타일 변경
- 추가 기능 구현

### Storybook 테마

`.storybook/preview.ts`에서 테마 설정:

```typescript
export const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#1a1a1a' },
      ],
    },
  },
};
```

## 📊 통계

- **설정 파일**: 8개
- **스토리 파일**: 5개
- **문서화된 컴포넌트**: 5개
- **예시 스토리**: 30+개

## 🎉 완료!

Storybook 설정이 완료되었습니다. 이제 다음을 수행할 수 있습니다:

1. ✅ 로컬에서 Storybook 실행
2. ✅ 새로운 컴포넌트 문서 추가
3. ✅ Vercel에 배포
4. ✅ 팀과 UI 컴포넌트 공유

## 📞 도움말

문제가 발생하면:
- `README.md` - 프로젝트 개요
- `DEPLOYMENT.md` - 배포 가이드
- [Storybook 공식 문서](https://storybook.js.org/)

