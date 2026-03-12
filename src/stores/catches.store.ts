import { create } from 'zustand';
import type { CatchFilter } from '../types/catch.types';

interface CatchesState {
  filter: CatchFilter;
  setFilter: (filter: CatchFilter) => void;
  clearFilter: () => void;
}

export const useCatchesStore = create<CatchesState>((set) => ({
  filter: {},
  setFilter: (filter) => set({ filter }),
  clearFilter: () => set({ filter: {} }),
}));
