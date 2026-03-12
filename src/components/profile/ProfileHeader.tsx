import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import type { UserDocument } from '../../types/user.types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BANNER_HEIGHT = 120;
const AVATAR_SIZE = 72;

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
      {/* Banner — default forest gradient */}
      <View style={styles.banner}>
        <View style={styles.bannerGradient} />
      </View>

      {/* Avatar overlaid na spodnom okraji bannera */}
      <View style={styles.avatarContainer}>
        <Image
          source={user.avatarURL ? { uri: user.avatarURL } : undefined}
          placeholder={{ blurhash: user.avatarBlurhash || 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.' }}
          style={styles.avatar}
          contentFit="cover"
        />
      </View>

      {/* Edit button — len vlastný profil */}
      {isOwnProfile && (
        <TouchableOpacity style={styles.editBtn} onPress={onEditProfile}>
          <Text style={styles.editBtnText}>Upraviť profil</Text>
        </TouchableOpacity>
      )}

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
              <Text style={styles.karmaText}>⚡ {user.karma} karma</Text>
            </View>
          )}
          {user.badges.map((badge) => (
            <View key={badge} style={styles.badge}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Stats riadok */}
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
  },
  bannerGradient: {
    flex: 1,
    backgroundColor: '#1B4332',
  },
  avatarContainer: {
    marginTop: -(AVATAR_SIZE / 2),
    marginLeft: 16,
    width: AVATAR_SIZE + 4,
    height: AVATAR_SIZE + 4,
    borderRadius: (AVATAR_SIZE + 4) / 2,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
    backgroundColor: '#0A1628',
  },
  avatar: { width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: AVATAR_SIZE / 2 },
  editBtn: {
    position: 'absolute',
    right: 16,
    top: BANNER_HEIGHT + 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
  },
  editBtnText: { fontFamily: 'DMSans-Medium', fontSize: 13, color: '#FFFFFF' },
  info: { paddingHorizontal: 16, marginTop: 44, marginBottom: 12 },
  displayName: { fontFamily: 'Syne-Bold', fontSize: 22, color: '#FFFFFF', marginBottom: 2 },
  username: { fontFamily: 'DMSans-Regular', fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 8 },
  bio: { fontFamily: 'DMSans-Regular', fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 20 },
  karmaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, paddingHorizontal: 16, marginBottom: 12 },
  karmaBadge: { backgroundColor: 'rgba(233,168,76,0.15)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  karmaText: { fontFamily: 'DMSans-Medium', fontSize: 12, color: '#E9A84C' },
  badge: { backgroundColor: 'rgba(64,145,108,0.15)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { fontFamily: 'DMSans-Medium', fontSize: 12, color: '#40916C' },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
    justifyContent: 'space-around',
  },
  statItem: { alignItems: 'center' },
  statValue: { fontFamily: 'JetBrainsMono-Regular', fontSize: 18, color: '#FFFFFF' },
  statLabel: { fontFamily: 'DMSans-Regular', fontSize: 11, color: 'rgba(255,255,255,0.5)' },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.1)' },
});
