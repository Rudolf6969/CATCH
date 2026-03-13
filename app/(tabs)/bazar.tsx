import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/theme/theme';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const CATEGORIES = ['Všetko', 'Prúty', 'Navijaky', 'Bižutéria', 'Stany', 'Nástrahy'];

const LISTINGS = [
  {
    id: '1',
    title: 'Shimano Alivio DX 3.6m',
    category: 'Prúty',
    price: '89 €',
    condition: 'Veľmi dobrý',
    seller: 'Marek K.',
    location: 'Bratislava',
    photoColor: '#1A2A1F',
  },
  {
    id: '2',
    title: 'Daiwa Crosscast 5000',
    category: 'Navijaky',
    price: '65 €',
    condition: 'Nový',
    seller: 'Peter N.',
    location: 'Košice',
    photoColor: '#182015',
  },
  {
    id: '3',
    title: 'Fox Retreat+ 2-man bivak',
    category: 'Stany',
    price: '340 €',
    condition: 'Dobrý',
    seller: 'Jana H.',
    location: 'Nitra',
    photoColor: '#1A2218',
  },
  {
    id: '4',
    title: 'Korda Lead Clip System 10ks',
    category: 'Bižutéria',
    price: '12 €',
    condition: 'Nový',
    seller: 'Tomáš B.',
    location: 'Trenčín',
    photoColor: '#151E13',
  },
];

export default function BazarScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + theme.spacing.lg }]}
    >
      <View style={styles.headerRow}>
        <Text style={styles.title}>Bazár</Text>
        <Badge label="4 nové" variant="accent" size="sm" />
      </View>

      {/* Category pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
        {CATEGORIES.map((cat, i) => (
          <Pressable key={cat} style={[styles.catPill, i === 0 && styles.catPillActive]}>
            <Text style={[styles.catText, i === 0 && styles.catTextActive]}>{cat}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Listing grid */}
      <View style={styles.listingGrid}>
        {LISTINGS.map((item) => (
          <Card key={item.id} style={styles.listingCard}>
            {/* Photo placeholder */}
            <View style={[styles.listingPhoto, { backgroundColor: item.photoColor }]}>
              <Ionicons name="image-outline" size={24} color={theme.colors.textMuted} style={{ opacity: 0.3 }} />
            </View>

            <View style={styles.listingInfo}>
              <Text style={styles.listingTitle} numberOfLines={2}>{item.title}</Text>
              <Text style={styles.listingPrice}>{item.price}</Text>
              <View style={styles.listingMeta}>
                <Badge
                  label={item.condition}
                  variant={item.condition === 'Nový' ? 'primary' : 'neutral'}
                  size="sm"
                />
              </View>
              <View style={styles.listingSellerRow}>
                <Ionicons name="person-outline" size={11} color={theme.colors.textMuted} />
                <Text style={styles.listingSellerText}>{item.seller}</Text>
                <Text style={styles.listingDot}>·</Text>
                <Text style={styles.listingSellerText}>{item.location}</Text>
              </View>
            </View>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  content: { padding: theme.spacing.lg, gap: theme.spacing.lg },

  // Header
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { ...(theme.typography.headingLg as object), color: theme.colors.textPrimary },

  // Categories
  catScroll: { gap: theme.spacing.sm },
  catPill: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    backgroundColor: theme.colors.surface,
  },
  catPillActive: {
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(82,183,136,0.12)',
  },
  catText: { ...(theme.typography.bodySmMedium as object), color: theme.colors.textMuted },
  catTextActive: { color: theme.colors.primary },

  // Listing grid (2 columns)
  listingGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
  listingCard: { flex: 1, minWidth: '45%', padding: 0, overflow: 'hidden' },
  listingPhoto: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
  },
  listingInfo: { padding: theme.spacing.sm + 2, gap: 6 },
  listingTitle: { ...(theme.typography.bodySmMedium as object), color: theme.colors.textPrimary },
  listingPrice: { ...(theme.typography.mono as object), color: theme.colors.accent, fontSize: 16 },
  listingMeta: { flexDirection: 'row', gap: theme.spacing.xs },
  listingSellerRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  listingSellerText: { ...(theme.typography.caption as object), color: theme.colors.textMuted, fontSize: 10 },
  listingDot: { color: theme.colors.textMuted, fontSize: 8 },
});
