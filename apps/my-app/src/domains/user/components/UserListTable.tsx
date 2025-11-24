import { DataTable } from '@shared/components/data-table';
import { userColumns } from '../columns';
import { type User } from '../types';

export default function UserListTable() {
  // 샘플 데이터
  const users: User[] = [
    {
      id: 'U-001',
      name: '김철수',
      email: 'kim.cs@example.com',
      phone: '010-1234-5678',
      site: '강남 헬스케어',
      status: 'active',
      createdAt: '2025-01-15',
    },
    {
      id: 'U-002',
      name: '이영희',
      email: 'lee.yh@example.com',
      phone: '010-2345-6789',
      site: '서초 웰니스',
      status: 'active',
      createdAt: '2025-02-20',
    },
    {
      id: 'U-003',
      name: '박민수',
      email: 'park.ms@example.com',
      phone: '010-3456-7890',
      site: '판교 케어센터',
      status: 'inactive',
      createdAt: '2025-03-10',
    },
    {
      id: 'U-004',
      name: '정수진',
      email: 'jung.sj@example.com',
      phone: '010-4567-8901',
      site: '강남 헬스케어',
      status: 'suspended',
      createdAt: '2025-04-05',
    },
  ];

  return (
    <div className="bg-card rounded-lg border p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">사용자 목록</h2>
        <button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm">사용자 추가</button>
      </div>

      <DataTable
        columns={userColumns}
        data={users}
        searchPlaceholder="사용자 검색..."
        filters={[
          {
            columnId: 'status',
            title: '상태',
            options: [
              { label: '활성', value: 'active' },
              { label: '비활성', value: 'inactive' },
              { label: '정지', value: 'suspended' },
            ],
          },
        ]}
        emptyMessage="사용자가 없습니다."
      />
    </div>
  );
}
