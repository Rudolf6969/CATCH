import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '@/theme/theme';

const STATS = [
  { value: '23', label: 'Tento rok' },
  { value: '12.5kg', label: 'Najväčší' },
  { value: 'Kapor', label: 'Obľúbený' },
];

const FILTERS = ['Všetko', 'Kapor', 'Šťuka', 'Amur', 'Lieň', 'Pleskáč'];

const CATCHES = [
  {
    id: '1',
    fish: 'Kapor',
    weight: '8.2kg',
    location: 'Jazero Senec',
    date: '10.03.2026',
    seed: 'catch1',
    record: false,
  },
  {
    id: '2',
    fish: 'Šťuka',
    weight: '4.1kg',
    location: 'Rieka Dunaj',
    date: '08.03.2026',
    seed: 'catch2',
    record: false,
  },
  {
    id: '3',
    fish: 'Amur',
    weight: '12.5kg',
    location: 'VN Gabčíkovo',
    date: '05.03.2026',
    seed: 'catch3',
    record: true,
  },
  {
    id: '4',
    fish: 'Lieň',
    weight: '1.8kg',
    location: 'Malý Dunaj',
    date: '01.03.2026',
    seed: 'catch4',
    record: false,
  },
  {
    id: '5',
    fish: 'Kapor',
    weight: '6.3kg',
    location: 'Oravská priehrada',
    date: '25.02.2026',
    seed: 'catch5',
    record: false,
  },
];

export default function DennikScreen() {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState('Všetko');

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Môj denník</Text>
        <Text style={styles.subtitle}>47 úlovkov celkom</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        {STATS.map((stat) => (
          <View key={stat.label} style={styles.statCard}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersRow}
        style={styles.filtersScroll}
      >
        {FILTERS.map((filter) => {
          const isActive = filter === activeFilter;
          return (
            <Pressable
              key={filter}
              onPress={() => setActiveFilter(filter)}
              style={[
                styles.chip,
                isActive ? styles.chipActive : styles.chipInactive,
              ]}
            >
              <Text style={[
                styles.chipText,
                isActive ? styles.chipTextActive : styles.chipTextInactive,
              ]}>
                {filter}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Catches list */}
      <View style={styles.catchesList}>
        {CATCHES.map((c) => (
          <View key={c.id} style={styles.catchRow}>
            <Image
              source={{ uri: `https://picsum.photos/seed/${c.seed}/100/100` }}
              style={styles.catchThumb}
            />
            <View style={styles.catchInfo}>
              <View style={styles.catchTopRow}>
                <Text style={styles.catchFish}>{c.fish}</Text>
                {c.record && (
                  <View style={styles.recordBadge}>
                    <Text style={styles.recordText}>🏆 Osobný rekord</Text>
                  </View>
                )}
              </View>
              <Text style={styles.catchMeta}>📍 {c.location} • {c.date}</Text>
            </View>
            <View style={styles.catchRight}>
              <Text style={styles.catchWeight}>{c.weight}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  content: {
    paddingBottom: 100,
  },

  // Header
  header: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  title: {
    ...(theme.typography.headingLg as object),
    color: theme.colors.textPrimary,
  },
  subtitle: {
    fontFamily: 'DMSans-Regular',
    fontSize: 14,
    color: theme.colors.textMuted,
    marginTop: 2,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontFamily: 'JetBrainsMono-Regular',
    fontSize: 22,
    color: theme.colors.accent,
  },
  statLabel: {
    fontFamily: 'DMSans-Regular',
    fontSize: 11,
    color: theme.colors.textMuted,
  },

  // Filters
  filtersScroll: {
    marginBottom: 16,
  },
  filtersRow: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  chipActive: {
    backgroundColor: theme.colors.accent,
  },
  chipInactive: {
    backgroundColor: theme.colors.surface,
  },
  chipText: {
    fontFamily: 'DMSans-Medium',
    fontSize: 13,
  },
  chipTextActive: {
    color: theme.colors.bg,
  },
  chipTextInactive: {
    color: theme.colors.textMuted,
  },

  // Catches
  catchesList: {
    paddingHorizontal: 16,
  },
  catchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  catchThumb: {
    width: 56,
    height: 56,
    borderRadius: 10,
  },
  catchInfo: {
    flex: 1,
    marginLeft: 12,
    gap: 4,
  },
  catchTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  catchFish: {
    fontFamily: 'DMSans-Medium',
    fontSize: 15,
    color: theme.colors.textPrimary,
  },
  recordBadge: {
    backgroundColor: 'rgba(233,168,76,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  recordText: {
    fontFamily: 'DMSans-Medium',
    fontSize: 11,
    color: theme.colors.accent,
  },
  catchMeta: {
    fontFamily: 'DMSans-Regular',
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  catchRight: {
    alignItems: 'flex-end',
  },
  catchWeight: {
    fontFamily: 'JetBrainsMono-Regular',
    fontSize: 16,
    color: theme.colors.accent,
  },
});
