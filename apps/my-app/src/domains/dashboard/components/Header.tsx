import { useLogout } from '@/domains/auth/hooks/useLogout';
import { ConfigDrawer, ProfileDropdown, Header as SharedHeader, TopNav } from '@repo/shared/components/layouts';

const topNav = [
  { title: '개요', href: '/', isActive: true },
  { title: '인사이트', href: '/user/insight', isActive: false },
];

export function Header() {
  const { logout } = useLogout();

  return (
    <SharedHeader>
      <TopNav links={topNav} />
      <div className="ms-auto flex items-center space-x-4">
        <ConfigDrawer />
        <ProfileDropdown onSignOut={logout} />
      </div>
    </SharedHeader>
  );
}
