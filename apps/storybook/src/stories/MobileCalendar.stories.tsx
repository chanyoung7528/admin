import { MobileCalendar } from '@repo/shared/components/calendar';
import type { Meta, StoryObj } from '@storybook/react';

import { CustomDocsPage } from '../components/CustomDocsPage';

const meta = {
  title: 'UI Components/MobileCalendar',
  component: MobileCalendar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      page: () => (
        <CustomDocsPage
          componentName="MobileCalendar"
          description="모바일 친화적인 캘린더 컴포넌트입니다. 주간 뷰와 월간 뷰를 전환할 수 있으며, 일정 추가/수정/삭제 기능을 제공합니다."
          installationDeps={['@radix-ui/react-dialog', 'lucide-react', 'class-variance-authority', 'clsx', 'tailwind-merge']}
          implementationCode={`// 기본 MobileCalendar 컴포넌트 사용
import { MobileCalendar } from "@components/calendar";

export default function Example() {
  return (
    <div className="h-screen">
      <MobileCalendar />
    </div>
  );
}`}
          exampleCode={`// 실제 사용 예시
import { MobileCalendar } from "@components/calendar";

export default function CalendarPage() {
  return (
    <div className="fixed inset-0">
      <MobileCalendar />
    </div>
  );
}`}
        />
      ),
    },
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MobileCalendar>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 기본 모바일 캘린더 (주간 뷰)
 */
export const Default: Story = {
  render: () => (
    <div className="h-screen">
      <MobileCalendar />
    </div>
  ),
};

/**
 * iPhone SE (375x667)
 */
export const IPhoneSE: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  render: () => (
    <div style={{ width: '375px', height: '667px' }}>
      <MobileCalendar />
    </div>
  ),
};

/**
 * iPhone 12 Pro (390x844)
 */
export const IPhone12Pro: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile2',
    },
  },
  render: () => (
    <div style={{ width: '390px', height: '844px' }}>
      <MobileCalendar />
    </div>
  ),
};

/**
 * iPhone 14 Pro Max (430x932)
 */
export const IPhone14ProMax: Story = {
  render: () => (
    <div style={{ width: '430px', height: '932px' }}>
      <MobileCalendar />
    </div>
  ),
};

/**
 * Samsung Galaxy S22 (360x800)
 */
export const GalaxyS22: Story = {
  render: () => (
    <div style={{ width: '360px', height: '800px' }}>
      <MobileCalendar />
    </div>
  ),
};

/**
 * Tablet (768x1024)
 */
export const Tablet: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
  render: () => (
    <div style={{ width: '768px', height: '1024px' }}>
      <MobileCalendar />
    </div>
  ),
};
