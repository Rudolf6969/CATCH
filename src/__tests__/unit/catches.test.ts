// Wave 0 scaffold — testy sa naplnia v 02-02, 02-04, 02-05
// Pokrýva: DIARY-01, DIARY-02, DIARY-03, DIARY-04, DIARY-05, DIARY-06

describe('catches — Firestore CRUD a schema', () => {
  describe('DIARY-01: Catch schema validation', () => {
    it.todo('catch document should have all required fields');
    it.todo('weightG should be in grams (number)');
    it.todo('photos array should contain downloadURL and blurhash');
  });

  describe('DIARY-03: Filter queries', () => {
    it.todo('filter by species should add correct where clause');
    it.todo('filter by date range should add correct where clauses');
  });

  describe('DIARY-04: Catch detail — weather snapshot', () => {
    it.todo('catch detail should contain weather snapshot from creation time');
  });

  describe('DIARY-05: Edit and delete', () => {
    it.todo('delete catch should call Firestore delete on correct path');
    it.todo('update catch should call Firestore update with changed fields');
  });

  describe('DIARY-06: Fire-and-forget offline write', () => {
    it.todo('createCatch should call docRef.set without await');
    it.todo('createCatch should not throw when offline');
  });
});
