/* eslint-disable @typescript-eslint/no-explicit-any */
import { type TreeDataItem, TreeView } from '@repo/shared/components/tree';
import type { Meta, StoryObj } from '@storybook/react';
import { FileIcon, FileText, Folder, FolderOpen, Image } from 'lucide-react';

import { CustomDocsPage } from '../components/CustomDocsPage';

const meta = {
  title: 'UI Components/Tree',
  component: TreeView,
  parameters: {
    layout: 'padded',
    docs: {
      page: () => (
        <CustomDocsPage
          componentName="Tree"
          description="드래그 앤 드롭을 지원하는 계층형 트리 구조 컴포넌트입니다. 파일 탐색기, 메뉴, 카테고리 관리 등 다양한 용도로 사용할 수 있습니다."
          installationDeps={['@repo/shared', '@dnd-kit/core', '@dnd-kit/sortable', '@radix-ui/react-accordion']}
          implementationCode={`import { TreeView, type TreeDataItem } from "@repo/shared/components/tree";
import { FileIcon, FolderIcon } from "lucide-react";
import { useState } from "react";

const treeData: TreeDataItem[] = [
  {
    id: '1',
    name: 'src',
    children: [
      {
        id: '1-1',
        name: 'components',
        children: [
          { id: '1-1-1', name: 'Button.tsx', type: 'TypeScript' },
          { id: '1-1-2', name: 'Input.tsx', type: 'TypeScript' },
        ],
      },
      {
        id: '1-2',
        name: 'pages',
        children: [
          { id: '1-2-1', name: 'Home.tsx', type: 'TypeScript' },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'package.json',
    type: 'JSON',
  },
];

export function FileExplorer() {
  const [selected, setSelected] = useState<TreeDataItem>();

  return (
    <TreeView
      data={treeData}
      onSelectChange={setSelected}
      defaultNodeIcon={FolderIcon}
      defaultLeafIcon={FileIcon}
    />
  );
}`}
        />
      ),
    },
  },
  tags: ['autodocs'],
  argTypes: {
    data: {
      description: '트리 데이터 배열 또는 단일 트리 아이템',
      control: false, // 너무 복잡하므로 제어 비활성화
    },
    initialSelectedItemId: {
      description: '초기 선택된 아이템 ID (Interactive 스토리에서 테스트하세요)',
      control: { type: 'text' },
    },
    expandAll: {
      description: '모든 노드를 펼친 상태로 시작',
      control: { type: 'boolean' },
    },
    defaultNodeIcon: {
      description: '기본 폴더 아이콘',
      control: false,
    },
    defaultLeafIcon: {
      description: '기본 파일 아이콘',
      control: false,
    },
    onSelectChange: {
      description: '선택 변경 시 호출되는 콜백',
      action: 'selected',
    },
    onReorder: {
      description: '아이템 재정렬 시 호출되는 콜백',
      action: 'reordered',
    },
    className: {
      description: '커스텀 CSS 클래스',
      control: { type: 'text' },
    },
  },
} satisfies Meta<typeof TreeView>;

export default meta;
type Story = StoryObj<typeof meta>;

// 샘플 데이터 - 파일 시스템
const fileSystemData: TreeDataItem[] = [
  {
    id: 'src',
    name: 'src',
    icon: Folder,
    openIcon: FolderOpen,
    children: [
      {
        id: 'src-components',
        name: 'components',
        icon: Folder,
        openIcon: FolderOpen,
        children: [
          {
            id: 'src-components-button',
            name: 'Button.tsx',
            type: 'TypeScript',
            icon: FileText,
          },
          {
            id: 'src-components-input',
            name: 'Input.tsx',
            type: 'TypeScript',
            icon: FileText,
          },
          {
            id: 'src-components-select',
            name: 'Select.tsx',
            type: 'TypeScript',
            icon: FileText,
          },
        ],
      },
      {
        id: 'src-pages',
        name: 'pages',
        icon: Folder,
        openIcon: FolderOpen,
        children: [
          {
            id: 'src-pages-home',
            name: 'Home.tsx',
            type: 'TypeScript',
            icon: FileText,
          },
          {
            id: 'src-pages-about',
            name: 'About.tsx',
            type: 'TypeScript',
            icon: FileText,
          },
        ],
      },
      {
        id: 'src-assets',
        name: 'assets',
        icon: Folder,
        openIcon: FolderOpen,
        children: [
          {
            id: 'src-assets-logo',
            name: 'logo.png',
            type: 'Image',
            icon: Image,
          },
          {
            id: 'src-assets-icon',
            name: 'icon.svg',
            type: 'Image',
            icon: Image,
          },
        ],
      },
    ],
  },
  {
    id: 'public',
    name: 'public',
    icon: Folder,
    openIcon: FolderOpen,
    children: [
      {
        id: 'public-index',
        name: 'index.html',
        type: 'HTML',
        icon: FileText,
      },
    ],
  },
  {
    id: 'package',
    name: 'package.json',
    type: 'JSON',
    icon: FileIcon,
  },
  {
    id: 'readme',
    name: 'README.md',
    type: 'Markdown',
    icon: FileText,
  },
];

const draggableFileSystemData: TreeDataItem[] = [
  {
    id: 'drag-src',
    name: 'src',
    icon: Folder,
    openIcon: FolderOpen,
    draggable: true,
    children: [
      {
        id: 'drag-src-components',
        name: 'components',
        icon: Folder,
        openIcon: FolderOpen,
        draggable: true,
        children: [
          {
            id: 'drag-src-components-button',
            name: 'Button.tsx',
            type: 'TypeScript',
            icon: FileText,
            draggable: true,
          },
          {
            id: 'drag-src-components-input',
            name: 'Input.tsx',
            type: 'TypeScript',
            icon: FileText,
            draggable: true,
          },
          {
            id: 'drag-src-components-select',
            name: 'Select.tsx',
            type: 'TypeScript',
            icon: FileText,
            draggable: true,
          },
        ],
      },
      {
        id: 'drag-src-pages',
        name: 'pages',
        icon: Folder,
        openIcon: FolderOpen,
        draggable: true,
        children: [
          {
            id: 'drag-src-pages-home',
            name: 'Home.tsx',
            type: 'TypeScript',
            icon: FileText,
            draggable: true,
          },
          {
            id: 'drag-src-pages-about',
            name: 'About.tsx',
            type: 'TypeScript',
            icon: FileText,
            draggable: true,
          },
        ],
      },
    ],
  },
  {
    id: 'drag-package',
    name: 'package.json',
    type: 'JSON',
    icon: FileIcon,
    draggable: true,
  },
];

const menuData: TreeDataItem[] = [
  {
    id: 'dashboard',
    name: '대시보드',
    onClick: () => console.log('대시보드 클릭'),
  },
  {
    id: 'products',
    name: '상품 관리',
    children: [
      {
        id: 'products-list',
        name: '상품 목록',
        onClick: () => console.log('상품 목록 클릭'),
      },
      {
        id: 'products-add',
        name: '상품 등록',
        onClick: () => console.log('상품 등록 클릭'),
      },
      {
        id: 'products-categories',
        name: '카테고리 관리',
        onClick: () => console.log('카테고리 관리 클릭'),
      },
    ],
  },
  {
    id: 'orders',
    name: '주문 관리',
    children: [
      {
        id: 'orders-list',
        name: '주문 목록',
        onClick: () => console.log('주문 목록 클릭'),
      },
      {
        id: 'orders-returns',
        name: '반품 관리',
        onClick: () => console.log('반품 관리 클릭'),
      },
    ],
  },
  {
    id: 'customers',
    name: '고객 관리',
    onClick: () => console.log('고객 관리 클릭'),
  },
  {
    id: 'settings',
    name: '설정',
    disabled: true,
    children: [
      {
        id: 'settings-profile',
        name: '프로필',
        disabled: true,
      },
      {
        id: 'settings-security',
        name: '보안',
        disabled: true,
      },
    ],
  },
];

/**
 * 기본 Tree 예제
 * Controls 패널에서 expandAll, initialSelectedItemId를 실시간으로 변경해보세요!
 */
export const Default: Story = {
  args: {
    data: fileSystemData,
    expandAll: false,
    initialSelectedItemId: '',
  },
};

/**
 * 초기 선택 아이템
 */
export const WithInitialSelection: Story = {
  args: {
    data: fileSystemData,
    initialSelectedItemId: 'src-components-button',
  },
};

/**
 * 모두 펼치기
 */
export const ExpandAll: Story = {
  args: {
    data: fileSystemData,
    expandAll: true,
  },
};

/**
 * 드래그 앤 드롭
 */
export const DraggableTree: Story = {
  args: {
    data: draggableFileSystemData,
    expandAll: true,
    onReorder: (items: any) => {
      console.log('재정렬된 아이템:', items);
    },
  },
};

/**
 * 메뉴 네비게이션
 */
export const MenuNavigation: Story = {
  args: {
    data: menuData,
    expandAll: false,
    onSelectChange: (item: any) => {
      console.log('선택된 메뉴:', item);
    },
  },
};

/**
 * 비활성화된 아이템
 */
export const WithDisabledItems: Story = {
  args: {
    data: [
      {
        id: 'enabled-folder',
        name: '활성화된 폴더',
        children: [
          {
            id: 'enabled-file',
            name: '활성화된 파일',
          },
        ],
      },
      {
        id: 'disabled-folder',
        name: '비활성화된 폴더',
        disabled: true,
        children: [
          {
            id: 'disabled-file',
            name: '비활성화된 파일',
            disabled: true,
          },
        ],
      },
    ],
    expandAll: true,
  },
};

/**
 * 커스텀 아이콘
 */
export const CustomIcons: Story = {
  args: {
    data: fileSystemData,
    expandAll: true,
  },
};

/**
 * 단일 아이템
 */
export const SingleItem: Story = {
  args: {
    data: {
      id: 'root',
      name: '루트 폴더',
      children: [
        {
          id: 'child-1',
          name: '자식 아이템 1',
        },
        {
          id: 'child-2',
          name: '자식 아이템 2',
        },
      ],
    },
    expandAll: true,
  },
};

/**
 * 깊은 계층 구조
 */
export const DeepNesting: Story = {
  args: {
    data: [
      {
        id: 'level-1',
        name: 'Level 1',
        children: [
          {
            id: 'level-2',
            name: 'Level 2',
            children: [
              {
                id: 'level-3',
                name: 'Level 3',
                children: [
                  {
                    id: 'level-4',
                    name: 'Level 4',
                    children: [
                      {
                        id: 'level-5',
                        name: 'Level 5',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    expandAll: true,
  },
};

/**
 * 많은 아이템
 */
export const ManyItems: Story = {
  args: {
    data: Array.from({ length: 20 }, (_, i) => ({
      id: `item-${i}`,
      name: `아이템 ${i + 1}`,
      children: Array.from({ length: 5 }, (_, j) => ({
        id: `item-${i}-${j}`,
        name: `하위 아이템 ${j + 1}`,
      })),
    })),
  },
};
