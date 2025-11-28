import { BasicTable, type BasicTableColumn } from '@repo/shared/components/ui';
import type { Meta, StoryObj } from '@storybook/react';
import { CustomDocsPage } from '../components/CustomDocsPage';

// 샘플 데이터 타입 정의
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'available' | 'low' | 'out';
}

interface Order {
  id: string;
  customer: string;
  items: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  date: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  joinDate: string;
}

const meta = {
  title: 'UI Components/BasicTable',
  component: BasicTable,
  parameters: {
    layout: 'padded',
    docs: {
      page: () => (
        <CustomDocsPage
          componentName="BasicTable"
          description="간단한 리스트 표시용 재사용 가능한 테이블 컴포넌트입니다. shadcn UI table을 기반으로 하며, 복잡한 필터링이나 정렬 없이 데이터를 깔끔하게 표시하는 용도로 사용됩니다."
          implementationCode={`import { BasicTable, type BasicTableColumn } from "@repo/shared/components/ui";

interface Order {
  id: string;
  site: string;
  amount: number;
  status: string;
}

const columns: BasicTableColumn<Order>[] = [
  {
    key: 'id',
    header: '주문번호',
    accessor: 'id',
    cellClassName: 'font-medium',
  },
  {
    key: 'site',
    header: 'Site명',
    accessor: 'site',
  },
  {
    key: 'amount',
    header: '주문금액',
    headerAlign: 'right',
    cellAlign: 'right',
    cell: (row) => \`₩\${row.amount.toLocaleString()}\`,
  },
  {
    key: 'status',
    header: '상태',
    headerAlign: 'center',
    cellAlign: 'center',
    cell: (row) => (
      <span className="px-2 py-1 rounded-full bg-green-100 text-green-800">
        {row.status}
      </span>
    ),
  },
];

export function OrderList() {
  return (
    <BasicTable
      data={orders}
      columns={columns}
      emptyMessage="주문 내역이 없습니다."
      onRowClick={(row) => console.log('클릭:', row)}
    />
  );
}`}
          exampleCode={`// 기본 사용
<BasicTable data={products} columns={productColumns} />

// 로딩 상태
<BasicTable data={[]} columns={columns} isLoading={true} />

// 빈 데이터 메시지
<BasicTable 
  data={[]} 
  columns={columns} 
  emptyMessage="등록된 상품이 없습니다."
/>

// 행 클릭 핸들러
<BasicTable
  data={users}
  columns={userColumns}
  onRowClick={(user) => console.log('선택된 사용자:', user)}
/>

// 커스텀 키 생성
<BasicTable
  data={items}
  columns={columns}
  getRowKey={(row, index) => \`item-\${row.id}-\${index}\`}
/>`}
        />
      ),
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof BasicTable>;

export default meta;
type Story = StoryObj<typeof meta>;

// 샘플 데이터
const sampleProducts: Product[] = [
  { id: 'P001', name: '무선 마우스', category: '전자기기', price: 35000, stock: 150, status: 'available' },
  { id: 'P002', name: '기계식 키보드', category: '전자기기', price: 89000, stock: 8, status: 'low' },
  { id: 'P003', name: '모니터 암', category: '액세서리', price: 45000, stock: 0, status: 'out' },
  { id: 'P004', name: 'USB 허브', category: '액세서리', price: 25000, stock: 200, status: 'available' },
  { id: 'P005', name: '웹캠', category: '전자기기', price: 65000, stock: 45, status: 'available' },
];

const sampleOrders: Order[] = [
  { id: 'ORD-2025-001', customer: '강남 헬스케어', items: '프로틴 바 외 5건', amount: 450000, status: 'completed', date: '2025-11-08' },
  { id: 'ORD-2025-002', customer: '서초 웰니스', items: '건강식 도시락 외 3건', amount: 320000, status: 'processing', date: '2025-11-09' },
  { id: 'ORD-2025-003', customer: '판교 케어센터', items: '샐러드 키트 외 8건', amount: 680000, status: 'pending', date: '2025-11-10' },
  { id: 'ORD-2025-004', customer: '분당 피트니스', items: '프로틴 쉐이크 외 2건', amount: 280000, status: 'cancelled', date: '2025-11-11' },
];

const sampleUsers: User[] = [
  { id: 1, name: '김철수', email: 'chulsoo@example.com', role: '관리자', joinDate: '2023-01-15' },
  { id: 2, name: '이영희', email: 'younghee@example.com', role: '매니저', joinDate: '2023-03-22' },
  { id: 3, name: '박민수', email: 'minsu@example.com', role: '일반', joinDate: '2024-01-10' },
  { id: 4, name: '정수진', email: 'sujin@example.com', role: '일반', joinDate: '2024-05-18' },
];

// 컬럼 정의
const productColumns: BasicTableColumn<Product>[] = [
  {
    key: 'id',
    header: '상품코드',
    accessor: 'id',
    cellClassName: 'font-medium',
    width: '100px',
  },
  {
    key: 'name',
    header: '상품명',
    accessor: 'name',
  },
  {
    key: 'category',
    header: '카테고리',
    accessor: 'category',
  },
  {
    key: 'price',
    header: '가격',
    headerAlign: 'right',
    cellAlign: 'right',
    cellClassName: 'font-medium',
    cell: row => `₩${row.price.toLocaleString()}`,
  },
  {
    key: 'stock',
    header: '재고',
    headerAlign: 'center',
    cellAlign: 'center',
    cell: row => (
      <span className={`font-semibold ${row.stock === 0 ? 'text-red-600' : row.stock < 10 ? 'text-yellow-600' : 'text-green-600'}`}>{row.stock}</span>
    ),
  },
  {
    key: 'status',
    header: '상태',
    headerAlign: 'center',
    cellAlign: 'center',
    cell: row => (
      <span
        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
          row.status === 'available'
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            : row.status === 'low'
              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        }`}
      >
        {row.status === 'available' ? '판매중' : row.status === 'low' ? '재고부족' : '품절'}
      </span>
    ),
  },
];

const orderColumns: BasicTableColumn<Order>[] = [
  {
    key: 'id',
    header: '주문번호',
    accessor: 'id',
    cellClassName: 'font-medium',
  },
  {
    key: 'customer',
    header: '고객명',
    accessor: 'customer',
  },
  {
    key: 'items',
    header: '주문품목',
    accessor: 'items',
  },
  {
    key: 'amount',
    header: '주문금액',
    headerAlign: 'right',
    cellAlign: 'right',
    cellClassName: 'font-medium',
    cell: row => `₩${row.amount.toLocaleString()}`,
  },
  {
    key: 'date',
    header: '주문일',
    accessor: 'date',
  },
  {
    key: 'status',
    header: '상태',
    headerAlign: 'center',
    cellAlign: 'center',
    cell: row => (
      <span
        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
          row.status === 'completed'
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            : row.status === 'processing'
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              : row.status === 'pending'
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
        }`}
      >
        {row.status === 'completed' ? '배송완료' : row.status === 'processing' ? '배송중' : row.status === 'pending' ? '주문확인' : '취소됨'}
      </span>
    ),
  },
];

const userColumns: BasicTableColumn<User>[] = [
  {
    key: 'id',
    header: 'ID',
    accessor: 'id',
    width: '60px',
    cellClassName: 'font-medium',
  },
  {
    key: 'name',
    header: '이름',
    accessor: 'name',
    cellClassName: 'font-semibold',
  },
  {
    key: 'email',
    header: '이메일',
    accessor: 'email',
  },
  {
    key: 'role',
    header: '역할',
    headerAlign: 'center',
    cellAlign: 'center',
    cell: row => (
      <span
        className={`inline-flex rounded-md px-2 py-1 text-xs font-semibold ${
          row.role === '관리자'
            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
            : row.role === '매니저'
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
        }`}
      >
        {row.role}
      </span>
    ),
  },
  {
    key: 'joinDate',
    header: '가입일',
    accessor: 'joinDate',
  },
];

/**
 * 기본 BasicTable 예제
 */
export const Default: Story = {
  args: {
    data: sampleProducts,
    columns: productColumns,
  },
};

/**
 * 주문 테이블 예제
 */
export const OrderTable: Story = {
  args: {
    data: sampleOrders,
    columns: orderColumns,
  },
};

/**
 * 사용자 테이블 예제
 */
export const UserTable: Story = {
  args: {
    data: sampleUsers,
    columns: userColumns,
  },
};

/**
 * 로딩 상태
 */
export const Loading: Story = {
  args: {
    data: [],
    columns: productColumns,
    isLoading: true,
    skeletonRows: 5,
  },
};

/**
 * 빈 데이터 상태
 */
export const Empty: Story = {
  args: {
    data: [],
    columns: productColumns,
    emptyMessage: '등록된 상품이 없습니다.',
  },
};

/**
 * 커스텀 빈 메시지
 */
export const CustomEmptyMessage: Story = {
  args: {
    data: [],
    columns: orderColumns,
    emptyMessage: '😔 아직 주문 내역이 없습니다. 첫 주문을 생성해보세요!',
  },
};

/**
 * 행 클릭 가능 테이블
 */
export const ClickableRows: Story = {
  args: {
    data: sampleUsers,
    columns: userColumns,
    onRowClick: (row, index) => {
      alert(`사용자 선택:\n이름: ${row.name}\n이메일: ${row.email}\n인덱스: ${index}`);
    },
  },
};

/**
 * 작은 데이터셋
 */
export const SmallDataset: Story = {
  args: {
    data: sampleProducts.slice(0, 2),
    columns: productColumns,
  },
};

/**
 * 커스텀 스타일링
 */
export const CustomStyling: Story = {
  args: {
    data: sampleProducts.slice(0, 3),
    columns: [
      {
        key: 'id',
        header: '상품코드',
        accessor: 'id',
        headerClassName: 'bg-blue-100 dark:bg-blue-900',
        cellClassName: 'font-bold text-blue-600 dark:text-blue-400',
      },
      {
        key: 'name',
        header: '상품명',
        accessor: 'name',
        headerClassName: 'bg-purple-100 dark:bg-purple-900',
      },
      {
        key: 'price',
        header: '가격',
        headerAlign: 'right',
        cellAlign: 'right',
        headerClassName: 'bg-green-100 dark:bg-green-900',
        cellClassName: 'font-bold text-green-600 dark:text-green-400',
        cell: row => `₩${row.price.toLocaleString()}`,
      },
    ],
  },
};

/**
 * 컨테이너 커스텀 클래스
 */
export const CustomContainer: Story = {
  args: {
    data: sampleProducts.slice(0, 3),
    columns: productColumns,
    className: 'shadow-xl border-2 border-blue-200 dark:border-blue-800',
  },
};

/**
 * 최소 컬럼
 */
export const MinimalColumns: Story = {
  args: {
    data: sampleUsers,
    columns: [
      {
        key: 'name',
        header: '이름',
        accessor: 'name',
      },
      {
        key: 'email',
        header: '이메일',
        accessor: 'email',
      },
    ],
  },
};

/**
 * 다양한 정렬
 */
export const VariousAlignment: Story = {
  args: {
    data: sampleOrders.slice(0, 3),
    columns: [
      {
        key: 'id',
        header: '주문번호',
        headerAlign: 'left',
        cellAlign: 'left',
        accessor: 'id',
      },
      {
        key: 'customer',
        header: '고객명',
        headerAlign: 'center',
        cellAlign: 'center',
        accessor: 'customer',
      },
      {
        key: 'amount',
        header: '주문금액',
        headerAlign: 'right',
        cellAlign: 'right',
        cell: row => `₩${row.amount.toLocaleString()}`,
      },
    ],
  },
};
