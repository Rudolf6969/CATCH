// Wave 0 scaffold — testy sa naplnia v 02-08 (profile screen)
// Pokrýva: PROF-01, PROF-02, PROF-03, PROF-04, PROF-05

describe('profile — user document a statistiky', () => {
  describe('PROF-01: User document schema', () => {
    it.todo('user document should have displayName, username, bio fields');
    it.todo('bio should be max 300 characters');
    it.todo('user document should have avatarURL and avatarBlurhash');
  });

  describe('PROF-02: Stats aggregation', () => {
    it.todo('getUserStats should return catchCount correctly');
    it.todo('getUserStats should return totalWeightG as sum');
    it.todo('getUserStats should return biggestCatchG as max');
  });

  describe('PROF-03: Last 12 catches query', () => {
    it.todo('catches query should have limit(12)');
    it.todo('catches query should orderBy createdAt descending');
  });

  describe('PROF-04: isOwnProfile logic', () => {
    it.todo('isOwnProfile should be true when currentUserId === profileId');
    it.todo('isOwnProfile should be false when currentUserId !== profileId');
  });

  describe('PROF-05: Karma and badges', () => {
    it.todo('user document should have karma field (number)');
    it.todo('user document should have badges field (array)');
  });
});
