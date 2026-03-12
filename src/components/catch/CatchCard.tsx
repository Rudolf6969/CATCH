import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { CatchCarousel } from './CatchCarousel';
import { FishBadge } from './FishBadge';
import { useFeedStore } from '../../stores/feed.store';
import type { CatchDocument } from '../../types/catch.types';

interface Props {
  catch: CatchDocument;
}

export function CatchCard({ catch: item }: Props) {
  const { likedCatchIds, bookmarkedCatchIds, toggleLike, toggleBookmark } = useFeedStore();
  const isLiked = likedCatchIds.has(item.id);
  const isBookmarked = bookmarkedCatchIds.has(item.id);

  const goToProfile = () => {
    router.push(`/profile/${item.userId}` as any);
  };

  const goToDetail = () => {
    router.push(`/catch/${item.id}` as any);
  };

  return (
    <View style={styles.card}>
      {/* Header: Avatar + meno + lokalita */}
      <TouchableOpacity style={styles.header} onPress={goToProfile} activeOpacity={0.8}>
        <Image
          source={{ uri: item.userAvatar || undefined }}
          placeholder={{ blurhash: 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.' }}
          style={styles.avatar}
          contentFit="cover"
        />
        <View style={styles.headerText}>
          <Text style={styles.userName}>{item.userDisplayName}</Text>
          {item.locationName && (
            <Text style={styles.location}>{item.locationName}</Text>
          )}
        </View>
        <Text style={styles.timeAgo}>
          {formatTimeAgo(item.createdAt?.toDate?.())}
        </Text>
      </TouchableOpacity>

      {/* Foto / Carousel */}
      <TouchableOpacity onPress={goToDetail} activeOpacity={0.95}>
        <CatchCarousel photos={item.photos} />
      </TouchableOpacity>

      {/* Action bar: Like / Komentár / Bookmark */}
      <View style={styles.actionBar}>
        <View style={styles.leftActions}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => toggleLike(item.id)}>
            <Text style={[styles.actionIcon, isLiked && styles.likedIcon]}>
              {isLiked ? '❤️' : '🤍'}
            </Text>
            <Text style={styles.actionCount}>{item.likes + (isLiked ? 1 : 0)}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={goToDetail}>
            <Text style={styles.actionIcon}>💬</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.actionBtn} onPress={() => toggleBookmark(item.id)}>
          <Text style={[styles.actionIcon, isBookmarked && styles.bookmarkedIcon]}>
            {isBookmarked ? '🔖' : '🏷️'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Fish badge + caption POD fotkou */}
      <View style={styles.content}>
        <FishBadge
          species={item.species}
          weightG={item.weightG}
          lengthCm={item.lengthCm}
        />
        {item.caption && (
          <Text style={styles.caption} numberOfLines={3}>
            <Text style={styles.captionUser}>{item.userDisplayName} </Text>
            {item.caption}
          </Text>
        )}
      </View>
    </View>
  );
}

function formatTimeAgo(date?: Date): string {
  if (!date) return '';
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'práve teraz';
  if (diffMin < 60) return `${diffMin}m`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}h`;
  return `${Math.floor(diffH / 24)}d`;
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#0A1628', marginBottom: 8 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
  },
  avatar: { width: 36, height: 36, borderRadius: 18 },
  headerText: { flex: 1 },
  userName: { fontFamily: 'DMSans-Medium', fontSize: 14, color: '#FFFFFF' },
  location: { fontFamily: 'DMSans-Regular', fontSize: 12, color: 'rgba(255,255,255,0.5)' },
  timeAgo: { fontFamily: 'DMSans-Regular', fontSize: 12, color: 'rgba(255,255,255,0.4)' },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  leftActions: { flexDirection: 'row', gap: 16 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  actionIcon: { fontSize: 22 },
  likedIcon: {},
  bookmarkedIcon: {},
  actionCount: { fontFamily: 'DMSans-Regular', fontSize: 13, color: 'rgba(255,255,255,0.7)' },
  content: { paddingHorizontal: 14, paddingBottom: 12, gap: 4 },
  caption: { fontFamily: 'DMSans-Regular', fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 20 },
  captionUser: { fontFamily: 'DMSans-Medium', color: '#FFFFFF' },
});
