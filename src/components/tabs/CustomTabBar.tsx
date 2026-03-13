import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/theme/theme';

const TAB_CONFIG: Array<{
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconFocused: keyof typeof Ionicons.glyphMap;
}> = [
  { name: 'feed', icon: 'home-outline', iconFocused: 'home' },
  { name: 'podmienky', icon: 'search-outline', iconFocused: 'search' },
  { name: 'dennik', icon: 'book-outline', iconFocused: 'book' },
  { name: 'bazar', icon: 'storefront-outline', iconFocused: 'storefront' },
];

export function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingBottom: insets.bottom || 8 }]}>
      {/* Left tabs: Feed, Search */}
      {TAB_CONFIG.slice(0, 2).map((tab) => {
        const routeIndex = state.routes.findIndex((r) => r.name === tab.name);
        const isFocused = state.index === routeIndex;
        return (
          <Pressable
            key={tab.name}
            style={styles.tab}
            onPress={() => navigation.navigate(tab.name)}
            accessibilityRole="button"
          >
            <Ionicons
              name={isFocused ? tab.iconFocused : tab.icon}
              size={26}
              color={isFocused ? theme.colors.tabActive : theme.colors.tabInactive}
            />
          </Pressable>
        );
      })}

      {/* Center + button */}
      <Pressable
        style={({ pressed }) => [styles.addBtn, pressed && styles.addBtnPressed]}
        onPress={() => router.push('/(tabs)/pridat')}
        accessibilityLabel="Pridať úlovok"
        accessibilityRole="button"
      >
        <Ionicons name="add" size={28} color="#000000" />
      </Pressable>

      {/* Right tabs: Denník, Bazár */}
      {TAB_CONFIG.slice(2).map((tab) => {
        const routeIndex = state.routes.findIndex((r) => r.name === tab.name);
        const isFocused = state.index === routeIndex;
        return (
          <Pressable
            key={tab.name}
            style={styles.tab}
            onPress={() => navigation.navigate(tab.name)}
            accessibilityRole="button"
          >
            <Ionicons
              name={isFocused ? tab.iconFocused : tab.icon}
              size={26}
              color={isFocused ? theme.colors.tabActive : theme.colors.tabInactive}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: theme.colors.tabBar,
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: theme.colors.tabBorder,
    alignItems: 'center',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
  },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  addBtnPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
});
