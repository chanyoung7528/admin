import type { ChartDataPoint, Order, RevenueGoal, SalesCategory, Schedule, StatCard } from '../types';

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

export const revenueGoals: RevenueGoal[] = [
  { label: '마케팅', amount: '₩39,739,700', percentage: 85, color: 'bg-primary' },
  { label: '영업', amount: '₩26,632,380', percentage: 55, color: 'bg-orange-500' },
];

export const salesCategoryData: SalesCategory[] = [
  { name: '제휴 프로그램', value: 48, count: '2,040개 상품', color: '#3b82f6' },
  { name: '직접 구매', value: 33, count: '1,402개 상품', color: '#f97316' },
  { name: '광고 수익', value: 19, count: '510개 상품', color: '#10b981' },
];

export const upcomingSchedule: Schedule[] = [
  {
    date: '1월 11일 (수)',
    time: '오전 9:20',
    title: '비즈니스 분석 발표',
    description: '데이터 기반 미래 탐색 외 6건',
    type: 'primary',
  },
  {
    date: '2월 15일 (금)',
    time: '오전 10:35',
    title: '비즈니스 스프린트',
    description: '비즈니스 스프린트 기법 외 2건',
    type: 'orange',
  },
  {
    date: '3월 18일 (목)',
    time: '오전 1:15',
    title: '고객 리뷰 미팅',
    description: '고객 리뷰 미팅 인사이트 외 8건',
    type: 'green',
  },
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
