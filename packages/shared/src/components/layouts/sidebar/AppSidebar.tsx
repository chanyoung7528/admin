import { useLayout } from '@shared/components/context/LayoutProvider';
import { sidebarData } from '@shared/lib/sidebarData';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@shared/ui/sidebar';

import type { NavGroup as NavGroupType } from '../../../types/sidebar';
import { NavGroup } from './NavGroup';
import { NavUser } from './NavUser';
import { TeamSwitcher } from './TeamSwitcher';

interface AppSidebarProps {
  onSignOut?: () => void | Promise<void>;
}

export function AppSidebar({ onSignOut }: AppSidebarProps) {
  const { collapsible, variant } = useLayout();
  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <TeamSwitcher teams={sidebarData.teams} />
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.map((props: NavGroupType) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarData.user} onSignOut={onSignOut} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
