import { useQuery } from '@tanstack/react-query';
import firestore from '@react-native-firebase/firestore';
import type { UserDocument } from '../types/user.types';
import type { CatchDocument } from '../types/catch.types';

// Exportovaná helper funkcia — testovateľná bez React
export function isOwnProfileCheck(currentUserId: string, profileId: string): boolean {
  return currentUserId === profileId;
}

export async function getUserStats(userId: string) {
  const snapshot = await firestore()
    .collection('catches')
    .where('userId', '==', userId)
    .get();

  const catches = snapshot.docs.map(d => d.data() as CatchDocument);

  return {
    catchCount: catches.length,
    totalWeightG: catches.reduce((sum, c) => sum + (c.weightG ?? 0), 0),
    biggestCatchG: catches.length > 0 ? Math.max(...catches.map(c => c.weightG ?? 0)) : 0,
    biggestCatchSpecies: catches.reduce(
      (max, c) => (c.weightG ?? 0) > (max?.weightG ?? 0) ? c : max,
      catches[0]
    )?.species ?? '',
  };
}

export function useUserProfile(userId: string) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      const doc = await firestore().collection('users').doc(userId).get();
      if (!doc.exists) return null;
      return { uid: doc.id, ...doc.data() } as UserDocument;
    },
    enabled: !!userId,
  });
}

export function useUserStats(userId: string) {
  return useQuery({
    queryKey: ['profile-stats', userId],
    queryFn: () => getUserStats(userId),
    enabled: !!userId,
  });
}

export function useUserCatches(userId: string, limitTo = 12) {
  return useQuery({
    queryKey: ['profile-catches', userId, limitTo],
    queryFn: async () => {
      const snapshot = await firestore()
        .collection('catches')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .limit(limitTo)
        .get();

      return snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as CatchDocument[];
    },
    enabled: !!userId,
  });
}
