import { Item, Root as Radio } from '@radix-ui/react-radio-group';
import { IconLayoutCompact } from '@shared/assets/custom/IconLayoutCompact';
import { IconLayoutDefault } from '@shared/assets/custom/IconLayoutDefault';
import { IconLayoutFull } from '@shared/assets/custom/IconLayoutFull';
import { IconSidebarFloating } from '@shared/assets/custom/IconSidebarFloating';
import { IconSidebarInset } from '@shared/assets/custom/IconSidebarInset';
import { IconSidebarSidebar } from '@shared/assets/custom/IconSidebarSidebar';
import { IconThemeDark } from '@shared/assets/custom/IconThemeDark';
import { IconThemeLight } from '@shared/assets/custom/IconThemeLight';
import { IconThemeSystem } from '@shared/assets/custom/IconThemeSystem';
import { type Collapsible, useLayout } from '@shared/components/context/LayoutProvider';
import { useTheme } from '@shared/components/context/ThemeProvider';
import { useSidebar } from '@shared/components/ui';
import { Button } from '@shared/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@shared/components/ui/sheet';
import { Slider } from '@shared/components/ui/slider';
import { cn } from '@shared/lib/utils';
import { CircleCheck, RotateCcw, Settings } from 'lucide-react';
import { type SVGProps } from 'react';

export function ConfigDrawer() {
  const { setOpen } = useSidebar();
  const { resetTheme } = useTheme();
  const { resetLayout } = useLayout();

  const handleReset = () => {
    setOpen(true);
    resetTheme();
    resetLayout();
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="ghost" aria-label="Open theme settings" aria-describedby="config-drawer-description" className="rounded-full">
          <Settings aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader className="pb-0 text-start">
          <SheetTitle>환경설정</SheetTitle>
          <SheetDescription id="config-drawer-description">사용자 환경설정을 조정합니다.</SheetDescription>
        </SheetHeader>
        <div className="space-y-6 overflow-y-auto px-4">
          <FontSizeConfig />
          <ThemeConfig />
          <SidebarConfig />
          <LayoutConfig />
        </div>
        <SheetFooter className="gap-2">
          <Button variant="destructive" onClick={handleReset} aria-label="Reset all settings to default values">
            초기화
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function SectionTitle({ title, showReset = false, onReset, className }: { title: string; showReset?: boolean; onReset?: () => void; className?: string }) {
  return (
    <div className={cn('text-muted-foreground mb-2 flex items-center gap-2 text-sm font-semibold', className)}>
      {title}
      {showReset && onReset && (
        <Button size="icon" variant="secondary" className="size-4 rounded-full" onClick={onReset}>
          <RotateCcw className="size-3" />
        </Button>
      )}
    </div>
  );
}

function RadioGroupItem({
  item,
  isTheme = false,
}: {
  item: {
    value: string;
    label: string;
    icon: (props: SVGProps<SVGSVGElement>) => React.ReactElement;
  };
  isTheme?: boolean;
}) {
  return (
    <Item
      value={item.value}
      className={cn('group outline-none', 'transition duration-200 ease-in')}
      aria-label={`Select ${item.label.toLowerCase()}`}
      aria-describedby={`${item.value}-description`}
    >
      <div
        className={cn(
          'ring-border relative rounded-[6px] ring-[1px]',
          'group-data-[state=checked]:ring-primary group-data-[state=checked]:shadow-2xl',
          'group-focus-visible:ring-2'
        )}
        role="img"
        aria-hidden="false"
        aria-label={`${item.label} option preview`}
      >
        <CircleCheck
          className={cn('fill-primary size-6 stroke-white', 'group-data-[state=unchecked]:hidden', 'absolute top-0 right-0 translate-x-1/2 -translate-y-1/2')}
          aria-hidden="true"
        />
        <item.icon
          className={cn(
            !isTheme && 'stroke-primary fill-primary group-data-[state=unchecked]:stroke-muted-foreground group-data-[state=unchecked]:fill-muted-foreground'
          )}
          aria-hidden="true"
        />
      </div>
      <div className="mt-1 text-xs" id={`${item.value}-description`} aria-live="polite">
        {item.label}
      </div>
    </Item>
  );
}

function FontSizeConfig() {
  const { defaultFontSize, fontSize, setFontSize } = useLayout();

  const handleValueChange = (value: number[]) => {
    setFontSize(value[0] ?? fontSize);
  };

  const handleValueCommit = (value: number[]) => {
    const newSize = value[0] ?? fontSize;
    setFontSize(newSize);
  };

  const handleReset = () => {
    setFontSize(defaultFontSize);
  };

  return (
    <div>
      <SectionTitle title="Font Size" showReset={fontSize !== defaultFontSize} onReset={handleReset} />
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">크기</span>
          <span className="text-foreground text-sm font-medium">{fontSize}%</span>
        </div>
        <Slider
          value={[fontSize]}
          onValueChange={handleValueChange}
          onValueCommit={handleValueCommit}
          min={75}
          max={125}
          step={5}
          className="w-full"
          aria-label="Adjust font size"
          aria-describedby="font-size-description"
        />
        <div className="text-muted-foreground flex justify-between text-xs">
          <span>작게 (75%)</span>
          <span>보통 (100%)</span>
          <span>크게 (125%)</span>
        </div>
      </div>
      <div id="font-size-description" className="sr-only">
        애플리케이션의 기본 글꼴 크기를 75%에서 125%로 조정합니다.
      </div>
    </div>
  );
}

function ThemeConfig() {
  const { defaultTheme, theme, setTheme } = useTheme();
  return (
    <div>
      <SectionTitle title="Theme" showReset={theme !== defaultTheme} onReset={() => setTheme(defaultTheme)} />
      <Radio
        value={theme}
        onValueChange={setTheme}
        className="grid w-full max-w-md grid-cols-3 gap-4"
        aria-label="Select theme preference"
        aria-describedby="theme-description"
      >
        {[
          {
            value: 'system',
            label: 'System',
            icon: IconThemeSystem,
          },
          {
            value: 'light',
            label: 'Light',
            icon: IconThemeLight,
          },
          {
            value: 'dark',
            label: 'Dark',
            icon: IconThemeDark,
          },
        ].map(item => (
          <RadioGroupItem key={item.value} item={item} isTheme />
        ))}
      </Radio>
      <div id="theme-description" className="sr-only">
        시스템 설정, 라이트 모드, 다크 모드 중 선택합니다.
      </div>
    </div>
  );
}

function SidebarConfig() {
  const { defaultVariant, variant, setVariant } = useLayout();
  return (
    <div className="max-md:hidden">
      <SectionTitle title="Sidebar" showReset={defaultVariant !== variant} onReset={() => setVariant(defaultVariant)} />
      <Radio
        value={variant}
        onValueChange={setVariant}
        className="grid w-full max-w-md grid-cols-3 gap-4"
        aria-label="Select sidebar style"
        aria-describedby="sidebar-description"
      >
        {[
          {
            value: 'inset',
            label: 'Inset',
            icon: IconSidebarInset,
          },
          {
            value: 'floating',
            label: 'Floating',
            icon: IconSidebarFloating,
          },
          {
            value: 'sidebar',
            label: 'Sidebar',
            icon: IconSidebarSidebar,
          },
        ].map(item => (
          <RadioGroupItem key={item.value} item={item} />
        ))}
      </Radio>
      <div id="sidebar-description" className="sr-only">
        인셋, 플로팅, 스탠다드 사이드바 레이아웃 중 선택합니다.
      </div>
    </div>
  );
}

function LayoutConfig() {
  const { open, setOpen } = useSidebar();
  const { defaultCollapsible, collapsible, setCollapsible } = useLayout();

  const radioState = open ? 'default' : collapsible;

  return (
    <div className="max-md:hidden">
      <SectionTitle
        title="Layout"
        showReset={radioState !== 'default'}
        onReset={() => {
          setOpen(true);
          setCollapsible(defaultCollapsible);
        }}
      />
      <Radio
        value={radioState}
        onValueChange={v => {
          if (v === 'default') {
            setOpen(true);
            return;
          }
          setOpen(false);
          setCollapsible(v as Collapsible);
        }}
        className="grid w-full max-w-md grid-cols-3 gap-4"
        aria-label="Select layout style"
        aria-describedby="layout-description"
      >
        {[
          {
            value: 'default',
            label: 'Default',
            icon: IconLayoutDefault,
          },
          {
            value: 'icon',
            label: 'Compact',
            icon: IconLayoutCompact,
          },
          {
            value: 'offcanvas',
            label: 'Full layout',
            icon: IconLayoutFull,
          },
        ].map(item => (
          <RadioGroupItem key={item.value} item={item} />
        ))}
      </Radio>
      <div id="layout-description" className="sr-only">
        기본 확장, 컴팩트 아이콘 오직, 전체 레이아웃 모드 중 선택합니다.
      </div>
    </div>
  );
}
