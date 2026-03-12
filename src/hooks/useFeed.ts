import { useInfiniteQuery } from '@tanstack/react-query';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import type { CatchDocument } from '../types/catch.types';

const FEED_PAGE_SIZE = 15;

async function fetchFeedPage(
  lastDoc?: FirebaseFirestoreTypes.DocumentSnapshot
) {
  let query = firestore()
    .collection('catches')
    .where('isPublic', '==', true)
    .orderBy('createdAt', 'desc')
    .limit(FEED_PAGE_SIZE);

  if (lastDoc) {
    query = query.startAfter(lastDoc);
  }

  // DÔLEŽITÉ: getDocs pattern (nie onSnapshot) — battery optimization
  // onSnapshot pre feed = battery drain + nadmerné Firestore reads
  const snapshot = await query.get();

  return {
    catches: snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as CatchDocument[],
    lastDoc: snapshot.docs[snapshot.docs.length - 1] ?? null,
    hasMore: snapshot.docs.length === FEED_PAGE_SIZE,
  };
}

export function useFeed() {
  return useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: ({ pageParam }) => fetchFeedPage(pageParam as FirebaseFirestoreTypes.DocumentSnapshot | undefined),
    initialPageParam: undefined as FirebaseFirestoreTypes.DocumentSnapshot | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.lastDoc : undefined,
    staleTime: 60 * 1000, // 1 minúta — pull-to-refresh obnoví
  });
}
