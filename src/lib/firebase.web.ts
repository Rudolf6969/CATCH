// Web mock — react-native-firebase nie je dostupný na webe
// Slúži len na UI preview / development v browseri

const noop = () => {};

const mockUser = { uid: 'web-preview', email: 'preview@catch.app', displayName: 'Preview User' } as any;

const mockAuth = () => ({
  onAuthStateChanged: (cb: (user: null) => void) => {
    // Na webe simulujeme neprihlásený stav
    setTimeout(() => cb(mockUser), 0);
    return noop;
  },
  signInWithEmailAndPassword: async () => { throw new Error('Web mock — použite reálne zariadenie'); },
  createUserWithEmailAndPassword: async () => { throw new Error('Web mock — použite reálne zariadenie'); },
  sendPasswordResetEmail: async () => {},
  signOut: async () => {},
  currentUser: null,
});

mockAuth.onAuthStateChanged = (cb: (user: null) => void) => {
  setTimeout(() => cb(mockUser), 0);
  return noop;
};

const mockFirestore = () => ({});
const mockStorage = () => ({});

export const auth = mockAuth as any;
export const firestore = mockFirestore as any;
export const storage = mockStorage as any;
