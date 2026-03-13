import { theme } from '../../src/theme/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
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
import { useCatches } from '../../src/hooks/useCatches';
import { useCatchesStore } from '../../src/stores/catches.store';
import type { CatchDocument, CatchFilter } from '../../src/types/catch.types';

function DennikCard({ item }: { item: CatchDocument }) {
  const weightKg = (item.weightG / 1000).toFixed(1);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/catch/${item.id}` as any)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: item.photos[0]?.downloadURL }}
        placeholder={{ blurhash: item.photos[0]?.blurhash }}
        style={styles.cardThumb}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.cardContent}>
        <Text style={styles.cardSpecies}>{item.species}</Text>
        <Text style={styles.cardWeight}>
          {weightKg} kg · {item.lengthCm} cm
        </Text>
        {item.locationName && (
          <Text style={styles.cardLocation} numberOfLines={1}>{item.locationName}</Text>
        )}
        <Text style={styles.cardDate}>
          {item.createdAt?.toDate?.()?.toLocaleDateString('sk-SK') ?? ''}
        </Text>
      </View>
      <Text style={styles.cardArrow}>›</Text>
    </TouchableOpacity>
  );
}

function FilterChips({
  filter,
  onClear,
  onOpenFilter,
}: {
  filter: CatchFilter;
  onClear: () => void;
  onOpenFilter: () => void;
}) {
  const hasFilter = !!(filter.species || filter.method || filter.dateFrom);

  return (
    <View style={styles.filterRow}>
      <TouchableOpacity style={styles.filterBtn} onPress={onOpenFilter}>
        <Text style={styles.filterBtnText}>Filtre {hasFilter ? '●' : ''}</Text>
      </TouchableOpacity>
      {hasFilter && (
        <TouchableOpacity style={styles.clearFilterBtn} onPress={onClear}>
          <Text style={styles.clearFilterText}>Zrušiť filter</Text>
        </TouchableOpacity>
      )}
      {filter.species && (
        <View style={styles.activeChip}>
          <Text style={styles.activeChipText}>{filter.species}</Text>
        </View>
      )}
      {filter.method && (
        <View style={styles.activeChip}>
          <Text style={styles.activeChipText}>{filter.method}</Text>
        </View>
      )}
    </View>
  );
}

export default function DennikScreen() {
  const insets = useSafeAreaInsets();
  const user = useAuthStore(s => s.user);
  const { filter, setFilter, clearFilter } = useCatchesStore();
  const [showFilter, setShowFilter] = useState(false);

  const { data: catches = [], isLoading, refetch, isRefetching } = useCatches(
    user?.uid ?? '',
    filter
  );

  const renderItem = ({ item }: { item: CatchDocument }) => (
    <DennikCard item={item} />
  );

  const ListHeader = () => (
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
        <Text style={styles.headerTitle}>Môj denník</Text>
        <Text style={styles.catchCount}>{catches.length} úlovkov</Text>
      </View>

      <FilterChips
        filter={filter}
        onClear={clearFilter}
        onOpenFilter={() => setShowFilter(true)}
      />
    </View>
  );

  const ListEmpty = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyEmoji}>📖</Text>
      <Text style={styles.emptyTitle}>Denník je prázdny</Text>
      <Text style={styles.emptyText}>
        Zaznamenal si ešte žiadny úlovok.{'\n'}Stlač + a pridaj svoj prvý!
      </Text>
    </View>
  );

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
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={theme.colors.primary}
          />
        }
      />

      {showFilter && (
        <View style={styles.filterSheet}>
          <Text style={styles.filterSheetTitle}>Filter úlovkov</Text>

          <Text style={styles.filterLabel}>Metóda</Text>
          {['Feeder', 'Lov na plávok', 'Prívlač', 'Muška'].map((m) => (
            <TouchableOpacity
              key={m}
              style={[styles.filterOption, filter.method === m && styles.filterOptionActive]}
              onPress={() => setFilter({ ...filter, method: filter.method === m ? undefined : m })}
            >
              <Text style={[styles.filterOptionText, filter.method === m && styles.filterOptionTextActive]}>
                {m}
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.filterCloseBtn} onPress={() => setShowFilter(false)}>
            <Text style={styles.filterCloseBtnText}>Zavrieť</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  centered: { justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceHigh,
  },
  headerAvatar: { width: 34, height: 34, borderRadius: 17 },
  headerTitle: { flex: 1, fontFamily: 'Outfit-Bold', fontSize: 22, color: theme.colors.textPrimary, marginLeft: 12 },
  catchCount: { fontFamily: 'JetBrainsMono-Regular', fontSize: 12, color: theme.colors.textMuted },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 16, paddingVertical: 10 },
  filterBtn: { borderWidth: 1, borderColor: theme.colors.divider, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6 },
  filterBtnText: { fontFamily: 'PlusJakartaSans-Medium', fontSize: 13, color: theme.colors.textPrimary },
  clearFilterBtn: { paddingHorizontal: 14, paddingVertical: 6 },
  clearFilterText: { fontFamily: 'PlusJakartaSans-Regular', fontSize: 13, color: '#E9A84C' },
  activeChip: { backgroundColor: 'rgba(64,145,108,0.2)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 },
  activeChipText: { fontFamily: 'PlusJakartaSans-Regular', fontSize: 12, color: theme.colors.primary },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceHigh,
    gap: 12,
  },
  cardThumb: { width: 64, height: 64, borderRadius: 8 },
  cardContent: { flex: 1, gap: 2 },
  cardSpecies: { fontFamily: 'PlusJakartaSans-Medium', fontSize: 15, color: theme.colors.textPrimary },
  cardWeight: { fontFamily: 'JetBrainsMono-Regular', fontSize: 13, color: theme.colors.primary },
  cardLocation: { fontFamily: 'PlusJakartaSans-Regular', fontSize: 12, color: theme.colors.textMuted },
  cardDate: { fontFamily: 'PlusJakartaSans-Regular', fontSize: 11, color: theme.colors.textMuted },
  cardArrow: { fontFamily: 'PlusJakartaSans-Regular', fontSize: 20, color: theme.colors.textMuted },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80, paddingHorizontal: 40 },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontFamily: 'Outfit-Bold', fontSize: 22, color: theme.colors.textPrimary, marginBottom: 8 },
  emptyText: { fontFamily: 'PlusJakartaSans-Regular', fontSize: 15, color: theme.colors.textMuted, textAlign: 'center', lineHeight: 22 },
  filterSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.surfaceHigh,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },
  filterSheetTitle: { fontFamily: 'Outfit-Bold', fontSize: 20, color: theme.colors.textPrimary, marginBottom: 20 },
  filterLabel: { fontFamily: 'PlusJakartaSans-Regular', fontSize: 12, color: theme.colors.textMuted, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  filterOption: { paddingVertical: 12, paddingHorizontal: 14, borderRadius: 8, marginBottom: 4 },
  filterOptionActive: { backgroundColor: 'rgba(64,145,108,0.2)' },
  filterOptionText: { fontFamily: 'PlusJakartaSans-Regular', fontSize: 15, color: theme.colors.textSecondary },
  filterOptionTextActive: { color: theme.colors.primary },
  filterCloseBtn: { marginTop: 16, backgroundColor: theme.colors.primary, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  filterCloseBtnText: { fontFamily: 'PlusJakartaSans-Medium', fontSize: 16, color: theme.colors.textPrimary },
});
