import { Tabs } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CustomTabBar } from '@/components/tabs/CustomTabBar';
import { theme } from '@/theme/theme';

export default function TabLayout() {
  return (
    <SafeAreaProvider>
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          sceneStyle: { backgroundColor: theme.colors.bg },
        }}
      >
        <Tabs.Screen name="index" options={{ href: null }} />
        <Tabs.Screen name="feed" />
        <Tabs.Screen name="podmienky" />
        <Tabs.Screen name="pridat" />
        <Tabs.Screen name="dennik" />
        <Tabs.Screen name="bazar" />
      </Tabs>
    </SafeAreaProvider>
  );
}
