import { Separator } from '@shared/components/ui/separator';
import { SidebarTrigger } from '@shared/components/ui/sidebar';
import { cn } from '@shared/lib/utils';
import { useEffect, useState } from 'react';

import { ConfigDrawer } from './header/ConfigDrawer';
import { ProfileDropdown } from './header/ProfileDropdown';
import { TopNav } from './header/TopNav';

type HeaderProps = React.HTMLAttributes<HTMLElement> & {
  fixed?: boolean;
  links?: {
    title: string;
    href: string;
    isActive: boolean;
    disabled?: boolean;
  }[];
  onSignOut?: () => void | Promise<void>;
};

export function Header({ className, fixed, children, links, onSignOut, ...props }: HeaderProps) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setOffset(document.body.scrollTop || document.documentElement.scrollTop);
    };

    // Add scroll listener to the body
    document.addEventListener('scroll', onScroll, { passive: true });

    // Clean up the event listener on unmount
    return () => document.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={cn('z-50 h-12', fixed && 'sticky top-0 w-[inherit]', offset > 10 && fixed ? 'shadow' : 'shadow-none', className)} {...props}>
      <div
        className={cn(
          'relative flex h-full items-center gap-3 p-3',
          offset > 10 && fixed && 'after:bg-background/20 after:absolute after:inset-0 after:-z-10 after:backdrop-blur-lg'
        )}
      >
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-6" />
        {links && <TopNav links={links} />}
        {children}

        <div className="ms-auto flex items-center gap-2">
          <ConfigDrawer />
          <ProfileDropdown onSignOut={onSignOut} />
        </div>
      </div>
    </header>
  );
}
