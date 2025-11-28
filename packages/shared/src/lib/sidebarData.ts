import { BarChart3, Command, LayoutDashboard, TrendingUp } from 'lucide-react';
import type { SidebarData } from '../types/sidebar';

export const sidebarData: SidebarData = {
  user: {
    name: '김준석',
    email: 'junseok.kim@sncl.kr',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: '관리자 시스템',
      logo: Command,
      plan: 'Management System',
    },
  ],
  navGroups: [
    {
      title: '템플릿',
      items: [
        {
          title: '대시보드',
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: '정산 관리',
          icon: BarChart3,
          items: [
            {
              title: '결제/정산 내역',
              url: '/my-food/settlement',
            },
            {
              title: '운영 Report',
              url: '/my-food/report',
            },
          ],
        },
        {
          title: '이용 현황',
          icon: TrendingUp,
          items: [
            {
              title: '모니터링',
              url: '/my-food/monitoring',
            },
            {
              title: '구매/배송 내역',
              url: '/my-food/delivery',
            },
            {
              title: 'Dashboard',
              url: '/my-food/dashboard',
            },
          ],
        },
      ],
    },
    // {
    //   title: 'Management',
    //   items: [
    //     {
    //       title: 'Dashboard',
    //       url: '/',
    //       icon: LayoutDashboard,
    //     },
    //     {
    //       title: '사용자 관리',
    //       icon: Users,
    //       items: [
    //         {
    //           title: '사용자 현황',
    //           url: '/user/list',
    //         },
    //         {
    //           title: '사용자 Insight',
    //           url: '/user/insight',
    //         },
    //         {
    //           title: '신규회원 등록',
    //           url: '/user/register',
    //         },
    //         {
    //           title: '메시지 발송',
    //           url: '/user/message',
    //         },
    //         {
    //           title: '1:1 문의/요청 관리',
    //           url: '/inquiry',
    //         },
    //       ],
    //     },
    //     {
    //       title: '이용 현황',
    //       icon: Activity,
    //       items: [
    //         {
    //           title: '모니터링',
    //           url: '/monitoring',
    //         },
    //         {
    //           title: '결제/정산',
    //           url: '/report',
    //         },
    //       ],
    //     },
    //   ],
    // },
    // {
    //   title: 'MY FOOD',
    //   items: [
    //     {
    //       title: '발주 관리',
    //       icon: ShoppingCart,
    //       items: [
    //         {
    //           title: '주문/입고/판매 내역',
    //           url: '/my-food/order',
    //         },
    //         {
    //           title: '계산서 출력',
    //           url: '/my-food/invoice',
    //         },
    //         {
    //           title: '1:1 문의/요청 관리',
    //           url: '/my-food/inquiry',
    //         },
    //       ],
    //     },
    //     {
    //       title: '이용 현황',
    //       icon: TrendingUp,
    //       items: [
    //         {
    //           title: '모니터링',
    //           url: '/my-food/monitoring',
    //         },
    //         {
    //           title: '구매/배송 내역',
    //           url: '/my-food/delivery',
    //         },
    //         {
    //           title: 'Dashboard',
    //           url: '/my-food/dashboard',
    //         },
    //       ],
    //     },
    //     {
    //       title: 'B2B 정산 관리',
    //       icon: BarChart3,
    //       items: [
    //         {
    //           title: '결제/정산 내역',
    //           url: '/my-food/settlement',
    //         },
    //         {
    //           title: '운영 Report',
    //           url: '/my-food/report',
    //         },
    //       ],
    //     },
    //   ],
    // },
  ],
};
