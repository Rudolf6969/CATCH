import { Stack } from 'expo-router';
import { useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import * as SplashScreen from 'expo-splash-screen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth.store';

// Splash screen ostáva viditeľný kým neinicializujeme Firebase auth
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minút
    },
  },
});

export default function RootLayout() {
  const { user, setUser, setInitialized, initialized } = useAuthStore();

  useEffect(() => {
    // onAuthStateChanged je volaný okamžite s aktuálnym stavom
    const unsubscribe = auth().onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      setInitialized(true);
    });
    return unsubscribe;
  }, [setUser, setInitialized]);

  useEffect(() => {
    if (initialized) {
      // Skryť splash keď Firebase auth je pripravený
      SplashScreen.hideAsync();
    }
  }, [initialized]);

  // Kým Firebase auth neinicializuje → renderovať null (splash zostáva viditeľný)
  if (!initialized) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Prihlásený user → tabs */}
        <Stack.Protected guard={!!user}>
          <Stack.Screen name="(tabs)" />
        </Stack.Protected>
        {/* Neprihlásený user → auth screens */}
        <Stack.Protected guard={!user}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
      </Stack>
    </QueryClientProvider>
  );
}
