import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { CatchCarousel } from './CatchCarousel';
import { FishBadge } from './FishBadge';
import { useFeedStore } from '../../stores/feed.store';
import { theme } from '../../theme/theme';
import type { CatchDocument } from '../../types/catch.types';

interface Props {
  catch: CatchDocument;
}

export function CatchCard({ catch: item }: Props) {
  const { likedCatchIds, bookmarkedCatchIds, toggleLike, toggleBookmark } = useFeedStore();
  const isLiked = likedCatchIds.has(item.id);
  const isBookmarked = bookmarkedCatchIds.has(item.id);

  const goToProfile = () => router.push(`/profile/${item.userId}` as any);
  const goToDetail = () => router.push(`/catch/${item.id}` as any);

  return (
    <View style={styles.card}>
      {/* Header */}
      <TouchableOpacity style={styles.header} onPress={goToProfile} activeOpacity={0.8}>
        <View style={styles.avatarRing}>
          <Image
            source={{ uri: item.userAvatar || undefined }}
            placeholder={{ blurhash: 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.' }}
            style={styles.avatar}
            contentFit="cover"
          />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.userName}>{item.userDisplayName}</Text>
          {item.locationName && (
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={11} color={theme.colors.primaryMid} />
              <Text style={styles.location}>{item.locationName}</Text>
            </View>
          )}
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.timeAgo}>{formatTimeAgo(item.createdAt?.toDate?.())}</Text>
          <Ionicons name="ellipsis-horizontal" size={18} color={theme.colors.textMuted} />
        </View>
      </TouchableOpacity>

      {/* Foto */}
      <TouchableOpacity onPress={goToDetail} activeOpacity={0.97}>
        <CatchCarousel photos={item.photos} />
      </TouchableOpacity>

      {/* Action bar */}
      <View style={styles.actionBar}>
        <View style={styles.leftActions}>
          <Pressable
            style={styles.actionBtn}
            onPress={() => toggleLike(item.id)}
            hitSlop={8}
          >
            <Ionicons
              name={isLiked ? 'heart' : 'heart-outline'}
              size={26}
              color={isLiked ? '#FF3B5C' : theme.colors.textPrimary}
            />
            {(item.likes + (isLiked ? 1 : 0)) > 0 && (
              <Text style={styles.actionCount}>{item.likes + (isLiked ? 1 : 0)}</Text>
            )}
          </Pressable>

          <Pressable style={styles.actionBtn} onPress={goToDetail} hitSlop={8}>
            <Ionicons name="chatbubble-outline" size={24} color={theme.colors.textPrimary} />
          </Pressable>

          <Pressable style={styles.actionBtn} hitSlop={8}>
            <Ionicons name="paper-plane-outline" size={24} color={theme.colors.textPrimary} />
          </Pressable>
        </View>

        <Pressable onPress={() => toggleBookmark(item.id)} hitSlop={8}>
          <Ionicons
            name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
            size={24}
            color={isBookmarked ? theme.colors.accent : theme.colors.textPrimary}
          />
        </Pressable>
      </View>

      {/* Obsah */}
      <View style={styles.content}>
        <FishBadge species={item.species} weightG={item.weightG} lengthCm={item.lengthCm} />
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
  card: {
    backgroundColor: theme.colors.bg,
    marginBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
  },
  avatarRing: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: theme.colors.primaryMid,
    padding: 2,
  },
  avatar: { width: 34, height: 34, borderRadius: 17 },
  headerText: { flex: 1 },
  userName: { fontFamily: 'DMSans-SemiBold', fontSize: 14, color: theme.colors.textPrimary },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 1 },
  location: { fontFamily: 'DMSans-Regular', fontSize: 11, color: theme.colors.primaryMid },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  timeAgo: { fontFamily: 'DMSans-Regular', fontSize: 11, color: theme.colors.textMuted },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 6,
  },
  leftActions: { flexDirection: 'row', alignItems: 'center', gap: 18 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  actionCount: {
    fontFamily: 'DMSans-Medium',
    fontSize: 13,
    color: theme.colors.textPrimary,
  },
  content: { paddingHorizontal: 14, paddingBottom: 14, gap: 6 },
  caption: {
    fontFamily: 'DMSans-Regular',
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  captionUser: { fontFamily: 'DMSans-SemiBold', color: theme.colors.textPrimary },
});
