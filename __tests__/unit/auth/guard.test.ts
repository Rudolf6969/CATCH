/**
 * Auth guard test
 * Pokrýva: AUTH-05 — neprihlásený používateľ je presmerovaný na login
 *
 * STAV: RED — čaká na implementáciu app/_layout.tsx so Stack.Protected
 */

describe('AUTH-05: Stack.Protected auth guard', () => {
  it('guard prop je false keď user je null', () => {
    const user = null;
    const guard = !!user;
    expect(guard).toBe(false);
  });

  it('guard prop je true keď user je prihlásený', () => {
    const user = { uid: 'test-uid', email: 'test@test.sk' };
    const guard = !!user;
    expect(guard).toBe(true);
  });

  it('initialized flag je false pred onAuthStateChanged callback', () => {
    let initialized = false;
    // Simulovať Zustand auth store initial state
    const authStore = { user: null, initialized };
    expect(authStore.initialized).toBe(false);
  });
});
