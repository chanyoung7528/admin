import { DataTable } from '@repo/shared/components/data-table';
import type { Meta, StoryObj } from '@storybook/react';
import { type ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { CustomDocsPage } from '../components/CustomDocsPage';

// 사용자 데이터 타입
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  status: 'active' | 'inactive';
  createdAt: string;
}

// 샘플 데이터
const sampleUsers: User[] = [
  { id: '1', name: '김철수', email: 'kim@example.com', role: 'admin', status: 'active', createdAt: '2024-01-15' },
  { id: '2', name: '이영희', email: 'lee@example.com', role: 'user', status: 'active', createdAt: '2024-01-20' },
  { id: '3', name: '박민수', email: 'park@example.com', role: 'user', status: 'inactive', createdAt: '2024-02-01' },
  { id: '4', name: '최지혜', email: 'choi@example.com', role: 'guest', status: 'active', createdAt: '2024-02-10' },
  { id: '5', name: '정대호', email: 'jung@example.com', role: 'user', status: 'active', createdAt: '2024-02-15' },
  { id: '6', name: '강수진', email: 'kang@example.com', role: 'admin', status: 'active', createdAt: '2024-02-20' },
  { id: '7', name: '임현우', email: 'lim@example.com', role: 'user', status: 'inactive', createdAt: '2024-03-01' },
  { id: '8', name: '한지민', email: 'han@example.com', role: 'guest', status: 'active', createdAt: '2024-03-05' },
  { id: '9', name: '윤서준', email: 'yoon@example.com', role: 'user', status: 'active', createdAt: '2024-03-10' },
  { id: '10', name: '조은비', email: 'jo@example.com', role: 'admin', status: 'active', createdAt: '2024-03-15' },
];

// 기본 컬럼 정의
const basicColumns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: '이름',
    cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'email',
    header: '이메일',
  },
  {
    accessorKey: 'role',
    header: '역할',
    cell: ({ row }) => {
      const role = row.getValue('role') as string;
      const roleLabels = { admin: '관리자', user: '사용자', guest: '게스트' };
      return <div>{roleLabels[role as keyof typeof roleLabels]}</div>;
    },
  },
  {
    accessorKey: 'status',
    header: '상태',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <span
          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
            status === 'active'
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
          }`}
        >
          {status === 'active' ? '활성' : '비활성'}
        </span>
      );
    },
  },
];

// 정렬 가능한 컬럼
const sortableColumns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <button className="hover:text-foreground flex items-center gap-2" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        이름
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'email',
    header: '이메일',
  },
  {
    accessorKey: 'role',
    header: '역할',
    cell: ({ row }) => {
      const role = row.getValue('role') as string;
      const roleLabels = { admin: '관리자', user: '사용자', guest: '게스트' };
      return <div>{roleLabels[role as keyof typeof roleLabels]}</div>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'status',
    header: '상태',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <span
          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
            status === 'active'
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
          }`}
        >
          {status === 'active' ? '활성' : '비활성'}
        </span>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <button className="hover:text-foreground flex items-center gap-2" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        가입일
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
  },
];

// 액션 포함 컬럼
const actionColumns: ColumnDef<User>[] = [
  ...sortableColumns,
  {
    id: 'actions',
    header: () => <div className="text-center">작업</div>,
    cell: () => (
      <div className="flex items-center justify-center gap-2">
        <button className="hover:text-primary rounded p-1 transition-colors" title="수정">
          <Pencil className="h-4 w-4" />
        </button>
        <button className="hover:text-destructive rounded p-1 transition-colors" title="삭제">
          <Trash2 className="h-4 w-4" />
        </button>
        <button className="hover:text-foreground rounded p-1 transition-colors" title="더보기">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
    ),
  },
];

const meta = {
  title: 'Components/DataTable',
  component: DataTable,
  parameters: {
    layout: 'padded',
    docs: {
      page: () => (
        <CustomDocsPage
          componentName="DataTable"
          description="TanStack Table을 기반으로 한 강력한 데이터 테이블 컴포넌트입니다. 검색, 필터링, 정렬, 페이지네이션 등 다양한 기능을 지원합니다."
          installationDeps={['@tanstack/react-table', 'lucide-react']}
          implementationCode={`// 기본 DataTable 사용
import { DataTable } from '@shared/components/data-table';
import { type ColumnDef } from '@tanstack/react-table';

interface User {
  id: string;
  name: string;
  email: string;
}

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: '이름',
  },
  {
    accessorKey: 'email',
    header: '이메일',
  },
];

const data: User[] = [
  { id: '1', name: '김철수', email: 'kim@example.com' },
  { id: '2', name: '이영희', email: 'lee@example.com' },
];

export default function Example() {
  return (
    <DataTable 
      columns={columns} 
      data={data}
      searchPlaceholder="이름 검색..."
      searchKey="name"
    />
  );
}`}
          exampleCode={`// 고급 기능 사용 예시
import { DataTable } from '@shared/components/data-table';
import { useDataTableController } from '@shared/components/data-table';

export default function UserTable() {
  const controller = useDataTableController({
    columns,
    data,
    searchKey: 'name',
    filters: [
      {
        columnId: 'role',
        title: '역할',
        options: [
          { label: '관리자', value: 'admin' },
          { label: '사용자', value: 'user' },
        ],
      },
    ],
  });

  return <DataTable {...controller.tableProps} />;
}`}
        />
      ),
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

// 1. 기본 사용 예제
export const BasicUsage = {
  render: () => {
    return (
      <div className="w-full space-y-4">
        <div>
          <h2 className="mb-2 text-lg font-semibold">기본 테이블</h2>
          <p className="text-muted-foreground mb-4 text-sm">가장 간단한 형태의 DataTable입니다. 데이터와 컬럼만 전달하면 됩니다.</p>
        </div>
        <DataTable columns={basicColumns} data={sampleUsers} showToolbar={false} />
      </div>
    );
  },
} as unknown as Story;

// 2. 검색 및 필터링
export const SearchAndFilters = {
  render: () => {
    return (
      <div className="w-full space-y-4">
        <div>
          <h2 className="mb-2 text-lg font-semibold">검색 및 필터링</h2>
          <p className="text-muted-foreground mb-4 text-sm">검색창과 필터를 통해 데이터를 쉽게 찾을 수 있습니다.</p>
        </div>
        <DataTable
          columns={sortableColumns}
          data={sampleUsers}
          searchPlaceholder="이름 또는 이메일 검색..."
          searchKey="name"
          filters={[
            {
              columnId: 'role',
              title: '역할',
              options: [
                { label: '관리자', value: 'admin' },
                { label: '사용자', value: 'user' },
                { label: '게스트', value: 'guest' },
              ],
            },
            {
              columnId: 'status',
              title: '상태',
              options: [
                { label: '활성', value: 'active' },
                { label: '비활성', value: 'inactive' },
              ],
            },
          ]}
        />
      </div>
    );
  },
} as unknown as Story;

// 3. 실제 사용 예제 (완전한 기능)
function FullFeaturedExample() {
  const [data] = useState(sampleUsers);

  return (
    <div className="w-full space-y-4">
      <div className="bg-card rounded-lg border p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">사용자 관리</h2>
            <p className="text-muted-foreground mt-1 text-sm">전체 사용자 목록을 관리하고 조회할 수 있습니다.</p>
          </div>
          <button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium">+ 새 사용자</button>
        </div>

        {/* 통계 카드 */}
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="bg-background rounded-lg border p-4 shadow-sm">
            <p className="text-muted-foreground text-sm">전체 사용자</p>
            <p className="mt-2 text-2xl font-bold">{data.length}</p>
            <p className="text-muted-foreground mt-1 text-xs">등록된 사용자 수</p>
          </div>
          <div className="bg-background rounded-lg border p-4 shadow-sm">
            <p className="text-muted-foreground text-sm">활성 사용자</p>
            <p className="mt-2 text-2xl font-bold text-green-600 dark:text-green-400">{data.filter(u => u.status === 'active').length}</p>
            <p className="text-muted-foreground mt-1 text-xs">현재 활동 중</p>
          </div>
          <div className="bg-background rounded-lg border p-4 shadow-sm">
            <p className="text-muted-foreground text-sm">관리자</p>
            <p className="mt-2 text-2xl font-bold text-blue-600 dark:text-blue-400">{data.filter(u => u.role === 'admin').length}</p>
            <p className="text-muted-foreground mt-1 text-xs">관리 권한 보유</p>
          </div>
        </div>

        {/* 데이터 테이블 */}
        <DataTable
          columns={actionColumns}
          data={data}
          searchPlaceholder="이름 또는 이메일 검색..."
          searchKey="name"
          filters={[
            {
              columnId: 'role',
              title: '역할',
              options: [
                { label: '관리자', value: 'admin' },
                { label: '사용자', value: 'user' },
                { label: '게스트', value: 'guest' },
              ],
            },
            {
              columnId: 'status',
              title: '상태',
              options: [
                { label: '활성', value: 'active' },
                { label: '비활성', value: 'inactive' },
              ],
            },
          ]}
        />
      </div>
    </div>
  );
}

export const FullFeatured = {
  render: () => <FullFeaturedExample />,
} as unknown as Story;

// 4. 로딩 상태
export const LoadingState = {
  render: () => {
    return (
      <div className="w-full space-y-4">
        <div>
          <h2 className="mb-2 text-lg font-semibold">로딩 상태</h2>
          <p className="text-muted-foreground mb-4 text-sm">데이터를 불러오는 동안 스켈레톤 UI가 표시됩니다.</p>
        </div>
        <DataTable columns={basicColumns} data={[]} isLoading={true} />
      </div>
    );
  },
} as unknown as Story;

// 5. 빈 상태
export const EmptyState = {
  render: () => {
    return (
      <div className="w-full space-y-4">
        <div>
          <h2 className="mb-2 text-lg font-semibold">빈 상태</h2>
          <p className="text-muted-foreground mb-4 text-sm">데이터가 없을 때 표시되는 화면입니다.</p>
        </div>
        <DataTable columns={basicColumns} data={[]} emptyMessage="등록된 사용자가 없습니다." />
      </div>
    );
  },
} as unknown as Story;

// 6. 커스텀 페이지 크기
export const CustomPageSize = {
  render: () => {
    return (
      <div className="w-full space-y-4">
        <div>
          <h2 className="mb-2 text-lg font-semibold">커스텀 페이지 크기</h2>
          <p className="text-muted-foreground mb-4 text-sm">초기 페이지 크기를 5로 설정한 예제입니다.</p>
        </div>
        <DataTable columns={basicColumns} data={sampleUsers} pagination={{ pageIndex: 0, pageSize: 5 }} searchPlaceholder="검색..." searchKey="name" />
      </div>
    );
  },
} as unknown as Story;
