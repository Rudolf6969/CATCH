import { create } from 'zustand';

interface FeedState {
  likedCatchIds: Set<string>;
  bookmarkedCatchIds: Set<string>;
  toggleLike: (catchId: string) => void;
  toggleBookmark: (catchId: string) => void;
}

export const useFeedStore = create<FeedState>((set) => ({
  likedCatchIds: new Set(),
  bookmarkedCatchIds: new Set(),
  toggleLike: (catchId) =>
    set((state) => {
      const next = new Set(state.likedCatchIds);
      if (next.has(catchId)) next.delete(catchId);
      else next.add(catchId);
      return { likedCatchIds: next };
    }),
  toggleBookmark: (catchId) =>
    set((state) => {
      const next = new Set(state.bookmarkedCatchIds);
      if (next.has(catchId)) next.delete(catchId);
      else next.add(catchId);
      return { bookmarkedCatchIds: next };
    }),
}));
