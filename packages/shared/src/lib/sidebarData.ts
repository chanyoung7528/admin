import { BarChart3, Command, LayoutDashboard } from 'lucide-react';

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
          title: '정산',
          icon: BarChart3,
          items: [
            {
              title: '정산 조회',
              url: '/settlement/basic-table',
            },
            {
              title: '정산 목록',
              url: '/settlement/list',
            },
            {
              title: '정산 등록',
              url: '/settlement/register',
            },
          ],
        },
      ],
    },
  ],
};
