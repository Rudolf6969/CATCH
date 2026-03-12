import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { useAuthStore } from '../../src/stores/auth.store';
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
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => router.push(`/profile/${user?.uid}` as any)}>
          <Image
            source={user?.photoURL ? { uri: user.photoURL } : undefined}
            placeholder={{ blurhash: 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.' }}
            style={styles.headerAvatar}
            contentFit="cover"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Catch</Text>
        <View style={styles.headerRight} />
      </View>
      <StoriesRow />
    </View>
  ), [user, insets.top]);

  const ListEmpty = useCallback(() => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyEmoji}>🎣</Text>
      <Text style={styles.emptyTitle}>Feed je prázdny</Text>
      <Text style={styles.emptyText}>
        Buď prvý — zdiel svojho úlovku komunite!
      </Text>
    </View>
  ), []);

  const ListFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.loadingMore}>
        <ActivityIndicator color="#40916C" />
      </View>
    );
  }, [isFetchingNextPage]);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#40916C" />
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
            tintColor="#40916C"
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A1628' },
  centered: { justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  headerAvatar: { width: 34, height: 34, borderRadius: 17 },
  headerTitle: { fontFamily: 'Syne-Bold', fontSize: 22, color: '#FFFFFF' },
  headerRight: { width: 34 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80, paddingHorizontal: 40 },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontFamily: 'Syne-Bold', fontSize: 22, color: '#FFFFFF', marginBottom: 8 },
  emptyText: { fontFamily: 'DMSans-Regular', fontSize: 15, color: 'rgba(255,255,255,0.5)', textAlign: 'center', lineHeight: 22 },
  loadingMore: { paddingVertical: 20, alignItems: 'center' },
});
