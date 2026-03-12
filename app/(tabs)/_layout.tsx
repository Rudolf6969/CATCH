import { Tabs, TabSlot } from 'expo-router/ui';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CustomTabBar } from '@/components/tabs/CustomTabBar';
import { theme } from '@/theme/theme';
import { StyleSheet } from 'react-native';

export default function TabLayout() {
  return (
    <SafeAreaProvider>
      <Tabs style={styles.tabs}>
        <TabSlot />
        <CustomTabBar />
      </Tabs>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  tabs: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
});
