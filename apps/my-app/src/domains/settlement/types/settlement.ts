export interface Settlement {
  id: string;
  site: string;
  amount: number;
  period: string;
  status: 'completed' | 'pending';
  date: string;
  description?: string; // 향후 실제 API의 비고 필드
}

export type SettlementStatus = Settlement['status'];
