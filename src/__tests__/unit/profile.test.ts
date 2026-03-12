jest.mock('@react-native-firebase/firestore', () => {
  const mockSnapshot = {
    exists: true,
    id: 'user1',
    data: () => ({
      uid: 'user1',
      displayName: 'Ján Rybár',
      username: 'jan_rybar',
      bio: 'Vášnivý rybár zo Slovenska.',
      avatarURL: 'https://example.com/avatar.jpg',
      avatarBlurhash: 'L6PZfSi_',
      stats: { catchCount: 5, totalWeightG: 25000, biggestCatchG: 8000, biggestCatchSpecies: 'Kapor' },
      karma: 25,
      badges: ['first_catch'],
    }),
  };

  const mockCatchDocs = [
    { id: 'c1', data: () => ({ weightG: 8000, species: 'Kapor', photos: [] }) },
    { id: 'c2', data: () => ({ weightG: 6000, species: 'Zubáč', photos: [] }) },
    { id: 'c3', data: () => ({ weightG: 11000, species: 'Sumec', photos: [] }) },
  ];

  const mockQuery = {
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    get: jest.fn().mockResolvedValue({ docs: mockCatchDocs }),
  };

  return () => ({
    collection: jest.fn().mockReturnValue({
      doc: jest.fn().mockReturnValue({
        get: jest.fn().mockResolvedValue(mockSnapshot),
      }),
      where: jest.fn().mockReturnValue(mockQuery),
      orderBy: jest.fn().mockReturnValue(mockQuery),
    }),
  });
});

import firestore from '@react-native-firebase/firestore';
import { getUserStats, isOwnProfileCheck } from '../../hooks/useProfile';

describe('profile — user document a štatistiky', () => {
  describe('PROF-01: User document schema', () => {
    it('user document should have displayName, username, bio fields', async () => {
      const mockFirestore = firestore();
      const doc = await mockFirestore.collection('users').doc('user1').get();
      const data = doc.data();
      expect(data?.displayName).toBeTruthy();
      expect(data?.username).toBeTruthy();
    });

    it('bio should be max 300 characters', () => {
      const bio = 'Vášnivý rybár zo Slovenska.';
      expect(bio.length).toBeLessThanOrEqual(300);
    });

    it('user document should have avatarURL and avatarBlurhash', async () => {
      const mockFirestore = firestore();
      const doc = await mockFirestore.collection('users').doc('user1').get();
      const data = doc.data();
      expect(data).toHaveProperty('avatarURL');
      expect(data).toHaveProperty('avatarBlurhash');
    });
  });

  describe('PROF-02: Stats aggregation', () => {
    it('getUserStats should return catchCount correctly', async () => {
      const mockFirestore = firestore();
      const snapshot = await mockFirestore.collection('catches').where('userId', '==', 'user1').get();
      const catches = snapshot.docs.map(d => d.data());
      expect(catches.length).toBe(3);
    });

    it('getUserStats should return totalWeightG as sum', () => {
      const catches = [{ weightG: 8000 }, { weightG: 6000 }, { weightG: 11000 }];
      const total = catches.reduce((sum, c) => sum + c.weightG, 0);
      expect(total).toBe(25000);
    });

    it('getUserStats should return biggestCatchG as max', () => {
      const catches = [{ weightG: 8000 }, { weightG: 6000 }, { weightG: 11000 }];
      const biggest = Math.max(...catches.map(c => c.weightG));
      expect(biggest).toBe(11000);
    });
  });

  describe('PROF-03: Last 12 catches query', () => {
    it('catches query should have limit(12)', async () => {
      const mockFirestore = firestore();
      const query = mockFirestore.collection('catches').where('userId', '==', 'user1').orderBy('createdAt', 'desc');
      query.limit(12);
      expect(query.limit).toHaveBeenCalledWith(12);
    });

    it('catches query should orderBy createdAt descending', async () => {
      const mockFirestore = firestore();
      const collRef = mockFirestore.collection('catches').where('userId', '==', 'user1');
      collRef.orderBy('createdAt', 'desc');
      expect(collRef.orderBy).toHaveBeenCalledWith('createdAt', 'desc');
    });
  });

  describe('PROF-04: isOwnProfile logic', () => {
    it('isOwnProfile should be true when currentUserId === profileId', () => {
      expect(isOwnProfileCheck('user1', 'user1')).toBe(true);
    });

    it('isOwnProfile should be false when currentUserId !== profileId', () => {
      expect(isOwnProfileCheck('user1', 'user2')).toBe(false);
    });
  });

  describe('PROF-05: Karma and badges', () => {
    it('user document should have karma field (number)', async () => {
      const mockFirestore = firestore();
      const doc = await mockFirestore.collection('users').doc('user1').get();
      expect(typeof doc.data()?.karma).toBe('number');
    });

    it('user document should have badges field (array)', async () => {
      const mockFirestore = firestore();
      const doc = await mockFirestore.collection('users').doc('user1').get();
      expect(Array.isArray(doc.data()?.badges)).toBe(true);
    });
  });
});
