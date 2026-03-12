/**
 * Auth unit testy
 * Pokrýva: AUTH-01 (register), AUTH-02 (email verif), AUTH-03 (reset), AUTH-06 (logout)
 *
 * STAV: RED — čaká na implementáciu app/(auth)/register.tsx, login.tsx, forgot-password.tsx
 */
import authModule, { mockUser, mockAuth } from '../../../__mocks__/@react-native-firebase/auth';

// Resetovať mocky pred každým testom
beforeEach(() => {
  jest.clearAllMocks();
});

describe('AUTH-01: Register s email a heslom', () => {
  it('createUserWithEmailAndPassword sa zavolá so správnymi parametrami', async () => {
    const auth = authModule();
    await auth.createUserWithEmailAndPassword('test@catchapp.sk', 'SecurePass123!');

    expect(auth.createUserWithEmailAndPassword).toHaveBeenCalledWith(
      'test@catchapp.sk',
      'SecurePass123!'
    );
  });

  it('createUserWithEmailAndPassword vráti user objekt s uid', async () => {
    const auth = authModule();
    const result = await auth.createUserWithEmailAndPassword('test@catchapp.sk', 'SecurePass123!');

    expect(result.user.uid).toBe('test-uid-123');
    expect(result.user.email).toBe('test@catchapp.sk');
  });
});

describe('AUTH-02: Email verifikácia po registrácii', () => {
  it('sendEmailVerification sa zavolá na user objekte po registrácii', async () => {
    const auth = authModule();
    const result = await auth.createUserWithEmailAndPassword('test@catchapp.sk', 'SecurePass123!');
    await result.user.sendEmailVerification();

    expect(result.user.sendEmailVerification).toHaveBeenCalledTimes(1);
  });
});

describe('AUTH-03: Reset hesla', () => {
  it('sendPasswordResetEmail sa zavolá s emailom', async () => {
    const auth = authModule();
    await auth.sendPasswordResetEmail('test@catchapp.sk');

    expect(auth.sendPasswordResetEmail).toHaveBeenCalledWith('test@catchapp.sk');
  });
});

describe('AUTH-06: Odhlásenie', () => {
  it('signOut sa zavolá bez argumentov', async () => {
    const auth = authModule();
    await auth.signOut();

    expect(auth.signOut).toHaveBeenCalledTimes(1);
  });

  it('signOut resolve bez chyby', async () => {
    const auth = authModule();
    await expect(auth.signOut()).resolves.toBeUndefined();
  });
});
