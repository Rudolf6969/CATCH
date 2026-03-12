import { create } from 'zustand';

interface UIState {
  totalUnreadMessages: number;
  setTotalUnreadMessages: (count: number) => void;
  isAddModalOpen: boolean;
  setAddModalOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  totalUnreadMessages: 0,
  setTotalUnreadMessages: (count) => set({ totalUnreadMessages: count }),
  isAddModalOpen: false,
  setAddModalOpen: (open) => set({ isAddModalOpen: open }),
}));
