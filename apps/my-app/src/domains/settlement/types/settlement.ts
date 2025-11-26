export interface Settlement {
  id: string;
  site: string;
  amount: number;
  period: string;
  status: 'completed' | 'pending';
  date: string;
  description?: string; // JSONPlaceholder의 body를 설명으로 사용
}

export type SettlementStatus = Settlement['status'];

// JSONPlaceholder Post 타입
export interface JsonPlaceholderPost {
  userId: number;
  id: number;
  title: string;
  body: string;
}
