export interface Settlement {
  id: string;
  site: string;
  amount: number;
  period: string;
  status: 'completed' | 'pending';
  date: string;
}

export type SettlementStatus = Settlement['status'];
