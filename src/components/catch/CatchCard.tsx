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
      {/* Header — IG style */}
      <TouchableOpacity style={styles.header} onPress={goToProfile} activeOpacity={0.7}>
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
            <Text style={styles.location}>{item.locationName}</Text>
          )}
        </View>
        <Pressable hitSlop={12}>
          <Ionicons name="ellipsis-horizontal" size={20} color={theme.colors.textPrimary} />
        </Pressable>
      </TouchableOpacity>

      {/* Full-width photo */}
      <TouchableOpacity onPress={goToDetail} activeOpacity={0.98}>
        <CatchCarousel photos={item.photos} />
      </TouchableOpacity>

      {/* Action bar — IG layout */}
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
              color={isLiked ? theme.colors.likeRed : theme.colors.textPrimary}
            />
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
            color={theme.colors.textPrimary}
          />
        </Pressable>
      </View>

      {/* Like count */}
      {(item.likes + (isLiked ? 1 : 0)) > 0 && (
        <Text style={styles.likeCount}>
          {item.likes + (isLiked ? 1 : 0)} páči sa
        </Text>
      )}

      {/* Content */}
      <View style={styles.content}>
        <FishBadge species={item.species} weightG={item.weightG} lengthCm={item.lengthCm} />
        {item.caption && (
          <Text style={styles.caption} numberOfLines={3}>
            <Text style={styles.captionUser}>{item.userDisplayName} </Text>
            {item.caption}
          </Text>
        )}
        <Text style={styles.timeAgo}>{formatTimeAgo(item.createdAt?.toDate?.())}</Text>
      </View>
    </View>
  );
}

function formatTimeAgo(date?: Date): string {
  if (!date) return '';
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'práve teraz';
  if (diffMin < 60) return `pred ${diffMin} min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `pred ${diffH} h`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 7) return `pred ${diffD} d`;
  return `pred ${Math.floor(diffD / 7)} týž`;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.bg,
    marginBottom: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
  },
  avatarRing: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
    padding: 1.5,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  headerText: { flex: 1 },
  userName: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 13,
    color: theme.colors.textPrimary,
  },
  location: {
    fontFamily: 'DMSans-Regular',
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginTop: 1,
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 4,
  },
  leftActions: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  actionBtn: { padding: 2 },
  likeCount: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 13,
    color: theme.colors.textPrimary,
    paddingHorizontal: 14,
    marginTop: 4,
  },
  content: { paddingHorizontal: 14, paddingBottom: 12, gap: 4, marginTop: 4 },
  caption: {
    fontFamily: 'DMSans-Regular',
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  captionUser: {
    fontFamily: 'DMSans-SemiBold',
    color: theme.colors.textPrimary,
  },
  timeAgo: {
    fontFamily: 'DMSans-Regular',
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 4,
  },
});
