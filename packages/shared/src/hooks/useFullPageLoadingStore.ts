import { create } from 'zustand';

interface FullPageLoadingState {
  activeIds: Set<number>;
  isVisible: boolean;
  show: (id: number) => void;
  hide: (id: number) => void;
}

export const useFullPageLoadingStore = create<FullPageLoadingState>()(set => ({
  activeIds: new Set(),
  isVisible: false,
  show: id =>
    set(state => {
      if (state.activeIds.has(id)) {
        return state;
      }
      const next = new Set(state.activeIds);
      next.add(id);
      return {
        activeIds: next,
        isVisible: true,
      };
    }),
  hide: id =>
    set(state => {
      if (!state.activeIds.has(id)) {
        return state;
      }
      const next = new Set(state.activeIds);
      next.delete(id);
      return {
        activeIds: next,
        isVisible: next.size > 0,
      };
    }),
}));
