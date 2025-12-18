export type TrendType = 'up' | 'down';

export interface StatCard {
  title: string;
  value: string;
  change: string;
  trend: TrendType;
  period: string;
}

export interface ChartDataPoint {
  name: string;
  profit: number;
  revenue: number;
}

export interface ProfitInsight {
  label: string;
  value: string;
  change: string;
  trend: TrendType;
}

export interface SalesCategory {
  name: string;
  value: number;
  count: string;
  color: string;
  customRadius: number;
}

export type OrderStatus = 'Complete' | 'Pending';

export interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
    avatar: string;
  };
  product: string;
  amount: string;
  date: string;
  status: OrderStatus;
}
