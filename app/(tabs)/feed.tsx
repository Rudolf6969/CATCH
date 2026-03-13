import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { useAuthStore } from '../../src/stores/auth.store';
import { theme } from '../../src/theme/theme';
import { useFeed } from '../../src/hooks/useFeed';
import { CatchCard } from '../../src/components/catch/CatchCard';
import { StoriesRow } from '../../src/components/feed/StoriesRow';
import type { CatchDocument } from '../../src/types/catch.types';

export default function FeedScreen() {
  const insets = useSafeAreaInsets();
  const user = useAuthStore(s => s.user);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    isRefetching,
  } = useFeed();

  const catches = data?.pages.flatMap(p => p.catches) ?? [];

  const renderItem = useCallback(({ item }: { item: CatchDocument }) => (
    <CatchCard catch={item} />
  ), []);

  const ListHeader = useCallback(() => (
    <View>
      {/* IG-style header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.logo}>OnlyFish</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconBtn} hitSlop={8}>
            <Ionicons name="heart-outline" size={26} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} hitSlop={8}>
            <Ionicons name="paper-plane-outline" size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>
      <StoriesRow />
    </View>
  ), [insets.top]);

  const ListEmpty = useCallback(() => (
    <View style={styles.emptyState}>
      <Ionicons name="fish-outline" size={56} color={theme.colors.textMuted} />
      <Text style={styles.emptyTitle}>Zatiaľ žiadne úlovky</Text>
      <Text style={styles.emptyText}>
        Sleduj rybárov a uvidíš ich úlovky tu.
      </Text>
    </View>
  ), []);

  const ListFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.loadingMore}>
        <ActivityIndicator color={theme.colors.primary} />
      </View>
    );
  }, [isFetchingNextPage]);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlashList
        data={catches}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        ListFooterComponent={ListFooter}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={theme.colors.primary}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  centered: { justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  logo: {
    fontFamily: 'Syne-Bold',
    fontSize: 28,
    color: theme.colors.textPrimary,
    letterSpacing: -0.5,
  },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  iconBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
    paddingHorizontal: 40,
    gap: 10,
  },
  emptyTitle: {
    fontFamily: 'Syne-Bold',
    fontSize: 18,
    color: theme.colors.textPrimary,
  },
  emptyText: {
    fontFamily: 'DMSans-Regular',
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  loadingMore: { paddingVertical: 20, alignItems: 'center' },
});
