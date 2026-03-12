import React from 'react';
import { View, Pressable, StyleSheet, type ViewStyle } from 'react-native';
import { TabList, TabTrigger, useTabTrigger } from 'expo-router/ui';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { TabIcon } from './TabIcon';
import { theme } from '@/theme/theme';

// Wrapper komponent pre TabTrigger s focused stavom cez useTabTrigger hook
interface FocusableTabProps {
  name: string;
  href: string;
  iconName: keyof typeof Ionicons.glyphMap;
  label: string;
  style?: ViewStyle;
}

function FocusableTab({ name, href, iconName, label, style }: FocusableTabProps) {
  const { trigger } = useTabTrigger({ name, href });
  const isFocused = trigger?.isFocused ?? false;

  return (
    <TabTrigger name={name} href={href as any} style={[styles.tab, style]}>
      <TabIcon name={iconName} label={label} focused={isFocused} />
    </TabTrigger>
  );
}

export function CustomTabBar() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <TabList
      style={[
        styles.tabList,
        { paddingBottom: insets.bottom + 8 },
      ]}
    >
      <FocusableTab
        name="podmienky"
        href="/(tabs)/podmienky"
        iconName="cloud-outline"
        label="Podmienky"
      />

      <FocusableTab
        name="feed"
        href="/(tabs)/feed"
        iconName="home-outline"
        label="Feed"
      />

      {/* Center FAB — NIE TabTrigger, len naviguje na pridat modal */}
      <View style={styles.fabContainer}>
        <Pressable
          style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
          onPress={() => router.push('/(tabs)/pridat')}
          accessibilityLabel="Pridať úlovok"
          accessibilityRole="button"
        >
          <Ionicons name="add" size={32} color={theme.colors.bg} />
        </Pressable>
      </View>

      <FocusableTab
        name="dennik"
        href="/(tabs)/dennik"
        iconName="book-outline"
        label="Denník"
      />

      <FocusableTab
        name="bazar"
        href="/(tabs)/bazar"
        iconName="storefront-outline"
        label="Bazár"
      />
    </TabList>
  );
}

const styles = StyleSheet.create({
  tabList: {
    flexDirection: 'row',
    backgroundColor: theme.colors.tabBar,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.tabBorder,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
  },
  fabContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: -20,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  fabPressed: { opacity: 0.85, transform: [{ scale: 0.96 }] },
});
