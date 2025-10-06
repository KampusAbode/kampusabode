// stores/useScrollStore.ts
import { create } from "zustand";

interface ScrollState {
  positions: Record<string, number>;
  setScroll: (path: string, pos: number) => void;
  getScroll: (path: string) => number;
}

export const useScrollStore = create<ScrollState>((set, get) => ({
  positions: {},
  setScroll: (path, pos) =>
    set((state) => ({
      positions: { ...state.positions, [path]: pos },
    })),
  getScroll: (path) => get().positions[path] || 0,
}));
