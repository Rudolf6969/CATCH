import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { theme } from '../../src/theme/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2;

const CATEGORIES = ['Vsetko', 'Pruty', 'Navijaky', 'Bizuteria', 'Stany', 'Prislusenstvo', 'Nastrahy'];

const DEMO_LISTINGS = [
  { id: '1', title: 'Shimano Alivio DX 3.6m', category: 'Pruty', price: '89', condition: 'Velmi dobry', seller: 'Marek K.', location: 'Bratislava', photo: 'https://picsum.photos/seed/rod1/400/400' },
  { id: '2', title: 'Daiwa Crosscast 5000', category: 'Navijaky', price: '65', condition: 'Novy', seller: 'Peter N.', location: 'Kosice', photo: 'https://picsum.photos/seed/reel1/400/400' },
  { id: '3', title: 'Fox Retreat+ 2-man bivak', category: 'Stany', price: '340', condition: 'Dobry', seller: 'Jana H.', location: 'Nitra', photo: 'https://picsum.photos/seed/tent1/400/400' },
  { id: '4', title: 'Korda Lead Clip System 10ks', category: 'Bizuteria', price: '12', condition: 'Novy', seller: 'Tomas B.', location: 'Trencin', photo: 'https://picsum.photos/seed/tackle1/400/400' },
  { id: '5', title: 'Carp Spirit Magnum 12ft', category: 'Pruty', price: '145', condition: 'Ako novy', seller: 'Radek M.', location: 'Zilina', photo: 'https://picsum.photos/seed/rod2/400/400' },
  { id: '6', title: 'Nash Scope Landing Net', category: 'Prislusenstvo', price: '55', condition: 'Dobry', seller: 'Lucia S.', location: 'Banska Bystrica', photo: 'https://picsum.photos/seed/net1/400/400' },
];

export default function BazarScreen() {
  const insets = useSafeAreaInsets();
  const [activeCategory, setActiveCategory] = useState('Vsetko');
  const filteredListings = activeCategory === 'Vsetko' ? DEMO_LISTINGS : DEMO_LISTINGS.filter((l) => l.category === activeCategory);

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]} showsVerticalScrollIndicator={false}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Bazar</Text>
        <Pressable style={styles.searchBtn}>
          <Ionicons name="search-outline" size={22} color={theme.colors.textPrimary} />
        </Pressable>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
        {CATEGORIES.map((cat) => (
          <Pressable key={cat} style={[styles.catPill, activeCategory === cat && styles.catPillActive]} onPress={() => setActiveCategory(cat)}>
            <Text style={[styles.catText, activeCategory === cat && styles.catTextActive]}>{cat}</Text>
          </Pressable>
        ))}
      </ScrollView>
      <View style={styles.listingGrid}>
        {filteredListings.map((item) => (
          <Pressable key={item.id} style={styles.listingCard}>
            <Image source={{ uri: item.photo }} style={styles.listingPhoto} contentFit="cover" transition={200} />
            <View style={styles.listingInfo}>
              <Text style={styles.listingTitle} numberOfLines={2}>{item.title}</Text>
              <Text style={styles.listingPrice}>{item.price} EUR</Text>
              <View style={styles.conditionBadge}><Text style={styles.conditionText}>{item.condition}</Text></View>
              <View style={styles.listingSellerRow}>
                <Ionicons name="person-outline" size={11} color={theme.colors.textSecondary} />
                <Text style={styles.listingSellerText}>{item.seller}</Text>
                <Text style={styles.listingDot}>.</Text>
                <Text style={styles.listingSellerText}>{item.location}</Text>
              </View>
            </View>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  content: { paddingBottom: 100 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 16 },
  title: { ...(theme.typography.headingLg as object), color: theme.colors.textPrimary },
  searchBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: theme.colors.surfaceHigh, alignItems: 'center', justifyContent: 'center' },
  catScroll: { paddingHorizontal: 16, gap: 8, marginBottom: 20 },
  catPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: theme.colors.divider, backgroundColor: theme.colors.bg },
  catPillActive: { borderColor: theme.colors.primary, backgroundColor: theme.colors.primary },
  catText: { ...(theme.typography.bodySmMedium as object), color: theme.colors.textSecondary },
  catTextActive: { color: '#FFFFFF' },
  listingGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 12 },
  listingCard: { width: CARD_WIDTH, backgroundColor: theme.colors.surface, borderRadius: 14, overflow: 'hidden', ...theme.shadow.sm },
  listingPhoto: { width: '100%', aspectRatio: 1 },
  listingInfo: { padding: 10, gap: 4 },
  listingTitle: { ...(theme.typography.bodySmMedium as object), color: theme.colors.textPrimary },
  listingPrice: { fontFamily: 'JetBrainsMono-Regular', fontSize: 16, color: theme.colors.primary },
  conditionBadge: { alignSelf: 'flex-start', backgroundColor: theme.colors.surfaceHigh, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  conditionText: { fontFamily: 'DMSans-Regular', fontSize: 10, color: theme.colors.textSecondary },
  listingSellerRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2 },
  listingSellerText: { ...(theme.typography.caption as object), color: theme.colors.textSecondary, fontSize: 10 },
  listingDot: { color: theme.colors.textMuted, fontSize: 8 },
});
