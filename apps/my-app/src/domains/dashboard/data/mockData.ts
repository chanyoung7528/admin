import type { ChartDataPoint, Order, ProfitInsight, SalesCategory, StatCard } from '../types';

export const statsData: StatCard[] = [
  {
    title: '활성 거래',
    value: '₩156,480,000',
    change: '+20%',
    trend: 'up',
    period: '전월 대비',
  },
  {
    title: '총 매출',
    value: '₩304,473,000',
    change: '+9.0%',
    trend: 'up',
    period: '전월 대비',
  },
  {
    title: '완료된 거래',
    value: '874',
    change: '-4.5%',
    trend: 'down',
    period: '전월 대비',
  },
];

export const profitData: ChartDataPoint[] = [
  { name: '1월', profit: 4000, revenue: 2400 },
  { name: '2월', profit: 3000, revenue: 1398 },
  { name: '3월', profit: 2000, revenue: 9800 },
  { name: '4월', profit: 2780, revenue: 3908 },
  { name: '5월', profit: 1890, revenue: 4800 },
  { name: '6월', profit: 2390, revenue: 3800 },
  { name: '7월', profit: 3490, revenue: 4300 },
  { name: '8월', profit: 4000, revenue: 2400 },
  { name: '9월', profit: 3000, revenue: 1398 },
  { name: '10월', profit: 2000, revenue: 9800 },
  { name: '11월', profit: 2780, revenue: 3908 },
  { name: '12월', profit: 1890, revenue: 4800 },
];

export const profitInsights: ProfitInsight[] = [
  {
    label: '연평균 수익',
    value: '₩275,944,758',
    change: '+23.2%',
    trend: 'up',
  },
  {
    label: '연평균 매출',
    value: '₩39,417,600',
    change: '-12.3%',
    trend: 'down',
  },
];

export const salesCategoryData: SalesCategory[] = [
  { name: '제휴 프로그램', value: 48, count: '2,040개 상품', color: '#3b82f6', customRadius: 110 },
  { name: '직접 구매', value: 33, count: '1,402개 상품', color: '#f97316', customRadius: 90 },
  { name: '광고 수익', value: 19, count: '510개 상품', color: '#10b981', customRadius: 70 },
];

export const recentOrders: Order[] = [
  {
    id: 'ORD-2024-001',
    customer: { name: '김민준', email: 'minjun.kim@example.com', avatar: '김' },
    product: '소프트웨어 라이선스',
    amount: '₩2,405,444',
    date: '2024-06-15',
    status: 'Complete',
  },
  {
    id: 'ORD-2024-002',
    customer: { name: '이서연', email: 'seoyeon.lee@example.com', avatar: '이' },
    product: '소프트웨어 라이선스',
    amount: '₩2,405,444',
    date: '2024-06-15',
    status: 'Complete',
  },
  {
    id: 'ORD-2024-003',
    customer: { name: '박지호', email: 'jiho.park@example.com', avatar: '박' },
    product: '소프트웨어 라이선스',
    amount: '₩2,405,444',
    date: '2024-06-15',
    status: 'Pending',
  },
  {
    id: 'ORD-2024-004',
    customer: { name: '최수아', email: 'sua.choi@example.com', avatar: '최' },
    product: '소프트웨어 라이선스',
    amount: '₩2,405,444',
    date: '2024-06-15',
    status: 'Complete',
  },
  {
    id: 'ORD-2024-005',
    customer: { name: '정예준', email: 'yejun.jung@example.com', avatar: '정' },
    product: '소프트웨어 라이선스',
    amount: '₩2,405,444',
    date: '2024-06-15',
    status: 'Complete',
  },
];
