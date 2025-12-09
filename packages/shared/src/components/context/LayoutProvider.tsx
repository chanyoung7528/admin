import { createContext, useContext, useEffect, useState } from 'react';

export type Collapsible = 'offcanvas' | 'icon' | 'none';
export type Variant = 'inset' | 'sidebar' | 'floating';

// LocalStorage keys
const LAYOUT_COLLAPSIBLE_STORAGE_KEY = 'layout_collapsible';
const LAYOUT_VARIANT_STORAGE_KEY = 'layout_variant';
const LAYOUT_FONT_SIZE_STORAGE_KEY = 'layout_font_size';

// Default values
const DEFAULT_VARIANT = 'inset';
const DEFAULT_COLLAPSIBLE = 'icon';
const DEFAULT_FONT_SIZE = 100; // 100%

type LayoutContextType = {
  resetLayout: () => void;

  defaultCollapsible: Collapsible;
  collapsible: Collapsible;
  setCollapsible: (collapsible: Collapsible) => void;

  defaultVariant: Variant;
  variant: Variant;
  setVariant: (variant: Variant) => void;

  defaultFontSize: number;
  fontSize: number;
  setFontSize: (fontSize: number) => void;
};

const LayoutContext = createContext<LayoutContextType | null>(null);

type LayoutProviderProps = {
  children: React.ReactNode;
};

export function LayoutProvider({ children }: LayoutProviderProps) {
  const [collapsible, _setCollapsible] = useState<Collapsible>(() => {
    const saved = localStorage.getItem(LAYOUT_COLLAPSIBLE_STORAGE_KEY);
    return (saved as Collapsible) || DEFAULT_COLLAPSIBLE;
  });

  const [variant, _setVariant] = useState<Variant>(() => {
    const saved = localStorage.getItem(LAYOUT_VARIANT_STORAGE_KEY);
    return (saved as Variant) || DEFAULT_VARIANT;
  });

  const [fontSize, _setFontSize] = useState<number>(() => {
    const saved = localStorage.getItem(LAYOUT_FONT_SIZE_STORAGE_KEY);
    return saved ? Number(saved) : DEFAULT_FONT_SIZE;
  });

  const setCollapsible = (newCollapsible: Collapsible) => {
    _setCollapsible(newCollapsible);
    localStorage.setItem(LAYOUT_COLLAPSIBLE_STORAGE_KEY, newCollapsible);
  };

  const setVariant = (newVariant: Variant) => {
    _setVariant(newVariant);
    localStorage.setItem(LAYOUT_VARIANT_STORAGE_KEY, newVariant);
  };

  const setFontSize = (newFontSize: number) => {
    _setFontSize(newFontSize);
    localStorage.setItem(LAYOUT_FONT_SIZE_STORAGE_KEY, String(newFontSize));
  };

  // Apply font size to document root
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`;
  }, [fontSize]);

  const resetLayout = () => {
    setCollapsible(DEFAULT_COLLAPSIBLE);
    setVariant(DEFAULT_VARIANT);
    setFontSize(DEFAULT_FONT_SIZE);
  };

  const contextValue: LayoutContextType = {
    resetLayout,
    defaultCollapsible: DEFAULT_COLLAPSIBLE,
    collapsible,
    setCollapsible,
    defaultVariant: DEFAULT_VARIANT,
    variant,
    setVariant,
    defaultFontSize: DEFAULT_FONT_SIZE,
    fontSize,
    setFontSize,
  };

  return <LayoutContext value={contextValue}>{children}</LayoutContext>;
}

// Define the hook for the provider
export function useLayout() {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
}
