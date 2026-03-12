const mockUser = {
  uid: 'test-uid-123',
  email: 'test@catchapp.sk',
  emailVerified: false,
  sendEmailVerification: jest.fn().mockResolvedValue(undefined),
};

const mockAuth = {
  currentUser: null as typeof mockUser | null,
  signInWithEmailAndPassword: jest.fn().mockResolvedValue({ user: mockUser }),
  createUserWithEmailAndPassword: jest.fn().mockResolvedValue({ user: mockUser }),
  signOut: jest.fn().mockResolvedValue(undefined),
  sendPasswordResetEmail: jest.fn().mockResolvedValue(undefined),
  onAuthStateChanged: jest.fn((callback: (user: typeof mockUser | null) => void) => {
    // Simulovať okamžitý callback s null (neprihlásený)
    setTimeout(() => callback(null), 0);
    return jest.fn(); // unsubscribe funkcia
  }),
};

const authModule = jest.fn(() => mockAuth);
(authModule as any).default = authModule;

// Export named + default
module.exports = authModule;
module.exports.default = authModule;

export { mockUser, mockAuth };
export default authModule;
