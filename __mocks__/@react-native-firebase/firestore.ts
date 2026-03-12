const mockDocRef = {
  set: jest.fn().mockResolvedValue(undefined),
  get: jest.fn().mockResolvedValue({ exists: false, data: () => null }),
  update: jest.fn().mockResolvedValue(undefined),
  delete: jest.fn().mockResolvedValue(undefined),
};

const mockCollectionRef = {
  doc: jest.fn(() => mockDocRef),
  add: jest.fn().mockResolvedValue(mockDocRef),
  get: jest.fn().mockResolvedValue({ docs: [] }),
};

const mockFirestore = {
  collection: jest.fn(() => mockCollectionRef),
  FieldValue: {
    serverTimestamp: jest.fn(() => new Date()),
    arrayUnion: jest.fn((...items: any[]) => items),
    arrayRemove: jest.fn((...items: any[]) => items),
  },
};

const firestoreModule = jest.fn(() => mockFirestore);
(firestoreModule as any).default = firestoreModule;
(firestoreModule as any).FieldValue = mockFirestore.FieldValue;

module.exports = firestoreModule;
module.exports.default = firestoreModule;
module.exports.FieldValue = mockFirestore.FieldValue;

export { mockFirestore, mockDocRef, mockCollectionRef };
export default firestoreModule;
