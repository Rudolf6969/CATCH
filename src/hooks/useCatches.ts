import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import type { CatchDocument, CatchFilter } from '../types/catch.types';

// Exportovaná helper funkcia — testovateľná bez React
export function buildCatchQuery(
  collRef: FirebaseFirestoreTypes.CollectionReference,
  filter: CatchFilter
): FirebaseFirestoreTypes.Query {
  let query: FirebaseFirestoreTypes.Query = collRef as unknown as FirebaseFirestoreTypes.Query;

  if (filter.species) {
    query = query.where('species', '==', filter.species);
  }
  if (filter.method) {
    query = query.where('method', '==', filter.method);
  }
  if (filter.locationName) {
    query = query.where('locationName', '==', filter.locationName);
  }
  if (filter.dateFrom) {
    query = query.where('createdAt', '>=', filter.dateFrom);
  }
  if (filter.dateTo) {
    query = query.where('createdAt', '<=', filter.dateTo);
  }

  return query;
}

// Fire-and-forget write — offline-first. NIE async, NIE await na set()
export function createCatch(
  docRef: FirebaseFirestoreTypes.DocumentReference,
  catchData: CatchDocument
): void {
  // DÔLEŽITÉ: bez await — okamžité uloženie do lokálneho cache, async server sync
  docRef.set(catchData);
}

export async function deleteCatch(userId: string, catchId: string): Promise<void> {
  await firestore().collection('catches').doc(catchId).delete();
}

export function useCatches(userId: string, filter: CatchFilter = {}) {
  return useQuery({
    queryKey: ['catches', userId, filter],
    queryFn: async () => {
      const collRef = firestore()
        .collection('catches')
        .where('userId', '==', userId);

      const query = buildCatchQuery(
        collRef as unknown as FirebaseFirestoreTypes.CollectionReference,
        filter
      );

      const snapshot = await (query as any)
        .orderBy('createdAt', 'desc')
        .get();

      return snapshot.docs.map((d: FirebaseFirestoreTypes.DocumentSnapshot) => ({
        id: d.id,
        ...d.data(),
      })) as CatchDocument[];
    },
  });
}

export function useCatchDetail(catchId: string) {
  return useQuery({
    queryKey: ['catch', catchId],
    queryFn: async () => {
      const doc = await firestore().collection('catches').doc(catchId).get();
      if (!doc.exists) return null;
      return { id: doc.id, ...doc.data() } as CatchDocument;
    },
  });
}

export function useCreateCatch(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newCatch: CatchDocument) => {
      const docRef = firestore().collection('catches').doc(newCatch.id);
      // Fire-and-forget — offline-first write
      createCatch(docRef, newCatch);
      return newCatch;
    },
    onMutate: async (newCatch) => {
      await queryClient.cancelQueries({ queryKey: ['catches', userId] });
      const previousCatches = queryClient.getQueryData(['catches', userId]);
      queryClient.setQueryData(['catches', userId], (old: CatchDocument[] | undefined) => [
        { ...newCatch, id: newCatch.id || 'temp-' + Date.now() },
        ...(old ?? []),
      ]);
      return { previousCatches };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousCatches) {
        queryClient.setQueryData(['catches', userId], context.previousCatches);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['catches', userId] });
    },
  });
}

export function useUpdateCatch(userId: string, catchId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: Partial<CatchDocument>) => {
      await firestore().collection('catches').doc(catchId).update(updates as any);
      return updates;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['catches', userId] });
      queryClient.invalidateQueries({ queryKey: ['catch', catchId] });
    },
  });
}

export function useDeleteCatch(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (catchId: string) => deleteCatch(userId, catchId),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['catches', userId] });
    },
  });
}
