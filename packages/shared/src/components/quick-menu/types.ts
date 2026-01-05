export interface QuickMenuItem {
  id: string;
  title: string;
  icon: string; // lucide-react icon name or emoji
  href: string;
  color?: string;
  order: number;
}

export interface QuickMenuConfig {
  maxItems?: number;
  columns?: number;
  enableEdit?: boolean;
  onItemClick?: (item: QuickMenuItem) => void;
  onItemsChange?: (items: QuickMenuItem[]) => void;
}
