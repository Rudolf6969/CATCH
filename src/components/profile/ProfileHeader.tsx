import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme/theme';
import type { UserDocument } from '../../types/user.types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BANNER_HEIGHT = 150;
const AVATAR_SIZE = 80;

interface Props {
  user: UserDocument;
  isOwnProfile: boolean;
  onEditProfile?: () => void;
}

export function ProfileHeader({ user, isOwnProfile, onEditProfile }: Props) {
  const totalWeightKg = (user.stats.totalWeightG / 1000).toFixed(1);
  const biggestKg = (user.stats.biggestCatchG / 1000).toFixed(1);

  return (
    <View>
      {/* Banner */}
      <View style={styles.banner}>
        <View style={styles.bannerBg} />
        <View style={styles.bannerOverlay} />
      </View>

      {/* Avatar row */}
      <View style={styles.avatarRow}>
        <View style={styles.avatarRing}>
          <Image
            source={user.avatarURL ? { uri: user.avatarURL } : undefined}
            placeholder={{ blurhash: user.avatarBlurhash || 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.' }}
            style={styles.avatar}
            contentFit="cover"
          />
        </View>

        {isOwnProfile ? (
          <TouchableOpacity style={styles.editBtn} onPress={onEditProfile}>
            <Text style={styles.editBtnText}>Upraviť profil</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.followActions}>
            <TouchableOpacity style={styles.followBtn}>
              <Text style={styles.followBtnText}>Sledovať</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.msgBtn}>
              <Ionicons name="chatbubble-outline" size={18} color={theme.colors.textPrimary} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Meno + username + bio */}
      <View style={styles.info}>
        <Text style={styles.displayName}>{user.displayName}</Text>
        <Text style={styles.username}>@{user.username}</Text>
        {user.bio && <Text style={styles.bio}>{user.bio}</Text>}
      </View>

      {/* Karma + badges */}
      {(user.karma > 0 || user.badges.length > 0) && (
        <View style={styles.karmaRow}>
          {user.karma > 0 && (
            <View style={styles.karmaBadge}>
              <Ionicons name="flash" size={12} color={theme.colors.accent} />
              <Text style={styles.karmaText}>{user.karma} karma</Text>
            </View>
          )}
          {user.badges.map((badge) => (
            <View key={badge} style={styles.badge}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{user.stats.catchCount}</Text>
          <Text style={styles.statLabel}>Úlovky</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{totalWeightKg}</Text>
          <Text style={styles.statLabel}>kg celkom</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{biggestKg}</Text>
          <Text style={styles.statLabel}>kg rekord</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    width: SCREEN_WIDTH,
    height: BANNER_HEIGHT,
    overflow: 'hidden',
    position: 'relative',
  },
  bannerBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0D1A12',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,212,126,0.05)',
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    marginTop: -(AVATAR_SIZE / 2 + 4),
  },
  avatarRing: {
    width: AVATAR_SIZE + 6,
    height: AVATAR_SIZE + 6,
    borderRadius: (AVATAR_SIZE + 6) / 2,
    borderWidth: 3,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.bg,
    overflow: 'hidden',
  },
  avatar: { width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: AVATAR_SIZE / 2 },
  editBtn: {
    borderWidth: 1,
    borderColor: theme.colors.cardBorderActive,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: theme.radius.full,
    marginBottom: 4,
  },
  editBtnText: { fontFamily: 'DMSans-Medium', fontSize: 13, color: theme.colors.textPrimary },
  followActions: { flexDirection: 'row', gap: 10, marginBottom: 4, alignItems: 'center' },
  followBtn: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: theme.radius.full,
  },
  followBtnText: { fontFamily: 'DMSans-SemiBold', fontSize: 14, color: theme.colors.bg },
  msgBtn: {
    borderWidth: 1,
    borderColor: theme.colors.cardBorderActive,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { paddingHorizontal: 16, marginBottom: 12 },
  displayName: { fontFamily: 'Syne-Bold', fontSize: 22, color: theme.colors.textPrimary, marginBottom: 2 },
  username: { fontFamily: 'DMSans-Regular', fontSize: 14, color: theme.colors.textSecondary, marginBottom: 8 },
  bio: { fontFamily: 'DMSans-Regular', fontSize: 14, color: theme.colors.textSecondary, lineHeight: 20 },
  karmaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, paddingHorizontal: 16, marginBottom: 12 },
  karmaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,215,0,0.12)',
    borderRadius: theme.radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  karmaText: { fontFamily: 'DMSans-Medium', fontSize: 12, color: theme.colors.accent },
  badge: {
    backgroundColor: 'rgba(0,212,126,0.12)',
    borderRadius: theme.radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: { fontFamily: 'DMSans-Medium', fontSize: 12, color: theme.colors.primary },
  statsRow: {
    flexDirection: 'row',
    paddingVertical: 14,
    borderTopWidth: 0.5,
    borderTopColor: theme.colors.divider,
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.divider,
    justifyContent: 'space-around',
  },
  statItem: { alignItems: 'center' },
  statValue: { fontFamily: 'JetBrainsMono-Regular', fontSize: 20, color: theme.colors.textPrimary },
  statLabel: { fontFamily: 'DMSans-Regular', fontSize: 11, color: theme.colors.textSecondary, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: theme.colors.divider },
});
