import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../../src/theme/theme';
import { CatchCard } from '../../src/components/catch/CatchCard';
import { StoriesRow } from '../../src/components/feed/StoriesRow';
import type { CatchDocument } from '../../src/types/catch.types';

const DEMO_CATCHES: CatchDocument[] = [
  {
    id: 'demo1',
    userId: 'user1',
    userDisplayName: 'Martin Kovac',
    userAvatar: 'https://i.pravatar.cc/150?img=11',
    species: 'Kapor rybnicny',
    weightG: 8500,
    lengthCm: 72,
    photos: [{ downloadURL: 'https://images.pexels.com/photos/5538270/pexels-photo-5538270.jpeg?auto=compress&cs=tinysrgb&w=800', blurhash: 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.', filename: '1.jpg' }],
    locationName: 'VN Senec',
    locationGPS: { latitude: 48.22, longitude: 17.4 },
    caption: 'Ranny zatah na boilies 20mm, kapor sa dal 25 minut!',
    likes: 47,
    likedBy: [],
    isPublic: true,
    method: 'Feeder',
    bait: 'Boilies 20mm',
    weather: { temperature: 18, pressure: 1013, windSpeed: 8, precipitation: 0, moonPhase: 'Spln', moonIllumination: 95 },
    createdAt: { toDate: () => new Date(Date.now() - 3600000 * 2) } as any,
    updatedAt: { toDate: () => new Date(Date.now() - 3600000 * 2) } as any,
  },
  {
    id: 'demo2',
    userId: 'user2',
    userDisplayName: 'Peter Novak',
    userAvatar: 'https://i.pravatar.cc/150?img=12',
    species: 'Stuka severna',
    weightG: 4200,
    lengthCm: 85,
    photos: [{ downloadURL: 'https://images.pexels.com/photos/17213802/pexels-photo-17213802.jpeg?auto=compress&cs=tinysrgb&w=800', blurhash: 'L5H2EC=PM+yV0g-mq.wG9c010J}I', filename: '1.jpg' }],
    locationName: 'Dunaj - Bratislava',
    locationGPS: { latitude: 48.14, longitude: 17.11 },
    caption: 'Privlac na wobler, stuka z Dunaja!',
    likes: 89,
    likedBy: [],
    isPublic: true,
    method: 'Privlac',
    bait: 'Wobler',
    weather: { temperature: 14, pressure: 1020, windSpeed: 12, precipitation: 0, moonPhase: 'Prva stvrt', moonIllumination: 50 },
    createdAt: { toDate: () => new Date(Date.now() - 3600000 * 5) } as any,
    updatedAt: { toDate: () => new Date(Date.now() - 3600000 * 5) } as any,
  },
  {
    id: 'demo3',
    userId: 'user3',
    userDisplayName: 'Tomas Horvath',
    userAvatar: 'https://i.pravatar.cc/150?img=33',
    species: 'Zubac velkousty',
    weightG: 3100,
    lengthCm: 62,
    photos: [{ downloadURL: 'https://images.pexels.com/photos/13740880/pexels-photo-13740880.jpeg?auto=compress&cs=tinysrgb&w=800', blurhash: 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.', filename: '1.jpg' }],
    locationName: 'VN Zemplinska Sirava',
    locationGPS: { latitude: 48.78, longitude: 21.77 },
    caption: 'Vecerny lov, zubac na zivu rybku. Nadherny boj!',
    likes: 124,
    likedBy: [],
    isPublic: true,
    method: 'Privlac',
    bait: 'Ziva rybka',
    weather: { temperature: 22, pressure: 1008, windSpeed: 5, precipitation: 0, moonPhase: 'Spln', moonIllumination: 100 },
    createdAt: { toDate: () => new Date(Date.now() - 3600000 * 8) } as any,
    updatedAt: { toDate: () => new Date(Date.now() - 3600000 * 8) } as any,
  },
  {
    id: 'demo4',
    userId: 'user4',
    userDisplayName: 'Jana Mihalikova',
    userAvatar: 'https://i.pravatar.cc/150?img=26',
    species: 'Pstruh potocny',
    weightG: 1200,
    lengthCm: 38,
    photos: [{ downloadURL: 'https://images.pexels.com/photos/14438493/pexels-photo-14438493.jpeg?auto=compress&cs=tinysrgb&w=800', blurhash: 'L5H2EC=PM+yV0g-mq.wG9c010J}I', filename: '1.jpg' }],
    locationName: 'Bela - Liptov',
    locationGPS: { latitude: 49.08, longitude: 19.58 },
    caption: 'Muska na horskej rieke, cisty pstruh!',
    likes: 213,
    likedBy: [],
    isPublic: true,
    method: 'Muska',
    bait: 'Muska',
    weather: { temperature: 11, pressure: 1025, windSpeed: 3, precipitation: 0, moonPhase: 'Nov', moonIllumination: 2 },
    createdAt: { toDate: () => new Date(Date.now() - 3600000 * 12) } as any,
    updatedAt: { toDate: () => new Date(Date.now() - 3600000 * 12) } as any,
  },
  {
    id: 'demo5',
    userId: 'user5',
    userDisplayName: 'Marek Kucera',
    userAvatar: 'https://i.pravatar.cc/150?img=53',
    species: 'Sumec velky',
    weightG: 15800,
    lengthCm: 142,
    photos: [{ downloadURL: 'https://images.pexels.com/photos/2431454/pexels-photo-2431454.jpeg?auto=compress&cs=tinysrgb&w=800', blurhash: 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.', filename: '1.jpg' }],
    locationName: 'Vah - Piestany',
    locationGPS: { latitude: 48.59, longitude: 17.83 },
    caption: 'Nocny lov, sumec na pelety. 15.8kg osobny rekord!!',
    likes: 342,
    likedBy: [],
    isPublic: true,
    method: 'Feeder',
    bait: 'Pelety',
    weather: { temperature: 20, pressure: 1010, windSpeed: 2, precipitation: 0, moonPhase: 'Posledna stvrt', moonIllumination: 45 },
    createdAt: { toDate: () => new Date(Date.now() - 3600000 * 24) } as any,
    updatedAt: { toDate: () => new Date(Date.now() - 3600000 * 24) } as any,
  },
];

export default function FeedScreen() {
  const insets = useSafeAreaInsets();

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

  return (
    <View style={styles.container}>
      <FlatList
        data={DEMO_CATCHES}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={ListHeader}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  logo: {
    fontFamily: 'Outfit-Bold',
    fontSize: 26,
    color: theme.colors.textPrimary,
    letterSpacing: -0.5,
  },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  iconBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
});
