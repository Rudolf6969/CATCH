import React from 'react';
import { View, Pressable, StyleSheet, type ViewStyle } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { TabIcon } from './TabIcon';
import { theme } from '@/theme/theme';

const TAB_CONFIG: Array<{
  name: string;
  href: string;
  iconName: keyof typeof Ionicons.glyphMap;
  label: string;
}> = [
  { name: 'feed', href: '/(tabs)/feed', iconName: 'home-outline', label: 'Feed' },
  { name: 'podmienky', href: '/(tabs)/podmienky', iconName: 'cloud-outline', label: 'Podmienky' },
  { name: 'dennik', href: '/(tabs)/dennik', iconName: 'book-outline', label: 'Dennik' },
  { name: 'bazar', href: '/(tabs)/bazar', iconName: 'storefront-outline', label: 'Bazar' },
];

export function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const tabs = TAB_CONFIG;

  return (
    <View style={[styles.tabList, { paddingBottom: insets.bottom + 8 }]}>
      {/* Feed + Podmienky (lava strana) */}
      {tabs.slice(0, 2).map((tab) => {
        const routeIndex = state.routes.findIndex((r) => r.name === tab.name);
        const isFocused = state.index === routeIndex;
        return (
          <Pressable
            key={tab.name}
            style={styles.tab}
            onPress={() => navigation.navigate(tab.name)}
            accessibilityRole="button"
          >
            <TabIcon name={tab.iconName} label={tab.label} focused={isFocused} />
          </Pressable>
        );
      })}

      {/* Center FAB — golden dawn gradient */}
      <View style={styles.fabContainer}>
        <Pressable
          style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
          onPress={() => router.push('/(tabs)/pridat')}
          accessibilityLabel="Pridat ulovok"
          accessibilityRole="button"
        >
          <Ionicons name="add" size={32} color={theme.colors.bg} />
        </Pressable>
      </View>

      {/* Dennik + Bazar (prava strana) */}
      {tabs.slice(2).map((tab) => {
        const routeIndex = state.routes.findIndex((r) => r.name === tab.name);
        const isFocused = state.index === routeIndex;
        return (
          <Pressable
            key={tab.name}
            style={styles.tab}
            onPress={() => navigation.navigate(tab.name)}
            accessibilityRole="button"
          >
            <TabIcon name={tab.iconName} label={tab.label} focused={isFocused} />
          </Pressable>
        );
      })}
    </View>
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
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 10,
    borderWidth: 2,
    borderColor: theme.colors.accentWarm,
  },
  fabPressed: { opacity: 0.85, transform: [{ scale: 0.96 }] },
});
